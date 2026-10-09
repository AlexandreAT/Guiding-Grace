import type { BossGameData } from "../../../src/data/compendium/types";

// O que o domínio sabe de uma fonte: dado um chefe, devolve os dados objetivos já no formato interno.
// Trocar de fonte é escrever outro importador; nada fora daqui conhece o formato externo
export interface BossDataImporter {
  source: string;
  importBoss(request: BossImportRequest): Promise<BossGameData>;
}

export interface BossImportRequest {
  // Id interno do chefe (nosso, estável)
  id: string;
  // Id na fonte: o importador usa o já registrado em gameData ou deriva do nome em inglês
  externalId: string;
}
