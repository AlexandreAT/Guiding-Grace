import styled from "styled-components";
import { THEME, REGION_BACKGROUNDS } from "../../../shared/const";

export const PageContainer = styled.div<{ regionId?: string; isMobile?: boolean }>`
  min-height: 100vh;
  color: ${THEME.colors.foreground};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  margin-top: 100px;

  ${(props) => {
    const regionKey = props.regionId as keyof typeof REGION_BACKGROUNDS || "geral";
    const regionConfig = REGION_BACKGROUNDS[regionKey] || { image: null, overlayOpacity: 0.8 };
    const isMobile = props.isMobile;
    
    let backgroundImage = "none";
    if (regionConfig.image) {
      const imageName = isMobile 
        ? `${regionConfig.image}-mobile.jpg` 
        : `${regionConfig.image}.jpg`;
      backgroundImage = `url(/images/${imageName})`;
    }

    return `
      background-image: ${backgroundImage};
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      
      &::before {
        content: '';
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(10, 10, 10, ${regionConfig.overlayOpacity});
        z-index: 1;
        pointer-events: none;
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
  background-color: ${THEME.colors.background};
  color: ${THEME.colors.foreground};
  display: flex;
  flex-direction: column;
  margin-top: 100px;
`;

export const HomeHeaderSection = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 10, 0.6) 100%);
  border-bottom: 2px solid ${THEME.colors.gold};
  padding: ${THEME.spacing.xl} ${THEME.spacing.lg};
  text-align: center;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: ${THEME.spacing.lg} ${THEME.spacing.md};
  }
`;

export const HomeTitle = styled.h1`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 3rem;
  font-weight: 700;
  color: ${THEME.colors.gold};
  margin: 0;
  letter-spacing: 3px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const HomeSubtitle = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 1.1rem;
  color: ${THEME.colors.foreground};
  margin: ${THEME.spacing.md} 0 0 0;
  line-height: 1.6;
`;

export const HomeContent = styled.div`
  flex: 1;
  padding: ${THEME.spacing.xl} ${THEME.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${THEME.spacing.lg};
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CardButton = styled.button<{ backgroundImage?: string }>`
  position: relative;
  height: 300px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all ${THEME.transitions.normal};
  background: ${(props) =>
    props.backgroundImage
      ? `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url(${props.backgroundImage})`
      : `linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 0.6) 100%)`};
  background-size: cover;
  background-position: center;
  border: 2px solid ${THEME.colors.brown};

  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${THEME.spacing.lg};
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    border-color: ${THEME.colors.gold};
    box-shadow: ${THEME.shadows.gold};

    & > div {
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    height: 250px;
  }
`;

export const DisabledCardButton = styled.button<{ backgroundImage?: string }>`
  position: relative;
  height: 300px;
  border: none;
  border-radius: 8px;
  cursor: not-allowed;
  overflow: hidden;
  transition: all ${THEME.transitions.normal};
  background: ${(props) =>
    props.backgroundImage
      ? `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%), url(${props.backgroundImage})`
      : `linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(10, 10, 10, 0.8) 100%)`};
  background-size: cover;
  background-position: center;
  border: 2px solid ${THEME.colors.brownDark};
  opacity: 0.6;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: ${THEME.spacing.lg};
  text-align: center;

  @media (max-width: 640px) {
    height: 250px;
  }
`;

export const DisabledCardContent = styled.div`
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.95) 100%);
  padding: ${THEME.spacing.md};
  width: 100%;
  border-radius: 4px;
  opacity: 0.7;
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.95) 100%);
  padding: ${THEME.spacing.md};
  width: 100%;
  border-radius: 4px;
  opacity: 0.9;
  transition: opacity ${THEME.transitions.fast};
`;

export const CardTitle = styled.h3`
  font-family: ${THEME.fonts.rpgOld};
  font-size: 1.5rem;
  font-weight: 600;
  color: ${THEME.colors.gold};
  margin: 0;
  letter-spacing: 1px;
`;

export const CardDescription = styled.p`
  font-family: ${THEME.fonts.body};
  font-size: 0.9rem;
  color: ${THEME.colors.foreground};
  margin: ${THEME.spacing.xs} 0 0 0;
  line-height: 1.4;
`;

export const BackButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${THEME.spacing.xl};
  width: 100%;
`;

export const BackButton = styled.button`
  background-color: transparent;
  border: 2px solid ${THEME.colors.gold};
  color: ${THEME.colors.gold};
  padding: ${THEME.spacing.sm} ${THEME.spacing.md};
  border-radius: 4px;
  cursor: pointer;
  font-family: ${THEME.fonts.rpg};
  font-size: 0.95rem;
  transition: all ${THEME.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: ${THEME.spacing.sm};

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.gold};
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  z-index: 2;
  margin-left: 300px;

  @media (max-width: 1024px) {
    margin-left: 240px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${THEME.spacing.lg};
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: ${THEME.spacing.md};
  }
`;

export const MapSection = styled.div<{ marginBottom?: string }>`
  margin-bottom: ${({ marginBottom }) => marginBottom || THEME.spacing.xl};
`;

export const ButtonPin = styled.button`
  padding: ${THEME.spacing.xs} ${THEME.spacing.xs};
  background-color: ${THEME.colors.shadowDark};
  color: ${THEME.colors.foreground};
  border: 1px solid ${THEME.colors.gold};
  border-radius: 4px;
  font-family: ${THEME.fonts.rpg};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${THEME.colors.gold};
    color: ${THEME.colors.background};
    box-shadow: ${THEME.shadows.goldLg};
  }

  transition: all ${THEME.transitions.normal};
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
  margin: 0 0 ${THEME.spacing.md} 0;
  letter-spacing: 1px;
`;

export const PlaceholderMap = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, ${THEME.colors.brownDark} 0%, ${THEME.colors.background} 100%);
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

// Guide Page Components
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: ${THEME.colors.gold};
  font-size: 0.95rem;
  margin: 0;
`;

// Select/Cards Components
export const CardIconContainer = styled.div`
  font-size: 3rem;
  margin-bottom: ${THEME.spacing.sm};
`;

export const DisabledCardLabel = styled.div`
  font-size: 0.8rem;
  margin-top: ${THEME.spacing.sm};
  color: #999;
`;

// Mechanics/Info Pages Components
export const HomeContentWithOverflow = styled.div`
  flex: 1;
  padding: ${THEME.spacing.xl} ${THEME.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: ${THEME.spacing.md};
  }
`;

export const ContentInnerWrapper = styled.div`
  padding-top: var(--spacing-xl, 48px);
`;