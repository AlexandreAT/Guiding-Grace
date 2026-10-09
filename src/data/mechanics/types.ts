import type { ContentBlock, ContentComparisonCard, ContentIcon, ContentTextPart } from "../contentBlocks";

// Os guias de mecânicas usam o formato de texto comum (contentBlocks.ts); os nomes antigos continuam valendo
export type MechanicIcon = ContentIcon;
export type MechanicTextPart = ContentTextPart;
export type MechanicComparisonCard = ContentComparisonCard;
export type MechanicBlock = ContentBlock;

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
