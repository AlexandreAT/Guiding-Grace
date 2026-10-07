export interface Region {
  id: string;
  name: string;
  displayName: string;
  order: number;
  description: string;
  recommendedLevel: string;
  disabled?: boolean;
  status?: string;
  // Região do início da jornada: Gideon pode falar dela antes de o jogador visitá-la
  spoilerFree?: boolean;
}

// Regiões cujo conteúdo ainda não foi escrito ficam bloqueadas em produção
const COMING_SOON = { disabled: true, status: "Em breve" } as const;

// Regiões do Elden Ring com metadados
export const REGIONS: readonly Region[] = [
  {
    id: "geral",
    name: "Terras Intermédias",
    displayName: "Terras Intermédias - Geral",
    order: 1,
    description: "Toda a região das terras intermédias.",
    recommendedLevel: "1-150",
    spoilerFree: true,
  },
  {
    id: "limgrave-top",
    name: "Limgrave (Topo)",
    displayName: "Limgrave - Parte Superior",
    order: 2,
    description: "A região inicial onde começa a jornada.",
    recommendedLevel: "1-40",
    spoilerFree: true,
  },
  {
    id: "limgrave-bottom",
    name: "Limgrave (Base)",
    displayName: "Limgrave - Parte Inferior",
    order: 3,
    description: "Continuação de Limgrave com áreas secretas.",
    recommendedLevel: "15-30",
    spoilerFree: true,
  },
  {
    id: "weeping-peninsula",
    name: "Península das Lágrimas",
    displayName: "Península das Lágrimas",
    order: 4,
    description: "Uma região ao sul importante para exploração inicial.",
    recommendedLevel: "15-30",
    ...COMING_SOON,
  },
  {
    id: "liurnia",
    name: "Liurnia dos Lagos",
    displayName: "Liurnia dos Lagos",
    order: 5,
    description: "Uma região gigante com lago, castelos e magias.",
    recommendedLevel: "40-60",
    ...COMING_SOON,
  },
  {
    id: "caelid-first",
    name: "Caelid (Primeira Parte)",
    displayName: "Caelid - Primeira Parte",
    order: 6,
    description: "Uma região desolada e perigosa.",
    recommendedLevel: "50-70",
    ...COMING_SOON,
  },
  {
    id: "caelid-second",
    name: "Caelid (Segunda Parte)",
    displayName: "Caelid - Segunda Parte",
    order: 7,
    description: "Continuação da região desolada de Caelid com desafios maiores.",
    recommendedLevel: "80-110",
    ...COMING_SOON,
  },
  {
    id: "mt-gelmir",
    name: "Monte Gelmir + Mansão Vulcânica",
    displayName: "Monte Gelmir & Mansão Vulcânica",
    order: 8,
    description: "Uma montanha vulcânica.",
    recommendedLevel: "70-90",
    ...COMING_SOON,
  },
  {
    id: "leyndell-outskirts",
    name: "Arredores da Capital Leyndell",
    displayName: "Arredores da Capital Leyndell",
    order: 9,
    description: "As terras ao redor da capital.",
    recommendedLevel: "60-80",
    ...COMING_SOON,
  },
  {
    id: "leyndell",
    name: "Leyndell (Capital)",
    displayName: "Leyndell - A Capital",
    order: 10,
    description: "A capital dourada, o coração do reino.",
    recommendedLevel: "80-100",
    ...COMING_SOON,
  },
  {
    id: "mt-giants-top",
    name: "Montanha dos Gigantes (Topo)",
    displayName: "Montanha dos Gigantes - Parte Superior",
    order: 11,
    description: "As montanhas geladas dos gigantes.",
    recommendedLevel: "100-120",
    ...COMING_SOON,
  },
  {
    id: "mt-giants-bottom",
    name: "Montanha dos Gigantes (Base)",
    displayName: "Montanha dos Gigantes - Parte Inferior",
    order: 12,
    description: "Uma região escondida, as profundezas geladas, na base da montanha dos gigantes.",
    recommendedLevel: "100-120",
    ...COMING_SOON,
  },
  {
    id: "leyndell-sewers",
    name: "Esgotos de Leyndell",
    displayName: "Esgotos de Leyndell",
    order: 13,
    description: "Os esgostos escondidos da capital.",
    recommendedLevel: "100-120",
    ...COMING_SOON,
  },
  {
    id: "farum-azula",
    name: "Farum Azula",
    displayName: "Farum Azula",
    order: 14,
    description: "Uma fortaleza flutuante nos céus.",
    recommendedLevel: "110-140",
    ...COMING_SOON,
  },
  {
    id: "erdtree",
    name: "Árvore Sacra",
    displayName: "Árvore Sacra",
    order: 15,
    description: "O coração do mundo, o destino final da jornada.",
    recommendedLevel: "140+",
    ...COMING_SOON,
  },
];

export const getRegion = (regionId: string): Region | undefined =>
  REGIONS.find((region) => region.id === regionId);

export const isRegionAvailable = (region: Region): boolean => !region.disabled;
