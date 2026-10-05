import type { IconType } from "react-icons";
import ProgressBar from "../ProgressBar";
import {
  CardStyled,
  RecommendedLevel,
  RegionContent,
  RegionIcon,
  RegionIconContainer,
  RegionMeta,
  RegionName,
  RegionNumber,
  RegionProgressText,
  RegionStatus,
  RegionTitle,
} from "./styles";

export interface RegionProgress {
  completed: number;
  total: number;
}

interface RegionCardProps {
  regionName: string;
  regionNumber: number;
  recommendedLevel: string;
  icon: string | IconType;
  isActive?: boolean;
  disabled?: boolean;
  status?: string;
  progress?: RegionProgress;
  onClick: () => void;
}

export default function RegionCard({
  regionName,
  regionNumber,
  recommendedLevel,
  icon,
  isActive = false,
  disabled = false,
  status,
  progress,
  onClick,
}: RegionCardProps) {
  const IconComponent = typeof icon === "string" ? null : icon;
  const hasProgress = !status && progress && progress.total > 0;

  return (
    <CardStyled
      type="button"
      $active={isActive}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
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
        <RegionMeta>
          <RecommendedLevel>
            Nível recomendado: {recommendedLevel.replace("-", "–")}
          </RecommendedLevel>
          {status && <RegionStatus>{status}</RegionStatus>}
          {hasProgress && (
            <RegionProgressText>
              {progress.completed}/{progress.total}
            </RegionProgressText>
          )}
        </RegionMeta>
        {hasProgress && (
          <ProgressBar
            compact
            completed={progress.completed}
            total={progress.total}
            label={`Progresso de ${regionName}`}
          />
        )}
      </RegionContent>
    </CardStyled>
  );
}
