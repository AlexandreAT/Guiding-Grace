import type { ContentBlock, ContentIcon } from "../contentBlocks";
import type { SpoilerGate } from "../regionSections";

// Grau de certeza de uma afirmação de lore: impede que interpretação seja guardada como fato.
// explicit: o jogo afirma (descrição, diálogo, evento visto); inferred: fortemente sugerido por mais de uma
// evidência; interpretation: leitura possível, discutida pela comunidade
export type Certainty = "explicit" | "inferred" | "interpretation";

// De onde veio a informação (proveniência): não é exibido por padrão, mas permite revisar e dar crédito
export type ContentSource =
  | { type: "item-description"; item: string }
  | { type: "dialogue"; character: string }
  | { type: "game-data"; dataset: string }
  | { type: "external"; name: string; url: string; license?: string };

export type CompendiumKind = "boss" | "lore";

// Relação tipada entre entradas do Compêndio (sem banco de grafos)
export interface CompendiumRef {
  kind: CompendiumKind;
  id: string;
}

export interface CompendiumSection {
  // Estável: âncora da página (?section=) e trecho citável pelo Gideon
  id: string;
  title: string;
  icon: ContentIcon;
  blocks: ContentBlock[];
  // Mais restrito que o padrão da entrada (ex.: lore liberada depois de derrotar o chefe)
  gate?: SpoilerGate;
  // Obrigatório nas seções de lore (validado em compendium.test.ts)
  certainty?: Certainty;
  sources?: ContentSource[];
}

export type BossImportance = "main" | "remembrance" | "optional";

// Conteúdo editorial: escrito pelo autor, nunca tocado pelos importadores
export interface BossGuide {
  // = slug da URL, estável e nosso
  id: string;
  // Nome oficial em português (textos do jogo)
  name: string;
  // Casa o chefe com as fontes externas
  englishName: string;
  aliases: string[];
  // Região onde o chefe é enfrentado: o conhecimento padrão vem de alcançá-la
  regionId: string;
  // Tópico do checklist no guia da região: "Ver no mapa", concluído e gates como "depois de derrotá-lo"
  objectiveId?: string;
  importance: BossImportance;
  summary: string;
  // Recompensas com os nomes oficiais em português (os dados importados trazem os nomes da fonte)
  rewards?: string[];
  sections: CompendiumSection[];
  related: CompendiumRef[];
  // O que falta o autor revisar (texto escrito pelo agente, certezas propostas...); listado pelo content:check
  pendingReview?: string;
}

export type DamageType =
  | "standard"
  | "strike"
  | "slash"
  | "pierce"
  | "magic"
  | "fire"
  | "lightning"
  | "holy";

export type StatusEffect = "poison" | "rot" | "bleed" | "frost" | "sleep" | "madness" | "death";

export interface DataProvenance {
  source: string;
  url: string;
  // Revisão da página no momento da importação: as fontes divergem e mudam
  revision: string;
  importedAt: string;
}

// Dados objetivos: escritos só pelos importadores (gameData/bosses.json), chaveados pelo id interno do chefe
export interface BossGameData {
  id: string;
  // Um valor por fase (Rennala tem duas)
  hp: number[];
  runes?: number;
  // Absorção por tipo de dano, em %: quanto menor, mais o chefe sente aquele tipo
  negations: Partial<Record<DamageType, number>>;
  // Acúmulo necessário para cada efeito (os valores sobem a cada aplicação) ou imunidade
  statusResistances: Partial<Record<StatusEffect, number[] | "immune">>;
  // Nomes como estão na fonte; os nomes em português ficam em BossGuide.rewards
  drops: string[];
  externalIds: Record<string, string>;
  provenance: DataProvenance;
}

export type LoreCategory = "concept" | "character" | "event" | "faction" | "place";

export interface LoreArticle {
  id: string;
  title: string;
  category: LoreCategory;
  aliases: string[];
  summary: string;
  // Lore não pertence a uma região: liberar ou não é decisão obrigatória do autor
  gate: SpoilerGate | "open";
  // Título do tópico quando o artigo também aparece no guia da região "Geral"
  guideTopic?: string;
  sections: CompendiumSection[];
  related: CompendiumRef[];
  pendingReview?: string;
}

// Seções geradas para toda entrada: o resumo ("quem é X?") e, nos chefes, os dados importados ("qual a fraqueza?")
export const SUMMARY_SECTION_ID = "summary";
export const GAME_DATA_SECTION_ID = "game-data";
