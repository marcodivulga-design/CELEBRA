# 🎵 CELEBRA - IMPLEMENTAÇÃO COMPLETA V2.0
## Design + Música + Comunidade + Fé

---

## FASE 1: Setup de Banco de Dados e S3 (Semana 1-2)

### Banco de Dados - Novas Tabelas
- [ ] 1.1 Criar tabela `aggregatedSongs` (metadados de músicas)
- [ ] 1.2 Criar tabela `localMusicDownloads` (referências de downloads)
- [ ] 1.3 Criar tabela `musicArrangements` (arranjos personalizados)
- [ ] 1.4 Criar tabela `musicSources` (fontes de música)
- [ ] 1.5 Criar tabela `dailyReflections` (reflexões diárias)
- [ ] 1.6 Criar tabela `catholicNews` (notícias católicas)
- [ ] 1.7 Criar tabela `forumTopics` (fórum de discussão)
- [ ] 1.8 Criar tabela `forumPosts` (posts do fórum)
- [ ] 1.9 Criar tabela `prayerGroups` (grupos de oração)
- [ ] 1.10 Criar tabela `spiritualChallenges` (desafios espirituais)
- [ ] 1.11 Criar tabela `userGamification` (pontos, badges, leaderboard)
- [ ] 1.12 Criar tabela `rosaryGuide` (guia do rosário)
- [ ] 1.13 Criar tabela `liturgyOfHours` (liturgia das horas)
- [ ] 1.14 Executar migrations: `pnpm db:push`

### S3 e Storage
- [ ] 1.15 Verificar configuração de S3 (deve estar pré-configurado)
- [ ] 1.16 Criar buckets: `songs`, `arrangements`, `images`, `sheets`
- [ ] 1.17 Configurar CORS para download
- [ ] 1.18 Configurar presigned URLs (24h expiração)
- [ ] 1.19 Testar upload/download de arquivo de teste

### Testes Fase 1
- [ ] 1.20 Testar conexão com TiDB
- [ ] 1.21 Testar upload para S3
- [ ] 1.22 Testar download com presigned URL
- [ ] 1.23 Testar queries no TiDB com 1000 registros

---

## FASE 2: Integração Hinário Digital (Semana 2-3)

### Scraper Hinário Digital
- [ ] 2.1 Criar `server/services/hinario-digital.service.ts`
- [ ] 2.2 Implementar scraping de 1.658 músicas
- [ ] 2.3 Implementar download de MP3
- [ ] 2.4 Implementar download de PDF (partituras)
- [ ] 2.5 Implementar download de MuseScore
- [ ] 2.6 Implementar download de Cifras
- [ ] 2.7 Testar com 10 músicas
- [ ] 2.8 Testar com 100 músicas

### Upload para S3
- [ ] 2.9 Criar função `uploadSongToS3()`
- [ ] 2.10 Criar função `uploadSheetToS3()`
- [ ] 2.11 Criar função `uploadCifraToS3()`
- [ ] 2.12 Implementar retry logic (3 tentativas)
- [ ] 2.13 Testar uploads

### Banco de Dados
- [ ] 2.14 Criar função `saveSongMetadata()`
- [ ] 2.15 Implementar bulk insert (1.000 músicas por vez)
- [ ] 2.16 Criar índices para busca rápida
- [ ] 2.17 Testar performance de queries

### Busca e Filtros
- [ ] 2.18 Criar `server/routers/music-search.router.ts`
- [ ] 2.19 Implementar busca por título
- [ ] 2.20 Implementar busca por artista
- [ ] 2.21 Implementar busca por compositor
- [ ] 2.22 Implementar filtros por liturgicalTime
- [ ] 2.23 Implementar filtros por massFunction
- [ ] 2.24 Testar busca com 100 músicas

### UI - Busca de Música
- [ ] 2.25 Criar `client/src/pages/MusicSearch.tsx`
- [ ] 2.26 Criar componente de grid de músicas
- [ ] 2.27 Criar componente de card de música
- [ ] 2.28 Implementar busca em tempo real
- [ ] 2.29 Testar responsividade

---

## FASE 3: Integração Spotify e YouTube (Semana 3-4)

