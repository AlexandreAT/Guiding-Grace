import { useState } from "react";
import { ContentContainerStyled, ExpandIcon, RegionDescription, RegionTitle, SectionCard, SectionContent, SectionHeader, SectionText, SectionTitle } from "./styles";

/**
 * RegionContent Component
 * Componente para exibir conteúdo detalhado de uma região com seções expansíveis.
 * Tema: Gótico Minimalista - cards com bordas douradas, revelação progressiva de conteúdo.
 */

interface RegionSection {
  title: string;
  content: string;
}

interface RegionContentProps {
  regionName: string;
  regionDescription: string;
  sections: RegionSection[];
}

export default function RegionContent({
  regionName,
  regionDescription,
  sections,
}: RegionContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <ContentContainerStyled>
      <RegionTitle>{regionName}</RegionTitle>
      <RegionDescription>{regionDescription}</RegionDescription>

      {sections.map((section, index) => (
        <SectionCard key={index}>
          <SectionHeader onClick={() => toggleSection(index)}>
            <SectionTitle>{section.title}</SectionTitle>
            <ExpandIcon isExpanded={expandedSections.has(index)}>▼</ExpandIcon>
          </SectionHeader>
          <SectionContent isExpanded={expandedSections.has(index)}>
            <SectionText>{section.content}</SectionText>
          </SectionContent>
        </SectionCard>
      ))}
    </ContentContainerStyled>
  );
}
