import { Link } from "react-router-dom";
import { CREDITS_PATH } from "../../routes/compendiumRoute";
import { FooterStyled, FooterText } from "./styles";

const REPOSITORY_URL = "https://github.com/AlexandreAT/Guiding-Grace";

export function Footer() {
  return (
    <FooterStyled>
      <FooterText>
        Guiding Grace é um projeto de fã, sem fins lucrativos e sem afiliação com a
        FromSoftware ou a Bandai Namco. Elden Ring, seus mapas e imagens pertencem
        aos respectivos detentores.
      </FooterText>
      <FooterText>
        <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          Código-fonte no GitHub
        </a>
        {" · "}
        <Link to={CREDITS_PATH}>Fontes e créditos</Link>
      </FooterText>
    </FooterStyled>
  );
}
