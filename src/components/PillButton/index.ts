import styled from "styled-components";
import { THEME } from "../../../shared/const";

// Botão secundário arredondado usado em ações pequenas (filtros, limpar, localizar)
export const PillButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(212, 169, 31, 0.72)" : "rgba(212, 169, 31, 0.32)"};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(212, 169, 31, 0.16)" : "transparent"};
  color: ${({ $active }) =>
    $active ? THEME.colors.goldLight : THEME.colors.textSecondary};
  font-family: ${THEME.fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    border-color ${THEME.transitions.fast},
    color ${THEME.transitions.fast},
    background-color ${THEME.transitions.fast};

  svg {
    font-size: 0.95rem;
    color: ${THEME.colors.gold};
  }

  &:hover {
    border-color: rgba(227, 194, 96, 0.9);
    color: ${THEME.colors.goldLight};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }
`;
