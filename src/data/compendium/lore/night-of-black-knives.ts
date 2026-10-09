import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const NIGHT_OF_BLACK_KNIVES: LoreArticle = {
  id: "night-of-black-knives",
  title: "Noite das Facas Negras",
  category: "event",
  aliases: ["Facas Negras", "Night of the Black Knives"],
  summary: "O assassinato que abalou a Ordem Áurea e antecedeu a quebra do Anel Prístino.",
  gate: "open",
  guideTopic: "A noite das facas negras.",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "what-happened",
      title: "O que aconteceu",
      icon: "skull",
      certainty: "explicit",
      blocks: [
        paragraph("É um dos eventos centrais da história,  nessa noite, Ranni (uma das Semideusas) rouba parte do poder da runa da morte (runa que da ao portador o poder de matar um Deus, pertence ao Maliketh, o guarda costa da rainha Marika), com parte do poder dessa runa, ela cria as armas facas negras e entrega a assassinos, com isso, Ranni inicia seu plano de derrubar a Ordem Áurea, assassinando Marika e vários outros membros da Ordem Áurea, e manda os assassinos matarem Godwyn, o filho favorito de Marika (é dito que ele morre apenas em espirito), nesse mesmo momento, Ranni mata seu próprio corpo (por motivos até o momento desconhecidos), esse evento abala Marika que, cansada da Grande Vontade, quebra o Elden Ring, iniciando o fim da Ordem Áurea e a Ruptura."),
      ],
    },
  ],
  related: [{ kind: "lore", id: "elden-ring" }, { kind: "lore", id: "shattering" }, { kind: "lore", id: "empyreans" }],
};
