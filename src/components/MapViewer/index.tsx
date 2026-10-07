import { useState, useRef, useEffect } from "react";
import type { MouseEvent, SyntheticEvent, Touch, TouchEvent } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MAP_LEGEND } from "../../../shared/const";
import type { PinData } from "../../data/regionPins";
import { ControlButton, ControlsContainer, MapContainerStyled, MapImage, MapImageContainer, ZoomLevel, MapInner, Pin, PinCompletedBadge, PinIconWrapper, PinIcon, MapWrapper } from "./styles";
import { MAX_SCALE, MIN_SCALE, useMapViewport, zoomAround } from "./useMapViewport";
import type { FramePoint, MapView } from "./useMapViewport";

export interface PinFocusRequest {
  pinId: string;
  // Muda a cada pedido, para recentralizar mesmo quando o pin é o mesmo
  requestId: number;
}

type TouchGesture =
  | { mode: "none" }
  | { mode: "pan"; lastX: number; lastY: number }
  | { mode: "pinch"; startView: MapView; startDistance: number; startMidpoint: FramePoint };

interface MapViewerProps {
  mapImageUrl: string;
  regionName: string;
  pins?: PinData[];
  pinMode?: boolean;
  onMapClick?: (coords: { x: number; y: number }) => void;
  onPinClick?: (pinId: string) => void;
  onImageLoad?: () => void;
  completedPinIds?: ReadonlySet<string>;
  focusRequest?: PinFocusRequest;
}

// Proporção usada só até a imagem carregar
const FALLBACK_ASPECT_RATIO = 4 / 3;
const BUTTON_ZOOM_FACTOR = 1.25;
const WHEEL_ZOOM_FACTOR = 1.15;
const FOCUS_SCALE = 2.5;
const FOCUS_HIGHLIGHT_MS = 2600;
// Movimento mínimo para um clique virar arraste (evita copiar coordenadas sem querer no modo pin)
const DRAG_THRESHOLD_PX = 4;

const getDistance = (t1: Touch, t2: Touch) =>
  Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

