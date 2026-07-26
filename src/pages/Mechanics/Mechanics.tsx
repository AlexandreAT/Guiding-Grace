import type { ComponentType } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { EmptyState, HomePageContainer, PageContent } from "../Home/styles";
import WeaponProgression from "../Info/pages/WeaponProgression";

interface MechanicsPageDefinition {
  title: string;
  subtitle: string;
  Component: ComponentType;
}

const MECHANICS_PAGES: Record<string, MechanicsPageDefinition> = {
  weapons: {
    title: "Sistema de Armas",
    subtitle: "Progressão, tipos e aprimoramentos em Elden Ring",
    Component: WeaponProgression,
  },
};

export default function Mechanics() {
  const { mechanicId } = useParams<{ mechanicId: string }>();
  const navigate = useNavigate();
  const mechanic = mechanicId ? MECHANICS_PAGES[mechanicId] : undefined;

  if (!mechanic) {
    return (
      <HomePageContainer>
        <Header onLogoClick={() => navigate("/")} />
        <main>
          <PageContent>
            <EmptyState>
              <h1>Guia de mecânica não encontrado</h1>
              <button type="button" onClick={() => navigate("/")}>
                Voltar ao início
              </button>
            </EmptyState>
          </PageContent>
        </main>
      </HomePageContainer>
    );
  }

  const { Component } = mechanic;

  return (
    <HomePageContainer>
      <Header onLogoClick={() => navigate("/")} />
      <main>
        <HeroSection
          title={mechanic.title}
          subtitle={mechanic.subtitle}
          backLabel="Voltar aos Guias de Mecânicas"
          onBack={() => navigate("/select/mechanics-guide")}
        />
        <PageContent>
          <Component />
        </PageContent>
      </main>
    </HomePageContainer>
  );
}
