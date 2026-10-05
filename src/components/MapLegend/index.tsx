import type { IconType } from "react-icons";
import { MAP_LEGEND } from "../../../shared/const";
import type { PinType } from "../../data/regionPins";
import { PillButton } from "../PillButton";
import {
  LegendActions,
  LegendContainerStyled,
  LegendCount,
  LegendGrid,
  LegendHeader,
  LegendHint,
  LegendIcon,
  LegendItem,
  LegendLabel,
  LegendTitle,
} from "./styles";

interface MapLegendProps {
  pinCounts: Partial<Record<PinType, number>>;
  hiddenTypes: ReadonlySet<PinType>;
  hideCompleted: boolean;
  onToggleType: (type: PinType) => void;
  onShowAllTypes: () => void;
  onToggleHideCompleted: () => void;
}

const LEGEND_ENTRIES = Object.entries(MAP_LEGEND) as [PinType, (typeof MAP_LEGEND)[PinType]][];

const renderIcon = (icon: string | IconType, color: string) => {
  if (typeof icon === "string") {
    return <LegendIcon color={color} className={`ra ${icon}`} aria-hidden="true" />;
  }

  return <LegendIcon as={icon} color={color} aria-hidden="true" />;
};

export default function MapLegend({
  pinCounts,
  hiddenTypes,
  hideCompleted,
  onToggleType,
  onShowAllTypes,
  onToggleHideCompleted,
}: MapLegendProps) {
  return (
    <LegendContainerStyled>
      <LegendHeader>
        <LegendTitle>Legenda do Mapa</LegendTitle>
        <LegendActions>
          {hiddenTypes.size > 0 && (
            <PillButton type="button" onClick={onShowAllTypes}>
              Mostrar todos
            </PillButton>
          )}
          <PillButton
            type="button"
            aria-pressed={hideCompleted}
            $active={hideCompleted}
            onClick={onToggleHideCompleted}
          >
            Ocultar concluídos
          </PillButton>
        </LegendActions>
      </LegendHeader>
      <LegendHint>Clique em uma categoria para mostrar ou ocultar suas marcações no mapa.</LegendHint>

      <LegendGrid>
        {LEGEND_ENTRIES.map(([type, item]) => {
          const count = pinCounts[type] ?? 0;
          const isHidden = hiddenTypes.has(type);

          return (
            <LegendItem
              key={type}
              type="button"
              color={item.color}
              $hidden={isHidden}
              disabled={count === 0}
              aria-pressed={!isHidden}
              aria-label={`${item.label}: ${count} no mapa${isHidden ? ", oculto" : ""}`}
              onClick={() => onToggleType(type)}
            >
              {renderIcon(item.icon, item.color)}
              <LegendLabel $hidden={isHidden}>{item.label}</LegendLabel>
              <LegendCount aria-hidden="true">{count}</LegendCount>
            </LegendItem>
          );
        })}
      </LegendGrid>
    </LegendContainerStyled>
  );
}
