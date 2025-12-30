import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${THEME.colors.background};
  color: ${THEME.colors.foreground};
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${THEME.spacing.lg};

  @media (max-width: 768px) {
    padding: ${THEME.spacing.md};
  }
`;

export const MapSection = styled.div`
  margin-bottom: ${THEME.spacing.xl};
`;

export const ButtonPin = styled.button`
  padding: ${THEME.spacing.xs} ${THEME.spacing.xs};
  background-color: ${THEME.colors.shadowDark};
  color: ${THEME.colors.foreground};
  border: 1px solid ${THEME.colors.gold};
  border-radius: 4px;
  font-family: ${THEME.fonts.rpg};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.goldLg};
  }

  transition: all ${THEME.transitions.normal};
`;

export const MapTitle = styled.h2`
  font-family: ${THEME.fonts.title};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0 0 ${THEME.spacing.md} 0;
  letter-spacing: 1px;
`;

export const PlaceholderMap = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, ${THEME.colors.brownDark} 0%, ${THEME.colors.background} 100%);
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${THEME.fonts.body};
  color: ${THEME.colors.gold};
  font-size: 1rem;
  text-align: center;
  padding: ${THEME.spacing.lg};
`;