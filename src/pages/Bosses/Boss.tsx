import { useNavigate, useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { BossCombatData, CompendiumPanels, RelatedEntries, SpoilerNotice } from "../../components/Compendium";
import type { CompendiumPanel } from "../../components/Compendium";
import { ActionRow, OverviewLabel, OverviewList, OverviewPanel, Tag, TagRow } from "../../components/Compendium/styles";
import ContentBlocks from "../../components/ContentBlocks";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { PillButton } from "../../components/PillButton";
import { getBoss } from "../../data/compendium/bosses";
import { getCompendiumEntry } from "../../data/compendium/entries";
import { BOSS_GAME_DATA } from "../../data/compendium/gameData/bosses";
import { getBossGates, getBossSectionGates } from "../../data/compendium/knowledge";
import { IMPORTANCE_LABELS } from "../../data/compendium/labels";
import { GAME_DATA_SECTION_ID, type BossGuide } from "../../data/compendium/types";
import { getAvailableBuild, getAvailableBuilds } from "../../data/navigation";
import { getRegion } from "../../data/regions";
import { getLockReason, useKnowledgeProgress } from "../../hooks/useKnowledgeProgress";
import { useLastGuideVisit } from "../../hooks/useLastGuideVisit";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useSpoilerReveal } from "../../hooks/useSpoilerReveal";
import { BOSSES_PATH, buildCompendiumPath } from "../../routes/compendiumRoute";
import { buildGuidePath } from "../../routes/guideRoute";
import { HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";

export default function Boss() {
  const { bossId } = useParams<{ bossId: string }>();
  const boss = bossId ? getBoss(bossId) : undefined;

  if (!boss) {
    return (
      <NotFound
        title="Chefe não encontrado"
        description="Esse chefe não existe ou ainda não foi publicado no Compêndio."
        actionLabel="Ver chefes"
        actionRoute={BOSSES_PATH}
      />
    );
  }

  // A key zera o que foi revelado ao trocar de chefe
  return <BossPage key={boss.id} boss={boss} />;
}

function BossPage({ boss }: { boss: BossGuide }) {
  const navigate = useNavigate();
  const progress = useKnowledgeProgress();
  const lastVisit = useLastGuideVisit();
  const { allRevealed, isRevealed, reveal, revealAll } = useSpoilerReveal();
  const gameData = BOSS_GAME_DATA[boss.id];

  const entryLock = getLockReason(getBossGates(boss), progress);
  const showEntry = !entryLock || allRevealed;

  const panels: CompendiumPanel[] = [
    ...(gameData
      ? [
          {
            id: GAME_DATA_SECTION_ID,
            title: "Dados de combate",
            icon: "shield" as const,
            lockReason: entryLock,
            content: <BossCombatData data={gameData} />,
          },
        ]
      : []),
    ...boss.sections.map((section) => ({
      id: section.id,
      title: section.title,
      icon: section.icon,
      certainty: section.certainty,
      lockReason: getLockReason(getBossSectionGates(boss, section), progress),
      content: <ContentBlocks blocks={section.blocks} />,
    })),
  ];
  useScrollToSection(panels.map((panel) => panel.id));

  // Relacionados à frente na jornada não mostram nem o nome
  const related = boss.related.flatMap((ref) => {
    const entry = getCompendiumEntry(ref);
    if (!entry || (getLockReason(entry.gates, progress) && !allRevealed)) return [];
    return [{ key: `${ref.kind}:${ref.id}`, label: entry.title, path: buildCompendiumPath(ref) }];
  });

  // "Ver no mapa" abre o guia da última build usada (ou da primeira disponível)
  const buildId = getAvailableBuild(lastVisit.buildId)?.id ?? getAvailableBuilds()[0]?.id;
  const mapPath =
    boss.objectiveId && buildId ? buildGuidePath(buildId, boss.regionId, boss.objectiveId) : undefined;

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title={boss.name}
          subtitle={showEntry ? boss.summary : "Chefe à frente na sua jornada."}
          backLabel="Voltar aos Chefes"
          onBack={() => navigate(BOSSES_PATH)}
        />
        <PageContent>
          <CompendiumPanels panels={panels} isRevealed={isRevealed} onReveal={reveal}>
            <OverviewPanel aria-label="Visão geral">
              <TagRow>
                <Tag>{IMPORTANCE_LABELS[boss.importance]}</Tag>
                <Tag $tone="muted">{getRegion(boss.regionId)?.name ?? boss.regionId}</Tag>
              </TagRow>

              {showEntry ? (
                <>
                  {boss.rewards?.length ? (
                    <div>
                      <OverviewLabel>Recompensas</OverviewLabel>
                      <OverviewList>
                        {boss.rewards.map((reward) => (
                          <li key={reward}>{reward}</li>
                        ))}
                      </OverviewList>
                    </div>
                  ) : null}
                  {mapPath ? (
                    <ActionRow>
                      <PillButton type="button" onClick={() => navigate(mapPath)}>
                        <IoLocationSharp aria-hidden="true" />
                        <span>Ver no mapa</span>
                      </PillButton>
                    </ActionRow>
                  ) : null}
                </>
              ) : (
                <SpoilerNotice
                  title="Este chefe está além do seu progresso atual"
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
