import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const LegendContainerStyled = styled.div`
  background-color: rgba(10, 10, 10, 0.9);
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  padding: ${THEME.spacing.md};
  margin-top: ${THEME.spacing.lg};
`;

export const LegendHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${THEME.spacing.xs} ${THEME.spacing.sm};
  margin-bottom: ${THEME.spacing.xs};
`;

export const LegendTitle = styled.h3`
  font-family: ${THEME.fonts.title};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export const LegendActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${THEME.spacing.xs};
`;

export const LegendHint = styled.p`
  margin: 0 0 ${THEME.spacing.sm};
  font-family: ${THEME.fonts.body};
  font-size: 0.8rem;
  color: ${THEME.colors.textSecondary};
`;

export const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${THEME.spacing.xs} ${THEME.spacing.md};
`;

export const LegendItem = styled.button<{ $hidden: boolean }>`
  display: flex;
  align-items: center;
  gap: ${THEME.spacing.sm};
  width: 100%;
  min-height: 44px;
  padding: ${THEME.spacing.xs} ${THEME.spacing.sm};
  border: 0;
  border-left: 3px solid ${(props) => props.color || THEME.colors.gold};
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $hidden }) => ($hidden ? 0.42 : 1)};
  transition: all ${THEME.transitions.fast};

  &:hover:not(:disabled) {
    background-color: rgba(212, 175, 55, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;

export const LegendIcon = styled.span<{ color: string }>`
  font-size: 1.5rem;
  color: ${(props) => props.color};
  min-width: 24px;
`;

export const LegendLabel = styled.span<{ $hidden?: boolean }>`
  flex: 1;
  text-decoration: ${({ $hidden }) => ($hidden ? "line-through" : "none")};
  font-family: ${THEME.fonts.body};
  font-size: 0.875rem;
  color: ${THEME.colors.foreground};
`;

export const LegendCount = styled.span`
  min-width: 26px;
  padding: 1px 7px;
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-radius: 999px;
  font-family: ${THEME.fonts.body};
  font-size: 0.75rem;
  color: ${THEME.colors.textSecondary};
  text-align: center;
`;
