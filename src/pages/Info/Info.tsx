import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Header } from "../../components/Header";
import { getInfoPage } from "./pages";
import { InfoPageContainer, InfoHeader, InfoTitle, InfoDescription, InfoContent, BackButton, ButtonContainer } from "./styles";

export default function Info() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const pageConfig = pageId ? getInfoPage(pageId) : null;

  if (!pageConfig) {
    return (
      <InfoPageContainer>
        <Header onLogoClick={() => navigate("/")} />
        <InfoContent>
          <ButtonContainer>
            <BackButton onClick={() => navigate("/")}>
              <IoArrowBack /> Voltar
            </BackButton>
          </ButtonContainer>
          <h2>Página não encontrada</h2>
          <p>A página de informação que você procura não existe.</p>
        </InfoContent>
      </InfoPageContainer>
    );
  }

  const Component = pageConfig.component;

  return (
    <InfoPageContainer>
      <Header onLogoClick={() => navigate("/")} />
      
      <InfoHeader>
        <ButtonContainer>
          <BackButton onClick={() => navigate("/")}>
            <IoArrowBack /> Voltar
          </BackButton>
        </ButtonContainer>
        <InfoTitle>{pageConfig.title}</InfoTitle>
        <InfoDescription>{pageConfig.description}</InfoDescription>
      </InfoHeader>

      <InfoContent>
        <Component />
      </InfoContent>
    </InfoPageContainer>
  );
}
