import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { GiCrystalBall } from "react-icons/gi";
import { IoClose, IoSend, IoShieldCheckmarkOutline } from "react-icons/io5";
import type { GideonChoice, GideonSource } from "../../../shared/gideon/types";
import gideonIcon from "../../assets/gideon-icon.png";
import { MAX_QUESTION_LENGTH, useGideonConversation } from "../../hooks/useGideonConversation";
import { useDragToClose } from "../../hooks/useDragToClose";
import { useGideonScreenContext } from "../../hooks/useGideonScreenContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import GideonMessage from "../GideonMessage";
import { PillButton } from "../PillButton";
import {
  CloseButton,
  Composer,
  DragHandle,
  ComposerInput,
  HeaderActions,
  HeaderAvatar,
  HeaderIdentity,
  HeaderSubtitle,
  HeaderTitle,
  IntroBubble,
  Launcher,
  MessageItems,
  MessageList,
  Panel,
  PanelHeader,
  PrivacyNote,
  SendButton,
  Suggestions,
  ThinkingText,
  TurnstileSlot,
} from "./styles";

const PANEL_ID = "gideon-panel";
const TITLE_ID = "gideon-title";

export default function GideonAssistant() {
  const navigate = useNavigate();
  const context = useGideonScreenContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    isOpen,
    messages,
    isThinking,
    intro,
    usesAi,
    restingLabel,
    turnstileRef,
    revealingMessageId,
    finishReveal,
    setOpen,
    ask,
    clearConversation,
  } = useGideonConversation(context);
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    // A resposta que está se formando cuida da própria rolagem (mostra o começo dela, não o fim da lista)
    if (revealingMessageId && messages.at(-1)?.id === revealingMessageId) return;
    listEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isThinking, isOpen, revealingMessageId]);

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // No celular, puxar o cabeçalho para baixo fecha o painel, como o X
  const { panelRef, panelStyle, handleProps } = useDragToClose<HTMLElement>(isMobile, close);

  // No computador, clicar fora do painel fecha o chat; o botão do Gideon já alterna sozinho
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || launcherRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, isMobile, panelRef, setOpen]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(question);
    setQuestion("");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  // No celular o painel cobre o mapa: ao abrir uma fonte, ele recolhe para o destino ficar visível
  const handleOpenSource = (source: GideonSource) => {
    navigate(source.action.path);
    if (isMobile) setOpen(false);
  };

  const handleChoose = (choice: GideonChoice) => ask(choice.question);

  return (
    <>
      {isOpen && (
        <Panel ref={panelRef} id={PANEL_ID} aria-labelledby={TITLE_ID} onKeyDown={handleKeyDown} style={panelStyle}>
          <PanelHeader {...handleProps}>
            {isMobile && <DragHandle aria-hidden="true" />}
            <HeaderIdentity>
              <HeaderAvatar src={gideonIcon} alt="" />
              <span>
                <HeaderTitle id={TITLE_ID}>Sir Gideon Ofnir</HeaderTitle>
                <HeaderSubtitle>
                  {restingLabel ? `Em repouso · volta ${restingLabel}` : "O Onisciente"}
                </HeaderSubtitle>
              </span>
            </HeaderIdentity>
            <HeaderActions>
              {messages.length > 0 && (
                <PillButton type="button" onClick={clearConversation}>
                  Limpar
                </PillButton>
              )}
              <CloseButton type="button" onClick={close} aria-label="Fechar conversa com Gideon">
                <IoClose aria-hidden="true" />
              </CloseButton>
            </HeaderActions>
          </PanelHeader>

          <MessageList role="log" aria-live="polite" aria-label="Conversa com Gideon">
            <IntroBubble>
              Pois bem, Maculado. O que deseja saber?
              {intro && <span>{intro.scope}</span>}
            </IntroBubble>
            {usesAi && (
              <PrivacyNote role="note">
                <IoShieldCheckmarkOutline aria-hidden="true" />
                <span>
                  <strong>Não envie informações pessoais.</strong> As perguntas podem ser processadas por um provedor de IA.
                </span>
              </PrivacyNote>
            )}

            {messages.length === 0 && intro && intro.suggestions.length > 0 && (
              <Suggestions aria-label="Perguntas sugeridas">
                {intro.suggestions.map((suggestion) => (
                  <PillButton key={suggestion} type="button" onClick={() => ask(suggestion)}>
                    {suggestion}
                  </PillButton>
                ))}
              </Suggestions>
            )}

            <MessageItems>
              {messages.map((message) => (
                <GideonMessage
                  key={message.id}
                  message={message}
                  revealing={message.id === revealingMessageId}
                  onRevealed={finishReveal}
                  onOpenSource={handleOpenSource}
                  onChoose={handleChoose}
                />
              ))}
            </MessageItems>

            {isThinking && <ThinkingText>Gideon consulta seus registros…</ThinkingText>}
            <div ref={listEndRef} />
          </MessageList>

          {usesAi && <TurnstileSlot ref={turnstileRef} />}

          <Composer onSubmit={handleSubmit}>
            <ComposerInput
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={MAX_QUESTION_LENGTH}
              placeholder="Pergunte algo ao Gideon..."
              aria-label="Pergunta para Gideon"
            />
            <SendButton type="submit" disabled={!question.trim() || isThinking} aria-label="Enviar pergunta">
              <IoSend aria-hidden="true" />
            </SendButton>
          </Composer>
        </Panel>
      )}

      <Launcher
        ref={launcherRef}
        type="button"
        $hidden={isOpen && isMobile}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? "Fechar conversa com Gideon" : "Consultar Gideon"}
        title="Consultar Gideon"
      >
        <GiCrystalBall aria-hidden="true" />
      </Launcher>
    </>
  );
}
