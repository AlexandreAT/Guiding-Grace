import styled from "styled-components";
import { THEME } from "../../../../../shared/const";

export const WeaponProgressionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.xl};
`;

export const Section = styled.div`
  background-color: rgba(10, 10, 10, 0.6);
  border: 2px solid ${THEME.colors.brown};
  border-radius: 4px;
  padding: ${THEME.spacing.lg};
  transition: all ${THEME.transitions.normal};

  &:hover {
    border-color: ${THEME.colors.gold};
    box-shadow: ${THEME.shadows.gold};
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0 0 ${THEME.spacing.md} 0;
  letter-spacing: 1px;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.md};
`;

export const Paragraph = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 1rem;
  color: ${THEME.colors.foreground};
  line-height: 1.8;
  margin: 0;
`;

export const List = styled.ul`
  font-family: ${THEME.fonts.body};
  font-size: 1rem;
  color: ${THEME.colors.foreground};
  line-height: 1.8;
  padding-left: ${THEME.spacing.lg};
  margin: 0;

  li {
    margin-bottom: ${THEME.spacing.sm};
  }
`;

export const HighlightText = styled.span`
  color: ${THEME.colors.gold};
  font-weight: 600;
`;

export const InfoBox = styled.div`
  background-color: rgba(212, 175, 55, 0.05);
  border-left: 4px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.md};
  border-radius: 2px;
  margin: ${THEME.spacing.md} 0;

  p {
    margin: 0;
    font-family: ${THEME.fonts.body};
    font-size: 0.95rem;
    color: ${THEME.colors.foreground};
    line-height: 1.6;
  }
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${THEME.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-color: rgba(20, 20, 20, 0.8);
  border: 1px solid ${THEME.colors.brown};
  padding: ${THEME.spacing.md};
  border-radius: 4px;
  transition: all ${THEME.transitions.fast};

  &:hover {
    border-color: ${THEME.colors.gold};
    background-color: rgba(30, 30, 30, 0.9);
  }

  h3 {
    font-family: ${THEME.fonts.rpg};
    font-size: 1.2rem;
    color: ${THEME.colors.goldLight};
    margin: 0 0 ${THEME.spacing.sm} 0;
  }

  p {
    font-family: ${THEME.fonts.body};
    font-size: 0.95rem;
    color: ${THEME.colors.foreground};
    margin: 0;
    line-height: 1.6;
  }
`;
