import styled from 'styled-components';
import { THEME } from "../../../shared/const";

export const Wrapper = styled.div<{ w?: string }>`
  width: ${(p) => p.w || '200px'};
  display: inline-flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  border: 1px solid ${THEME.colors.gold};
  background: transparent;
  height: auto;
  position: relative;
`;

export const Thumb = styled.img<{ h?: string }>`
  display: block;
  width: 100%;
  height: ${(p) => p.h || '150px'};
  object-fit: cover;
  cursor: zoom-in;
  transition: transform ${THEME.transitions.fast};

  &:hover {
    transform: scale(1.02);
  }
`;

export const CaptionBox = styled.div`
  width: 100%;
  background: rgba(0,0,0,0.6);
  padding: 2px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: absolute;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
`;

export const OverlayContent = styled.div`
    max-width: 92vw;
    max-height: 92vh;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(10,10,10,0.9), rgba(0,0,0,0.75));
    box-shadow: ${THEME.shadows.goldLg};
    border: 2px solid ${THEME.colors.brownDark};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    overflow: auto;
`;

export const LargeImage = styled.img`
  width: 100%;
  height: calc(92vh - 80px);
  object-fit: contain;
  flex-shrink: 1;
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 0px;
    right: 0px;
    background: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    border: none;
    padding: 6px 10px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    cursor: pointer;
    font-weight: 700;
`;

export const Caption = styled.div<{fontSize?: string}>`
  font-family: ${THEME.fonts.rpgOld};
  font-size: ${({ fontSize }) => fontSize || '1.2em'};
  color: #fff;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  line-height: 1.3;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 10px 0 !important;
`;
