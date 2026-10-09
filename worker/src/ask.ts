import {
  getNextAiQuotaReset,
  type GideonAskError,
  type GideonAskRequest,
  type GideonAskResponse,
} from "../../shared/gideon/askContract";
import {
  findUnsupportedNames,
  findUnsupportedNumbers,
  keepFactualParagraphs,
  parseCitedAnswer,
} from "../../shared/gideon/citations";
import { getEntityTokens } from "../../shared/gideon/entities";
import { wantsFullAnswer } from "../../shared/gideon/intents";
import { isGenericAnswerLine } from "../../shared/gideon/messages";
import { normalizeQuestion, tokenize } from "../../shared/gideon/normalize";
import { respondLocally, toFallbackResponse } from "../../shared/gideon/respond";
import type { GideonResponse, GuideChunk, GuideIndex } from "../../shared/gideon/types";
import { interpretQuestion, type Interpretation } from "./interpret";
import { buildGideonPrompt } from "./prompts/gideon";
import type { GideonLlmProvider } from "./providers/types";

const MAX_ANSWER_LENGTH = 1100;
const MAX_FULL_ANSWER_LENGTH = 2600;
// "Me explica melhor": mais espaço, sem repetir o que já foi dito
const FULL_ANSWER_GUIDANCE =
  " O jogador pediu uma resposta mais completa: use até 10 frases, em parágrafos curtos separados por uma linha em branco, com todos os detalhes úteis dos trechos. O que o Gideon já disse na CONVERSA RECENTE pode ser retomado em uma frase, com outras palavras; o espaço é para o que ainda não foi dito. Cada frase diz um fato de um trecho: nada de análise ou moral da história (\"isso reflete a decadência...\", \"uma figura trágica\", \"entender isso é essencial\"). Termine quando os fatos dos trechos acabarem.";
const SEARCH_GUIDANCE = "Responda à pergunta do jogador usando os trechos.";
// Erro do Workers AI quando a alocação gratuita do dia acaba (código 4006)
const QUOTA_ERROR_PATTERN = /daily free allocation|\b4006\b|neurons/i;

export type AskResult =
  | { status: 200; body: GideonAskResponse }
  | { status: 409 | 503; body: GideonAskError };

interface AskDependencies {
  index: GuideIndex;
  provider: GideonLlmProvider;
  now?: () => Date;
}

const isQuotaError = (error: unknown): boolean =>
  error instanceof Error && QUOTA_ERROR_PATTERN.test(error.message);

const quotaExceeded = (now: Date): AskResult => ({
  status: 503,
  body: { error: "ai_quota_exceeded", retryAt: getNextAiQuotaReset(now).toISOString() },
});

const asLocal = (response: GideonResponse): AskResult => ({ status: 200, body: { ...response, mode: "local" } });

