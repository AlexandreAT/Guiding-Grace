import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { NavigationCard } from "../../components/NavigationCard";
import { SELECTIONS } from "../../data/navigation";
import { CardsGrid, HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";

export default function Select() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryId ? SELECTIONS[categoryId] : undefined;

  if (!category) {
    return (
      <NotFound
        title="Categoria não encontrada"
        description="Essa categoria de guia não existe."
        actionLabel="Voltar ao menu principal"
      />
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
      <Footer />
    </HomePageContainer>
  );
}
