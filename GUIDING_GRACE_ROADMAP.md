# Guiding Grace — Roadmap de Melhorias e Próximas Implementações

## 1. Propósito deste documento

Este documento registra as melhorias planejadas para o **Guiding Grace**, a ordem de execução, os critérios de aceite e as decisões técnicas por trás de cada etapa.

Ele complementa o `GUIDING_GRACE_PROJECT_GUIDE.md`:

- O **guia do projeto** define *como* o código deve ser escrito (padrões, arquitetura, identidade visual);
- Este **roadmap** define *o que* será construído a seguir e *por quê*.

> Sempre que uma etapa for concluída, marque os itens correspondentes e preencha a tabela de métricas da seção 11.

---

## 2. Estado atual resumido

O projeto já possui:

- Mapa interativo por região com zoom (botões, roda do mouse ancorada no cursor, pinça ancorada no ponto médio), arraste e pins por categoria;
- Ligação mapa ↔ texto por IDs compartilhados entre `regionPins.ts` e `regionSections.ts`;
- Checklist de progresso salvo no `localStorage` por build (`useGuideProgress`, com `useSyncExternalStore` e sincronização entre abas);
- Legenda que funciona como filtro, com contagem por região e opção de ocultar concluídos;
- Spoilers, imagens com modal, Guia de Mecânicas (Sistema de Armas);
- Modo pin restrito ao ambiente de desenvolvimento;
- Regiões sem conteúdo bloqueadas como `Em breve` em produção;
- Página 404, rodapé com aviso de projeto de fã, README e guia técnico;
- Layout responsivo e cuidados de acessibilidade.

Principais limitações:

- Conteúdo completo em apenas 3 de 15 regiões (visão geral, Limgrave topo e base);
- Mapas pesados: cerca de 31 MB em `public/maps` (`liurnia.jpg` com 7 MB e 4200×4200 px; `limgrave-top.jpg` com 3,5 MB);
- Rótulos dos pins pouco legíveis no celular;
- Sem testes automatizados, sem CI e sem medição de performance;
- Produção de conteúdo lenta (escrita manual e posicionamento de pins);
- Sem forma de levar o progresso de um dispositivo para outro.

---

## 3. Objetivos

1. **Entregar valor em menos de 1 minuto:** quem abre o site deve ver o mapa e o checklist funcionando quase imediatamente;
2. **Ser um produto completo para o público-alvo**, mesmo sem cobrir o jogo inteiro;
3. **Resolver problemas técnicos reais e medir o resultado** (peso dos mapas, legibilidade, performance no celular);
4. **Tornar a produção de conteúdo mais rápida e segura**, com validação automática;
5. **Ter uso real**, com métricas públicas e canal de feedback.

---

## 4. Princípios para priorização

Toda nova implementação deve ser avaliada por estes critérios:

- **Esforço x valor:** preferir melhorias que entregam muito com pouco trabalho;
- **Valor visível rápido:** recursos que exigem muito tempo de uso para serem percebidos têm prioridade menor;
- **Custo zero:** nenhuma etapa pode depender de serviço pago;
- **Medição:** melhorias de performance só contam como concluídas com números de antes e depois;
- **Conteúdo segue o uso:** novas regiões devem ser priorizadas com base no uso real, não apenas para preencher a lista.

---

## 5. Fora do escopo (decisões conscientes)

| Item | Motivo |
|---|---|
| Backend, contas e login | Custo de hospedagem e manutenção; a transferência por QR Code (Fase 5) resolve a sincronização sem servidor |
| Publicação na Play Store | Mapas e imagens pertencem à FromSoftware/Bandai Namco, com risco de rejeição por direitos autorais. A versão instalável será via PWA |
| Completar as 15 regiões agora | Esforço de conteúdo muito alto; regiões novas serão priorizadas pelo uso real |
| Busca avançada / paleta de comandos | Baixo impacto em relação ao esforço neste momento |
| Outros jogos da FromSoftware | Avaliar só depois que o arco inicial estiver consolidado |

---