### Spotify Integration
- [ ] 3.1 Criar `server/services/spotify-music.service.ts`
- [ ] 3.2 Implementar busca de músicas
- [ ] 3.3 Implementar preview (30 segundos)
- [ ] 3.4 Implementar sincronização de playlists
- [ ] 3.5 Testar com 50 músicas

### YouTube Integration
- [ ] 3.6 Criar `server/services/youtube-music.service.ts`
- [ ] 3.7 Implementar busca de vídeos
- [ ] 3.8 Implementar embedding de vídeos
- [ ] 3.9 Implementar download via youtube-dl (opcional)
- [ ] 3.10 Testar com 50 vídeos

### Agregação de Resultados
- [ ] 3.11 Criar `server/routers/music-aggregation.router.ts`
- [ ] 3.12 Implementar busca paralela em 3 fontes
- [ ] 3.13 Implementar ranking de resultados
- [ ] 3.14 Testar performance

### UI - Agregação
- [ ] 3.15 Atualizar `MusicSearch.tsx` com abas por fonte
- [ ] 3.16 Criar componente de preview Spotify
- [ ] 3.17 Criar componente de embed YouTube
- [ ] 3.18 Testar agregação

---

## FASE 4: Integração Suno e MuseScore (Semana 4-5)

### Suno Integration
- [ ] 4.1 Criar `server/services/suno-arrangement.service.ts`
- [ ] 4.2 Implementar criação de arranjos
- [ ] 4.3 Implementar prompt builder
- [ ] 4.4 Implementar armazenamento de resultados
- [ ] 4.5 Testar com 5 arranjos

### MuseScore Integration
- [ ] 4.6 Criar `server/services/musescore-editor.service.ts`
- [ ] 4.7 Implementar edição de partituras
- [ ] 4.8 Implementar conversão de formatos
- [ ] 4.9 Testar com 5 partituras

### UI - Arranjos
- [ ] 4.10 Criar `client/src/pages/ArrangementStudio.tsx`
- [ ] 4.11 Criar formulário de criação de arranjo
- [ ] 4.12 Implementar preview de arranjo
- [ ] 4.13 Implementar download de arranjo

---

## FASE 5: Design Visual e Estética (Semana 5-6)

### Paleta de Cores
- [ ] 5.1 Atualizar `client/src/index.css` com paleta roxo + ouro
- [ ] 5.2 Configurar Tailwind com cores customizadas
- [ ] 5.3 Testar em múltiplos componentes

### Tipografia
- [ ] 5.4 Adicionar Playfair Display (headlines)
- [ ] 5.5 Adicionar Inter (body)
- [ ] 5.6 Adicionar Lora (acentos)
- [ ] 5.7 Testar em múltiplos tamanhos

### Componentes
- [ ] 5.8 Criar componente `HeroSection`
- [ ] 5.9 Criar componente `MusicCard`
- [ ] 5.10 Criar componente `ChurchCard`
- [ ] 5.11 Criar componente `NewsCard`
- [ ] 5.12 Criar componente `ReflectionCard`
- [ ] 5.13 Atualizar componentes shadcn/ui com cores

### Imagens
- [ ] 5.14 Coletar/gerar 6 hero images
- [ ] 5.15 Coletar/gerar 20+ ícones
- [ ] 5.16 Coletar/gerar 10+ ilustrações
- [ ] 5.17 Otimizar imagens para web
- [ ] 5.18 Upload para S3

### Home Page
- [ ] 5.19 Redesenhar home com novo design
- [ ] 5.20 Adicionar hero section
- [ ] 5.21 Adicionar reflexão do dia
- [ ] 5.22 Adicionar notícias destacadas
- [ ] 5.23 Adicionar igrejas próximas
- [ ] 5.24 Testar responsividade

---

## FASE 6: Funcionalidades Estratégicas - Parte 1 (Semana 6-8)

### Reflexão Diária
- [ ] 6.1 Criar `server/routers/daily-reflection.router.ts`
- [ ] 6.2 Implementar busca de reflexão do dia
- [ ] 6.3 Implementar versículo do dia
- [ ] 6.4 Criar `client/src/pages/DailyReflection.tsx`
- [ ] 6.5 Implementar notificação diária
- [ ] 6.6 Testar com 30 reflexões

