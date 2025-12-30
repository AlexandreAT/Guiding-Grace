/**
 * regionPins.ts
 * Define pins (marcadores) para cada região do mapa.
 * Coordenadas são relativas (0-1) onde (0,0) é canto superior esquerdo
 */

export type PinData = { id: string; x: number; y: number; type?: string; label?: string };

export const regionPins: Record<string, PinData[]> = {
  "limgrave-top": [
    { id: "limgrave-grace-1", x: 0.469, y: 0.4992, type: "GRACE", label: "Grace" },
    // Adicione mais pins para Limgrave (Topo) conforme necessário
  ],
  "limgrave-bottom": [
    // Pins para Limgrave (Base)
  ],
  "weeping-peninsula": [
    // Pins para Península das Lágrimas
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
