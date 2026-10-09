import { describe, expect, it } from "vitest";
import { mapEldenpediaBoss, type EldenpediaPage } from "./mapper";

// Trechos reais de páginas da Eldenpedia (só o infobox, que é o que o importador lê)
const GODRICK: EldenpediaPage = {
  title: "Godrick the Grafted",
  revid: 101166,
  wikitext: `Texto da página que não é importado.
==Boss Fight==
{{Infobox Boss
|image = <gallery>
ER Godrick Phase 1.png|Phase 1
ER Godrick Phase 2.png|Phase 2
</gallery>
|location = [[Stormveil Castle]]
|hp= 6,080
|runes= 20,000
|drops= [[Remembrance of the Grafted]]<br>
[[Godrick's Great Rune]]
| res standard  = 0
| res magic     = 20
| res holy      = 40
| res poison    = 318 / 416 / 706 / 1163
| res madness   = Immune
}}`,
};

// Rennala separa as fases em dois infoboxes; Margit usa "%" e lista dois encontros no mesmo campo
const RENNALA: EldenpediaPage = {
  title: "Rennala, Queen of the Full Moon",
  revid: 101183,
  wikitext: `{{Infobox Boss
|hp= 3,493
| res magic     = 80
}}
{{Infobox Boss
|hp= 4,097
|runes= 40,000
|drops= [[Remembrance of the Full Moon Queen]]<br>
| res magic     = 80
| res fire      = 40
}}`,
};

const MARGIT: EldenpediaPage = {
  title: "Margit, the Fell Omen",
  revid: 100474,
  wikitext: `{{Infobox Boss
|hp=Limgrave:
4,174
|res slash=-10%
|res poison=316 (Stormveil) <br> 332 (Capital Outskirts)
|res sleep=Immune
}}`,
};

const IMPORTED_AT = "2026-10-08T12:00:00.000Z";

describe("mapEldenpediaBoss", () => {
  it("converte o infobox no formato interno, com o id nosso e a proveniência da página", () => {
    const data = mapEldenpediaBoss(GODRICK, "godrick-the-grafted", IMPORTED_AT);

    expect(data).toEqual({
      id: "godrick-the-grafted",
      hp: [6080],
      runes: 20000,
      negations: { standard: 0, magic: 20, holy: 40 },
      statusResistances: { poison: [318, 416, 706, 1163], madness: "immune" },
      drops: ["Remembrance of the Grafted", "Godrick's Great Rune"],
      externalIds: { eldenpedia: "Godrick the Grafted" },
      provenance: {
        source: "eldenpedia",
        url: "https://eldenring.wiki.gg/wiki/Godrick_the_Grafted",
        revision: "101166",
        importedAt: IMPORTED_AT,
      },
    });
  });

  it("guarda o HP de cada fase e usa a última fase para runas, recompensas e resistências", () => {
    const data = mapEldenpediaBoss(RENNALA, "rennala-queen-of-the-full-moon", IMPORTED_AT);

    expect(data.hp).toEqual([3493, 4097]);
    expect(data.runes).toBe(40000);
    expect(data.negations).toEqual({ magic: 80, fire: 40 });
  });

  it("lê porcentagens, imunidade e o primeiro encontro quando a página lista vários", () => {
    const data = mapEldenpediaBoss(MARGIT, "margit-the-fell-omen", IMPORTED_AT);

    expect(data.hp).toEqual([4174]);
    expect(data.negations).toEqual({ slash: -10 });
    expect(data.statusResistances).toEqual({ poison: [316], sleep: "immune" });
  });

  it("falha quando a página não tem infobox de chefe", () => {
    expect(() =>
      mapEldenpediaBoss({ title: "Runes", revid: 1, wikitext: "Sem infobox" }, "x", IMPORTED_AT),
    ).toThrow(/Infobox Boss/);
  });
});