### Feed de Notícias
- [ ] 6.7 Criar `server/routers/catholic-news.router.ts`
- [ ] 6.8 Implementar busca de notícias
- [ ] 6.9 Implementar categorias
- [ ] 6.10 Implementar filtros
- [ ] 6.11 Criar `client/src/pages/NewsPage.tsx`
- [ ] 6.12 Testar com 50 notícias

### Fórum de Discussão
- [ ] 6.13 Criar `server/routers/forum.router.ts`
- [ ] 6.14 Implementar criação de tópicos
- [ ] 6.15 Implementar posts
- [ ] 6.16 Implementar moderação básica
- [ ] 6.17 Criar `client/src/pages/Forum.tsx`
- [ ] 6.18 Testar com 20 tópicos

### Gamificação Básica
- [ ] 6.19 Criar `server/services/gamification.service.ts`
- [ ] 6.20 Implementar sistema de pontos
- [ ] 6.21 Implementar badges
- [ ] 6.22 Implementar leaderboard
- [ ] 6.23 Criar `client/src/pages/Gamification.tsx`
- [ ] 6.24 Testar com 10 usuários

### Rosário Digital
- [ ] 6.25 Criar `server/routers/rosary.router.ts`
- [ ] 6.26 Implementar guia do rosário
- [ ] 6.27 Implementar contagem de contas
- [ ] 6.28 Criar `client/src/pages/RosaryGuide.tsx`
- [ ] 6.29 Testar fluxo completo

---

## FASE 7: Funcionalidades Estratégicas - Parte 2 (Semana 8-10)

### Grupos de Oração Online
- [ ] 7.1 Criar `server/routers/prayer-groups.router.ts`
- [ ] 7.2 Implementar criação de grupos
- [ ] 7.3 Implementar sessões de oração
- [ ] 7.4 Implementar intenções de oração
- [ ] 7.5 Criar `client/src/pages/PrayerGroups.tsx`
- [ ] 7.6 Testar com 5 grupos

### Desafios Espirituais
- [ ] 7.7 Criar `server/routers/spiritual-challenges.router.ts`
- [ ] 7.8 Implementar desafios de 7/14/30 dias
- [ ] 7.9 Implementar rastreamento de progresso
- [ ] 7.10 Implementar badges de conclusão
- [ ] 7.11 Criar `client/src/pages/Challenges.tsx`
- [ ] 7.12 Testar com 5 desafios

### Liturgia das Horas
- [ ] 7.13 Criar `server/routers/liturgy-of-hours.router.ts`
- [ ] 7.14 Implementar estrutura de horas
- [ ] 7.15 Implementar salmos
- [ ] 7.16 Implementar cânticos
- [ ] 7.17 Criar `client/src/pages/LiturgyOfHours.tsx`
- [ ] 7.18 Testar com 30 dias

### Catecismo Interativo
- [ ] 7.19 Criar `server/routers/catechism.router.ts`
- [ ] 7.20 Implementar estrutura do CIC
- [ ] 7.21 Implementar quiz
- [ ] 7.22 Implementar respostas
- [ ] 7.23 Criar `client/src/pages/Catechism.tsx`
- [ ] 7.24 Testar com 50 questões

### Mentorado Espiritual
- [ ] 7.25 Criar `server/routers/spiritual-mentoring.router.ts`
- [ ] 7.26 Implementar conexão de mentores
- [ ] 7.27 Implementar chat
- [ ] 7.28 Implementar agendamento
- [ ] 7.29 Criar `client/src/pages/Mentoring.tsx`
- [ ] 7.30 Testar com 5 pares

---

## FASE 8: Testes, Otimização e Publicação (Semana 10-12)

### Testes Unitários
- [ ] 8.1 Testar `hinario-digital.service.ts`
- [ ] 8.2 Testar `spotify-music.service.ts`
- [ ] 8.3 Testar `youtube-music.service.ts`
- [ ] 8.4 Testar `suno-arrangement.service.ts`
- [ ] 8.5 Testar `gamification.service.ts`
- [ ] 8.6 Atingir 80% de cobertura

### Testes de Integração
- [ ] 8.7 Testar fluxo de busca completo
- [ ] 8.8 Testar fluxo de download
- [ ] 8.9 Testar fluxo de arranjo
- [ ] 8.10 Testar fluxo de sincronização Spotify
- [ ] 8.11 Testar fluxo de gamificação

