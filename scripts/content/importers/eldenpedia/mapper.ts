import type { BossGameData, DamageType, StatusEffect } from "../../../../src/data/compendium/types";

export const ELDENPEDIA_SOURCE = "eldenpedia";
export const ELDENPEDIA_BASE_URL = "https://eldenring.wiki.gg/wiki/";

// Página como a API do MediaWiki devolve (action=parse, prop=wikitext|revid)
export interface EldenpediaPage {
  title: string;
  revid: number;
  wikitext: string;
}

type InfoboxParams = Record<string, string>;

const INFOBOX_START = "{{Infobox Boss";

const DAMAGE_PARAMS: Record<DamageType, string> = {
  standard: "res standard",
  strike: "res strike",
  slash: "res slash",
  pierce: "res pierce",
  magic: "res magic",
  fire: "res fire",
  lightning: "res lightning",
  holy: "res holy",
};

const STATUS_PARAMS: Record<StatusEffect, string> = {
  poison: "res poison",
  rot: "res rot",
  bleed: "res bleed",
  frost: "res frost",
  sleep: "res sleep",
  madness: "res madness",
  death: "res death",
};

// Trecho de um template até o "}}" que o fecha, contando templates aninhados
const extractTemplate = (wikitext: string, start: number): string => {
  let depth = 0;
  for (let position = start; position < wikitext.length - 1; position++) {
    const pair = wikitext.slice(position, position + 2);
    if (pair === "{{") depth++;
    if (pair === "}}") depth--;
    if (depth === 0) return wikitext.slice(start, position + 2);
  }
  return wikitext.slice(start);
};

// Parâmetros começam em linha nova com "|"; linhas seguintes continuam o valor (ex.: drops em várias linhas)
const parseInfobox = (template: string): InfoboxParams => {
  const params: InfoboxParams = {};
  let currentKey: string | undefined;

  template
    .slice(INFOBOX_START.length, -2)
    .split("\n")
    .forEach((line) => {
      const match = /^\s*\|\s*([^=|]+?)\s*=(.*)$/.exec(line);
      if (match) {
        currentKey = match[1].toLowerCase();
        params[currentKey] = match[2].trim();
        return;
      }
      if (currentKey) params[currentKey] = `${params[currentKey]}\n${line}`.trim();
    });

  return params;
};

// Infoboxes de chefe da página, na ordem (um por fase quando a página separa as fases)
export const findBossInfoboxes = (wikitext: string): InfoboxParams[] => {
  const infoboxes: InfoboxParams[] = [];
  let start = wikitext.indexOf(INFOBOX_START);
  while (start >= 0) {
    const template = extractTemplate(wikitext, start);
    infoboxes.push(parseInfobox(template));
    start = wikitext.indexOf(INFOBOX_START, start + template.length);
  }
  return infoboxes;
};

// Primeiro número do valor ("6,080", "-10%", "316 (Stormveil) <br> 332 (...)"): o primeiro encontro do chefe
const parseFirstNumber = (value: string | undefined): number | undefined => {
  const match = value ? /-?\d[\d,]*/.exec(value) : null;
  return match ? Number(match[0].replace(/,/g, "")) : undefined;
};

const parseStatus = (value: string | undefined): number[] | "immune" | undefined => {
  if (!value) return undefined;
  if (/immune/i.test(value)) return "immune";
  // "318 / 416 / 706 / 1163": acúmulo necessário a cada aplicação
  if (value.includes("/")) {
    return value.split("/").flatMap((part) => parseFirstNumber(part) ?? []);
  }
  const single = parseFirstNumber(value);
  return single === undefined ? undefined : [single];
};

// [[Remembrance of the Grafted]] e [[Página|Texto]] → nome exibido
const parseLinks = (value: string | undefined): string[] =>
  [...(value ?? "").matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map((match) => (match[2] ?? match[1]).trim());

const pickFromLast = (infoboxes: InfoboxParams[], key: string): string | undefined =>
  [...infoboxes].reverse().find((infobox) => infobox[key])?.[key];

export const toPageUrl = (title: string): string =>
  `${ELDENPEDIA_BASE_URL}${encodeURIComponent(title.replace(/ /g, "_"))}`;

// Formato da Eldenpedia → formato interno. Só fatos: nenhum texto da wiki é copiado
export const mapEldenpediaBoss = (page: EldenpediaPage, id: string, importedAt: string): BossGameData => {
  const infoboxes = findBossInfoboxes(page.wikitext);
  if (infoboxes.length === 0) throw new Error(`Sem {{Infobox Boss}} na página "${page.title}"`);

  // Resistências e recompensas valem para o fim da luta: a última fase traz os valores completos
  const finalPhase = infoboxes[infoboxes.length - 1];
  const negations: BossGameData["negations"] = {};
  (Object.keys(DAMAGE_PARAMS) as DamageType[]).forEach((type) => {
    const value = parseFirstNumber(finalPhase[DAMAGE_PARAMS[type]]);
    if (value !== undefined) negations[type] = value;
  });

  const statusResistances: BossGameData["statusResistances"] = {};
  (Object.keys(STATUS_PARAMS) as StatusEffect[]).forEach((effect) => {
    const value = parseStatus(finalPhase[STATUS_PARAMS[effect]]);
    if (value !== undefined) statusResistances[effect] = value;
  });

  return {
    id,
    hp: infoboxes.flatMap((infobox) => parseFirstNumber(infobox.hp) ?? []),
    runes: parseFirstNumber(pickFromLast(infoboxes, "runes")),
    negations,
    statusResistances,
    drops: [...new Set(parseLinks(pickFromLast(infoboxes, "drops")))],
    externalIds: { [ELDENPEDIA_SOURCE]: page.title },
    provenance: {
      source: ELDENPEDIA_SOURCE,
      url: toPageUrl(page.title),
      revision: String(page.revid),
      importedAt,
    },
  };
};
