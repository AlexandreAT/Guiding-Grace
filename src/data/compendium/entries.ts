import type { SpoilerGate } from "../regionSections";
import { getBoss } from "./bosses";
import { getBossGates, getLoreGates } from "./knowledge";
import { getLoreArticle } from "./lore";
import type { CompendiumRef } from "./types";

export interface CompendiumEntrySummary {
  ref: CompendiumRef;
  title: string;
  // Gates da entrada como um todo: decidem se o nome dela pode aparecer (relacionados, hubs)
  gates: SpoilerGate[];
}

export const getCompendiumEntry = (ref: CompendiumRef): CompendiumEntrySummary | undefined => {
  if (ref.kind === "boss") {
    const boss = getBoss(ref.id);
    return boss ? { ref, title: boss.name, gates: getBossGates(boss) } : undefined;
  }
  const article = getLoreArticle(ref.id);
  return article ? { ref, title: article.title, gates: getLoreGates(article) } : undefined;
};
