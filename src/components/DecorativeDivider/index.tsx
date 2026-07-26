import { CenterMark, DividerLine, DividerRoot } from "./styles";

interface DecorativeDividerProps {
  compact?: boolean;
  align?: "center" | "start";
}

export function DecorativeDivider({
  compact = false,
  align = "center",
}: DecorativeDividerProps) {
  return (
    <DividerRoot $compact={compact} $align={align} aria-hidden="true">
      <DividerLine />
      <CenterMark />
      <DividerLine />
    </DividerRoot>
  );
}
