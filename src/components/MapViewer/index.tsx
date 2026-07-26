import { useState, useRef, useEffect } from "react";
import type { MouseEvent, Touch, TouchEvent, WheelEvent as ReactWheelEvent } from "react";
import type { IconType } from "react-icons";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ControlButton, ControlsContainer, MapContainerStyled, MapImage, MapImageContainer, ZoomLevel, MapInner, Pin, PinIconWrapper, PinIcon, MapWrapper } from "./styles";

type PinData = { id: string; x: number; y: number; type?: string; label?: string; icon?: string | IconType; color?: string; labelAbove?: boolean };

interface TouchState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  pinch: boolean;
  pinchDist: number;
  pinchStartScale: number;
}

interface MapViewerProps {
  mapImageUrl: string;
  regionName: string;
  pins?: PinData[];
  pinMode?: boolean;
  onMapClick?: (coords: { x: number; y: number }) => void;
  onPinClick?: (pinId: string) => void;
  onImageLoad?: () => void;
  mapWidth?: string;
  mapHeight?: string;
}

export default function MapViewer({ mapImageUrl, regionName, pins = [], pinMode = false, onMapClick, onPinClick, onImageLoad, mapWidth = "100%", mapHeight = "auto" }: MapViewerProps) {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const touchState = useRef<TouchState>({ isDragging: false, lastX: 0, lastY: 0, pinch: false, pinchDist: 0, pinchStartScale: 1 });
  const isMobile = useMediaQuery("(max-width: 768px)");

  const MIN_SCALE = 1;
  const MAX_SCALE = 8;
  const MAX_OFFSET = 800;

  const handleZoomIn = () => {
    const step = isMobile ? 0.25 : 0.1;
    setScale((prev) => Math.min(prev + step, MAX_SCALE));
  };

  const handleZoomOut = () => {
    const step = isMobile ? 0.25 : 0.1;
    setScale((prev) => Math.max(prev - step, MIN_SCALE));
  };

  const handleResetZoom = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const getTouchDistance = (t1: Touch, t2: Touch) => {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const d = getTouchDistance(e.touches[0], e.touches[1]);
      touchState.current.pinch = true;
      touchState.current.pinchDist = d;
      touchState.current.pinchStartScale = scale;
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        e.preventDefault();
        touchState.current.isDragging = true;
        touchState.current.lastX = e.touches[0].clientX;
        touchState.current.lastY = e.touches[0].clientY;
      }
    }
  };

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const handleTouchMove = (e: TouchEvent) => {
    if (!e.touches) return;
    if (e.touches.length === 2 && touchState.current.pinch) {
      e.preventDefault();
      const newDist = getTouchDistance(e.touches[0], e.touches[1]);
      if (touchState.current.pinchDist > 0) {
        const scaleFactor = newDist / touchState.current.pinchDist;
        const newScale = clamp(touchState.current.pinchStartScale * scaleFactor, MIN_SCALE, MAX_SCALE);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && touchState.current.isDragging) {
      e.preventDefault();
      const t = e.touches[0];
      const deltaX = t.clientX - touchState.current.lastX;
      const deltaY = t.clientY - touchState.current.lastY;
      setOffsetX((prev) => clamp(prev + deltaX * 0.5, -MAX_OFFSET, MAX_OFFSET));
      setOffsetY((prev) => clamp(prev + deltaY * 0.5, -MAX_OFFSET, MAX_OFFSET));
      touchState.current.lastX = t.clientX;
      touchState.current.lastY = t.clientY;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!e.touches || e.touches.length === 0) {
      touchState.current.isDragging = false;
      touchState.current.pinch = false;
    } else if (e.touches.length === 1) {
      // if one remains, cancel pinch
      touchState.current.pinch = false;
      touchState.current.isDragging = scale > 1;
      if (touchState.current.isDragging) {
        touchState.current.lastX = e.touches[0].clientX;
        touchState.current.lastY = e.touches[0].clientY;
      }
    }
  };

  const handleMapClick = async (e: MouseEvent) => {
    if (!import.meta.env.DEV || !pinMode) return;
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
      console.log("Coordenadas não copiadas", err);
    }

    if (onMapClick) onMapClick(coords);
  };

  const handleMouseMove = (e: MouseEvent) => {
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

  const handleWheel = (e: ReactWheelEvent) => {
    e.preventDefault();
    const step = isMobile ? 0.25 : 0.1;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + step, MAX_SCALE));
    } else {
      setScale((prev) => Math.max(prev - step, MIN_SCALE));
    }
  };

  useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const step = (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) ? 0.25 : 0.1;

      if (e.deltaY < 0) {
        setScale((prev) => Math.min(prev + step, MAX_SCALE));
      } else {
        setScale((prev) => Math.max(prev - step, MIN_SCALE));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <MapWrapper width={mapWidth} height={mapHeight}>
      <MapContainerStyled
        ref={containerRef}
        onWheel={handleWheel}
      >
        <MapImageContainer
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={import.meta.env.DEV && pinMode ? handleMapClick : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        <MapInner scale={scale} offsetX={offsetX} offsetY={offsetY}>
          <MapImage ref={imageRef} src={mapImageUrl} alt={`Mapa de ${regionName}`} draggable={false} onLoad={onImageLoad} />

          {pins.map((p) => (
            <Pin
              key={p.id}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              onClick={(ev) => {
                ev.stopPropagation();
                if (typeof p.id === 'string' && typeof onPinClick === 'function') {
                  onPinClick(p.id);
                } else {
                  console.log('Pin clicado', p);
                }
              }}
              title={p.label}
              pinColor={p.color}
            >
              {p.label && p.labelAbove && <span className="pin-label">{p.label}</span>}

              <PinIconWrapper pinColor={p.color}>
                {p.icon ? (
                  typeof p.icon === 'string' ? (
                    <PinIcon className={p.icon} pinColor={p.color} />
                  ) : (
                    <PinIcon as={p.icon} pinColor={p.color} />
                  )
                ) : (
                  <span className="pin-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: p.color || '#d4af37' }} />
                )}
              </PinIconWrapper>

              {p.label && !p.labelAbove && <span className="pin-label">{p.label}</span>}
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
    </MapWrapper>
  );
}
