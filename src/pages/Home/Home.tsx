import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { NavigationCard } from "../../components/NavigationCard";
import { MAIN_CATEGORIES } from "../../data/navigation";
import { CardsGrid, HomePageContainer, PageContent } from "./styles";

export default function Home() {
  const navigate = useNavigate();

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title="Guiding Grace"
          subtitle="Guia completo para a jornada em Elden Ring"
        />
        <PageContent>
          <CardsGrid>
            {MAIN_CATEGORIES.map((category) => (
              <NavigationCard
                key={category.id}
                title={category.title}
                description={category.description}
                icon={category.icon}
                disabled={category.disabled}
                status={category.status}
                onClick={() => navigate(category.route ?? "/")}
              />
            ))}
          </CardsGrid>
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
