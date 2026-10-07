import { REGIONS, getRegion, isRegionAvailable, type Region } from "../data/regions";

// Parâmetros de URL das telas de conteúdo; links diretos e fontes do Gideon dependem deles
export const GUIDE_REGION_PARAM = "region";
export const GUIDE_FOCUS_PARAM = "focus";
export const MECHANIC_SECTION_PARAM = "section";

export const buildGuidePath = (buildId: string, regionId?: string, focus?: string): string => {
  const params = new URLSearchParams();
  if (regionId) params.set(GUIDE_REGION_PARAM, regionId);
  if (focus) params.set(GUIDE_FOCUS_PARAM, focus);

  const query = params.toString();
  return query ? `/guide/${buildId}?${query}` : `/guide/${buildId}`;
};

export const buildMechanicPath = (mechanicId: string, sectionId?: string): string =>
  sectionId
    ? `/mechanics/${mechanicId}?${MECHANIC_SECTION_PARAM}=${encodeURIComponent(sectionId)}`
    : `/mechanics/${mechanicId}`;

// Valores inválidos ou de regiões bloqueadas caem na primeira região
export const resolveGuideRegion = (regionId: string | null, canOpenLocked: boolean): Region => {
  const region = regionId ? getRegion(regionId) : undefined;
  return region && (isRegionAvailable(region) || canOpenLocked) ? region : REGIONS[0];
};
