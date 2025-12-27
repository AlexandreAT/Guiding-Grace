import { useState } from "react";
import { REGIONS } from "../../../shared/const";
import { ContentWrapper, MainContent, MapSection, MapTitle, PageContainer } from "./styles";

export default function Home() {
  const [activeRegionId, setActiveRegionId] = useState<string>(REGIONS[0].id);

  const activeRegion = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  const regionSections = [
    {
      title: "Contexto e Propósito",
      content: `${activeRegion.displayName} é uma região importante em sua jornada. ${activeRegion.description}`,
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Aqui você encontrará informações sobre os pontos principais a explorar. Use a legenda do mapa para identificar locais importantes.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Os objetivos principais desta região incluem explorar as áreas recomendadas, conversar com NPCs importantes e coletar itens essenciais.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Esta região apresenta NPCs interessantes com histórias que se conectam ao universo maior de Elden Ring. Converse com todos os NPCs que encontrar.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Após completar os objetivos principais, você pode explorar livremente ou seguir para a próxima região recomendada.",
    },
  ];

  return (
    <PageContainer>
      {/* <Header onLogoClick={() => setActiveRegionId(REGIONS[0].id)} />

      <MainContent>
        <Sidebar activeRegionId={activeRegionId} onRegionSelect={setActiveRegionId} />

        <ContentWrapper>
          <MapSection>
            <MapTitle>Mapa de {activeRegion.displayName}</MapTitle>
            <MapViewer
              mapImageUrl={`/maps/${activeRegionId}.jpg`}
              regionName={activeRegion.displayName}
            />
            <MapLegend />
          </MapSection>


          <RegionContent
            regionName={activeRegion.displayName}
            regionDescription={activeRegion.description}
            sections={regionSections}
          />
        </ContentWrapper>
      </MainContent> */}
    </PageContainer>
  );
}
