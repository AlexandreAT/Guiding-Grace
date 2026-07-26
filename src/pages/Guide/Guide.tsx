import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { REGIONS } from "../../../shared/const";
import {
  BackButtonLink,
  ButtonPin,
  ContentWrapper,
  ImgController,
  LoadingContent,
  LoadingSpinner,
  LoadingText,
  MainContent,
  MapContainerWrapper,
  MapLoadingOverlay,
  MapSection,
  MapTitle,
  PageContainer,
  PinControlLabel,
  PinControlsContainer,
  ScrollToTopButton,
} from "../Home/styles";
import { Header } from "../../components/Header";
import ImageCarousel from "../../components/ImageCarousel";
import MapLegend from "../../components/MapLegend";
import MapViewer from "../../components/MapViewer";
import RegionContent from "../../components/RegionContent";
import Sidebar from "../../components/Sidebar";
import SingleImage from "../../components/SingleImage";
import { getPinsForRegion } from "../../data/regionPins";
import { getSectionsForRegion } from "../../data/regionSections";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function Guide() {
  const navigate = useNavigate();
  const [activeRegionId, setActiveRegionId] = useState<string>(REGIONS[0].id);
  const [pinMode, setPinMode] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollToLabel, setScrollToLabel] = useState<string>();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDevelopment = import.meta.env.DEV;

  const activeRegion =
    REGIONS.find((region) => region.id === activeRegionId) || REGIONS[0];
  const pins = useMemo(() => getPinsForRegion(activeRegionId), [activeRegionId]);
  const regionSections = useMemo(
    () => getSectionsForRegion(activeRegionId),
    [activeRegionId],
  );

  const handleRegionSelect = (regionId: string) => {
    if (regionId === activeRegionId) return;
    setIsLoadingMap(true);
    setPinMode(false);
    setActiveRegionId(regionId);
  };

  const hasInteractiveMap =
    activeRegionId !== "erdtree" && activeRegionId !== "leyndell-sewers";

  return (
    <PageContainer regionId={activeRegionId} isMobile={isMobile}>
      <Header onLogoClick={() => navigate("/")} />

      <MainContent sidebarOpen={sidebarOpen}>
        <Sidebar
          activeRegionId={activeRegionId}
          onRegionSelect={handleRegionSelect}
          onToggle={setSidebarOpen}
        />

        <ContentWrapper>
          <BackButtonLink onClick={() => navigate("/select/basic-guide")}>
            <IoArrowBack /> Voltar para Seleção de Build
          </BackButtonLink>

          <MapSection
            marginBottom={
              activeRegionId === "erdtree" ||
              activeRegionId === "leyndell-sewers"
                ? "5px"
                : undefined
            }
          >
            <MapTitle>
              {hasInteractiveMap && "Mapa de "}
              {activeRegion.displayName}
            </MapTitle>

            {isDevelopment && hasInteractiveMap && (
              <PinControlsContainer>
                <ButtonPin onClick={() => setPinMode((current) => !current)}>
                  {pinMode ? "Desativar modo pin" : "Ativar modo pin"}
                </ButtonPin>
                {pinMode && (
                  <PinControlLabel>
                    Clique no mapa para copiar coordenadas
                  </PinControlLabel>
                )}
              </PinControlsContainer>
            )}

            {activeRegionId === "erdtree" ? (
              <ImgController>
                <SingleImage
                  imageName="leyndell-ashen-capital.jpg"
                  width="80%"
                  height="640px"
                  caption="Leyndell - Ashen Capital"
                />
              </ImgController>
            ) : activeRegionId === "leyndell-sewers" ? (
              <ImageCarousel
                images={[
                  {
                    name: "leyndell-sewers-entrance1.jpg",
                    caption: "Esgoto - Entrada 1",
                  },
                  {
                    name: "leyndell-sewers-entrance2.jpg",
                    caption: "Esgoto - Entrada 2",
                  },
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
                  pinMode={isDevelopment && pinMode}
                  mapWidth="100%"
                  mapHeight="650px"
                  onPinClick={setScrollToLabel}
                  onImageLoad={() => setIsLoadingMap(false)}
                />
              </MapContainerWrapper>
            )}

            {hasInteractiveMap && <MapLegend />}
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

      <ScrollToTopButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Voltar ao topo"
      >
        ↑
      </ScrollToTopButton>
    </PageContainer>
  );
}
