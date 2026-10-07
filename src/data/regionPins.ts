export type PinType = "DG" | "BOSS" | "OP" | "NPC" | "ITEM" | "GRACE" | "PATH";

// Ícone e cor vêm do type, pela legenda (shared/const.ts)
export type PinData = {
  id: string;
  x: number;
  y: number;
  type: PinType;
  label?: string;
  labelAbove?: boolean;
};

export const regionPins: Record<string, PinData[]> = {
  "limgrave-top": [
    { id: "limgrave-grace-1", x: 0.6389, y: 0.4622, type: "GRACE", label: "Graça de Erdtree" },
    { id: "limgrave-item-2", x: 0.65, y: 0.44, type: "ITEM", label: "Espada do Lorde", labelAbove: true },
    { id: "limgrave-boss-1", x: 0.3152, y: 0.1731, type: "BOSS", label: "Godrick, o Enxertado" },
    
    { id: "limgrave-npc-2", x: 0.592, y: 0.6288, type: "NPC", label: "Mercador Kale" },
    
    { id: "limgrave-npc-1", x: 0.6041, y: 0.7105, type: "NPC", label: "Varre" },
    { id: "limgrave-npc-4", x: 0.6157, y: 0.3029, type: "NPC", label: "Bernahl" },

    { id: "limgrave-enemi-1", x: 0.8513, y: 0.9012, type: "DG", label: "Darriwil" },
    { id: "limgrave-enemi-2", x: 0.6085, y: 0.5358, type: "DG", label: "Homem-Besta" },

    { id: "limgrave-npc-3", x: 0.5093, y: 0.3573, type: "NPC", label: "Roderika" },
    { id: "limgrave-item-1", x: 0.9563, y: 0.2091, type: "ITEM", label: "Talisman da Tartaruga" },

    { id: "limgrave-path-3", x: 0.9192, y: 0.9699, type: "PATH", label: "2 - Caminho: Penísula das Lágrimas" },
    { id: "limgrave-path-1", x: 0.9218, y: 0.7848, type: "PATH", label: "1 - Caminho: Limgrave (Base)" },
    { id: "limgrave-path-2", x: 0.844, y: 0.4819, type: "PATH", label: "1 - Caminho: Limgrave (Base)" },
    { id: "limgrave-path-4", x: 0.2531, y: 0.1072, type: "PATH", label: "3 - Caminho: Liurnia" },
    { id: "limgrave-dg-1", x: 0.6843, y: 0.5538, type: "DG", label: "Mina" },
    { id: "limgrave-op-1", x: 0.4246, y: 0.1866, type: "OP", label: "Atalho: Liurnia" },
  ],
  "limgrave-bottom": [
    { id: "limgrave-bottom-path-1", x: 0.2349, y: 0.4568, type: "PATH", label: "1 - Caminho: Limgrave (Topo)" },
    { id: "limgrave-bottom-path-2", x: 0.419, y: 0.8559, type: "PATH", label: "2 - Caminho: Limgrave (Topo)" },
    { id: "limgrave-bottom-op-1", x: 0.7322, y: 0.2865, type: "OP", label: "Terceira Igreja de Marika" },
    { id: "limgrave-bottom-npc-1", x: 0.5136, y: 0.6171, type: "NPC", label: "Blaidd" },
    { id: "limgrave-bottom-enemi-1", x: 0.816, y: 0.7449, type: "DG", label: "Forte Haight" },
  ],
  "weeping-peninsula": [
    { id: "weeping-peninsula-grace-2", x: 0.685, y: 0.4014, type: "GRACE", label: "Graça de Erdtree" },
    { id: "weeping-peninsula-grace-3", x: 0.5472, y: 0.6938, type: "GRACE", label: "Graça de Erdtree" },
    
    { id: "weeping-peninsula-npc-1", x: 0.7311, y: 0.191, type: "NPC", label: "Irina" },
    { id: "weeping-peninsula-npc-2", x: 0.5573, y: 0.7467, type: "NPC", label: "Edgar" },
    { id: "weeping-peninsula-boss-1", x: 0.4806, y: 0.8967, type: "BOSS", label: "Leonino" },
    { id: "weeping-peninsula-op-1", x: 0.2504, y: 0.3104, type: "OP", label: "Quarta Igreja de Marika" },
    { id: "weeping-peninsula-op-2", x: 0.4662, y: 0.3912, type: "OP", label: "Térvore Pequena" },
    { id: "weeping-peninsula-dg-1", x: 0.2927, y: 0.2842, type: "DG", label: "Herói Antigo de Zamor" },
    { id: "weeping-peninsula-dg-2", x: 0.6518, y: 0.4179, type: "DG", label: "Cavalaria da Noite" },
    { id: "weeping-peninsula-dg-3", x: 0.5937, y: 0.5366, type: "DG", label: "Passáro da Morte" },
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
