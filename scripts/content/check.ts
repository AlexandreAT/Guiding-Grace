import { BOSSES } from "../../src/data/compendium/bosses";
import { BOSS_GAME_DATA } from "../../src/data/compendium/gameData/bosses";
import { LORE_ARTICLES } from "../../src/data/compendium/lore";
import { validateCompendium } from "../../src/data/compendium/validate";

// npm run content:check: as mesmas validações do teste do Compêndio, com a lista do que falta revisar
const { errors, pendingReview } = validateCompendium({
  bosses: BOSSES,
  lore: LORE_ARTICLES,
  bossGameData: BOSS_GAME_DATA,
});

console.log(`Compêndio: ${BOSSES.length} chefe(s), ${LORE_ARTICLES.length} artigo(s) de lore.`);

if (pendingReview.length > 0) {
  console.log(`\nAguardando revisão do autor (${pendingReview.length}):`);
  pendingReview.forEach((entry) => console.log(`  • ${entry}`));
}

if (errors.length > 0) {
  console.error(`\nErros (${errors.length}):`);
  errors.forEach((error) => console.error(`  ✗ ${error}`));
  process.exitCode = 1;
} else {
  console.log("\nNenhum erro encontrado.");
}
