import { access, writeFile } from "node:fs/promises";

// npm run content:new -- boss <id>   |   npm run content:new -- lore <id>
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const toConstName = (id: string) => id.toUpperCase().replace(/-/g, "_");

const bossTemplate = (id: string) => `import { paragraph } from "../../contentBlocks";
import type { BossGuide } from "../types";

export const ${toConstName(id)}: BossGuide = {
  id: "${id}",
  name: "",
  englishName: "",
  aliases: [],
  regionId: "",
  importance: "main",
  summary: "",
  pendingReview: "Entrada nova: preencher e revisar.",
  sections: [
    {
      id: "strategy",
      title: "Estratégia",
      icon: "sword",
      blocks: [paragraph("")],
    },
  ],
  related: [],
};
`;

const loreTemplate = (id: string) => `import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const ${toConstName(id)}: LoreArticle = {
  id: "${id}",
  title: "",
  category: "concept",
  aliases: [],
  summary: "",
  // "open" ou um gate (ex.: { regionId: "liurnia" }): decisão obrigatória para não vazar spoiler
  gate: "open",
  pendingReview: "Entrada nova: preencher e revisar.",
  sections: [
    {
      id: "overview",
      title: "",
      icon: "book",
      certainty: "explicit",
      blocks: [paragraph("")],
    },
  ],
  related: [],
};
`;

const TEMPLATES = {
  boss: { folder: "bosses", registry: "BOSSES", render: bossTemplate },
  lore: { folder: "lore", registry: "LORE_ARTICLES", render: loreTemplate },
} as const;

const main = async () => {
  const [kind, id] = process.argv.slice(2);
  if (kind !== "boss" && kind !== "lore") throw new Error("Uso: npm run content:new -- <boss|lore> <id-em-slug>");
  if (!id || !SLUG_PATTERN.test(id)) throw new Error("O id precisa ser um slug: letras minúsculas, números e hífens");

  const template = TEMPLATES[kind];
  const file = new URL(`../../src/data/compendium/${template.folder}/${id}.ts`, import.meta.url);
  const exists = await access(file).then(
    () => true,
    () => false,
  );
  if (exists) throw new Error(`Já existe: src/data/compendium/${template.folder}/${id}.ts`);

  await writeFile(file, template.render(id));
  console.log(`Criado: src/data/compendium/${template.folder}/${id}.ts`);
  console.log(`Falta registrar ${toConstName(id)} em ${template.registry} (src/data/compendium/${template.folder}/index.ts).`);
  if (kind === "boss") console.log(`Depois: npm run content:import -- bosses --only ${id}`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
