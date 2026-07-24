import { DecorativeDivider } from "../DecorativeDivider";
import {
  CardDescription,
  CardIcon,
  CardRoot,
  CardStatus,
  CardTitle,
} from "./styles";

export interface NavigationCardProps {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  status?: string;
  onClick?: () => void;
}

export function NavigationCard({
  title,
  description,
  icon,
  disabled = false,
  status,
  onClick,
}: NavigationCardProps) {
  return (
    <CardRoot
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <CardIcon src={icon} alt="" aria-hidden="true" />
      <CardTitle>{title}</CardTitle>
      <DecorativeDivider compact />
      <CardDescription>{description}</CardDescription>
      {status ? <CardStatus>{status}</CardStatus> : null}
    </CardRoot>
  );
}
