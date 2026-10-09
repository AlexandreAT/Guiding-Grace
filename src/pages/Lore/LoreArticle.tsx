import { useNavigate, useParams } from "react-router-dom";
import { CompendiumPanels, RelatedEntries, SpoilerNotice } from "../../components/Compendium";
import type { CompendiumPanel } from "../../components/Compendium";
import { OverviewLabel, OverviewPanel, Tag, TagRow } from "../../components/Compendium/styles";
import ContentBlocks from "../../components/ContentBlocks";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { getCompendiumEntry } from "../../data/compendium/entries";
import { getLoreGates, getLoreSectionGates } from "../../data/compendium/knowledge";
import { LORE_CATEGORY_LABELS } from "../../data/compendium/labels";
import { getLoreArticle } from "../../data/compendium/lore";
import type { LoreArticle as LoreArticleData } from "../../data/compendium/types";
import { getLockReason, useKnowledgeProgress } from "../../hooks/useKnowledgeProgress";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useSpoilerReveal } from "../../hooks/useSpoilerReveal";
import { LORE_PATH, buildCompendiumPath } from "../../routes/compendiumRoute";
import { HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";

export default function LoreArticle() {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articleId ? getLoreArticle(articleId) : undefined;

  if (!article) {
    return (
      <NotFound
        title="Artigo não encontrado"
        description="Esse artigo não existe ou ainda não foi publicado no Compêndio."
        actionLabel="Ver a lore"
        actionRoute={LORE_PATH}
      />
    );
  }

  // A key zera o que foi revelado ao trocar de artigo
  return <LoreArticlePage key={article.id} article={article} />;
}

function LoreArticlePage({ article }: { article: LoreArticleData }) {
  const navigate = useNavigate();
  const progress = useKnowledgeProgress();
  const { allRevealed, isRevealed, reveal, revealAll } = useSpoilerReveal();

  const entryLock = getLockReason(getLoreGates(article), progress);
  const showEntry = !entryLock || allRevealed;

  const panels: CompendiumPanel[] = article.sections.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    certainty: section.certainty,
    lockReason: getLockReason(getLoreSectionGates(article, section), progress),
    content: <ContentBlocks blocks={section.blocks} />,
  }));
  useScrollToSection(panels.map((panel) => panel.id));

  // Relacionados à frente na jornada não mostram nem o nome
  const related = article.related.flatMap((ref) => {
    const entry = getCompendiumEntry(ref);
    if (!entry || (getLockReason(entry.gates, progress) && !allRevealed)) return [];
    return [{ key: `${ref.kind}:${ref.id}`, label: entry.title, path: buildCompendiumPath(ref) }];
  });

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title={article.title}
          subtitle={showEntry ? article.summary : "Assunto à frente na sua jornada."}
          backLabel="Voltar à Lore"
          onBack={() => navigate(LORE_PATH)}
        />
        <PageContent>
          <CompendiumPanels panels={panels} isRevealed={isRevealed} onReveal={reveal}>
            <OverviewPanel aria-label="Sobre este artigo">
              <TagRow>
                <Tag>{LORE_CATEGORY_LABELS[article.category]}</Tag>
              </TagRow>
              {showEntry ? null : (
                <SpoilerNotice
                  title="Este assunto está além do seu progresso atual"
                  reason={entryLock ?? ""}
                  onReveal={revealAll}
                />
              )}
              {related.length > 0 ? (
                <div>
                  <OverviewLabel>Relacionados</OverviewLabel>
                  <RelatedEntries entries={related} />
                </div>
              ) : null}
            </OverviewPanel>
          </CompendiumPanels>
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
