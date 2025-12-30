import { MAP_LEGEND } from "../../../shared/const";
import { LegendContainerStyled, LegendGrid, LegendIcon, LegendItem, LegendLabel, LegendTitle } from "./styles";

/**
 * MapLegend Component
 * Componente para exibir a legenda de marcações do mapa.
 * Tema: Gótico Minimalista - layout limpo com ícones temáticos.
 */

export default function MapLegend() {
  const renderIcon = (icon: string | React.ComponentType<any>, color: string) => {
    const isStringIcon = typeof icon === "string";

    if (isStringIcon) {
      return <LegendIcon color={color} className={`ra ${icon as string}`} />;
    }

    const IconComponent = icon as React.ComponentType<any>;
    return <LegendIcon as={IconComponent} color={color} style={{ color }} />;
  };

  return (
    <LegendContainerStyled>
      <LegendTitle>Legenda do Mapa</LegendTitle>
      <LegendGrid>
        {Object.entries(MAP_LEGEND).map(([key, item]) => (
          <LegendItem key={key} color={item.color}>
            {renderIcon(item.icon as string | React.ComponentType<any>, item.color)}
            <LegendLabel>{item.label}</LegendLabel>
          </LegendItem>
        ))}
      </LegendGrid>
    </LegendContainerStyled>
  );
}
