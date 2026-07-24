import { CenterMark, DividerLine, DividerRoot } from "./styles";

interface DecorativeDividerProps {
  compact?: boolean;
}

export function DecorativeDivider({ compact = false }: DecorativeDividerProps) {
  return (
    <DividerRoot $compact={compact} aria-hidden="true">
      <DividerLine />
      <CenterMark />
      <DividerLine />
    </DividerRoot>
  );
}
