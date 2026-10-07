import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { CAN_OPEN_LOCKED_REGIONS, REGION_ICONS } from "../../../shared/const";
import { REGIONS } from "../../data/regions";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DecorativeDivider } from "../DecorativeDivider";
import ProgressBar from "../ProgressBar";
import RegionCard, { type RegionProgress } from "../RegionCard";
import {
  DrawerBackdrop,
  OverallProgress,
  OverallProgressLabel,
  RegionList,
  RegionListItem,
  RegionsNavigation,
  SidebarControlRail,
  SidebarHeader,
  SidebarPanel,
  SidebarTitle,
  ToggleButton,
} from "./styles";

interface SidebarProps {
  activeRegionId: string;
  onRegionSelect: (regionId: string) => void;
  onToggle?: (isOpen: boolean) => void;
  regionProgress: Record<string, RegionProgress>;
}

export default function Sidebar({
  activeRegionId,
  onRegionSelect,
  onToggle,
  regionProgress,
}: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [manualOpenState, setManualOpenState] = useState<boolean | null>(null);
  const isOpen = manualOpenState ?? !isMobile;
  const overall = Object.values(regionProgress).reduce(
    (sum, progress) => ({
      completed: sum.completed + progress.completed,
      total: sum.total + progress.total,
    }),
    { completed: 0, total: 0 },
  );

  const setOpen = useCallback((nextOpen: boolean) => {
    setManualOpenState(nextOpen);
    onToggle?.(nextOpen);
  }, [onToggle]);

  const handleToggle = () => setOpen(!isOpen);

  const handleRegionSelect = (regionId: string) => {
    onRegionSelect(regionId);

    if (isMobile) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobile, isOpen, setOpen]);

  return (
    <>
      <SidebarPanel $open={isOpen} aria-hidden={!isOpen && !isMobile}>
        <SidebarHeader>
          <SidebarTitle>Regiões</SidebarTitle>
          <DecorativeDivider compact />
          {overall.total > 0 && (
            <OverallProgress>
              <OverallProgressLabel>
                <span>Progresso geral</span>
                <span>
                  {overall.completed}/{overall.total}
                </span>
              </OverallProgressLabel>
              <ProgressBar
                completed={overall.completed}
                total={overall.total}
                label="Progresso geral do guia"
              />
            </OverallProgress>
          )}
        </SidebarHeader>

        <RegionsNavigation aria-label="Regiões do guia">
          <RegionList>
            {REGIONS.map((region) => (
              <RegionListItem key={region.id}>
                <RegionCard
                  regionName={region.name}
                  regionNumber={region.order}
                  recommendedLevel={region.recommendedLevel}
                  icon={REGION_ICONS[region.id]}
                  isActive={activeRegionId === region.id}
                  disabled={region.disabled && !CAN_OPEN_LOCKED_REGIONS}
                  status={region.status}
                  progress={regionProgress[region.id]}
                  onClick={() => handleRegionSelect(region.id)}
                />
              </RegionListItem>
            ))}
          </RegionList>
        </RegionsNavigation>
      </SidebarPanel>

      <SidebarControlRail $open={isOpen}>
        <ToggleButton
          type="button"
          $open={isOpen}
          onClick={handleToggle}
          aria-label={
            isOpen
              ? "Recolher lista de regiões"
              : "Expandir lista de regiões"
          }
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <IconChevronLeft aria-hidden="true" />
          ) : (
            <IconChevronRight aria-hidden="true" />
          )}
        </ToggleButton>
      </SidebarControlRail>

      <DrawerBackdrop
        type="button"
        $visible={isMobile && isOpen}
        onClick={() => setOpen(false)}
        aria-label="Fechar lista de regiões"
        tabIndex={isMobile && isOpen ? 0 : -1}
      />
    </>
  );
}