## 6. Visão geral das fases

| Fase | Tema | Esforço estimado | Depende de |
|---|---|---|---|
| 1 | Faxina, caminho curto até o valor e reposicionamento | 1 fim de semana | — |
| 2 | Pipeline de conteúdo, testes e CI | 1–2 fins de semana | Fase 1 |
| 3 | Arco completo: de Limgrave até Godrick | 1–2 fins de semana | Fase 2 |
| 4 | Mapa em tiles, rótulos legíveis e PWA | 2 fins de semana | Fase 1 |
| 5 | Transferência de progresso por link/QR Code | 1 fim de semana | Fase 2 |
| 6 | Lançamento, analytics e feedback | contínuo | Fases 3 e 4 |

**Corte mínimo**, caso o tempo fique curto: Fase 1, validação de conteúdo na CI (parte da Fase 2), Fase 4 com medição e Fase 6. A Fase 5 é a primeira a sair.

---

## 7. Fases em detalhe

### Fase 1 — Faxina, caminho curto até o valor e reposicionamento

**Objetivo:** fazer o site parecer um produto completo e mostrar o valor nos primeiros segundos.

#### 1.1. Faxina de assets

- [ ] Remover os assets não utilizados em `src/assets`: `crow-icon-block.png`, `crow-icon.png`, `crown-icon-transparent.png`, `sword-icon.png`, `gear-icon.png`, `dagger-icon.png` (cerca de 6,7 MB no repositório);
- [ ] Remover `src/data/Image/`, que duplica `public/images/`;
- [ ] Renomear arquivos com espaço e acento para kebab-case sem acento (ex.: `Varre 1.jpg` → `varre-1.webp`, `Graça.jpg` → `graca.webp`, `Faca de Pedra de Amolar.jpg` → `pedra-de-amolar.webp`) e atualizar as referências em `regionSections.ts`;
- [ ] Converter os ícones usados na Home (`*-icon-transparent.png`, ~500 KB cada) para WebP em tamanho adequado (meta: menos de 40 KB cada);
- [ ] Converter `elden-ring-home-banner.jpg` e as imagens de `public/images` para WebP;
- [ ] Revisar se os mapas não usados (`limgrave-map.png`, `limgrave-default.jpg`, `limgrave-regions.jpg`, `limgrave-top2.jpg`) ainda são necessários.

#### 1.2. Caminho curto até o valor

- [ ] Adicionar na Home um botão principal **"Começar o guia"** que leva direto à Build de Qualidade;
- [ ] Quando houver progresso salvo, trocar o botão por **"Continuar de onde parei"**, abrindo a última região visitada;
- [ ] Salvar a última região visitada junto ao progresso (mesmo padrão de chave do `useGuideProgress`).

#### 1.3. Reposicionamento do escopo

- [ ] Apresentar o guia como **"Guia do início: de Limgrave até Godrick"**, um arco completo para jogadores iniciantes;
- [ ] Exibir as regiões seguintes como **"Próximos capítulos"** em vez de apenas `Em breve`;
- [ ] Atualizar o README com um GIF curto (mapa → marcar objetivo → ver no mapa → filtrar) logo no topo.

**Critérios de aceite:**

- Da Home ao mapa em no máximo 1 clique;
- Nenhum asset não referenciado no repositório;
- Nenhum nome de arquivo com espaço ou acento;
- README com GIF e link do deploy.

---

### Fase 2 — Pipeline de conteúdo, testes e CI

**Objetivo:** tratar o conteúdo como dado com contrato validado, acelerar a escrita de novas regiões e impedir regressões.

#### 2.1. Validação de conteúdo

Criar `scripts/validate-content.ts` (executado por `npm run validate:content`) que importa `regionSections.ts` e `regionPins.ts` e falha com mensagens claras quando:

