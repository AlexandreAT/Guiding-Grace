import { ASK_LIMITS, ASK_RATE_LIMIT_WINDOW_MS, type GideonAskError } from "../../shared/gideon/askContract";
import { getGuideIndex } from "../../shared/gideon/guideIndex";
import { answerQuestion } from "./ask";
import { getAllowedOrigin, getCorsHeaders } from "./cors";
import { createWorkersAiProvider } from "./providers/workersAi";
import { verifyTurnstileToken } from "./turnstile";
import { parseAskRequest } from "./validation";

interface Env {
  AI: Ai;
  ALLOWED_ORIGINS: string;
  GIDEON_MODEL: string;
  // Secret (wrangler secret put / .dev.vars): sem ela o Worker não chama a IA
  TURNSTILE_SECRET_KEY?: string;
  // Limite por IP; opcional para o Worker continuar subindo sem o binding
  ASK_LIMITER?: RateLimit;
}

const json = (body: unknown, status: number, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });

const error = (code: GideonAskError["error"], status: number, headers?: Record<string, string>) =>
  json({ error: code }, status, headers);

// Métricas sem o texto da pergunta: só o desfecho de cada chamada
const logAsk = (fields: Record<string, string | number>) => {
  console.log(JSON.stringify({ event: "gideon_ask", ...fields }));
};

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const origin = getAllowedOrigin(request, env.ALLOWED_ORIGINS);

    if (request.method === "OPTIONS") {
      return origin ? new Response(null, { status: 204, headers: getCorsHeaders(origin) }) : new Response(null, { status: 403 });
    }

    if (pathname === "/health" && request.method === "GET") {
      return json({ ok: true, indexVersion: getGuideIndex().version }, 200);
    }

    if (pathname !== "/ask" || request.method !== "POST") return json({ error: "not_found" }, 404);
    if (!origin) return error("forbidden_origin", 403);

    const corsHeaders = getCorsHeaders(origin);
    const clientIp = request.headers.get("CF-Connecting-IP") ?? undefined;

    // Antes de ler o corpo: rajadas do mesmo IP param aqui, sem gastar Turnstile nem IA
    if (env.ASK_LIMITER && clientIp) {
      const { success } = await env.ASK_LIMITER.limit({ key: clientIp });
      if (!success) {
        logAsk({ httpStatus: 429, outcome: "rate_limited" });
        const retryAt = new Date(Date.now() + ASK_RATE_LIMIT_WINDOW_MS).toISOString();
        return json({ error: "rate_limited", retryAt } satisfies GideonAskError, 429, corsHeaders);
      }
    }

    const rawBody = await request.text();
    if (rawBody.length > ASK_LIMITS.bodyBytes) return error("invalid_request", 413, corsHeaders);

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return error("invalid_request", 400, corsHeaders);
    }

    const askRequest = parseAskRequest(body);
    if (!askRequest) return error("invalid_request", 400, corsHeaders);

    // Sem a secret o Worker fica fechado: o site segue com o motor local em vez de deixar a IA aberta
    if (!env.TURNSTILE_SECRET_KEY) {
      logAsk({ httpStatus: 503, outcome: "turnstile_not_configured" });
      return error("ai_unavailable", 503, corsHeaders);
    }

    const verification = askRequest.turnstileToken
      ? await verifyTurnstileToken(askRequest.turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp)
      : { success: false, errorCodes: ["missing-input-response"] };
    if (!verification.success) {
      logAsk({ httpStatus: 403, outcome: "turnstile_failed", turnstileErrors: verification.errorCodes.join(",") });
      return error("turnstile_failed", 403, corsHeaders);
    }

    const startedAt = Date.now();
    const result = await answerQuestion(askRequest, {
      index: getGuideIndex(),
      provider: createWorkersAiProvider(env.AI, env.GIDEON_MODEL),
    });

    logAsk({
      httpStatus: result.status,
      outcome: "error" in result.body ? result.body.error : `${result.body.mode}:${result.body.status}`,
      latencyMs: Date.now() - startedAt,
    });

    return json(result.body, result.status, corsHeaders);
  },
} satisfies ExportedHandler<Env>;
