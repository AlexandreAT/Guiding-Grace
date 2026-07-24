import styled from "styled-components";
import homeBanner from "../../assets/elden-ring-home-banner.jpg";
import { THEME } from "../../../shared/const";

export const HeroRoot = styled.section`
  min-height: 340px;
  position: relative;
  display: grid;
  place-items: center;
  padding: 46px 24px 42px;
  isolation: isolate;
  border-bottom: 1px solid rgba(212, 169, 31, 0.78);
  background-image:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.9) 0%,
      rgba(5, 5, 5, 0.42) 50%,
      rgba(5, 5, 5, 0.9) 100%
    ),
    linear-gradient(
      180deg,
      rgba(5, 5, 5, 0.2) 0%,
      rgba(5, 5, 5, 0.76) 100%
    ),
    url(${homeBanner});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -7px;
    width: 12px;
    height: 12px;
    border-right: 1px solid ${THEME.colors.gold};
    border-bottom: 1px solid ${THEME.colors.gold};
    background: ${THEME.colors.background};
    transform: translateX(-50%) rotate(45deg);
    z-index: 2;
  }

  @media (max-width: 760px) {
    min-height: 300px;
    padding: 36px 20px 34px;
  }
`;

export const HeroContent = styled.div`
  width: min(100%, 1080px);
  text-align: center;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.85);
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${THEME.fonts.rpg};
  font-size: clamp(2.75rem, 6vw, 5.25rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  color: transparent;
  background: linear-gradient(
    180deg,
    #f1d77a 0%,
    ${THEME.colors.gold} 55%,
    #a77d17 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.65));
`;

export const HeroSubtitle = styled.p`
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: clamp(1rem, 1.7vw, 1.35rem);
  line-height: 1.5;
  color: ${THEME.colors.foreground};
`;

export const BackButton = styled.button`
  min-height: 58px;
  margin: 0 auto 28px;
  padding: 0 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px solid ${THEME.colors.gold};
  border-radius: 6px;
  background: rgba(7, 8, 7, 0.78);
  color: ${THEME.colors.goldLight};
  font-family: ${THEME.fonts.rpg};
  font-size: 0.95rem;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform ${THEME.transitions.fast},
    border-color ${THEME.transitions.fast},
    background-color ${THEME.transitions.fast},
    box-shadow ${THEME.transitions.fast};

  svg {
    flex: 0 0 auto;
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: ${THEME.colors.goldLight};
    background: rgba(212, 169, 31, 0.09);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 4px;
  }

  @media (max-width: 560px) {
    width: 100%;
    min-height: 54px;
    padding: 0 18px;
    font-size: 0.78rem;
  }
`;
