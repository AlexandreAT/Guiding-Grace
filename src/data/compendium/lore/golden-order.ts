import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const GOLDEN_ORDER: LoreArticle = {
  id: "golden-order",
  title: "Ordem Áurea",
  category: "concept",
  aliases: ["Golden Order"],
  summary: "O sistema religioso, político e cósmico que governa as Terras Intermédias.",
  gate: "open",
  guideTopic: "O que é a Ordem Áurea.",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "what-it-defines",
      title: "O que ela define",
      icon: "book",
      certainty: "explicit",
      blocks: [
        paragraph("A Ordem Áurea é o sistema religioso, político e cósmico que governa o mundo, ela define: O que é vida; O que é morte; Quem governa; Quem pode existir"),
      ],
    },
    {
      id: "pillars",
      title: "No que ela se apoia",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph("A Ordem Áurea promete estabilidade, mas exige controle absoluto, tudo gira em torno de: A Erdtree; O Anel Prístino; A Grande Vontade"),
      ],
    },
    {
      id: "members",
      title: "Quem faz parte",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph("Quem faz parte da Ordem Áurea: Marika (a Deusa receptáculo do Anel Prístino); Radagon (campeão e consorte de Marika); Os Dois Dedos (intérpretes da Grande Vontade, eles conseguem se comunicar direto com ela); Donzelas dos Dedos (guia dos maculados para seguir a Grande Vontade); Os Semideuses (filhos/herdeiros de Marika e Radagon, os principais desafios do jogo, hoje nem todos eles seguem a Grande Vontade)."),
      ],
    },
  ],
  related: [{ kind: "lore", id: "elden-ring" }, { kind: "lore", id: "empyreans" }, { kind: "lore", id: "tarnished" }],
};
