import { describe, expect, it } from "vitest";
import { BOSSES } from "../../src/data/compendium/bosses";
import { getBossSectionGates, getLoreSectionGates } from "../../src/data/compendium/knowledge";
import { LORE_ARTICLES } from "../../src/data/compendium/lore";
import { getGuideIndex } from "./guideIndex";
import { areGatesOpen, isChunkAllowed, toKnowledgeProgress, type PlayerProgress } from "./progressGuard";
import { respondLocally } from "./respond";
import { getSuggestedQuestions } from "./suggestions";
import { createTestContext } from "./testContext";

const index = getGuideIndex();

const progressWith = (visitedRegionIds: string[], completedIds: string[] = []): PlayerProgress =>
  toKnowledgeProgress([{ buildId: "quality-build", buildName: "Build de Qualidade", visitedRegionIds, completedIds }]);

const PROGRESS_CASES: Record<string, PlayerProgress> = {
  começo: progressWith([]),
  "Limgrave visitada": progressWith(["limgrave-top", "limgrave-bottom"]),
  "Godrick derrotado": progressWith(["limgrave-top", "limgrave-bottom"], ["limgrave-boss-1"]),
};

const findChunk = (chunkId: string) => index.chunks.find((chunk) => chunk.chunkId === chunkId);

describe("regra única de conhecimento (página × Gideon)", () => {
  it.each(Object.entries(PROGRESS_CASES))("decide igual para a página e para o Gideon: %s", (_, progress) => {
    BOSSES.forEach((boss) =>
      boss.sections.forEach((section) => {
        const chunk = findChunk(`boss:${boss.id}:${section.id}`);
        expect(chunk && isChunkAllowed(chunk, progress)).toBe(areGatesOpen(getBossSectionGates(boss, section), progress));
      }),
    );
    LORE_ARTICLES.forEach((article) =>
      article.sections.forEach((section) => {
        const chunk = findChunk(`lore:${article.id}:${section.id}`);
        expect(chunk && isChunkAllowed(chunk, progress)).toBe(
          areGatesOpen(getLoreSectionGates(article, section), progress),
        );
      }),
    );
  });

  it("libera a seção de depois da batalha só com o chefe derrotado", () => {
    const afterBattle = findChunk("boss:godrick-the-grafted:after-the-battle");
    expect(afterBattle && isChunkAllowed(afterBattle, PROGRESS_CASES["Limgrave visitada"])).toBe(false);
    expect(afterBattle && isChunkAllowed(afterBattle, PROGRESS_CASES["Godrick derrotado"])).toBe(true);
  });
});

describe("Compêndio no Gideon", () => {
  const ask = (question: string, context = createTestContext()) =>
    respondLocally(index, { question, context, previousSourceIds: [] });

  it("responde fraqueza com os dados importados e aponta para a página do chefe", () => {
    const response = ask("qual a fraqueza de godrick?");
    expect(response.sources[0].chunkId).toBe("boss:godrick-the-grafted:game-data");
    expect(response.sources[0].action).toEqual({
      type: "OPEN_ROUTE",
      label: "Abrir no Compêndio",
      path: "/bosses/godrick-the-grafted?section=game-data",
    });
  });

  it("bloqueia chefe de região não alcançada, mesmo com a página dele aberta na tela", () => {
    const onRadahnPage = createTestContext({ routeType: "boss", entity: { kind: "boss", id: "starscourge-radahn" } });
    const response = ask("qual a fraqueza do radahn?", onRadahnPage);

    expect(response.status).toBe("spoiler_blocked");
    expect(response.sources).toHaveLength(0);
  });

  it("traz as relações escritas pelo autor como trechos relacionados", () => {
    const response = ask("o que é a noite das facas negras?");
    const relatedIds = response.related?.map((source) => source.chunkId) ?? [];
    expect(relatedIds).toContain("lore:elden-ring:summary");
  });

  it("responde \"como vencer\" com a estratégia e os dados de combate do chefe, sem outros assuntos", () => {
    const response = ask("qual a melhor forma de derrotar o godrick?");
    expect(response.sources.map((source) => source.chunkId)).toEqual([
      "boss:godrick-the-grafted:strategy",
      "boss:godrick-the-grafted:game-data",
      "boss:godrick-the-grafted:summary",
    ]);
    expect(response.related).toBeUndefined();
    // Os números vão prontos na orientação: a IA não escolhe nem arredonda
    expect(response.guidance).toContain("HP: 6.080.");
    expect(response.guidance).toContain("Sagrado 40%");
  });

  it("acha os dois lados de uma relação, mesmo com o nome escrito errado e só citado nos textos", () => {
    const response = ask("godrick tem alguma ligação com godwin?");
    const ids = response.sources.map((source) => source.chunkId);

    // O lado de Godrick é o trecho que cita Marika, o elo com o trecho de Godwyn
    expect(ids).toContain("boss:godrick-the-grafted:origin");
    expect(ids).toContain("lore:night-of-black-knives:what-happened");
    // O elo vem do código (o nome que aparece dos dois lados); a IA só o diz como suposição
    expect(response.guidance).toContain("O elo que aparece dos dois lados é Marika");
    expect(response.guidance).toContain("Ao que tudo indica");
  });

  it("na resposta completa, manda à IA as outras seções liberadas do mesmo assunto", () => {
    const response = respondLocally(index, {
      question: "Me explique a história completa de Godrick, o Enxertado.",
      context: createTestContext(),
      previousSourceIds: [],
      interpretation: { type: "follow_up", subjects: ["Godrick, o Enxertado"], detail: "full" },
    });
    const ids = [...response.sources, ...(response.related ?? [])].map((source) => source.chunkId);

    expect(ids).toEqual(expect.arrayContaining(["boss:godrick-the-grafted:origin", "boss:godrick-the-grafted:strategy"]));
    // "Depois da batalha" só com Godrick derrotado: nem a resposta completa a inclui antes disso
    expect(ids).not.toContain("boss:godrick-the-grafted:after-the-battle");
  });

  it("sugere perguntas sobre o chefe aberto, sem sugerir o que ainda é spoiler", () => {
    const godrickPage = createTestContext({ routeType: "boss", entity: { kind: "boss", id: "godrick-the-grafted" } });
    const radahnPage = createTestContext({ routeType: "boss", entity: { kind: "boss", id: "starscourge-radahn" } });

    expect(getSuggestedQuestions(index, godrickPage)).toContain("Qual a fraqueza de Godrick, o Enxertado?");
    expect(getSuggestedQuestions(index, radahnPage).join(" ")).not.toMatch(/Radahn/);
  });
});
