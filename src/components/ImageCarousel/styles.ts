import styled from 'styled-components';
import { THEME } from "../../../shared/const";

export const CarouselWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const Track = styled.div`
  display: flex;
  gap: ${THEME.spacing.sm};
  overflow: hidden;
  scroll-behavior: smooth;
  padding: ${THEME.spacing.sm} 0;
`;

export const Item = styled.div<{ w?: string; h?: string }>`
  width: ${(p) => p.w || '200px'};
  height: ${(p) => p.h || '150px'};
  flex: 0 0 auto;
`;

export const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${THEME.colors.gold};
  color: ${THEME.colors.background};
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 5;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Prev = styled(Arrow)`
  left: 8px;
`;

export const Next = styled(Arrow)`
  right: 8px;
`;
