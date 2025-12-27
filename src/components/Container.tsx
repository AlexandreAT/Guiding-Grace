import styled from "styled-components";
import { THEME } from "@shared/const";

/**
 * Container Component
 * Componente base para envolver conteúdo com padding e largura máxima.
 * Tema: Gótico Minimalista - mantém espaçamento generoso e alinhamento limpo.
 */

const ContainerStyled = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${THEME.spacing.lg};

  @media (max-width: 768px) {
    padding: 0 ${THEME.spacing.md};
  }

  @media (max-width: 480px) {
    padding: 0 ${THEME.spacing.sm};
  }
`;

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <ContainerStyled className={className}>{children}</ContainerStyled>;
}
