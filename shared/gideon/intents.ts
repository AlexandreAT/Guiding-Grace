export type SocialKind = "greeting" | "thanks" | "farewell";

export type GideonIntent =
  | { type: "social"; kind: SocialKind }
  | { type: "scope" }
  | { type: "next_step" }
  | { type: "after_last" }
  | { type: "progress_check" }
  | { type: "relation" }
  | { type: "skip" }
  | { type: "follow_up" }
  | { type: "search" };

const SOCIAL_PHRASES: Record<SocialKind, string[]> = {
  greeting: ["oi", "ola", "opa", "eae", "e ai", "salve", "bom dia", "boa tarde", "boa noite", "hello", "hey"],
  thanks: ["obrigado", "obrigada", "valeu", "vlw", "brigado", "agradeco", "muito obrigado"],
  farewell: ["tchau", "adeus", "ate mais", "ate logo", "ate depois", "falou", "ate a proxima"],
};

const SCOPE_PATTERNS = [
  /\bo que (voce|vc) (sabe|faz|cobre|conhece)\b/,
  /\bquem (e voce|voce e)\b/,
  /\b(ajuda|help)\b/,
  /\bo que (tem|existe) no guia\b/,
];

const NEXT_STEP_PATTERNS = [
  // "o que faço com a pedra?" é busca; só conta quando a frase termina no pedido de direção
  /^(e )?o que (eu )?(faco|fazer|devo fazer)( agora| primeiro| depois)?( aqui| (em|na|no|nessa|nesse) .+)?$/,
  /\bproxim[oa]s? (objetivo|passo|alvo|destino)\b/,
  /\bqual (e )?o proximo\b/,
  /\b(para|pra) onde (eu )?(vou|devo ir|sigo)\b/,
  /\bo que (ainda )?falta\b/,
  /\bpor onde (eu )?comeco\b/,
];

// "Já passei pelo Blaidd?", "eu já não fiz isso?": pergunta sobre o próprio progresso
const PROGRESS_CHECK_PATTERN =
  /\bja (nao )?(passei|fiz|conclui|terminei|completei|derrotei|matei|peguei|encontrei|falei|visitei|achei)\b/;

// "já encontrei ele antes?": o verbo descreve a pergunta, não o assunto ("encontrei" casaria com qualquer
// trecho que diga "você pode encontrar"), então sai antes da busca
export const removeProgressCheckWords = (normalizedQuestion: string): string =>
  normalizedQuestion.replace(PROGRESS_CHECK_PATTERN, " ").trim();

// "Qual a ligação entre Blaidd e Kale?", "o que o Kale tem a ver com o Blaidd?"
const RELATION_PATTERN = /\b(ligacao|relacao|conexao|ligad[oa]s?|relacionad[oa]s?|tem a ver|tem haver)\b/;

// "Se eu quiser pular ele, posso fazer o quê?": alternativa ao assunto anterior, respondida pelo checklist
const SKIP_PATTERN =
  /\b(pular|pulo|pulando|sem (matar|derrotar|enfrentar|fazer)|em vez d|ao inves d|alternativa|outra coisa|deixar (ele|ela|isso) (pra|para) depois)/;

const AFTER_LAST_PHRASES = new Set(["e depois", "depois", "e agora", "e entao", "e o proximo", "proximo"]);

// Pronomes e retomadas que só fazem sentido com o assunto anterior
const FOLLOW_UP_PATTERN = /\b(ele|ela|dele|dela|nele|nela|isso|esse|essa|esses|essas|la|normais|outra|outro)\b|^e /;

const ADDRESS_WORDS = new Set(["gideon", "sir", "ofnir", "onisciente"]);

const removeAddress = (normalizedQuestion: string) =>
  normalizedQuestion
    .split(" ")
    .filter((word) => !ADDRESS_WORDS.has(word))
    .join(" ");

export const detectIntent = (normalizedQuestion: string, hasPreviousSources: boolean): GideonIntent => {
  const phrase = removeAddress(normalizedQuestion);

  const socialKind = (Object.keys(SOCIAL_PHRASES) as SocialKind[]).find((kind) =>
    SOCIAL_PHRASES[kind].includes(phrase),
  );
  if (socialKind) return { type: "social", kind: socialKind };

  if (SCOPE_PATTERNS.some((pattern) => pattern.test(phrase))) return { type: "scope" };

  if (PROGRESS_CHECK_PATTERN.test(phrase)) return { type: "progress_check" };

  if (AFTER_LAST_PHRASES.has(phrase)) {
    return hasPreviousSources ? { type: "after_last" } : { type: "next_step" };
  }

  if (NEXT_STEP_PATTERNS.some((pattern) => pattern.test(phrase))) return { type: "next_step" };

  if (RELATION_PATTERN.test(phrase)) return { type: "relation" };

  if (hasPreviousSources && SKIP_PATTERN.test(phrase)) return { type: "skip" };

  // Pronome ou "e ..." retoma o assunto anterior, seja qual for o tamanho da pergunta;
  // se ela trouxer um nome novo, a própria busca troca de assunto
  if (hasPreviousSources && FOLLOW_UP_PATTERN.test(phrase)) return { type: "follow_up" };

  return { type: "search" };
};
