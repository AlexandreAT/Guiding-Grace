import { describe, expect, it } from "vitest";
import { regionPins } from "../../src/data/regionPins";
import { REGIONS } from "../../src/data/regions";
import { getTrackableIdsForRegion, regionSections } from "../../src/data/regionSections";
import { buildGuideIndex } from "./buildGuideIndex";
import { getGuideIndex } from "./guideIndex";
import { isChunkAllowed, toKnowledgeProgress } from "./progressGuard";

describe("buildGuideIndex", () => {
  const index = getGuideIndex();

  it("gera ids de trecho únicos", () => {
    const ids = index.chunks.map((chunk) => chunk.chunkId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("deixa o texto das regiões \"Em breve\" fora do índice", () => {
    const lockedIds = new Set(REGIONS.filter((region) => region.disabled).map((region) => region.id));
    expect(
      index.chunks.some((chunk) => chunk.kind === "region" && chunk.regionId && lockedIds.has(chunk.regionId)),
    ).toBe(false);
  });

  it("mantém chefes de regiões \"Em breve\" no índice, mas bloqueados para quem ainda não chegou lá", () => {
    const radahn = index.chunks.filter((chunk) => chunk.entity?.id === "starscourge-radahn");
    const everyAvailableRegion = toKnowledgeProgress([
      {
        buildId: "quality-build",
        buildName: "Build de Qualidade",
        visitedRegionIds: REGIONS.filter((region) => !region.disabled).map((region) => region.id),
        completedIds: [],
      },
    ]);

    expect(radahn.length).toBeGreaterThan(0);
    expect(radahn.some((chunk) => isChunkAllowed(chunk, everyAvailableRegion))).toBe(false);
  });

  it("só aponta pins que existem na região do trecho", () => {
    index.chunks
      .filter((chunk) => chunk.pinId)
      .forEach((chunk) => {
        const pinIds = (regionPins[chunk.regionId ?? ""] ?? []).map((pin) => pin.id);
        expect(pinIds).toContain(chunk.pinId);
      });
  });

  it("tem exatamente os mesmos objetivos do checklist", () => {
    REGIONS.filter((region) => !region.disabled).forEach((region) => {
      const objectives = index.chunks
        .filter((chunk) => chunk.regionId === region.id && chunk.objectiveId)
        .map((chunk) => chunk.objectiveId);
      expect(objectives).toEqual(getTrackableIdsForRegion(region.id));
    });
  });

  it("não inclui o texto escondido atrás de tarjas de spoiler", () => {
    expect(index.chunks.some((chunk) => chunk.text.includes("Clique aqui para revelar"))).toBe(false);
  });

  it("gera a mesma versão para os mesmos dados e outra quando o conteúdo muda", () => {
    const sources = { regions: REGIONS, sections: regionSections, pins: regionPins, mechanics: [] };
    const changed = {
      ...sources,
      sections: {
        ...regionSections,
        "limgrave-top": [{ title: "Nova seção", content: [{ style: "normal" as const, text: "Texto novo." }] }],
      },
    };

    expect(buildGuideIndex(sources).version).toBe(buildGuideIndex(sources).version);
    expect(buildGuideIndex(changed).version).not.toBe(buildGuideIndex(sources).version);
  });
});
