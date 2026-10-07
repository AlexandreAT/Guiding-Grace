export type MechanicIcon =
  | "sword"
  | "chart"
  | "hammer"
  | "coins"
  | "diamond"
  | "sparkles"
  | "feather"
  | "lock"
  | "tool"
  | "checklist";

export interface MechanicTextPart {
  type: "text" | "highlight";
  text: string;
}

export interface MechanicComparisonCard {
  title: string;
  icon: MechanicIcon;
  paragraphs: MechanicTextPart[][];
}

export type MechanicBlock =
  | { type: "paragraph"; parts: MechanicTextPart[] }
  | { type: "list"; items: MechanicTextPart[][] }
  | { type: "callout"; title: string; text: string }
  | { type: "comparison"; cards: MechanicComparisonCard[] };

export interface MechanicSection {
  // Estável: usado como âncora na página e como fonte citável pelo Gideon
  id: string;
  title: string;
  icon: MechanicIcon;
  blocks: MechanicBlock[];
}

export interface MechanicGuide {
  id: string;
  title: string;
  subtitle: string;
  sections: MechanicSection[];
}
