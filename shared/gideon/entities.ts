import { tokenize } from "./normalize";
import type { GuideIndex } from "./types";

// Nomes que nunca são "inventados" numa resposta: o próprio jogo, o jogador e o Gideon
const ALWAYS_ALLOWED = ["elden", "ring", "maculado", "gideon", "ofnir", "terras", "intermedias"];

const entityCache = new WeakMap<GuideIndex, ReadonlySet<string>>();

// Nomes próprios do guia: títulos dos tópicos das regiões (NPCs, chefes, itens, lugares) e nomes das regiões.
// Títulos de seção ("Contexto e Propósito") e de mecânicas ficam fora: são palavras comuns
export const getEntityTokens = (index: GuideIndex): ReadonlySet<string> => {
  const cached = entityCache.get(index);
  if (cached) return cached;

  const tokens = new Set([
    ...index.chunks
      .filter((chunk) => chunk.kind === "region" && chunk.anchor !== undefined)
      .flatMap((chunk) => chunk.titleTokens),
    ...index.regions.flatMap((region) => tokenize(region.name)),
  ]);
  ALWAYS_ALLOWED.forEach((token) => tokens.delete(token));

  entityCache.set(index, tokens);
  return tokens;
};
