import { resolveBuildFocus } from "./builds";
import { findNextRegion, getIncompleteRegionIds, getPendingObjectives, getRegionObjectives } from "./journey";
import { GAME_DATA_SECTION_ID, SUMMARY_SECTION_ID, type CompendiumRef } from "../../src/data/compendium/types";
import { isChunkAllowed, toPlayerProgress, type PlayerProgress } from "./progressGuard";
import { isSameEntity } from "./search";
import type { GuideChunk, GuideIndex, ScreenContext } from "./types";

const MAX_SUGGESTIONS = 3;

const toQuestion = (chunk: GuideChunk): string =>
  chunk.pinId ? `Onde fica ${chunk.title}?` : `Me fale sobre ${chunk.title}`;

const findEntitySummary = (index: GuideIndex, ref: CompendiumRef, progress: PlayerProgress): GuideChunk | undefined =>
  index.chunks.find(
    (chunk) =>
      chunk.entity !== undefined &&
      isSameEntity(chunk.entity, ref) &&
      chunk.sectionId === SUMMARY_SECTION_ID &&
      isChunkAllowed(chunk, progress),
  );

// Página de chefe ou de lore: perguntas sobre aquela entrada, só se o jogador já pode saber dela
const getCompendiumSuggestions = (index: GuideIndex, ref: CompendiumRef, progress: PlayerProgress): string[] => {
  const name = findEntitySummary(index, ref, progress)?.entityName;
  if (!name) return [];

  const hasSection = (sectionId: string) =>
    index.chunks.some(
      (chunk) => chunk.entity !== undefined && isSameEntity(chunk.entity, ref) && chunk.sectionId === sectionId,
    );
  if (ref.kind === "boss") {
    return [
      ...(hasSection(GAME_DATA_SECTION_ID) ? [`Qual a fraqueza de ${name}?`] : []),
      ...(hasSection("strategy") ? [`Como vencer ${name}?`] : []),
      `Quem é ${name}?`,
    ];
  }

  const related = index.entities
    .find((entity) => isSameEntity(entity.ref, ref))
    ?.related.flatMap((relatedRef) => findEntitySummary(index, relatedRef, progress)?.entityName ?? [])[0];
  return [`Me fale sobre ${name}`, ...(related ? [`Qual a ligação entre ${name} e ${related}?`] : [])];
};

// Sugestões derivadas do índice: nunca sugerem algo que o guia não responde
export const getSuggestedQuestions = (index: GuideIndex, context: ScreenContext): string[] => {
  const buildFocus = resolveBuildFocus(context, "");
  const progress = toPlayerProgress(context, buildFocus.type === "build" ? buildFocus.build : undefined);

  const compendiumSuggestions = context.entity ? getCompendiumSuggestions(index, context.entity, progress) : [];
  if (compendiumSuggestions.length > 0) return compendiumSuggestions.slice(0, MAX_SUGGESTIONS);

  if (context.routeType === "mechanics" && context.mechanicId) {
    return index.chunks
      .filter((chunk) => chunk.mechanicId === context.mechanicId)
      .slice(1, MAX_SUGGESTIONS + 1)
      .map(toQuestion);
  }

  const currentRegionId =
    context.currentRegionId && getRegionObjectives(index, context.currentRegionId).length > 0
      ? context.currentRegionId
      : undefined;
  const regionId =
    currentRegionId ?? getIncompleteRegionIds(index, progress)[0] ?? findNextRegion(index, progress)?.id;

  const objectives = regionId
    ? getPendingObjectives(index, regionId, progress).filter((chunk) => isChunkAllowed(chunk, progress))
    : [];
  const firstMechanic = index.chunks.find((chunk) => chunk.kind === "mechanic");

  return [
    "O que faço agora?",
    ...objectives.slice(0, 2).map(toQuestion),
    ...(firstMechanic && context.routeType !== "guide" ? [toQuestion(firstMechanic)] : []),
  ].slice(0, MAX_SUGGESTIONS);
};
