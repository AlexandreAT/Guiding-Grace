import type { IconType } from "react-icons";
import {
  CardStyled,
  RecommendedLevel,
  RegionContent,
  RegionIcon,
  RegionIconContainer,
  RegionName,
  RegionNumber,
  RegionTitle,
} from "./styles";

interface RegionCardProps {
  regionName: string;
  regionNumber: number;
  recommendedLevel: string;
  icon: string | IconType;
  isActive?: boolean;
  onClick: () => void;
}

export default function RegionCard({
  regionName,
  regionNumber,
  recommendedLevel,
  icon,
  isActive = false,
  onClick,
}: RegionCardProps) {
  const IconComponent = typeof icon === "string" ? null : icon;

  return (
    <CardStyled
      type="button"
      $active={isActive}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <RegionIconContainer $active={isActive}>
        {IconComponent ? (
          <IconComponent aria-hidden="true" />
        ) : (
          <RegionIcon className={`ra ${icon}`} aria-hidden="true" />
        )}
      </RegionIconContainer>

      <RegionContent>
        <RegionTitle>
          <RegionNumber>{regionNumber}.</RegionNumber>
          <RegionName>{regionName}</RegionName>
        </RegionTitle>
        <RecommendedLevel>
          Nível recomendado: {recommendedLevel.replace("-", "–")}
        </RecommendedLevel>
      </RegionContent>
    </CardStyled>
  );
}
