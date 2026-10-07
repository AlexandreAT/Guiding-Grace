import { IoBookOutline, IoLocationSharp } from "react-icons/io5";
import type { GideonChoice, GideonSource } from "../../../shared/gideon/types";
import type { GideonMessage as GideonMessageData } from "../../hooks/useGideonConversation";
import { PillButton } from "../PillButton";
import {
  MessageAuthor,
  MessageBubble,
  MessageChoices,
  MessageNote,
  MessageRoot,
  SourceCard,
  SourceHeader,
  SourceList,
  SourceLocation,
  SourceSnippet,
  SourceTitle,
} from "./styles";

interface GideonMessageProps {
  message: GideonMessageData;
  onOpenSource: (source: GideonSource) => void;
  onChoose: (choice: GideonChoice) => void;
}

export default function GideonMessage({ message, onOpenSource, onChoose }: GideonMessageProps) {
  const isGideon = message.role === "gideon";
  const response = message.response;
  // Com a IA o texto já explica: a fonte mostra só o nome, a região e o atalho
  const isCompact = message.answeredByAi === true;

  return (
    <MessageRoot $fromGideon={isGideon}>
      {isGideon && <MessageAuthor>Gideon</MessageAuthor>}
      <MessageBubble $fromGideon={isGideon}>{message.text}</MessageBubble>

      {response?.note && <MessageNote>{response.note}</MessageNote>}

      {response && response.sources.length > 0 && (
        <SourceList aria-label="Fontes do Guiding Grace">
          {response.sources.map((source) => (
            <SourceCard key={source.chunkId} $compact={isCompact}>
              <SourceHeader $compact={isCompact}>
                <SourceTitle>{source.title}</SourceTitle>
                {source.location && <SourceLocation>{source.location}</SourceLocation>}
              </SourceHeader>
              {!isCompact && <SourceSnippet>{source.snippet}</SourceSnippet>}
              <PillButton type="button" onClick={() => onOpenSource(source)}>
                {source.action.type === "OPEN_MAP" ? (
                  <IoLocationSharp aria-hidden="true" />
                ) : (
                  <IoBookOutline aria-hidden="true" />
                )}
                <span>{source.action.label}</span>
              </PillButton>
            </SourceCard>
          ))}
        </SourceList>
      )}

      {response?.choices && response.choices.length > 0 && (
        <MessageChoices>
          {response.choices.map((choice) => (
            <PillButton key={choice.id} type="button" onClick={() => onChoose(choice)}>
              {choice.label}
            </PillButton>
          ))}
        </MessageChoices>
      )}
    </MessageRoot>
  );
}