- [ ] Um ID aparece mais de uma vez;
- [ ] Um pin não tem entrada correspondente no texto da mesma região (ou o inverso, para tipos que exigem pin);
- [ ] Uma coordenada `x` ou `y` está fora do intervalo `[0, 1]`;
- [ ] Um `type` de pin não existe em `PIN_COLORS`;
- [ ] Uma imagem referenciada (`/images/...`, `/maps/...`) não existe em `public/`;
- [ ] Uma região liberada em produção não tem conteúdo mínimo (por exemplo: todas as seções padrão presentes e ao menos um objetivo marcável);
- [ ] Uma região tem mapa, mas não tem pins (ou o inverso).

Saída esperada em caso de erro:

```text
✖ limgrave-top: pin "limgrave-npc-5" não possui entrada em regionSections
✖ weeping-peninsula: imagem "/images/castelo.webp" não encontrada
2 erros encontrados.
```

Decisão: usar tipos TypeScript existentes + validações escritas à mão. Adotar Zod apenas se o formato do conteúdo migrar para JSON.

#### 2.2. Ferramenta de autoria (evolução do modo pin)

- [ ] Ao clicar no mapa em dev, além de copiar as coordenadas, gerar o trecho completo do pin já formatado (`{ id, x, y, type, label, icon, color }`);
- [ ] Sugerir o próximo ID livre da categoria (ex.: `limgrave-npc-5`);
- [ ] Opcional: arrastar um pin existente em dev e copiar as novas coordenadas.

#### 2.3. Testes

- [ ] Configurar **Vitest**;
- [ ] Testar `useGuideProgress`: marcar, desmarcar, resetar por região, leitura de `localStorage` corrompido, ausência de storage;
- [ ] Testar a derivação do checklist (quais tópicos viram objetivos e o cálculo de progresso por região e geral);
- [ ] Testar `zoomAround` e `clampView` do `useMapViewport` (funções puras);
- [ ] Configurar **Playwright** com **um** fluxo ponta a ponta: abrir o guia → marcar um objetivo → "Ver no mapa" → conferir o pin destacado e esmaecido → filtrar a categoria na legenda → recarregar e conferir o progresso salvo.

#### 2.4. CI (GitHub Actions)

- [ ] Workflow em `push` e `pull_request` com: `npm ci` → `lint` → `tsc -b` → `validate:content` → `test` → `build`;
- [ ] Job separado para o Playwright;
- [ ] Badge de status da CI no README.

**Critérios de aceite:**

- CI verde na branch principal;
- Um PR com conteúdo inválido falha na etapa `validate:content`;
- README com seção curta explicando o pipeline de conteúdo.

---

### Fase 3 — Arco completo: de Limgrave até Godrick

**Objetivo:** fechar a experiência do jogador iniciante do começo até o primeiro grande chefe.

- [ ] Completar a **Península das Lágrimas** (`weeping-peninsula`), hoje com texto provisório;
- [ ] Criar a região **Castelo Tempesvéu** (ex.: `stormveil-castle`) com mapa, pins e seções;
- [ ] Revisar a ordem recomendada entre Limgrave, Península e Castelo na sidebar;
- [ ] Adicionar uma seção de encerramento do arco ("Você derrotou Godrick — o que fazer agora"), apontando para os próximos capítulos;
- [ ] Usar a ferramenta de autoria (2.2) e a validação (2.1) em todo o conteúdo novo.

**Critérios de aceite:**

- `validate:content` sem erros;
- Todas as regiões do arco com pins, objetivos marcáveis e seções completas;
- Revisão de spoilers em todos os textos novos.

---

### Fase 4 — Mapa em tiles, rótulos legíveis e PWA

**Objetivo:** reduzir drasticamente o peso dos mapas, tornar o mapa legível no celular e permitir uso offline.

#### 4.1. Geração de tiles

