import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { CAN_OPEN_LOCKED_REGIONS } from "../../shared/const";
import type { ScreenContext, ScreenRouteType } from "../../shared/gideon/types";
import { getMechanicGuide } from "../data/mechanics";
import { getAvailableBuild, getAvailableBuilds } from "../data/navigation";
import { GUIDE_REGION_PARAM, resolveGuideRegion } from "../routes/guideRoute";
import { useAllGuideProgress } from "./useGuideProgress";
import { useLastGuideVisit } from "./useLastGuideVisit";

// /info/weapon-progression mostra o mesmo conteúdo de /mechanics/weapons
const INFO_PAGE_MECHANICS: Record<string, string> = {
  "weapon-progression": "weapons",
};

const AVAILABLE_BUILDS = getAvailableBuilds();
const AVAILABLE_BUILD_IDS = AVAILABLE_BUILDS.map((build) => build.id);

// Contexto estruturado da tela atual, derivado da rota, da URL e do progresso (nunca do DOM)
export function useGideonScreenContext(): ScreenContext {
  const { pathname, search } = useLocation();
  const lastVisit = useLastGuideVisit();
  const progressByBuild = useAllGuideProgress(AVAILABLE_BUILD_IDS);

  const routeBuildId = matchPath("/guide/:buildId", pathname)?.params.buildId;
  const routeMechanicId = matchPath("/mechanics/:mechanicId", pathname)?.params.mechanicId;
  const infoPageId = matchPath("/info/:pageId", pathname)?.params.pageId;
  const routeBuild = getAvailableBuild(routeBuildId);
  const lastBuildId = getAvailableBuild(lastVisit.buildId)?.id;

  return useMemo(() => {
    const infoMechanicId = infoPageId ? INFO_PAGE_MECHANICS[infoPageId] : undefined;
    const mechanicId =
      routeMechanicId && getMechanicGuide(routeMechanicId) ? routeMechanicId : infoMechanicId;

    let routeType: ScreenRouteType = "not-found";
    if (pathname === "/") routeType = "home";
    else if (matchPath("/select/:categoryId", pathname)) routeType = "select";
    else if (routeBuild) routeType = "guide";
    else if (mechanicId && routeMechanicId) routeType = "mechanics";
    else if (infoPageId) routeType = "info";

    const currentRegionId = routeBuild
      ? resolveGuideRegion(new URLSearchParams(search).get(GUIDE_REGION_PARAM), CAN_OPEN_LOCKED_REGIONS).id
      : undefined;

    return {
      routeType,
      pathname,
      buildId: routeBuild?.id,
      lastBuildId,
      currentRegionId,
      mechanicId,
      builds: AVAILABLE_BUILDS.map((build) => ({
        buildId: build.id,
        buildName: build.title,
        visitedRegionIds: [...progressByBuild[build.id].visitedRegionIds],
        completedIds: [...progressByBuild[build.id].completedIds],
      })),
    };
  }, [pathname, search, routeBuild, lastBuildId, routeMechanicId, infoPageId, progressByBuild]);
}
