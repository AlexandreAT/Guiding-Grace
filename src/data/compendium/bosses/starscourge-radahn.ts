import { paragraph } from "../../contentBlocks";
import type { BossGuide } from "../types";

export const STARSCOURGE_RADAHN: BossGuide = {
  id: "starscourge-radahn",
  name: "Flagelo Estelar Radahn",
  englishName: "Starscourge Radahn",
  aliases: ["Radahn", "General Radahn"],
  regionId: "caelid-first",
  importance: "remembrance",
  summary: "Semideus e general de Caelid, filho de Rennala e Radagon, enfrentado durante o Festival de Radahn.",
  rewards: ["Lembrança do Flagelo Estelar", "Grande Runa de Radahn"],
  sections: [
    {
      id: "strategy",
      title: "Estratégia",
      icon: "sword",
      blocks: [
        paragraph(
          "A batalha começa com Radahn atacando de longe com flechas gravitacionais. Esquive enquanto avança pela arena e invoque os guerreiros disponíveis nos sinais dourados. Se algum aliado morrer, novos sinais poderão aparecer para invocá-lo novamente.",
        ),
        paragraph(
          "Radahn possui ataques amplos e muito poderosos, mas os aliados podem distrair sua atenção enquanto você ataca. Na segunda fase, ele desaparece no céu e retorna como um meteoro. Quando isso acontecer, monte em Torrente e se movimente para escapar do impacto.",
        ),
        paragraph(
          "Uma das formas mais fáceis de derrotá-lo é utilizando Podridão Escarlate, pois Radahn é vulnerável a esse efeito. Aplique a condição e mantenha distância enquanto seus aliados o distraem. Hemorragia também funciona muito bem contra ele.",
        ),
      ],
      sources: [{ type: "game-data", dataset: "eldenpedia" }],
    },
    {
      id: "general",
      title: "O General Radahn",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Radahn era reconhecido como um dos Semideuses mais poderosos das Terras Intermédias, sendo admirado por sua força e habilidade em combate. Seu exército, conhecido como Juba Vermelha, demonstrava uma enorme lealdade ao general.",
        ),
        paragraph(
          "Desde criança, Radahn admirava Godfrey, o primeiro Lorde Prístino, e buscava seguir seu exemplo como guerreiro. Apesar de seu tamanho absurdo, também era muito apegado ao seu cavalo Leonard, por isso estudou magia gravitacional para conseguir continuar montando nele sem esmagá-lo.",
        ),
        paragraph(
          "Mais tarde, seu domínio da magia gravitacional foi muito além disso. Radahn chegou a enfrentar as próprias estrelas e interromper seu movimento, conquistando o título de Flagelo Estelar. Mesmo após perder a razão, sua magia continuou mantendo as estrelas imóveis.",
        ),
      ],
      sources: [
        { type: "item-description", item: "Armadura do Leão de Radahn" },
        { type: "item-description", item: "Lembrança do Flagelo Estelar" },
        { type: "item-description", item: "Talismã Herança do Flagelo Estelar" },
      ],
    },
    {
      id: "war-with-malenia",
      title: "A guerra contra Malenia",
      icon: "flame",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Durante a Ruptura, Radahn enfrentou Malenia em uma batalha devastadora, que terminou sem um vencedor definitivo. Malenia libertou sua Podridão Escarlate, contaminando grande parte de Caelid. Radahn sobreviveu, mas teve seu corpo e sua mente consumidos pela doença, perdendo completamente a razão.",
        ),
        paragraph(
          "Mesmo após a queda do general, os soldados Juba Vermelha permaneceram em Caelid, utilizando fogo para combater a podridão e impedir que ela se espalhasse. Enquanto isso, Jerren organizou o Festival de Radahn, reunindo guerreiros para conceder ao antigo general uma morte honrada em batalha.",
        ),
      ],
      sources: [
        { type: "dialogue", character: "Jerren" },
        { type: "item-description", item: "Armadura do Cavaleiro Juba Vermelha" },
      ],
    },
  ],
  related: [
    { kind: "boss", id: "rennala-queen-of-the-full-moon" },
    { kind: "lore", id: "shattering" },
    { kind: "lore", id: "ranni" },
  ],
};