- [ ] Criar `scripts/build-map-tiles.mjs` usando `sharp`;
- [ ] Para cada mapa, gerar uma pirâmide de níveis (o nível mais alto na resolução original, cada nível abaixo com metade do tamanho) cortada em blocos de 256 px em WebP;
- [ ] Gerar uma miniatura pequena (ex.: 64 px de largura, base64) para exibição imediata enquanto os tiles carregam;
- [ ] Gerar um `manifest.json` por região com `width`, `height`, `tileSize`, `levels` e a miniatura;
- [ ] Estrutura de saída sugerida: `public/tiles/{regiao}/{nivel}/{coluna}_{linha}.webp`;
- [ ] Decidir se os tiles são gerados no build ou versionados (gerar no build mantém o repositório leve; versionar evita dependência do `sharp` no deploy).

#### 4.2. Renderização no viewport atual

O `useMapViewport` continua sendo a fonte da verdade (`scale`, `x`, `y`). Os pins não mudam, porque já usam coordenadas normalizadas de 0 a 1.

- [ ] Escolher o nível de detalhe a partir de `scale` e do tamanho do quadro (o menor nível cuja resolução cubra os pixels exibidos);
- [ ] Calcular quais tiles intersectam a área visível e renderizar apenas esses;
- [ ] Manter os tiles do nível anterior visíveis até os novos carregarem, para não piscar;
- [ ] Exibir a miniatura desfocada como fundo desde o primeiro frame.

Decisão: manter o viewport próprio em vez de adotar Leaflet. O viewport já existe e é a parte autoral do projeto. Se o prazo apertar, Leaflet com `CRS.Simple` é o plano B.

#### 4.3. Rótulos legíveis

- [ ] Aplicar escala inversa aos pins e rótulos (`scale(1 / view.scale)`) para que mantenham o tamanho na tela durante o zoom;
- [ ] Implementar detecção de colisão entre rótulos: em zoom baixo, mostrar só os rótulos que não se sobrepõem (prioridade por tipo, ex.: chefe > graça > NPC > item), revelando os demais conforme o zoom aumenta;
- [ ] Pins sem rótulo visível continuam clicáveis e com `aria-label`.

#### 4.4. PWA e offline

- [ ] Adicionar `vite-plugin-pwa` com manifest (nome, ícones, cores do tema);
- [ ] Service worker com estratégia **cache-first** para tiles e imagens e **network-first** para o HTML;
- [ ] Guardar em cache apenas os tiles já vistos, nunca o conjunto inteiro;
- [ ] Testar instalação no Android e no desktop e o funcionamento em modo avião depois de visitar uma região.

#### 4.5. Medição

- [ ] Rodar o Lighthouse (modo mobile) no deploy **antes** de iniciar a fase e registrar na seção 11;
- [ ] Medir os MB transferidos na primeira abertura de Limgrave (aba Network, cache desativado);
- [ ] Repetir as medições depois e publicar a comparação no README;
- [ ] Opcional: Lighthouse CI no GitHub Actions com orçamento de performance.

**Critérios de aceite:**

- Primeira abertura de uma região transfere menos de 500 KB de imagem;
- Rótulos legíveis no celular em todos os níveis de zoom;
- Site instalável e região já visitada funcionando offline;
- Tabela de antes e depois no README.

---

### Fase 5 — Transferência de progresso por link/QR Code

**Objetivo:** permitir continuar o guia em outro dispositivo (ex.: jogo no PC ou TV, guia no celular) sem backend e sem conta.

#### 5.1. Registro estável de objetivos

- [ ] Criar um registro versionado que associa cada ID de objetivo a um índice numérico (ex.: `src/data/objectiveRegistry.ts`);
- [ ] O registro é **somente de acréscimo**: índices nunca são reaproveitados nem reordenados. Objetivos removidos ficam marcados como obsoletos;
- [ ] Adicionar à validação (Fase 2) uma regra que falha se um índice existente mudar ou se um objetivo novo não estiver no registro.

#### 5.2. Formato do payload

```text
[versão: 1 byte][buildId: 1 byte][bitset dos objetivos concluídos]
→ codificado em base64url
```

- Cada bit representa um índice do registro (1 = concluído);
- Centenas de objetivos cabem em poucas dezenas de caracteres;
- Versões antigas continuam legíveis: índices desconhecidos são ignorados e índices obsoletos são descartados.

#### 5.3. Interface

