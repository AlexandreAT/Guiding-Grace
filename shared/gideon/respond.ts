import { getLinkBuildId, isBuildStarted, resolveBuildFocus, type BuildFocus } from "./builds";
import { getEntityTokens } from "./entities";
import { detectIntent, removeProgressCheckWords, type GideonIntent } from "./intents";
import {
  findMentionedRegions,
  findNextRegion,
  getIndexRegion,
  getPendingObjectives,
  getRegionObjectives,
  resolveFocusRegion,
} from "./journey";
import {
  ANSWER_LINES,
  CLARIFY_BUILD_MESSAGE,
  CLARIFY_REFERENCE_MESSAGE,
  CLARIFY_REGION_MESSAGE,
  FALLBACK_LINES,
  JOURNEY_COMPLETE_MESSAGE,
  NOT_COVERED_MESSAGE,
  NOT_COVERED_NOTE,
  SOCIAL_LINES,
  SPOILER_LINES,
  pickLine,
} from "./messages";
import { normalizeQuestion, normalizeText } from "./normalize";
import { isChunkAllowed, partitionChunks, toPlayerProgress, type PlayerProgress } from "./progressGuard";
import { findRelatedChunks } from "./related";
import { buildSearchQuery, isRelevant, searchGuide, type SearchBoosts } from "./search";
import { toSource } from "./sources";
import type {
  GideonChoice,
  GideonFallbackReason,
  GideonResponse,
  GuideChunk,
  GuideIndex,
  QuestionInterpretation,
  ScreenContext,
} from "./types";

export interface RespondInput {
  question: string;
  context: ScreenContext;
  // Fontes da última resposta, para entender "e depois?" e "onde ele fica?"
  previousSourceIds: readonly string[];
  // Só no Worker: tipo de pedido e assuntos entendidos pela IA a partir da conversa. Sem ela (modo local),
  // as regras de palavras de intents.ts decidem
  interpretation?: QuestionInterpretation;
}

const MAX_SOURCES = 3;
const MAX_RELATED = 2;
// Fontes secundárias só aparecem se forem quase tão relevantes quanto a melhor
const SECONDARY_SOURCE_RATIO = 0.5;

interface ResponseScope {
  index: GuideIndex;
  context: ScreenContext;
  progress: PlayerProgress;
  normalizedQuestion: string;
  buildFocus: BuildFocus;
  // Build usada nos links das fontes
  linkBuildId: string;
  // Fora do guia, com mais de uma build iniciada, as escolhas de região levam o nome da build
  choiceSuffix: string;
}

const answered = (message: string, chunks: GuideChunk[], scope: ResponseScope, queryTokens: string[] = []): GideonResponse => {
  const sourceIds = new Set(chunks.map((chunk) => chunk.chunkId));
  const related = chunks[0]
    ? findRelatedChunks(scope.index, chunks[0], scope.progress, MAX_RELATED + chunks.length)
        .filter((chunk) => !sourceIds.has(chunk.chunkId))
        .slice(0, MAX_RELATED)
    : [];

  return {
    status: "answered",
    message,
    sources: chunks.map((chunk) => toSource(chunk, scope.linkBuildId, queryTokens)),
    related: related.length > 0 ? related.map((chunk) => toSource(chunk, scope.linkBuildId, queryTokens)) : undefined,
  };
};

const regionChoice = (scope: ResponseScope, regionId: string): GideonChoice | undefined => {
  const region = getIndexRegion(scope.index, regionId);
  if (!region) return undefined;
  return {
    type: "REGION",
    id: region.id,
    label: region.name,
    question: `O que faço agora em ${region.name}${scope.choiceSuffix}?`,
  };
};

// Progresso depende da build: com mais de uma jornada iniciada e nenhuma definida, o jogador escolhe
const clarifyBuild = (builds: { buildId: string; buildName: string }[]): GideonResponse => ({
  status: "clarify",
  message: CLARIFY_BUILD_MESSAGE,
  sources: [],
  choices: builds.map((build) => ({
    type: "BUILD",
    id: build.buildId,
    label: build.buildName,
    question: `O que faço agora na ${build.buildName}?`,
  })),
});

// Apresentação honesta do que o guia cobre hoje, derivada do próprio índice
export const describeGuideScope = (index: GuideIndex): string => {
  const regionNames = index.regions
    .filter((region) => getRegionObjectives(index, region.id).length > 0)
    .map((region) => region.name);
  const mechanicTitles = [
    ...new Set(index.chunks.flatMap((chunk) => (chunk.mechanicTitle ? [chunk.mechanicTitle] : []))),
  ];
  const covered = [...regionNames, ...mechanicTitles].join(", ");

  return `Guardo o que o Guiding Grace já registrou: ${covered}. Pergunte sobre NPCs, itens, chefes ou mecânicas, ou peça seu próximo passo.`;
};

