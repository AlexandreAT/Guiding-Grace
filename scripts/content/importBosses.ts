import type { BossGameData, BossGuide } from "../../src/data/compendium/types";
import type { BossDataImporter } from "./importers/types";

export interface BossImportResult {
  // Ausente quando algo falhou: nesse caso nada deve ser gravado
  data?: Record<string, BossGameData>;
  imported: BossGameData[];
  failures: string[];
}

// Um dado sem números não serve: melhor falhar do que gravar um chefe vazio
const findProblem = (data: BossGameData, id: string): string | undefined => {
  if (data.id !== id) return `id interno trocado (${data.id})`;
  if (data.hp.length === 0) return "sem HP";
  if (Object.keys(data.negations).length === 0) return "sem absorções de dano";
  return undefined;
};

// Busca e valida tudo antes de devolver o resultado. O id interno nunca vem da fonte; o id externo já registrado
// tem prioridade, para reimportar sempre a mesma página
export const importBosses = async (
  targets: readonly BossGuide[],
  allBosses: readonly BossGuide[],
  existing: Readonly<Record<string, BossGameData>>,
  importer: BossDataImporter,
): Promise<BossImportResult> => {
  const imported: BossGameData[] = [];
  const failures: string[] = [];

  for (const boss of targets) {
    const externalId = existing[boss.id]?.externalIds[importer.source] ?? boss.englishName;
    try {
      const data = await importer.importBoss({ id: boss.id, externalId });
      const problem = findProblem(data, boss.id);
      if (problem) throw new Error(problem);
      imported.push(data);
    } catch (error) {
      failures.push(`${boss.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length > 0) return { imported, failures };

  // Entradas que não foram reimportadas continuam como estavam; a ordem segue o registro de chefes
  const merged: Record<string, BossGameData> = { ...existing };
  imported.forEach((data) => {
    merged[data.id] = data;
  });
  const data = Object.fromEntries(allBosses.flatMap((boss) => (merged[boss.id] ? [[boss.id, merged[boss.id]] as const] : [])));
  return { data, imported, failures };
};
