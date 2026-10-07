const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// O desafio invisível leva menos de 1 s; o limite cobre o caso raro em que a Cloudflare pede um clique
const TOKEN_TIMEOUT_MS = 15_000;

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  appearance: "always" | "execute" | "interaction-only";
  "refresh-expired": "auto" | "manual" | "never";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileWidget {
  // Token de uso único para a próxima pergunta; rejeita se o desafio falhar ou demorar demais
  takeToken: () => Promise<string>;
  remove: () => void;
}

interface TokenWaiter {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

export const isTurnstileConfigured = (): boolean => Boolean(SITE_KEY);

// O script da Cloudflare só é baixado quando o chat com IA é aberto
let scriptPromise: Promise<TurnstileApi> | undefined;
const loadTurnstile = (): Promise<TurnstileApi> => {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile indisponível")));
    script.onerror = () => {
      // Bloqueado por rede ou extensão: a próxima abertura do chat tenta de novo
      scriptPromise = undefined;
      script.remove();
      reject(new Error("Falha ao carregar o Turnstile"));
    };
    document.head.append(script);
  });
  return scriptPromise;
};

// Widget invisível: o token fica pronto antes da pergunta e é renovado logo depois de cada uso
export const mountTurnstileWidget = (container: HTMLElement): TurnstileWidget => {
  let readyToken: string | undefined;
  let waiter: TokenWaiter | undefined;
  let failed = false;
  let removed = false;

  const rejectWaiter = (message: string) => {
    waiter?.reject(new Error(message));
    waiter = undefined;
  };

  const widgetIdPromise = loadTurnstile()
    .then((turnstile) => {
      if (removed || !SITE_KEY) return undefined;
      return turnstile.render(container, {
        sitekey: SITE_KEY,
        action: "gideon_ask",
        appearance: "interaction-only",
        "refresh-expired": "auto",
        callback: (token) => {
          if (!waiter) {
            readyToken = token;
            return;
          }
          waiter.resolve(token);
          waiter = undefined;
          renew();
        },
        "error-callback": () => rejectWaiter("Desafio do Turnstile falhou"),
        "expired-callback": () => {
          readyToken = undefined;
        },
      });
    })
    .catch(() => undefined)
    .then((widgetId) => {
      if (!widgetId) {
        failed = true;
        rejectWaiter("Turnstile indisponível");
      }
      return widgetId;
    });

  const renew = () => {
    widgetIdPromise.then((widgetId) => {
      if (widgetId && !removed) window.turnstile?.reset(widgetId);
    });
  };

  const takeToken = (): Promise<string> => {
    if (failed) return Promise.reject(new Error("Turnstile indisponível"));

    if (readyToken) {
      const token = readyToken;
      readyToken = undefined;
      renew();
      return Promise.resolve(token);
    }

    rejectWaiter("Pedido de token substituído");
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => rejectWaiter("Turnstile demorou demais"), TOKEN_TIMEOUT_MS);
      waiter = {
        resolve: (token) => {
          window.clearTimeout(timeout);
          resolve(token);
        },
        reject: (error) => {
          window.clearTimeout(timeout);
          reject(error);
        },
      };
    });
  };

  const remove = () => {
    removed = true;
    rejectWaiter("Widget removido");
    widgetIdPromise.then((widgetId) => {
      if (widgetId) window.turnstile?.remove(widgetId);
    });
  };

  return { takeToken, remove };
};
