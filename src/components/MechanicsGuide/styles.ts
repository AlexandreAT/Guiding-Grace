import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const GuideContent = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const MechanicPanel = styled.section`
  position: relative;
  /* Âncora de navegação: não fica escondida atrás do header fixo */
  scroll-margin-top: 132px;
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 26px;
  padding: 24px 28px;
  border: 1px solid rgba(212, 169, 31, 0.62);
  border-radius: 8px;
  background:
    radial-gradient(circle at 0% 0%, rgba(170, 124, 24, 0.08), transparent 35%),
    linear-gradient(180deg, rgba(12, 13, 12, 0.98), rgba(7, 8, 7, 0.98));
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(227, 194, 96, 0.04);

  &::before {
    content: "";
    position: absolute;
    inset: 7px;
    border: 1px solid rgba(212, 169, 31, 0.11);
    border-radius: 5px;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -1px;
    left: 18px;
    width: 28px;
    height: 5px;
    border-top: 1px solid ${THEME.colors.goldLight};
    border-left: 1px solid ${THEME.colors.goldLight};
    opacity: 0.58;
    pointer-events: none;
  }

  @media (max-width: 700px) {
    grid-template-columns: 60px minmax(0, 1fr);
    gap: 18px;
    padding: 22px 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionIcon = styled.div`
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
  border: 1px solid ${THEME.colors.gold};
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(117, 94, 37, 0.26), transparent 66%),
    ${THEME.colors.background};
  color: ${THEME.colors.goldLight};
  box-shadow:
    0 0 0 4px rgba(212, 169, 31, 0.08),
    0 0 18px rgba(212, 169, 31, 0.1);

  &::after {
    content: "";
    position: absolute;
    inset: 5px;
    border: 1px solid rgba(227, 194, 96, 0.32);
    border-radius: inherit;
  }

  svg {
    width: 32px;
    height: 32px;
    stroke-width: 1.7;
  }

  @media (max-width: 700px) {
    width: 54px;
    height: 54px;

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;

export const SectionBody = styled.div`
  min-width: 0;
  position: relative;
  z-index: 1;
`;

export const SectionHeading = styled.h2`
  margin: 0;
  font-family: ${THEME.fonts.rpg};
  font-size: clamp(1.22rem, 2vw, 1.72rem);
  font-weight: 600;
  line-height: 1.22;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${THEME.colors.goldLight};
`;

export const SectionNumber = styled.span`
  color: ${THEME.colors.gold};
`;

export const SectionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(242, 240, 234, 0.92);

  p {
    margin: 0;
  }
`;

export const GuideParagraphStyled = styled.p`
  margin: 0;
`;

export const HighlightStyled = styled.span`
  color: ${THEME.colors.goldLight};
  font-weight: 600;
`;

export const Callout = styled.aside`
  margin-top: 4px;
  padding: 14px 18px;
  border-top: 1px solid rgba(212, 169, 31, 0.14);
  border-right: 1px solid rgba(212, 169, 31, 0.14);
  border-bottom: 1px solid rgba(212, 169, 31, 0.14);
  border-left: 4px solid ${THEME.colors.gold};
  border-radius: 4px;
  background: rgba(140, 104, 27, 0.09);
  color: ${THEME.colors.textSecondary};
`;

export const CalloutTitle = styled.strong`
  color: ${THEME.colors.goldLight};
  font-weight: 700;
`;

export const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 2px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.article`
  min-height: 100%;
  padding: 18px 20px;
  border: 1px solid rgba(212, 169, 31, 0.46);
  border-radius: 6px;
  background:
    radial-gradient(circle at 0 0, rgba(212, 169, 31, 0.08), transparent 42%),
    rgba(19, 17, 11, 0.72);
`;

export const ComparisonCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;

  h3 {
    margin: 0;
    font-family: ${THEME.fonts.rpg};
    font-size: 1.04rem;
    font-weight: 600;
    color: ${THEME.colors.goldLight};
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`;

export const ComparisonIcon = styled.span`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: ${THEME.colors.gold};

  svg {
    width: 32px;
    height: 32px;
    stroke-width: 1.65;
  }
`;

export const ComparisonCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${THEME.colors.textSecondary};

  p {
    margin: 0;
  }
`;

export const GuideListStyled = styled.ul`
  display: grid;
  gap: 4px;
  margin: 0;
  padding-left: 1.35rem;
  color: ${THEME.colors.textSecondary};

  li::marker {
    color: ${THEME.colors.gold};
  }
`;
