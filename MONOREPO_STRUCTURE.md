# CELEBRA - Monorepo Structure

## Estrutura do Projeto

```
celebra/
├── design-system/              # Design System CELEBRA V4
│   ├── components/             # Componentes React reutilizáveis
│   │   ├── CelebraButton.tsx
│   │   ├── CelebraCard.tsx
│   │   ├── CelebraBadge.tsx
│   │   ├── CelebraInput.tsx
│   │   ├── CelebraModal.tsx
│   │   ├── CelebraHeader.tsx
│   │   └── CelebraFooter.tsx
│   ├── theme/                  # Temas e estilos
│   │   └── celebra-theme.css   # Cores litúrgicas
│   └── stories/                # Storybook stories
│
├── apps/
│   └── music/                  # Aplicação de Música Católica
│       ├── client/             # Frontend React
│       ├── server/             # Backend Express + tRPC
│       ├── drizzle/            # Schema do banco de dados
│       └── shared/             # Tipos compartilhados
│
├── shared/                     # Código compartilhado entre apps
│   └── const.ts                # Constantes globais
│
├── DESIGN_SYSTEM.md            # Documentação do Design System
├── COMPONENT_LIBRARY.md        # Guia de componentes
└── README.md                   # Este arquivo
```

## Aplicações

### Design System (design-system/)
- **Componentes**: 7 componentes React reutilizáveis
- **Storybook**: Documentação interativa
- **Temas**: Cores litúrgicas, tipografia elegante
- **Acessibilidade**: WCAG AA compliant

### Music Platform (apps/music/)
- **Catálogo**: Listar, buscar, filtrar músicas
- **Admin**: Dashboard, importação CSV
- **Recomendações**: IA-powered suggestions
- **Player**: Reprodutor de áudio integrado
- **Autenticação**: OAuth Manus
- **Banco de Dados**: MySQL/TiDB com Drizzle ORM

## Como Usar

### Instalar Dependências
```bash
cd celebra-project
pnpm install
```

### Desenvolver
```bash
# Iniciar aplicação de música
cd apps/music
pnpm dev

# Iniciar Storybook
pnpm storybook
```

### Testes
```bash
pnpm test
```

## Features

✅ 7 Componentes React reutilizáveis
✅ Storybook com 20+ stories
✅ Design System litúrgico completo
✅ 14 páginas funcionais
✅ Banco de dados completo
✅ Autenticação OAuth
✅ Recomendações com IA
✅ 17 testes passando

## Próximos Passos

- [ ] Publicar Design System como npm package
- [ ] Criar CI/CD pipeline
- [ ] Adicionar mais aplicações ao monorepo
- [ ] Integração com mais serviços
