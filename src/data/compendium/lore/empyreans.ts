import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const EMPYREANS: LoreArticle = {
  id: "empyreans",
  title: "Empírios",
  category: "concept",
  aliases: ["Empírio", "Empyrean"],
  summary: "Seres candidatos a se tornarem deuses.",
  gate: "open",
  guideTopic: "O que são empírios.",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "who-they-are",
      title: "Quem são",
      icon: "crown",
      certainty: "inferred",
      blocks: [
        paragraph("Empírios são seres candidatos a se tornarem Deuses (ao que tudo indica, escolhidos pela Grande Vontade), os principais são Marika (que de fato se tornou Deusa), Ranni (filha de Radagon com Renala), Malenia e Miquella (irmãos, filhos de Marika e Radagon), como pode ver, a familia de Semideuses tem várias ramificações, Marika teve filhos com Godfrey e Radagon, já Radagon (após se tornar consorte de Marika, seus filhos foram elevados ao estado de Semideuses também, mesmo aqueles que não são filhos de Marika também) teve filhos com Marika e Rennala. Os empírios tem duas escolhas, servir a Ordem Áurea ou rejeitar ela como a Ranni fez."),
      ],
    },
  ],
  related: [{ kind: "lore", id: "golden-order" }, { kind: "lore", id: "night-of-black-knives" }],
};
