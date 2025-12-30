import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const ContainerStyled = styled.div`
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