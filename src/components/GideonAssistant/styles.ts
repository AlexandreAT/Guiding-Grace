import styled, { keyframes } from "styled-components";
import { THEME } from "../../../shared/const";

/*
 * Camadas: header (100) > Gideon (95–96) > sidebar mobile (91–94) > "voltar ao topo" (50).
 * Modais de imagem (999+) continuam acima do Gideon.
 */
const LAUNCHER_LAYER = 95;
const PANEL_LAYER = 96;
const HEADER_HEIGHT = "108px";
const MOBILE_HEADER_HEIGHT = "82px";
// No celular o botão fica acima do "voltar ao topo" (48px + margem), sem dividir o mesmo ponto
const MOBILE_LAUNCHER_BOTTOM = "calc(68px + env(safe-area-inset-bottom))";

const panelEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Launcher = styled.button<{ $hidden: boolean }>`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: ${LAUNCHER_LAYER};
  width: 60px;
  height: 60px;
  display: ${({ $hidden }) => ($hidden ? "none" : "grid")};
  place-items: center;
  border: 1px solid rgba(212, 169, 31, 0.72);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 30%, rgba(181, 132, 25, 0.28), transparent 65%),
    ${THEME.colors.background};
  color: ${THEME.colors.goldLight};
  cursor: pointer;
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.55),
    0 0 14px rgba(212, 169, 31, 0.16);
  transition:
    border-color ${THEME.transitions.fast},
    box-shadow ${THEME.transitions.fast},
    transform ${THEME.transitions.fast};

  svg {
    width: 30px;
    height: 30px;
  }

  &:hover {
    border-color: ${THEME.colors.goldLight};
    box-shadow:
      0 12px 30px rgba(0, 0, 0, 0.6),
      0 0 20px rgba(212, 169, 31, 0.28);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    right: 16px;
    bottom: ${MOBILE_LAUNCHER_BOTTOM};
    width: 54px;
    height: 54px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Panel = styled.section`
  position: fixed;
  right: 24px;
  bottom: 96px;
  z-index: ${PANEL_LAYER};
  width: min(400px, calc(100vw - 48px));
  height: min(620px, calc(100vh - ${HEADER_HEIGHT} - 112px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(212, 169, 31, 0.55);
  border-radius: 12px;
  background:
    radial-gradient(circle at 20% 0%, rgba(181, 132, 25, 0.12), transparent 40%),
    linear-gradient(180deg, rgba(16, 15, 11, 0.99), rgba(7, 8, 7, 0.99));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 220, 120, 0.05);
  animation: ${panelEnter} 180ms ease-out;

  @media (max-width: 768px) {
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: min(82vh, calc(100vh - ${MOBILE_HEADER_HEIGHT}));
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 12px 12px 0 0;
    padding-bottom: env(safe-area-inset-bottom);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const PanelHeader = styled.header`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${THEME.spacing.sm};
  padding: 14px 16px;
  border-bottom: 1px solid rgba(212, 169, 31, 0.24);
`;

export const HeaderIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  svg {
    flex: 0 0 auto;
    width: 26px;
    height: 26px;
    color: ${THEME.colors.goldLight};
  }
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-family: ${THEME.fonts.rpg};
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${THEME.colors.goldLight};
`;

export const HeaderSubtitle = styled.p`
  margin: 2px 0 0;
  font-family: ${THEME.fonts.body};
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${THEME.colors.textSecondary};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CloseButton = styled.button`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-radius: 6px;
  background: transparent;
  color: ${THEME.colors.goldLight};
  cursor: pointer;
  transition: border-color ${THEME.transitions.fast};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: rgba(227, 194, 96, 0.9);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }
`;

export const MessageList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 169, 31, 0.35) transparent;
`;

export const IntroBubble = styled.p`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-left: 2px solid ${THEME.colors.gold};
  border-radius: 2px 8px 8px 2px;
  background: rgba(23, 20, 12, 0.92);
  font-family: ${THEME.fonts.body};
  font-size: 0.92rem;
  line-height: 1.55;
  color: ${THEME.colors.foreground};

  span {
    font-size: 0.82rem;
    color: ${THEME.colors.textSecondary};
  }
`;

export const PrivacyNote = styled.p`
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-left: 2px solid ${THEME.colors.goldLight};
  border-radius: 6px;
  background: rgba(212, 169, 31, 0.08);
  font-family: ${THEME.fonts.body};
  font-size: 0.76rem;
  line-height: 1.45;
  color: ${THEME.colors.textSecondary};

  svg {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    margin-top: 1px;
    color: ${THEME.colors.goldLight};
  }

  strong {
    font-weight: 600;
    color: ${THEME.colors.foreground};
  }
`;

export const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const MessageItems = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ThinkingText = styled.p`
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 0.82rem;
  font-style: italic;
  color: ${THEME.colors.textSecondary};
`;

// Turnstile invisível: só ocupa espaço quando a Cloudflare pede uma verificação manual
export const TurnstileSlot = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
`;

export const Composer = styled.form`
  flex: 0 0 auto;
  display: flex;
  gap: 8px;
  padding: 12px 16px 14px;
  border-top: 1px solid rgba(212, 169, 31, 0.24);
`;

export const ComposerInput = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-radius: 6px;
  background: rgba(7, 8, 7, 0.9);
  color: ${THEME.colors.foreground};
  font-family: ${THEME.fonts.body};
  font-size: 0.92rem;

  &::placeholder {
    color: ${THEME.colors.textDisabled};
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(227, 194, 96, 0.9);
  }
`;

export const SendButton = styled.button`
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid ${THEME.colors.goldDark};
  border-radius: 6px;
  background: ${THEME.colors.gold};
  color: ${THEME.colors.background};
  cursor: pointer;
  transition:
    background-color ${THEME.transitions.fast},
    opacity ${THEME.transitions.fast};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover:not(:disabled) {
    background: ${THEME.colors.goldLight};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