export default function MapViewer({ mapImageUrl, regionName, pins = [], pinMode = false, onMapClick, onPinClick, onImageLoad, completedPinIds, focusRequest }: MapViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef({ lastX: 0, lastY: 0, distance: 0 });
  const gestureRef = useRef<TouchGesture>({ mode: "none" });
  const scaleRef = useRef(MIN_SCALE);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(FALLBACK_ASPECT_RATIO);
  const [highlightedPinId, setHighlightedPinId] = useState<string>();
  const { view, updateView, toFramePoint, zoomBy, panBy, focusOn, resetView } = useMapViewport(frameRef);

  useEffect(() => {
    scaleRef.current = view.scale;
  }, [view.scale]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
    onImageLoad?.();
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    dragRef.current = { lastX: e.clientX, lastY: e.clientY, distance: 0 };
    if (view.scale > MIN_SCALE) setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      distance: dragRef.current.distance + Math.hypot(dx, dy),
    };
    panBy(dx, dy);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      gestureRef.current = {
        mode: "pinch",
        startView: view,
        startDistance: getDistance(t1, t2),
        startMidpoint: toFramePoint((t1.clientX + t2.clientX) / 2, (t1.clientY + t2.clientY) / 2),
      };
      setIsDragging(true);
    } else if (e.touches.length === 1 && view.scale > MIN_SCALE) {
      gestureRef.current = { mode: "pan", lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const gesture = gestureRef.current;

    if (gesture.mode === "pinch" && e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      if (gesture.startDistance <= 0) return;
      const scale = gesture.startView.scale * (getDistance(t1, t2) / gesture.startDistance);
      const midpoint = toFramePoint((t1.clientX + t2.clientX) / 2, (t1.clientY + t2.clientY) / 2);
      // Amplia em torno do ponto onde a pinça começou e acompanha o deslocamento dos dedos
      updateView(() => {
        const zoomed = zoomAround(gesture.startView, scale, gesture.startMidpoint);
        return {
          ...zoomed,
          x: zoomed.x + midpoint.x - gesture.startMidpoint.x,
          y: zoomed.y + midpoint.y - gesture.startMidpoint.y,
        };
      });
    } else if (gesture.mode === "pan" && e.touches.length === 1) {
      const touch = e.touches[0];
      panBy(touch.clientX - gesture.lastX, touch.clientY - gesture.lastY);
      gestureRef.current = { mode: "pan", lastX: touch.clientX, lastY: touch.clientY };
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 1 && scaleRef.current > MIN_SCALE) {
      // Saiu um dedo da pinça: continua arrastando com o que ficou
      gestureRef.current = { mode: "pan", lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
      return;
    }
    if (e.touches.length === 0) {
      gestureRef.current = { mode: "none" };
      setIsDragging(false);
    }
  };

  const handleMapClick = async (e: MouseEvent) => {
    if (!import.meta.env.DEV || !pinMode) return;
    if (dragRef.current.distance > DRAG_THRESHOLD_PX) return;
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

  useEffect(() => {
    if (!focusRequest) return;
    const pin = pins.find((p) => p.id === focusRequest.pinId);
    if (!pin) return;

    focusOn(pin.x, pin.y, FOCUS_SCALE);
    setHighlightedPinId(pin.id);
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = window.setTimeout(() => setHighlightedPinId(undefined), FOCUS_HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
    // Reage só a novos pedidos; mudanças na lista de pins (ex.: filtros) não devem recentralizar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest]);

  // Listener nativo: o onWheel do React é passivo e não consegue impedir o scroll da página
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const onWheel = (e: WheelEvent) => {
      const isZoomingOut = e.deltaY > 0;
      // No zoom mínimo, girar para baixo volta a rolar a página normalmente
      if (isZoomingOut && scaleRef.current <= MIN_SCALE) return;

      e.preventDefault();
      zoomBy(isZoomingOut ? 1 / WHEEL_ZOOM_FACTOR : WHEEL_ZOOM_FACTOR, toFramePoint(e.clientX, e.clientY));
    };

    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [toFramePoint, zoomBy]);

  return (
    <MapWrapper>
      <MapContainerStyled ref={frameRef} $aspectRatio={aspectRatio}>
        <MapImageContainer
          $canPan={view.scale > MIN_SCALE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={import.meta.env.DEV && pinMode ? handleMapClick : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
        <MapInner $scale={view.scale} $offsetX={view.x} $offsetY={view.y} $animated={!isDragging}>
          <MapImage ref={imageRef} src={mapImageUrl} alt={`Mapa de ${regionName}`} draggable={false} onLoad={handleImageLoad} />

          {pins.map((p) => {
            const isCompleted = completedPinIds?.has(p.id) ?? false;
            const legend = MAP_LEGEND[p.type];

            return (
            <Pin
              key={p.id}
              type="button"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              onMouseDown={(ev) => ev.stopPropagation()}
              onClick={(ev) => {
                ev.stopPropagation();
                onPinClick?.(p.id);
              }}
              title={p.label}
              aria-label={isCompleted ? `${p.label ?? "Marcação"} (concluído)` : p.label}
              $pinColor={legend.color}
              $completed={isCompleted}
              $highlighted={highlightedPinId === p.id}
            >
              {p.label && p.labelAbove && <span className="pin-label">{p.label}</span>}

              <PinIconWrapper $pinColor={legend.color}>
                {isCompleted && (
                  <PinCompletedBadge aria-hidden="true">
                    <IoCheckmarkSharp />
                  </PinCompletedBadge>
                )}
                <PinIcon as={legend.icon} $pinColor={legend.color} />
              </PinIconWrapper>

              {p.label && !p.labelAbove && <span className="pin-label">{p.label}</span>}
            </Pin>
            );
          })}
        </MapInner>
      </MapImageContainer>

      <ControlsContainer>
        <ControlButton type="button" onClick={() => zoomBy(BUTTON_ZOOM_FACTOR)} title="Aproximar (Zoom In)" aria-label="Aproximar mapa" disabled={view.scale >= MAX_SCALE}>
          +
        </ControlButton>
        <ControlButton type="button" onClick={() => zoomBy(1 / BUTTON_ZOOM_FACTOR)} title="Afastar (Zoom Out)" aria-label="Afastar mapa" disabled={view.scale <= MIN_SCALE}>
          −
        </ControlButton>
        <ControlButton type="button" onClick={resetView} title="Resetar Zoom" aria-label="Resetar zoom do mapa">
          ↺
        </ControlButton>
      </ControlsContainer>

      <ZoomLevel>{Math.round(view.scale * 100)}%</ZoomLevel>
    </MapContainerStyled>
    </MapWrapper>
  );
}
