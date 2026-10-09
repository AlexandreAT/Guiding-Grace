import type { MechanicGuide } from "../../data/mechanics/types";
import ContentBlocks from "../ContentBlocks";
import { CONTENT_ICONS } from "../ContentBlocks/contentIcons";
import { MechanicSection, MechanicsGuidePage } from "../MechanicsGuide";

interface MechanicGuideContentProps {
  guide: MechanicGuide;
}

export default function MechanicGuideContent({ guide }: MechanicGuideContentProps) {
  return (
    <MechanicsGuidePage>
      {guide.sections.map((section, index) => (
        <MechanicSection
          key={section.id}
          id={section.id}
          number={index + 1}
          title={section.title}
          icon={CONTENT_ICONS[section.icon]}
        >
          <ContentBlocks blocks={section.blocks} />
        </MechanicSection>
      ))}
    </MechanicsGuidePage>
  );
}
