import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { ContentContainerStyled, ExpandIcon, RegionDescription, RegionTitle, SectionCard, SectionContent, SectionHeader, SectionTitle, ContentBlock, ContentItemStyled, ImageLink, ImagePreview } from "./styles";
import type { RegionSection } from "../../data/regionSections";
import ImageModal from "../ImageModal";
import SpoilerText from "../SpoilerText";

interface RegionContentProps {
  regionName: string;
  regionDescription: string;
  sections: RegionSection[];
  scrollToLabel?: string | undefined;
  onScrolled?: () => void;
}

interface HoveredImage {
  src: string;
  x: number;
  y: number;
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
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; src: string } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<HoveredImage | null>(null);
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

  useEffect(() => {
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    setHighlighted(null);
  }, [sections, regionName]);

  return (
    <>
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
                    {/* Support inline parts (links and images) if provided, otherwise plain text */}
                    {Array.isArray((item as any).parts) ? (
                      (item as any).parts.map((p: any, pi: number) => {
                        if (p.type === 'link') {
                          return (
                            <a key={pi} href={p.href} target="_blank" rel="noreferrer">{p.text}</a>
                          );
                        } else if (p.type === 'image') {
                          const handleImageHover = (e: React.MouseEvent<HTMLButtonElement>) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredImage({
                              src: p.src,
                              x: rect.left,
                              y: rect.top - 20,
                            });
                          };

                          return (
                            <ImageLink
                              key={pi}
                              onMouseEnter={handleImageHover}
                              onMouseLeave={() => setHoveredImage(null)}
                              onClick={() => setImageModal({ isOpen: true, src: p.src })}
                            >
                              {p.text}
                              {hoveredImage?.src === p.src && hoveredImage && (
                                <ImagePreview
                                  src={p.src}
                                  alt={p.text}
                                  style={{
                                    top: `${hoveredImage.y}px`,
                                    left: `${hoveredImage.x}px`,
                                  }}
                                />
                              )}
                            </ImageLink>
                          );
                        } else if (p.type === 'spoiler') {
                          return (
                            <SpoilerText key={pi} text={p.text} />
                          );
                        }
                        return (
                          <span key={pi}>{p.text}</span>
                        );
                      })
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
      
      <ImageModal
        isOpen={imageModal?.isOpen ?? false}
        src={imageModal?.src ?? ""}
        onClose={() => setImageModal(null)}
      />
    </>
  );
}
