const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5_000;

export interface TurnstileVerification {
  success: boolean;
  // Códigos da Cloudflare ("timeout-or-duplicate", "invalid-input-response"...), só para os logs
  errorCodes: string[];
}

interface SiteverifyBody {
  success?: unknown;
  "error-codes"?: unknown;
}

// O token do widget vale uma única vez e por 5 minutos; quem confirma é a Cloudflare, nunca o navegador
export const verifyTurnstileToken = async (
  token: string,
  secret: string,
  remoteIp?: string,
  fetcher: typeof fetch = fetch,
): Promise<TurnstileVerification> => {
  try {
    const response = await fetcher(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return { success: false, errorCodes: [`http-${response.status}`] };

    const body = (await response.json()) as SiteverifyBody;
    const errorCodes = Array.isArray(body["error-codes"])
      ? body["error-codes"].filter((code): code is string => typeof code === "string")
      : [];
    return { success: body.success === true, errorCodes };
  } catch {
    return { success: false, errorCodes: ["siteverify-unreachable"] };
  }
};
