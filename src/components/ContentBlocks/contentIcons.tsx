import type { ReactNode } from "react";
import {
  IconBook,
  IconChartBar,
  IconChecklist,
  IconCoins,
  IconCrown,
  IconDiamond,
  IconFeather,
  IconFlame,
  IconHammer,
  IconLock,
  IconShield,
  IconSkull,
  IconSparkles,
  IconSword,
  IconTool,
} from "@tabler/icons-react";
import type { ContentIcon } from "../../data/contentBlocks";

// Ícones dos blocos de conteúdo (seções das mecânicas e do Compêndio, cards de comparação)
export const CONTENT_ICONS: Record<ContentIcon, ReactNode> = {
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
  crown: <IconCrown />,
  skull: <IconSkull />,
  book: <IconBook />,
  flame: <IconFlame />,
  shield: <IconShield />,
};
