import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const CardStyled = styled.button<{ isActive?: boolean }>`
  width: 100%;
  padding: ${THEME.spacing.sm};
  background-color: transparent;
  border: 2px solid ${(props) => (props.isActive ? THEME.colors.gold : THEME.colors.brown)};
  border-radius: 4px;
  cursor: pointer;
  transition: all ${THEME.transitions.normal};
  text-align: left;
  position: relative;

  &:hover {
    border-color: ${THEME.colors.gold};
    box-shadow: ${THEME.shadows.gold};
  }

  ${(props) =>
    props.isActive &&
    `
    background-color: rgba(212, 175, 55, 0.1);
    box-shadow: ${THEME.shadows.goldLg};
  `}
  
  @media (max-width: 768px) {
    padding: ${THEME.spacing.xs};
    border-width: 1px;
  }
`;

export const RegionNumber = styled.span`
  font-family: ${THEME.fonts.title};
  font-size: 1rem;
  color: ${THEME.colors.gold};
  font-weight: 700;
  margin-right: ${THEME.spacing.xs};

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const RegionName = styled.h3`
  font-family: ${THEME.fonts.title};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${THEME.colors.foreground};
  margin: 0;
  margin-bottom: ${THEME.spacing.xs};

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const RegionText = styled.p<{color?: string, size?: string}>`
  font-family: ${THEME.fonts.rpgOld};
  font-size: ${({ size }) => size || "1rem"};
  color: ${({ color }) => color === "white" ? THEME.colors.foreground : THEME.colors.gold};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ size }) => "0.8rem"};
  }
`;

export const RegionIcon = styled.span`
  font-size: 1.5rem;
  color: ${THEME.colors.gold};
  margin-right: ${THEME.spacing.sm};

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-right: ${THEME.spacing.xs};
  }
`;