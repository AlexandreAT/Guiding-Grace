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

// Marcas de análise que o modelo insiste em pôr no fim das respostas longas ("Godrick é um exemplo de como a busca
// por poder... sua história reflete a decadência..."): nenhum trecho do guia sustenta esse tipo de frase
const ANALYSIS_CUES = [
  /\breflet(e|em)\b/,
  /\bsimboliza/,
  /\bexemplo de como\b/,
  /\bfigura tragica\b/,
  /\bmoral da historia\b/,
  /\b(essencial|fundamental) para (entender|compreender)\b/,
];

const isAnalysis = (paragraph: string): boolean => {
  const normalized = paragraph
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return ANALYSIS_CUES.some((cue) => cue.test(normalized));
};

// Resposta completa: parágrafo sem nenhum [n] ou de análise costuma ser opinião ou conclusão de enchimento. Ele
// sai; os parágrafos de fatos ficam. Se nada sobrar, a resposta segue como veio (e passa pelas outras verificações)
export const keepFactualParagraphs = (rawText: string): string => {
  const paragraphs = removeThinking(rawText).split(/\n\s*\n/);
  const factual = paragraphs.filter((paragraph) => /\[\d{1,2}\]/.test(paragraph) && !isAnalysis(paragraph));
  return factual.length > 0 ? factual.join("\n\n") : rawText;
};

// Números de 2 dígitos ou mais ("6.080", "40%"); os pequenos ficam de fora ("duas fases" escrito como "2 fases")
const NUMBER_PATTERN = /\d[\d.,]*\d|\d{2,}/g;
const toDigits = (number: string) => number.replace(/[.,]/g, "");

// Número na resposta que nenhum trecho usado traz é dado inventado: HP, porcentagem ou runas errados
export const findUnsupportedNumbers = (answer: string, supportingText: string): string[] => {
  const supported = new Set((supportingText.match(NUMBER_PATTERN) ?? []).map(toDigits));
  return (answer.match(NUMBER_PATTERN) ?? []).filter((number) => !supported.has(toDigits(number)));
};

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
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    // Parágrafos (linha em branco) ficam, para respostas completas; o resto das quebras vira espaço
    .replace(/\s*\n\s*\n\s*/g, "\n\n")
    .replace(/(?<!\n)\n(?!\n)/g, " ")
    .trim();

  return { text, citedIndexes, hasNoBasis };
};