const describeScope = (scope: ResponseScope): GideonResponse => ({
  status: "social",
  message: describeGuideScope(scope.index),
  sources: [],
});

const respondRegionStep = (scope: ResponseScope, regionId: string): GideonResponse => {
  const region = getIndexRegion(scope.index, regionId);
  const objectives = getRegionObjectives(scope.index, regionId);
  if (!region) return { status: "not_covered", message: NOT_COVERED_MESSAGE, sources: [], note: NOT_COVERED_NOTE };

  if (objectives.some((chunk) => !isChunkAllowed(chunk, scope.progress))) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  const pending = getPendingObjectives(scope.index, regionId, scope.progress);
  if (pending.length > 0) {
    const [next, after] = pending;
    const message = after
      ? `Em ${region.name}, seu próximo passo é ${next.title}. Depois, ${after.title}.`
      : `Em ${region.name}, resta apenas ${next.title}.`;
    return answered(message, pending.slice(0, 2), scope);
  }

  const nextRegion = findNextRegion(scope.index, scope.progress, regionId);
  const choice = nextRegion ? regionChoice(scope, nextRegion.id) : undefined;
  const intro =
    objectives.length > 0
      ? `Você já concluiu os objetivos que registrei em ${region.name}.`
      : `Não registrei objetivos em ${region.name}.`;

  return {
    status: "answered",
    message: nextRegion ? `${intro} Quando quiser, siga para ${nextRegion.name}.` : `${intro} ${JOURNEY_COMPLETE_MESSAGE}`,
    sources: [],
    choices: choice ? [choice] : undefined,
  };
};

const respondNextStep = (scope: ResponseScope): GideonResponse => {
  if (scope.buildFocus.type === "choose") return clarifyBuild(scope.buildFocus.builds);

  const mentioned = findMentionedRegions(scope.index, scope.normalizedQuestion);
  const focus = resolveFocusRegion(scope.index, scope.progress, mentioned);

  if (focus.type === "choose") {
    const choices = focus.regionIds.flatMap((regionId) => regionChoice(scope, regionId) ?? []);
    return { status: "clarify", message: CLARIFY_REGION_MESSAGE, sources: [], choices };
  }

  if (focus.type === "region") return respondRegionStep(scope, focus.regionId);

  // Nenhuma região em andamento: o começo da jornada é o primeiro passo
  const start = findNextRegion(scope.index, scope.progress);
  if (!start) return { status: "answered", message: JOURNEY_COMPLETE_MESSAGE, sources: [] };
  return respondRegionStep(scope, start.id);
};

const respondAfter = (scope: ResponseScope, previous: GuideChunk): GideonResponse => {
  if (scope.buildFocus.type === "choose" && previous.regionId) return clarifyBuild(scope.buildFocus.builds);

  const following = previous.regionId
    ? getPendingObjectives(scope.index, previous.regionId, scope.progress).find(
        (chunk) => chunk.order > previous.order,
      )
    : scope.index.chunks.find(
        (chunk) => chunk.mechanicId === previous.mechanicId && chunk.order > previous.order,
      );

  if (following) {
    return answered(`Depois de ${previous.title}, o próximo passo é ${following.title}.`, [following], scope);
  }
  if (previous.regionId) return respondRegionStep(scope, previous.regionId);
  return { status: "answered", message: `${previous.title} encerra o que registrei sobre ${previous.mechanicTitle}.`, sources: [] };
};

const findSearchResults = (scope: ResponseScope, question: string, previousChunks: GuideChunk[], boosts: SearchBoosts) => {
  const { tokens, synonyms } = buildSearchQuery(question, scope.index);
  const query = { tokens, synonyms, contextTokens: previousChunks.flatMap((chunk) => chunk.titleTokens) };
  const { allowed, blocked } = partitionChunks(scope.index.chunks, scope.progress);
  const results = tokens.length > 0 ? searchGuide(scope.index, allowed, query, boosts).filter(isRelevant) : [];
  const bestScore = results[0]?.score ?? 0;

  return {
    query,
    blocked,
    queryTerms: new Set([...tokens, ...Object.values(synonyms ?? {}).flat()]),
    chunks: results
      .filter((result) => result.score >= bestScore * SECONDARY_SOURCE_RATIO)
      .map((result) => result.chunk),
  };
};

