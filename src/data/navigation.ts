import blockedCrownIcon from "../assets/crown-icon-block-transparent.png";
import crownIcon from "../assets/crown-icon-transparent.png";
import daggerIcon from "../assets/dagger-icon-transparent.png";
import gearIcon from "../assets/gear-icon-transparent.png";
import swordIcon from "../assets/sword-icon-transparent.png";

export interface NavigationOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  disabled?: boolean;
  status?: string;
}

export interface SelectionCategory {
  title: string;
  subtitle: string;
  items: NavigationOption[];
}

export const MAIN_CATEGORIES: NavigationOption[] = [
  {
    id: "basic-guide",
    title: "Guia Básico",
    description: "Escolha uma build e comece sua jornada",
    icon: swordIcon,
    route: "/select/basic-guide",
  },
  {
    id: "mechanics-guide",
    title: "Guia de Mecânicas",
    description: "Entenda os sistemas do jogo",
    icon: gearIcon,
    route: "/select/mechanics-guide",
  },
  {
    id: "compendium",
    title: "Compêndio",
    description: "Chefes e lore das Terras Intermédias",
    icon: crownIcon,
    route: "/select/compendium",
  },
  {
    id: "platinum-guide",
    title: "Guia Platina",
    description: "Roteiro completo para a platina/1000G",
    icon: blockedCrownIcon,
    disabled: true,
    status: "Em breve",
  },
];

export const SELECTIONS: Record<string, SelectionCategory> = {
  "basic-guide": {
    title: "Escolha sua Build",
    subtitle: "Selecione uma build para começar o guia de progressão",
    items: [
      {
        id: "quality-build",
        title: "Build de Qualidade",
        description: "FOR + DES - Versátil e com boa sustentação de combate",
        icon: swordIcon,
        route: "/guide/quality-build",
      },
      {
        id: "dexterity-build",
        title: "Build de Destreza",
        description: "DEX - Rápida e com alto dano",
        icon: daggerIcon,
        route: "/guide/dexterity-build",
        disabled: true,
        status: "Em breve",
      },
    ],
  },
  "mechanics-guide": {
    title: "Guias de Mecânicas",
    subtitle: "Aprenda os sistemas do jogo em detalhes separadamente",
    items: [
      {
        id: "weapons",
        title: "Sistema de Armas",
        description: "Progressão, tipos e aprimoramentos",
        icon: daggerIcon,
        route: "/mechanics/weapons",
      },
    ],
  },
  compendium: {
    title: "Compêndio",
    subtitle: "Chefes e lore em textos curtos, sem spoilers além do seu progresso",
    items: [
      {
        id: "bosses",
        title: "Chefes",
        description: "Estratégia, dados de combate e história",
        icon: swordIcon,
        route: "/bosses",
      },
      {
        id: "lore",
        title: "Lore",
        description: "Conceitos, eventos e personagens",
        icon: crownIcon,
        route: "/lore",
      },
    ],
  },
};

export const getAvailableBuild = (buildId?: string): NavigationOption | undefined =>
  SELECTIONS["basic-guide"].items.find((build) => build.id === buildId && !build.disabled);

export const getAvailableBuilds = (): NavigationOption[] =>
  SELECTIONS["basic-guide"].items.filter((build) => !build.disabled);
