import styled, { css, keyframes } from "styled-components";
import { THEME } from "../../../shared/const";

export const MapWrapper = styled.div`
  /* Limites do quadro: o tamanho real segue a proporção da imagem dentro deles */
  --map-max-width: 1100px;
  --map-max-height: min(650px, 75vh);
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    --map-max-height: 70vh;
  }
`;

export const MapContainerStyled = styled.div<{ $aspectRatio: number }>`
  width: min(
    100%,
    var(--map-max-width),
    calc(var(--map-max-height) * ${({ $aspectRatio }) => $aspectRatio})
  );
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  background-color: ${THEME.colors.brownDark};
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: ${THEME.shadows.lg};
  touch-action: none;
  -webkit-touch-callout: none;
`;

export const MapImageContainer = styled.div<{ $canPan: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: ${({ $canPan }) => ($canPan ? "grab" : "default")};
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;

  &:active {
    cursor: ${({ $canPan }) => ($canPan ? "grabbing" : "default")};
  }
`;

// O transform muda a cada movimento; vai pelo atributo style para não gerar uma classe CSS por posição
export const MapInner = styled.div.attrs<{ $scale: number; $offsetX: number; $offsetY: number; $animated: boolean }>(
  ({ $scale, $offsetX, $offsetY }) => ({
    style: { transform: `translate(${$offsetX}px, ${$offsetY}px) scale(${$scale})` },
  }),
)`
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  transition: ${({ $animated }) =>
    $animated ? `transform ${THEME.transitions.fast}` : "none"};
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MapImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

const pinPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(227, 194, 96, 0.85);
  }
  100% {
    box-shadow: 0 0 0 12px rgba(227, 194, 96, 0);
  }
`;

export const Pin = styled.button<{ $pinColor?: string; $completed?: boolean; $highlighted?: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: ${({ $completed, $highlighted }) => ($completed && !$highlighted ? 0.5 : 1)};
  z-index: ${({ $highlighted }) => ($highlighted ? 2 : 1)};
  transition: opacity ${THEME.transitions.fast};

  &:focus-visible {
    outline: 1px solid ${THEME.colors.goldLight};
    outline-offset: 2px;
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      & > div {
        border-color: ${THEME.colors.goldLight};
        animation: ${pinPulse} 900ms ease-out 3;

        @media (prefers-reduced-motion: reduce) {
          animation: none;
          box-shadow: 0 0 0 3px rgba(227, 194, 96, 0.7);
        }
      }
    `}

  & > .pin-label {
    font-family: ${THEME.fonts.body};
    font-size: 6px;
    color: ${THEME.colors.foreground};
    background: rgba(0,0,0,0.5);
    padding: 1px 2px;
    border-radius: 4px;
    border: 1px solid ${(p) => p.$pinColor || THEME.colors.gold};
    white-space: nowrap;
  }

  /* Reduce pin size and label on small screens */
  @media (max-width: 480px) {
    gap: 1px;
    & > .pin-label {
      font-size: 2.5px;
      padding: 0 1px;
    border: 1px solid ${(p) => p.$pinColor || THEME.colors.gold}ff !important;
    }
  }
`;

export const PinIconWrapper = styled.div<{ $pinColor?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${(p) => p.$pinColor || THEME.colors.gold};
  border-radius: 50%;
  box-shadow: ${THEME.shadows.sm};

  @media (max-width: 480px) {
    width: 8px !important;
    height: 8px !important;
    font-size: 0.9rem;
  }
`;

export const PinCompletedBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -5px;
  width: 9px;
  height: 9px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${THEME.colors.gold};
  color: ${THEME.colors.background};

  svg {
    width: 7px;
    height: 7px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const PinIcon = styled.div<{ $pinColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 100%;
  font-size: 1.25rem;
  color: ${(p) => p.$pinColor || THEME.colors.gold};
  
  &.ra {
    font-family: 'Remixicon';
    &::before {
      content: attr(class);
    }
  }
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  @media (max-width: 480px) {
    width: 4px !important;
    height: 4px !important;
    font-size: 0.9rem;
  }
`;

export const ControlsContainer = styled.div`
  position: absolute;
  bottom: ${THEME.spacing.md};
  right: ${THEME.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.xs};
  z-index: 10;
`;

export const ControlButton = styled.button`
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

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

export const ZoomLevel = styled.div`
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
  
  @media (max-width: 480px) {
    font-size: 0.75rem !important;
    padding: ${THEME.spacing.xs} ${THEME.spacing.xs} !important;
  }
`;