import { FaWater, FaMapMarkedAlt } from "react-icons/fa";
import { BsSnow, BsTools, BsStars  } from "react-icons/bs";
import { LiaMountainSolid } from "react-icons/lia";
import { GiCrownedSkull, GiDeathSkull, GiHorizonRoad } from "react-icons/gi";
import { IoIosPerson } from "react-icons/io";
import { GiCastle } from "react-icons/gi";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import type { IconType } from "react-icons";
import type { PinType } from "../src/data/regionPins";

// Em desenvolvimento as regiões "Em breve" continuam acessíveis para a escrita do conteúdo
export const CAN_OPEN_LOCKED_REGIONS = import.meta.env.DEV;

// Ícones das regiões na sidebar (o domínio fica em src/data/regions.ts)
export const REGION_ICONS: Record<string, string | IconType> = {
  "geral": FaMapMarkedAlt,
  "limgrave-top": "ra-grass",
  "limgrave-bottom": "ra-grass",
  "weeping-peninsula": GiCastle,
  "liurnia": FaWater,
  "caelid-first": "ra-skull",
  "caelid-second": "ra-skull",
  "mt-gelmir": "ra-acid",
  "leyndell-outskirts": "ra-dead-tree",
  "leyndell": "ra-crown",
  "mt-giants-top": LiaMountainSolid,
  "mt-giants-bottom": BsSnow,
  "leyndell-sewers": "ra-turd",
  "farum-azula": "ra-capitol",
  "erdtree": "ra-dead-tree",
};

// Cores centralizadas para pins e legendas
export const PIN_COLORS = {
  DG: "#e74d3cab",
  BOSS: "#c0392bab",
  OP: "#36c94aab",
  NPC: "#3498dbab",
  ITEM: "#08fcf0ab",
  GRACE: "#f1ee26ab",
  PATH: "#7bff00ab",
} as const satisfies Record<PinType, string>;

// Legendas para marcações no mapa
export const MAP_LEGEND = {
  DG: { label: "Desafio", color: PIN_COLORS.DG, icon: GiDeathSkull },
  BOSS: { label: "Chefe", color: PIN_COLORS.BOSS, icon: GiCrownedSkull },
  OP: { label: "Opcional", color: PIN_COLORS.OP, icon: IoEllipsisHorizontalOutline },
  NPC: { label: "NPC Importante", color: PIN_COLORS.NPC, icon: IoIosPerson },
  ITEM: { label: "Item Importante", color: PIN_COLORS.ITEM, icon: BsTools },
  GRACE: { label: "Graça de Erdtree", color: PIN_COLORS.GRACE, icon: BsStars },
  PATH: { label: "Caminho a Seguir", color: PIN_COLORS.PATH, icon: GiHorizonRoad },
} as const satisfies Record<PinType, { label: string; color: string; icon: IconType }>;

// Tema visual do site
export const THEME = {
  colors: {
    background: "#070807",
    backgroundSecondary: "#0b0c0b",
    surface: "#10100d",
    surfaceHighlighted: "#17140c",
    foreground: "#f2f0ea",
    textSecondary: "#b6b3ac",
    textDisabled: "#77736a",
    gold: "#d4a91f",
    goldDark: "#755e25",
    goldLight: "#e3c260",
    brown: "#8b7355",
    brownDark: "#5d4e37",
    accent: "#f5f5f5",
    accentDark: "#e0e0e0",
    border: "#d4af37",
    shadow: "rgba(212, 175, 55, 0.3)",
    shadowDark: "rgba(0, 0, 0, 0.8)",
    royalRed: "#9b1c31"
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
} as const;

// Configurações de background por região
export const REGION_BACKGROUNDS = {
  "geral": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "limgrave-top": { image: "limgrave", overlayOpacity: 0.7, overlayOpacityMobile: 0.85 },
  "limgrave-bottom": { image: "limgrave", overlayOpacity: 0.7, overlayOpacityMobile: 0.75 },
  "weeping-peninsula": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "liurnia": { image: "liurnia", overlayOpacity: 0.75, overlayOpacityMobile: 0.8 },
  "caelid-first": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "caelid-second": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "mt-gelmir": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "leyndell-outskirts": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "leyndell": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "mt-giants-top": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "mt-giants-bottom": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "leyndell-sewers": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "farum-azula": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
  "erdtree": { image: null, overlayOpacity: 0.8, overlayOpacityMobile: 0.85 },
} as const;
