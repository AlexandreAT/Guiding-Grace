import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const ProgressTrack = styled.div<{ $compact: boolean }>`
  width: 100%;
  height: ${({ $compact }) => ($compact ? "3px" : "6px")};
  overflow: hidden;
  border-radius: 999px;
  background: rgba(212, 169, 31, 0.14);
`;

export const ProgressFill = styled.div<{ $percent: number; $complete: boolean }>`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ $complete }) =>
    $complete
      ? THEME.colors.goldLight
      : `linear-gradient(90deg, ${THEME.colors.goldDark}, ${THEME.colors.gold})`};
  box-shadow: ${({ $complete }) =>
    $complete ? "0 0 8px rgba(227, 194, 96, 0.45)" : "none"};
  transition: width ${THEME.transitions.normal};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