const respondSearch = (
  scope: ResponseScope,
  question: string,
  previousChunks: GuideChunk[],
  boosts: SearchBoosts,
): GideonResponse => {
  const { query, blocked, queryTerms, chunks } = findSearchResults(scope, question, previousChunks, boosts);
  const subject = previousChunks.filter((chunk) => isChunkAllowed(chunk, scope.progress));

  // Numa continuação ("e qual evento seria esse?"), o assunto anterior segue como fonte. Sem nome novo na
  // pergunta, só ele: resultados genéricos ("evento" casa com a lore) confundiriam a resposta.
  // Com nome novo ("e o Godrick?"), o novo assunto vem primeiro
  if (chunks.length > 0 || subject.length > 0) {
    const bringsNewSubject = chunks.some((chunk) => chunk.titleTokens.some((token) => queryTerms.has(token)));
    let ordered = chunks;
    if (subject.length > 0) ordered = bringsNewSubject ? [...chunks, ...subject] : subject;
    const sources = ordered
      .filter((chunk, position) => ordered.findIndex((other) => other.chunkId === chunk.chunkId) === position)
      .slice(0, MAX_SOURCES);
    return answered(pickLine(ANSWER_LINES, scope.normalizedQuestion), sources, scope, [...queryTerms]);
  }

  if (query.tokens.length === 0) return { status: "clarify", message: CLARIFY_REFERENCE_MESSAGE, sources: [] };

  // Existe resposta, mas só em conteúdo ainda não liberado: o texto bloqueado não é exibido
  if (searchGuide(scope.index, blocked, query, boosts).some(isRelevant)) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  return { status: "not_covered", message: NOT_COVERED_MESSAGE, sources: [], note: NOT_COVERED_NOTE };
};

// Tópicos (NPCs, chefes, itens, lugares) cujos nomes aparecem na pergunta, na ordem em que aparecem
const findNamedSubjects = (scope: ResponseScope, question: string): GuideChunk[] => {
  const { tokens, synonyms } = buildSearchQuery(question, scope.index);
  const entityTokens = getEntityTokens(scope.index);
  const subjects: GuideChunk[] = [];

  tokens.forEach((token) => {
    [token, ...(synonyms?.[token] ?? [])]
      .filter((candidate) => entityTokens.has(candidate))
      .forEach((name) => {
        const subject = scope.index.chunks.find(
          (chunk) => chunk.kind === "region" && chunk.anchor !== undefined && chunk.titleTokens.includes(name),
        );
        if (subject && !subjects.some((chunk) => chunk.chunkId === subject.chunkId)) subjects.push(subject);
      });
  });

  return subjects;
};

// "Qual a ligação entre Blaidd e Kale?": os dois assuntos e os trechos que citam os dois.
// A IA só pode dizer o que o guia liga explicitamente; se nada liga, ela diz isso
const respondRelation = (scope: ResponseScope, question: string, boosts: SearchBoosts): GideonResponse => {
  const subjects = findNamedSubjects(scope, question);
  if (subjects.length < 2) return respondSearch(scope, question, [], boosts);

  const [first, second] = subjects;
  if (!isChunkAllowed(first, scope.progress) || !isChunkAllowed(second, scope.progress)) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  const entityTokens = getEntityTokens(scope.index);
  const namesOf = (chunk: GuideChunk) => chunk.titleTokens.filter((token) => entityTokens.has(token));
  const mentions = (chunk: GuideChunk, subject: GuideChunk) =>
    namesOf(subject).some((name) => chunk.tokens.includes(name));
  const bridges = scope.index.chunks.filter(
    (chunk) =>
      chunk.chunkId !== first.chunkId &&
      chunk.chunkId !== second.chunkId &&
      chunk.kind === "region" &&
      isChunkAllowed(chunk, scope.progress) &&
      mentions(chunk, first) &&
      mentions(chunk, second),
  );

  const response = answered(
    `Eis o que meus registros dizem sobre ${first.title} e ${second.title}.`,
    [first, second, ...bridges].slice(0, MAX_SOURCES),
    scope,
  );
  return {
    ...response,
    guidance: `O jogador quer saber a ligação entre ${first.title} e ${second.title}. Diga apenas o que os trechos ligam explicitamente entre os dois. Se nenhum trecho liga os dois diretamente, diga isso e resuma em uma frase o que cada um faz que envolve o outro.`,
  };
};

