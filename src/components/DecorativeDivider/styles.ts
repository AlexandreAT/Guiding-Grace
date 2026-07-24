import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const DividerRoot = styled.div<{ $compact: boolean }>`
  width: min(${({ $compact }) => ($compact ? "190px" : "390px")}, 72vw);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? "12px" : "18px")};
  margin: ${({ $compact }) => ($compact ? "18px auto 20px" : "24px auto 26px")};
`;

export const DividerLine = styled.span`
  height: 1px;
  background: linear-gradient(90deg, transparent, ${THEME.colors.gold});

  &:last-child {
    transform: scaleX(-1);
  }
`;

export const CenterMark = styled.span`
  width: 9px;
  height: 9px;
  border: 1px solid ${THEME.colors.goldLight};
  background: ${THEME.colors.goldDark};
  transform: rotate(45deg);
  box-shadow: 0 0 8px rgba(212, 169, 31, 0.25);
`;
