import { useCallback, useEffect, useMemo, useState } from "react";
import { ASK_LIMITS, ASK_RATE_LIMIT_WINDOW_MS, getNextAiQuotaReset } from "../../shared/gideon/askContract";
import type { GideonFallbackReason, GideonResponse, GideonTurn, ScreenContext } from "../../shared/gideon/types";
import { GideonApiError, askGideonApi, isGideonApiConfigured } from "../services/gideonApi";
import { isTurnstileConfigured } from "../services/turnstile";
import { getGideonRest, startGideonRest, useGideonRest, type GideonRestReason } from "./useGideonRest";
import { parseJson } from "./storageStore";
import { useTurnstile } from "./useTurnstile";

type GideonEngine = typeof import("../../shared/gideon");

export interface GideonMessage {
  id: string;
  role: "user" | "gideon";
  text: string;
  response?: GideonResponse;
  // Texto redigido pela IA a partir dos trechos: as fontes não precisam repetir o resumo
  answeredByAi?: boolean;
}

interface StoredConversation {
  isOpen: boolean;
  messages: GideonMessage[];
}

const STORAGE_KEY = "guiding-grace:gideon";
// A conversa pertence à sessão; mensagens antigas saem para o histórico não crescer sem limite
const MAX_STORED_MESSAGES = 40;
export const MAX_QUESTION_LENGTH = 300;
// Sem Site Key o Worker recusaria toda pergunta: o chat fica só com o motor local
const USES_AI = isGideonApiConfigured() && isTurnstileConfigured();

// O motor (índice + busca) só é baixado quando o chat é aberto pela primeira vez
let enginePromise: Promise<GideonEngine> | undefined;
const loadEngine = () => {
  enginePromise ??= import("../../shared/gideon");
  return enginePromise;
};

const readConversation = (): StoredConversation => {
  try {
    const parsed = parseJson(sessionStorage.getItem(STORAGE_KEY));
    if (typeof parsed !== "object" || parsed === null) return { isOpen: false, messages: [] };

    const stored = parsed as Partial<StoredConversation>;
    return {
      isOpen: stored.isOpen === true,
      messages: Array.isArray(stored.messages) ? stored.messages : [],
    };
  } catch {
    return { isOpen: false, messages: [] };
  }
};

const saveConversation = (conversation: StoredConversation) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch {
    // Sem storage: a conversa continua só enquanto a página estiver aberta
  }
};

// Histórico curto enviado ao Worker: a IA usa para entender a quem a pergunta se refere, nunca como fonte de fatos.
// Cada resposta leva os trechos que mostrou (o assunto). O texto das falas de fallback ("meus registros parecem
// turvos") fica de fora: o modelo passava a imitá-las
const toHistory = (messages: GideonMessage[]): GideonTurn[] =>
  messages.slice(-ASK_LIMITS.historyTurns).map((message) => ({
    role: message.role,
    text: message.response?.status === "fallback" ? "" : message.text.slice(0, ASK_LIMITS.historyTextLength),
    sourceIds: message.response?.sources.slice(0, ASK_LIMITS.previousSources).map((source) => source.chunkId),
  }));

let messageCounter = 0;
const createMessageId = () => `${Date.now().toString(36)}-${messageCounter++}`;

