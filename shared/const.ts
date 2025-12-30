import { BsSnow, BsTools, BsStars  } from "react-icons/bs";
import { FaQuestion, FaWater } from "react-icons/fa";
import { LiaMountainSolid } from "react-icons/lia";
import { IoIosPerson } from "react-icons/io";
import { GiCastle } from "react-icons/gi";

export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Regiões do Elden Ring com metadados
export const REGIONS = [
  {
    id: "limgrave-top",
    name: "Limgrave (Topo)",
    displayName: "Limgrave - Parte Superior",
    order: 1,
    description: "A região inicial onde começa a jornada.",
    recommendedLevel: "1-30",
    icon: "ra-grass",
  },
  {
    id: "limgrave-bottom",
    name: "Limgrave (Base)",
    displayName: "Limgrave - Parte Inferior",
    order: 2,
    description: "Continuação de Limgrave com áreas secretas.",
    recommendedLevel: "20-30",
    icon: "ra-grass",
  },
  {
    id: "weeping-peninsula",
    name: "Península das Lágrimas",
    displayName: "Península das Lágrimas",
    order: 3,
    description: "Uma região ao sul importante para exploração inicial.",
    recommendedLevel: "15-30",
    icon: GiCastle,
  },
  {
    id: "liurnia",
    name: "Liurnia dos Lagos",
    displayName: "Liurnia dos Lagos",
    order: 4,
    description: "Uma região gigante com lago, castelos e magias.",
    recommendedLevel: "30-50",
    icon: FaWater,
  },
  {
    id: "caelid-first",
    name: "Caelid (Primeira Parte)",
    displayName: "Caelid - Primeira Parte",
    order: 5,
    description: "Uma região desolada e perigosa.",
    recommendedLevel: "40-60",
    icon: "ra-skull",
  },
  {
    id: "caelid-second",
    name: "Caelid (Segunda Parte)",
    displayName: "Caelid - Segunda Parte",
    order: 6,
    description: "Continuação da região desolada de Caelid com desafios maiores.",
    recommendedLevel: "70-90",
    icon: "ra-skull",
  },
  {
    id: "mt-gelmir",
    name: "Monte Gelmir + Mansão Vulcânica",
    displayName: "Monte Gelmir & Mansão Vulcânica",
    order: 7,
    description: "Uma montanha vulcânica.",
    recommendedLevel: "50-70",
    icon: "ra-acid",
  },
  {
    id: "leyndell-outskirts",
    name: "Arredores da Capital Leyndell",
    displayName: "Arredores da Capital Leyndell",
    order: 8,
    description: "As terras ao redor da capital.",
    recommendedLevel: "60-80",
    icon: "ra-dead-tree",
  },
  {
    id: "leyndell",
    name: "Leyndell (Capital)",
    displayName: "Leyndell - A Capital",
    order: 9,
    description: "A capital dourada, o coração do reino.",
    recommendedLevel: "80-100",
    icon: "ra-crown",
  },
  {
    id: "mt-giants-top",
    name: "Montanha dos Gigantes (Topo)",
    displayName: "Montanha dos Gigantes - Parte Superior",
    order: 10,
    description: "As montanhas geladas dos gigantes.",
    recommendedLevel: "80-100",
    icon: LiaMountainSolid,
  },
  {
    id: "mt-giants-bottom",
    name: "Montanha dos Gigantes (Base)",
    displayName: "Montanha dos Gigantes - Parte Inferior",
    order: 11,
    description: "Uma região escondida, as profundezas geladas, na base da montanha dos gigantes.",
    recommendedLevel: "100-120",
    icon: BsSnow,
  },
  {
    id: "leyndell-sewers",
    name: "Esgotos de Leyndell",
    displayName: "Esgotos de Leyndell",
    order: 12,
    description: "Os esgostos escondidos da capital.",
    recommendedLevel: "100-120",
    icon: "ra-turd",
  },
  {
    id: "farum-azula",
    name: "Farum Azula",
    displayName: "Farum Azula",
    order: 13,
    description: "Uma fortaleza flutuante nos céus.",
    recommendedLevel: "110-130",
    icon: "ra-capitol",
  },
  {
    id: "erdtree",
    name: "Árvore Sacra",
    displayName: "Árvore Sacra",
    order: 14,
    description: "O coração do mundo, o destino final da jornada.",
    recommendedLevel: "130+",
    icon: "ra-dead-tree",
  },
] as const;

