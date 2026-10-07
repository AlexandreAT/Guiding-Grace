import type { MechanicGuide } from "./types";
import { WEAPON_PROGRESSION_GUIDE } from "./weaponProgression";

export const MECHANIC_GUIDES: Record<string, MechanicGuide> = {
  [WEAPON_PROGRESSION_GUIDE.id]: WEAPON_PROGRESSION_GUIDE,
};

export const getMechanicGuide = (mechanicId: string): MechanicGuide | undefined =>
  MECHANIC_GUIDES[mechanicId];
