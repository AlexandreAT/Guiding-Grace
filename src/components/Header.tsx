import styled from "styled-components";
import { THEME } from "@shared/const";
import Container from "./Container";

/**
 * Header Component
 * Componente de cabeçalho com branding e navegação.
 * Tema: Gótico Minimalista - fundo preto, bordas douradas, tipografia elegante.
 */

const HeaderStyled = styled.header`
  background-color: ${THEME.colors.background};
  border-bottom: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.lg} 0;
  box-shadow: ${THEME.shadows.gold};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${THEME.spacing.sm};
  cursor: pointer;
  transition: opacity ${THEME.transitions.normal};

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;
  color: ${THEME.colors.gold};
  font-family: "RPG Awesome";
`;

const LogoText = styled.h1`
  font-family: ${THEME.fonts.title};
  font-size: 2rem;
  font-weight: 700;
  color: ${THEME.colors.foreground};
  margin: 0;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 0.875rem;
  color: ${THEME.colors.gold};
  margin: 0;
  margin-top: 0.25rem;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <HeaderStyled>
      <Container>
        <HeaderContent>
          <Logo onClick={onLogoClick}>
            <LogoIcon className="ra ra-crown" />
            <div>
              <LogoText>Guiding Grace</LogoText>
              <Subtitle>Elden Ring Guide</Subtitle>
            </div>
          </Logo>
        </HeaderContent>
      </Container>
    </HeaderStyled>
  );
}