// Legendas para marcações no mapa
export const MAP_LEGEND = {
  DG: { label: "Desafiador Geral", color: "#e74c3c", icon: "ra-sword" },
  OP: { label: "Opcional", color: "#f39c12", icon: FaQuestion },
  NPC: { label: "NPC Importante", color: "#3498db", icon: IoIosPerson },
  BOSS: { label: "Chefe", color: "#c0392b", icon: "ra-skull" },
  ITEM: { label: "Item Importante", color: "#d4af37", icon: BsTools },
  GRACE: { label: "Graça de Erdtree", color: "#2ecc71", icon: BsStars },
} as const;

// Temas disponíveis
export type ThemeType = 'dark' | 'light';

// Definição dos temas
const THEMES = {
  dark: {
    colors: {
      background: "#0a0a0a",
      foreground: "#f5f5f5",
      gold: "#d4af37",
      goldDark: "#b8860b",
      goldLight: "#ffd700",
      brown: "#8b7355",
      brownDark: "#5d4e37",
      accent: "#f5f5f5",
      accentDark: "#e0e0e0",
      border: "#d4af37",
      shadow: "rgba(212, 175, 55, 0.3)",
      shadowDark: "rgba(0, 0, 0, 0.8)",
    },
    fonts: {
      rpg: "'Cinzel', serif",
      rpgOld: "'MedievalSharp', cursive",
      title: "'Crimson Text', serif",
      body: "'Source Sans Pro', sans-serif",
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      xxl: "4rem",
    },
    transitions: {
      fast: "200ms ease-out",
      normal: "300ms ease-out",
      slow: "400ms ease-out",
    },
    shadows: {
      sm: "0 2px 4px rgba(0, 0, 0, 0.5)",
      md: "0 4px 8px rgba(0, 0, 0, 0.6)",
      lg: "0 8px 16px rgba(0, 0, 0, 0.7)",
      gold: "0 0 10px rgba(212, 175, 55, 0.3)",
      goldLg: "0 0 20px rgba(212, 175, 55, 0.4)",
    },
  },
  light: {
    colors: {
      background: "#f5f5f5",
      foreground: "#0a0a0a",
      gold: "#d4af37",
      goldDark: "#b8860b",
      goldLight: "#ffd700",
      brown: "#8b7355",
      brownDark: "#5d4e37",
      accent: "#0a0a0a",
      accentDark: "#333333",
      border: "#d4af37",
      shadow: "rgba(212, 175, 55, 0.2)",
      shadowDark: "rgba(0, 0, 0, 0.2)",
    },
    fonts: {
      rpg: "'Cinzel', serif",
      rpgOld: "'MedievalSharp', cursive",
      title: "'Crimson Text', serif",
      body: "'Source Sans Pro', sans-serif",
    },
    spacing: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
      xxl: "4rem",
    },
    transitions: {
      fast: "200ms ease-out",
      normal: "300ms ease-out",
      slow: "400ms ease-out",
    },
    shadows: {
      sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
      md: "0 4px 8px rgba(0, 0, 0, 0.15)",
      lg: "0 8px 16px rgba(0, 0, 0, 0.2)",
      gold: "0 0 10px rgba(212, 175, 55, 0.2)",
      goldLg: "0 0 20px rgba(212, 175, 55, 0.3)",
    },
  },
} as const;

// Função para obter o tema baseado no tipo
export const getTheme = (themeType: ThemeType) => {
  return THEMES[themeType];
};

// Exportar o tema padrão (dark)
export const THEME = THEMES.dark;