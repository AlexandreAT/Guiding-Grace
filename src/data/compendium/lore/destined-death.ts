import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const DESTINED_DEATH: LoreArticle = {
  id: "destined-death",
  title: "Runa da Morte",
  category: "concept",
  aliases: ["Morte Destinada", "Destined Death"],
  summary: "A runa que dá a quem a porta o poder de matar até um Deus.",
  gate: "open",
  pendingReview:
    "Rascunho do agente, só com fatos que o guia já mostra (Noite das Facas Negras e Aqueles Que Vivem na Morte): revisar texto, títulos e certezas.",
  sections: [
    {
      id: "what-it-is",
      title: "O que é",
      icon: "skull",
      certainty: "explicit",
      blocks: [
        paragraph(
          "A runa da morte dá a quem a porta o poder de matar um Deus, ela pertence a Maliketh, o guarda-costas da Rainha Marika, por conta desta runa, os Semideuses tinham medo de Maliketh.",
        ),
      ],
    },
    {
      id: "stolen-power",
      title: "O poder roubado",
      icon: "sword",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Na Noite das Facas Negras, Ranni roubou parte do poder dessa runa e criou com ele as facas negras, entregues a assassinos, dando a eles o poder para matar um Deus.",
        ),
      ],
    },
    {
      id: "living-in-death",
      title: "A morte quebrada",
      icon: "skull",
      certainty: "inferred",
      blocks: [
        paragraph(
          "Depois da corrupção da Raiz da Morte e da morte incompleta de Godwyn, morto apenas em espírito, alguns seres passaram a existir num estado nem vivos nem verdadeiramente mortos: são Aqueles Que Vivem na Morte.",
        ),
      ],
    },
  ],
  related: [
    { kind: "lore", id: "night-of-black-knives" },
    { kind: "lore", id: "ranni" },
    { kind: "lore", id: "other-faiths" },
  ],
};
