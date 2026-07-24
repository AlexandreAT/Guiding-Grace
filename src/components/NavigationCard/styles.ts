import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const CardRoot = styled.button`
  min-width: 0;
  min-height: 460px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 30px 34px;
  border: 1px solid rgba(212, 169, 31, 0.66);
  border-radius: 12px;
  background:
    radial-gradient(
      circle at 20% 0%,
      rgba(181, 132, 25, 0.16),
      transparent 45%
    ),
    linear-gradient(
      180deg,
      rgba(23, 20, 12, 0.96),
      rgba(8, 9, 8, 0.98)
    );
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 220, 120, 0.05);
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(212, 169, 31, 0.14);
    border-radius: 8px;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    border-color: rgba(226, 187, 75, 0.92);
    box-shadow:
      0 20px 48px rgba(0, 0, 0, 0.45),
      0 0 24px rgba(212, 169, 31, 0.1),
      inset 0 -1px 0 rgba(227, 194, 96, 0.32);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 5px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: saturate(0.68);
  }

  @media (max-width: 760px) {
    width: min(100%, 440px);
    min-height: 430px;
    margin: 0 auto;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CardIcon = styled.img`
  width: 170px;
  height: 170px;
  flex: 0 0 auto;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(212, 169, 31, 0.14));
`;

export const CardTitle = styled.h2`
  max-width: 330px;
  min-height: 2.1em;
  margin: 18px 0 0;
  display: flex;
  align-items: center;
  font-family: ${THEME.fonts.rpg};
  font-size: clamp(1.55rem, 2vw, 2rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: #d8b341;
`;

export const CardDescription = styled.p`
  max-width: 300px;
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 1.05rem;
  line-height: 1.55;
  color: #d4d1ca;
`;

export const CardStatus = styled.span`
  margin-top: auto;
  padding: 9px 21px;
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-radius: 999px;
  color: ${THEME.colors.textSecondary};
  font-family: ${THEME.fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
`;
