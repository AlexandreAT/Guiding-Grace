import { useNavigate } from "react-router-dom";
import CompendiumHub from "../../components/CompendiumHub";
import type { HubGroupData } from "../../components/CompendiumHub";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { BOSSES } from "../../data/compendium/bosses";
import { getBossGates } from "../../data/compendium/knowledge";
import { IMPORTANCE_LABELS } from "../../data/compendium/labels";
import { REGIONS } from "../../data/regions";
import { getLockReason, useKnowledgeProgress } from "../../hooks/useKnowledgeProgress";
import { COMPENDIUM_SELECTION_PATH, buildBossPath } from "../../routes/compendiumRoute";
import { HomePageContainer, PageContent } from "../Home/styles";

// Hub dos chefes, agrupados pela região da jornada em que são enfrentados
export default function Bosses() {
  const navigate = useNavigate();
  const progress = useKnowledgeProgress();

  const groups: HubGroupData[] = REGIONS.flatMap((region) => {
    const bosses = BOSSES.filter((boss) => boss.regionId === region.id);
    if (bosses.length === 0) return [];
    return [
      {
        id: region.id,
        title: region.name,
        entries: bosses.map((boss) => ({
          id: boss.id,
          title: boss.name,
          description: boss.summary,
          tag: IMPORTANCE_LABELS[boss.importance],
          path: buildBossPath(boss.id),
          locked: getLockReason(getBossGates(boss), progress) !== undefined,
        })),
      },
    ];
  });

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title="Chefes"
          subtitle="Estratégia, dados de combate e a história dos chefes da jornada"
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
