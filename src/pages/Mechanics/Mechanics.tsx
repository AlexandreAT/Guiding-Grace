import type { ComponentType } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { HeroSection } from "../../components/HeroSection";
import { HomePageContainer, PageContent } from "../Home/styles";
import NotFound from "../NotFound/NotFound";
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
      <NotFound
        title="Guia de mecânica não encontrado"
        description="Esse guia de mecânica não existe ou ainda não foi publicado."
        actionLabel="Ver guias de mecânicas"
        actionRoute="/select/mechanics-guide"
      />
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
      <Footer />
    </HomePageContainer>
  );
}
