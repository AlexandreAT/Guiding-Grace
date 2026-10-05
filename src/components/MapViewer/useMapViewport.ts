import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";

export interface MapView {
  scale: number;
  // Deslocamento da imagem em pixels de tela, a partir do centro do quadro
  x: number;
  y: number;
}

export interface FramePoint {
  x: number;
  y: number;
}

export const MIN_SCALE = 1;
export const MAX_SCALE = 8;

const INITIAL_VIEW: MapView = { scale: MIN_SCALE, x: 0, y: 0 };

// Área interna do quadro com casas decimais (clientWidth arredonda e deixaria frestas de 1px no zoom alto)
const getFrameSize = (frame: HTMLElement) => {
  const rect = frame.getBoundingClientRect();
  return {
    width: rect.width - frame.clientLeft * 2,
    height: rect.height - frame.clientTop * 2,
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// Em scale 1 a imagem preenche o quadro inteiro; com zoom, ela só pode andar o quanto sobra para cada lado
const clampView = (view: MapView, width: number, height: number): MapView => {
  const scale = clamp(view.scale, MIN_SCALE, MAX_SCALE);
  const maxX = (width * (scale - 1)) / 2;
  const maxY = (height * (scale - 1)) / 2;

  return {
    scale,
    x: clamp(view.x, -maxX, maxX),
    y: clamp(view.y, -maxY, maxY),
  };
};

// Mantém o ponto `anchor` (relativo ao centro do quadro) parado na tela ao trocar de escala
export const zoomAround = (from: MapView, scale: number, anchor: FramePoint): MapView => {
  const nextScale = clamp(scale, MIN_SCALE, MAX_SCALE);
  const ratio = nextScale / from.scale;

  return {
    scale: nextScale,
    x: anchor.x - (anchor.x - from.x) * ratio,
    y: anchor.y - (anchor.y - from.y) * ratio,
  };
};

export function useMapViewport(frameRef: RefObject<HTMLElement | null>) {
  const [view, setView] = useState<MapView>(INITIAL_VIEW);

  const updateView = useCallback(
    (next: (current: MapView) => MapView) => {
      setView((current) => {
        const frame = frameRef.current;
        if (!frame) return current;
        const { width, height } = getFrameSize(frame);
        return clampView(next(current), width, height);
      });
    },
    [frameRef],
  );

  const toFramePoint = useCallback(
    (clientX: number, clientY: number): FramePoint => {
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: clientX - rect.left - rect.width / 2,
        y: clientY - rect.top - rect.height / 2,
      };
    },
    [frameRef],
  );

  const zoomBy = useCallback(
    (factor: number, anchor: FramePoint = { x: 0, y: 0 }) => {
      updateView((current) => zoomAround(current, current.scale * factor, anchor));
    },
    [updateView],
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      updateView((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
    },
    [updateView],
  );

  // Centraliza um ponto normalizado da imagem (0 a 1), respeitando as bordas
  const focusOn = useCallback(
    (normalizedX: number, normalizedY: number, scale: number) => {
      updateView(() => {
        const frame = frameRef.current;
        const { width, height } = frame ? getFrameSize(frame) : { width: 0, height: 0 };
        return {
          scale,
          x: -(normalizedX - 0.5) * width * scale,
          y: -(normalizedY - 0.5) * height * scale,
        };
      });
    },
    [frameRef, updateView],
  );

  const resetView = useCallback(() => setView(INITIAL_VIEW), []);

  // O quadro muda de tamanho com a janela e quando a imagem carrega; o deslocamento precisa caber de novo
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(() => updateView((current) => current));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef, updateView]);

  return { view, updateView, toFramePoint, zoomBy, panBy, focusOn, resetView };
}
