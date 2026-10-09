import { getBlockText } from "../../src/data/contentBlocks";
import { describeBossGameData } from "../../src/data/compendium/gameDataText";
import {
  getBossGates,
  getBossSectionGates,
  getLoreGates,
  getLoreSectionGates,
} from "../../src/data/compendium/knowledge";
import {
  GAME_DATA_SECTION_ID,
  SUMMARY_SECTION_ID,
  type BossGameData,
  type BossGuide,
  type CompendiumRef,
  type LoreArticle,
} from "../../src/data/compendium/types";
import type { MechanicGuide } from "../../src/data/mechanics/types";
import type { PinData } from "../../src/data/regionPins";
import type { Region } from "../../src/data/regions";
import { isTrackableItem, type ContentItem, type RegionSection } from "../../src/data/regionSections";
import { normalizeText, tokenize } from "./normalize";
import type { GuideChunk, GuideEntity, GuideIndex } from "./types";

export interface GuideSources {
  regions: readonly Region[];
  sections: Record<string, RegionSection[]>;
  pins: Record<string, PinData[]>;
  mechanics: readonly MechanicGuide[];
  // Compêndio: os mesmos dados das páginas de chefes e de lore
  bosses?: readonly BossGuide[];
  bossGameData?: Readonly<Record<string, BossGameData>>;
  lore?: readonly LoreArticle[];
}

type ChunkDraft = Omit<GuideChunk, "text" | "order" | "titleTokens" | "tokens"> & {
  // Nomes alternativos do assunto: ajudam a busca, não aparecem nas fontes
  aliases?: string[];
};

// Trechos marcados como spoiler ficam fora: o Gideon não deve resumir o que o próprio guia esconde
const getItemText = (item: ContentItem): string =>
  item.parts
    ? item.parts
        .filter((part) => part.type !== "spoiler")
        .map((part) => part.text)
        .join("")
        .trim()
    : (item.text ?? "").trim();

// Um tópico abre um trecho e reúne os parágrafos seguintes; um parágrafo com id próprio vira um trecho isolado
const buildRegionDrafts = (
  region: Region,
  sources: GuideSources,
  bossByObjective: ReadonlyMap<string, BossGuide>,
): ChunkDraft[] => {
  const pins = sources.pins[region.id] ?? [];
  const drafts: ChunkDraft[] = [];

  const createDraft = (
    item: ContentItem,
    title: string,
    sectionTitle: string,
    fallbackId: string,
  ): ChunkDraft => {
    // O tópico de um chefe no guia da região é o mesmo assunto da página dele no Compêndio
    const boss = item.id ? bossByObjective.get(item.id) : undefined;
    return {
      chunkId: `region:${region.id}:${item.id ?? fallbackId}`,
      kind: "region",
      title,
      sectionTitle,
      regionId: region.id,
      regionName: region.name,
      spoilerFree: region.spoilerFree,
      anchor: item.id ?? (item.style === "topic" ? item.text : undefined),
      pinId: pins.some((pin) => pin.id === item.id) ? item.id : undefined,
      objectiveId: isTrackableItem(item) ? item.id : undefined,
      gates: item.spoilerGate ? [item.spoilerGate] : [],
      entity: boss ? { kind: "boss", id: boss.id } : undefined,
      entityName: boss?.name,
      passages: item.style === "topic" ? [] : [getItemText(item)],
    };
  };

  (sources.sections[region.id] ?? []).forEach((section, sectionIndex) => {
    // Seções montadas a partir dos artigos de lore: o Gideon cita o artigo, não a cópia no guia da região
    if (section.fromLore) return;
    let topic: ChunkDraft | undefined;

    section.content.forEach((item, itemIndex) => {
      const fallbackId = `s${sectionIndex}i${itemIndex}`;

      if (item.style === "topic") {
        topic = createDraft(item, item.text ?? section.title, section.title, fallbackId);
        drafts.push(topic);
        return;
      }

      if (item.id) {
        const pinLabel = pins.find((pin) => pin.id === item.id)?.label;
        drafts.push(createDraft(item, pinLabel ?? topic?.title ?? section.title, section.title, fallbackId));
        return;
      }

      if (!topic) {
        // Texto antes do primeiro tópico: introdução da seção, citável apenas como conteúdo
        topic = { ...createDraft(item, section.title, section.title, fallbackId), anchor: undefined };
        drafts.push(topic);
        return;
      }

      topic.passages.push(getItemText(item));
      if (item.spoilerGate) topic.gates.push(item.spoilerGate);
    });
  });

  return drafts;
};

const buildMechanicDrafts = (mechanic: MechanicGuide): ChunkDraft[] =>
  mechanic.sections.map((section) => ({
    chunkId: `mechanic:${mechanic.id}:${section.id}`,
    kind: "mechanic",
    title: section.title,
    sectionTitle: section.title,
    mechanicId: mechanic.id,
    mechanicTitle: mechanic.title,
    sectionId: section.id,
    gates: [],
    passages: section.blocks.map(getBlockText),
  }));

