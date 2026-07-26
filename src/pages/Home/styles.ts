import styled from "styled-components";
import { THEME, REGION_BACKGROUNDS } from "../../../shared/const";

export const PageContainer = styled.div<{ regionId?: string; isMobile?: boolean }>`
  min-height: 100vh;
  color: ${THEME.colors.foreground};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  margin-top: 108px;

  @media (max-width: 768px) {
    margin-top: 82px;
  }

  ${(props) => {
    const regionKey =
      (props.regionId as keyof typeof REGION_BACKGROUNDS) || "geral";
    const regionConfig = REGION_BACKGROUNDS[regionKey] || {
      image: null,
      overlayOpacity: 0.8,
      overlayOpacityMobile: 0.85,
    };
    const overlayOpacity = props.isMobile
      ? regionConfig.overlayOpacityMobile
      : regionConfig.overlayOpacity;

    let backgroundImage = "none";
    if (regionConfig.image) {
      const imageName = props.isMobile
        ? `${regionConfig.image}-mobile-back.jpg`
        : `${regionConfig.image}-back.jpg`;
      backgroundImage = `url(/images/${imageName})`;
    }

    return `
      background-image: ${backgroundImage};
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      &::before {
        content: "";
        position: fixed;
        top: 108px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(10, 10, 10, ${overlayOpacity});
        z-index: 1;
        pointer-events: none;
      }

      @media (max-width: 768px) {
        &::before {
          top: 82px;
        }
      }
    `;
  }}

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const HomePageContainer = styled.div`
  min-height: 100vh;
  padding-top: 108px;
  overflow-x: hidden;
  background: ${THEME.colors.background};
  color: ${THEME.colors.foreground};

  @media (max-width: 768px) {
    padding-top: 82px;
  }
`;

export const PageContent = styled.section`
  min-height: 590px;
  padding: 68px 32px 80px;
  background:
    radial-gradient(circle at 50% 0%, rgba(117, 94, 37, 0.08), transparent 38%),
    linear-gradient(180deg, #080908 0%, #050605 100%);

  @media (max-width: 760px) {
    padding: 52px 20px 64px;
  }
`;

export const CardsGrid = styled.div<{ $selection?: boolean }>`
  width: 100%;
  max-width: ${({ $selection }) => ($selection ? "960px" : "1240px")};
  margin: 0 auto;
  display: grid;
  grid-template-columns: ${({ $selection }) =>
    $selection
      ? "repeat(2, minmax(0, 1fr))"
      : "repeat(3, minmax(0, 1fr))"};
  gap: ${({ $selection }) => ($selection ? "68px" : "44px")};

  ${({ $selection }) =>
    !$selection &&
    `
      @media (max-width: 1050px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        > :last-child:nth-child(odd) {
          grid-column: 1 / -1;
          width: min(100%, 430px);
          justify-self: center;
        }
      }
    `}

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 32px;

    > :last-child:nth-child(odd) {
      grid-column: auto;
    }
  }
`;

export const EmptyState = styled.div`
  min-height: 50vh;
  display: grid;
  place-content: center;
  gap: 24px;
  text-align: center;

  h1 {
    font-family: ${THEME.fonts.rpg};
    color: ${THEME.colors.goldLight};
  }

  button {
    min-height: 48px;
    padding: 0 20px;
    border: 1px solid ${THEME.colors.gold};
    border-radius: 6px;
    background: ${THEME.colors.surface};
    color: ${THEME.colors.foreground};
    cursor: pointer;
  }
`;

export const MainContent = styled.div<{ sidebarOpen?: boolean }>`
  --regions-sidebar-width: 230px;
  --sidebar-control-width: 28px;
  display: grid;
  grid-template-columns: ${(props) =>
    props.sidebarOpen !== false
      ? "var(--regions-sidebar-width) var(--sidebar-control-width) minmax(0, 1fr)"
      : "0 var(--sidebar-control-width) minmax(0, 1fr)"};
  flex: 1;
  position: relative;
  z-index: 2;
  transition: grid-template-columns 220ms ease;

  @media (max-width: 1024px) {
    --regions-sidebar-width: 214px;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

export const ContentWrapper = styled.div`
  min-width: 0;
  grid-column: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${THEME.spacing.lg};
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-column: auto;
    padding: ${THEME.spacing.md};
  }
`;

export const MapSection = styled.div<{ marginBottom?: string }>`
  margin-bottom: ${({ marginBottom }) => marginBottom || THEME.spacing.xl};
`;

export const ButtonPin = styled.button`
  padding: ${THEME.spacing.xs};
  background-color: ${THEME.colors.shadowDark};
  color: ${THEME.colors.foreground};
  border: 1px solid ${THEME.colors.gold};
  border-radius: 4px;
  font-family: ${THEME.fonts.rpg};
  font-size: 1rem;
  cursor: pointer;
  transition: all ${THEME.transitions.normal};

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.goldLg};
  }
`;

export const ImgController = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const MapTitle = styled.h2`
  font-family: ${THEME.fonts.rpg};
  font-size: 1.75rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0 0 ${THEME.spacing.md};
  letter-spacing: 1px;
`;

export const PlaceholderMap = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(
    135deg,
    ${THEME.colors.brownDark} 0%,
    ${THEME.colors.background} 100%
  );
  border: 2px solid ${THEME.colors.gold};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${THEME.fonts.rpgOld};
  color: ${THEME.colors.gold};
  font-size: 1rem;
  text-align: center;
  padding: ${THEME.spacing.lg};
`;

export const BackButtonLink = styled.button`
  background: none;
  border: none;
  color: ${THEME.colors.gold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${THEME.spacing.sm};
  font-size: 0.95rem;
  font-family: ${THEME.fonts.body};
  transition: opacity ${THEME.transitions.normal};
  margin-bottom: ${THEME.spacing.md};

  &:hover {
    opacity: 0.8;
  }
`;

export const PinControlsContainer = styled.div`
  display: flex;
  gap: ${THEME.spacing.sm};
  align-items: center;
  margin-bottom: ${THEME.spacing.md};
`;

export const PinControlLabel = styled.span`
  font-size: 0.75rem;
  color: #ccc;
`;

export const MapContainerWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const MapLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(10, 10, 10, 0.8);
  z-index: 10;
  border-radius: 4px;
`;

export const LoadingContent = styled.div`
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${THEME.colors.gold};
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto ${THEME.spacing.md};
`;

export const LoadingText = styled.p`
  color: ${THEME.colors.gold};
  font-size: 0.95rem;
  margin: 0;
`;

export const ScrollToTopButton = styled.button`
  display: none;
  position: fixed;
  bottom: ${THEME.spacing.xs};
  right: ${THEME.spacing.xs};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${THEME.colors.gold};
  border: none;
  color: ${THEME.colors.background};
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 50;
  opacity: 0.7;
  transition: opacity ${THEME.transitions.normal};
  box-shadow: ${THEME.shadows.goldLg};

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
