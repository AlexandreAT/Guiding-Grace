import type { ReactNode } from "react";

export interface MechanicSectionProps {
  id?: string;
  number: number;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export interface GuideCalloutProps {
  title: string;
  children: ReactNode;
}

export interface GuideComparisonCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}
