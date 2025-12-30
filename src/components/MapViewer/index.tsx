import { useState, useRef, useEffect } from "react";
import { ControlButton, ControlsContainer, MapContainerStyled, MapImage, MapImageContainer, ZoomLevel, MapInner, Pin } from "./styles";

/**
 * MapViewer Component
 * Visualizador de mapa interativo com zoom e pan.
 * Tema: Gótico Minimalista - fundo escuro, controles dourados.
 */

type PinData = { id: string; x: number; y: number; type?: string; label?: string };

interface MapViewerProps {
  mapImageUrl: string;
  regionName: string;
  pins?: PinData[];
  pinMode?: boolean;
  onMapClick?: (coords: { x: number; y: number }) => void;
}

export default function MapViewer({ mapImageUrl, regionName, pins = [], pinMode = false, onMapClick }: MapViewerProps) {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 8;
  const ZOOM_STEP = 0.1;
  const MAX_OFFSET = 800;

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
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMapClick = async (e: React.MouseEvent) => {
    if (!pinMode) return;
    if (isDragging) return;
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const nx = Math.max(0, Math.min(1, x));
    const ny = Math.max(0, Math.min(1, y));

    const coords = { x: Number(nx.toFixed(4)), y: Number(ny.toFixed(4)) };
    try {
      await navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
      alert(`Coordenadas copiadas para a área de transferência:\n${JSON.stringify(coords, null, 2)}`);
    } catch (err) {
      console.log("Clipboard write failed", err);
    }

    if (onMapClick) onMapClick(coords);
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

  useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY < 0) {
        setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));
      } else {
        setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

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
        onClick={handleMapClick}
      >
        <MapInner scale={scale} offsetX={offsetX} offsetY={offsetY}>
          <MapImage ref={imageRef} src={mapImageUrl} alt={`Mapa de ${regionName}`} draggable={false} />

          {pins.map((p) => (
            <Pin
              key={p.id}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              onClick={(ev) => {
                ev.stopPropagation();
                console.log('Pin clicado', p);
              }}
              title={p.label}
            >
              <span className="pin-dot" />
              {p.label && <span className="pin-label">{p.label}</span>}
            </Pin>
          ))}
        </MapInner>
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
