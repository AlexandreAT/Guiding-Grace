import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

// Quanto da altura do painel precisa ser arrastado para ele fechar ao soltar
const CLOSE_RATIO = 0.5;
const SNAP_BACK_TRANSITION = "transform 180ms ease-out";

interface DragState {
  pointerId: number;
  startY: number;
  height: number;
}

// Painel em "bottom sheet": arrastar a alça para baixo acompanha o dedo; soltando depois da metade,
// o painel fecha como no X, antes disso volta ao lugar
export function useDragToClose<T extends HTMLElement>(enabled: boolean, onClose: () => void) {
  const panelRef = useRef<T>(null);
  const dragRef = useRef<DragState | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const endDrag = () => {
    dragRef.current = undefined;
    setIsDragging(false);
    setOffset(0);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || !panelRef.current) return;
    // Os botões da alça (Limpar, fechar) continuam sendo só cliques
    if ((event.target as Element).closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY, height: panelRef.current.offsetHeight };
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset(Math.max(0, event.clientY - drag.startY));
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const shouldClose = event.clientY - drag.startY >= drag.height * CLOSE_RATIO;
    endDrag();
    if (shouldClose) onClose();
  };

  // O transform muda a cada movimento; vai pelo atributo style para não gerar uma classe CSS por posição
  const panelStyle: CSSProperties | undefined = enabled
    ? { transform: `translateY(${offset}px)`, transition: isDragging ? "none" : SNAP_BACK_TRANSITION }
    : undefined;

  return {
    panelRef,
    panelStyle,
    handleProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: endDrag },
  };
}
