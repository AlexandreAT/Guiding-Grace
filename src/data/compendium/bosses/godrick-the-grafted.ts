import { paragraph } from "../../contentBlocks";
import type { BossGuide } from "../types";

export const GODRICK_THE_GRAFTED: BossGuide = {
  id: "godrick-the-grafted",
  name: "Godrick, o Enxertado",
  englishName: "Godrick the Grafted",
  aliases: ["Godrick", "o Enxertado"],
  regionId: "limgrave-top",
  objectiveId: "limgrave-boss-1",
  importance: "main",
  summary:
    "Senhor de Limgrave e primeiro Semideus portador de Grande Runa que você enfrenta, no topo do Castelo Tempesvéu.",
  rewards: ["Lembrança do Enxertado", "Grande Runa de Godrick"],
  pendingReview:
    "Rascunho do agente (fatos conferidos na Eldenpedia, texto próprio): revisar estratégia, lore e os nomes das recompensas.",
  sections: [
    {
      id: "strategy",
      title: "Estratégia",
      icon: "sword",
      blocks: [
        paragraph(
          "A luta tem duas fases. Na segunda, Godrick enxerta uma cabeça de dragão no próprio braço e passa a cuspir fogo, os seus outros ataques que eram relacionados a vento, agora trocam para fogo: fique fora da frente das baforadas e ataque no fim de cada sequência de golpes.",
        ),
        paragraph(
          "Nepheli Loux pode ser invocada se você tiver falado com ela dentro do castelo; o sinal de invocação fica do lado de fora da arena.",
        ),
        paragraph(
          "Ele não tem resistência especial a dano físico, e efeitos como Hemorragia funcionam normalmente. Loucura não tem efeito nele.",
        ),
        paragraph(
          "No inicio da segunda fase, Godrick começa a batalha cuspindo fogo, nesse momento é possível correr reto para cima dele pois o fogo não chega a tempo, e o braço de dragão não tem hitbox nesse momento, dando uma boa abertura para golpes já no inicio da segunda fase.",
        ),
      ],
      sources: [{ type: "game-data", dataset: "eldenpedia" }],
    },
    {
      id: "origin",
      title: "Origem",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Godrick descende da Linhagem Dourada, iniciada por Marika e seu primeiro consorte, Godfrey, mas é um parente distante: seu sangue divino é diluído, e ele era visto como o mais fraco dos Semideuses.",
        ),
        paragraph(
          "Para compensar, pratica o Enxerto, anexando ao próprio corpo partes de outros seres em busca de poder.",
        ),
      ],
      sources: [
        { type: "dialogue", character: "Leitora de Dedos Enia" },
        { type: "item-description", item: "Grande Runa de Godrick" },
      ],
    },
    {
      id: "after-the-battle",
      title: "Depois da batalha",
      icon: "book",
      certainty: "explicit",
      gate: { afterObjectiveId: "limgrave-boss-1" },
      blocks: [
        paragraph(
          "Com Godrick derrotado, Limgrave fica sem senhor, porém é possível ir atrás de um novo(a) governante para o castélo, conversando com Kenneth Haight e seguindo a missão da própria Nepheli Loux.",
        ),
      ],
      sources: [{ type: "dialogue", character: "Kenneth Haight" }],
    },
  ],
  related: [
    { kind: "boss", id: "margit-the-fell-omen" },
    { kind: "lore", id: "elden-ring" },
    { kind: "lore", id: "golden-order" },
    { kind: "lore", id: "marika" },
  ],
};
