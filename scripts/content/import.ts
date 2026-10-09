import { writeFile } from "node:fs/promises";
import { BOSSES } from "../../src/data/compendium/bosses";
import { BOSS_GAME_DATA } from "../../src/data/compendium/gameData/bosses";
import type { BossGameData } from "../../src/data/compendium/types";
import { importBosses } from "./importBosses";
import { eldenpediaImporter } from "./importers/eldenpedia";
import type { BossDataImporter } from "./importers/types";

// npm run content:import -- bosses [--only <id>] [--source eldenpedia]
const OUTPUT_FILE = new URL("../../src/data/compendium/gameData/bosses.ts", import.meta.url);
const IMPORTERS: Record<string, BossDataImporter> = {
  [eldenpediaImporter.source]: eldenpediaImporter,
};

const readOption = (args: string[], name: string): string | undefined => {
  const position = args.indexOf(`--${name}`);
  return position >= 0 ? args[position + 1] : undefined;
};

const serialize = (data: Record<string, BossGameData>): string => `import type { BossGameData } from "../types";

// Gerado por "npm run content:import -- bosses": não editar à mão (o texto editorial fica em ../bosses)
export const BOSS_GAME_DATA: Record<string, BossGameData> = ${JSON.stringify(data, null, 2)};
`;

const main = async () => {
  const [kind, ...args] = process.argv.slice(2);
  if (kind !== "bosses") throw new Error("Uso: npm run content:import -- bosses [--only <id>] [--source eldenpedia]");

  const source = readOption(args, "source") ?? eldenpediaImporter.source;
  const importer = IMPORTERS[source];
  if (!importer) throw new Error(`Fonte desconhecida: ${source}`);

  const only = readOption(args, "only");
  const targets = BOSSES.filter((boss) => !only || boss.id === only);
  if (targets.length === 0) throw new Error(`Chefe não encontrado: ${only}`);

  const result = await importBosses(targets, BOSSES, BOSS_GAME_DATA, importer);
  result.imported.forEach((data) =>
    console.log(`✓ ${data.id} ← ${data.provenance.url} (rev. ${data.provenance.revision})`),
  );

  // Uma falha não deixa o arquivo pela metade: ou grava tudo, ou nada
  if (!result.data) {
    console.error(`Nada foi gravado. Falhas:\n${result.failures.map((failure) => `  ✗ ${failure}`).join("\n")}`);
    process.exitCode = 1;
    return;
  }

  await writeFile(OUTPUT_FILE, serialize(result.data));
  console.log(`Gravado: ${result.imported.length} chefe(s) atualizado(s) em src/data/compendium/gameData/bosses.ts`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
