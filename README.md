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
- **Gideon, assistente do guia**: responde só com o que está no guia, mostra as fontes com link para o trecho, respeita o seu progresso (não adianta spoilers) e dá uma resposta mais completa quando você pede ("me explica melhor", "só isso?"). Sem IA configurada, funciona com a busca local.
- **Compêndio de chefes e lore**: páginas com estratégia, dados de combate (importados com a fonte de cada número) e história em textos curtos. O que está além do seu progresso fica oculto por seção, com a opção "Mostrar mesmo assim". As fontes externas e as licenças ficam na página "Fontes e créditos".
- **Responsivo**: sidebar vira drawer no celular, sem scroll horizontal.

## Decisões técnicas

- **Conteúdo como dados tipados.** Regiões, pins e seções ficam em `src/data` e `shared/const.ts`. Pins e tópicos do texto compartilham o mesmo `id`, e é isso que permite a navegação mapa ↔ texto e gerar o checklist direto dos dados, sem lista duplicada.
- **Progresso com `useSyncExternalStore` + `localStorage`** (`src/hooks/useGuideProgress.ts`). Uma store pequena, salva por build, sincronizada entre abas pelo evento `storage` e tolerante a storage indisponível (modo privado, cota cheia).
- **Sem estado global.** O único estado compartilhado é o progresso, isolado num hook; o resto é estado local da página. Por isso não há Redux.
- **Ferramenta de autoria só em desenvolvimento.** O modo pin (clicar no mapa copia as coordenadas para cadastrar um novo pin) depende de `import.meta.env.DEV` e é removido do bundle de produção. No modo de desenvolvimento, as regiões "Em breve" também ficam acessíveis para a escrita do conteúdo.
- **Escopo honesto.** Regiões sem conteúdo escrito aparecem bloqueadas como "Em breve", em vez de páginas vazias.

## Stack

React 19 · TypeScript · Vite · React Router · Styled Components · Vitest

Gideon: Cloudflare Workers · Workers AI · Turnstile

## Rodando localmente

Requer Node.js **20.19+** ou **22.12+** (exigência do Vite 7).

```bash
npm install
npm run dev      # desenvolvimento (com modo pin e todas as regiões)
npm run build    # build de produção
npm run preview  # serve o build de produção
npm run lint
npm test         # testes e avaliação da busca do Gideon
npm run content:check   # valida o Compêndio e lista o que falta revisar
```

Para adicionar chefes e artigos de lore (`content:new`, `content:import`), veja a seção 13.4 do [guia técnico](GUIDING_GRACE_PROJECT_GUIDE.md).

Sem nenhuma configuração, o site e o Gideon funcionam no **modo local** (busca no próprio guia, sem IA). Para usar a IA localmente, é preciso rodar também o Worker do Gideon com uma conta Cloudflare gratuita: o passo a passo (e a publicação) está na seção 7 do [guia técnico](GUIDING_GRACE_PROJECT_GUIDE.md).

## Estrutura

```text
shared/const.ts      legenda, cores dos pins, ícones das regiões e tema
shared/gideon/       motor do Gideon (índice, busca, spoilers, respostas), usado pelo site e pelo Worker
src/data/            conteúdo das regiões, pins, mecânicas e navegação (dados puros)
src/data/compendium/ chefes, lore, dados de combate importados e créditos das fontes
src/hooks/           progresso do guia, conversa do Gideon, Turnstile e media queries
src/services/        chamadas ao Worker e widget do Turnstile
src/routes/          região e foco na URL do guia
src/components/      mapa, legenda, sidebar, conteúdo, chat do Gideon...
src/pages/           Home, seleção, guia, mecânicas, chefes, lore, créditos e 404
worker/              Worker do Gideon (Cloudflare): validação, proteção e chamada à IA
scripts/content/     autoria do Compêndio: templates, importação da Eldenpedia e validação
```

O guia técnico completo (arquitetura, padrões visuais e de código) está em [`GUIDING_GRACE_PROJECT_GUIDE.md`](GUIDING_GRACE_PROJECT_GUIDE.md).

## Status

Conteúdo completo: Terras Intermédias (visão geral), Limgrave (topo e base) e o guia de Sistema de Armas. As demais regiões estão em escrita.

Compêndio: 4 chefes (Margit, Godrick, Rennala e Radahn) e 11 artigos de lore, em revisão.

---

Projeto de fã, sem fins lucrativos e sem afiliação com a FromSoftware ou a Bandai Namco. Elden Ring, seus mapas e imagens pertencem aos respectivos detentores. Dados de combate dos chefes: [Eldenpedia](https://eldenring.wiki.gg) (CC BY-SA 4.0); detalhes na página "Fontes e créditos" do site.
