import type { LoreArticle } from "../types";
import { DESTINED_DEATH } from "./destined-death";
import { ELDEN_RING } from "./elden-ring";
import { EMPYREANS } from "./empyreans";
import { GOLDEN_ORDER } from "./golden-order";
import { GRACE } from "./grace";
import { MARIKA } from "./marika";
import { NIGHT_OF_BLACK_KNIVES } from "./night-of-black-knives";
import { OTHER_FAITHS } from "./other-faiths";
import { RANNI } from "./ranni";
import { SHATTERING } from "./shattering";
import { TARNISHED } from "./tarnished";

// Os artigos com guideTopic seguem a ordem de leitura do guia da região "Geral", que os monta
// (src/data/compendium/loreGuide.ts); os demais existem só no Compêndio
export const LORE_ARTICLES: LoreArticle[] = [
  TARNISHED,
  GOLDEN_ORDER,
  ELDEN_RING,
  NIGHT_OF_BLACK_KNIVES,
  SHATTERING,
  EMPYREANS,
  OTHER_FAITHS,
  GRACE,
  MARIKA,
  DESTINED_DEATH,
  RANNI,
];

export const getLoreArticle = (articleId: string): LoreArticle | undefined =>
  LORE_ARTICLES.find((article) => article.id === articleId);
