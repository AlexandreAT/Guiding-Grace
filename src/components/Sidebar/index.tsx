import { useState, useRef, useEffect } from "react";
import { REGIONS } from "../../../shared/const";
import RegionCard from "../RegionCard";
import { RegionsList, SidebarStyled, SidebarTitle, ToggleButton, CarouselContainer, CarouselWrapper, SidebarWrapper, CarouselOuterWrapper } from "./styles";

interface SidebarProps {
  activeRegionId: string;
  onRegionSelect: (regionId: string) => void;
  onToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({ activeRegionId, onRegionSelect, onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("mousedown", handleMouseDown as any);
    carousel.addEventListener("mouseleave", handleMouseLeave);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mousemove", handleMouseMove as any);

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown as any);
      carousel.removeEventListener("mouseleave", handleMouseLeave);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mousemove", handleMouseMove as any);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <>
      <SidebarWrapper>
        <SidebarStyled isOpen={isOpen}>
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
        <ToggleButton isOpen={isOpen} onClick={handleToggle} title={isOpen ? "Fechar" : "Abrir"}>
          <span>{isOpen ? "‹" : "›"}</span>
        </ToggleButton>
      </SidebarWrapper>

      <CarouselOuterWrapper>
        <CarouselContainer>
          <SidebarTitle>Regiões</SidebarTitle>
          <CarouselWrapper
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
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
          </CarouselWrapper>
        </CarouselContainer>
      </CarouselOuterWrapper>
    </>
  );
}
