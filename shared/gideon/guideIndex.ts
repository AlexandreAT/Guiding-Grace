import { MECHANIC_GUIDES } from "../../src/data/mechanics";
import { regionPins } from "../../src/data/regionPins";
import { REGIONS } from "../../src/data/regions";
import { regionSections } from "../../src/data/regionSections";
import { buildGuideIndex } from "./buildGuideIndex";
import type { GuideIndex } from "./types";

let guideIndex: GuideIndex | undefined;

// Mesmos dados que a interface usa: nenhum texto é copiado só para o Gideon
export const getGuideIndex = (): GuideIndex => {
  guideIndex ??= buildGuideIndex({
    regions: REGIONS,
    sections: regionSections,
    pins: regionPins,
    mechanics: Object.values(MECHANIC_GUIDES),
  });
  return guideIndex;
};
