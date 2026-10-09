// Formato de texto comum aos guias de mecânicas e ao Compêndio (chefes e lore): a mesma estrutura alimenta
// as páginas e o índice do Gideon
export type ContentIcon =
  | "sword"
  | "chart"
  | "hammer"
  | "coins"
  | "diamond"
  | "sparkles"
  | "feather"
  | "lock"
  | "tool"
  | "checklist"
  | "crown"
  | "skull"
  | "book"
  | "flame"
  | "shield";

export interface ContentTextPart {
  type: "text" | "highlight";
  text: string;
}

export interface ContentComparisonCard {
  title: string;
  icon: ContentIcon;
  paragraphs: ContentTextPart[][];
}

export type ContentBlock =
  | { type: "paragraph"; parts: ContentTextPart[] }
  | { type: "list"; items: ContentTextPart[][] }
  // Sem título: parágrafo em destaque (o estilo "highlight" dos textos das regiões)
  | { type: "callout"; title?: string; text: string }
  | { type: "comparison"; cards: ContentComparisonCard[] };

export const paragraph = (text: string): ContentBlock => ({ type: "paragraph", parts: [{ type: "text", text }] });

const getPartsText = (parts: ContentTextPart[]): string => parts.map((part) => part.text).join("");

// Texto corrido de um bloco: o que o índice do Gideon lê
export const getBlockText = (block: ContentBlock): string => {
  switch (block.type) {
    case "paragraph":
      return getPartsText(block.parts);
    case "list":
      return block.items.map(getPartsText).join(" ");
    case "callout":
      return block.title ? `${block.title}: ${block.text}` : block.text;
    case "comparison":
      return block.cards
        .map((card) => `${card.title}: ${card.paragraphs.map(getPartsText).join(" ")}`)
        .join(" ");
  }
};
