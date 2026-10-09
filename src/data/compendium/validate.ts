import { getRegion } from "../regions";
import { isTrackableItem, regionSections, type SpoilerGate } from "../regionSections";
import { getCreditSource, isCreditedUrl } from "./credits";
import {
  GAME_DATA_SECTION_ID,
  SUMMARY_SECTION_ID,
  type BossGameData,
  type BossGuide,
  type CompendiumRef,
  type CompendiumSection,
  type LoreArticle,
} from "./types";

export interface CompendiumValidation {
  errors: string[];
  // Entradas com texto ou decisões que o autor ainda precisa revisar
  pendingReview: string[];
}

interface CompendiumContent {
  bosses: readonly BossGuide[];
  lore: readonly LoreArticle[];
  bossGameData: Readonly<Record<string, BossGameData>>;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Seções geradas pelo índice do Gideon a partir do resumo e dos dados importados
const RESERVED_SECTION_IDS = new Set([SUMMARY_SECTION_ID, GAME_DATA_SECTION_ID]);

const OBJECTIVE_IDS = new Set(
  Object.values(regionSections).flatMap((sections) =>
    sections.flatMap((section) => section.content.filter(isTrackableItem).map((item) => item.id)),
  ),
);

const findDuplicates = (values: string[]): string[] =>
  values.filter((value, position) => values.indexOf(value) !== position);

// Mesmas regras para o content:check e para os testes: ids estáveis, relações e gates que apontam para algo real
export const validateCompendium = ({ bosses, lore, bossGameData }: CompendiumContent): CompendiumValidation => {
  const errors: string[] = [];
  const ids: Record<CompendiumRef["kind"], Set<string>> = {
    boss: new Set(bosses.map((boss) => boss.id)),
    lore: new Set(lore.map((article) => article.id)),
  };

  const checkGate = (where: string, gate: SpoilerGate | undefined) => {
    if (gate?.regionId && !getRegion(gate.regionId)) errors.push(`${where}: região inexistente no gate (${gate.regionId})`);
    if (gate?.afterObjectiveId && !OBJECTIVE_IDS.has(gate.afterObjectiveId)) {
      errors.push(`${where}: objetivo inexistente no gate (${gate.afterObjectiveId})`);
    }
  };

  const checkEntry = (kind: CompendiumRef["kind"], id: string, sections: CompendiumSection[], related: CompendiumRef[]) => {
    const where = `${kind} ${id}`;
    if (!SLUG_PATTERN.test(id)) errors.push(`${where}: id fora do formato de slug`);

    findDuplicates(sections.map((section) => section.id)).forEach((sectionId) =>
      errors.push(`${where}: seção repetida (${sectionId})`),
    );
    sections.forEach((section) => {
      if (RESERVED_SECTION_IDS.has(section.id)) errors.push(`${where}: id de seção reservado (${section.id})`);
      if (section.blocks.length === 0) errors.push(`${where}: seção ${section.id} sem texto`);
      checkGate(`${where}/${section.id}`, section.gate);
      if (kind === "lore" && !section.certainty) errors.push(`${where}/${section.id}: seção de lore sem certeza`);
      // Material com licença (ex.: CC BY-SA) só entra com crédito na página "Fontes e créditos"
      section.sources?.forEach((source) => {
        if (source.type === "external" && source.license && !isCreditedUrl(source.url)) {
          errors.push(`${where}/${section.id}: fonte ${source.license} sem crédito em credits.ts (${source.url})`);
        }
      });
    });

    related.forEach((ref) => {
      if (!ids[ref.kind].has(ref.id)) errors.push(`${where}: relação com ${ref.kind} inexistente (${ref.id})`);
      if (ref.kind === kind && ref.id === id) errors.push(`${where}: relação consigo mesmo`);
    });
  };

  findDuplicates(bosses.map((boss) => boss.id)).forEach((id) => errors.push(`boss ${id}: id repetido`));
  findDuplicates(lore.map((article) => article.id)).forEach((id) => errors.push(`lore ${id}: id repetido`));

  bosses.forEach((boss) => {
    checkEntry("boss", boss.id, boss.sections, boss.related);
    if (!getRegion(boss.regionId)) errors.push(`boss ${boss.id}: região inexistente (${boss.regionId})`);
    if (boss.objectiveId && !OBJECTIVE_IDS.has(boss.objectiveId)) {
      errors.push(`boss ${boss.id}: objetivo inexistente (${boss.objectiveId})`);
    }
  });

  lore.forEach((article) => {
    checkEntry("lore", article.id, article.sections, article.related);
    if (article.gate !== "open") checkGate(`lore ${article.id}`, article.gate);
  });

  Object.entries(bossGameData).forEach(([id, data]) => {
    if (!ids.boss.has(id)) errors.push(`gameData ${id}: não existe chefe com esse id`);
    if (data.id !== id) errors.push(`gameData ${id}: id interno diferente da chave (${data.id})`);
    if (!data.provenance.url || !data.provenance.revision) errors.push(`gameData ${id}: sem proveniência`);
    if (!getCreditSource(data.provenance.source)) {
      errors.push(`gameData ${id}: fonte "${data.provenance.source}" sem crédito em credits.ts`);
    }
  });

  const pendingReview = [...bosses.map((boss) => ({ kind: "boss", entry: boss })), ...lore.map((article) => ({ kind: "lore", entry: article }))]
    .flatMap(({ kind, entry }) => (entry.pendingReview ? [`${kind} ${entry.id}: ${entry.pendingReview}`] : []));

  return { errors, pendingReview };
};
