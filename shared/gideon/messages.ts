import type { SocialKind } from "./intents";
import type { GideonFallbackReason } from "./types";

// Falas próprias inspiradas na personalidade de Gideon: curtas, seguras, um pouco altivas. Nada copiado do jogo
export const SOCIAL_LINES: Record<SocialKind, string[]> = {
  greeting: [
    "Pois bem, Maculado. O que deseja saber?",
    "Diga. Meus registros estão abertos.",
    "Fale. Conhecimento não espera quem hesita.",
  ],
  thanks: [
    "Não há de quê. Conhecimento só tem valor quando é usado.",
    "Use isso bem.",
    "Guarde a informação. Ela ainda lhe será útil.",
  ],
  farewell: [
    "Vá, então. Voltaremos a conversar.",
    "Até breve. Os registros continuarão aqui.",
    "Siga sua jornada. Estarei observando.",
  ],
};

export const ANSWER_LINES = [
  "Eis o que meus registros dizem.",
  "Isto é o que sei a respeito.",
  "Meus registros apontam para cá.",
];

// Fala genérica de busca: não carrega nenhuma decisão do guia que o modelo precise preservar
export const isGenericAnswerLine = (message: string): boolean => ANSWER_LINES.includes(message);

// Fala e aviso de cada motivo de fallback; {retorno} vira, por exemplo, "hoje às 21:00"
export const FALLBACK_LINES: Record<GideonFallbackReason, { message: string; note: string }> = {
  // A IA leu os trechos e disse que eles não tratam da pergunta (ex.: uma situação hipotética)
  no_basis: {
    message: "O guia não trata exatamente disso. Eis o que meus registros dizem sobre o assunto.",
    note: "Gideon não encontrou essa situação nos registros; estes são os trechos mais próximos.",
  },
  invalid_answer: {
    message: "Meus registros parecem turvos neste momento. Eis o que o guia diz.",
    note: "Gideon não conseguiu formular a resposta agora; estes são os trechos do guia.",
  },
  quota_exceeded: {
    message: "Até um Onisciente precisa de repouso. Volto {retorno}; até lá, eis o que o guia diz.",
    note: "Gideon está em repouso: a cota diária da IA terminou. Ele volta a responder {retorno}.",
  },
  // Limite de perguntas por minuto do Worker: pausa curta, o horário exato vem do próprio Worker
  rate_limited: {
    message: "Perguntas demais em tão pouco tempo, Maculado. Volto {retorno}; até lá, eis o que o guia diz.",
    note: "Gideon pausou a IA por um instante depois de muitas perguntas seguidas. Ele volta a responder {retorno}.",
  },
  unavailable: {
    message: "Gideon foi repousar por um instante. Enquanto isso, eis o que o guia diz.",
    note: "Não foi possível falar com o Gideon agora. Tente de novo em alguns minutos.",
  },
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Horário de retorno no fuso de quem lê: "hoje às 21:00", "amanhã às 21:00" ou "em 09/10 às 21:00"
export const formatReturnTime = (returnAt: Date, now: Date): string => {
  const time = returnAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  if (isSameDay(returnAt, now)) return `hoje às ${time}`;
  if (isSameDay(returnAt, tomorrow)) return `amanhã às ${time}`;
  return `em ${returnAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${time}`;
};

export const SPOILER_LINES = [
  "Há nomes sobre os quais pouco lhe adiantaria falar agora. Continue sua jornada; voltaremos a isso no momento certo.",
  "Ainda não é hora de você saber disso. Avance, e eu falarei quando chegar a hora.",
];

export const NOT_COVERED_MESSAGE =
  "Não tenho registros suficientes para lhe dar uma resposta confiável sobre isso.";
export const NOT_COVERED_NOTE = "O Guiding Grace ainda não cobre este assunto.";
export const CLARIFY_REFERENCE_MESSAGE = "De quem, ou do quê, você fala? Diga um nome e eu procuro.";
export const CLARIFY_BUILD_MESSAGE = "Você tem mais de uma jornada em andamento. De qual build está falando?";
export const CLARIFY_REGION_MESSAGE = "Você tem mais de um caminho em aberto. Qual deles deseja continuar?";
export const JOURNEY_COMPLETE_MESSAGE = "Você já concluiu tudo o que meus registros cobrem até agora.";

// Escolha determinística: a mesma pergunta recebe a mesma fala (previsível e testável)
export const pickLine = (lines: readonly string[], seed: string): string => {
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return lines[hash % lines.length];
};