// "Se eu quiser pular ele, posso fazer o quê?": o que o guia diz do assunto e os próximos objetivos
// pendentes da mesma região, sem ele. O checklist decide as alternativas; a IA só as redige
const respondSkip = (scope: ResponseScope, previousChunks: GuideChunk[]): GideonResponse => {
  if (scope.buildFocus.type === "choose") return clarifyBuild(scope.buildFocus.builds);

  const subject = previousChunks.find((chunk) => isChunkAllowed(chunk, scope.progress));
  if (!subject?.regionId) return { status: "clarify", message: CLARIFY_REFERENCE_MESSAGE, sources: [] };

  const region = getIndexRegion(scope.index, subject.regionId);
  const alternatives = getPendingObjectives(scope.index, subject.regionId, scope.progress)
    .filter((chunk) => chunk.chunkId !== subject.chunkId && isChunkAllowed(chunk, scope.progress))
    .slice(0, 2);

  if (alternatives.length === 0) {
    const nextRegion = findNextRegion(scope.index, scope.progress, subject.regionId);
    const choice = nextRegion ? regionChoice(scope, nextRegion.id) : undefined;
    return {
      ...answered(
        nextRegion
          ? `Fora ${subject.title}, não registrei outros objetivos pendentes em ${region?.name}. Você pode seguir para ${nextRegion.name}.`
          : `Fora ${subject.title}, não registrei outros objetivos pendentes em ${region?.name}.`,
        [subject],
        scope,
      ),
      choices: choice ? [choice] : undefined,
    };
  }

  const names = alternatives.map((chunk) => chunk.title).join(" e ");
  const response = answered(
    `Se quiser deixar ${subject.title} para depois, seus próximos objetivos em ${region?.name} são ${names}.`,
    [subject, ...alternatives],
    scope,
  );
  return {
    ...response,
    guidance: `O jogador quer pular ${subject.title} por enquanto. Responda em duas partes: (1) o que se sabe sobre ${subject.title} (por exemplo, se é opcional ou recomendado); (2) "Enquanto isso, siga para ${names}", dizendo em poucas palavras o que cada um oferece segundo os trechos. Não diga o que acontece por pular ${subject.title}, a menos que um trecho diga.`,
  };
};

// "Já passei pelo Blaidd?": o fato vem do checklist, decidido aqui; a IA só redige junto com o que o guia diz
// sobre o assunto (a frase abaixo vira a orientação do prompt e o fallback)
const respondProgressCheck = (
  scope: ResponseScope,
  previousChunks: GuideChunk[],
  boosts: SearchBoosts,
  chosenSubject?: GuideChunk,
): GideonResponse => {
  if (scope.buildFocus.type === "choose") return clarifyBuild(scope.buildFocus.builds);

  const { chunks, queryTerms } = findSearchResults(
    scope,
    removeProgressCheckWords(scope.normalizedQuestion),
    previousChunks,
    boosts,
  );
  // "E eu já encontrei ele?": sem nome do guia na pergunta, o assunto é o da resposta anterior
  const namedSubject = chunks.find((chunk) => chunk.titleTokens.some((token) => queryTerms.has(token)));
  const previousSubject = previousChunks.find((chunk) => isChunkAllowed(chunk, scope.progress));
  const subject = chosenSubject ?? namedSubject ?? previousSubject ?? chunks[0];
  if (!subject) return { status: "clarify", message: CLARIFY_REFERENCE_MESSAGE, sources: [] };

  let message: string;
  let checklistFact: string;
  if (!subject.objectiveId) {
    message = `Não acompanho ${subject.title} no checklist; só registro os objetivos marcáveis do guia.`;
    checklistFact = `${subject.title} não é um objetivo do checklist, então não há registro do progresso.`;
  } else if (scope.progress.completedIds.has(subject.objectiveId)) {
    message = `Pelo seu checklist, ${subject.title} já está concluído.`;
    checklistFact = `O jogador marcou ${subject.title} como concluído no checklist.`;
  } else {
    message = `${subject.title} ainda não está marcado como concluído no seu checklist. Se você já passou por lá, marque o objetivo no guia para eu acompanhar.`;
    checklistFact = `${subject.title} ainda não está marcado no checklist; se o jogador já passou por lá, ele pode marcar o objetivo no guia.`;
  }

  // O fato vem do checklist; a IA só o diz e lembra o que o trecho pede, sem adivinhar o que o jogador fez
  return {
    ...answered(message, [subject], scope),
    guidance: `O jogador pergunta se já fez ${subject.title}. ${checklistFact} Responda em duas partes: (1) diga, falando com o jogador ("seu checklist"), o que o checklist registra, sem deduzir se ele fez ou não; (2) resuma em uma frase o que o guia indica fazer com ${subject.title}, citando o número do trecho; se o guia não fala da ação perguntada (ex.: matar), não suponha que ela exista.`,
  };
};

