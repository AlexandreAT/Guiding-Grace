import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { MECHANIC_SECTION_PARAM } from "../routes/guideRoute";

// ?section= leva direto a uma seção (usado pelas fontes citadas pelo Gideon); a key refaz o scroll a cada navegação
export function useScrollToSection(sectionIds: readonly string[]) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sectionId = searchParams.get(MECHANIC_SECTION_PARAM);
  const isKnownSection = sectionId !== null && sectionIds.includes(sectionId);

  useEffect(() => {
    if (!sectionId || !isKnownSection) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sectionId, isKnownSection, location.key]);
}
