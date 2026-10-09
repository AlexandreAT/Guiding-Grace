import { buildLorePath } from "../../routes/compendiumRoute";
import { getBlockText, type ContentBlock } from "../contentBlocks";
import type { ContentItem, RegionSection } from "../regionSections";
import { LORE_ARTICLES } from "./lore";
import type { LoreArticle } from "./types";

// Parágrafo comum vira texto normal; destaque sem título volta a ser o "highlight" do guia
const toGuideItem = (block: ContentBlock): ContentItem =>
  block.type === "callout" && !block.title
    ? { style: "highlight", text: block.text }
    : { style: "normal", text: getBlockText(block) };

const toGuideItems = (article: LoreArticle): ContentItem[] => [
  { style: "topic", text: article.guideTopic ?? article.title },
  ...article.sections.flatMap((section) => section.blocks.map(toGuideItem)),
  { style: "normal", parts: [{ type: "route", text: "Ler no Compêndio", href: buildLorePath(article.id) }] },
];

// A lore da região "Geral" vive nos artigos do Compêndio: o guia só monta os mesmos textos, na mesma ordem
export const buildLoreGuideSection = (title: string): RegionSection => ({
  title,
  fromLore: true,
  content: LORE_ARTICLES.filter((article) => article.guideTopic).flatMap(toGuideItems),
});
