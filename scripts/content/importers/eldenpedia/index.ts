import { mkdir, writeFile } from "node:fs/promises";
import type { BossDataImporter } from "../types";
import { ELDENPEDIA_SOURCE, mapEldenpediaBoss, type EldenpediaPage } from "./mapper";

const API_URL = "https://eldenring.wiki.gg/api.php";
// A wiki recusa clientes anônimos: o projeto se identifica e espaça as requisições
const USER_AGENT = "GuidingGraceContentImporter/0.1 (fan project; https://github.com/AlexandreAT)";
const REQUEST_INTERVAL_MS = 1_500;
const REQUEST_TIMEOUT_MS = 15_000;
// Respostas brutas, só para conferência local (fora do Git)
const CACHE_DIR = new URL("../../.cache/eldenpedia/", import.meta.url);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestAt = 0;

const fetchPage = async (title: string): Promise<EldenpediaPage> => {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < REQUEST_INTERVAL_MS) await wait(REQUEST_INTERVAL_MS - elapsed);
  lastRequestAt = Date.now();

  const params = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "wikitext|revid",
    format: "json",
    formatversion: "2",
    redirects: "1",
  });
  const response = await fetch(`${API_URL}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Eldenpedia respondeu ${response.status} para "${title}"`);

  const body = (await response.json()) as { parse?: EldenpediaPage; error?: { info?: string } };
  if (!body.parse) throw new Error(`Eldenpedia: ${body.error?.info ?? "resposta sem página"} ("${title}")`);

  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(new URL(`${encodeURIComponent(body.parse.title)}.json`, CACHE_DIR), JSON.stringify(body.parse, null, 2));
  return body.parse;
};

export const eldenpediaImporter: BossDataImporter = {
  source: ELDENPEDIA_SOURCE,
  async importBoss({ id, externalId }) {
    const page = await fetchPage(externalId);
    return mapEldenpediaBoss(page, id, new Date().toISOString());
  },
};
