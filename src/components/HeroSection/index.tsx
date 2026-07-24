import { IoArrowBack } from "react-icons/io5";
import { DecorativeDivider } from "../DecorativeDivider";
import {
  BackButton,
  HeroContent,
  HeroRoot,
  HeroSubtitle,
  HeroTitle,
} from "./styles";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backLabel?: string;
  onBack?: () => void;
}

export function HeroSection({
  title,
  subtitle,
  backLabel,
  onBack,
}: HeroSectionProps) {
  return (
    <HeroRoot>
      <HeroContent>
        {backLabel && onBack ? (
          <BackButton type="button" onClick={onBack}>
            <IoArrowBack aria-hidden="true" />
            {backLabel}
          </BackButton>
        ) : null}
        <HeroTitle>{title}</HeroTitle>
        <DecorativeDivider />
        <HeroSubtitle>{subtitle}</HeroSubtitle>
      </HeroContent>
    </HeroRoot>
  );
}
