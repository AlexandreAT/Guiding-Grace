# Guiding Grace

Guia de progressão de **Elden Ring** em português, com mapa interativo, checklist de objetivos e progresso salvo no navegador.

<!-- TODO: link do deploy -->
<!-- TODO: GIF curto: marcar um objetivo → "Ver no mapa" → filtrar a legenda -->

## O que dá para fazer

- **Mapa interativo por região**: zoom (botões, roda do mouse e pinça no celular), arraste e marcações por categoria.
- **Mapa e texto ligados**: clicar num pin abre e destaca o trecho do guia; clicar em "Ver no mapa" num tópico centraliza e destaca o pin.
- **Checklist de progresso**: NPCs, chefes, itens e masmorras podem ser marcados como concluídos. A porcentagem aparece por região e no total, na sidebar, e os pins concluídos ficam esmaecidos no mapa.
- **Filtros na legenda**: cada categoria mostra a quantidade de pins da região e pode ser ocultada; também dá para esconder o que já foi concluído.
- **Spoilers protegidos**: trechos de lore ficam ocultos até o clique.
- **Responsivo**: sidebar vira drawer no celular, sem scroll horizontal.

## Decisões técnicas

- **Conteúdo como dados tipados.** Regiões, pins e seções ficam em `src/data` e `shared/const.ts`. Pins e tópicos do texto compartilham o mesmo `id`, e é isso que permite a navegação mapa ↔ texto e gerar o checklist direto dos dados, sem lista duplicada.
- **Progresso com `useSyncExternalStore` + `localStorage`** (`src/hooks/useGuideProgress.ts`). Uma store pequena, salva por build, sincronizada entre abas pelo evento `storage` e tolerante a storage indisponível (modo privado, cota cheia).
- **Sem estado global.** O único estado compartilhado é o progresso, isolado num hook; o resto é estado local da página. Por isso não há Redux.
- **Ferramenta de autoria só em desenvolvimento.** O modo pin (clicar no mapa copia as coordenadas para cadastrar um novo pin) depende de `import.meta.env.DEV` e é removido do bundle de produção. No modo de desenvolvimento, as regiões "Em breve" também ficam acessíveis para a escrita do conteúdo.
- **Escopo honesto.** Regiões sem conteúdo escrito aparecem bloqueadas como "Em breve", em vez de páginas vazias.

## Stack

React 19 · TypeScript · Vite · React Router · Styled Components

## Rodando localmente

Requer Node.js **20.19+** ou **22.12+** (exigência do Vite 7).

```bash
npm install
npm run dev      # desenvolvimento (com modo pin e todas as regiões)
npm run build    # build de produção
npm run preview  # serve o build de produção
npm run lint
npm test         # testes e avaliação da busca do Gideon
```

Sem nenhuma configuração, o site e o Gideon funcionam no **modo local** (busca no próprio guia, sem IA). Para usar a IA localmente, é preciso rodar também o Worker do Gideon com uma conta Cloudflare: o passo a passo está na seção 7 do [guia técnico](GUIDING_GRACE_PROJECT_GUIDE.md).

## Estrutura

```text
shared/const.ts      regiões, legenda, cores dos pins e tema
src/data/            conteúdo das regiões, pins e navegação
src/hooks/           progresso do guia e media queries
src/components/      mapa, legenda, sidebar, conteúdo, cards...
src/pages/           Home, seleção, guia, mecânicas e 404
```

O guia técnico completo (arquitetura, padrões visuais e de código) está em [`GUIDING_GRACE_PROJECT_GUIDE.md`](GUIDING_GRACE_PROJECT_GUIDE.md).

## Status

Conteúdo completo: Terras Intermédias (visão geral), Limgrave (topo e base) e o guia de Sistema de Armas. As demais regiões estão em escrita.

---

Projeto de fã, sem fins lucrativos e sem afiliação com a FromSoftware ou a Bandai Namco. Elden Ring, seus mapas e imagens pertencem aos respectivos detentores.
