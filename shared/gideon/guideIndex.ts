import { BOSSES } from "../../src/data/compendium/bosses";
import { BOSS_GAME_DATA } from "../../src/data/compendium/gameData/bosses";
import { LORE_ARTICLES } from "../../src/data/compendium/lore";
import { MECHANIC_GUIDES } from "../../src/data/mechanics";
import { regionPins } from "../../src/data/regionPins";
import { REGIONS } from "../../src/data/regions";
import { regionSections } from "../../src/data/regionSections";
import { buildGuideIndex } from "./buildGuideIndex";
import type { GuideIndex } from "./types";

let guideIndex: GuideIndex | undefined;

// Mesmos dados que a interface usa (guia, mecânicas e Compêndio): nenhum texto é copiado só para o Gideon
export const getGuideIndex = (): GuideIndex => {
  guideIndex ??= buildGuideIndex({
    regions: REGIONS,
    sections: regionSections,
    pins: regionPins,
    mechanics: Object.values(MECHANIC_GUIDES),
    bosses: BOSSES,
    bossGameData: BOSS_GAME_DATA,
    lore: LORE_ARTICLES,
  });
  return guideIndex;
};
