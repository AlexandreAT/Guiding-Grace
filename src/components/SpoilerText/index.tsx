import { useState } from "react";
import { SpoilerWrapper, SpoilerOverlay } from "./styles";

interface SpoilerTextProps {
  text: string;
}

export default function SpoilerText({ text }: SpoilerTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <SpoilerWrapper onClick={() => setIsRevealed(!isRevealed)} $isRevealed={isRevealed}>
      {text}
      {!isRevealed && <SpoilerOverlay />}
    </SpoilerWrapper>
  );
}
