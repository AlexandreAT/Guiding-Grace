import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const HubRoot = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const HubGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const HubGroupTitle = styled.h2`
  margin: 0;
  font-family: ${THEME.fonts.rpg};
  font-size: clamp(1.1rem, 1.8vw, 1.45rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${THEME.colors.goldLight};
`;

export const HubGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const cardBase = `
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 18px 20px;
  border-radius: 8px;
  text-align: left;
  font-family: ${THEME.fonts.body};
`;

export const HubCard = styled.button`
  ${cardBase}
  width: 100%;
  border: 1px solid rgba(212, 169, 31, 0.46);
  background:
    radial-gradient(circle at 0 0, rgba(212, 169, 31, 0.08), transparent 42%),
    rgba(14, 13, 10, 0.92);
  color: ${THEME.colors.textSecondary};
  cursor: pointer;
  transition:
    border-color ${THEME.transitions.fast},
    transform ${THEME.transitions.fast};

  &:hover {
    border-color: ${THEME.colors.goldLight};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.goldLight};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

export const HubCardTitle = styled.span`
  font-family: ${THEME.fonts.rpg};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${THEME.colors.goldLight};
`;

export const HubCardText = styled.span`
  font-size: 0.92rem;
  line-height: 1.5;
`;

export const LockedCard = styled.div`
  ${cardBase}
  border: 1px dashed rgba(212, 169, 31, 0.36);
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(74, 74, 74, 0.14) 0,
      rgba(74, 74, 74, 0.14) 10px,
      rgba(36, 36, 36, 0.14) 10px,
      rgba(36, 36, 36, 0.14) 20px
    ),
    rgba(12, 12, 10, 0.92);
  color: ${THEME.colors.textSecondary};

  > button {
    align-self: flex-start;
    margin-top: auto;
  }
`;
