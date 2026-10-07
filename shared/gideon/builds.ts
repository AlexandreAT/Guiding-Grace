import { containsPhrase, normalizeText } from "./normalize";
import type { BuildProgress, ScreenContext } from "./types";

export type BuildFocus =
  | { type: "build"; build: BuildProgress }
  | { type: "choose"; builds: BuildProgress[] }
  | { type: "none" };

export const isBuildStarted = (build: BuildProgress): boolean =>
  build.visitedRegionIds.length > 0 || build.completedIds.length > 0;

const findBuild = (context: ScreenContext, buildId: string | undefined) =>
  buildId ? context.builds.find((build) => build.buildId === buildId) : undefined;

// Nome completo ("build de destreza"): só "destreza" também é nome de atributo
const findMentionedBuilds = (context: ScreenContext, normalizedQuestion: string): BuildProgress[] =>
  context.builds.filter((build) => containsPhrase(normalizedQuestion, normalizeText(build.buildName)));

// De qual jornada a pergunta fala: build aberta → build citada → única build iniciada → perguntar
export const resolveBuildFocus = (context: ScreenContext, normalizedQuestion: string): BuildFocus => {
  const routeBuild = findBuild(context, context.buildId);
  if (routeBuild) return { type: "build", build: routeBuild };

  const mentioned = findMentionedBuilds(context, normalizedQuestion);
  if (mentioned.length === 1) return { type: "build", build: mentioned[0] };
  if (mentioned.length > 1) return { type: "choose", builds: mentioned };

  const started = context.builds.filter(isBuildStarted);
  if (started.length === 1) return { type: "build", build: started[0] };
  if (started.length > 1) return { type: "choose", builds: started };

  // Nenhuma jornada iniciada: a última build aberta (ou a primeira disponível) é o ponto de partida
  const fallback = findBuild(context, context.lastBuildId) ?? context.builds[0];
  return fallback ? { type: "build", build: fallback } : { type: "none" };
};

// Destino dos links: nunca pergunta, usa a build da pergunta ou a última aberta
export const getLinkBuildId = (context: ScreenContext, focus: BuildFocus): string => {
  if (focus.type === "build") return focus.build.buildId;
  return context.lastBuildId ?? context.builds[0]?.buildId ?? "";
};
