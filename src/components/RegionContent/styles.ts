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

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
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

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const ExpandIcon = styled.span<{ $isExpanded: boolean }>`
  font-size: 1.25rem;
  color: ${THEME.colors.gold};
  transition: transform ${THEME.transitions.fast};
  transform: ${(props) => (props.$isExpanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const SectionContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${(props) => (props.$isExpanded ? "none" : "0")};
  overflow: hidden;
  transition: max-height ${THEME.transitions.normal};
  padding: ${(props) => (props.$isExpanded ? THEME.spacing.md : "0")};
  border-top: ${(props) => (props.$isExpanded ? `1px solid ${THEME.colors.brown}` : "none")};
`;

export const SectionText = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 0.95rem;
  color: ${THEME.colors.foreground};
  line-height: 1.6;
  margin: 0;
  
  a {
    color: ${THEME.colors.goldLight};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color ${THEME.transitions.fast};
  }

  a:hover {
    color: ${THEME.colors.gold};
  }
`;

export const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.sm};
`;

export const ContentItemStyled = styled.div<{ $contentStyle: string }>`
  --item-color: ${(props) => {
    switch (props.$contentStyle) {
      case 'title':
      case 'topic':
        return THEME.colors.gold;
      case 'highlight':
        return THEME.colors.goldLight;
      default:
        return THEME.colors.foreground;
    }
  }};
  font-family: ${(props) => {
    switch (props.$contentStyle) {
      case 'title':
        return THEME.fonts.rpgOld;
      case 'topic':
        return THEME.fonts.rpg;
      default:
        return THEME.fonts.body;
    }
  }};
  font-size: ${(props) => {
    switch (props.$contentStyle) {
      case 'title':
        return '1.3rem';
      case 'topic':
        return '1.1rem';
      case 'highlight':
        return '0.95rem';
      default:
        return '0.95rem';
    }
  }};
  color: var(--item-color);
  font-weight: ${(props) => {
    switch (props.$contentStyle) {
      case 'title':
      case 'topic':
        return '600';
      case 'highlight':
        return '500';
      default:
        return '400';
    }
  }};
  line-height: 1.6;
  margin: 0;
  transition: color ${THEME.transitions.fast};
  position: relative;
  
  &[data-highlighted="true"] {
    --item-color: ${THEME.colors.royalRed};
  }

  &:focus {
    outline: 1px solid rgba(212, 169, 31, 0.55);
    outline-offset: 4px;
    border-radius: 2px;
  }

  a {
    color: ${THEME.colors.goldLight};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color ${THEME.transitions.fast};

    &:hover {
      color: ${THEME.colors.gold};
    }
  }
`;

export const ImageLink = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0;
  color: ${THEME.colors.goldLight};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  transition: color ${THEME.transitions.fast};
  display: inline-block;

  &:hover {
    color: ${THEME.colors.gold};
  }
`;

export const ImagePreview = styled.img`
  position: fixed;
  max-width: 300px;
  max-height: 300px;
  padding: ${THEME.spacing.sm};
  background-color: rgba(10, 10, 10, 0.95);
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.3);
  object-fit: cover;
  z-index: 999;
  animation: slideUp 0.3s ease-out;
  pointer-events: none;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    max-width: 200px;
    max-height: 200px;
  }
`;

export const ProgressSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.xs};
  margin: 0 0 ${THEME.spacing.lg};
  padding: ${THEME.spacing.sm};
  border: 1px solid rgba(212, 169, 31, 0.55);
  border-radius: 4px;
  background-color: rgba(10, 10, 10, 0.6);
`;

export const ProgressHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px ${THEME.spacing.sm};
`;

export const ProgressLabel = styled.span`
  font-family: ${THEME.fonts.rpg};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${THEME.colors.gold};
`;

export const ProgressCount = styled.span`
  flex: 1;
  font-family: ${THEME.fonts.body};
  font-size: 0.9rem;
  color: ${THEME.colors.textSecondary};
`;

export const TrackableTopic = styled.div<{ $completed: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${THEME.spacing.xs};

  label > span {
    opacity: ${({ $completed }) => ($completed ? 0.6 : 1)};
    text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
    text-decoration-color: rgba(212, 169, 31, 0.7);
    text-decoration-thickness: 1px;
  }
`;

export const TopicCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input {
    appearance: none;
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    margin: 0;
    display: grid;
    place-content: center;
    border: 1px solid rgba(212, 169, 31, 0.72);
    border-radius: 4px;
    background: rgba(7, 8, 7, 0.9);
    cursor: pointer;
    transition:
      background-color ${THEME.transitions.fast},
      border-color ${THEME.transitions.fast};

    &::before {
      content: "";
      width: 11px;
      height: 11px;
      background: ${THEME.colors.background};
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transition: transform ${THEME.transitions.fast};
    }

    &:checked {
      border-color: ${THEME.colors.gold};
      background: ${THEME.colors.gold};
    }

    &:checked::before {
      transform: scale(1);
    }

    &:hover {
      border-color: ${THEME.colors.goldLight};
    }

    &:focus-visible {
      outline: 2px solid ${THEME.colors.goldLight};
      outline-offset: 2px;
    }
  }
`;
