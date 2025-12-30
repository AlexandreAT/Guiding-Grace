import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const LegendContainerStyled = styled.div`
  background-color: rgba(10, 10, 10, 0.9);
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  padding: ${THEME.spacing.md};
  margin-top: ${THEME.spacing.lg};
`;

export const LegendTitle = styled.h3`
  font-family: ${THEME.fonts.title};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0 0 ${THEME.spacing.md} 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${THEME.spacing.md};
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${THEME.spacing.sm};
  padding: ${THEME.spacing.sm};
  border-left: 3px solid ${(props) => props.color || THEME.colors.gold};
  transition: all ${THEME.transitions.fast};

  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
  }
`;

export const LegendIcon = styled.span<{ color: string }>`
  font-size: 1.5rem;
  color: ${(props) => props.color};
  min-width: 24px;
`;

export const LegendLabel = styled.span`
  font-family: ${THEME.fonts.body};
  font-size: 0.875rem;
  color: ${THEME.colors.foreground};
`;