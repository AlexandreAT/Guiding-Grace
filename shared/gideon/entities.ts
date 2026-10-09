import { GAME_DATA_SECTION_ID } from "../../src/data/compendium/types";
import { tokenize } from "./normalize";
import type { GuideIndex } from "./types";

// Nomes que nunca são "inventados" numa resposta: o próprio jogo, o jogador e o Gideon
const ALWAYS_ALLOWED = ["elden", "ring", "maculado", "gideon", "ofnir", "terras", "intermedias"];

const entityCache = new WeakMap<GuideIndex, ReadonlySet<string>>();

// Nomes próprios do guia: títulos dos tópicos das regiões (NPCs, chefes, itens, lugares), nomes das regiões e
// chefes e personagens do Compêndio. Títulos de seção ("Contexto e Propósito"), de mecânicas e conceitos de lore
// ("Graça", "Ordem Áurea") ficam fora: são palavras comuns nas respostas
export const getEntityTokens = (index: GuideIndex): ReadonlySet<string> => {
  const cached = entityCache.get(index);
  if (cached) return cached;

  const tokens = new Set([
    ...index.chunks
      .filter((chunk) => chunk.kind === "region" && chunk.anchor !== undefined)
      .flatMap((chunk) => chunk.titleTokens),
    ...index.regions.flatMap((region) => tokenize(region.name)),
    ...index.entities
      .filter((entity) => entity.isProperName)
      .flatMap((entity) => [entity.name, ...entity.aliases].flatMap(tokenize)),
  ]);
  ALWAYS_ALLOWED.forEach((token) => tokens.delete(token));

  entityCache.set(index, tokens);
  return tokens;
};

// Palavras de uma frase, sem a primeira (que tem maiúscula por ser começo de frase, não por ser nome)
const SENTENCE_SPLIT = /[.!?:]\s+/;
const WORD_SPLIT = /[^\p{L}'-]+/u;
const CAPITALIZED = /^\p{Lu}/u;
// Nome próprio aparece com maiúscula quase sempre; "Parte" (de "Primeira Parte") aparece minúsculo no resto do texto
const MIN_CAPITALIZED_RATIO = 0.8;
const MIN_NAME_LENGTH = 4;
// "Grande Runa" e "Grande Vontade": a palavra que abre nomes diferentes é título, não nome ("Grande" não liga os dois)
const MAX_NAME_COMPANIONS = 1;

const properNameCache = new WeakMap<GuideIndex, ReadonlySet<string>>();

// Nomes que só aparecem dentro dos textos, sem tópico próprio (Godwyn, Marika, Godfrey): servem para corrigir
// digitação ("godwin") e para achar os assuntos de uma pergunta de relação. Não entram na verificação de nomes
export const getProperNameTokens = (index: GuideIndex): ReadonlySet<string> => {
  const cached = properNameCache.get(index);
  if (cached) return cached;

  const counts = new Map<string, { capitalized: number; total: number }>();
  const companions = new Map<string, Set<string>>();
  // Os dados de combate têm rótulos com maiúscula ("Fogo 20%"), que não são nomes
  index.chunks.filter((chunk) => chunk.sectionId !== GAME_DATA_SECTION_ID).forEach((chunk) =>
    chunk.passages.forEach((passage) =>
      passage.split(SENTENCE_SPLIT).forEach((sentence) =>
        sentence
          .split(WORD_SPLIT)
          .slice(1)
          .forEach((word, position, words) => {
            const [token] = tokenize(word);
            if (!token || word.length < MIN_NAME_LENGTH) return;
            const count = counts.get(token) ?? { capitalized: 0, total: 0 };
            count.total++;
            if (CAPITALIZED.test(word)) count.capitalized++;
            counts.set(token, count);

            const next = words[position + 1];
            if (!CAPITALIZED.test(word) || !next || !CAPITALIZED.test(next)) return;
            companions.set(token, (companions.get(token) ?? new Set()).add(next.toLowerCase()));
          }),
      ),
    ),
  );

  const tokens = new Set(
    [...counts]
      .filter(([, count]) => count.capitalized > 0 && count.capitalized / count.total >= MIN_CAPITALIZED_RATIO)
      .filter(([token]) => (companions.get(token)?.size ?? 0) <= MAX_NAME_COMPANIONS)
      .map(([token]) => token),
  );
  ALWAYS_ALLOWED.forEach((token) => tokens.delete(token));
  // Nomes de conceitos de lore ("Runa da Morte", "Ordem Áurea") têm maiúscula, mas não são pessoas nem lugares:
  // contá-los como nome próprio criava elos falsos ("runa" em comum entre Godrick e Godwyn)
  index.entities
    .filter((entity) => !entity.isProperName)
    .flatMap((entity) => [entity.name, ...entity.aliases].flatMap(tokenize))
    .forEach((token) => tokens.delete(token));

  properNameCache.set(index, tokens);
  return tokens;
};

const correctableCache = new WeakMap<GuideIndex, ReadonlySet<string>>();

// Nomes para os quais vale corrigir um erro de digitação: os do guia e os citados nos textos
export const getCorrectableNames = (index: GuideIndex): ReadonlySet<string> => {
  const cached = correctableCache.get(index);
  if (cached) return cached;

  const names = new Set([...getEntityTokens(index), ...getProperNameTokens(index)]);
  correctableCache.set(index, names);
  return names;
};