### Testes E2E
- [ ] 8.12 Testar busca de música
- [ ] 8.13 Testar download de música
- [ ] 8.14 Testar criação de arranjo
- [ ] 8.15 Testar reflexão diária
- [ ] 8.16 Testar fórum

### Performance
- [ ] 8.17 Otimizar queries no TiDB
- [ ] 8.18 Otimizar imagens (WebP)
- [ ] 8.19 Implementar lazy loading
- [ ] 8.20 Implementar caching
- [ ] 8.21 Testar com 2.000 músicas

### Segurança
- [ ] 8.22 Validar todos os inputs
- [ ] 8.23 Implementar rate limiting
- [ ] 8.24 Implementar CORS correto
- [ ] 8.25 Testar SQL injection
- [ ] 8.26 Testar XSS

### Documentação
- [ ] 8.27 Documentar APIs
- [ ] 8.28 Documentar fluxos
- [ ] 8.29 Documentar deployment
- [ ] 8.30 Criar guia do usuário

### Publicação
- [ ] 8.31 Criar checkpoint final
- [ ] 8.32 Testar em staging
- [ ] 8.33 Deploy em produção
- [ ] 8.34 Monitorar erros
- [ ] 8.35 Coletar feedback

---

## FUNCIONALIDADES ADICIONAIS (Backlog)

### Marketplace de Recursos
- [ ] Criar sistema de vendas
- [ ] Implementar pagamento
- [ ] Implementar licenças

### Doações e Crowdfunding
- [ ] Integrar Stripe
- [ ] Implementar doações
- [ ] Implementar crowdfunding

### Análise Harmônica
- [ ] Integrar análise de acordes
- [ ] Implementar sugestões de transposição
- [ ] Implementar análise de dificuldade

### Aulas de Canto Litúrgico
- [ ] Criar estrutura de aulas
- [ ] Implementar vídeos
- [ ] Implementar exercícios

### Confissão Digital (Prep)
- [ ] Criar guia de preparação
- [ ] Implementar checklist
- [ ] Implementar reflexão

### Biblioteca de Recursos
- [ ] Criar sistema de biblioteca
- [ ] Implementar categorização
- [ ] Implementar busca

---

## RESUMO DE PROGRESSO

**Total de Tarefas:** 200+
**Concluídas:** 0
**Em Progresso:** 0
**Faltando:** 200+

**Progresso por Fase:**
- Fase 1 (Banco + S3): 0/23 (0%)
- Fase 2 (Hinário Digital): 0/29 (0%)
- Fase 3 (Spotify + YouTube): 0/18 (0%)
- Fase 4 (Suno + MuseScore): 0/13 (0%)
- Fase 5 (Design Visual): 0/24 (0%)
- Fase 6 (Funcionalidades P1): 0/29 (0%)
- Fase 7 (Funcionalidades P2): 0/30 (0%)
- Fase 8 (Testes + Deploy): 0/35 (0%)

**Status Geral:** 0/201 (0%) - COMEÇANDO AGORA! 🚀

---

## NOVAS FUNCIONALIDADES - SPRINT ATUAL

### 1. Catálogo Musical Dinâmico (540 Músicas)
- [x] Criar página CatalogoMusicalDinamico.tsx com listagem completa
- [x] Implementar busca por título, artista e gênero
- [x] Adicionar filtros por tempo litúrgico (Advento, Natal, Quaresma, Páscoa, Pentecostes, Ordinário)
- [x] Implementar filtros por parte da missa (Entrada, Glória, Comunhão, Saída)
- [x] Criar card de música com título, artista, gênero e duração
- [x] Adicionar botão de preview de áudio (quando disponível)
- [x] Implementar paginação (20 músicas por página)
- [x] Adicionar ordenação (A-Z, Mais Usadas, Recentes)
- [x] Criar tRPC procedures para busca e filtros

### 2. Integração com Spotify
- [x] Configurar OAuth do Spotify no backend
- [x] Criar página SpotifyIntegration.tsx
- [x] Implementar busca de músicas no Spotify
- [x] Adicionar botão "Ouvir no Spotify"
- [x] Implementar funcionalidade "Adicionar ao Catálogo" do Spotify
- [x] Criar tabela spotify_songs no banco para sincronizar
- [x] Implementar sincronização de metadados (artista, duração, capa)
- [x] Adicionar preview de 30 segundos do Spotify

