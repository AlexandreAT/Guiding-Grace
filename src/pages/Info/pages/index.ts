import type { ReactNode } from 'react';
import WeaponProgression from './WeaponProgression/index';

export interface InfoPageConfig {
  id: string;
  title: string;
  description: string;
  component: () => ReactNode;
  icon?: string;
}

export const INFO_PAGES: Record<string, InfoPageConfig> = {
  'weapon-progression': {
    id: 'weapon-progression',
    title: 'Progressão de Armas',
    description: 'Guia completo sobre como aprimorar e escolher armas em Elden Ring',
    component: WeaponProgression,
  },
};

export const getInfoPage = (pageId: string): InfoPageConfig | null => {
  return INFO_PAGES[pageId] || null;
};

export const getAllInfoPages = (): InfoPageConfig[] => {
  return Object.values(INFO_PAGES);
};
