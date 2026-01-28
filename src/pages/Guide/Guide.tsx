import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS } from "../../../shared/const";
import {
  ButtonPin,
  ContentWrapper,
  ImgController,
  MainContent,
  MapSection,
  MapTitle,
  PageContainer,
  BackButtonLink,
  PinControlsContainer,
  PinControlLabel,
  MapContainerWrapper,
  MapLoadingOverlay,
  LoadingContent,
  LoadingSpinner,
  LoadingText,
  ScrollToTopButton,
} from "../Home/styles";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const activeRegion = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  const pins = useMemo(() => getPinsForRegion(activeRegionId), [activeRegionId]);
  const regionSections = useMemo(() => getSectionsForRegion(activeRegionId), [activeRegionId]);
  const [scrollToLabel, setScrollToLabel] = useState<string | undefined>(undefined);

  const mapWidth = "100%";
  const mapHeight = "650px";

  useEffect(() => {
    setIsLoadingMap(true);
  }, [activeRegionId]);

  // Detectar se é mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer regionId={activeRegionId} isMobile={isMobile}>
      <Header onLogoClick={() => navigate("/")} />

      <MainContent sidebarOpen={sidebarOpen}>
        <Sidebar 
          activeRegionId={activeRegionId} 
          onRegionSelect={setActiveRegionId}
          onToggle={setSidebarOpen}
        />

        <ContentWrapper>
          <BackButtonLink onClick={() => navigate("/select/basic-guide")}>
            <IoArrowBack /> Voltar para Seleção de Build
          </BackButtonLink>

          <MapSection marginBottom={`${activeRegionId === 'erdtree' || activeRegionId === 'leyndell-sewers' && '5px'}`}>
            <MapTitle>{activeRegionId !== 'erdtree' && activeRegionId !== 'leyndell-sewers' && "Mapa de " }{activeRegion.displayName}</MapTitle>
            {activeRegionId !== 'erdtree' && activeRegionId !== 'leyndell-sewers' &&
              <PinControlsContainer>
                <ButtonPin onClick={() => setPinMode((s) => !s)}>{pinMode ? 'Desativar modo pin' : 'Ativar modo pin'}</ButtonPin>
                {pinMode && <PinControlLabel>Clique no mapa para copiar coords</PinControlLabel>}
              </PinControlsContainer>
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
              <MapContainerWrapper>
                {isLoadingMap && (
                  <MapLoadingOverlay>
                    <LoadingContent>
                      <LoadingSpinner />
                      <LoadingText>Carregando mapa...</LoadingText>
                    </LoadingContent>
                  </MapLoadingOverlay>
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
              </MapContainerWrapper>
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

      <ScrollToTopButton onClick={handleScrollToTop} title="Voltar ao topo">
        ↑
      </ScrollToTopButton>
    </PageContainer>
  );
}
