import { REGIONS } from "../../../shared/const";
import RegionCard from "../RegionCard";
import { RegionsList, SidebarStyled, SidebarTitle } from "./styles";

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
