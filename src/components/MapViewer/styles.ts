import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const MapWrapper = styled.div<{ width?: string; height?: string }>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || 'auto'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const MapContainerStyled = styled.div`
  width: 80%;
  height: 100%;
  background-color: ${THEME.colors.brownDark};
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: ${THEME.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  -webkit-touch-callout: none;

  @media (max-width: 768px) {
    height: 100%;
  }
`;

export const MapImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;

  &:active {
    cursor: grabbing;
  }
`;

export const MapInner = styled.div<{ scale: number; offsetX: number; offsetY: number }>`
  position: relative;
  display: inline-block;
  transform: scale(${(props) => props.scale}) translate(${(props) => props.offsetX}px, ${(props) => props.offsetY}px);
  transform-origin: center center;
  transition: transform ${THEME.transitions.fast};
`;

export const MapImage = styled.img`
  display: block;
  max-width: 100%;
  height: 650px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

export const Pin = styled.button<{ pinColor?: string }>`
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

  & > .pin-label {
    font-family: ${THEME.fonts.body};
    font-size: 6px;
    color: ${THEME.colors.foreground};
    background: rgba(0,0,0,0.5);
    padding: 1px 2px;
    border-radius: 4px;
    border: 1px solid ${(p) => p.pinColor || THEME.colors.gold};
    white-space: nowrap;
  }
`;

export const PinIconWrapper = styled.div<{ pinColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${(p) => p.pinColor || THEME.colors.gold};
  border-radius: 50%;
  box-shadow: ${THEME.shadows.sm};
`;

export const PinIcon = styled.div<{ pinColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 100%;
  font-size: 1.25rem;
  color: ${(p) => p.pinColor || THEME.colors.gold};
  
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
`;