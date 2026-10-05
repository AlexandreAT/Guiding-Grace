import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { EmptyState, HomePageContainer, PageContent } from "../Home/styles";

interface NotFoundProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionRoute?: string;
}

export default function NotFound({
  title = "Página não encontrada",
  description = "O caminho que você seguiu não leva a lugar nenhum. Volte à Graça mais próxima.",
  actionLabel = "Voltar ao início",
  actionRoute = "/",
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <PageContent>
          <EmptyState>
            <h1>{title}</h1>
            <p>{description}</p>
            <button type="button" onClick={() => navigate(actionRoute)}>
              {actionLabel}
            </button>
          </EmptyState>
        </PageContent>
      </main>
      <Footer />
    </HomePageContainer>
  );
}
