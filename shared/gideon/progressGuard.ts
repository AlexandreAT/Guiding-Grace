import type { BuildProgress, GuideChunk, ScreenContext } from "./types";

export interface PlayerProgress {
  visitedRegionIds: ReadonlySet<string>;
  completedIds: ReadonlySet<string>;
  currentRegionId?: string;
}

// Com uma build definida, vale só o progresso dela; sem build (busca comum), conta o que já foi visto em qualquer uma
export const toPlayerProgress = (context: ScreenContext, build?: BuildProgress): PlayerProgress => {
  const builds = build ? [build] : context.builds;
  return {
    visitedRegionIds: new Set(builds.flatMap((item) => item.visitedRegionIds)),
    completedIds: new Set(builds.flatMap((item) => item.completedIds)),
    currentRegionId: context.currentRegionId,
  };
};

const isRegionReached = (regionId: string, progress: PlayerProgress): boolean =>
  regionId === progress.currentRegionId || progress.visitedRegionIds.has(regionId);

// "Não concluído" não é spoiler: só regiões nunca alcançadas e exceções editoriais (spoilerGate) ficam bloqueadas.
// Isso protege a experiência do chat, não é sigilo: o conteúdo continua no próprio guia
export const isChunkAllowed = (chunk: GuideChunk, progress: PlayerProgress): boolean => {
  const gate = chunk.spoilerGate;
  if (gate?.afterObjectiveId && !progress.completedIds.has(gate.afterObjectiveId)) return false;
  if (gate?.regionId && !isRegionReached(gate.regionId, progress)) return false;

  if (chunk.kind === "mechanic" || chunk.spoilerFree) return true;
  return chunk.regionId !== undefined && isRegionReached(chunk.regionId, progress);
};

export const partitionChunks = (chunks: readonly GuideChunk[], progress: PlayerProgress) => {
  const allowed: GuideChunk[] = [];
  const blocked: GuideChunk[] = [];
  chunks.forEach((chunk) => (isChunkAllowed(chunk, progress) ? allowed : blocked).push(chunk));
  return { allowed, blocked };
};
