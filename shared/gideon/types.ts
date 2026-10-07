import type { SpoilerGate } from "../../src/data/regionSections";

export type GuideChunkKind = "region" | "mechanic";

// Menor trecho citável do guia: um tópico da região ou uma seção de mecânica
export interface GuideChunk {
  chunkId: string;
  kind: GuideChunkKind;
  title: string;
  sectionTitle: string;
  // Parágrafos do trecho; o mais relevante para a pergunta vira o resumo exibido
  passages: string[];
  text: string;
  // Posição na leitura do guia, usada para "o que vem depois"
  order: number;
  regionId?: string;
  regionName?: string;
  // Região do início da jornada: liberada mesmo antes da primeira visita
  spoilerFree?: boolean;
  mechanicId?: string;
  mechanicTitle?: string;
  sectionId?: string;
  // Valor de ?focus=: id do item ou texto do tópico
  anchor?: string;
  pinId?: string;
  objectiveId?: string;
  spoilerGate?: SpoilerGate;
  titleTokens: string[];
  tokens: string[];
}

export interface GuideIndexRegion {
  id: string;
  name: string;
  order: number;
  // Nomes normalizados, para reconhecer a região citada na pergunta
  names: string[];
}

export interface GuideIndex {
  version: string;
  regions: GuideIndexRegion[];
  chunks: GuideChunk[];
}

export type ScreenRouteType =
  | "home"
  | "select"
  | "guide"
  | "mechanics"
  | "info"
  | "not-found"
  | "other";

// Cada build é uma jornada separada, com o próprio progresso
export interface BuildProgress {
  buildId: string;
  buildName: string;
  visitedRegionIds: string[];
  completedIds: string[];
}

// Estado estruturado da tela atual: o Gideon "lê a tela" por aqui, nunca pelo DOM
export interface ScreenContext {
  routeType: ScreenRouteType;
  pathname: string;
  // Build aberta na tela (só existe dentro do guia)
  buildId?: string;
  // Última build aberta: destino dos links quando a tela não tem build
  lastBuildId?: string;
  currentRegionId?: string;
  mechanicId?: string;
  // Progresso de todas as builds disponíveis, para o Gideon saber de qual jornada a pergunta fala
  builds: BuildProgress[];
}

export type GideonStatus =
  | "answered"
  | "spoiler_blocked"
  | "not_covered"
  | "clarify"
  | "social"
  | "fallback";

export type GideonActionType = "OPEN_MAP" | "OPEN_CONTENT" | "OPEN_ROUTE";

export interface GideonSource {
  chunkId: string;
  title: string;
  // Onde o trecho está: nome da região ou da mecânica
  location: string;
  snippet: string;
  action: {
    type: GideonActionType;
    label: string;
    path: string;
  };
}

export interface GideonChoice {
  type: "REGION" | "BUILD";
  id: string;
  label: string;
  // Pergunta enviada quando a escolha é clicada
  question: string;
}

// Por que a IA não redigiu a resposta: muda o que o Gideon diz e quando ele volta
export type GideonFallbackReason = "no_basis" | "invalid_answer" | "quota_exceeded" | "rate_limited" | "unavailable";

export interface GideonResponse {
  status: GideonStatus;
  message: string;
  sources: GideonSource[];
  // Mesmo assunto em outros tópicos/regiões: contexto extra para a IA, só exibido se ela citar
  related?: GideonSource[];
  // Instrução para a IA redigir (ex.: o que responder numa pergunta de relação); não aparece na tela
  guidance?: string;
  choices?: GideonChoice[];
  note?: string;
  fallbackReason?: GideonFallbackReason;
}

// Pedido como a IA o entendeu na etapa de interpretação do Worker: o código só executa, sem adivinhar por palavras
export type InterpretedRequestType =
  | "search"
  | "follow_up"
  | "progress_check"
  | "next_step"
  | "after_last"
  | "skip"
  | "relation";

export interface QuestionInterpretation {
  type?: InterpretedRequestType;
  // Títulos de trechos do guia de que a pergunta trata, na ordem dada pela IA
  subjects: string[];
}

export interface GideonTurn {
  role: "user" | "gideon";
  text: string;
  // Trechos mostrados na resposta do Gideon: dizem à IA de que assunto cada resposta tratou
  sourceIds?: string[];
}
