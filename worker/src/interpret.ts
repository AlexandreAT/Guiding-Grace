import { ASK_LIMITS } from "../../shared/gideon/askContract";
import { findUnsupportedNames, removeThinking } from "../../shared/gideon/citations";
import { getEntityTokens } from "../../shared/gideon/entities";
import { normalizeText } from "../../shared/gideon/normalize";
import { isChunkAllowed, toPlayerProgress, type PlayerProgress } from "../../shared/gideon/progressGuard";
import type {
  GideonTurn,
  GuideIndex,
  InterpretedRequestType,
  QuestionInterpretation,
  ScreenContext,
} from "../../shared/gideon/types";
import {
  buildInterpretPrompt,
  NO_SUBJECT,
  QUESTION_PREFIX,
  SUBJECT_PREFIX,
  TYPE_PREFIX,
  type InterpretTurn,
} from "./prompts/interpret";
import type { GideonLlmProvider } from "./providers/types";

const MIN_QUESTION_LENGTH = 2;

// Palavras do prompt (seção TIPO) → tipos que o motor executa
const REQUEST_TYPES: Record<string, InterpretedRequestType> = {
  busca: "search",
  continuacao: "follow_up",
  progresso: "progress_check",
  proximo_passo: "next_step",
  depois: "after_last",
  pular: "skip",
  relacao: "relation",
};

export interface Interpretation extends QuestionInterpretation {
  question: string;
  // false quando a pergunta já estava clara ou a IA devolveu algo inválido (fica a original)
  rewritten: boolean;
}

interface InterpretInput {
  question: string;
  history: GideonTurn[];
  context: ScreenContext;
  index: GuideIndex;
}

// Só nomes que o jogador pode ver: um nome bloqueado pelo Progress Guard nunca entra pela interpretação
const getAllowedNames = (index: GuideIndex, progress: PlayerProgress): string[] => [
  ...new Set([
    ...index.regions.map((region) => region.name),
    ...index.chunks.filter((chunk) => isChunkAllowed(chunk, progress)).map((chunk) => chunk.title),
  ]),
];

const describeScreen = (index: GuideIndex, context: ScreenContext): string => {
  const region = index.regions.find((indexRegion) => indexRegion.id === context.currentRegionId);
  if (region) return `Guia aberto em ${region.name}`;

  const mechanic = index.chunks.find((chunk) => chunk.mechanicId && chunk.mechanicId === context.mechanicId);
  if (mechanic?.mechanicTitle) return `Guia de mecânicas: ${mechanic.mechanicTitle}`;
  return `Página: ${context.routeType}`;
};

// Palavra com inicial maiúscula fora do começo da frase: nome próprio citado na resposta (Melina, Torrent...)
const MENTIONED_NAME = /(?<![.!?:]\s|^)\b\p{Lu}[\p{L}'-]{2,}/gu;

const findMentionedNames = (text: string): string[] => [...new Set(text.match(MENTIONED_NAME) ?? [])];

// Cada resposta do Gideon vira "assunto: Graça da Erdtree; cita: Melina, Torrent", para a IA saber de quem a
// conversa tratou em cada ponto, inclusive quem só apareceu no texto
const toInterpretTurns = (history: GideonTurn[], index: GuideIndex, progress: PlayerProgress): InterpretTurn[] =>
  history.map((turn) => {
    const subjects = (turn.sourceIds ?? []).flatMap((sourceId) =>
      index.chunks
        .filter((chunk) => chunk.chunkId === sourceId && isChunkAllowed(chunk, progress))
        .map((chunk) => chunk.title),
    );
    return {
      role: turn.role,
      text: turn.text,
      subjects,
      mentions: turn.role === "gideon" ? findMentionedNames(turn.text).filter((name) => !subjects.includes(name)) : [],
    };
  });

// Valor de uma linha "PREFIXO: valor", sem aspas em volta
const readLine = (lines: string[], prefix: string): string | undefined => {
  const line = lines.find((textLine) => textLine.toUpperCase().startsWith(prefix));
  return line
    ?.slice(prefix.length)
    .trim()
    .replace(/^["'“”]+/, "")
    .replace(/["'“”]+$/, "")
    .trim();
};

const parseInterpretation = (rawText: string): Omit<Interpretation, "rewritten"> | undefined => {
  const lines = removeThinking(rawText)
    .split("\n")
    .map((textLine) => textLine.trim());

  const question = readLine(lines, QUESTION_PREFIX);
  if (!question || question.length < MIN_QUESTION_LENGTH || question.length > ASK_LIMITS.questionLength) {
    return undefined;
  }

  const typeWord = normalizeText(readLine(lines, TYPE_PREFIX) ?? "").replace(/\s+/g, "_");
  const subjects = (readLine(lines, SUBJECT_PREFIX) ?? "")
    .split(";")
    .map((subject) => subject.trim())
    .filter((subject) => subject && normalizeText(subject) !== NO_SUBJECT);
  return { question, type: REQUEST_TYPES[typeWord], subjects };
};

// A IA lê a conversa e diz o que o jogador quer: a pergunta completa ("e eu já encontrei ele?" → "Eu já encontrei
// o Blaidd?"), o tipo de pedido e os assuntos. Erros do provedor sobem para quem chama (cota esgotada é tratada à parte)
export const interpretQuestion = async (
  { question, history, context, index }: InterpretInput,
  provider: GideonLlmProvider,
): Promise<Interpretation> => {
  const progress = toPlayerProgress(context);
  const names = getAllowedNames(index, progress);
  const turns = toInterpretTurns(history, index, progress);

  const { text } = await provider.generate(
    buildInterpretPrompt({ question, history: turns, names, screen: describeScreen(index, context) }),
  );
  const unchanged: Interpretation = { question, rewritten: false, subjects: [] };
  const parsed = parseInterpretation(text);
  if (!parsed) return unchanged;

  // Nome do guia que o jogador não pode ver e que ninguém citou: veio do conhecimento do modelo (spoiler ou invenção)
  const supportingText = [question, ...turns.flatMap((turn) => [turn.text, ...turn.subjects]), ...names].join(" ");
  const interpretedText = [parsed.question, ...parsed.subjects].join(" ");
  if (findUnsupportedNames(interpretedText, supportingText, getEntityTokens(index)).length > 0) return unchanged;

  return { ...parsed, rewritten: normalizeText(parsed.question) !== normalizeText(question) };
};
