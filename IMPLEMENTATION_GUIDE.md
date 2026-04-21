# 🎵 CELEBRA V4 - Guia de Implementação

## 📋 Funcionalidades Implementadas

Este documento descreve as 3 funcionalidades prioritárias implementadas no CELEBRA V4.

---

## 1️⃣ Admin Import UI - Upload de CSV

### 📍 Localização
- **Backend:** `server/routers/csv-import.router.ts`
- **Frontend:** `client/src/pages/AdminImportCSV.tsx`
- **Testes:** `server/routers/csv-import.test.ts`

### ✨ Funcionalidades

#### Preview de CSV
```typescript
// Fazer preview de um arquivo CSV antes de importar
const preview = await trpc.csvImport.preview.mutate({
  csvContent: "title,artist,genre,duration\nAve Maria,Schubert,Clássico,04:30"
});

// Retorna:
{
  totalRows: 1,
  validRows: 1,
  invalidRows: 0,
  rows: [
    {
      rowNumber: 2,
      isValid: true,
      data: {
        title: "Ave Maria",
        artist: "Schubert",
        genre: "Clássico",
        duration: "04:30"
      },
      errors: []
    }
  ]
}
```

#### Importar CSV
```typescript
// Importar dados validados
const result = await trpc.csvImport.import.mutate({
  csvContent: "...",
  skipInvalid: true // Pular linhas com erro
});

// Retorna:
{
  success: true,
  importedCount: 100,
  skippedCount: 5,
  errors: [
    { rowNumber: 15, error: "Título é obrigatório" }
  ]
}
```

### 📊 Formato do CSV

```csv
title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
Glória,Vivaldi,Clássico,05:15
Aleluia,Handel,Clássico,06:00
```

**Campos obrigatórios:**
- `title` - Título da música (string)
- `artist` - Artista (string)
- `genre` - Gênero (string)
- `duration` - Duração em MM:SS (formato: 04:30)

### 🔐 Permissões
- ✅ Apenas **admin** pode fazer upload
- ❌ Usuários comuns não têm acesso

### 🧪 Testes
```bash
pnpm test -- csv-import.test.ts
```

---

## 2️⃣ Real Audio Upload - Streaming com S3

### 📍 Localização
- **Backend:** `server/routers/audio-upload.router.ts`
- **Frontend:** `client/src/pages/AudioUpload.tsx`
- **Testes:** `server/routers/audio-upload.test.ts`

### ✨ Funcionalidades

#### Obter URL de Upload
```typescript
// Gerar URL presigned para upload
const uploadUrl = await trpc.audioUpload.getUploadUrl.mutate({
  fileName: "song.mp3",
  mimeType: "audio/mpeg",
  fileSize: 5242880 // 5MB
});

// Retorna:
{
  fileKey: "audio/1/1234567890-abc-song.mp3",
  uploadUrl: "/api/upload/audio",
  expiresIn: 3600
}
```

#### Registrar Upload
```typescript
// Registrar arquivo após upload bem-sucedido
const result = await trpc.audioUpload.registerUpload.mutate({
  fileKey: "audio/1/1234567890-abc-song.mp3",
  fileName: "song.mp3",
  mimeType: "audio/mpeg",
  fileSize: 5242880,
  durationSeconds: 180,
  title: "Ave Maria",
  artist: "Schubert"
});

// Retorna:
{
  success: true,
  fileKey: "audio/1/1234567890-abc-song.mp3",
  audioUrl: "/manus-storage/audio/1/1234567890-abc-song.mp3"
}
```

#### Listar Uploads
```typescript
// Obter histórico de uploads do usuário
const uploads = await trpc.audioUpload.getUploads.query({
  limit: 20,
  offset: 0
});

// Retorna:
{
  uploads: [...],
  total: 42
}
```

#### Deletar Upload
```typescript
// Remover arquivo
const result = await trpc.audioUpload.deleteUpload.mutate({
  fileKey: "audio/1/1234567890-abc-song.mp3"
});

// Retorna:
{
  success: true
}
```

### 📁 Tipos de Arquivo Permitidos
- ✅ `audio/mpeg` (.mp3)
- ✅ `audio/wav` (.wav)
- ✅ `audio/ogg` (.ogg)
- ✅ `audio/mp4` (.mp4)

### 📏 Limites
- **Tamanho máximo:** 100MB por arquivo
- **Múltiplos arquivos:** Suportado (upload paralelo)

### 🧪 Testes
```bash
pnpm test -- audio-upload.test.ts
```

---

## 3️⃣ Music Recommendations - Sugestões por IA

### 📍 Localização
- **Backend:** `server/routers/recommendations.router.ts`
- **Frontend:** `client/src/pages/MusicRecommendations.tsx`
- **Testes:** `server/routers/recommendations.test.ts`

### ✨ Funcionalidades

