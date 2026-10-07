import { useCallback, useEffect, useRef } from "react";
import { mountTurnstileWidget, type TurnstileWidget } from "../services/turnstile";

// O widget vive enquanto o painel do Gideon estiver aberto; o container precisa estar no DOM
// porque, no caso raro de a Cloudflare pedir um clique, o desafio aparece ali
export function useTurnstile(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<TurnstileWidget | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    const widget = mountTurnstileWidget(container);
    widgetRef.current = widget;
    return () => {
      widget.remove();
      widgetRef.current = undefined;
    };
  }, [enabled]);

  const getToken = useCallback((): Promise<string> => {
    if (!widgetRef.current) return Promise.reject(new Error("Turnstile não montado"));
    return widgetRef.current.takeToken();
  }, []);

  return { containerRef, getToken };
}
