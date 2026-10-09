import { getLinkBuildId, isBuildStarted, resolveBuildFocus, type BuildFocus } from "./builds";
import { getCorrectableNames } from "./entities";
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
import { normalizeQuestion, normalizeText, tokenize } from "./normalize";
import { isChunkAllowed, partitionChunks, toPlayerProgress, type PlayerProgress } from "./progressGuard";
import { findRelatedChunks } from "./related";
import { buildSearchQuery, getDocumentFrequency, isRelevant, isSameEntity, searchGuide, type SearchBoosts } from "./search";
import { toSource } from "./sources";
import {
  GAME_DATA_SECTION_ID,
  SUMMARY_SECTION_ID,
  type CompendiumRef,
} from "../../src/data/compendium/types";
import type {
  AnswerDetail,
  GideonChoice,
  GideonFallbackReason,
  GideonResponse,
  GuideChunk,
  GuideEntity,
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
  // Resposta completa pedida pelo jogador: mais trechos do mesmo assunto vão para a IA
  detail: AnswerDetail;
}

// Na resposta completa, as outras seções do mesmo assunto (origem, estratégia, depois da batalha...) entram como
// contexto extra, sempre pelo Progress Guard
const MAX_RELATED_FULL = 5;

const findSameEntityChunks = (scope: ResponseScope, subject: GuideChunk, excludedIds: ReadonlySet<string>): GuideChunk[] => {
  const entity = subject.entity;
  if (!entity) return [];
  return scope.index.chunks.filter(
    (chunk) =>
      !excludedIds.has(chunk.chunkId) &&
      chunk.entity !== undefined &&
      isSameEntity(chunk.entity, entity) &&
      isChunkAllowed(chunk, scope.progress),
  );
};

