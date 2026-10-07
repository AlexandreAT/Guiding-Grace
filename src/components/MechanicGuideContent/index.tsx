import { Fragment } from "react";
import type { ReactNode } from "react";
import {
  IconChartBar,
  IconChecklist,
  IconCoins,
  IconDiamond,
  IconFeather,
  IconHammer,
  IconLock,
  IconSparkles,
  IconSword,
  IconTool,
} from "@tabler/icons-react";
import type {
  MechanicBlock,
  MechanicGuide,
  MechanicIcon,
  MechanicTextPart,
} from "../../data/mechanics/types";
import {
  GuideCallout,
  GuideComparisonCard,
  GuideComparisonGrid,
  GuideList,
  GuideParagraph,
  Highlight,
  MechanicSection,
  MechanicsGuidePage,
} from "../MechanicsGuide";

interface MechanicGuideContentProps {
  guide: MechanicGuide;
}

const MECHANIC_ICONS: Record<MechanicIcon, ReactNode> = {
  sword: <IconSword />,
  chart: <IconChartBar />,
  hammer: <IconHammer />,
  coins: <IconCoins />,
  diamond: <IconDiamond />,
  sparkles: <IconSparkles />,
  feather: <IconFeather />,
  lock: <IconLock />,
  tool: <IconTool />,
  checklist: <IconChecklist />,
};

const renderParts = (parts: MechanicTextPart[]) =>
  parts.map((part, index) =>
    part.type === "highlight" ? (
      <Highlight key={index}>{part.text}</Highlight>
    ) : (
      <Fragment key={index}>{part.text}</Fragment>
    ),
  );

const renderBlock = (block: MechanicBlock, index: number) => {
  switch (block.type) {
    case "paragraph":
      return <GuideParagraph key={index}>{renderParts(block.parts)}</GuideParagraph>;
    case "list":
      return (
        <GuideList key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderParts(item)}</li>
          ))}
        </GuideList>
      );
    case "callout":
      return (
        <GuideCallout key={index} title={block.title}>
          {block.text}
        </GuideCallout>
      );
    case "comparison":
      return (
        <GuideComparisonGrid key={index}>
          {block.cards.map((card) => (
            <GuideComparisonCard key={card.title} title={card.title} icon={MECHANIC_ICONS[card.icon]}>
              {card.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{renderParts(paragraph)}</p>
              ))}
            </GuideComparisonCard>
          ))}
        </GuideComparisonGrid>
      );
  }
};

export default function MechanicGuideContent({ guide }: MechanicGuideContentProps) {
  return (
    <MechanicsGuidePage>
      {guide.sections.map((section, index) => (
        <MechanicSection
          key={section.id}
          id={section.id}
          number={index + 1}
          title={section.title}
          icon={MECHANIC_ICONS[section.icon]}
        >
          {section.blocks.map(renderBlock)}
        </MechanicSection>
      ))}
    </MechanicsGuidePage>
  );
}
