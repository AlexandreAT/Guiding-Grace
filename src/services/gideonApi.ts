import type {
  GideonAskError,
  GideonAskErrorCode,
  GideonAskRequest,
  GideonAskResponse,
} from "../../shared/gideon/askContract";

const API_URL = import.meta.env.VITE_GIDEON_API_URL?.replace(/\/$/, "");
// Um pouco acima dos limites do Worker (interpretação + redação), para a resposta dele chegar antes do corte aqui
const REQUEST_TIMEOUT_MS = 22_000;

// "unreachable": o Worker nem respondeu (fora do ar, sem rede, tempo esgotado)
export type GideonApiFailure = GideonAskErrorCode | "unreachable" | "invalid_response";

export class GideonApiError extends Error {
  readonly failure: GideonApiFailure;
  readonly retryAt?: Date;

  constructor(failure: GideonApiFailure, retryAt?: string) {
    super(`Gideon indisponível: ${failure}`);
    this.failure = failure;
    const retryDate = retryAt ? new Date(retryAt) : undefined;
    this.retryAt = retryDate && !Number.isNaN(retryDate.getTime()) ? retryDate : undefined;
  }
}

export const isGideonApiConfigured = (): boolean => Boolean(API_URL);

const readError = async (response: Response): Promise<GideonApiError> => {
  try {
    const body = (await response.json()) as Partial<GideonAskError>;
    return new GideonApiError(body.error ?? "invalid_response", body.retryAt);
  } catch {
    return new GideonApiError("invalid_response");
  }
};

// Qualquer falha vira GideonApiError: quem chama usa o motor local e explica o motivo ao jogador
export const askGideonApi = async (request: GideonAskRequest): Promise<GideonAskResponse> => {
  if (!API_URL) throw new GideonApiError("unreachable");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch {
    throw new GideonApiError("unreachable");
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) throw await readError(response);

  const body = (await response.json()) as Partial<GideonAskResponse>;
  if (typeof body.message !== "string" || !Array.isArray(body.sources)) {
    throw new GideonApiError("invalid_response");
  }
  return body as GideonAskResponse;
};
