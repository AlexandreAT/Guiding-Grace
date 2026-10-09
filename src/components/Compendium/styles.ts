import styled from "styled-components";
import { THEME } from "../../../shared/const";

// Tarja de spoiler: ocupa o lugar do conteúdo bloqueado e deixa claro que revelar é uma escolha
export const SpoilerNoticeRoot = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 12px 14px;
  padding: 16px 18px;
  border: 1px dashed rgba(212, 169, 31, 0.42);
  border-radius: 6px;
  background:
    repeating-linear-gradient(
      -45deg,
      rgba(74, 74, 74, 0.18) 0,
      rgba(74, 74, 74, 0.18) 10px,
      rgba(36, 36, 36, 0.18) 10px,
      rgba(36, 36, 36, 0.18) 20px
    ),
    rgba(12, 12, 10, 0.92);
  color: ${THEME.colors.textSecondary};

  > svg {
    margin-top: 2px;
    font-size: 1.35rem;
    color: ${THEME.colors.gold};
  }

  > button {
    grid-column: 2;
    justify-self: start;
  }
`;

export const SpoilerNoticeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: ${THEME.fonts.body};
  line-height: 1.5;

  strong {
    color: ${THEME.colors.goldLight};
    font-weight: 600;
  }
`;

export const RevealedTag = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border: 1px solid rgba(212, 169, 31, 0.36);
  border-radius: 999px;
  font-family: ${THEME.fonts.body};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${THEME.colors.textSecondary};
`;

export const Tag = styled.span<{ $tone?: "gold" | "muted" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border: 1px solid
    ${({ $tone }) => ($tone === "muted" ? "rgba(182, 179, 172, 0.32)" : "rgba(212, 169, 31, 0.46)")};
  border-radius: 999px;
  background: ${({ $tone }) => ($tone === "muted" ? "transparent" : "rgba(212, 169, 31, 0.1)")};
  font-family: ${THEME.fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ $tone }) => ($tone === "muted" ? THEME.colors.textSecondary : THEME.colors.goldLight)};
`;

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const OverviewPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px;
  border: 1px solid rgba(212, 169, 31, 0.42);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(16, 16, 13, 0.96), rgba(9, 10, 8, 0.96));
  font-family: ${THEME.fonts.body};
  color: ${THEME.colors.textSecondary};

  @media (max-width: 700px) {
    padding: 18px;
  }
`;

export const OverviewLabel = styled.span`
  font-family: ${THEME.fonts.rpg};
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${THEME.colors.gold};
`;

export const OverviewList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${THEME.colors.foreground};
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const RelatedList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    text-decoration: none;
  }
`;

export const SourceNote = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${THEME.colors.textDisabled};

  a {
    color: ${THEME.colors.textSecondary};
    text-underline-offset: 3px;
  }
`;

export const StatGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin: 0;
`;

export const Stat = styled.div<{ $highlight?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid ${({ $highlight }) => ($highlight ? "rgba(227, 194, 96, 0.72)" : "rgba(212, 169, 31, 0.2)")};
  border-radius: 6px;
  background: ${({ $highlight }) => ($highlight ? "rgba(212, 169, 31, 0.12)" : "rgba(19, 17, 11, 0.6)")};

  dt {
    font-size: 0.78rem;
    color: ${THEME.colors.textSecondary};
  }

  dd {
    margin: 0;
    font-family: ${THEME.fonts.rpg};
    font-size: 1.05rem;
    color: ${({ $highlight }) => ($highlight ? THEME.colors.goldLight : THEME.colors.foreground)};
  }
`;

export const StatGroupTitle = styled.h3`
  margin: 6px 0 0;
  font-family: ${THEME.fonts.rpg};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${THEME.colors.goldLight};
`;