- [ ] Botão **"Levar progresso para outro dispositivo"** na sidebar, gerando link e QR Code (biblioteca `qrcode`, gerada no cliente);
- [ ] Payload no **fragmento** da URL (`#p=...`), que não é enviado ao servidor;
- [ ] Ao abrir um link com payload, perguntar: **mesclar** com o progresso atual ou **substituir**;
- [ ] Após importar, limpar o fragmento da URL.

#### 5.4. Testes

- [ ] Codificar → decodificar mantém o mesmo conjunto;
- [ ] Payload de versão anterior continua importável;
- [ ] Payload corrompido é rejeitado com mensagem amigável, sem apagar o progresso atual.

**Critérios de aceite:**

- Progresso transferido do desktop para o celular lendo o QR Code com a câmera;
- Testes de codificação e compatibilidade passando na CI;
- Seção no README explicando o formato e a estratégia de versionamento.

---

### Fase 6 — Lançamento, analytics e feedback

**Objetivo:** ter usuários reais e dados de uso.

- [ ] Adicionar analytics gratuito e sem cookies (GoatCounter ou Cloudflare Web Analytics; confirmar os termos do plano gratuito);
- [ ] Registrar eventos-chave: objetivo marcado, região aberta, QR gerado, PWA instalado;
- [ ] Adicionar link de feedback (issue do GitHub ou formulário gratuito);
- [ ] Divulgar em comunidades brasileiras de Elden Ring (subreddits, servidores do Discord, grupos);
- [ ] Publicar no README uma seção **"Uso real"** com números atualizados periodicamente;
- [ ] Usar os dados para decidir a próxima região a ser escrita.

**Critérios de aceite:**

- Analytics ativo no deploy, sem banner de cookies necessário;
- Ao menos uma rodada de divulgação feita e registrada;
- Seção "Uso real" no README.

---

## 8. Próximos capítulos (após o arco inicial)

Ordem sugerida, sujeita aos dados de uso da Fase 6:

1. Liurnia dos Lagos;
2. Caelid;
3. Altus Plateau / Leyndell Outskirts;
4. Build de Destreza (reaproveitando regiões já escritas);
5. Novas páginas do Guia de Mecânicas.

---

## 9. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Direitos autorais dos mapas e imagens | Manter o aviso de projeto de fã, não monetizar, não publicar em lojas |
| Tiles aumentando muito o repositório | Gerar no build ou limitar os níveis; avaliar após medir |
| Mudança de IDs quebrando progresso salvo e links | Registro somente de acréscimo + validação na CI (Fase 5) |
| Escopo de conteúdo crescendo sem controle | Regiões novas só depois do arco inicial e guiadas pelo uso |
| Limites de plano gratuito (analytics, hospedagem) | Escolher serviços substituíveis e não depender de recursos exclusivos |

---

## 10. Orientações para inteligências artificiais

Além das regras do `GUIDING_GRACE_PROJECT_GUIDE.md`:

- Implementar **uma fase por vez**, respeitando as dependências da seção 6;
- Não adicionar itens da seção 5 (fora do escopo) sem pedido explícito;
- Não alterar índices do registro de objetivos (Fase 5) em hipótese alguma;
- Toda mudança de conteúdo deve passar no `validate:content`;
- Melhorias de performance precisam vir acompanhadas das medições de antes e depois;
- Ao concluir uma etapa, marcar os itens neste documento.

---

## 11. Registro de métricas

Preencher a cada fase concluída.

| Métrica | Antes | Depois | Data |
|---|---|---|---|
| Lighthouse Performance (mobile) | | | |
| LCP na região Limgrave (mobile) | | | |
| MB transferidos ao abrir Limgrave | | | |
| Tamanho total de `public/` | ~34 MB | | |
| Peso dos ícones da Home | ~500 KB cada | | |
| Regiões completas | 3 de 15 | | |
| Cobertura de testes (hook de progresso e checklist) | 0% | | |
| Visitantes mensais | — | | |
| Objetivos marcados no mês | — | | |
