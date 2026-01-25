import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
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
  BackButtonContainer,
  BackButton,
  DisabledCardButton,
  DisabledCardContent,
  CardIconContainer,
  DisabledCardLabel,
} from "../Home/styles";

interface SelectItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  disabled?: boolean;
}

const SELECTIONS = {
  "basic-guide": {
    title: "Escolha sua Build",
    subtitle: "Selecione uma build para começar o guia de progressão",
    items: [
      {
        id: "quality-build",
        title: "Build de Qualidade",
        description: "FOR + DES - Versátil e com boa sustentação de combate",
        icon: "⚔️",
        route: "/guide/quality-build",
      },
      {
        id: "dexterity-build",
        title: "Build de Destreza",
        description: "DEX - Rápida e com alto dano",
        icon: "🗡️",
        route: "/guide/dexterity-build",
        disabled: true,
      },
    ],
  },
  "mechanics-guide": {
    title: "Guias de Mecânicas",
    subtitle: "Aprenda os sistemas do jogo em detalhes separadamente",
    items: [
      {
        id: "weapons",
        title: "Sistema de Armas",
        description: "Progressão, tipos e aprimoramentos",
        icon: "🗡️",
        route: "/mechanics/weapons",
      },
    ],
  },
};

export default function Select() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = categoryId ? SELECTIONS[categoryId as keyof typeof SELECTIONS] : null;

  if (!category) {
    return (
      <HomePageContainer>
        <Header onLogoClick={() => navigate("/")} />
        <HomeContent>
          <h2>Categoria não encontrada</h2>
        </HomeContent>
      </HomePageContainer>
    );
  }

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />

      <HomeHeaderSection>
        <BackButtonContainer>
          <BackButton onClick={() => navigate("/")}>
            <IoArrowBack /> Voltar ao Menu Principal
          </BackButton>
        </BackButtonContainer>
        <HomeTitle>{category.title}</HomeTitle>
        <HomeSubtitle>{category.subtitle}</HomeSubtitle>
      </HomeHeaderSection>

      <HomeContent>
        <CardsContainer>
          {category.items.map((item: SelectItem) =>
            item.disabled ? (
              <DisabledCardButton key={item.id} type="button" disabled>
                <DisabledCardContent>
                  <CardIconContainer>{item.icon}</CardIconContainer>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <DisabledCardLabel>Em Breve</DisabledCardLabel>
                </DisabledCardContent>
              </DisabledCardButton>
            ) : (
              <CardButton
                key={item.id}
                onClick={() => navigate(item.route || "/")}
                type="button"
              >
                <CardContent>
                  <CardIconContainer>{item.icon}</CardIconContainer>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </CardButton>
            )
          )}
        </CardsContainer>
      </HomeContent>
    </HomePageContainer>
  );
}
