import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PillButton } from "../PillButton";
import { Tag, TagRow } from "../Compendium/styles";
import {
  HubCard,
  HubCardText,
  HubCardTitle,
  HubGrid,
  HubGroup,
  HubGroupTitle,
  HubRoot,
  LockedCard,
} from "./styles";

export interface HubEntry {
  id: string;
  title: string;
  description: string;
  tag?: string;
  path: string;
  // O jogador ainda não chegou lá: nem o nome aparece, a menos que ele peça
  locked: boolean;
}

export interface HubGroupData {
  id: string;
  title: string;
  entries: HubEntry[];
}

interface CompendiumHubProps {
  groups: HubGroupData[];
}

// Lista de chefes ou artigos, agrupada; o que está à frente na jornada aparece oculto, com a opção de revelar
export default function CompendiumHub({ groups }: CompendiumHubProps) {
  const navigate = useNavigate();
  const [revealedIds, setRevealedIds] = useState<ReadonlySet<string>>(new Set());

  const reveal = (id: string) => setRevealedIds((current) => new Set([...current, id]));

  return (
    <HubRoot>
      {groups.map((group) => (
        <HubGroup key={group.id} aria-labelledby={`hub-group-${group.id}`}>
          <HubGroupTitle id={`hub-group-${group.id}`}>{group.title}</HubGroupTitle>
          <HubGrid>
            {group.entries.map((entry) => (
              <li key={entry.id}>
                {entry.locked && !revealedIds.has(entry.id) ? (
                  <LockedCard>
                    <HubCardTitle>Conteúdo à frente na sua jornada</HubCardTitle>
                    <HubCardText>O nome fica oculto até você chegar lá, para não estragar a descoberta.</HubCardText>
                    <PillButton type="button" onClick={() => reveal(entry.id)}>
                      Mostrar mesmo assim
                    </PillButton>
                  </LockedCard>
                ) : (
                  <HubCard type="button" onClick={() => navigate(entry.path)}>
                    <HubCardTitle>{entry.title}</HubCardTitle>
                    {entry.tag ? (
                      <TagRow>
                        <Tag $tone="muted">{entry.tag}</Tag>
                      </TagRow>
                    ) : null}
                    <HubCardText>{entry.description}</HubCardText>
                  </HubCard>
                )}
              </li>
            ))}
          </HubGrid>
        </HubGroup>
      ))}
    </HubRoot>
  );
}
