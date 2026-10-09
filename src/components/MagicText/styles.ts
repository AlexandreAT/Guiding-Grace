import styled, { keyframes } from "styled-components";
import { THEME } from "../../../shared/const";

// Duração de cada palavra; o intervalo entre elas fica em index.tsx
export const WORD_DURATION_MS = 900;

// A palavra desce como fumaça dourada, desfocada, e se solidifica na cor do texto. O movimento só vai em direção
// ao lugar final (sem passar do ponto e voltar), para a letra não "pular" quando termina
const condense = keyframes`
  0% {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(-0.5em);
    color: ${THEME.colors.goldLight};
    text-shadow: 0 0 14px rgba(227, 194, 96, 0.9);
  }
  60% {
    opacity: 1;
    filter: blur(1.5px);
    transform: translateY(-0.1em);
    color: ${THEME.colors.goldLight};
    text-shadow: 0 0 10px rgba(227, 194, 96, 0.6);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
    color: ${THEME.colors.foreground};
    text-shadow: 0 0 0 rgba(227, 194, 96, 0);
  }
`;

export const MagicWord = styled.span<{ $delay: number }>`
  display: inline-block;
  white-space: pre;
  opacity: 0;
  animation: ${condense} ${WORD_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
  animation-delay: ${({ $delay }) => $delay}ms;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
  }
`;
