import type { BuildProgress, ScreenContext } from "./types";

// Apenas para testes: contexto com uma build (Qualidade) e o progresso informado
type TestContextOptions = Partial<Omit<ScreenContext, "builds">> & {
  visitedRegionIds?: string[];
  completedIds?: string[];
  builds?: BuildProgress[];
};

export const createTestContext = ({
  visitedRegionIds = [],
  completedIds = [],
  builds,
  ...overrides
}: TestContextOptions = {}): ScreenContext => ({
  routeType: "home",
  pathname: "/",
  lastBuildId: "quality-build",
  builds: builds ?? [{ buildId: "quality-build", buildName: "Build de Qualidade", visitedRegionIds, completedIds }],
  ...overrides,
});
