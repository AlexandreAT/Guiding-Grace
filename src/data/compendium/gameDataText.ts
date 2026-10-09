import type { BossGameData, DamageType, StatusEffect } from "./types";

// Rótulos em português dos dados objetivos (página e Gideon usam os mesmos)
export const DAMAGE_LABELS: Record<DamageType, string> = {
  standard: "Físico (padrão)",
  strike: "Físico (impacto)",
  slash: "Físico (corte)",
  pierce: "Físico (perfuração)",
  magic: "Magia",
  fire: "Fogo",
  lightning: "Raio",
  holy: "Sagrado",
};

export const STATUS_LABELS: Record<StatusEffect, string> = {
  poison: "Veneno",
  rot: "Podridão escarlate",
  bleed: "Hemorragia",
  frost: "Congelamento",
  sleep: "Sono",
  madness: "Loucura",
  death: "Morte instantânea",
};

export const formatNumber = (value: number): string => value.toLocaleString("pt-BR");

const DAMAGE_TYPES = Object.keys(DAMAGE_LABELS) as DamageType[];
const STATUS_EFFECTS = Object.keys(STATUS_LABELS) as StatusEffect[];

// Menor absorção = o chefe sente mais aquele tipo de dano
export const getWeakestDamageTypes = (data: BossGameData): DamageType[] => {
  const known = DAMAGE_TYPES.filter((type) => data.negations[type] !== undefined);
  if (known.length === 0) return [];

  const lowest = Math.min(...known.map((type) => data.negations[type] ?? 0));
  return known.filter((type) => data.negations[type] === lowest);
};

// Tipos acima da menor absorção, do mais resistido para o menos
export const getStrongestDamageTypes = (data: BossGameData): DamageType[] => {
  const weakest = new Set(getWeakestDamageTypes(data));
  return DAMAGE_TYPES.filter((type) => data.negations[type] !== undefined && !weakest.has(type)).sort(
    (a, b) => (data.negations[b] ?? 0) - (data.negations[a] ?? 0),
  );
};

export const formatStatusResistance =(value: number[] | "immune"): string =>
  value === "immune" ? "imune" : formatNumber(value[0]);

export const formatHp = (hp: number[]): string =>
  hp.length > 1
    ? hp.map((value, phase) => `${formatNumber(value)} (fase ${phase + 1})`).join(" e ")
    : formatNumber(hp[0]);

// Texto corrido dos dados objetivos: é o que o Gideon lê para responder "qual a fraqueza de X?"
export const describeBossGameData = (data: BossGameData): string[] => {
  const overview = [
    data.hp.length > 0 ? `HP: ${formatHp(data.hp)}.` : "",
    data.runes !== undefined ? `Runas ao derrotar: ${formatNumber(data.runes)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const negations = DAMAGE_TYPES.filter((type) => data.negations[type] !== undefined)
    .map((type) => `${DAMAGE_LABELS[type]} ${data.negations[type]}%`)
    .join(", ");
  const weakest = getWeakestDamageTypes(data).map((type) => DAMAGE_LABELS[type]);
  // Do mais resistido para o menos, com o valor: "Sagrado 40%, Magia 20%..." (só o que fica acima das fraquezas)
  const strongest = getStrongestDamageTypes(data).map((type) => `${DAMAGE_LABELS[type]} ${data.negations[type]}%`);

  const statuses = STATUS_EFFECTS.flatMap((effect) => {
    const value = data.statusResistances[effect];
    return value === undefined ? [] : [`${STATUS_LABELS[effect]} ${formatStatusResistance(value)}`];
  }).join(", ");

  return [
    overview,
    negations ? `Absorção de dano (quanto menor, mais dano ele sofre): ${negations}.` : "",
    weakest.length > 0 ? `Fraquezas (o dano que ele mais sente): ${weakest.join(", ")}.` : "",
    strongest.length > 0 ? `Resistências (o dano que ele mais absorve): ${strongest.join(", ")}.` : "",
    statuses ? `Resistência a efeitos (acúmulo necessário na primeira aplicação): ${statuses}.` : "",
  ].filter(Boolean);
};