const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, text.lastIndexOf(" ", maxLength))}…` : text;

export const answerQuestion = async (
  { question, context, previousSourceIds, history, indexVersion }: GideonAskRequest,
  { index, provider, now = () => new Date() }: AskDependencies,
): Promise<AskResult> => {
  // Navegador e Worker publicados com conteúdos diferentes: o navegador usa o próprio motor
  if (indexVersion !== index.version) return { status: 409, body: { error: "index_version_mismatch" } };

  // 1ª etapa: a IA lê a conversa e diz o que o jogador quer (pergunta completa, tipo de pedido e assuntos).
  // Se ela falhar, a pergunta original segue pelas regras de palavras do motor local
  let interpretation: Interpretation = { question, rewritten: false, subjects: [] };
  try {
    interpretation = await interpretQuestion({ question, history, context, index }, provider);
  } catch (error) {
    if (isQuotaError(error)) return quotaExceeded(now());
  }
  const interpretedQuestion = interpretation.question;
  // A IA pode não perceber o pedido de resposta maior ("só isso?"); as frases claras garantem o modo completo
  const isFull = interpretation.detail === "full" || wantsFullAnswer(normalizeQuestion(question));

  // Busca e Progress Guard refeitos aqui, com o índice do Worker; os trechos nunca vêm do navegador
  const local = respondLocally(index, {
    question: interpretedQuestion,
    context,
    previousSourceIds,
    interpretation: { ...interpretation, detail: isFull ? "full" : "normal" },
  });
  if (local.status !== "answered" || local.sources.length === 0) return asLocal(local);

  // Fontes primeiro, depois os trechos do mesmo assunto em outros tópicos (só entram na resposta se citados)
  const candidates = [...local.sources, ...(local.related ?? [])];
  const chunks = candidates.flatMap(
    (source): GuideChunk[] => index.chunks.filter((chunk) => chunk.chunkId === source.chunkId),
  );

  // Orientação escrita pelo código ("Depois de Blaidd, o próximo passo é Forte Haight"): os nomes dela são confiáveis.
  // Lore que o autor marcou como suposição ganha o aviso aqui também: só a regra do prompt não bastava
  const baseGuidance = local.guidance ?? (isGenericAnswerLine(local.message) ? SEARCH_GUIDANCE : local.message);
  const uncertain = chunks.flatMap((chunk, position) =>
    chunk.certainty && chunk.certainty !== "explicit" ? [`[${position + 1}]`] : [],
  );
  const certaintyNote =
    uncertain.length > 0
      ? ` Os trechos ${uncertain.join(", ")} não são fato confirmado pelo jogo: comece o que vier deles com "Ao que tudo indica" (ou "Uma interpretação comum é", se a certeza for interpretação).`
      : "";
  const guidance = `${baseGuidance}${certaintyNote}${isFull ? FULL_ANSWER_GUIDANCE : ""}`;

  let generatedText: string;
  try {
    const prompt = buildGideonPrompt({ question, interpretedQuestion, context, history, guidance, chunks, index, isFull });
    generatedText = (await provider.generate(prompt)).text;
  } catch (error) {
    if (isQuotaError(error)) return quotaExceeded(now());
    return { status: 503, body: { error: "ai_unavailable" } };
  }

  // Sem citação válida, ou com [SEM_BASE], o texto gerado não é exibido como resposta confiável
  const cited = parseCitedAnswer(isFull ? keepFactualParagraphs(generatedText) : generatedText, chunks.length);
  if (cited.hasNoBasis) return asLocal(toFallbackResponse(local, "no_basis"));
  if (cited.citedIndexes.length === 0 || !cited.text) return asLocal(toFallbackResponse(local, "invalid_answer"));

  // A IA às vezes fala de um trecho enviado ("siga para Varre") e esquece o [n]: o nome é o título do trecho,
  // então ele conta como citado e vira fonte
  const entityTokens = getEntityTokens(index);
  const answerNames = findUnsupportedNames(cited.text, "", entityTokens);
  // No guia, o título é o nome do assunto ("Varre"); no Compêndio, quem nomeia o assunto é a entrada ("Ranni"),
  // não o título da seção (a seção "Blaidd" do artigo da Ranni não é o trecho do Blaidd)
  const subjectNamesOf = (chunk: GuideChunk) =>
    chunk.kind === "boss" || chunk.kind === "lore" ? tokenize(chunk.entityName ?? "") : chunk.titleTokens;
  const implicitIndexes = chunks.flatMap((chunk, position) =>
    !cited.citedIndexes.includes(position) && subjectNamesOf(chunk).some((token) => answerNames.includes(token))
      ? [position]
      : [],
  );
  const usedIndexes = [...cited.citedIndexes, ...implicitIndexes];

  // Um nome do guia que não está em nenhum trecho usado nem na orientação é ligação inventada pelo modelo
  const supportingText = [
    guidance,
    ...usedIndexes
      .map((position) => chunks[position])
      // O nome da entrada conta como apoio: "Dados de combate" de Margit não repete "Margit" no texto
      .map(
        (chunk) =>
          `${chunk.title} ${chunk.regionName ?? ""} ${chunk.mechanicTitle ?? ""} ${chunk.entityName ?? ""} ${chunk.text}`,
      ),
  ].join(" ");
  if (findUnsupportedNames(cited.text, supportingText, entityTokens).length > 0) {
    return asLocal(toFallbackResponse(local, "invalid_answer"));
  }
  // Mesma ideia para números: HP, porcentagens e runas só valem se estiverem nos trechos ou na orientação
  if (findUnsupportedNumbers(cited.text, supportingText).length > 0) {
    return asLocal(toFallbackResponse(local, "invalid_answer"));
  }

  const sources = usedIndexes.flatMap((position) =>
    candidates.filter((source) => source.chunkId === chunks[position].chunkId),
  );

  return {
    status: 200,
    body: {
      status: "answered",
      message: truncate(cited.text, isFull ? MAX_FULL_ANSWER_LENGTH : MAX_ANSWER_LENGTH),
      sources,
      choices: local.choices,
      mode: "ai",
    },
  };
};
