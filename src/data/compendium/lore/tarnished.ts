import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const TARNISHED: LoreArticle = {
  id: "tarnished",
  title: "Maculados",
  category: "concept",
  aliases: ["Maculado", "Tarnished"],
  summary: "Guerreiros expulsos das Terras Intermédias quando perderam a Graça. O jogador é um deles.",
  gate: "open",
  guideTopic: "O que é o maculado (Tarnished).",
  sections: [
    {
      id: "who-they-are",
      title: "A origem dos Maculados",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Godfrey foi um poderoso guerreiro que se tornou consorte da rainha Marika e o primeiro Lorde Prístino. Liderando os exércitos da Ordem Áurea, participou de grandes guerras e ajudou a estabelecer o domínio da Erdtree nas Terras Intermédias.",
        ),
        paragraph(
          "Após derrotar seu último grande inimigo, Godfrey perdeu a Graça (como se sua missão, tivesse acabado), e o brilho dourado desapareceu de seus olhos. Marika também retirou a Graça de seus guerreiros, transformando todos eles nos primeiros Maculados.",
        ),
      ],
      sources: [
        { type: "item-description", item: "Ícone de Godfrey" },
        { type: "dialogue", character: "Marika (por Melina)" },
      ],
    },
    {
      id: "exile",
      title: "A queda e o exílio",
      icon: "shield",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Marika ordenou que Godfrey e seus guerreiros deixassem as Terras Intermédias para lutar e morrer em terras distantes. Assim começou a chamada Longa Marcha dos Maculados, que marcou o fim do reinado de Godfrey.",
        ),
        paragraph(
          "Longe das Terras Intermédias, os Maculados continuaram suas vidas, travaram novas batalhas e tiveram descendentes, que também passaram a carregar esse título.",
        ),
      ],
      sources: [
        { type: "dialogue", character: "Marika (por Melina)" },
        { type: "item-description", item: "Lembrança de Hoarah Loux" },
      ],
    },
    {
      id: "grace-returned",
      title: "A Graça devolvida",
      icon: "sparkles",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Antes do exílio, Marika prometeu que, após a morte de seus guerreiros, devolveria a Graça que havia retirado deles. Assim, poderiam retornar às Terras Intermédias, lutar novamente e buscar o Anel Prístino.",
        ),
        paragraph(
          "Muito tempo depois, após a destruição do Anel Prístino e a guerra da Ruptura, a Graça voltou a chamar os Maculados. O protagonista é um deles: na abertura do jogo, vemos a luz dourada da Graça alcançá-lo, dando início à sua jornada para se tornar Lorde Prístino.",
        ),
      ],
      sources: [
        { type: "dialogue", character: "Marika (por Melina)" },
        { type: "game-data", dataset: "Abertura de Elden Ring" },
      ],
    },
  ],
  related: [
    { kind: "lore", id: "golden-order" },
    { kind: "lore", id: "marika" },
    { kind: "lore", id: "shattering" },
  ],
};
