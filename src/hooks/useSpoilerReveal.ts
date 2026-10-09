import { useCallback, useState } from "react";

// "Mostrar mesmo assim": consentimento só desta tela, enquanto ela estiver aberta. Não é salvo, não muda o progresso
// e não chega ao Gideon (o contexto da tela nunca carrega o que foi revelado)
export function useSpoilerReveal() {
  const [revealedIds, setRevealedIds] = useState<ReadonlySet<string>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const reveal = useCallback((id: string) => setRevealedIds((current) => new Set([...current, id])), []);
  const revealAll = useCallback(() => setAllRevealed(true), []);
  const isRevealed = useCallback((id: string) => allRevealed || revealedIds.has(id), [allRevealed, revealedIds]);

  return { allRevealed, isRevealed, reveal, revealAll };
}
