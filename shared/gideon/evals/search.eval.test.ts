import { describe, expect, it } from "vitest";
import { getGuideIndex } from "../guideIndex";
import { respondLocally } from "../respond";
import { createTestContext } from "../testContext";
import { SEARCH_CASES } from "./searchCases";

const HOME_CONTEXT = createTestContext();

const ask = (question: string) =>
  respondLocally(getGuideIndex(), { question, context: HOME_CONTEXT, previousSourceIds: [] });

const matches = (chunkId: string, expected: string[]) =>
  expected.some((suffix) => chunkId.endsWith(`:${suffix}`));

describe("avaliação da busca", () => {
  const covered = SEARCH_CASES.filter((testCase) => testCase.expected.length > 0);
  const uncovered = SEARCH_CASES.filter((testCase) => testCase.expected.length === 0);

  it("encontra o trecho esperado entre as fontes (Recall@1 e Recall@3)", () => {
    const misses: string[] = [];
    let hitsAt1 = 0;
    let hitsAt3 = 0;

    covered.forEach(({ question, expected }) => {
      const sourceIds = ask(question).sources.map((source) => source.chunkId);
      if (sourceIds[0] && matches(sourceIds[0], expected)) hitsAt1++;
      if (sourceIds.slice(0, 3).some((chunkId) => matches(chunkId, expected))) {
        hitsAt3++;
      } else {
        misses.push(`${question} → ${sourceIds.join(", ") || "(sem fontes)"}`);
      }
    });

    const recallAt1 = hitsAt1 / covered.length;
    const recallAt3 = hitsAt3 / covered.length;
    console.info(
      `Recall@1: ${(recallAt1 * 100).toFixed(1)}% | Recall@3: ${(recallAt3 * 100).toFixed(1)}% | ${covered.length} perguntas`,
    );
    if (misses.length > 0) console.info(`Erros:\n${misses.join("\n")}`);

    expect(recallAt3).toBeGreaterThanOrEqual(0.9);
  });

  it.each(uncovered)("responde que não cobre: $question", ({ question }) => {
    expect(ask(question).status).toBe("not_covered");
  });
});
