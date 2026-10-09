import type { BossGuide } from "../types";
import { GODRICK_THE_GRAFTED } from "./godrick-the-grafted";
import { MARGIT_THE_FELL_OMEN } from "./margit-the-fell-omen";
import { RENNALA_QUEEN_OF_THE_FULL_MOON } from "./rennala-queen-of-the-full-moon";
import { STARSCOURGE_RADAHN } from "./starscourge-radahn";

// Ordem da jornada: o hub agrupa por região nessa mesma ordem
export const BOSSES: BossGuide[] = [
  MARGIT_THE_FELL_OMEN,
  GODRICK_THE_GRAFTED,
  RENNALA_QUEEN_OF_THE_FULL_MOON,
  STARSCOURGE_RADAHN,
];

export const getBoss = (bossId: string): BossGuide | undefined => BOSSES.find((boss) => boss.id === bossId);

export const getBossByObjective = (objectiveId: string): BossGuide | undefined =>
  BOSSES.find((boss) => boss.objectiveId === objectiveId);
