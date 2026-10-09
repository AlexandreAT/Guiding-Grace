import { Fragment } from "react";
import type { ContentBlock, ContentTextPart } from "../../data/contentBlocks";
import {
  GuideCallout,
  GuideComparisonCard,
  GuideComparisonGrid,
  GuideList,
  GuideParagraph,
  Highlight,
} from "../MechanicsGuide";
import { CONTENT_ICONS } from "./contentIcons";

interface ContentBlocksProps {
  blocks: ContentBlock[];
}

const renderParts = (parts: ContentTextPart[]) =>
  parts.map((part, index) =>
    part.type === "highlight" ? (
      <Highlight key={index}>{part.text}</Highlight>
    ) : (
      <Fragment key={index}>{part.text}</Fragment>
    ),
  );

const renderBlock = (block: ContentBlock, index: number) => {
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
            <GuideComparisonCard key={card.title} title={card.title} icon={CONTENT_ICONS[card.icon]}>
              {card.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{renderParts(paragraph)}</p>
              ))}
            </GuideComparisonCard>
          ))}
        </GuideComparisonGrid>
      );
  }
};

// Texto dos guias de mecânicas e do Compêndio: o mesmo formato de dados, a mesma apresentação
export default function ContentBlocks({ blocks }: ContentBlocksProps) {
  return <>{blocks.map(renderBlock)}</>;
}
