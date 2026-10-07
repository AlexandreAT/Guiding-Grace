import { GUIDE_ALIASES } from "../../src/data/guideAliases";
import { getEntityTokens } from "./entities";
import { containsPhrase, normalizeQuestion, normalizeText, tokenize } from "./normalize";
import type { GuideChunk, GuideIndex } from "./types";

export interface SearchQuery {
  tokens: string[];
  // Termo do guia equivalente a uma palavra da pergunta (ex.: "boss" → "chefe"); conta como a própria palavra
  synonyms?: Record<string, string[]>;
  // Pistas da conversa (ex.: o último assunto citado); ajudam no ranking, mas não contam como cobertura
  contextTokens?: string[];
}

export interface SearchBoosts {
  regionIds?: readonly string[];
  mechanicId?: string;
  chunkIds?: ReadonlySet<string>;
}

export interface SearchResult {
  chunk: GuideChunk;
  score: number;
  // Fração da pergunta encontrada no trecho, ponderada pela raridade de cada palavra
  coverage: number;
}

// Abaixo disso, o trecho não responde à pergunta de verdade
export const MIN_COVERAGE = 0.5;

const TITLE_WEIGHT = 2;
const PARTIAL_MATCH_CREDIT = 0.6;
const CONTEXT_WEIGHT = 0.5;
const REGION_BOOST = 1.3;
const MECHANIC_BOOST = 1.5;
const CHUNK_BOOST = 1.3;
const MIN_PREFIX_LENGTH = 5;
// Correção de digitação: só para palavras que o guia não conhece
const MIN_COMPLETION_LENGTH = 4;
const MIN_TYPO_LENGTH = 5;
const LONG_WORD_LENGTH = 8;
const MAX_CORRECTIONS = 4;

const aliasEntries = Object.entries(GUIDE_ALIASES).map(([term, aliases]) => ({
  termTokens: tokenize(term),
  aliases: aliases.map((alias) => ({ phrase: normalizeText(alias), tokens: tokenize(alias) })),
}));

const frequencyCache = new WeakMap<GuideIndex, Map<string, number>>();
const idfCache = new WeakMap<GuideIndex, Map<string, number>>();

// Em quantos trechos cada palavra aparece
export const getDocumentFrequency = (index: GuideIndex): ReadonlyMap<string, number> => {
  const cached = frequencyCache.get(index);
  if (cached) return cached;

  const documentFrequency = new Map<string, number>();
  index.chunks.forEach((chunk) => {
    new Set(chunk.tokens).forEach((token) => {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    });
  });
  frequencyCache.set(index, documentFrequency);
  return documentFrequency;
};

// Palavras raras no guia valem mais que palavras presentes em quase todo trecho
const getIdf = (index: GuideIndex): Map<string, number> => {
  const cached = idfCache.get(index);
  if (cached) return cached;

  const idf = new Map<string, number>();
  getDocumentFrequency(index).forEach((frequency, token) => {
    idf.set(token, Math.log(1 + index.chunks.length / frequency));
  });
  idfCache.set(index, idf);
  return idf;
};
// Distância de edição com transposição: "darriwli" fica a 1 de "darriwil"
const editDistance = (a: string, b: string): number => {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) rows[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[a.length][b.length];
};

// Palavra que o guia não conhece → palavras do guia que ela provavelmente quis dizer:
// incompleta ("roder" → "roderika") ou com erro de digitação ("blaid" → "blaidd").
// O erro de digitação só é corrigido para nomes do guia: assim "seria" nunca vira "será"
const findCorrections = (
  token: string,
  vocabulary: ReadonlyMap<string, number>,
  entityTokens: ReadonlySet<string>,
): string[] => {
  if (vocabulary.has(token)) return [];
  const words = [...vocabulary.keys()];

  if (token.length >= MIN_COMPLETION_LENGTH) {
    const completions = words.filter((word) => word.startsWith(token));
    if (completions.length > 0) return completions.slice(0, MAX_CORRECTIONS);
  }

  if (token.length < MIN_TYPO_LENGTH) return [];
  const maxDistance = token.length >= LONG_WORD_LENGTH ? 2 : 1;

  // A primeira letra quase nunca é o erro; exigi-la evita trocar uma palavra por outra parecida
  return [...entityTokens]
    .filter(
      (word) =>
        word[0] === token[0] &&
        Math.abs(word.length - token.length) <= maxDistance &&
        editDistance(token, word) <= maxDistance,
    )
    .slice(0, MAX_CORRECTIONS);
};

