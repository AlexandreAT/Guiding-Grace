import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { IoBookOutline, IoLocationSharp } from "react-icons/io5";
import {
  ContentContainerStyled,
  ExpandIcon,
  RegionDescription,
  RegionTitle,
  SectionCard,
  SectionContent,
  SectionHeader,
  SectionTitle,
  ContentBlock,
  ContentItemStyled,
  ImageLink,
  ImagePreview,
  ProgressCount,
  ProgressHeader,
  ProgressLabel,
  ProgressSummary,
  TopicCheckbox,
  TrackableTopic,
} from "./styles";
import { getBossByObjective } from "../../data/compendium/bosses";
import { isTrackableItem, type ContentItem, type RegionSection } from "../../data/regionSections";
import { buildBossPath } from "../../routes/compendiumRoute";
import ImageModal from "../ImageModal";
import { PillButton } from "../PillButton";
import ProgressBar from "../ProgressBar";
import SpoilerText from "../SpoilerText";

interface RegionContentProps {
  regionName: string;
  regionDescription: string;
  sections: RegionSection[];
  scrollToLabel?: string | undefined;
  onScrolled?: () => void;
  completedIds: ReadonlySet<string>;
  mappedIds: ReadonlySet<string>;
  onToggleCompleted: (id: string) => void;
  onResetProgress: () => void;
  onLocateOnMap: (id: string) => void;
}

interface HoveredImage {
  src: string;
  x: number;
  y: number;
}

const matchesLabel = (item: ContentItem, label: string) =>
  item.id === label ||
  item.text === label ||
  (item.parts?.some((part) => part.text === label) ?? false);

export default function RegionContent({
  regionName,
  regionDescription,
  sections,
  scrollToLabel,
  onScrolled,
  completedIds,
  mappedIds,
  onToggleCompleted,
  onResetProgress,
  onLocateOnMap,
}: RegionContentProps) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [highlighted, setHighlighted] = useState<{ s: number; i: number } | null>(null);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; src: string } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<HoveredImage | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const trackableIds = sections
    .flatMap((section) => section.content)
    .filter(isTrackableItem)
    .map((item) => item.id);
  const completedCount = trackableIds.filter((id) => completedIds.has(id)).length;

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const handleResetProgress = () => {
    if (window.confirm(`Desmarcar todos os objetivos de ${regionName}?`)) {
      onResetProgress();
    }
  };

  useEffect(() => {
    if (!scrollToLabel) return;

    for (let s = 0; s < sections.length; s++) {
      const idx = sections[s].content.findIndex((item) => matchesLabel(item, scrollToLabel));

      if (idx !== -1) {
        setExpandedSections((prev) => {
          const ns = new Set(prev);
          ns.add(s);
          return ns;
        });

        setTimeout(() => {
          const selector = `[data-section-index="${s}"][data-item-index="${idx}"]`;
          const el = document.querySelector<HTMLElement>(selector);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus({ preventScroll: true });
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

  const renderParts = (parts: NonNullable<ContentItem["parts"]>) =>
    parts.map((p, pi) => {
      if (p.type === 'link') {
        return (
          <a key={pi} href={p.href} target="_blank" rel="noreferrer">{p.text}</a>
        );
      } else if (p.type === 'route' && p.href) {
        return (
          <Link key={pi} to={p.href}>{p.text}</Link>
        );
      } else if (p.type === 'image' && p.src) {
        const src = p.src;
        const handleImageHover = (e: MouseEvent<HTMLButtonElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHoveredImage({
            src,
            x: rect.left,
            y: rect.top - 20,
          });
        };

        return (
          <ImageLink
            key={pi}
            type="button"
            onMouseEnter={handleImageHover}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => setImageModal({ isOpen: true, src })}
          >
            {p.text}
            {hoveredImage?.src === src && (
              <ImagePreview
                src={src}
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
    });

  const renderTrackableTopic = (item: ContentItem & { id: string }) => {
    const isCompleted = completedIds.has(item.id);
    // Chefe com página no Compêndio: estratégia, dados de combate e lore ficam a um clique
    const boss = getBossByObjective(item.id);

    return (
      <TrackableTopic $completed={isCompleted}>
        <TopicCheckbox>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleCompleted(item.id)}
          />
          <span>{item.text}</span>
        </TopicCheckbox>
        {mappedIds.has(item.id) && (
          <PillButton
            type="button"
            onClick={() => onLocateOnMap(item.id)}
            aria-label={`Ver ${item.text ?? "marcação"} no mapa`}
          >
            <IoLocationSharp aria-hidden="true" />
            <span>Ver no mapa</span>
          </PillButton>
        )}
        {boss && (
          <PillButton
            type="button"
            onClick={() => navigate(buildBossPath(boss.id))}
            aria-label={`Abrir a página de ${boss.name} no Compêndio`}
          >
            <IoBookOutline aria-hidden="true" />
            <span>Página do chefe</span>
          </PillButton>
        )}
      </TrackableTopic>
    );
  };

  const renderItem = (item: ContentItem) => {
    if (isTrackableItem(item)) return renderTrackableTopic(item);
    if (item.parts) return renderParts(item.parts);
    return item.text;
  };

  return (
    <>
      <ContentContainerStyled>
        <RegionTitle>{regionName}</RegionTitle>
        <RegionDescription>{regionDescription}</RegionDescription>

        {trackableIds.length > 0 && (
          <ProgressSummary>
            <ProgressHeader>
              <ProgressLabel>Progresso da região</ProgressLabel>
              <ProgressCount>
                {completedCount} de {trackableIds.length} objetivos
              </ProgressCount>
              {completedCount > 0 && (
                <PillButton type="button" onClick={handleResetProgress}>
                  Limpar
                </PillButton>
              )}
            </ProgressHeader>
            <ProgressBar
              completed={completedCount}
              total={trackableIds.length}
              label={`Progresso de ${regionName}`}
            />
          </ProgressSummary>
        )}

        {sections.map((section, index) => {
          const isExpanded = expandedSections.has(index);
          const contentId = `region-section-${index}`;

          return (
            <SectionCard key={index}>
              <SectionHeader
                type="button"
                onClick={() => toggleSection(index)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
              >
                <SectionTitle>{section.title}</SectionTitle>
                <ExpandIcon $isExpanded={isExpanded}><IoIosArrowDown /></ExpandIcon>
              </SectionHeader>
              <SectionContent id={contentId} $isExpanded={isExpanded} hidden={!isExpanded}>
                <ContentBlock>
                  {section.content.map((item, itemIndex) => (
                    <ContentItemStyled
                      key={itemIndex}
                      $contentStyle={item.style}
                      data-section-index={index}
                      data-item-index={itemIndex}
                      tabIndex={-1}
                      data-highlighted={highlighted && highlighted.s === index && highlighted.i === itemIndex ? 'true' : 'false'}
                    >
                      {renderItem(item)}
                    </ContentItemStyled>
                  ))}
                </ContentBlock>
              </SectionContent>
            </SectionCard>
          );
        })}
      </ContentContainerStyled>

      <ImageModal
        isOpen={imageModal?.isOpen ?? false}
        src={imageModal?.src ?? ""}
        onClose={() => setImageModal(null)}
      />
    </>
  );
}
