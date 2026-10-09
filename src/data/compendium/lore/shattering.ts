import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const SHATTERING: LoreArticle = {
  id: "shattering",
  title: "A Ruptura",
  category: "event",
  aliases: ["Ruptura", "The Shattering"],
  summary: "A guerra entre os Semideuses depois da quebra do Anel, que deixou o mundo em decadência.",
  gate: "open",
  guideTopic: "A ruptura e estado atual do mundo.",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "world-after-the-war",
      title: "O mundo depois da guerra",
      icon: "flame",
      certainty: "explicit",
      blocks: [
        paragraph("Após a quebra do Elden Ring, a Marika desapareceu, deixando um vacuo no poder, a Erdtree (Tervore, uma arvore gigante que é o centro do mundo, ela é como um simbolo que representa a Grande Vontade) se fecha para ninguem entrar nela, com isso os Semideuses entram em guerra entre si, a guerra se chama Ruptura, porém, nenhum dos Semideuses venceu, e o mundo ficou congelado nesse estado atual de decadencia pós guerra, sem um vitorioso, e sem líderes de fato, o maior exemplo negativo da guerra é a própria região de Caelid, que ficou totalmente devastada após a guerra entre Malenia e Radahn, dois dos Semideuses mais fortes."),
      ],
    },
  ],
  related: [{ kind: "lore", id: "elden-ring" }, { kind: "lore", id: "night-of-black-knives" }, { kind: "boss", id: "starscourge-radahn" }],
};