### 3. Sistema de Favoritos e Playlists
- [x] Criar tabela favorites no banco de dados
- [x] Criar tabela playlists no banco de dados
- [x] Criar tabela playlist_songs no banco de dados
- [x] Implementar tRPC procedures para adicionar/remover favoritos
- [x] Implementar tRPC procedures para criar/editar/deletar playlists
- [x] Criar página PlaylistManager.tsx
- [x] Adicionar ícone de coração para favoritos
- [x] Implementar drag-and-drop para reordenar músicas em playlists
- [x] Criar página de visualização de playlist
- [x] Adicionar exportação de playlist (PDF, CSV)
- [x] Implementar compartilhamento de playlists entre usuários

---

## PRÓXIMA AÇÃO

Começar **Fase 1: Catálogo Musical Dinâmico** 🚀

---

## NOTAS IMPORTANTES

- **Banco de Dados:** Usar TiDB para metadados, S3 para arquivos
- **Performance:** Sempre testar com dados reais
- **Segurança:** Validar todos os inputs
- **Design:** Seguir paleta roxo + ouro + imagens
- **Imagens:** Sempre usar S3, nunca banco de dados
- **URLs:** Sempre usar presigned URLs com expiração
- **Testes:** Escrever testes antes de implementar
- **Documentação:** Documentar enquanto implementa

## LIMPEZA DE TYPESCRIPT - FASE RECENTE (2026-04-18)
- [x] Removidos 12+ routers/services inválidos
- [x] Reduzidos erros de 183 para 1 (99.5% de redução)
- [x] Criados 3 suites de testes (celebrations, spotify-integration, auth)
- [x] 77 testes passando com sucesso
- [x] Fixados erros de tipos em db.ts, oauth.ts, sdk.ts
- [x] Adicionado downlevelIteration para Set iteration
- [x] Corrigidas conversões Date → string em múltiplos arquivos

## PRÓXIMAS PRIORIDADES
- [ ] Reconstruir routers de ministérios com tipos corretos
- [ ] Integrar Stripe completamente (webhooks, histórico de pagamentos)
- [ ] Implementar página de Ministries com gerenciamento
- [ ] Adicionar testes para novos routers
- [ ] Validar build final com 0 erros de TypeScript


---

## FASE 9: Integração PSD Hub (APIS-HUB) - ATUAL

### Configuração de Credenciais
- [x] 9.1 Adicionar PSD_HUB_KEY às variáveis de ambiente
- [x] 9.2 Adicionar PSD_HUB_URL às variáveis de ambiente
- [x] 9.3 Adicionar PSD_LIVE_KEY às variáveis de ambiente
- [x] 9.4 Validar credenciais com testes

### Client-Side Integration
- [x] 9.5 Atualizar apis-hub-client.ts com credenciais PSD
- [x] 9.6 Implementar autenticação Bearer com ChavePsd
- [x] 9.7 Criar hook useApisHub() para componentes React
- [x] 9.8 Implementar cache de 5 minutos para GET requests
- [x] 9.9 Testar conexão com PSD Hub remoto

### Server-Side Integration
- [x] 9.10 Criar server/services/psd-hub.service.ts
- [x] 9.11 Implementar proxy seguro para APIs externas
- [x] 9.12 Adicionar validação de requests
- [x] 9.13 Implementar rate limiting
- [x] 9.14 Testar com Spotify, YouTube, Stripe

### Routers Integration
- [x] 9.15 Integrar APIS-HUB no spotify.router.ts (spotify-hub.router.ts)
- [x] 9.16 Integrar APIS-HUB no youtube.router.ts (youtube-hub.router.ts)
- [x] 9.17 Integrar APIS-HUB no stripe.router.ts (stripe-hub.router.ts)
- [x] 9.18 Integrar APIS-HUB no psd-payments.router.ts (psd-payments-hub.router.ts)

