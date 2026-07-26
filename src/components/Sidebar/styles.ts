import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const SidebarPanel = styled.aside<{ $open: boolean }>`
  width: var(--regions-sidebar-width);
  height: auto;
  min-width: 0;
  position: fixed;
  top: 108px;
  bottom: 0;
  left: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: ${({ $open }) =>
    $open ? "1px solid rgba(212, 169, 31, 0.55)" : "0"};
  background:
    radial-gradient(circle at 50% 0%, rgba(176, 130, 25, 0.07), transparent 28%),
    ${THEME.colors.background};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition:
    opacity 180ms ease,
    visibility 180ms ease;

  @media (max-width: 768px) {
    width: min(82vw, 300px);
    height: auto;
    position: fixed;
    top: 82px;
    left: 0;
    z-index: 92;
    border-right: 1px solid rgba(212, 169, 31, 0.55);
    opacity: 1;
    visibility: visible;
    transform: translateX(${({ $open }) => ($open ? "0" : "-101%")});
    transition: transform 220ms ease;
    box-shadow: ${({ $open }) =>
      $open ? "18px 0 42px rgba(0, 0, 0, 0.52)" : "none"};
  }
`;

export const SidebarHeader = styled.header`
  flex: 0 0 auto;
  padding: 22px 16px 4px;
  text-align: center;
  background: linear-gradient(180deg, rgba(12, 12, 9, 0.96), transparent);
`;

export const SidebarTitle = styled.h2`
  margin: 0;
  font-family: ${THEME.fonts.rpg};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${THEME.colors.goldLight};
`;

export const RegionsNavigation = styled.nav`
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(212, 169, 31, 0.35) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(212, 169, 31, 0.32);
  }
`;

export const RegionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const RegionListItem = styled.li`
  min-width: 0;
`;

export const SidebarControlRail = styled.div<{ $open: boolean }>`
  width: 28px;
  min-width: 28px;
  height: auto;
  position: fixed;
  top: 108px;
  bottom: 0;
  left: ${({ $open }) =>
    $open ? "var(--regions-sidebar-width)" : "0"};
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, rgba(7, 8, 7, 0.96), rgba(7, 8, 7, 0.72));

  @media (max-width: 768px) {
    width: 28px;
    height: 48px;
    min-width: 0;
    position: fixed;
    top: 98px;
    bottom: auto;
    left: ${({ $open }) => ($open ? "min(82vw, 300px)" : "0")};
    z-index: 94;
    background: transparent;
    transition: left 220ms ease;
  }
`;

export const ToggleButton = styled.button<{ $open: boolean }>`
  width: 24px;
  height: 48px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 1px solid rgba(212, 169, 31, 0.72);
  border-radius: 6px;
  background: rgba(7, 8, 7, 0.96);
  color: ${THEME.colors.goldLight};
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.34);
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease;

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2;
  }

  &:hover {
    border-color: ${THEME.colors.goldLight};
    background: rgba(212, 169, 31, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 3px;
  }
`;

export const DrawerBackdrop = styled.button<{ $visible: boolean }>`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    inset: 82px 0 0;
    z-index: 91;
    display: block;
    border: 0;
    background: rgba(0, 0, 0, 0.68);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
    transition:
      opacity 180ms ease,
      visibility 180ms ease;
  }
`;
