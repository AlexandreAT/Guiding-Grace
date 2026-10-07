import { ABBREVIATIONS } from "./abbreviations";

// Palavras que não ajudam a achar o trecho certo (as intenções são detectadas antes da tokenização)
const STOPWORDS = new Set([
  "a", "o", "e", "as", "os", "um", "uma", "uns", "umas",
  "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas",
  "ao", "aos", "pra", "pro", "para", "por", "pelo", "pela", "com", "sem", "sobre",
  "que", "se", "ou", "mas", "como", "onde", "qual", "quais", "quem", "quando", "porque",
  "eu", "voce", "ele", "ela", "eles", "elas", "me", "te", "lhe", "meu", "minha", "seu", "sua",
  "isso", "isto", "esse", "essa", "este", "esta", "aquele", "aquela", "dele", "dela", "nele", "nela",
  "ja", "nao", "sim", "mais", "muito", "bem", "tem", "ter", "ha", "sao", "ser", "estao",
  "faco", "fazer", "fica", "ficam", "encontro", "encontrar", "acho", "achar", "pego", "pegar",
  "consigo", "conseguir", "vale", "pena", "algum", "alguma", "la", "aqui", "ai", "entao", "agora",
  "fale", "falar", "diga", "dizer", "explique", "explica", "sei", "saber", "sabe", "sabia", "conhece", "guia",
  "devo", "deve", "posso", "pode", "quero", "preciso", "quanto", "quanta", "serve", "aquilo",
  // Verbos e avaliações comuns em perguntas: o assunto está nos substantivos
  "chamo", "chamar", "subo", "subir", "melhoro", "melhorar", "derrotar", "derroto", "vencer", "venco",
  "enfrento", "enfrentar", "uso", "usar", "funciona", "funcionar", "significa", "existe", "acontece",
  "conte", "contar", "mostre", "mostrar", "ensine", "ensina",
  // Formas de ser/estar e falas de conversa ("seria esse?", "nada aconteceu"): nunca são o assunto
  "seria", "sera", "era", "foi", "fui", "sendo", "sou", "somos", "esteve", "estive",
  "nada", "aconteceu", "acontecer", "falei", "entendi", "entender", "ainda", "so", "apenas",
  "tipo", "coisa", "algo", "certo", "passei", "passar", "fiz", "feito", "conclui", "terminei",
  // Descrevem o tipo da pergunta ("qual a ligação entre..."), não o assunto
  "ligacao", "relacao", "conexao", "entre", "ligado", "ligada", "relacionado", "relacionada", "ver",
  "bom", "boa", "ruim", "favor", "tambem", "mesmo", "tudo", "todos", "hoje", "estou", "estava", "vou",
  // Tempo da conversa ("já encontrei ele antes?", "alguma vez"): nunca são o assunto
  "antes", "depois", "vez",
]);

export const normalizeText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();

// Pergunta digitada como no chat: "oq eu faço agr?" → "o que eu faco agora", "valeuuu" → "valeu"
export const normalizeQuestion = (text: string): string =>
  normalizeText(text)
    .replace(/([a-z])\1{2,}/g, "$1")
    .split(" ")
    .map((word) => ABBREVIATIONS[word] ?? word)
    .join(" ");

// Reduz plurais comuns ("pedras" → "pedra", "especiais" → "especial"); o mesmo corte vale para a pergunta e para o índice
const stem = (token: string): string => {
  if (token.length <= 3) return token;
  if (token.endsWith("ais")) return `${token.slice(0, -3)}al`;
  if (token.endsWith("oes")) return `${token.slice(0, -3)}ao`;
  if (token.endsWith("s")) return token.slice(0, -1);
  return token;
};

export const tokenize = (text: string): string[] =>
  normalizeText(text)
    .split(" ")
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem)
    .filter((token) => !STOPWORDS.has(token));

export const containsPhrase = (normalizedText: string, normalizedPhrase: string): boolean =>
  ` ${normalizedText} `.includes(` ${normalizedPhrase} `);
