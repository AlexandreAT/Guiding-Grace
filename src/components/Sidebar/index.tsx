import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { REGIONS } from "../../../shared/const";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { DecorativeDivider } from "../DecorativeDivider";
import RegionCard from "../RegionCard";
import {
  DrawerBackdrop,
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
}

export default function Sidebar({
  activeRegionId,
  onRegionSelect,
  onToggle,
}: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [manualOpenState, setManualOpenState] = useState<boolean | null>(null);
  const isOpen = manualOpenState ?? !isMobile;

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
        </SidebarHeader>

        <RegionsNavigation aria-label="Regiões do guia">
          <RegionList>
            {REGIONS.map((region) => (
              <RegionListItem key={region.id}>
                <RegionCard
                  regionName={region.name}
                  regionNumber={region.order}
                  recommendedLevel={region.recommendedLevel}
                  icon={region.icon}
                  isActive={activeRegionId === region.id}
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
