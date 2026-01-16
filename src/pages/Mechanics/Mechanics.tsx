import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Header } from "../../components/Header";
import { HomePageContainer, HomeHeaderSection, HomeTitle, HomeSubtitle, HomeContent, BackButtonContainer, BackButton } from "../Home/styles";
import WeaponProgression from "../Info/pages/WeaponProgression";

export default function Mechanics() {
  const { mechanicId } = useParams<{ mechanicId: string }>();
  const navigate = useNavigate();

  const mechanicsComponents: Record<string, any> = {
    weapons: {
      title: "Sistema de Armas",
      description: "Progressão, tipos e aprimoramentos em Elden Ring",
      component: WeaponProgression,
    },
  };

  const mechanic = mechanicId ? mechanicsComponents[mechanicId] : null;

  if (!mechanic) {
    return (
      <HomePageContainer>
        <Header onLogoClick={() => navigate("/")} />
        <HomeContent>
          <h2>Guia de mecânica não encontrado</h2>
        </HomeContent>
      </HomePageContainer>
    );
  }

  const Component = mechanic.component;

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />

      <HomeHeaderSection>
        <BackButtonContainer>
          <BackButton onClick={() => navigate("/select/mechanics-guide")}>
            <IoArrowBack /> Voltar aos Guias de Mecânicas
          </BackButton>
        </BackButtonContainer>
        <HomeTitle>{mechanic.title}</HomeTitle>
        <HomeSubtitle>{mechanic.description}</HomeSubtitle>
      </HomeHeaderSection>

      <HomeContent style={{ overflow: "auto", paddingTop: "0" }}>
        <div style={{ paddingTop: "var(--spacing-xl, 48px)" }}>
          <Component />
        </div>
      </HomeContent>
    </HomePageContainer>
  );
}