// Um trecho por seção (e um para o resumo): seções pequenas acham a resposta certa ("fraqueza" → dados de combate)
const buildBossDrafts = (boss: BossGuide, gameData: BossGameData | undefined): ChunkDraft[] => {
  const entity: CompendiumRef = { kind: "boss", id: boss.id };
  const draft = (sectionId: string, title: string, passages: string[], extra: Partial<ChunkDraft> = {}): ChunkDraft => ({
    chunkId: `boss:${boss.id}:${sectionId}`,
    kind: "boss",
    title,
    sectionTitle: title,
    sectionId,
    regionId: boss.regionId,
    objectiveId: undefined,
    entity,
    entityName: boss.name,
    aliases: boss.aliases,
    gates: getBossGates(boss),
    passages,
    ...extra,
  });

  const rewards = boss.rewards?.length ? `Recompensas: ${boss.rewards.join(", ")}.` : "";
  return [
    draft(SUMMARY_SECTION_ID, "Resumo", [boss.summary, rewards]),
    ...(gameData ? [draft(GAME_DATA_SECTION_ID, "Dados de combate", describeBossGameData(gameData))] : []),
    ...boss.sections.map((section) =>
      draft(section.id, section.title, section.blocks.map(getBlockText), {
        gates: getBossSectionGates(boss, section),
        certainty: section.certainty,
      }),
    ),
  ];
};

const buildLoreDrafts = (article: LoreArticle): ChunkDraft[] => {
  const entity: CompendiumRef = { kind: "lore", id: article.id };
  const draft = (sectionId: string, title: string, passages: string[], extra: Partial<ChunkDraft> = {}): ChunkDraft => ({
    chunkId: `lore:${article.id}:${sectionId}`,
    kind: "lore",
    title,
    sectionTitle: title,
    sectionId,
    entity,
    entityName: article.title,
    aliases: article.aliases,
    gates: getLoreGates(article),
    passages,
    ...extra,
  });

  return [
    draft(SUMMARY_SECTION_ID, "Resumo", [article.summary]),
    ...article.sections.map((section) =>
      draft(section.id, section.title, section.blocks.map(getBlockText), {
        gates: getLoreSectionGates(article, section),
        certainty: section.certainty,
      }),
    ),
  ];
};

const buildEntities = (bosses: readonly BossGuide[], lore: readonly LoreArticle[]): GuideEntity[] => [
  ...bosses.map((boss) => ({
    ref: { kind: "boss" as const, id: boss.id },
    name: boss.name,
    aliases: boss.aliases,
    related: boss.related,
    isProperName: true,
  })),
  ...lore.map((article) => ({
    ref: { kind: "lore" as const, id: article.id },
    name: article.title,
    aliases: article.aliases,
    related: article.related,
    // Conceitos ("Graça", "Ordem Áurea") são palavras comuns nas respostas; personagens são nomes próprios
    isProperName: article.category === "character",
  })),
];

// FNV-1a: hash curto e determinístico, igual no navegador e no Worker
const hashText = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

// Só regiões liberadas entram: o texto das regiões "Em breve" ainda é provisório.
// Chefes de regiões "Em breve" entram, mas ficam bloqueados pelo gate da região até ela ser alcançada
export const buildGuideIndex = (sources: GuideSources): GuideIndex => {
  const bosses = sources.bosses ?? [];
  const lore = sources.lore ?? [];
  const regions = sources.regions
    .filter((region) => !region.disabled)
    .sort((a, b) => a.order - b.order);
  const bossByObjective = new Map(
    bosses.flatMap((boss) => (boss.objectiveId ? [[boss.objectiveId, boss] as const] : [])),
  );

  const drafts = [
    ...regions.flatMap((region) => buildRegionDrafts(region, sources, bossByObjective)),
    ...sources.mechanics.flatMap(buildMechanicDrafts),
    ...bosses.flatMap((boss) => buildBossDrafts(boss, sources.bossGameData?.[boss.id])),
    ...lore.flatMap(buildLoreDrafts),
  ];

  const chunks: GuideChunk[] = drafts
    .map(({ aliases = [], ...draft }, order) => {
      const passages = draft.passages.filter(Boolean);
      const text = passages.join(" ");
      // Toda seção do Compêndio é achada pelo nome do assunto ("fraqueza do godrick" → dados de combate), mas só o
      // resumo o leva no título: assim "onde fica o Godrick?" não troca o trecho do mapa por cinco seções do chefe
      // Nome e apelidos contam uma vez só ("Godrick" e "Godrick, o Enxertado"), sem inflar a frequência do termo
      const nameTokens = draft.kind === "region" ? [] : [...new Set([draft.entityName, ...aliases].flatMap((name) => tokenize(name ?? "")))];
      const isEntrySummary = draft.sectionId === SUMMARY_SECTION_ID;
      return {
        ...draft,
        passages,
        text,
        order,
        titleTokens: [...new Set([...tokenize(draft.title), ...(isEntrySummary ? nameTokens : [])])],
        tokens: [...tokenize(`${draft.title} ${text}`), ...nameTokens],
      };
    })
    .filter((chunk) => chunk.text.length > 0 || chunk.objectiveId !== undefined);

  const indexRegions = regions.map((region) => ({
    id: region.id,
    name: region.name,
    order: region.order,
    names: [normalizeText(region.name), normalizeText(region.displayName)],
  }));
  const entities = buildEntities(bosses, lore);

  // Muda sempre que um trecho citável, seu destino de navegação ou sua regra de conhecimento muda
  const version = hashText(
    JSON.stringify([
      indexRegions.map((region) => [region.id, region.name]),
      chunks.map((chunk) => [
        chunk.chunkId,
        chunk.title,
        chunk.text,
        chunk.anchor,
        chunk.pinId,
        chunk.objectiveId,
        chunk.spoilerFree,
        chunk.gates,
        chunk.entity,
        chunk.certainty,
      ]),
      entities.map((entity) => [entity.ref, entity.name, entity.aliases, entity.related]),
    ]),
  );

  return { version, regions: indexRegions, chunks, entities };
};
