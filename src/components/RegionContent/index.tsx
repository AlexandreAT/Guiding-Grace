import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { ContentContainerStyled, ExpandIcon, RegionDescription, RegionTitle, SectionCard, SectionContent, SectionHeader, SectionTitle, ContentBlock, ContentItemStyled } from "./styles";
import type { RegionSection } from "../../data/regionSections";

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
            <ExpandIcon isExpanded={expandedSections.has(index)}><IoIosArrowDown /></ExpandIcon>
          </SectionHeader>
          <SectionContent isExpanded={expandedSections.has(index)}>
            <ContentBlock>
              {section.content.map((item, itemIndex) => (
                <ContentItemStyled key={itemIndex} contentStyle={item.style}>
                  {item.text}
                </ContentItemStyled>
              ))}
            </ContentBlock>
          </SectionContent>
        </SectionCard>
      ))}
    </ContentContainerStyled>
  );
}
