import { useEffect, useRef, useState } from "react";
import { IoBookOutline, IoLocationSharp } from "react-icons/io5";
import type { GideonChoice, GideonSource } from "../../../shared/gideon/types";
import type { GideonMessage as GideonMessageData } from "../../hooks/useGideonConversation";
import MagicText from "../MagicText";
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
  // Resposta da IA recém-chegada: o texto se forma palavra por palavra
  revealing?: boolean;
  onRevealed?: () => void;
  onOpenSource: (source: GideonSource) => void;
  onChoose: (choice: GideonChoice) => void;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function GideonMessage({ message, revealing = false, onRevealed, onOpenSource, onChoose }: GideonMessageProps) {
  const isGideon = message.role === "gideon";
  const response = message.response;
  // Decidido ao montar: a resposta que chegou agora se forma na tela e continua assim até sair dela (trocar pelo
  // texto comum no fim fazia as letras se mexerem). Reaberta depois, ela já aparece pronta
  const [animate] = useState(() => revealing && !prefersReducedMotion());
  // Fontes e escolhas só depois da fala: antes, elas empurravam o chat e o texto aparecia fora da tela
  const [textDone, setTextDone] = useState(!animate);
  const rootRef = useRef<HTMLLIElement>(null);

  // A resposta começa visível do início, mesmo que seja longa; quando as fontes chegam, o chat as mostra
  useEffect(() => {
    if (animate) rootRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [animate, textDone]);

  const handleTextDone = () => {
    setTextDone(true);
    onRevealed?.();
  };
  // Com a IA o texto já explica: a fonte mostra só o nome, a região e o atalho
  const isCompact = message.answeredByAi === true;

  return (
    <MessageRoot ref={rootRef} $fromGideon={isGideon}>
      {isGideon && <MessageAuthor>Gideon</MessageAuthor>}
      <MessageBubble $fromGideon={isGideon}>
        {animate ? <MagicText text={message.text} onDone={handleTextDone} /> : message.text}
      </MessageBubble>

      {response?.note && <MessageNote>{response.note}</MessageNote>}

      {textDone && response && response.sources.length > 0 && (
        <SourceList aria-label="Fontes do Guiding Grace" $appear={animate}>
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

      {textDone && response?.choices && response.choices.length > 0 && (
        <MessageChoices $appear={animate}>
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