// IA indisponível: os mesmos trechos encontrados pela busca local continuam navegáveis.
// returnLabel ("hoje às 21:00") só existe quando se sabe a hora em que o Gideon volta
export const toFallbackResponse = (
  local: GideonResponse,
  reason: GideonFallbackReason,
  returnLabel = "em breve",
): GideonResponse => {
  const lines = FALLBACK_LINES[reason];
  return {
    ...local,
    status: "fallback",
    fallbackReason: reason,
    message: lines.message.replace("{retorno}", returnLabel),
    note: lines.note.replace("{retorno}", returnLabel),
  };
};

// Resposta 100% local e determinística: é a base confiável do Gideon e o fallback quando a IA não está disponível
// Os assuntos chegam da IA como títulos do guia: só valem os que existem e que o jogador pode ver
const resolveSubjectChunks = (index: GuideIndex, subjects: string[], progress: PlayerProgress): GuideChunk[] =>
  subjects
    .flatMap((subject) => {
      const title = normalizeText(subject);
      return index.chunks.find((chunk) => normalizeText(chunk.title) === title && isChunkAllowed(chunk, progress)) ?? [];
    })
    .slice(0, MAX_SOURCES);

export const respondLocally = (
  index: GuideIndex,
  { question, context, previousSourceIds, interpretation }: RespondInput,
): GideonResponse => {
  const normalizedQuestion = normalizeQuestion(question);
  const buildFocus = resolveBuildFocus(context, normalizedQuestion);
  const focusedBuild = buildFocus.type === "build" ? buildFocus.build : undefined;
  const hasSeveralJourneys = !context.buildId && context.builds.filter(isBuildStarted).length > 1;
  const scope: ResponseScope = {
    index,
    context,
    progress: toPlayerProgress(context, focusedBuild),
    normalizedQuestion,
    buildFocus,
    linkBuildId: getLinkBuildId(context, buildFocus),
    choiceSuffix: hasSeveralJourneys && focusedBuild ? ` na ${focusedBuild.buildName}` : "",
  };
  const previousChunks = previousSourceIds.flatMap(
    (chunkId) => index.chunks.find((chunk) => chunk.chunkId === chunkId) ?? [],
  );
  // O assunto que a IA escolheu na conversa vale mais que as fontes da última resposta
  const subjectChunks = resolveSubjectChunks(index, interpretation?.subjects ?? [], scope.progress);
  const focusChunks = subjectChunks.length > 0 ? subjectChunks : previousChunks;
  const intent: GideonIntent = interpretation?.type
    ? { type: interpretation.type }
    : detectIntent(normalizedQuestion, previousChunks.length > 0);

  const boosts: SearchBoosts = {
    regionIds: [
      ...(context.currentRegionId ? [context.currentRegionId] : []),
      ...findMentionedRegions(index, normalizedQuestion),
    ],
    mechanicId: context.mechanicId,
  };

  switch (intent.type) {
    case "social":
      return { status: "social", message: pickLine(SOCIAL_LINES[intent.kind], normalizedQuestion), sources: [] };
    case "scope":
      return describeScope(scope);
    case "next_step":
      // "O que faço depois do Blaidd?": próximo passo a partir de um assunto é o que vem depois dele
      return subjectChunks[0] ? respondAfter(scope, subjectChunks[0]) : respondNextStep(scope);
    case "after_last":
      return focusChunks[0] ? respondAfter(scope, focusChunks[0]) : respondNextStep(scope);
    case "progress_check":
      return respondProgressCheck(scope, previousChunks, boosts, subjectChunks[0]);
    case "relation":
      return respondRelation(scope, question, boosts);
    case "skip":
      return respondSkip(scope, focusChunks);
    case "follow_up":
      return respondSearch(scope, question, focusChunks, {
        ...boosts,
        chunkIds: new Set(focusChunks.map((chunk) => chunk.chunkId)),
      });
    case "search":
      // Pergunta nova cujo assunto a IA já identificou: o trecho dele entra como fonte garantida
      return respondSearch(scope, question, subjectChunks, {
        ...boosts,
        chunkIds: new Set(subjectChunks.map((chunk) => chunk.chunkId)),
      });
  }
};
