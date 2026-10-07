import styled from "styled-components";
import { THEME } from "../../../shared/const";

export const MessageRoot = styled.li<{ $fromGideon: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $fromGideon }) => ($fromGideon ? "flex-start" : "flex-end")};
  gap: 6px;
  max-width: 100%;
`;

export const MessageAuthor = styled.span`
  font-family: ${THEME.fonts.rpg};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${THEME.colors.gold};
`;

export const MessageBubble = styled.p<{ $fromGideon: boolean }>`
  max-width: ${({ $fromGideon }) => ($fromGideon ? "100%" : "85%")};
  margin: 0;
  padding: 10px 12px;
  border: 1px solid
    ${({ $fromGideon }) => ($fromGideon ? "transparent" : "rgba(212, 169, 31, 0.32)")};
  border-left: 2px solid
    ${({ $fromGideon }) => ($fromGideon ? THEME.colors.gold : "rgba(212, 169, 31, 0.32)")};
  border-radius: ${({ $fromGideon }) => ($fromGideon ? "2px 8px 8px 2px" : "8px")};
  background: ${({ $fromGideon }) =>
    $fromGideon ? "rgba(23, 20, 12, 0.92)" : "rgba(212, 169, 31, 0.1)"};
  font-family: ${THEME.fonts.body};
  font-size: 0.92rem;
  line-height: 1.55;
  color: ${THEME.colors.foreground};
  overflow-wrap: anywhere;
`;

export const MessageNote = styled.p`
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 0.78rem;
  font-style: italic;
  color: ${THEME.colors.textSecondary};
`;

export const SourceList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SourceCard = styled.li<{ $compact: boolean }>`
  display: flex;
  flex-direction: ${({ $compact }) => ($compact ? "row" : "column")};
  align-items: ${({ $compact }) => ($compact ? "center" : "flex-start")};
  justify-content: space-between;
  gap: ${({ $compact }) => ($compact ? "10px" : "6px")};
  padding: ${({ $compact }) => ($compact ? "8px 10px" : "10px 12px")};
  border: 1px solid rgba(212, 169, 31, 0.32);
  border-radius: 6px;
  background: rgba(7, 8, 7, 0.72);
`;

export const SourceHeader = styled.div<{ $compact: boolean }>`
  min-width: 0;
  display: flex;
  flex-direction: ${({ $compact }) => ($compact ? "column" : "row")};
  flex-wrap: wrap;
  align-items: ${({ $compact }) => ($compact ? "flex-start" : "baseline")};
  gap: 2px 8px;

  & + button {
    flex: 0 0 auto;
  }
`;

export const SourceTitle = styled.span`
  font-family: ${THEME.fonts.rpg};
  font-size: 0.86rem;
  font-weight: 600;
  color: ${THEME.colors.goldLight};
`;

export const SourceLocation = styled.span`
  font-family: ${THEME.fonts.body};
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${THEME.colors.textSecondary};
`;

export const SourceSnippet = styled.p`
  margin: 0;
  font-family: ${THEME.fonts.body};
  font-size: 0.82rem;
  line-height: 1.5;
  color: ${THEME.colors.textSecondary};
`;

export const MessageChoices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
