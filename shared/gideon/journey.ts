import { containsPhrase } from "./normalize";
import { isChunkAllowed, type PlayerProgress } from "./progressGuard";
import type { GuideChunk, GuideIndex, GuideIndexRegion } from "./types";

export type FocusRegion =
  | { type: "region"; regionId: string }
  | { type: "choose"; regionIds: string[] }
  | { type: "none" };

export const getRegionObjectives = (index: GuideIndex, regionId: string): GuideChunk[] =>
  index.chunks.filter((chunk) => chunk.regionId === regionId && chunk.objectiveId !== undefined);

export const getPendingObjectives = (
  index: GuideIndex,
  regionId: string,
  progress: PlayerProgress,
): GuideChunk[] =>
  getRegionObjectives(index, regionId).filter(
    (chunk) => chunk.objectiveId !== undefined && !progress.completedIds.has(chunk.objectiveId),
  );

// Mesma regra do progresso da sidebar: só conta região visitada que tem objetivos e ainda falta algum
export const getIncompleteRegionIds = (index: GuideIndex, progress: PlayerProgress): string[] =>
  index.regions
    .filter((region) => progress.visitedRegionIds.has(region.id))
    .filter((region) => getRegionObjectives(index, region.id).length > 0)
    .filter((region) => getPendingObjectives(index, region.id, progress).length > 0)
    .map((region) => region.id);

// Nome completo ("limgrave topo") vale primeiro; só o primeiro nome ("limgrave") pode apontar para mais de uma região
export const findMentionedRegions = (index: GuideIndex, normalizedQuestion: string): string[] => {
  const fullMatches = index.regions.filter((region) =>
    region.names.some((name) => containsPhrase(normalizedQuestion, name)),
  );
  if (fullMatches.length > 0) return fullMatches.map((region) => region.id);

  return index.regions
    .filter((region) => {
      const [firstName] = region.names[0].split(" ");
      return firstName.length >= 5 && containsPhrase(normalizedQuestion, firstName);
    })
    .map((region) => region.id);
};

export const getIndexRegion = (index: GuideIndex, regionId: string): GuideIndexRegion | undefined =>
  index.regions.find((region) => region.id === regionId);

// Prioridade para "o que faço agora?": região citada → região aberta → única região em andamento → perguntar
export const resolveFocusRegion = (
  index: GuideIndex,
  progress: PlayerProgress,
  mentionedRegionIds: readonly string[],
): FocusRegion => {
  if (mentionedRegionIds.length === 1) return { type: "region", regionId: mentionedRegionIds[0] };
  if (mentionedRegionIds.length > 1) return { type: "choose", regionIds: [...mentionedRegionIds] };

  const { currentRegionId } = progress;
  if (currentRegionId && getRegionObjectives(index, currentRegionId).length > 0) {
    return { type: "region", regionId: currentRegionId };
  }

  const incomplete = getIncompleteRegionIds(index, progress);
  if (incomplete.length === 1) return { type: "region", regionId: incomplete[0] };
  if (incomplete.length > 1) return { type: "choose", regionIds: incomplete };
  return { type: "none" };
};

// Próxima região com objetivos pendentes que o jogador já pode conhecer, na ordem do guia
export const findNextRegion = (
  index: GuideIndex,
  progress: PlayerProgress,
  afterRegionId?: string,
): GuideIndexRegion | undefined => {
  const afterOrder = afterRegionId ? (getIndexRegion(index, afterRegionId)?.order ?? 0) : 0;

  return index.regions.find((region) => {
    if (region.order <= afterOrder) return false;
    const pending = getPendingObjectives(index, region.id, progress);
    return pending.length > 0 && pending.every((chunk) => isChunkAllowed(chunk, progress));
  });
};
