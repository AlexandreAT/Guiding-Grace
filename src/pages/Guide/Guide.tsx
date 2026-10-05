import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import ImageCarousel from "../../components/ImageCarousel";
import MapLegend from "../../components/MapLegend";
import MapViewer, { type PinFocusRequest } from "../../components/MapViewer";
import type { RegionProgress } from "../../components/RegionCard";
import RegionContent from "../../components/RegionContent";
import Sidebar from "../../components/Sidebar";
import SingleImage from "../../components/SingleImage";
import { getAvailableBuild } from "../../data/navigation";
import { getPinsForRegion, type PinType } from "../../data/regionPins";
import { getSectionsForRegion, getTrackableIdsForRegion } from "../../data/regionSections";
import { useGuideProgress } from "../../hooks/useGuideProgress";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import NotFound from "../NotFound/NotFound";

const TRACKABLE_IDS_BY_REGION = Object.fromEntries(
  REGIONS.map((region) => [region.id, getTrackableIdsForRegion(region.id)]),
);

export default function Guide() {
  const navigate = useNavigate();
  const { buildId } = useParams<{ buildId: string }>();
  const build = getAvailableBuild(buildId);
  const [activeRegionId, setActiveRegionId] = useState<string>(REGIONS[0].id);
  const [pinMode, setPinMode] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollToLabel, setScrollToLabel] = useState<string>();
  const [hiddenPinTypes, setHiddenPinTypes] = useState<ReadonlySet<PinType>>(new Set());
  const [hideCompletedPins, setHideCompletedPins] = useState(false);
  const [focusRequest, setFocusRequest] = useState<PinFocusRequest>();
  const { completedIds, toggleCompleted, resetCompleted } = useGuideProgress(build?.id ?? "");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDevelopment = import.meta.env.DEV;

  const activeRegion =
    REGIONS.find((region) => region.id === activeRegionId) || REGIONS[0];
  const pins = useMemo(() => getPinsForRegion(activeRegionId), [activeRegionId]);
  const regionSections = useMemo(
    () => getSectionsForRegion(activeRegionId),
    [activeRegionId],
  );

  const regionProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TRACKABLE_IDS_BY_REGION).map(([regionId, ids]) => [
          regionId,
          {
            completed: ids.filter((id) => completedIds.has(id)).length,
            total: ids.length,
          },
        ]),
      ) as Record<string, RegionProgress>,
    [completedIds],
  );

  const pinCounts = useMemo(() => {
    const counts: Partial<Record<PinType, number>> = {};
    pins.forEach((pin) => {
      counts[pin.type] = (counts[pin.type] ?? 0) + 1;
    });
    return counts;
  }, [pins]);

  const mappedIds = useMemo(() => new Set(pins.map((pin) => pin.id)), [pins]);

  // O pin pedido em "Ver no mapa" sempre aparece, mesmo que os filtros o escondam
  const visiblePins = useMemo(
    () =>
      pins.filter(
        (pin) =>
          pin.id === focusRequest?.pinId ||
          (!hiddenPinTypes.has(pin.type) &&
            !(hideCompletedPins && completedIds.has(pin.id))),
      ),
    [pins, hiddenPinTypes, hideCompletedPins, completedIds, focusRequest],
  );

  if (!build) {
    return (
      <NotFound
        title="Build não encontrada"
        description="Essa build não existe ou ainda não está disponível."
        actionLabel="Escolher uma build"
        actionRoute="/select/basic-guide"
      />
    );
  }

  const handleRegionSelect = (regionId: string) => {
    if (regionId === activeRegionId) return;
    setIsLoadingMap(true);
    setPinMode(false);
    setFocusRequest(undefined);
    setActiveRegionId(regionId);
  };

  const handleTogglePinType = (type: PinType) => {
    setHiddenPinTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleLocateOnMap = (pinId: string) => {
    setFocusRequest({ pinId, requestId: Date.now() });
  };

  const hasInteractiveMap =
    activeRegionId !== "erdtree" && activeRegionId !== "leyndell-sewers";

  return (
    <PageContainer $regionId={activeRegionId} $isMobile={isMobile}>
      <Header onLogoClick={() => navigate("/")} />

      <MainContent $sidebarOpen={sidebarOpen}>
        <Sidebar
          activeRegionId={activeRegionId}
          onRegionSelect={handleRegionSelect}
          onToggle={setSidebarOpen}
          regionProgress={regionProgress}
        />

        <ContentWrapper>
          <BackButtonLink onClick={() => navigate("/select/basic-guide")}>
            <IoArrowBack /> Voltar para Seleção de Build
          </BackButtonLink>

          <MapSection
            $marginBottom={
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
                  key={activeRegionId}
                  mapImageUrl={`/maps/${activeRegionId}.jpg`}
                  regionName={activeRegion.displayName}
                  pins={isLoadingMap ? [] : visiblePins}
                  pinMode={isDevelopment && pinMode}
                  completedPinIds={completedIds}
                  focusRequest={focusRequest}
                  onPinClick={setScrollToLabel}
                  onImageLoad={() => setIsLoadingMap(false)}
                />
              </MapContainerWrapper>
            )}

            {hasInteractiveMap && pins.length > 0 && (
              <MapLegend
                pinCounts={pinCounts}
                hiddenTypes={hiddenPinTypes}
                hideCompleted={hideCompletedPins}
                onToggleType={handleTogglePinType}
                onShowAllTypes={() => setHiddenPinTypes(new Set())}
                onToggleHideCompleted={() => setHideCompletedPins((current) => !current)}
              />
            )}
          </MapSection>

          <RegionContent
            regionName={activeRegion.displayName}
            regionDescription={activeRegion.description}
            sections={regionSections}
            scrollToLabel={scrollToLabel}
            onScrolled={() => setScrollToLabel(undefined)}
            completedIds={completedIds}
            mappedIds={mappedIds}
            onToggleCompleted={toggleCompleted}
            onResetProgress={() => resetCompleted(TRACKABLE_IDS_BY_REGION[activeRegionId] ?? [])}
            onLocateOnMap={handleLocateOnMap}
          />

          <Footer />
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
