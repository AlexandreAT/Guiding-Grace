import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const FooterStyled = styled.footer`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: ${THEME.spacing.md} ${THEME.spacing.sm};
  border-top: 1px solid rgba(212, 169, 31, 0.24);
  background: ${THEME.colors.background};
  text-align: center;
`;

export const FooterText = styled.p`
  max-width: 720px;
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${THEME.colors.textSecondary};

  a {
    color: ${THEME.colors.gold};
    text-underline-offset: 3px;
    transition: color ${THEME.transitions.fast};

    &:hover {
      color: ${THEME.colors.goldLight};
    }

    &:focus-visible {
      outline: 2px solid ${THEME.colors.goldLight};
      outline-offset: 2px;
    }
  }
`;
