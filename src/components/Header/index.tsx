import { useSelector } from 'react-redux';
import Container from "../Container";
import { HeaderContent, HeaderStyled, Logo, LogoIcon, LogoText, Subtitle, ThemeSwitch } from "./styles";
import { selectThemeType } from '../../redux/themes/selectors';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header = ({ onLogoClick }: HeaderProps) => {
  const currentTheme = useSelector(selectThemeType);

  return (
    <HeaderStyled>
      <Container>
        <HeaderContent>
          <Logo onClick={onLogoClick}>
            <LogoIcon className="ra ra-crown" />
            <div>
              <LogoText>Guiding Grace</LogoText>
              <Subtitle>Elden Ring - Guia</Subtitle>
            </div>
          </Logo>
          <ThemeSwitch
            type="checkbox"
            checked={currentTheme === 'light'}
            disabled
            title="Tema light ainda não disponível"
          />
        </HeaderContent>
      </Container>
    </HeaderStyled>
  );
}
