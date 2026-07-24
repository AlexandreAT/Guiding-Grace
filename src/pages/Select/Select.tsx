import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { NavigationCard } from "../../components/NavigationCard";
import { SELECTIONS } from "../../data/navigation";
import {
  CardsGrid,
  EmptyState,
  HomePageContainer,
  PageContent,
} from "../Home/styles";

export default function Select() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryId ? SELECTIONS[categoryId] : undefined;

  if (!category) {
    return (
      <HomePageContainer>
        <Header onLogoClick={() => navigate("/")} />
        <main>
          <PageContent>
            <EmptyState>
              <h1>Categoria não encontrada</h1>
              <button type="button" onClick={() => navigate("/")}>
                Voltar ao menu principal
              </button>
            </EmptyState>
          </PageContent>
        </main>
      </HomePageContainer>
    );
  }

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title={category.title}
          subtitle={category.subtitle}
          backLabel="Voltar ao Menu Principal"
          onBack={() => navigate("/")}
        />
        <PageContent>
          <CardsGrid $selection>
            {category.items.map((item) => (
              <NavigationCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                disabled={item.disabled}
                status={item.status}
                onClick={() => navigate(item.route ?? "/")}
              />
            ))}
          </CardsGrid>
        </PageContent>
      </main>
    </HomePageContainer>
  );
}
