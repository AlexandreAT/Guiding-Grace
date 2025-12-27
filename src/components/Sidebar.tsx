import styled from "styled-components";
import { THEME, REGIONS } from "@shared/const";
import RegionCard from "./RegionCard";

/**
 * Sidebar Component
 * Barra lateral com navegação entre regiões.
 * Tema: Gótico Minimalista - layout vertical, cards com bordas douradas.
 */

const SidebarStyled = styled.aside`
  width: 280px;
  background-color: ${THEME.colors.background};
  border-right: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.lg} 0;
  height: calc(100vh - 100px);
  overflow-y: auto;
  position: sticky;
  top: 100px;

  @media (max-width: 1024px) {
    width: 240px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 2px solid ${THEME.colors.gold};
    padding: ${THEME.spacing.md} 0;
    position: static;
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${THEME.colors.brownDark};
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.gold};
    border-radius: 4px;

    &:hover {
      background: ${THEME.colors.goldLight};
    }
  }
`;

const SidebarTitle = styled.h2`
  font-family: ${THEME.fonts.title};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${THEME.colors.gold};
  padding: 0 ${THEME.spacing.md};
  margin: 0 0 ${THEME.spacing.lg} 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 1px solid ${THEME.colors.gold};
  padding-bottom: ${THEME.spacing.md};
`;

const RegionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.sm};
  padding: 0 ${THEME.spacing.md};
`;

interface SidebarProps {
  activeRegionId: string;
  onRegionSelect: (regionId: string) => void;
}

export default function Sidebar({ activeRegionId, onRegionSelect }: SidebarProps) {
  return (
    <SidebarStyled>
      <SidebarTitle>Regiões</SidebarTitle>
      <RegionsList>
        {REGIONS.map((region) => (
          <RegionCard
            key={region.id}
            regionName={region.name}
            regionNumber={region.order}
            recommendedLevel={region.recommendedLevel}
            icon={region.icon}
            isActive={activeRegionId === region.id}
            onClick={() => onRegionSelect(region.id)}
          />
        ))}
      </RegionsList>
    </SidebarStyled>
  );
}
