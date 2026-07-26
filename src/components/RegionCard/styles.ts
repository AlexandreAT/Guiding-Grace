import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const CardStyled = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 64px;
  padding: 10px 11px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? THEME.colors.gold : "rgba(153, 112, 31, 0.58)"};
  border-radius: 5px;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(100deg, rgba(181, 130, 26, 0.17), rgba(16, 14, 9, 0.78))"
      : "rgba(8, 9, 8, 0.72)"};
  color: ${THEME.colors.foreground};
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? "0 0 19px rgba(212, 169, 31, 0.14)" : "none"};
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  &:hover {
    border-color: rgba(230, 190, 77, 0.9);
    background: rgba(168, 119, 24, 0.09);
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }
`;

export const RegionIconContainer = styled.span<{ $active: boolean }>`
  width: 28px;
  display: grid;
  place-items: center;
  color: ${({ $active }) =>
    $active ? THEME.colors.goldLight : THEME.colors.gold};

  svg,
  i {
    font-size: 1.25rem;
  }
`;

export const RegionIcon = styled.i`
  line-height: 1;
`;

export const RegionContent = styled.span`
  min-width: 0;
  display: block;
`;

export const RegionTitle = styled.span`
  display: flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
  margin-bottom: 4px;
  font-family: ${THEME.fonts.title};
  font-size: 0.83rem;
  line-height: 1.2;
`;

export const RegionNumber = styled.span`
  flex: 0 0 auto;
  color: ${THEME.colors.gold};
  font-weight: 700;
`;

export const RegionName = styled.span`
  min-width: 0;
  color: ${THEME.colors.foreground};
  overflow-wrap: anywhere;
`;

export const RecommendedLevel = styled.span`
  display: block;
  font-family: ${THEME.fonts.title};
  font-size: 0.68rem;
  line-height: 1.25;
  color: ${THEME.colors.gold};
`;
