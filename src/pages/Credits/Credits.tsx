import { useNavigate } from "react-router-dom";
import { CONTENT_ICONS } from "../../components/ContentBlocks/contentIcons";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { GuideParagraph, MechanicSection, MechanicsGuidePage } from "../../components/MechanicsGuide";
import { BOSSES } from "../../data/compendium/bosses";
import { CREDIT_SOURCES, GAME_RIGHTS_NOTICE } from "../../data/compendium/credits";
import { BOSS_GAME_DATA } from "../../data/compendium/gameData/bosses";
import { COMPENDIUM_SELECTION_PATH } from "../../routes/compendiumRoute";
import { HomePageContainer, PageContent } from "../Home/styles";

// Página "Fontes e créditos": montada dos mesmos dados que o Compêndio usa, então nunca fica desatualizada.
// Não lista nomes de chefes: seria spoiler de quem ainda não chegou lá (o link de cada fonte fica na página dele)
export default function Credits() {
  const navigate = useNavigate();

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title="Fontes e créditos"
          subtitle="De onde vêm os dados do Guiding Grace"
          backLabel="Voltar ao Compêndio"
          onBack={() => navigate(COMPENDIUM_SELECTION_PATH)}
        />
        <PageContent>
          <MechanicsGuidePage>
            <MechanicSection number={1} title="Conteúdo do guia" icon={CONTENT_ICONS.feather}>
              <GuideParagraph>
                Os textos do guia, das estratégias e da lore são escritos pelo autor do Guiding Grace. Nenhum texto de
                wiki é copiado ou traduzido; quando uma afirmação de lore é uma suposição ou uma interpretação, ela vem
                marcada como tal.
              </GuideParagraph>
            </MechanicSection>

            {CREDIT_SOURCES.map((source, index) => {
              const bossesFromSource = BOSSES.filter(
                (boss) => BOSS_GAME_DATA[boss.id]?.provenance.source === source.id,
              );
              return (
                <MechanicSection key={source.id} number={index + 2} title={source.name} icon={CONTENT_ICONS.book}>
                  <GuideParagraph>{source.usage}</GuideParagraph>
                  <GuideParagraph>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.url}
                    </a>{" "}
                    · licença{" "}
                    <a href={source.licenseUrl} target="_blank" rel="noreferrer">
                      {source.license}
                    </a>
                  </GuideParagraph>
                  {bossesFromSource.length > 0 ? (
                    <GuideParagraph>
                      Páginas consultadas: {bossesFromSource.length}. A página e a revisão usadas aparecem nos dados de
                      combate de cada chefe.
                    </GuideParagraph>
                  ) : null}
                </MechanicSection>
              );
            })}

            <MechanicSection number={CREDIT_SOURCES.length + 2} title="Elden Ring" icon={CONTENT_ICONS.crown}>
              <GuideParagraph>{GAME_RIGHTS_NOTICE}</GuideParagraph>
              <GuideParagraph>
                Nomes oficiais em português vêm dos textos do próprio jogo. Citações de descrições ou diálogos, quando
                aparecem, são curtas e acompanhadas da fonte.
              </GuideParagraph>
            </MechanicSection>
          </MechanicsGuidePage>
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
