import { describe, expect, it } from "vitest";
import { getBlockText } from "../contentBlocks";
import { regionSections } from "../regionSections";
import { BOSSES } from "./bosses";
import { BOSS_GAME_DATA } from "./gameData/bosses";
import { LORE_ARTICLES } from "./lore";
import type { BossGuide, LoreArticle } from "./types";
import { validateCompendium } from "./validate";

const content = { bosses: BOSSES, lore: LORE_ARTICLES, bossGameData: BOSS_GAME_DATA };

describe("Compêndio", () => {
  it("passa na validação (ids, relações, gates, certezas e dados importados)", () => {
    expect(validateCompendium(content).errors).toEqual([]);
  });

  it("registra todo arquivo de chefe e de artigo", () => {
    const bossModules = import.meta.glob<Record<string, BossGuide>>("./bosses/!(index).ts", { eager: true });
    const loreModules = import.meta.glob<Record<string, LoreArticle>>("./lore/!(index).ts", { eager: true });
    const exportedIds = (modules: Record<string, Record<string, { id: string }>>) =>
      Object.values(modules).flatMap((module) => Object.values(module).map((entry) => entry.id)).sort();

    expect(exportedIds(bossModules)).toEqual(BOSSES.map((boss) => boss.id).sort());
    expect(exportedIds(loreModules)).toEqual(LORE_ARTICLES.map((article) => article.id).sort());
  });

  it("monta a lore da região Geral a partir dos artigos, com o mesmo texto e um link para cada um", () => {
    const section = regionSections.geral.find((regionSection) => regionSection.fromLore);
    const guideTexts = section?.content.flatMap((item) => (item.text ? [item.text] : [])) ?? [];
    const articleTexts = LORE_ARTICLES.filter((article) => article.guideTopic).flatMap((article) => [
      article.guideTopic,
      ...article.sections.flatMap((articleSection) => articleSection.blocks.map(getBlockText)),
    ]);

    expect(guideTexts).toEqual(articleTexts);
    expect(section?.content.filter((item) => item.parts?.[0].type === "route")).toHaveLength(
      LORE_ARTICLES.filter((article) => article.guideTopic).length,
    );
  });

  it("aponta erros de conteúdo: lore sem certeza, relação quebrada e gate para região inexistente", () => {
    const article = LORE_ARTICLES[0];
    const broken: LoreArticle = {
      ...article,
      id: "artigo-quebrado",
      gate: { regionId: "regiao-que-nao-existe" },
      sections: [{ ...article.sections[0], certainty: undefined }],
      related: [{ kind: "boss", id: "chefe-que-nao-existe" }],
    };

    const { errors } = validateCompendium({ ...content, lore: [...LORE_ARTICLES, broken] });

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("seção de lore sem certeza"),
        expect.stringContaining("relação com boss inexistente"),
        expect.stringContaining("região inexistente no gate"),
      ]),
    );
  });

  it("recusa material com licença sem crédito e dado importado de fonte não creditada", () => {
    const boss = BOSSES[0];
    const withUncreditedSource: BossGuide = {
      ...boss,
      sections: [
        {
          ...boss.sections[0],
          sources: [{ type: "external", name: "Wiki", url: "https://outra-wiki.example/pagina", license: "CC BY-SA 3.0" }],
        },
      ],
    };
    const [firstId] = Object.keys(BOSS_GAME_DATA);
    const fromUnknownSource = {
      ...BOSS_GAME_DATA,
      [firstId]: { ...BOSS_GAME_DATA[firstId], provenance: { ...BOSS_GAME_DATA[firstId].provenance, source: "fonte-x" } },
    };

    const { errors } = validateCompendium({
      ...content,
      bosses: BOSSES.map((entry) => (entry.id === boss.id ? withUncreditedSource : entry)),
      bossGameData: fromUnknownSource,
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("fonte CC BY-SA 3.0 sem crédito"),
        expect.stringContaining("fonte \"fonte-x\" sem crédito"),
      ]),
    );
  });

  it("lista o que ainda espera revisão do autor", () => {
    const { pendingReview } = validateCompendium(content);
    expect(pendingReview.length).toBe(
      [...BOSSES, ...LORE_ARTICLES].filter((entry) => entry.pendingReview).length,
    );
  });
});
