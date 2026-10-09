import { paragraph } from "../../contentBlocks";
import type { BossGuide } from "../types";

export const RENNALA_QUEEN_OF_THE_FULL_MOON: BossGuide = {
  id: "rennala-queen-of-the-full-moon",
  name: "Rennala, Rainha da Lua Cheia",
  englishName: "Rennala, Queen of the Full Moon",
  aliases: ["Rennala", "Rainha da Lua Cheia"],
  regionId: "liurnia",
  importance: "remembrance",
  summary: "Rainha de Caria e mãe de Ranni e Radahn, enfrentada em duas fases na Academia de Raya Lucaria.",
  rewards: ["Lembrança da Rainha da Lua Cheia", "Grande Runa do Não Nascido"],
  pendingReview: "Rascunho do agente: revisar resumo, estratégia e o nome da recompensa.",
  sections: [
    {
      id: "strategy",
      title: "Estratégia",
      icon: "sword",
      blocks: [
        paragraph(
          "Na primeira fase, Rennala fica protegida por uma barreira: derrube os estudantes que brilham em dourado para quebrá-la, você vai conseguir achar eles mais fácil pelo som, a música cantada é maior no estudante que brilha dourado. A segunda fase é uma luta de magia direta, em que ela resiste bem a dano mágico.",
        ),
        paragraph(
          "Na segunda fase, ela começa a fazer invocações de vários tipos de inimigos, referenciando a aliança que a fámilia dela tem com as diferentes raças desse mundo. Após um certo tempo os espiritos invocados desaparecem, então uma das estratégias segura é correr para longe de Rennala quando ela invoca os espiritos, e depois voltar para ela pois a invocação vai desaparecer até você chegar na Rennala, outra estratégia é simplemente ficar correndo na arena até os espiritos desaparecerem.",
        ),
        paragraph(
          "Evite ao máximo usar magias contra a Rennala, ela é extremamente resistênte a isso. Foque em ataques comuns, ela tem fraqueza contra elas.",
        ),
      ],
    },
  ],
  related: [
    { kind: "boss", id: "starscourge-radahn" },
    { kind: "lore", id: "ranni" },
  ],
};
