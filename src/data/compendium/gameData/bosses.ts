import type { BossGameData } from "../types";

// Gerado por "npm run content:import -- bosses": não editar à mão (o texto editorial fica em ../bosses)
export const BOSS_GAME_DATA: Record<string, BossGameData> = {
  "margit-the-fell-omen": {
    "id": "margit-the-fell-omen",
    "hp": [
      4174
    ],
    "runes": 12000,
    "negations": {
      "standard": 0,
      "strike": 0,
      "slash": -10,
      "pierce": 0,
      "magic": 0,
      "fire": 0,
      "lightning": 0,
      "holy": 40
    },
    "statusResistances": {
      "poison": [
        316
      ],
      "rot": [
        316
      ],
      "bleed": [
        316
      ],
      "frost": [
        316
      ],
      "sleep": "immune",
      "madness": "immune",
      "death": "immune"
    },
    "drops": [
      "Talisman Pouch",
      "Viridian Amber Medallion"
    ],
    "externalIds": {
      "eldenpedia": "Margit, the Fell Omen"
    },
    "provenance": {
      "source": "eldenpedia",
      "url": "https://eldenring.wiki.gg/wiki/Margit%2C_the_Fell_Omen",
      "revision": "100474",
      "importedAt": "2026-10-08T14:46:17.634Z"
    }
  },
  "godrick-the-grafted": {
    "id": "godrick-the-grafted",
    "hp": [
      6080
    ],
    "runes": 20000,
    "negations": {
      "standard": 0,
      "strike": 0,
      "slash": 0,
      "pierce": 0,
      "magic": 20,
      "fire": 20,
      "lightning": 20,
      "holy": 40
    },
    "statusResistances": {
      "poison": [
        318,
        416,
        706,
        1163
      ],
      "rot": [
        318,
        416,
        706,
        1163
      ],
      "bleed": [
        318,
        416,
        706,
        1163
      ],
      "frost": [
        318,
        416,
        706,
        1163
      ],
      "sleep": [
        318,
        416,
        706,
        1163
      ],
      "madness": "immune"
    },
    "drops": [
      "Remembrance of the Grafted",
      "Godrick's Great Rune"
    ],
    "externalIds": {
      "eldenpedia": "Godrick the Grafted"
    },
    "provenance": {
      "source": "eldenpedia",
      "url": "https://eldenring.wiki.gg/wiki/Godrick_the_Grafted",
      "revision": "101166",
      "importedAt": "2026-10-08T14:46:19.005Z"
    }
  },
  "rennala-queen-of-the-full-moon": {
    "id": "rennala-queen-of-the-full-moon",
    "hp": [
      3493,
      4097
    ],
    "runes": 40000,
    "negations": {
      "standard": -10,
      "strike": 0,
      "slash": -10,
      "pierce": -10,
      "magic": 80,
      "fire": 40,
      "lightning": 40,
      "holy": 40
    },
    "statusResistances": {
      "poison": [
        534,
        824,
        1281
      ],
      "rot": [
        534,
        824,
        1281
      ],
      "bleed": [
        326,
        424,
        714,
        1171
      ],
      "frost": [
        534,
        824,
        1281
      ],
      "sleep": "immune",
      "madness": "immune"
    },
    "drops": [
      "Remembrance of the Full Moon Queen",
      "Great Rune of The Unborn"
    ],
    "externalIds": {
      "eldenpedia": "Rennala, Queen of the Full Moon"
    },
    "provenance": {
      "source": "eldenpedia",
      "url": "https://eldenring.wiki.gg/wiki/Rennala%2C_Queen_of_the_Full_Moon",
      "revision": "101183",
      "importedAt": "2026-10-08T14:46:20.504Z"
    }
  },
  "starscourge-radahn": {
    "id": "starscourge-radahn",
    "hp": [
      9572
    ],
    "runes": 70000,
    "negations": {
      "standard": 10,
      "strike": 10,
      "slash": 10,
      "pierce": 0,
      "magic": 20,
      "fire": 20,
      "lightning": 20,
      "holy": 40
    },
    "statusResistances": {
      "poison": [
        334,
        432,
        722,
        1179
      ],
      "rot": [
        243,
        285,
        383,
        673
      ],
      "bleed": [
        334,
        432,
        722,
        1179
      ],
      "frost": [
        334,
        432,
        722,
        1179
      ],
      "sleep": [
        548,
        838,
        1295
      ],
      "madness": "immune"
    },
    "drops": [
      "Remembrance of the Starscourge",
      "Radahn's Great Rune"
    ],
    "externalIds": {
      "eldenpedia": "Starscourge Radahn"
    },
    "provenance": {
      "source": "eldenpedia",
      "url": "https://eldenring.wiki.gg/wiki/Starscourge_Radahn",
      "revision": "101186",
      "importedAt": "2026-10-08T14:46:22.025Z"
    }
  }
};
