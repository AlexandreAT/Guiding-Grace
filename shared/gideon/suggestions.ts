import { resolveBuildFocus } from "./builds";
import { findNextRegion, getIncompleteRegionIds, getPendingObjectives, getRegionObjectives } from "./journey";
import { isChunkAllowed, toPlayerProgress } from "./progressGuard";
import type { GuideChunk, GuideIndex, ScreenContext } from "./types";

const MAX_SUGGESTIONS = 3;

const toQuestion = (chunk: GuideChunk): string =>
  chunk.pinId ? `Onde fica ${chunk.title}?` : `Me fale sobre ${chunk.title}`;

// Sugestões derivadas do índice: nunca sugerem algo que o guia não responde
export const getSuggestedQuestions = (index: GuideIndex, context: ScreenContext): string[] => {
  const buildFocus = resolveBuildFocus(context, "");
  const progress = toPlayerProgress(context, buildFocus.type === "build" ? buildFocus.build : undefined);

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
