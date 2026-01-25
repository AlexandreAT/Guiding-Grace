import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import {
  HomePageContainer,
  HomeHeaderSection,
  HomeTitle,
  HomeSubtitle,
  HomeContent,
  CardsContainer,
  CardButton,
  CardContent,
  CardTitle,
  CardDescription,
  DisabledCardButton,
  DisabledCardContent,
  CardIconContainer,
  DisabledCardLabel,
} from "./styles";

interface MainCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
}

export default function Home() {
  const navigate = useNavigate();

  const mainCategories: MainCategory[] = [
    {
      id: "basic-guide",
      title: "Guia Básico",
      description: "Escolha uma build e comece sua jornada",
      icon: "⚔️",
    },
    {
      id: "mechanics-guide",
      title: "Guia de Mecânicas",
      description: "Entenda os sistemas do jogo",
      icon: "⚙️",
    },
    {
      id: "platinum-guide",
      title: "Guia Platina",
      description: "Roteiro completo para a platina/1000G",
      icon: "👑",
      disabled: true,
    },
  ];

  const handleCardClick = (categoryId: string, disabled?: boolean) => {
    if (!disabled) {
      navigate(`/select/${categoryId}`);
    }
  };

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />

      <HomeHeaderSection>
        <HomeTitle>Guiding Grace</HomeTitle>
        <HomeSubtitle>
          Guia completo para a jornada em Elden Ring
        </HomeSubtitle>
      </HomeHeaderSection>

      <HomeContent>
        <CardsContainer>
          {mainCategories.map((category) =>
            category.disabled ? (
              <DisabledCardButton key={category.id} type="button" disabled>
                <DisabledCardContent>
                  <CardIconContainer>{category.icon}</CardIconContainer>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                  <DisabledCardLabel>Em Breve</DisabledCardLabel>
                </DisabledCardContent>
              </DisabledCardButton>
            ) : (
              <CardButton
                key={category.id}
                onClick={() => handleCardClick(category.id, category.disabled)}
                type="button"
              >
                <CardContent>
                  <CardIconContainer>{category.icon}</CardIconContainer>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
              </CardButton>
            )
          )}
        </CardsContainer>
      </HomeContent>
    </HomePageContainer>
  );
}
