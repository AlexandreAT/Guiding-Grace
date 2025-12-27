import styled from "styled-components";
import { useState, useRef } from "react";
import { THEME } from "@shared/const";

/**
 * MapViewer Component
 * Visualizador de mapa interativo com zoom e pan.
 * Tema: Gótico Minimalista - fundo escuro, controles dourados.
 */

const MapContainerStyled = styled.div`
  width: 100%;
  height: 600px;
  background-color: ${THEME.colors.brownDark};
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: ${THEME.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const MapImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const MapImage = styled.img<{ scale: number; offsetX: number; offsetY: number }>`
  max-width: 100%;
  max-height: 100%;
  user-select: none;
  transform: scale(${(props) => props.scale}) translate(${(props) => props.offsetX}px, ${(props) => props.offsetY}px);
  transition: transform ${THEME.transitions.fast};
  pointer-events: none;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: ${THEME.spacing.md};
  right: ${THEME.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.xs};
  z-index: 10;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: ${THEME.colors.gold};
  border: 1px solid ${THEME.colors.goldDark};
  border-radius: 4px;
  color: ${THEME.colors.background};
  font-weight: 700;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all ${THEME.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${THEME.colors.goldLight};
    box-shadow: ${THEME.shadows.gold};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ZoomLevel = styled.div`
  position: absolute;
  bottom: ${THEME.spacing.md};
  left: ${THEME.spacing.md};
  font-family: ${THEME.fonts.body};
  font-size: 0.875rem;
  color: ${THEME.colors.gold};
  background-color: rgba(10, 10, 10, 0.8);
  padding: ${THEME.spacing.xs} ${THEME.spacing.sm};
  border: 1px solid ${THEME.colors.gold};
  border-radius: 4px;
`;

interface MapViewerProps {
  mapImageUrl: string;
  regionName: string;
}

export default function MapViewer({ mapImageUrl, regionName }: MapViewerProps) {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const ZOOM_STEP = 0.2;
  const MAX_OFFSET = 150;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE));
  };

  const handleResetZoom = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffsetX((prev) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, prev + deltaX * 0.5)));
    setOffsetY((prev) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, prev + deltaY * 0.5)));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <MapContainerStyled
      ref={containerRef}
      onWheel={handleWheel}
    >
      <MapImageContainer
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <MapImage
          src={mapImageUrl}
          alt={`Mapa de ${regionName}`}
          scale={scale}
          offsetX={offsetX}
          offsetY={offsetY}
          draggable={false}
        />
      </MapImageContainer>

      <ControlsContainer>
        <ControlButton onClick={handleZoomIn} title="Aproximar (Zoom In)">
          +
        </ControlButton>
        <ControlButton onClick={handleZoomOut} title="Afastar (Zoom Out)" disabled={scale === MIN_SCALE}>
          −
        </ControlButton>
        <ControlButton onClick={handleResetZoom} title="Resetar Zoom">
          ↺
        </ControlButton>
      </ControlsContainer>

      <ZoomLevel>{Math.round(scale * 100)}%</ZoomLevel>
    </MapContainerStyled>
  );
}
