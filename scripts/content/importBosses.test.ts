import { describe, expect, it } from "vitest";
import { BOSSES } from "../../src/data/compendium/bosses";
import type { BossGameData } from "../../src/data/compendium/types";
import { importBosses } from "./importBosses";
import type { BossDataImporter } from "./importers/types";

const godrick = BOSSES.find((boss) => boss.id === "godrick-the-grafted")!;
const margit = BOSSES.find((boss) => boss.id === "margit-the-fell-omen")!;

const gameData = (id: string, externalId: string, hp: number): BossGameData => ({
  id,
  hp: [hp],
  negations: { standard: 0 },
  statusResistances: {},
  drops: [],
  externalIds: { test: externalId },
  provenance: { source: "test", url: `https://example.test/${externalId}`, revision: "1", importedAt: "2026-10-08" },
});

const EXISTING = { [godrick.id]: gameData(godrick.id, "Pagina Renomeada do Godrick", 6080) };

describe("importBosses", () => {
  it("reimporta pela página já registrada e mantém o id interno", async () => {
    const requests: string[] = [];
    const importer: BossDataImporter = {
      source: "test",
      importBoss: async ({ id, externalId }) => {
        requests.push(externalId);
        return gameData(id, externalId, 7000);
      },
    };

    const result = await importBosses([godrick], BOSSES, EXISTING, importer);

    expect(requests).toEqual(["Pagina Renomeada do Godrick"]);
    expect(result.data?.[godrick.id].hp).toEqual([7000]);
    expect(Object.keys(result.data ?? {})).toEqual([godrick.id]);
  });

  it("não devolve nada para gravar quando a fonte falha, preservando os dados existentes", async () => {
    const importer: BossDataImporter = {
      source: "test",
      importBoss: async ({ id, externalId }) => {
        if (id === margit.id) throw new Error("fonte fora do ar");
        return gameData(id, externalId, 7000);
      },
    };

    const result = await importBosses([godrick, margit], BOSSES, EXISTING, importer);

    expect(result.data).toBeUndefined();
    expect(result.failures).toEqual([`${margit.id}: fonte fora do ar`]);
    expect(EXISTING[godrick.id].hp).toEqual([6080]);
  });

  it("recusa dados que trocam o id interno ou vêm sem números", async () => {
    const importer: BossDataImporter = {
      source: "test",
      importBoss: async ({ externalId }) => ({ ...gameData("outro-id", externalId, 1), hp: [] }),
    };

    const result = await importBosses([godrick], BOSSES, {}, importer);

    expect(result.data).toBeUndefined();
    expect(result.failures[0]).toContain("id interno trocado");
  });
});
