import type { CompendiumRef } from "../data/compendium/types";
import { MECHANIC_SECTION_PARAM } from "./guideRoute";

// Mesmo parâmetro de âncora das Mecânicas: ?section= leva direto à seção (fontes do Gideon usam)
export const COMPENDIUM_SECTION_PARAM = MECHANIC_SECTION_PARAM;

// Seleção do Compêndio (mesma página de escolha dos outros guias) e os dois hubs
export const COMPENDIUM_SELECTION_PATH = "/select/compendium";
export const BOSSES_PATH = "/bosses";
export const LORE_PATH = "/lore";
export const CREDITS_PATH = "/credits";

const withSection = (path: string, sectionId?: string): string =>
  sectionId ? `${path}?${COMPENDIUM_SECTION_PARAM}=${encodeURIComponent(sectionId)}` : path;

export const buildBossPath = (bossId: string, sectionId?: string): string =>
  withSection(`${BOSSES_PATH}/${bossId}`, sectionId);

export const buildLorePath = (articleId: string, sectionId?: string): string =>
  withSection(`${LORE_PATH}/${articleId}`, sectionId);

export const buildCompendiumPath = (ref: CompendiumRef, sectionId?: string): string =>
  ref.kind === "boss" ? buildBossPath(ref.id, sectionId) : buildLorePath(ref.id, sectionId);