// Pergunta → palavras do guia. Gírias são expandidas; apelidos, termos em inglês e correções de digitação
// viram sinônimos das palavras digitadas, então ainda precisam cobrir a pergunta para gerar resposta
export const buildSearchQuery = (question: string, index: GuideIndex): SearchQuery => {
  const normalized = normalizeQuestion(question);
  const tokens = [...new Set(tokenize(normalized))];
  const synonyms: Record<string, string[]> = {};
  const vocabulary = getIdf(index);
  const entityTokens = getEntityTokens(index);

  const addSynonyms = (token: string, alternatives: string[]) => {
    synonyms[token] = [...new Set([...(synonyms[token] ?? []), ...alternatives])];
  };

  aliasEntries.forEach(({ termTokens, aliases }) => {
    aliases
      .filter((alias) => containsPhrase(normalized, alias.phrase))
      .forEach((alias) => {
        alias.tokens.forEach((token) => addSynonyms(token, termTokens));
      });
  });

  tokens.forEach((token) => {
    const corrections = findCorrections(token, vocabulary, entityTokens);
    if (corrections.length > 0) addSynonyms(token, corrections);
  });

  return { tokens, synonyms };
};

// Uma palavra que o guia não conhece (ex.: o nome de um chefe não coberto) pesa como a mais rara
const getTokenWeight = (token: string, index: GuideIndex): number =>
  getIdf(index).get(token) ?? Math.log(1 + index.chunks.length);

// Variações como "enxerto"/"enxertado" contam parcialmente
const sharesPrefix = (a: string, b: string) =>
  a.length >= MIN_PREFIX_LENGTH &&
  b.length >= MIN_PREFIX_LENGTH &&
  a.slice(0, MIN_PREFIX_LENGTH) === b.slice(0, MIN_PREFIX_LENGTH);

interface TokenMatch {
  score: number;
  // 1 para palavra exata, parcial para variação por prefixo, 0 se ausente
  credit: number;
}

const matchToken = (token: string, chunk: GuideChunk, index: GuideIndex): TokenMatch => {
  const weight = getTokenWeight(token, index);
  const termFrequency = chunk.tokens.filter((chunkToken) => chunkToken === token).length;

  if (termFrequency > 0) {
    const titleScore = chunk.titleTokens.includes(token) ? TITLE_WEIGHT : 0;
    return { score: weight * (titleScore + 1 + Math.min(termFrequency - 1, 3) * 0.2), credit: 1 };
  }

  if (chunk.tokens.some((chunkToken) => sharesPrefix(token, chunkToken))) {
    const titleScore = chunk.titleTokens.some((titleToken) => sharesPrefix(token, titleToken)) ? TITLE_WEIGHT : 0;
    return { score: weight * (titleScore + 1) * PARTIAL_MATCH_CREDIT, credit: PARTIAL_MATCH_CREDIT };
  }

  return { score: 0, credit: 0 };
};

// A palavra da pergunta vale pelo melhor entre ela mesma e seus sinônimos
const matchQueryToken = (token: string, synonyms: string[], chunk: GuideChunk, index: GuideIndex): TokenMatch =>
  [token, ...synonyms]
    .map((candidate) => matchToken(candidate, chunk, index))
    .reduce((best, match) => (match.score > best.score ? match : best), { score: 0, credit: 0 });

const getBoost = (chunk: GuideChunk, boosts: SearchBoosts): number => {
  let boost = 1;
  if (chunk.regionId && boosts.regionIds?.includes(chunk.regionId)) boost *= REGION_BOOST;
  if (chunk.mechanicId && chunk.mechanicId === boosts.mechanicId) boost *= MECHANIC_BOOST;
  if (boosts.chunkIds?.has(chunk.chunkId)) boost *= CHUNK_BOOST;
  return boost;
};

export const searchGuide = (
  index: GuideIndex,
  chunks: readonly GuideChunk[],
  query: SearchQuery,
  boosts: SearchBoosts = {},
): SearchResult[] => {
  const contextTokens = (query.contextTokens ?? []).filter((token) => !query.tokens.includes(token));
  const totalWeight = query.tokens.reduce((sum, token) => sum + getTokenWeight(token, index), 0);

  return chunks
    .map((chunk) => {
      const matches = query.tokens.map((token) =>
        matchQueryToken(token, query.synonyms?.[token] ?? [], chunk, index),
      );
      const coveredWeight = matches.reduce(
        (sum, match, position) => sum + match.credit * getTokenWeight(query.tokens[position], index),
        0,
      );
      const contextScore = contextTokens.reduce(
        (sum, token) => sum + matchToken(token, chunk, index).score * CONTEXT_WEIGHT,
        0,
      );
      const score =
        (matches.reduce((sum, match) => sum + match.score, 0) + contextScore) * getBoost(chunk, boosts);

      return { chunk, score, coverage: totalWeight > 0 ? coveredWeight / totalWeight : 0 };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.order - b.chunk.order);
};

export const isRelevant = (result: SearchResult): boolean => result.coverage >= MIN_COVERAGE;

// Parágrafo do trecho que mais conversa com a pergunta; vira o resumo exibido na fonte
export const getBestPassage = (chunk: GuideChunk, queryTokens: readonly string[]): string => {
  if (queryTokens.length === 0 || chunk.passages.length <= 1) return chunk.passages[0] ?? chunk.title;

  const scored = chunk.passages.map((passage) => {
    const passageTokens = new Set(tokenize(passage));
    return queryTokens.filter((token) => passageTokens.has(token)).length;
  });
  return chunk.passages[scored.indexOf(Math.max(...scored))];
};
