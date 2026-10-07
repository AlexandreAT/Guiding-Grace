import { getEntityTokens } from "./entities";
import { isChunkAllowed, type PlayerProgress } from "./progressGuard";
import { getDocumentFrequency } from "./search";
import type { GuideChunk, GuideIndex } from "./types";

// Nome citado em poucos trechos identifica um assunto (Blaidd, Kale); nomes espalhados (Limgrave) não
const MAX_NAME_SPREAD = 3;
const MENTIONS_SUBJECT_SCORE = 2;
const IS_MENTIONED_SCORE = 1;

// A informação de um assunto costuma estar espalhada: o trecho do Blaidd cita o Kale (que ensina o gesto)
// e o trecho do Darriwil cita o Blaidd (que pode ser invocado). Esses trechos viram contexto extra para a IA,
// sempre passando pelo Progress Guard: nada de região futura entra por esse caminho
export const findRelatedChunks = (
  index: GuideIndex,
  subject: GuideChunk,
  progress: PlayerProgress,
  limit: number,
): GuideChunk[] => {
  const entityTokens = getEntityTokens(index);
  const frequency = getDocumentFrequency(index);
  const isDistinctiveName = (token: string) =>
    entityTokens.has(token) && (frequency.get(token) ?? 0) <= MAX_NAME_SPREAD;

  const subjectNames = new Set(subject.titleTokens.filter(isDistinctiveName));
  const mentionedNames = new Set(subject.tokens.filter((token) => isDistinctiveName(token) && !subjectNames.has(token)));

  return index.chunks
    .filter(
      (chunk) =>
        chunk.chunkId !== subject.chunkId &&
        chunk.kind === "region" &&
        chunk.anchor !== undefined &&
        isChunkAllowed(chunk, progress),
    )
    .map((chunk) => ({
      chunk,
      score:
        (chunk.tokens.some((token) => subjectNames.has(token)) ? MENTIONS_SUBJECT_SCORE : 0) +
        (chunk.titleTokens.some((token) => mentionedNames.has(token)) ? IS_MENTIONED_SCORE : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.order - b.chunk.order)
    .slice(0, limit)
    .map(({ chunk }) => chunk);
};
