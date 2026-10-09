import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IoEyeOffOutline } from "react-icons/io5";
import type { ContentIcon } from "../../data/contentBlocks";
import {
  DAMAGE_LABELS,
  STATUS_LABELS,
  formatHp,
  formatNumber,
  formatStatusResistance,
  getWeakestDamageTypes,
} from "../../data/compendium/gameDataText";
import { getCreditSource } from "../../data/compendium/credits";
import { CERTAINTY_LABELS } from "../../data/compendium/labels";
import type { BossGameData, Certainty, DamageType, StatusEffect } from "../../data/compendium/types";
import { CREDITS_PATH } from "../../routes/compendiumRoute";
import { CONTENT_ICONS } from "../ContentBlocks/contentIcons";
import { MechanicSection, MechanicsGuidePage } from "../MechanicsGuide";
import { PillButton } from "../PillButton";
import {
  RelatedList,
  RevealedTag,
  SourceNote,
  SpoilerNoticeRoot,
  SpoilerNoticeText,
  Stat,
  StatGrid,
  StatGroupTitle,
  Tag,
  TagRow,
} from "./styles";

interface SpoilerNoticeProps {
  title?: string;
  reason: string;
  onReveal: () => void;
}

// Bloqueio por progresso: a escolha de revelar é do jogador e vale só para esta tela (não libera o Gideon)
export function SpoilerNotice({ title = "Este trecho está além do seu progresso atual", reason, onReveal }: SpoilerNoticeProps) {
  return (
    <SpoilerNoticeRoot role="note">
      <IoEyeOffOutline aria-hidden="true" />
      <SpoilerNoticeText>
        <strong>{title}</strong>
        <span>{reason} Ele fica oculto para não estragar a sua descoberta.</span>
      </SpoilerNoticeText>
      <PillButton type="button" onClick={onReveal}>
        Mostrar mesmo assim
      </PillButton>
    </SpoilerNoticeRoot>
  );
}

export function CertaintyTag({ certainty }: { certainty: Certainty }) {
  return <Tag $tone={certainty === "explicit" ? "gold" : "muted"}>{CERTAINTY_LABELS[certainty]}</Tag>;
}

export interface CompendiumPanel {
  id: string;
  title: string;
  icon: ContentIcon;
  certainty?: Certainty;
  // Motivo do bloqueio; ausente quando o jogador já pode ver a seção
  lockReason?: string;
  content: ReactNode;
}

interface CompendiumPanelsProps {
  panels: CompendiumPanel[];
  isRevealed: (panelId: string) => boolean;
  onReveal: (panelId: string) => void;
  children?: ReactNode;
}

// Seções de uma página do Compêndio com o mesmo visual das Mecânicas; cada uma respeita o próprio gate
export function CompendiumPanels({ panels, isRevealed, onReveal, children }: CompendiumPanelsProps) {
  return (
    <MechanicsGuidePage>
      {children}
      {panels.map((panel, index) => {
        const locked = panel.lockReason !== undefined && !isRevealed(panel.id);
        return (
          <MechanicSection
            key={panel.id}
            id={panel.id}
            number={index + 1}
            title={panel.title}
            icon={CONTENT_ICONS[panel.icon]}
          >
            {panel.certainty && !locked ? (
              <TagRow>
                <CertaintyTag certainty={panel.certainty} />
              </TagRow>
            ) : null}
            {panel.lockReason !== undefined && !locked ? <RevealedTag>Spoiler revelado por você</RevealedTag> : null}
            {locked ? (
              <SpoilerNotice reason={panel.lockReason ?? ""} onReveal={() => onReveal(panel.id)} />
            ) : (
              panel.content
            )}
          </MechanicSection>
        );
      })}
    </MechanicsGuidePage>
  );
}

export interface RelatedEntry {
  key: string;
  label: string;
  path: string;
}

export function RelatedEntries({ entries }: { entries: RelatedEntry[] }) {
  return (
    <RelatedList>
      {entries.map((entry) => (
        <li key={entry.key}>
          <PillButton as={Link} to={entry.path}>
            {entry.label}
          </PillButton>
        </li>
      ))}
    </RelatedList>
  );
}

const DAMAGE_TYPES = Object.keys(DAMAGE_LABELS) as DamageType[];
const STATUS_EFFECTS = Object.keys(STATUS_LABELS) as StatusEffect[];

// Dados objetivos importados (ver content:import), com a fonte de cada número
export function BossCombatData({ data }: { data: BossGameData }) {
  const weakest = new Set(getWeakestDamageTypes(data));
  const source = getCreditSource(data.provenance.source);

  return (
    <>
      <StatGrid>
        {data.hp.length > 0 ? (
          <Stat>
            <dt>HP</dt>
            <dd>{formatHp(data.hp)}</dd>
          </Stat>
        ) : null}
        {data.runes !== undefined ? (
          <Stat>
            <dt>Runas ao derrotar</dt>
            <dd>{formatNumber(data.runes)}</dd>
          </Stat>
        ) : null}
      </StatGrid>

      <StatGroupTitle>Absorção de dano</StatGroupTitle>
      <p>Quanto menor a absorção, mais dano ele sofre. Em destaque, as fraquezas.</p>
      <StatGrid>
        {DAMAGE_TYPES.filter((type) => data.negations[type] !== undefined).map((type) => (
          <Stat key={type} $highlight={weakest.has(type)}>
            <dt>{DAMAGE_LABELS[type]}</dt>
            <dd>{data.negations[type]}%</dd>
          </Stat>
        ))}
      </StatGrid>

      <StatGroupTitle>Resistência a efeitos</StatGroupTitle>
      <p>Acúmulo necessário para aplicar cada efeito pela primeira vez.</p>
      <StatGrid>
        {STATUS_EFFECTS.flatMap((effect) => {
          const value = data.statusResistances[effect];
          return value === undefined
            ? []
            : [
                <Stat key={effect}>
                  <dt>{STATUS_LABELS[effect]}</dt>
                  <dd>{formatStatusResistance(value)}</dd>
                </Stat>,
              ];
        })}
      </StatGrid>

      <SourceNote>
        Dados objetivos importados de{" "}
        <a href={data.provenance.url} target="_blank" rel="noreferrer">
          {source?.name ?? data.provenance.source}
        </a>
        {source ? ` (${source.license})` : ""}, revisão {data.provenance.revision}. <Link to={CREDITS_PATH}>Fontes e créditos</Link>
      </SourceNote>
    </>
  );
}
