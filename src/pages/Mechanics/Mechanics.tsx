import { useEffect } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import MechanicGuideContent from "../../components/MechanicGuideContent";
import { getMechanicGuide } from "../../data/mechanics";
import { MECHANIC_SECTION_PARAM } from "../../routes/guideRoute";
import { HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";

export default function Mechanics() {
  const { mechanicId } = useParams<{ mechanicId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mechanic = mechanicId ? getMechanicGuide(mechanicId) : undefined;
  const sectionId = searchParams.get(MECHANIC_SECTION_PARAM);

  // ?section= leva direto a uma seção (usado pelas fontes citadas pelo Gideon); a key refaz o scroll a cada navegação
  useEffect(() => {
    if (!sectionId || !mechanic?.sections.some((section) => section.id === sectionId)) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mechanic, sectionId, location.key]);

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