export function useGideonConversation(context: ScreenContext) {
  const [conversation, setConversation] = useState(readConversation);
  const [engine, setEngine] = useState<GideonEngine>();
  const [isThinking, setIsThinking] = useState(false);
  const rest = useGideonRest();
  const { isOpen, messages } = conversation;
  const turnstile = useTurnstile(isOpen && USES_AI);

  useEffect(() => {
    saveConversation(conversation);
  }, [conversation]);

  useEffect(() => {
    if (!isOpen || engine) return;
    loadEngine().then(setEngine);
  }, [isOpen, engine]);

  const setOpen = useCallback((nextOpen: boolean) => {
    setConversation((current) => ({ ...current, isOpen: nextOpen }));
  }, []);

  const appendMessage = (message: GideonMessage) => {
    setConversation((current) => ({
      ...current,
      messages: [...current.messages, message].slice(-MAX_STORED_MESSAGES),
    }));
  };

  const ask = async (question: string) => {
    const text = question.trim().slice(0, MAX_QUESTION_LENGTH);
    if (!text || isThinking) return;

    // Só as fontes da última resposta entram como contexto: os fatos vêm sempre da busca atual
    const previousSourceIds =
      [...messages].reverse().find((message) => message.response?.sources.length)?.response?.sources.map(
        (source) => source.chunkId,
      ) ?? [];

    appendMessage({ id: createMessageId(), role: "user", text });
    setIsThinking(true);

    const gideon = await loadEngine();
    const index = gideon.getGuideIndex();
    const local = gideon.respondLocally(index, { question: text, context, previousSourceIds });
    let response: GideonResponse = local;
    let answeredByAi = false;

    // Fora cumprimentos, toda pergunta vai à IA: é ela quem entende a conversa ("e eu já encontrei ele?").
    // O motor local é a resposta quando a IA não está disponível
    const canUseAi = local.status !== "social" && USES_AI;
    const currentRest = getGideonRest();

    // Sem IA, a resposta local com trechos ganha o aviso do motivo; sem trechos, ela vale como está
    const toLocalFallback = (reason: GideonFallbackReason, returnLabel?: string) =>
      local.sources.length > 0 ? gideon.toFallbackResponse(local, reason, returnLabel) : local;

    // Pausa até a hora informada pelo Worker; até lá o site nem chama o Worker
    const pauseGideon = (reason: GideonRestReason, until: Date) => {
      startGideonRest(until, reason);
      return toLocalFallback(reason, gideon.formatReturnTime(until, new Date()));
    };

    if (canUseAi && currentRest) {
      response = toLocalFallback(currentRest.reason, gideon.formatReturnTime(currentRest.until, new Date()));
    } else if (canUseAi) {
      try {
        // Sem token (desafio falhou, script bloqueado) a pergunta nem sai: o motor local responde
        const turnstileToken = await turnstile.getToken();
        const aiResponse = await askGideonApi({
          question: text,
          context,
          previousSourceIds,
          history: toHistory(messages),
          indexVersion: index.version,
          turnstileToken,
        });
        response = aiResponse;
        answeredByAi = aiResponse.mode === "ai";
      } catch (error) {
        const failure = error instanceof GideonApiError ? error.failure : "unreachable";
        const retryAt = error instanceof GideonApiError ? error.retryAt : undefined;
        if (failure === "ai_quota_exceeded") {
          response = pauseGideon("quota_exceeded", retryAt ?? getNextAiQuotaReset(new Date()));
        } else if (failure === "rate_limited") {
          response = pauseGideon("rate_limited", retryAt ?? new Date(Date.now() + ASK_RATE_LIMIT_WINDOW_MS));
        } else {
          response = toLocalFallback("unavailable");
        }
      }
    }

    appendMessage({ id: createMessageId(), role: "gideon", text: response.message, response, answeredByAi });
    setIsThinking(false);
  };

  const clearConversation = () => {
    setConversation((current) => ({ ...current, messages: [] }));
  };

  const intro = useMemo(() => {
    if (!engine) return undefined;
    const index = engine.getGuideIndex();
    return {
      scope: engine.describeGuideScope(index),
      suggestions: engine.getSuggestedQuestions(index, context),
    };
  }, [engine, context]);

  return {
    isOpen,
    messages,
    isThinking,
    intro,
    usesAi: USES_AI,
    restingLabel: engine && rest ? engine.formatReturnTime(rest.until, new Date()) : undefined,
    turnstileRef: turnstile.containerRef,
    setOpen,
    ask,
    clearConversation,
  };
}
