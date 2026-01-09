import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { ContentContainerStyled, ExpandIcon, RegionDescription, RegionTitle, SectionCard, SectionContent, SectionHeader, SectionTitle, ContentBlock, ContentItemStyled } from "./styles";
import type { RegionSection } from "../../data/regionSections";

interface RegionContentProps {
  regionName: string;
  regionDescription: string;
  sections: RegionSection[];
  scrollToLabel?: string | undefined;
  onScrolled?: () => void;
}

export default function RegionContent({
  regionName,
  regionDescription,
  sections,
  scrollToLabel,
  onScrolled,
}: RegionContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [highlighted, setHighlighted] = useState<{ s: number; i: number } | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  useEffect(() => {
    if (!scrollToLabel) return;

    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s];
      const idx = sec.content.findIndex((it: any) => {
        // First prefer matching by id (recommended)
        if (typeof it.id === 'string' && it.id === scrollToLabel) return true;
        if (typeof it.text === 'string' && it.text === scrollToLabel) return true;
        if (Array.isArray(it.parts)) {
          return it.parts.some((p: any) => (p.text === scrollToLabel));
        }
        return false;
      });

      if (idx !== -1) {
        setExpandedSections((prev) => {
          const ns = new Set(prev);
          ns.add(s);
          return ns;
        });

        setTimeout(() => {
          const selector = `[data-section-index="${s}"][data-item-index="${idx}"]`;
          const el = document.querySelector(selector) as HTMLElement | null;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus?.();
            // set temporary highlight for 5s
            setHighlighted({ s, i: idx });
            if (highlightTimerRef.current) {
              window.clearTimeout(highlightTimerRef.current);
            }
            highlightTimerRef.current = window.setTimeout(() => {
              setHighlighted(null);
              highlightTimerRef.current = null;
            }, 5000);

            if (onScrolled) onScrolled();
          }
        }, 220);

        break;
      }
    }
  
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    };
  }, [scrollToLabel, sections, onScrolled]);

  // Clear any active highlight when the sections or region change
  useEffect(() => {
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    setHighlighted(null);
  }, [sections, regionName]);

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
                <ContentItemStyled
                  key={itemIndex}
                  contentStyle={(item as any).style}
                  data-section-index={index}
                  data-item-index={itemIndex}
                  tabIndex={-1}
                  data-highlighted={highlighted && highlighted.s === index && highlighted.i === itemIndex ? 'true' : 'false'}
                >
                  {/* Support inline parts (links) if provided, otherwise plain text */}
                  {Array.isArray((item as any).parts) ? (
                    (item as any).parts.map((p: any, pi: number) => (
                      p.type === 'link' ? (
                        <a key={pi} href={p.href} target="_blank" rel="noreferrer">{p.text}</a>
                      ) : (
                        <span key={pi}>{p.text}</span>
                      )
                    ))
                  ) : (
                    (item as any).text
                  )}
                </ContentItemStyled>
              ))}
            </ContentBlock>
          </SectionContent>
        </SectionCard>
      ))}
    </ContentContainerStyled>
  );
}
