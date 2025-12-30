import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const ContentContainerStyled = styled.div`
  flex: 1;
  padding: ${THEME.spacing.lg};
  overflow-y: auto;
  height: calc(100vh - 100px);

  @media (max-width: 768px) {
    height: auto;
    padding: ${THEME.spacing.md};
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${THEME.colors.brownDark};
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.gold};
    border-radius: 4px;

    &:hover {
      background: ${THEME.colors.goldLight};
    }
  }
`;

export const RegionTitle = styled.h1`
  font-family: ${THEME.fonts.rpg};
  font-size: 2.5rem;
  font-weight: 700;
  color: ${THEME.colors.gold};
  margin: 0 0 ${THEME.spacing.sm} 0;
  letter-spacing: 2px;
`;

export const RegionDescription = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 1rem;
  color: ${THEME.colors.foreground};
  line-height: 1.6;
  margin: 0 0 ${THEME.spacing.lg} 0;
`;

export const SectionCard = styled.div`
  background-color: rgba(10, 10, 10, 0.6);
  border: 2px solid ${THEME.colors.brown};
  border-radius: 4px;
  margin-bottom: ${THEME.spacing.lg};
  overflow: hidden;
  transition: all ${THEME.transitions.normal};

  &:hover {
    border-color: ${THEME.colors.gold};
    box-shadow: ${THEME.shadows.gold};
  }
`;

export const SectionHeader = styled.button`
  width: 100%;
  padding: ${THEME.spacing.md};
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${THEME.colors.brown};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ${THEME.transitions.fast};

  &:hover {
    background-color: rgba(212, 175, 55, 0.05);
    border-bottom-color: ${THEME.colors.gold};
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 1.5rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0;
  text-align: left;
`;

export const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  font-size: 1.25rem;
  color: ${THEME.colors.gold};
  transition: transform ${THEME.transitions.fast};
  transform: ${(props) => (props.isExpanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const SectionContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${(props) => (props.isExpanded ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height ${THEME.transitions.normal};
  padding: ${(props) => (props.isExpanded ? THEME.spacing.md : "0")};
  border-top: ${(props) => (props.isExpanded ? `1px solid ${THEME.colors.brown}` : "none")};
`;

export const SectionText = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 0.95rem;
  color: ${THEME.colors.foreground};
  line-height: 1.6;
  margin: 0;
`;