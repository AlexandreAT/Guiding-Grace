import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const MARIKA: LoreArticle = {
  id: "marika",
  title: "Marika",
  category: "character",
  aliases: ["Rainha Marika"],
  summary: "A Deusa das Terras Intermédias, receptáculo do Anel Prístino, que acabou por quebrá-lo.",
  gate: "open",
  pendingReview:
    "Rascunho do agente, só com fatos que o guia já mostra (região Geral e Terceira Igreja): revisar texto, títulos e certezas. Nada além do que o guia já revela foi incluído.",
  sections: [
    {
      id: "who-she-is",
      title: "Quem é",
      icon: "crown",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Marika é a Deusa receptáculo do Anel Prístino e está no centro da Ordem Áurea. Ela se tornou Deusa como Empíria, e os Semideuses são seus filhos e herdeiros, com Godfrey e com Radagon, seu campeão e consorte.",
        ),
      ],
    },
    {
      id: "breaking-the-ring",
      title: "A quebra do Anel",
      icon: "flame",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Marika quebrou o Elden Ring, indo contra a própria Grande Vontade que representava, com isso, as leis do mundo se fragmentaram, a Ruptura começou e, depois da quebra, Marika desapareceu.",
        ),
      ],
    },
    {
      id: "churches",
      title: "As igrejas de Marika",
      icon: "book",
      certainty: "explicit",
      blocks: [
        paragraph(
          "Existem várias igrejas de Marika pelo mundo, a Terceira Igreja de Marika, em Limgrave (Base), está ligada à Rainha Marika e à origem da Graça, e guarda um item que explica melhor o papel dela no mundo e a relação com os Maculados.",
        ),
      ],
    },
  ],
  related: [
    { kind: "lore", id: "golden-order" },
    { kind: "lore", id: "elden-ring" },
    { kind: "lore", id: "shattering" },
    { kind: "lore", id: "grace" },
  ],
};
