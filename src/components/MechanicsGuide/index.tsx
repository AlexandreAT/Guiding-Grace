import type { ComponentProps } from "react";
import { DecorativeDivider } from "../DecorativeDivider";
import {
  Callout,
  CalloutTitle,
  ComparisonCard,
  ComparisonCardBody,
  ComparisonCardHeader,
  ComparisonGrid,
  ComparisonIcon,
  GuideContent,
  GuideListStyled,
  GuideParagraphStyled,
  HighlightStyled,
  MechanicPanel,
  SectionBody,
  SectionHeading,
  SectionIcon,
  SectionNumber,
  SectionText,
} from "./styles";
import type {
  GuideCalloutProps,
  GuideComparisonCardProps,
  MechanicSectionProps,
} from "./types";

export function MechanicsGuidePage({ children }: ComponentProps<"div">) {
  return <GuideContent>{children}</GuideContent>;
}

export function MechanicSection({
  id,
  number,
  title,
  icon,
  children,
}: MechanicSectionProps) {
  return (
    <MechanicPanel id={id}>
      <SectionIcon aria-hidden="true">{icon}</SectionIcon>
      <SectionBody>
        <SectionHeading>
          <SectionNumber>{number}.</SectionNumber> {title}
        </SectionHeading>
        <DecorativeDivider compact align="start" />
        <SectionText>{children}</SectionText>
      </SectionBody>
    </MechanicPanel>
  );
}

export function GuideCallout({ title, children }: GuideCalloutProps) {
  return (
    <Callout>
      <CalloutTitle>{title}:</CalloutTitle> {children}
    </Callout>
  );
}

export function GuideComparisonGrid({ children }: ComponentProps<"div">) {
  return <ComparisonGrid>{children}</ComparisonGrid>;
}

export function GuideComparisonCard({
  title,
  icon,
  children,
}: GuideComparisonCardProps) {
  return (
    <ComparisonCard>
      <ComparisonCardHeader>
        {icon ? <ComparisonIcon aria-hidden="true">{icon}</ComparisonIcon> : null}
        <h3>{title}</h3>
      </ComparisonCardHeader>
      <ComparisonCardBody>{children}</ComparisonCardBody>
    </ComparisonCard>
  );
}

export const GuideParagraph = GuideParagraphStyled;
export const GuideList = GuideListStyled;
export const Highlight = HighlightStyled;
