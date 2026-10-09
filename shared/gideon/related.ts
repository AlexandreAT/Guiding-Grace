import { SUMMARY_SECTION_ID } from "../../src/data/compendium/types";
import { getEntityTokens } from "./entities";
import { isChunkAllowed, type PlayerProgress } from "./progressGuard";
import { getDocumentFrequency, isSameEntity } from "./search";
import type { GuideChunk, GuideIndex } from "./types";

// Nome citado em poucos trechos identifica um assunto (Blaidd, Kale); nomes espalhados (Limgrave) não
const MAX_NAME_SPREAD = 3;
const MENTIONS_SUBJECT_SCORE = 2;
const IS_MENTIONED_SCORE = 1;

// Relações escritas pelo autor no Compêndio (Godrick → Margit, Anel Prístino): o resumo de cada entrada relacionada
const findExplicitRelated = (index: GuideIndex, subject: GuideChunk, progress: PlayerProgress): GuideChunk[] => {
  const subjectEntity = subject.entity;
  if (!subjectEntity) return [];

  const related = index.entities.find((entity) => isSameEntity(entity.ref, subjectEntity))?.related ?? [];
  return related.flatMap(
    (ref) =>
      index.chunks.find(
        (chunk) =>
          chunk.entity !== undefined &&
          isSameEntity(chunk.entity, ref) &&
          chunk.sectionId === SUMMARY_SECTION_ID &&
          isChunkAllowed(chunk, progress),
      ) ?? [],
  );
};

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

  const explicit = findExplicitRelated(index, subject, progress);
  const explicitIds = new Set(explicit.map((chunk) => chunk.chunkId));
  const subjectNames = new Set(subject.titleTokens.filter(isDistinctiveName));
  const mentionedNames = new Set(subject.tokens.filter((token) => isDistinctiveName(token) && !subjectNames.has(token)));

  const byName = index.chunks
    .filter(
      (chunk) =>
        chunk.chunkId !== subject.chunkId &&
        !explicitIds.has(chunk.chunkId) &&
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
    .map(({ chunk }) => chunk);

  return [...explicit, ...byName].slice(0, limit);
};
