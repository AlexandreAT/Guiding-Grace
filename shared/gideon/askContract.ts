import type { GideonResponse, GideonTurn, ScreenContext } from "./types";

// Contrato entre o navegador e o Worker. O pedido nunca carrega textos do guia:
// o Worker recupera os trechos com o próprio índice e repete o Progress Guard
export interface GideonAskRequest {
  question: string;
  context: ScreenContext;
  previousSourceIds: string[];
  history: GideonTurn[];
  indexVersion: string;
  turnstileToken?: string;
}

// "ai": texto redigido pelo modelo a partir dos trechos; "local": resposta determinística do próprio motor
export type GideonAnswerMode = "ai" | "local";

export interface GideonAskResponse extends GideonResponse {
  mode: GideonAnswerMode;
}

export type GideonAskErrorCode =
  | "invalid_request"
  | "forbidden_origin"
  | "index_version_mismatch"
  | "rate_limited"
  | "turnstile_failed"
  | "ai_quota_exceeded"
  | "ai_unavailable";

export interface GideonAskError {
  error: GideonAskErrorCode;
  // Quando o Gideon volta a responder (ISO 8601), se for possível saber
  retryAt?: string;
}

// A cota gratuita do Workers AI renova à meia-noite UTC
export const getNextAiQuotaReset = (now: Date): Date =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

// Janela do limite de perguntas por IP no Worker (o Rate Limiting só aceita 10 ou 60 segundos)
export const ASK_RATE_LIMIT_WINDOW_MS = 60_000;

export const ASK_LIMITS = {
  questionLength: 300,
  // 4 trocas: a IA precisa da conversa para saber de quem "ele" ou "aquele" fala
  historyTurns: 8,
  // Respostas do Gideon entram inteiras o bastante para a IA não repetir o que já disse
  historyTextLength: 600,
  previousSources: 5,
  progressIds: 200,
  builds: 10,
  buildNameLength: 60,
  idLength: 120,
  bodyBytes: 16_000,
} as const;
