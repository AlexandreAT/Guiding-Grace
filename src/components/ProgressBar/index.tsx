import { ProgressFill, ProgressTrack } from "./styles";

interface ProgressBarProps {
  completed: number;
  total: number;
  label: string;
  compact?: boolean;
}

export default function ProgressBar({ completed, total, label, compact = false }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <ProgressTrack
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${completed} de ${total} (${percent}%)`}
      $compact={compact}
    >
      <ProgressFill $percent={percent} $complete={total > 0 && completed === total} />
    </ProgressTrack>
  );
}
