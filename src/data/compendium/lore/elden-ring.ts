import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const ELDEN_RING: LoreArticle = {
  id: "elden-ring",
  title: "Anel Prístino (Elden Ring)",
  category: "concept",
  aliases: ["Elden Ring", "Anel Prístino"],
  summary: "O conjunto de leis que define como o mundo funciona, quebrado por Marika.",
  gate: "open",
  guideTopic: "O anel prístino(Elden Ring).",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "what-it-is",
      title: "O que é",
      icon: "diamond",
      certainty: "explicit",
      blocks: [
        paragraph("O Anel Prístino não é um anel físico de fato, ele se assemelha a runas mágicas, ele é um conjunto de leis da realidade, ele que define como o mundo funciona, como vida, morte, ordem. Alguns personagens buscam o anel prístino para impor sua própria visão de mundo, e mudar as regras do mundo, como deixar aqueles que morreram viver em morte."),
      ],
    },
    {
      id: "marika-and-the-ring",
      title: "Marika e o Anel",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph("A Marika por ser a Deusa do mundo, tem em sua posse o Elden Ring, e com isso, ela muda as leis do mundo, porém o Elden Ring não vem da Grande Vontade (o Deus que Marika segue), outros representantes de outros Deuses exteriores ou de outras filosofias podem adquirir o Elden Ring e modificalo, até mesmo inserindo novas runas de regras."),
      ],
    },
    {
      id: "the-breaking",
      title: "A quebra do Anel",
      icon: "flame",
      certainty: "explicit",
      blocks: [
        { type: "callout", text: "A Marika quebrou o Elden Ring, indo contra a própria Grande Vontade que ela representava sendo Deusa, com isso as leis do mundo se fragmentaram, e o mundo entrou em colapso, isso deu inicio a Ruptura, evento que antecede o momento atual do jogo, agora, vários tentam buscar os fragmentos do Elden Ring para conseguir seu poder, e tentar se tornar o Elden Lord restaurando o Elden Ring com os fragmentos." },
      ],
    },
  ],
  related: [{ kind: "lore", id: "shattering" }, { kind: "lore", id: "night-of-black-knives" }, { kind: "lore", id: "golden-order" }],
};
