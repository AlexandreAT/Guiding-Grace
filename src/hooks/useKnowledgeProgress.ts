import { useMemo } from "react";
import { isGateOpen, toKnowledgeProgress, type PlayerProgress } from "../../shared/gideon/progressGuard";
import { describeGate } from "../data/compendium/knowledge";
import { getAvailableBuilds } from "../data/navigation";
import type { SpoilerGate } from "../data/regionSections";
import { useAllGuideProgress } from "./useGuideProgress";

// Motivo do primeiro gate ainda fechado ("Liberado ao visitar Liurnia dos Lagos."); undefined = pode ver
export const getLockReason = (gates: readonly SpoilerGate[], progress: PlayerProgress): string | undefined => {
  const closed = gates.find((gate) => !isGateOpen(gate, progress));
  return closed ? describeGate(closed) : undefined;
};

const AVAILABLE_BUILDS = getAvailableBuilds();
const AVAILABLE_BUILD_IDS = AVAILABLE_BUILDS.map((build) => build.id);

// Progresso usado pelas páginas do Compêndio: o que o jogador já viu em qualquer build. É a mesma regra que o
// Gideon usa quando a pergunta não define build, então página e chat liberam exatamente o mesmo conteúdo
export function useKnowledgeProgress(): PlayerProgress {
  const progressByBuild = useAllGuideProgress(AVAILABLE_BUILD_IDS);

  return useMemo(
    () =>
      toKnowledgeProgress(
        AVAILABLE_BUILDS.map((build) => ({
          buildId: build.id,
          buildName: build.title,
          visitedRegionIds: [...progressByBuild[build.id].visitedRegionIds],
          completedIds: [...progressByBuild[build.id].completedIds],
        })),
      ),
    [progressByBuild],
  );
}
