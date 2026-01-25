/**
 * RegionCard Component
 * Card para exibir informações de uma região.
 * Tema: Gótico Minimalista - bordas douradas, hover com brilho sutil.
 */

import React from "react";
import { CardStyled, RegionIcon, RegionText, RegionName, RegionNumber, RegionIconContainer, RegionContentContainer } from "./styles";

type IconProp = string | React.ComponentType<any>;

interface RegionCardProps {
  regionName: string;
  regionNumber: number;
  recommendedLevel: string;
  icon: IconProp;
  isActive?: boolean;
  onClick: () => void;
}

export default function RegionCard({
  regionName,
  regionNumber,
  recommendedLevel,
  icon,
  isActive,
  onClick,
}: RegionCardProps) {
  const isStringIcon = typeof icon === "string";

  return (
    <CardStyled isActive={isActive} onClick={onClick}>
      <RegionIconContainer>
        {isStringIcon ? (
          <RegionIcon className={`ra ${icon as string}`} />
        ) : (
          <RegionIcon as={icon as React.ComponentType<any>} />
        )}
        <RegionContentContainer>
          <RegionName>
            <RegionText color="white"><RegionNumber>{regionNumber}.</RegionNumber>{regionName}</RegionText>
          </RegionName>
          <RegionText size="0.875rem">Nível Recomendado: {recommendedLevel}</RegionText>
        </RegionContentContainer>
      </RegionIconContainer>
    </CardStyled>
  );
}
