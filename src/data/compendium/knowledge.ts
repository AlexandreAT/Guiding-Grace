import { getRegion } from "../regions";
import { getObjectiveTitle, type SpoilerGate } from "../regionSections";
import type { BossGuide, CompendiumSection, LoreArticle } from "./types";

// Motivo legível do bloqueio, mostrado na tarja de spoiler da página
export const describeGate = (gate: SpoilerGate): string => {
  const conditions = [
    gate.regionId ? `visitar ${getRegion(gate.regionId)?.name ?? gate.regionId}` : "",
    gate.afterObjectiveId ? `concluir ${getObjectiveTitle(gate.afterObjectiveId) ?? "um objetivo do guia"}` : "",
  ].filter(Boolean);
  return `Liberado ao ${conditions.join(" e ")}.`;
};

// Regra única de conhecimento do Compêndio: a página e o índice do Gideon usam exatamente estes gates.
// Todos precisam estar abertos (a avaliação fica em shared/gideon/progressGuard.ts)

// Chefe: alcançar a região dele (exceto nas regiões do início, liberadas como no guia), mais o gate da seção
export const getBossGates = (boss: BossGuide): SpoilerGate[] =>
  getRegion(boss.regionId)?.spoilerFree ? [] : [{ regionId: boss.regionId }];

export const getBossSectionGates = (boss: BossGuide, section: CompendiumSection): SpoilerGate[] => [
  ...getBossGates(boss),
  ...(section.gate ? [section.gate] : []),
];

// Lore: o gate do artigo (decisão obrigatória do autor), mais o gate próprio da seção
export const getLoreGates = (article: LoreArticle): SpoilerGate[] => (article.gate === "open" ? [] : [article.gate]);

export const getLoreSectionGates = (article: LoreArticle, section: CompendiumSection): SpoilerGate[] => [
  ...getLoreGates(article),
  ...(section.gate ? [section.gate] : []),
];
