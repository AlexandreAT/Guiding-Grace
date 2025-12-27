import styled from "styled-components";
import { THEME } from "@shared/const";

/**
 * RegionCard Component
 * Card para exibir informações de uma região.
 * Tema: Gótico Minimalista - bordas douradas, hover com brilho sutil.
 */

const CardStyled = styled.button<{ isActive?: boolean }>`
  width: 100%;
  padding: ${THEME.spacing.md};
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
`;

const RegionNumber = styled.span`
  font-family: ${THEME.fonts.title};
  font-size: 0.875rem;
  color: ${THEME.colors.gold};
  font-weight: 700;
  margin-right: ${THEME.spacing.xs};
`;

const RegionName = styled.h3`
  font-family: ${THEME.fonts.title};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${THEME.colors.foreground};
  margin: 0;
  margin-bottom: ${THEME.spacing.xs};
`;

const RegionLevel = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 0.875rem;
  color: ${THEME.colors.gold};
  margin: 0;
`;

const RegionIcon = styled.span`
  font-size: 1.5rem;
  color: ${THEME.colors.gold};
  margin-right: ${THEME.spacing.sm};
  font-family: "RPG Awesome";
`;

interface RegionCardProps {
  regionName: string;
  regionNumber: number;
  recommendedLevel: string;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
}

export default function RegionCard({
  regionName,
  regionNumber,
  recommendedLevel,
  icon,
  isActive,
  onClick,
}: RegionCardProps) {
  return (
    <CardStyled isActive={isActive} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <RegionIcon className={`ra ${icon}`} />
        <div style={{ flex: 1 }}>
          <RegionName>
            <RegionNumber>{regionNumber}.</RegionNumber>
            {regionName}
          </RegionName>
          <RegionLevel>Nível Recomendado: {recommendedLevel}</RegionLevel>
        </div>
      </div>
    </CardStyled>
  );
}
