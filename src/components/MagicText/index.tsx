import { Fragment, useEffect, useRef } from "react";
import { MagicWord, WORD_DURATION_MS } from "./styles";

interface MagicTextProps {
  text: string;
  // Chamado quando a última palavra termina de se formar
  onDone?: () => void;
}

// Gradual sem arrastar: o intervalo entre palavras encolhe em textos longos para o total não passar de ~3 s
const MAX_WORD_STEP_MS = 85;
const TOTAL_STEPS_MS = 3200;
const PARAGRAPH_BREAK = "\n\n";

// Texto do Gideon "escrito ao vento": cada palavra se forma em sequência, parágrafo por parágrafo. Com "reduzir
// movimento" ativo no sistema, o texto aparece direto (styles.ts)
export default function MagicText({ text, onDone }: MagicTextProps) {
  // Cada palavra leva o espaço seguinte, para a quebra de linha continuar natural
  const paragraphs = text.split(PARAGRAPH_BREAK).map((paragraph) => paragraph.match(/\S+\s*/g) ?? []);
  // Posição da primeira palavra de cada parágrafo na sequência inteira
  const starts = paragraphs.map((_, index) =>
    paragraphs.slice(0, index).reduce((total, words) => total + words.length, 0),
  );
  const wordCount = paragraphs.reduce((total, words) => total + words.length, 0);
  const step = Math.min(MAX_WORD_STEP_MS, TOTAL_STEPS_MS / Math.max(wordCount, 1));
  const totalMs = Math.round(Math.max(wordCount - 1, 0) * step) + WORD_DURATION_MS;

  // A função mais recente, sem reiniciar o tempo a cada renderização (ex.: enquanto o jogador digita)
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  // Por tempo, e não por animationend: o fim é avisado mesmo com a aba em segundo plano
  useEffect(() => {
    const timer = window.setTimeout(() => onDoneRef.current?.(), totalMs);
    return () => window.clearTimeout(timer);
  }, [totalMs]);

  return (
    <>
      {paragraphs.map((words, paragraphIndex) => (
        <Fragment key={paragraphIndex}>
          {paragraphIndex > 0 ? PARAGRAPH_BREAK : null}
          {words.map((word, wordIndex) => {
            const position = starts[paragraphIndex] + wordIndex;
            return (
              <MagicWord key={position} $delay={Math.round(position * step)}>
                {word}
              </MagicWord>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}
