import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeaderContent,
  HeaderNavigation,
  HeaderStyled,
  Logo,
  LogoIcon,
  LogoText,
  MenuButton,
  MenuLine,
  Subtitle,
} from "./styles";

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header = ({ onLogoClick }: HeaderProps) => (
  <HeaderContentWithMenu onLogoClick={onLogoClick} />
);

function HeaderContentWithMenu({ onLogoClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <HeaderStyled>
      <HeaderContent>
        <Logo
          type="button"
          onClick={onLogoClick}
          aria-label="Ir para a página inicial"
        >
          <LogoIcon className="ra ra-crown" aria-hidden="true" />
          <span>
            <LogoText>Guiding Grace</LogoText>
            <Subtitle>Elden Ring - Guia</Subtitle>
          </span>
        </Logo>
        <MenuButton
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="global-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <MenuLine />
          <MenuLine />
          <MenuLine />
        </MenuButton>
        <HeaderNavigation id="global-navigation" $open={isMenuOpen}>
          <Link to="/" onClick={closeMenu}>
            Início
          </Link>
          <Link to="/select/basic-guide" onClick={closeMenu}>
            Guia Básico
          </Link>
          <Link to="/select/mechanics-guide" onClick={closeMenu}>
            Mecânicas
          </Link>
        </HeaderNavigation>
      </HeaderContent>
    </HeaderStyled>
  );
}
