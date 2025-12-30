import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const HeaderStyled = styled.header`
  background-color: ${THEME.colors.background};
  border-bottom: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.lg} 0;
  box-shadow: ${THEME.shadows.gold};
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${THEME.spacing.sm};
  cursor: pointer;
  transition: opacity ${THEME.transitions.normal};

  &:hover {
    opacity: 0.8;
  }
`;

export const LogoIcon = styled.span`
  font-size: 2rem;
  color: ${THEME.colors.gold};
`;

export const LogoText = styled.h1`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 2rem;
  font-weight: 700;
  color: ${THEME.colors.foreground};
  margin: 0;
  letter-spacing: 2px;
`;

export const Subtitle = styled.p`
  font-family: ${THEME.fonts.rpg};
  font-size: 0.875rem;
  color: ${THEME.colors.gold};
  margin: 0;
  margin-top: 0.25rem;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const ThemeSwitch = styled.input`
  width: 50px;
  height: 30px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  accent-color: ${THEME.colors.gold};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: opacity ${THEME.transitions.normal};

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
  }
`;
