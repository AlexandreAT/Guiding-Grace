import { buildCompendiumPath } from "../../src/routes/compendiumRoute";
import { buildGuidePath, buildMechanicPath } from "../../src/routes/guideRoute";
import { getBestPassage } from "./search";
import type { GideonSource, GuideChunk } from "./types";

const SNIPPET_LENGTH = 180;

const toSnippet = (passage: string): string => {
  const text = passage.replace(/\s+/g, " ").trim();
  if (text.length <= SNIPPET_LENGTH) return text;
  return `${text.slice(0, text.lastIndexOf(" ", SNIPPET_LENGTH))}…`;
};

// Ação derivada do próprio trecho: com pin abre o mapa, sem pin abre o conteúdo; nunca vem de texto gerado
const getAction = (chunk: GuideChunk, buildId: string): GideonSource["action"] => {
  if (chunk.kind === "mechanic" && chunk.mechanicId) {
    return { type: "OPEN_ROUTE", label: "Abrir no guia", path: buildMechanicPath(chunk.mechanicId, chunk.sectionId) };
  }

  if ((chunk.kind === "boss" || chunk.kind === "lore") && chunk.entity) {
    return { type: "OPEN_ROUTE", label: "Abrir no Compêndio", path: buildCompendiumPath(chunk.entity, chunk.sectionId) };
  }

  if (chunk.pinId) {
    return { type: "OPEN_MAP", label: "Ver no mapa", path: buildGuidePath(buildId, chunk.regionId, chunk.anchor) };
  }

  return { type: "OPEN_CONTENT", label: "Ver no guia", path: buildGuidePath(buildId, chunk.regionId, chunk.anchor) };
};

// Onde o trecho está: a região no guia, o guia de mecânica ou a entrada do Compêndio
export const getChunkLocation = (chunk: GuideChunk): string => {
  if (chunk.kind === "region") return chunk.regionName ?? "";
  if (chunk.kind === "mechanic") return chunk.mechanicTitle ?? "";
  return chunk.entityName ?? "";
};

export const toSource = (
  chunk: GuideChunk,
  buildId: string,
  queryTokens: readonly string[] = [],
): GideonSource => ({
  chunkId: chunk.chunkId,
  title: chunk.title,
  location: getChunkLocation(chunk),
  snippet: toSnippet(getBestPassage(chunk, queryTokens)),
  action: getAction(chunk, buildId),
});
