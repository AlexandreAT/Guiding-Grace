import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import MechanicGuideContent from "../../components/MechanicGuideContent";
import { getMechanicGuide } from "../../data/mechanics";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";

export default function Mechanics() {
  const { mechanicId } = useParams<{ mechanicId: string }>();
  const navigate = useNavigate();
  const mechanic = mechanicId ? getMechanicGuide(mechanicId) : undefined;

  useScrollToSection(mechanic?.sections.map((section) => section.id) ?? []);

  if (!mechanic) {
    return (
      <NotFound
        title="Guia de mecânica não encontrado"
        description="Esse guia de mecânica não existe ou ainda não foi publicado."
        actionLabel="Ver guias de mecânicas"
        actionRoute="/select/mechanics-guide"
      />
    );
  }

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title={mechanic.title}
          subtitle={mechanic.subtitle}
          backLabel="Voltar aos Guias de Mecânicas"
          onBack={() => navigate("/select/mechanics-guide")}
        />
        <PageContent>
          <MechanicGuideContent guide={mechanic} />
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
