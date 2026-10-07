import { tokenize } from "./normalize";

// O modelo cita os trechos que recebeu como [1], [2]...; quando os trechos não bastam, responde [SEM_BASE]
export const NO_BASIS_MARKER = "[SEM_BASE]";

export interface CitedAnswer {
  text: string;
  // Posições (base 0) dos trechos citados, na ordem em que aparecem no texto
  citedIndexes: number[];
  hasNoBasis: boolean;
}

const MARKER_PATTERN = /\[(\d{1,2})\]/g;
// Modelos de raciocínio podem devolver o pensamento interno junto da resposta
const THINKING_PATTERN = /<think>[\s\S]*?(<\/think>|$)/gi;

export const removeThinking = (rawText: string): string => rawText.replace(THINKING_PATTERN, "").trim();

const CAPITALIZED_WORD = /\p{Lu}[\p{L}\p{M}'-]*/gu;

// Nomes do guia (Blaidd, Melina, Kalé...) citados na resposta precisam aparecer nos trechos citados.
// Pega a ligação inventada entre dois assuntos: "o encontro com Blaidd ocorre após falar com Melina [Graça]"
export const findUnsupportedNames = (
  answer: string,
  supportingText: string,
  entityTokens: ReadonlySet<string>,
): string[] => {
  const supported = new Set(tokenize(supportingText));
  const names = (answer.match(CAPITALIZED_WORD) ?? []).flatMap((word) => tokenize(word));
  return [...new Set(names.filter((token) => entityTokens.has(token) && !supported.has(token)))];
};

// Só são aceitos marcadores que apontam para um trecho realmente enviado na chamada
export const parseCitedAnswer = (rawText: string, sentChunkCount: number): CitedAnswer => {
  const withoutThinking = removeThinking(rawText);
  const hasNoBasis = withoutThinking.toUpperCase().includes(NO_BASIS_MARKER);

  const citedIndexes: number[] = [];
  for (const match of withoutThinking.matchAll(MARKER_PATTERN)) {
    const position = Number(match[1]) - 1;
    if (position >= 0 && position < sentChunkCount && !citedIndexes.includes(position)) {
      citedIndexes.push(position);
    }
  }

  const text = withoutThinking
    .replace(MARKER_PATTERN, "")
    .replace(/\[SEM_BASE\]/gi, "")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { text, citedIndexes, hasNoBasis };
};
