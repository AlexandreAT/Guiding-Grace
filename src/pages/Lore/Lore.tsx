import { useNavigate } from "react-router-dom";
import CompendiumHub from "../../components/CompendiumHub";
import type { HubGroupData } from "../../components/CompendiumHub";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { getLoreGates } from "../../data/compendium/knowledge";
import { LORE_CATEGORY_LABELS } from "../../data/compendium/labels";
import { LORE_ARTICLES } from "../../data/compendium/lore";
import type { LoreCategory } from "../../data/compendium/types";
import { getLockReason, useKnowledgeProgress } from "../../hooks/useKnowledgeProgress";
import { COMPENDIUM_SELECTION_PATH, buildLorePath } from "../../routes/compendiumRoute";
import { HomePageContainer, PageContent } from "../Home/styles";

const CATEGORY_ORDER: LoreCategory[] = ["concept", "event", "character", "faction", "place"];

// Hub da lore: artigos curtos, agrupados por tipo de assunto
export default function Lore() {
  const navigate = useNavigate();
  const progress = useKnowledgeProgress();

  const groups: HubGroupData[] = CATEGORY_ORDER.flatMap((category) => {
    const articles = LORE_ARTICLES.filter((article) => article.category === category);
    if (articles.length === 0) return [];
    return [
      {
        id: category,
        title: LORE_CATEGORY_LABELS[category],
        entries: articles.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.summary,
          path: buildLorePath(article.id),
          locked: getLockReason(getLoreGates(article), progress) !== undefined,
        })),
      },
    ];
  });

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title="Lore"
          subtitle="Conceitos, eventos e personagens das Terras Intermédias, em textos curtos"
          backLabel="Voltar ao Compêndio"
          onBack={() => navigate(COMPENDIUM_SELECTION_PATH)}
        />
        <PageContent>
          <CompendiumHub groups={groups} />
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
