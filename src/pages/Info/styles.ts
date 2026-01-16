import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const InfoPageContainer = styled.div`
  min-height: 100vh;
  background-color: ${THEME.colors.background};
  color: ${THEME.colors.foreground};
  display: flex;
  flex-direction: column;
`;

export const InfoHeader = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 0.6) 100%);
  border-bottom: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.xl} ${THEME.spacing.lg};

  @media (max-width: 768px) {
    padding: ${THEME.spacing.lg} ${THEME.spacing.md};
  }
`;

export const InfoTitle = styled.h1`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${THEME.colors.gold};
  margin: 0;
  letter-spacing: 2px;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const InfoDescription = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 1rem;
  color: ${THEME.colors.foreground};
  margin: ${THEME.spacing.md} 0 0 0;
  line-height: 1.6;
`;

export const InfoContent = styled.div`
  flex: 1;
  padding: ${THEME.spacing.xl} ${THEME.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: ${THEME.spacing.lg} ${THEME.spacing.md};
  }
`;

export const BackButton = styled.button`
  background-color: transparent;
  border: 2px solid ${THEME.colors.gold};
  color: ${THEME.colors.gold};
  padding: ${THEME.spacing.sm} ${THEME.spacing.md};
  border-radius: 4px;
  cursor: pointer;
  font-family: ${THEME.fonts.rpg};
  font-size: 0.95rem;
  transition: all ${THEME.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${THEME.spacing.sm};

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.gold};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${THEME.spacing.md};
  margin-bottom: ${THEME.spacing.xl};
`;
