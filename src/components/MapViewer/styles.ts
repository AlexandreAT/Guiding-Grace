import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const MapContainerStyled = styled.div`
  width: 100%;
  height: auto;
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
    /* allow responsive height based on image */
    height: auto;
  }
`;

export const MapImageContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

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

export const Pin = styled.button`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  transform: translate(-50%, -100%);
  cursor: pointer;

  & > .pin-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${THEME.colors.gold};
    border: 2px solid ${THEME.colors.background};
    box-shadow: ${THEME.shadows.sm};
  }

  & > .pin-label {
    margin-top: 2px;
    font-family: ${THEME.fonts.body};
    font-size: 0.75rem;
    color: ${THEME.colors.foreground};
    background: rgba(0,0,0,0.5);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid ${THEME.colors.gold};
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