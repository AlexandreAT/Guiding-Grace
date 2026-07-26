import { BsTools, BsStars  } from "react-icons/bs";
import { GiCrownedSkull, GiDeathSkull, GiHorizonRoad } from "react-icons/gi";
import { IoIosPerson } from "react-icons/io";
import { PIN_COLORS } from "../../shared/const";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import type { IconType } from "react-icons";

export type PinData = { 
  id: string; 
  x: number; 
  y: number; 
  type?: string; 
  label?: string;
  icon?: string | IconType;
  color?: string;
  labelAbove?: boolean;
};

export const regionPins: Record<string, PinData[]> = {
  "limgrave-top": [
    { id: "limgrave-grace-1", x: 0.6389, y: 0.4622, type: "GRACE", label: "Graça de Erdtree", icon: BsStars, color: PIN_COLORS.GRACE },
    { id: "limgrave-item-2", x: 0.65, y: 0.44, type: "ITEM", label: "Espada do Lorde", icon: BsTools, color: PIN_COLORS.ITEM, labelAbove: true },
    { id: "limgrave-boss-1", x: 0.3152, y: 0.1731, type: "BOSS", label: "Godrick, o Enxertado", icon: GiCrownedSkull, color: PIN_COLORS.BOSS },
    
    { id: "limgrave-npc-2", x: 0.592, y: 0.6288, type: "NPC", label: "Mercador Kale", icon: IoIosPerson, color: PIN_COLORS.NPC },
    
    { id: "limgrave-npc-1", x: 0.6041, y: 0.7105, type: "NPC", label: "Varre", icon: IoIosPerson, color: PIN_COLORS.NPC },
    { id: "limgrave-npc-4", x: 0.6157, y: 0.3029, type: "NPC", label: "Bernahl", icon: IoIosPerson, color: PIN_COLORS.NPC },

    { id: "limgrave-enemi-1", x: 0.8513, y: 0.9012, type: "DG", label: "Darriwil", icon: GiDeathSkull, color: PIN_COLORS.DG },
    { id: "limgrave-enemi-2", x: 0.6085, y: 0.5358, type: "DG", label: "Homem-Besta", icon: GiDeathSkull, color: PIN_COLORS.DG },

    { id: "limgrave-npc-3", x: 0.5093, y: 0.3573, type: "NPC", label: "Roderika", icon: IoIosPerson, color: PIN_COLORS.NPC },
    { id: "limgrave-item-1", x: 0.9563, y: 0.2091, type: "ITEM", label: "Talisman da Tartaruga", icon: BsTools, color: PIN_COLORS.ITEM },

    { id: "limgrave-path-3", x: 0.9192, y: 0.9699, type: "PATH", label: "2 - Caminho: Penísula das Lágrimas", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-path-1", x: 0.9218, y: 0.7848, type: "PATH", label: "1 - Caminho: Limgrave (Base)", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-path-2", x: 0.844, y: 0.4819, type: "PATH", label: "1 - Caminho: Limgrave (Base)", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-path-4", x: 0.2531, y: 0.1072, type: "PATH", label: "3 - Caminho: Liurnia", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-dg-1", x: 0.6843, y: 0.5538, type: "DG", label: "Mina", icon: GiDeathSkull, color: PIN_COLORS.DG },
    { id: "limgrave-op-1", x: 0.4246, y: 0.1866, type: "OP", label: "Atalho: Liurnia", icon: IoEllipsisHorizontalOutline, color: PIN_COLORS.OP },
  ],
  "limgrave-bottom": [
    { id: "limgrave-bottom-path-1", x: 0.2349, y: 0.4568, type: "PATH", label: "1 - Caminho: Limgrave (Topo)", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-bottom-path-2", x: 0.419, y: 0.8559, type: "PATH", label: "2 - Caminho: Limgrave (Topo)", icon: GiHorizonRoad, color: PIN_COLORS.PATH },
    { id: "limgrave-bottom-op-1", x: 0.7322, y: 0.2865, type: "OP", label: "Terceira Igreja de Marika", icon: IoEllipsisHorizontalOutline, color: PIN_COLORS.OP },
    { id: "limgrave-bottom-npc-1", x: 0.5136, y: 0.6171, type: "NPC", label: "Blaidd", icon: IoIosPerson, color: PIN_COLORS.NPC },
    { id: "limgrave-bottom-enemi-1", x: 0.816, y: 0.7449, type: "DG", label: "Forte Haight", icon: GiDeathSkull, color: PIN_COLORS.DG },
  ],
  "weeping-peninsula": [
    { id: "weeping-peninsula-grace-2", x: 0.685, y: 0.4014, type: "GRACE", label: "Graça de Erdtree", icon: BsStars, color: PIN_COLORS.GRACE },
    { id: "weeping-peninsula-grace-3", x: 0.5472, y: 0.6938, type: "GRACE", label: "Graça de Erdtree", icon: BsStars, color: PIN_COLORS.GRACE },
    
    { id: "weeping-peninsula-npc-1", x: 0.7311, y: 0.191, type: "NPC", label: "Irina", icon: IoIosPerson, color: PIN_COLORS.NPC },
    { id: "weeping-peninsula-npc-2", x: 0.5573, y: 0.7467, type: "NPC", label: "Edgar", icon: IoIosPerson, color: PIN_COLORS.NPC },
    { id: "weeping-peninsula-boss-1", x: 0.4806, y: 0.8967, type: "BOSS", label: "Leonino", icon: GiCrownedSkull, color: PIN_COLORS.BOSS },
    { id: "weeping-peninsula-op-1", x: 0.2504, y: 0.3104, type: "OP", label: "Quarta Igreja de Marika", icon: IoEllipsisHorizontalOutline, color: PIN_COLORS.OP },
    { id: "weeping-peninsula-op-2", x: 0.4662, y: 0.3912, type: "OP", label: "Térvore Pequena", icon: IoEllipsisHorizontalOutline, color: PIN_COLORS.OP },
    { id: "weeping-peninsula-dg-1", x: 0.2927, y: 0.2842, type: "DG", label: "Herói Antigo de Zamor", icon: GiDeathSkull, color: PIN_COLORS.DG },
    { id: "weeping-peninsula-dg-2", x: 0.6518, y: 0.4179, type: "DG", label: "Cavalaria da Noite", icon: GiDeathSkull, color: PIN_COLORS.DG },
    { id: "weeping-peninsula-dg-3", x: 0.5937, y: 0.5366, type: "DG", label: "Passáro da Morte", icon: GiDeathSkull, color: PIN_COLORS.DG },
  ],
  "liurnia": [
    // Pins para Liurnia dos Lagos
  ],
  "caelid-first": [
    // Pins para Caelid (Primeira Parte)
  ],
  "caelid-second": [
    // Pins para Caelid (Segunda Parte)
  ],
  "mt-gelmir": [
    // Pins para Monte Gelmir
  ],
  "leyndell-outskirts": [
    // Pins para Arredores de Leyndell
  ],
  "leyndell": [
    // Pins para Leyndell (Capital)
  ],
  "mt-giants-top": [
    // Pins para Montanha dos Gigantes (Topo)
  ],
  "mt-giants-bottom": [
    // Pins para Montanha dos Gigantes (Base)
  ],
  "leyndell-sewers": [
    // Pins para Esgotos de Leyndell
  ],
  "farum-azula": [
    // Pins para Farum Azula
  ],
  "erdtree": [
    // Pins para Árvore Sacra
  ],
};

export const getPinsForRegion = (regionId: string): PinData[] => {
  return regionPins[regionId] || [];
};
