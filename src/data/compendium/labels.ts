import type { BossImportance, Certainty, LoreCategory } from "./types";

export const CERTAINTY_LABELS: Record<Certainty, string> = {
  explicit: "Afirmado pelo jogo",
  inferred: "Fortemente sugerido",
  interpretation: "Interpretação",
};

export const IMPORTANCE_LABELS: Record<BossImportance, string> = {
  main: "Progressão principal",
  remembrance: "Chefe de Lembrança",
  optional: "Opcional",
};

export const LORE_CATEGORY_LABELS: Record<LoreCategory, string> = {
  concept: "Conceitos",
  character: "Personagens",
  event: "Eventos",
  faction: "Facções e religiões",
  place: "Lugares",
};
