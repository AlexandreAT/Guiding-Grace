import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const GRACE: LoreArticle = {
  id: "grace",
  title: "Graça",
  category: "concept",
  aliases: ["Graça da Erdtree", "Grace"],
  summary: "A bênção dourada que os Maculados perderam e que o jogador recebe de volta no início da jornada.",
  gate: "open",
  pendingReview:
    "Rascunho do agente, só com fatos que o guia já mostra (Maculados, Terceira Igreja e dicas de NPC): revisar texto, títulos e certezas.",
  sections: [
    {
      id: "what-it-is",
      title: "O que é",
      icon: "sparkles",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Os Maculados perderam a Graça da Erdtree quando deixaram de ser úteis à Ordem Áurea e foram expulsos das Terras Intermédias. O jogador é um Maculado que voltou a receber a Graça: a cena inicial mostra a Graça voltando para ele.",
        ),
      ],
    },
    {
      id: "granted-by-will",
      title: "Concedida e retirada",
      icon: "crown",
      certainty: "inferred",
      blocks: [
        paragraph(
          "A Graça não é algo natural: ela é concedida e retirada por vontade divina. A Terceira Igreja de Marika, em Limgrave (Base), ajuda a entender essa ligação entre a Graça, Marika e os eventos passados.",
        ),
      ],
    },
    {
      id: "resting-at-grace",
      title: "Descansar na Graça",
      icon: "feather",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Os pontos de Graça espalhados pelo mundo são onde você descansa. Muitos NPCs só avançam suas histórias depois que você descansa numa Graça, viaja por teleporte ou sai e volta à região: se um NPC repetir falas, descanse na Graça mais próxima, ou troque e volta para a região, se ele continuar repetindo as falas, você zerou a conversa atual com ele.",
        ),
      ],
    },
  ],
  related: [
    { kind: "lore", id: "tarnished" },
    { kind: "lore", id: "marika" },
    { kind: "lore", id: "golden-order" },
  ],
};
