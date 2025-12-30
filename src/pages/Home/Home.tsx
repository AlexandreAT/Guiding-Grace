import { useState, useMemo } from "react";
import { REGIONS } from "../../../shared/const";
import { ButtonPin, ContentWrapper, MainContent, MapSection, MapTitle, PageContainer } from "./styles";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MapViewer from "../../components/MapViewer";
import RegionContent from "../../components/RegionContent";
import MapLegend from "../../components/MapLegend";
import { getPinsForRegion } from "../../data/regionPins";
import { getSectionsForRegion } from "../../data/regionSections";

export default function Home() {
  const [activeRegionId, setActiveRegionId] = useState<string>(REGIONS[0].id);
  const [pinMode, setPinMode] = useState<boolean>(false);

  const activeRegion = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  const pins = useMemo(() => getPinsForRegion(activeRegionId), [activeRegionId]);
  const regionSections = useMemo(() => getSectionsForRegion(activeRegionId), [activeRegionId]);

  return (
    <PageContainer>
      <Header onLogoClick={() => setActiveRegionId(REGIONS[0].id)} />

      <MainContent>
        <Sidebar activeRegionId={activeRegionId} onRegionSelect={setActiveRegionId} />

        <ContentWrapper>
          <MapSection>
            <MapTitle>Mapa de {activeRegion.displayName}</MapTitle>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <ButtonPin onClick={() => setPinMode((s) => !s)}>{pinMode ? 'Desativar modo pin' : 'Ativar modo pin'}</ButtonPin>
              {pinMode && <span style={{ fontSize: 12, color: '#ccc' }}>Clique no mapa para copiar coords</span>}
            </div>
            <MapViewer
              mapImageUrl={`/maps/${activeRegionId}.jpg`}
              regionName={activeRegion.displayName}
              pins={pins}
              pinMode={pinMode}
              onMapClick={(coords) => console.log('Map click coords:', coords)}
            />
            <MapLegend />
          </MapSection>

          <RegionContent
            regionName={activeRegion.displayName}
            regionDescription={activeRegion.description}
            sections={regionSections}
          />
        </ContentWrapper>
      </MainContent>
    </PageContainer>
  );
}
