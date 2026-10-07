import type { MechanicBlock, MechanicGuide, MechanicTextPart } from "../../src/data/mechanics/types";
import type { PinData } from "../../src/data/regionPins";
import type { Region } from "../../src/data/regions";
import { isTrackableItem, type ContentItem, type RegionSection } from "../../src/data/regionSections";
import { normalizeText, tokenize } from "./normalize";
import type { GuideChunk, GuideIndex } from "./types";

export interface GuideSources {
  regions: readonly Region[];
  sections: Record<string, RegionSection[]>;
  pins: Record<string, PinData[]>;
  mechanics: readonly MechanicGuide[];
}

type ChunkDraft = Omit<GuideChunk, "text" | "order" | "titleTokens" | "tokens">;

// Trechos marcados como spoiler ficam fora: o Gideon não deve resumir o que o próprio guia esconde
const getItemText = (item: ContentItem): string =>
  item.parts
    ? item.parts
        .filter((part) => part.type !== "spoiler")
        .map((part) => part.text)
        .join("")
        .trim()
    : (item.text ?? "").trim();

const getPartsText = (parts: MechanicTextPart[]): string => parts.map((part) => part.text).join("");

const getBlockText = (block: MechanicBlock): string => {
  switch (block.type) {
    case "paragraph":
      return getPartsText(block.parts);
    case "list":
      return block.items.map(getPartsText).join(" ");
    case "callout":
      return `${block.title}: ${block.text}`;
    case "comparison":
      return block.cards
        .map((card) => `${card.title}: ${card.paragraphs.map(getPartsText).join(" ")}`)
        .join(" ");
  }
};

// Um tópico abre um trecho e reúne os parágrafos seguintes; um parágrafo com id próprio vira um trecho isolado
const buildRegionDrafts = (region: Region, sources: GuideSources): ChunkDraft[] => {
  const pins = sources.pins[region.id] ?? [];
  const drafts: ChunkDraft[] = [];

  const createDraft = (
    item: ContentItem,
    title: string,
    sectionTitle: string,
    fallbackId: string,
  ): ChunkDraft => ({
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
    spoilerGate: item.spoilerGate,
    passages: item.style === "topic" ? [] : [getItemText(item)],
  });

  (sources.sections[region.id] ?? []).forEach((section, sectionIndex) => {
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
      topic.spoilerGate ??= item.spoilerGate;
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
    passages: section.blocks.map(getBlockText),
  }));

// FNV-1a: hash curto e determinístico, igual no navegador e no Worker
const hashText = (text: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

// Só regiões liberadas entram: o texto das regiões "Em breve" ainda é provisório
export const buildGuideIndex = (sources: GuideSources): GuideIndex => {
  const regions = sources.regions
    .filter((region) => !region.disabled)
    .sort((a, b) => a.order - b.order);

  const drafts = [
    ...regions.flatMap((region) => buildRegionDrafts(region, sources)),
    ...sources.mechanics.flatMap(buildMechanicDrafts),
  ];

  const chunks: GuideChunk[] = drafts
    .map((draft, order) => {
      const passages = draft.passages.filter(Boolean);
      const text = passages.join(" ");
      return {
        ...draft,
        passages,
        text,
        order,
        titleTokens: tokenize(draft.title),
        tokens: tokenize(`${draft.title} ${text}`),
      };
    })
    .filter((chunk) => chunk.text.length > 0 || chunk.objectiveId !== undefined);

  const indexRegions = regions.map((region) => ({
    id: region.id,
    name: region.name,
    order: region.order,
    names: [normalizeText(region.name), normalizeText(region.displayName)],
  }));

  // Muda sempre que um trecho citável, seu destino de navegação ou sua regra de spoiler muda
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
        chunk.spoilerGate,
      ]),
    ]),
  );

  return { version, regions: indexRegions, chunks };
};
