import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const SidebarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarStyled = styled.aside<{ isOpen: boolean }>`
  width: 300px;
  background-color: ${THEME.colors.background};
  border-right: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.lg} 0;
  height: calc(100vh - 75px);
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 75px;
  left: 0;
  z-index: 2;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out;

  @media (max-width: 1024px) {
    width: 240px;
  }

  @media (max-width: 768px) {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${THEME.colors.brownDark};
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.gold};
    border-radius: 4px;

    &:hover {
      background: ${THEME.colors.goldLight};
    }
  }
`;

export const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: fixed;
  left: ${(props) => (props.isOpen ? "300px" : "0")};
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 60px;
  background-color: ${THEME.colors.background};
  border: 2px solid ${THEME.colors.gold};
  border-left: ${(props) => (props.isOpen ? "none" : "2px solid")};
  border-right: ${(props) => (props.isOpen ? "2px solid" : "none")};
  border-radius: ${(props) => (props.isOpen ? "0 8px 8px 0" : "0 8px 8px 0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${THEME.colors.gold};
  font-size: 1.5rem;
  transition: all 0.3s ease-in-out;
  z-index: 3;

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.gold};
  }

  @media (max-width: 768px) {
    display: none;
  }

  span {
    transition: transform 0.3s ease-in-out;
  }
`;

export const SidebarTitle = styled.h2`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${THEME.colors.gold};
  padding: 0 ${THEME.spacing.md};
  margin: 0 0 ${THEME.spacing.lg} 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 1px solid ${THEME.colors.gold};
  padding-bottom: ${THEME.spacing.md};

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0 ${THEME.spacing.md};
    margin: ${THEME.spacing.sm} 0 ${THEME.spacing.sm} 0;
  }
`;

export const RegionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${THEME.spacing.sm};
  padding: 0 ${THEME.spacing.md};
`;

export const CarouselOuterWrapper = styled.div`
  display: none;
  width: 100%;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 ${THEME.spacing.xs};
    margin-top: ${THEME.spacing.sm};
  }
`;

export const CarouselContainer = styled.div`
  display: none;
  flex-direction: column;

  @media (max-width: 768px) {
    display: flex;
    padding: ${THEME.spacing.xs};
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 10, 0.95) 100%);
    border: 1px solid ${THEME.colors.gold};
    border-radius: 8px;
    margin-bottom: ${THEME.spacing.md};
    box-shadow: ${THEME.shadows.md};
    max-width: 95%;
  }
`;

export const CarouselWrapper = styled.div`
  display: flex;
  gap: ${THEME.spacing.sm};
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0 0 ${THEME.spacing.sm} 0;
  cursor: grab;
  user-select: none;
  align-items: center;
  justify-content: flex-start;

  &:active {
    cursor: grabbing;
  }

  /* Scrollbar styling for carousel */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${THEME.colors.brownDark};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.gold};
    border-radius: 4px;

    &:hover {
      background: ${THEME.colors.goldLight};
    }
  }

  /* Para navegadores Firefox */
  scrollbar-color: ${THEME.colors.gold} ${THEME.colors.brownDark};
  scrollbar-width: thin;

  /* Ensure children don't shrink */
  & > * {
    flex-shrink: 0;
    width: 280px;
  }
`;