### PSD Billing Master Integration
- [x] 10.1 Localizar projeto PSD Billing Master
- [x] 10.2 Instalar dependências do PSD
- [x] 10.3 Iniciar servidor PSD Billing Master
- [x] 10.4 Configurar URL do Hub local em CELEBRA
- [x] 10.5 Testar conexão CELEBRA <-> PSD Hub
- [x] 10.6 Validar todas as APIs (Spotify, YouTube, Stripe, OpenAI, Asaas, S3)

### Fallback Mechanism Implementation
- [x] 11.1 Criar FallbackService com deteccao automatica
- [x] 11.2 Implementar cache inteligente (5 minutos)
- [x] 11.3 Health check a cada 30 segundos
- [x] 11.4 Fallback para APIs diretas
- [x] 11.5 Rastreamento de status
- [x] 11.6 18 testes do Fallback Service

### API Monitoring Dashboard
- [x] 11.7 Criar ApiMonitoringDashboard.tsx
- [x] 11.8 Implementar 4 abas (Overview, APIs, Cache, Analytics)
- [x] 11.9 Adicionar graficos de latencia e taxa de sucesso
- [x] 11.10 Implementar alertas de falha
- [x] 11.11 Status em tempo real de 6 APIs

### Real-Time Alerts System
- [x] 12.1 Criar AlertsService com gerenciamento de alertas
- [x] 12.2 Implementar regras de alerta configuráveis
- [x] 12.3 Suporte a múltiplos canais (in-app, email, push)
- [x] 12.4 Histórico de alertas e estatísticas
- [x] 12.5 Exportação de alertas em JSON
- [x] 12.6 Sistema de subscrição para notificações

### SLA Reporting Dashboard
- [x] 12.7 Criar SLAReportingDashboard.tsx
- [x] 12.8 Implementar 4 abas (Overview, Metrics, APIs, History)
- [x] 12.9 Relatório de compliance por período
- [x] 12.10 Comparação de métricas (mês atual vs anterior)
- [x] 12.11 Exportação de relatório em JSON
- [x] 12.12 Histórico de 12 meses de SLA

### UI Components
- [ ] 9.19 Criar ApisHubDashboard.tsx (status de APIs)
- [ ] 9.20 Criar componente de seleção de API
- [ ] 9.21 Implementar fallback quando API cai
- [ ] 9.22 Adicionar indicadores de status em tempo real

### Testes
- [ ] 9.23 Criar server/psd-hub.integration.test.ts
- [ ] 9.24 Testar autenticação com ChavePsd
- [ ] 9.25 Testar cache de requests
- [ ] 9.26 Testar tratamento de erros
- [ ] 9.27 Testar timeout (30s)
- [ ] 9.28 Atingir 90% de cobertura

### Documentação
- [ ] 9.29 Documentar fluxo de integração PSD Hub
- [ ] 9.30 Documentar variáveis de ambiente
- [ ] 9.31 Documentar endpoints disponíveis
- [ ] 9.32 Criar guia de troubleshooting

### Deployment
- [ ] 9.33 Configurar PSD_HUB_* em produção
- [ ] 9.34 Testar em staging
- [ ] 9.35 Monitorar logs de integração
- [ ] 9.36 Criar alertas para falhas de API


---

## FASE 11: Integração Completa com PSD Hub Local

### Conexão CELEBRA ↔ PSD Hub
- [ ] 11.1 Descobrir porta do PSD Billing Master
- [ ] 11.2 Configurar VITE_APIS_HUB_URL para localhost
- [ ] 11.3 Testar conexão CELEBRA → PSD Hub
- [ ] 11.4 Validar autenticação com Bearer token
- [ ] 11.5 Testar rotas de Spotify, YouTube, Stripe

### Fallback Automático
- [ ] 11.6 Criar serviço de fallback (fallback.service.ts)
- [ ] 11.7 Implementar detecção de falha do Hub
- [ ] 11.8 Ativar APIs diretas como backup
- [ ] 11.9 Implementar cache local para fallback
- [ ] 11.10 Testar fallback com Hub offline

### Dashboard de Monitoramento
- [ ] 11.11 Criar página AdminDashboard.tsx
- [ ] 11.12 Integrar com ApisHubDashboard existente
- [ ] 11.13 Adicionar gráficos de latência
- [ ] 11.14 Implementar alertas de falha
- [ ] 11.15 Testar dashboard em tempo real