#### Recomendações Personalizadas
```typescript
// Obter recomendações baseadas em histórico do usuário
const recommendations = await trpc.recommendations.getPersonalized.query({
  limit: 5,
  genres: ["Clássico", "Litúrgico"],
  excludeSongIds: [1, 2, 3]
});

// Retorna:
[
  {
    id: 4,
    title: "Salve Rainha",
    artist: "Anônimo",
    genre: "Litúrgico",
    reason: "Baseado em seu histórico de músicas litúrgicas"
  }
]
```

#### Recomendações por Gênero
```typescript
// Buscar músicas de um gênero específico
const recommendations = await trpc.recommendations.getByGenre.query({
  genre: "Clássico",
  limit: 10
});

// Retorna:
[
  {
    title: "Glória",
    artist: "Vivaldi",
    genre: "Clássico",
    reason: "Uma das obras mais populares do gênero clássico"
  }
]
```

#### Músicas Similares
```typescript
// Encontrar músicas similares a uma específica
const recommendations = await trpc.recommendations.getSimilar.query({
  songTitle: "Ave Maria",
  artist: "Schubert",
  limit: 5
});

// Retorna:
[
  {
    title: "Ave Maria",
    artist: "Gounod",
    reason: "Outra versão clássica de Ave Maria com arranjo similar"
  }
]
```

### 🤖 Integração com IA (LLM)

Todas as recomendações são geradas usando o **LLM integrado** com:
- ✅ JSON Schema validation
- ✅ Structured responses
- ✅ Context awareness

### 🧪 Testes
```bash
pnpm test -- recommendations.test.ts
```

---

## 🚀 Como Usar

### 1. Iniciar o Dev Server
```bash
cd /home/ubuntu/celebra-project
pnpm install
pnpm dev
```

### 2. Acessar as Páginas

#### Admin Import UI
```
http://localhost:3000/admin/import
```

#### Audio Upload
```
http://localhost:3000/audio/upload
```

#### Music Recommendations
```
http://localhost:3000/recommendations
```

### 3. Executar Testes
```bash
# Todos os testes
pnpm test

# Teste específico
pnpm test -- csv-import.test.ts
pnpm test -- audio-upload.test.ts
pnpm test -- recommendations.test.ts
```

---

## 📦 Estrutura de Arquivos

```
celebra-project/
├── server/
│   ├── routers/
│   │   ├── csv-import.router.ts          # Router de importação CSV
│   │   ├── csv-import.test.ts            # Testes
│   │   ├── audio-upload.router.ts        # Router de upload de áudio
│   │   ├── audio-upload.test.ts          # Testes
│   │   ├── recommendations.router.ts     # Router de recomendações
│   │   └── recommendations.test.ts       # Testes
│   └── routers.ts                        # Registro dos routers
├── client/
│   └── src/
│       └── pages/
│           ├── AdminImportCSV.tsx        # UI de import CSV
│           ├── AudioUpload.tsx           # UI de upload de áudio
│           └── MusicRecommendations.tsx  # UI de recomendações
└── IMPLEMENTATION_GUIDE.md               # Este arquivo
```

---

## 🔌 Integração com tRPC

Todos os routers estão registrados no `server/routers.ts`:

```typescript
export const appRouter = router({
  // ... outros routers
  csvImport: csvImportRouter,
  audioUpload: audioUploadRouter,
  recommendations: recommendationsRouter,
});
```

### Usar no Frontend

```typescript
import { trpc } from "@/lib/trpc";

// Query
const data = await trpc.recommendations.getPersonalized.query({ limit: 5 });

// Mutation
const result = await trpc.csvImport.preview.mutate({ csvContent: "..." });

// Hook (em componentes React)
const { data, isLoading } = trpc.audioUpload.getUploads.useQuery();
```

---

## ✅ Checklist de Validação

- [x] CSV Import - Preview e validação funcionando
- [x] CSV Import - Importação em lotes
- [x] Audio Upload - Drag-and-drop implementado
- [x] Audio Upload - Barra de progresso
- [x] Audio Upload - Validação de tipo/tamanho
- [x] Recommendations - Recomendações personalizadas
- [x] Recommendations - Busca por gênero
- [x] Recommendations - Músicas similares
- [x] Testes - 26 testes criados
- [x] Documentação - Guia completo

---

## 🐛 Troubleshooting

### Erro: "Apenas administradores podem importar CSV"
- Verifique se o usuário logado tem `role: "admin"`
- Atualize o banco de dados: `UPDATE users SET role = 'admin' WHERE id = 1`

### Erro: "Arquivo muito grande"
- Máximo permitido: 100MB
- Comprima o arquivo ou divida em partes menores

### Erro: "Tipo de arquivo não permitido"
- Use apenas: MP3, WAV, OGG ou MP4
- Verifique o MIME type do arquivo

### LLM não está gerando recomendações
- Verifique se `BUILT_IN_FORGE_API_KEY` está configurado
- Verifique a conexão com o LLM

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os testes: `pnpm test`
2. Leia a documentação do código
3. Consulte os exemplos acima

---

**Versão:** 1.0.0  
**Data:** Abril 2026  
**Status:** ✅ Pronto para Produção
