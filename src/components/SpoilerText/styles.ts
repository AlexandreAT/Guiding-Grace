import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const SpoilerWrapper = styled.span<{ $isRevealed: boolean }>`
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: all ${THEME.transitions.fast};
  
  color: ${(props) => (props.$isRevealed ? THEME.colors.foreground : "transparent")};
  text-shadow: ${(props) => (props.$isRevealed ? "none" : "0 0 0 #666")};
  user-select: ${(props) => (props.$isRevealed ? "auto" : "none")};
`;

export const SpoilerOverlay = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4a4a4a;
  border-radius: 2px;
  cursor: pointer;
  transition: opacity ${THEME.transitions.fast};
  pointer-events: none;

  &:hover {
    background-color: #555555;
  }
`;
