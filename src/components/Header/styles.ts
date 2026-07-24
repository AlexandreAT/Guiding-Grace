import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const HeaderStyled = styled.header`
  height: 108px;
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid rgba(212, 169, 31, 0.8);
  background:
    radial-gradient(circle at 16% 0%, rgba(117, 94, 37, 0.08), transparent 28%),
    rgba(5, 6, 5, 0.97);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28);

  @media (max-width: 768px) {
    height: 82px;
  }
`;

export const HeaderContent = styled.div`
  width: min(100%, 1400px);
  height: 100%;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Logo = styled.button`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: opacity ${THEME.transitions.fast};

  &:hover {
    opacity: 0.86;
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 6px;
    border-radius: 4px;
  }
`;

export const LogoIcon = styled.span`
  flex: 0 0 auto;
  font-size: 2.55rem;
  color: ${THEME.colors.gold};
  filter: drop-shadow(0 2px 8px rgba(212, 169, 31, 0.2));

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const LogoText = styled.span`
  display: block;
  font-family: ${THEME.fonts.rpg};
  font-size: clamp(1.35rem, 2.4vw, 2.3rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.015em;
  color: ${THEME.colors.foreground};
`;

export const Subtitle = styled.span`
  display: block;
  margin-top: 9px;
  font-family: ${THEME.fonts.rpg};
  font-size: 0.83rem;
  color: ${THEME.colors.gold};
  letter-spacing: 0.19em;
  text-transform: uppercase;

  @media (max-width: 560px) {
    font-size: 0.66rem;
    letter-spacing: 0.11em;
  }
`;

export const MenuButton = styled.button`
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid rgba(212, 169, 31, 0.5);
  border-radius: 8px;
  background: rgba(14, 14, 12, 0.8);
  cursor: pointer;
  transition:
    transform ${THEME.transitions.fast},
    border-color ${THEME.transitions.fast},
    background-color ${THEME.transitions.fast};

  &:hover {
    transform: translateY(-1px);
    border-color: ${THEME.colors.goldLight};
    background: rgba(212, 169, 31, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 4px;
  }

  @media (max-width: 768px) {
    width: 46px;
    height: 46px;
  }
`;

export const MenuLine = styled.span`
  width: 20px;
  height: 2px;
  border-radius: 999px;
  background: ${THEME.colors.goldLight};
`;

export const HeaderNavigation = styled.nav<{ $open: boolean }>`
  position: absolute;
  top: calc(100% - 12px);
  right: 32px;
  width: 220px;
  padding: 10px;
  display: ${({ $open }) => ($open ? "grid" : "none")};
  gap: 2px;
  border: 1px solid rgba(212, 169, 31, 0.5);
  border-radius: 8px;
  background: rgba(8, 9, 8, 0.98);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);

  a {
    padding: 13px 14px;
    border-radius: 5px;
    color: ${THEME.colors.foreground};
    font-family: ${THEME.fonts.rpg};
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition:
      color ${THEME.transitions.fast},
      background-color ${THEME.transitions.fast};
  }

  a:hover {
    color: ${THEME.colors.goldLight};
    background: rgba(212, 169, 31, 0.08);
  }

  a:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: -2px;
  }

  @media (max-width: 768px) {
    top: calc(100% - 8px);
    right: 20px;
  }
`;
