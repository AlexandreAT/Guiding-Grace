import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS } from "../../../shared/const";
import { ButtonPin, ContentWrapper, ImgController, MainContent, MapSection, MapTitle, PageContainer } from "../Home/styles";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MapViewer from "../../components/MapViewer";
import RegionContent from "../../components/RegionContent";
import MapLegend from "../../components/MapLegend";
import SingleImage from "../../components/SingleImage";
import ImageCarousel from "../../components/ImageCarousel";
import { getPinsForRegion } from "../../data/regionPins";
import { getSectionsForRegion } from "../../data/regionSections";
import { IoArrowBack } from "react-icons/io5";

export default function Guide() {
  const navigate = useNavigate();
  const [activeRegionId, setActiveRegionId] = useState<string>(REGIONS[0].id);
  const [pinMode, setPinMode] = useState<boolean>(false);
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(false);

  const activeRegion = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  const pins = useMemo(() => getPinsForRegion(activeRegionId), [activeRegionId]);
  const regionSections = useMemo(() => getSectionsForRegion(activeRegionId), [activeRegionId]);
  const [scrollToLabel, setScrollToLabel] = useState<string | undefined>(undefined);

  const mapWidth = "100%";
  const mapHeight = "650px";

  useEffect(() => {
    setIsLoadingMap(true);
  }, [activeRegionId]);

  return (
    <PageContainer>
      <Header onLogoClick={() => navigate("/")} />

      <MainContent>
        <Sidebar activeRegionId={activeRegionId} onRegionSelect={setActiveRegionId} />

        <ContentWrapper>
          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={() => navigate("/select/basic-guide")}
              style={{
                background: "none",
                border: "none",
                color: "#d4af37",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
            >
              <IoArrowBack /> Voltar para Seleção de Build
            </button>
          </div>

          <MapSection marginBottom={`${activeRegionId === 'erdtree' || activeRegionId === 'leyndell-sewers' && '5px'}`}>
            <MapTitle>{activeRegionId !== 'erdtree' && activeRegionId !== 'leyndell-sewers' && "Mapa de " }{activeRegion.displayName}</MapTitle>
            {activeRegionId !== 'erdtree' && activeRegionId !== 'leyndell-sewers' &&
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <ButtonPin onClick={() => setPinMode((s) => !s)}>{pinMode ? 'Desativar modo pin' : 'Ativar modo pin'}</ButtonPin>
                {pinMode && <span style={{ fontSize: 12, color: '#ccc' }}>Clique no mapa para copiar coords</span>}
              </div>
            }
            {activeRegionId === 'erdtree' ? (
              <ImgController>
                <SingleImage imageName={`leyndell-ashen-capital.jpg`} width="80%" height="640px" caption="Leyndell - Ashen Capital" />
              </ImgController>
            ) : activeRegionId === 'leyndell-sewers' ? (
              <ImageCarousel
                images={[
                  { name: 'leyndell-sewers-entrance1.jpg', caption: 'Esgoto - Entrada 1' },
                  { name: 'leyndell-sewers-entrance2.jpg', caption: 'Esgoto - Entrada 2' },
                ]}
                itemWidth="320px"
                itemHeight="220px"
              />
            ) : (
              <>
                {isLoadingMap && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(10, 10, 10, 0.8)',
                      zIndex: 10,
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '3px solid #d4af37',
                          borderTop: '3px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 16px',
                        }}
                      />
                      <p style={{ color: '#d4af37', fontSize: '0.95rem', margin: 0 }}>
                        Carregando mapa...
                      </p>
                    </div>
                  </div>
                )}
                <MapViewer
                  mapImageUrl={`/maps/${activeRegionId}.jpg`}
                  regionName={activeRegion.displayName}
                  pins={isLoadingMap ? [] : pins}
                  pinMode={pinMode}
                  mapWidth={mapWidth}
                  mapHeight={mapHeight}
                  onMapClick={(coords) => console.log('Map click coords:', coords)}
                  onPinClick={(pinId) => {
                    setScrollToLabel(pinId);
                  }}
                  onImageLoad={() => setIsLoadingMap(false)}
                />
              </>
            )}
            {activeRegionId !== 'erdtree' && activeRegionId !== 'leyndell-sewers' &&
              <MapLegend />
            }
          </MapSection>

          <RegionContent
            regionName={activeRegion.displayName}
            regionDescription={activeRegion.description}
            sections={regionSections}
            scrollToLabel={scrollToLabel}
            onScrolled={() => setScrollToLabel(undefined)}
          />
        </ContentWrapper>
      </MainContent>
    </PageContainer>
  );
}
