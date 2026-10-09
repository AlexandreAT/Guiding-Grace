import type { SpoilerGate } from "../../src/data/regionSections";
import type { BuildProgress, GuideChunk, ScreenContext } from "./types";

export interface PlayerProgress {
  visitedRegionIds: ReadonlySet<string>;
  completedIds: ReadonlySet<string>;
  currentRegionId?: string;
}

// Progresso somado das builds: o que o jogador já viu em qualquer jornada
export const toKnowledgeProgress = (builds: readonly BuildProgress[], currentRegionId?: string): PlayerProgress => ({
  visitedRegionIds: new Set(builds.flatMap((item) => item.visitedRegionIds)),
  completedIds: new Set(builds.flatMap((item) => item.completedIds)),
  currentRegionId,
});

// Com uma build definida, vale só o progresso dela; sem build (busca comum, páginas do Compêndio), conta o que já
// foi visto em qualquer uma
export const toPlayerProgress = (context: ScreenContext, build?: BuildProgress): PlayerProgress =>
  toKnowledgeProgress(build ? [build] : context.builds, context.currentRegionId);

const isRegionReached = (regionId: string, progress: PlayerProgress): boolean =>
  regionId === progress.currentRegionId || progress.visitedRegionIds.has(regionId);

// Regra única de conhecimento: decide para o Gideon (trechos) e para as páginas do Compêndio (seções)
export const isGateOpen = (gate: SpoilerGate, progress: PlayerProgress): boolean => {
  if (gate.afterObjectiveId && !progress.completedIds.has(gate.afterObjectiveId)) return false;
  return !gate.regionId || isRegionReached(gate.regionId, progress);
};

export const areGatesOpen = (gates: readonly SpoilerGate[], progress: PlayerProgress): boolean =>
  gates.every((gate) => isGateOpen(gate, progress));

// "Não concluído" não é spoiler: só regiões nunca alcançadas e exceções editoriais (gates) ficam bloqueadas.
// Isso protege a experiência do chat, não é sigilo: o conteúdo continua no próprio guia
export const isChunkAllowed = (chunk: GuideChunk, progress: PlayerProgress): boolean => {
  if (!areGatesOpen(chunk.gates, progress)) return false;

  // Mecânicas e Compêndio: só os gates decidem (o do chefe já inclui a região dele)
  if (chunk.kind !== "region" || chunk.spoilerFree) return true;
  return chunk.regionId !== undefined && isRegionReached(chunk.regionId, progress);
};

export const partitionChunks = (chunks: readonly GuideChunk[], progress: PlayerProgress) => {
  const allowed: GuideChunk[] = [];
  const blocked: GuideChunk[] = [];
  chunks.forEach((chunk) => (isChunkAllowed(chunk, progress) ? allowed : blocked).push(chunk));
  return { allowed, blocked };
};