const answered = (
  message: string,
  chunks: GuideChunk[],
  scope: ResponseScope,
  queryTokens: string[] = [],
  // Respostas focadas (ex.: estratégia de um chefe) não levam trechos de outros assuntos
  withRelated = true,
): GideonResponse => {
  const sourceIds = new Set(chunks.map((chunk) => chunk.chunkId));
  const isFull = scope.detail === "full";
  const limit = isFull ? MAX_RELATED_FULL : MAX_RELATED;
  const sameEntity = chunks[0] && isFull ? findSameEntityChunks(scope, chunks[0], sourceIds) : [];
  const byRelation = chunks[0] && (withRelated || isFull)
    ? findRelatedChunks(scope.index, chunks[0], scope.progress, limit + chunks.length)
    : [];
  // Na resposta completa, o assunto em si vem primeiro; trechos de outros assuntos só entram se ele não tiver mais
  // seções (eles davam material para parágrafos de "moral da história" que nenhum trecho sustenta)
  const related = (sameEntity.length > 0 ? sameEntity : withRelated ? byRelation : [])
    .filter((chunk, position, all) => !sourceIds.has(chunk.chunkId) && all.findIndex((other) => other.chunkId === chunk.chunkId) === position)
    .slice(0, limit);

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

  return `Guardo o que o Guiding Grace já registrou: ${covered}. No Compêndio, guardo chefes e lore. Pergunte sobre NPCs, itens, chefes, a história do mundo ou mecânicas, ou peça seu próximo passo.`;
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

// Entradas do Compêndio citadas pelo nome (ou apelido) na pergunta, já com a correção de digitação
const findMentionedEntities = (scope: ResponseScope, queryTerms: ReadonlySet<string>): GuideEntity[] =>
  scope.index.entities.filter((entity) =>
    [entity.name, ...entity.aliases].some((name) => {
      const nameTokens = tokenize(name);
      return nameTokens.length > 0 && nameTokens.every((token) => queryTerms.has(token));
    }),
  );

const hasAllowedChunk = (scope: ResponseScope, ref: CompendiumRef): boolean =>
  scope.index.chunks.some(
    (chunk) => chunk.entity !== undefined && isSameEntity(chunk.entity, ref) && isChunkAllowed(chunk, scope.progress),
  );

// Trechos liberados das entradas do Compêndio citadas pelo nome na pergunta ("quem é a marika?" → artigo Marika)
const findNamedEntityChunks = (scope: ResponseScope, question: string): GuideChunk[] => {
  const { tokens, synonyms } = buildSearchQuery(question, scope.index);
  const queryTerms = new Set([...tokens, ...Object.values(synonyms ?? {}).flat()]);
  // "Terceira Igreja de Marika" é um lugar: o nome citado faz parte de um título mais longo que a pergunta inteira cita
  const longerTitles = scope.index.chunks
    .map((chunk) => chunk.titleTokens)
    .filter((titleTokens) => titleTokens.length > 1 && titleTokens.every((token) => queryTerms.has(token)));
  const refs = findMentionedEntities(scope, queryTerms)
    .filter((entity) => {
      const nameTokens = tokenize(entity.name);
      return !longerTitles.some(
        (titleTokens) => titleTokens.length > nameTokens.length && nameTokens.every((token) => titleTokens.includes(token)),
      );
    })
    .map((entity) => entity.ref);
  return scope.index.chunks.filter(
    (chunk) =>
      chunk.entity !== undefined &&
      refs.some((ref) => isSameEntity(ref, chunk.entity!)) &&
      isChunkAllowed(chunk, scope.progress),
  );
};

// A pergunta cita uma entrada do Compêndio da qual nenhum trecho está liberado
const mentionsBlockedEntity = (scope: ResponseScope, queryTerms: ReadonlySet<string>): boolean =>
  findMentionedEntities(scope, queryTerms).some((entity) => !hasAllowedChunk(scope, entity.ref));

const respondSearch = (
  scope: ResponseScope,
  question: string,
  previousChunks: GuideChunk[],
  boosts: SearchBoosts,
  // Assunto escolhido (pela IA ou pelo nome citado na pergunta): os trechos dele vêm antes dos outros resultados
  subjectFirst = false,
): GideonResponse => {
  const { query, blocked, queryTerms, chunks } = findSearchResults(scope, question, previousChunks, boosts);
  const subject = previousChunks.filter((chunk) => isChunkAllowed(chunk, scope.progress));

  // Pergunta sobre um chefe ou personagem ainda não alcançado: trechos parecidos de outro assunto não servem
  // ("fraqueza do Radahn" casaria com os dados de combate do Godrick)
  if (mentionsBlockedEntity(scope, queryTerms)) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  // Numa continuação ("e qual evento seria esse?"), o assunto anterior segue como fonte. Sem nome novo na
  // pergunta, só ele: resultados genéricos ("evento" casa com a lore) confundiriam a resposta.
  // Com nome novo ("e o Godrick?"), o novo assunto vem primeiro
  if (chunks.length > 0 || subject.length > 0) {
    const bringsNewSubject = chunks.some((chunk) => chunk.titleTokens.some((token) => queryTerms.has(token)));
    // Dentro do assunto, os trechos que a busca achou mais relevantes vêm primeiro ("fraqueza" → dados de combate)
    const subjectIds = new Set(subject.map((chunk) => chunk.chunkId));
    const rankedSubject = [...chunks.filter((chunk) => subjectIds.has(chunk.chunkId)), ...subject];
    // "Quem é a Marika?": a pergunta é só o nome do assunto, então o resumo dele responde melhor que um detalhe
    const subjectNames = new Set(subject.flatMap((chunk) => tokenize(chunk.entityName ?? "")));
    const asksOnlyTheName =
      query.tokens.length > 0 &&
      query.tokens.every(
        (token) => subjectNames.has(token) || (query.synonyms?.[token] ?? []).some((synonym) => subjectNames.has(synonym)),
      );
    if (asksOnlyTheName) rankedSubject.sort((a, b) => Number(b.sectionId === SUMMARY_SECTION_ID) - Number(a.sectionId === SUMMARY_SECTION_ID));
    let ordered = chunks;
    if (subject.length > 0 && subjectFirst) ordered = [...rankedSubject, ...chunks];
    else if (subject.length > 0) ordered = bringsNewSubject ? [...chunks, ...rankedSubject] : rankedSubject;
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

// Um lado de uma pergunta de relação: uma entrada do Compêndio, um tópico do guia ou um nome que só aparece nos
// textos (ex.: Godwyn, citado na Noite das Facas Negras)
interface RelationSubject {
  label: string;
  // Palavras que identificam o assunto dentro dos textos
  names: string[];
  // Trechos liberados sobre ele
  chunks: GuideChunk[];
  // Existe, mas nada dele está liberado
  blocked: boolean;
}

const toEntitySubject = (scope: ResponseScope, entity: GuideEntity): RelationSubject => {
  const correctableNames = getCorrectableNames(scope.index);
  const all = scope.index.chunks.filter((chunk) => chunk.entity !== undefined && isSameEntity(chunk.entity, entity.ref));
  const allowed = all.filter((chunk) => isChunkAllowed(chunk, scope.progress));
  return {
    label: entity.name,
    names: [...new Set([entity.name, ...entity.aliases].flatMap(tokenize))].filter((token) => correctableNames.has(token)),
    chunks: allowed,
    blocked: all.length > 0 && allowed.length === 0,
  };
};

// Grafia original do nome no texto ("godwyn" → "Godwyn"), para a orientação da IA
const findDisplayName = (chunks: GuideChunk[], name: string): string =>
  chunks
    .flatMap((chunk) => chunk.text.split(/[^\p{L}'-]+/u))
    .find((word) => tokenize(word)[0] === name) ?? name;

const findRelationSubjects = (scope: ResponseScope, question: string, chosenChunks: GuideChunk[]): RelationSubject[] => {
  const { index } = scope;
  const correctableNames = getCorrectableNames(index);
  const subjects: RelationSubject[] = [];
  const add = (subject: RelationSubject) => {
    if (subject.names.length > 0 && !subjects.some((other) => other.label === subject.label)) subjects.push(subject);
  };
  const findEntity = (ref: CompendiumRef) => index.entities.find((entity) => isSameEntity(entity.ref, ref));

  // Assunto escolhido pela interpretação da IA
  chosenChunks.forEach((chunk) => {
    const entity = chunk.entity ? findEntity(chunk.entity) : undefined;
    if (entity) add(toEntitySubject(scope, entity));
  });

  // Nomes citados na pergunta, já com a correção de digitação ("godwin" → "godwyn")
  const { tokens, synonyms } = buildSearchQuery(question, index);
  tokens
    .flatMap((token) => [token, ...(synonyms?.[token] ?? [])])
    .filter((name) => correctableNames.has(name))
    .forEach((name) => {
      if (subjects.some((subject) => subject.names.includes(name))) return;

      const entity = index.entities.find((candidate) =>
        [candidate.name, ...candidate.aliases].some((entityName) => tokenize(entityName).includes(name)),
      );
      if (entity) {
        add(toEntitySubject(scope, entity));
        return;
      }

      const topic = index.chunks.find(
        (chunk) => chunk.kind === "region" && chunk.anchor !== undefined && chunk.titleTokens.includes(name),
      );
      if (topic) {
        const allowed = isChunkAllowed(topic, scope.progress);
        add({
          label: topic.title,
          names: topic.titleTokens.filter((token) => correctableNames.has(token)),
          chunks: allowed ? [topic] : [],
          blocked: !allowed,
        });
        return;
      }

      const mentions = index.chunks.filter((chunk) => chunk.tokens.includes(name));
      const allowed = mentions.filter((chunk) => isChunkAllowed(chunk, scope.progress));
      add({
        label: findDisplayName(allowed, name),
        names: [name],
        chunks: allowed,
        blocked: mentions.length > 0 && allowed.length === 0,
      });
    });

  return subjects;
};

// Do lado de um assunto, o trecho que mais compartilha nomes com o outro lado: é onde costuma estar o elo
// (o trecho de origem de Godrick cita Marika, que também aparece no trecho de Godwyn)
const pickRelationChunk = (scope: ResponseScope, subject: RelationSubject, other: RelationSubject): GuideChunk => {
  const correctableNames = getCorrectableNames(scope.index);
  const frequency = getDocumentFrequency(scope.index);
  const otherNames = new Set(other.chunks.flatMap((chunk) => chunk.tokens.filter((token) => correctableNames.has(token))));
  // Nomes raros pesam mais: "Marika" diz mais do que "Grande Runa", que aparece em muitos trechos
  const sharedNames = (chunk: GuideChunk) =>
    [...new Set(chunk.tokens.filter((token) => otherNames.has(token)))].reduce(
      (sum, token) => sum + 1 / (frequency.get(token) ?? 1),
      0,
    );
  return subject.chunks.reduce((best, chunk) => (sharedNames(chunk) > sharedNames(best) ? chunk : best));
};

// "Qual a ligação entre Blaidd e Kale?", "Godrick tem ligação com Godwyn?": os dois assuntos e os trechos que citam
// os dois. A IA diz o que o guia liga; se nada liga diretamente, pode apontar um elo em comum como suposição
const respondRelation = (
  scope: ResponseScope,
  question: string,
  boosts: SearchBoosts,
  chosenChunks: GuideChunk[],
): GideonResponse => {
  const subjects = findRelationSubjects(scope, question, chosenChunks);
  if (subjects.some((subject) => subject.blocked)) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  const known = subjects.filter((subject) => subject.chunks.length > 0);
  if (known.length < 2) return respondSearch(scope, question, chosenChunks, boosts);

  const [first, second] = known;
  const mentions = (chunk: GuideChunk, subject: RelationSubject) =>
    subject.names.some((name) => chunk.tokens.includes(name));
  const bridges = scope.index.chunks.filter(
    (chunk) => isChunkAllowed(chunk, scope.progress) && mentions(chunk, first) && mentions(chunk, second),
  );
  const firstChunk = pickRelationChunk(scope, first, second);
  const secondChunk = pickRelationChunk(scope, second, first);
  const ordered = [firstChunk, secondChunk, ...bridges];
  const sources = ordered
    .filter((chunk, position) => ordered.findIndex((other) => other.chunkId === chunk.chunkId) === position)
    .slice(0, MAX_SOURCES);

  const intro = `O jogador quer saber a ligação entre ${first.label} e ${second.label}.`;
  const links = findSharedNames(scope, firstChunk, secondChunk, [first, second]);
  let guidance = `${intro} Diga o que os trechos ligam explicitamente entre os dois.`;
  if (bridges.length === 0 && links.length > 0) {
    guidance = `${intro} Nenhum trecho liga os dois diretamente: diga isso numa frase. O elo que aparece dos dois lados é ${links.join(" e ")}: aponte-o começando com "Ao que tudo indica", dizendo o que cada trecho fala de ${links.join(" e ")}. Não acrescente nenhum outro elo.`;
  } else if (bridges.length === 0) {
    guidance = `${intro} Nenhum trecho liga os dois nem mostra um elo em comum: diga isso e resuma em uma frase o que cada trecho diz.`;
  }

  return {
    ...answered(`Eis o que meus registros dizem sobre ${first.label} e ${second.label}.`, sources, scope, [], false),
    guidance,
  };
};

// Nomes raros que aparecem nos trechos dos dois lados (ex.: Marika, para Godrick e Godwyn): o elo é decidido pelo
// código, a IA só o redige como suposição
const MAX_SHARED_NAMES = 2;
// Fração dos trechos: em proporção, o limite acompanha o guia crescer (Marika ganhou artigo próprio e aparece em mais trechos)
const MAX_SHARED_NAME_SPREAD = 0.25;

const findSharedNames = (
  scope: ResponseScope,
  firstChunk: GuideChunk,
  secondChunk: GuideChunk,
  subjects: RelationSubject[],
): string[] => {
  const correctableNames = getCorrectableNames(scope.index);
  const frequency = getDocumentFrequency(scope.index);
  const subjectNames = new Set(subjects.flatMap((subject) => subject.names));
  const secondTokens = new Set(secondChunk.tokens);
  const maxSpread = scope.index.chunks.length * MAX_SHARED_NAME_SPREAD;

  return [...new Set(firstChunk.tokens)]
    .filter(
      (token) =>
        secondTokens.has(token) &&
        correctableNames.has(token) &&
        !subjectNames.has(token) &&
        (frequency.get(token) ?? 0) <= maxSpread,
    )
    .sort((a, b) => (frequency.get(a) ?? 0) - (frequency.get(b) ?? 0))
    .slice(0, MAX_SHARED_NAMES)
    .map((token) => findDisplayName([firstChunk, secondChunk], token));
};

// Linhas do texto dos dados de combate (gameDataText.ts) que viram números obrigatórios na resposta de estratégia
const COMBAT_FACT_PREFIXES = ["HP:", "Fraquezas", "Resistências"];

// "Como vencer o Godrick?": a estratégia do chefe e os dados de combate (fraquezas e resistências), sem trechos
// de outros assuntos. O código escolhe as seções; a IA só redige
const respondStrategy = (
  scope: ResponseScope,
  question: string,
  chosenChunks: GuideChunk[],
  previousChunks: GuideChunk[],
  boosts: SearchBoosts,
): GideonResponse => {
  // O chefe vem da interpretação, do nome citado na pergunta ou do assunto anterior ("e como vencer ele?")
  const { queryTerms } = findSearchResults(scope, question, previousChunks, boosts);
  const named = findMentionedEntities(scope, queryTerms).find((entity) => entity.ref.kind === "boss")?.ref;
  const fromChunks = [...chosenChunks, ...previousChunks].find((chunk) => chunk.entity?.kind === "boss")?.entity;
  const bossRef = chosenChunks.find((chunk) => chunk.entity?.kind === "boss")?.entity ?? named ?? fromChunks;
  if (!bossRef) return respondSearch(scope, question, previousChunks, boosts);

  const bossChunks = scope.index.chunks.filter(
    (chunk) =>
      chunk.kind === "boss" &&
      chunk.entity !== undefined &&
      isSameEntity(chunk.entity, bossRef) &&
      isChunkAllowed(chunk, scope.progress),
  );
  if (bossChunks.length === 0) {
    return { status: "spoiler_blocked", message: pickLine(SPOILER_LINES, scope.normalizedQuestion), sources: [] };
  }

  const name = bossChunks[0].entityName ?? "";
  const pick = (sectionId: string) => bossChunks.filter((chunk) => chunk.sectionId === sectionId);
  const sources = [...pick("strategy"), ...pick(GAME_DATA_SECTION_ID), ...pick(SUMMARY_SECTION_ID)].slice(0, MAX_SOURCES);

  // Os números saem prontos do código: a IA não escolhe nem arredonda (e a validação recusa número inventado)
  const combatFacts = pick(GAME_DATA_SECTION_ID)
    .flatMap((chunk) => chunk.passages)
    .filter((passage) => COMBAT_FACT_PREFIXES.some((prefix) => passage.startsWith(prefix)))
    .join(" ");
  const strategyPart = pick("strategy").length > 0
    ? "(1) a estratégia do trecho de estratégia, só com as fases, golpes e dicas que ele descreve (se ele não fala de uma fase, não descreva essa fase)"
    : "(1) que o guia ainda não tem uma estratégia escrita para esse chefe";
  const combatPart = combatFacts
    ? `(2) os dados de combate, usando estes números exatamente como estão: ${combatFacts}`
    : "(2) o que o resumo diz do chefe";

  return {
    ...answered(`Para enfrentar ${name}, eis a estratégia e os dados de combate.`, sources, scope, [], false),
    guidance: `O jogador quer saber como vencer ${name}. Responda em até 5 frases objetivas: ${strategyPart}; ${combatPart}. Não diga se vale a pena, não descreva nada que os trechos não descrevem e não traga instruções de outros assuntos nem da conversa.`,
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

const findTrackedChunk = (scope: ResponseScope, chunk: GuideChunk): GuideChunk | undefined => {
  const entity = chunk.entity;
  if (chunk.objectiveId || !entity) return undefined;
  return scope.index.chunks.find(
    (other) =>
      other.objectiveId !== undefined &&
      other.entity !== undefined &&
      isSameEntity(other.entity, entity) &&
      isChunkAllowed(other, scope.progress),
  );
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
  const candidate = chosenSubject ?? namedSubject ?? previousSubject ?? chunks[0];
  if (!candidate) return { status: "clarify", message: CLARIFY_REFERENCE_MESSAGE, sources: [] };
  // Seção do Compêndio (ex.: resumo de Godrick): o progresso dela é o objetivo do guia da região, o tópico com checkbox
  const subject = findTrackedChunk(scope, candidate) ?? candidate;

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
// Uma entrada do Compêndio ("Godrick, o Enxertado") traz todos os trechos dela, inclusive o tópico no guia da
// região; a busca escolhe depois qual seção responde a pergunta (combate, lore, localização)
const resolveSubjectChunks = (index: GuideIndex, subjects: string[], progress: PlayerProgress): GuideChunk[] =>
  subjects.flatMap((subject) => {
    const name = normalizeText(subject);
    const entity = index.entities.find((candidate) =>
      [candidate.name, ...candidate.aliases].some((entityName) => normalizeText(entityName) === name),
    );
    if (entity) {
      return index.chunks.filter(
        (chunk) => chunk.entity !== undefined && isSameEntity(chunk.entity, entity.ref) && isChunkAllowed(chunk, progress),
      );
    }
    return index.chunks.find((chunk) => normalizeText(chunk.title) === name && isChunkAllowed(chunk, progress)) ?? [];
  });

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
    detail: interpretation?.detail ?? "normal",
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
    entity: context.entity,
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
      return respondRelation(scope, question, boosts, subjectChunks);
    case "strategy":
      return respondStrategy(scope, question, subjectChunks, previousChunks, boosts);
    case "skip":
      return respondSkip(scope, focusChunks);
    case "follow_up":
      return respondSearch(scope, question, focusChunks, {
        ...boosts,
        chunkIds: new Set(focusChunks.map((chunk) => chunk.chunkId)),
      });
    case "search": {
      // Assunto da pergunta: o que a IA identificou ou, sem ela, a entrada do Compêndio citada pelo nome
      const searchSubject = subjectChunks.length > 0 ? subjectChunks : findNamedEntityChunks(scope, question);
      return respondSearch(
        scope,
        question,
        searchSubject,
        { ...boosts, chunkIds: new Set(searchSubject.map((chunk) => chunk.chunkId)) },
        searchSubject.length > 0,
      );
    }
  }
};
