import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const RANNI: LoreArticle = {
  id: "ranni",
  title: "Ranni",
  category: "character",
  aliases: [],
  summary: "Semideusa e Empíria, filha de Radagon e Rennala, ligada à Lua Sombria e à Noite das Facas Negras.",
  gate: "open",
  pendingReview:
    "Rascunho do agente, só com fatos que o guia já mostra (região Geral e Blaidd): revisar texto, títulos e certezas. A linha de missão dela não foi incluída, para não adiantar spoilers.",
  sections: [
    {
      id: "who-she-is",
      title: "Quem é",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Ranni é uma das Semideusas e uma Empíria, filha de Radagon com Rennala, os Empírios podem servir à Ordem Áurea ou rejeitá-la, e Ranni a rejeitou.",
        ),
      ],
    },
    {
      id: "the-plan",
      title: "O plano contra a Ordem Áurea",
      icon: "skull",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Na Noite das Facas Negras, Ranni roubou parte do poder da runa da morte e criou as facas negras para iniciar seu plano de derrubar a Ordem Áurea. Na mesma noite, ela matou o próprio corpo, por motivos até o momento desconhecidos.",
        ),
      ],
    },
    {
      id: "dark-moon",
      title: "Lua Sombria",
      icon: "sparkles",
      certainty: "inferred",
      blocks: [
        paragraph(
          "Ranni e seu grupo são os principais seguidores da Lua Sombria, religião que diz querer um destino livre para todos, um mundo sem Deuses e um ciclo natural de vida e morte.",
        ),
      ],
    },
    {
      id: "blaidd",
      title: "Blaidd",
      icon: "shield",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Blaidd, encontrado nas ruínas de Limgrave (Base), é ligado diretamente a Ranni e introduz uma das linhas de missão mais importantes do jogo.",
        ),
      ],
    },
  ],
  related: [
    { kind: "lore", id: "night-of-black-knives" },
    { kind: "lore", id: "destined-death" },
    { kind: "lore", id: "empyreans" },
    { kind: "boss", id: "rennala-queen-of-the-full-moon" },
  ],
};
