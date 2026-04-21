import axios from "axios";
import { getSongsData } from "./server/songs-data";

interface SearchResult {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
  source?: "spotify" | "youtube";
  previewUrl?: string;
}

// Spotify - Buscar preview (30 segundos)
async function searchSpotify(title: string, artist: string): Promise<string | null> {
  try {
    // Para teste, usaremos a API pública do Spotify
    // Em produção, seria necessário autenticação OAuth
    const query = encodeURIComponent(`${title} ${artist}`);
    
    // Nota: Spotify requer autenticação para acesso real
    // Este é um placeholder que mostraria como seria
    console.log(`  🔍 Spotify: Buscando "${title}" por ${artist}...`);
    
    // Retorna null por enquanto (requer credenciais)
    return null;
  } catch (error) {
    return null;
  }
}

// YouTube - Buscar vídeo com áudio
async function searchYouTube(title: string, artist: string): Promise<string | null> {
  try {
    // Construir query de busca
    const query = `${title} ${artist} música completa`;
    const encodedQuery = encodeURIComponent(query);
    
    console.log(`  🔍 YouTube: Buscando "${title}"...`);
    
    // Nota: YouTube requer API key para busca
    // Este é um placeholder
    // URL de exemplo: https://www.youtube.com/results?search_query=...
    
    return null;
  } catch (error) {
    return null;
  }
}

// Fallback: Gerar URL genérica
function generateFallbackUrl(title: string, artist: string, id: number): string {
  // Retorna URL de busca do YouTube como fallback
  const query = encodeURIComponent(`${title} ${artist}`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

async function searchAudio() {
  const songs = getSongsData();
  
  console.log(`\n🎵 Iniciando busca de áudios para ${songs.length} músicas...\n`);
  
  const results: SearchResult[] = [];
  let found = 0;
  let notFound = 0;

  for (const song of songs) {
    console.log(`\n📍 [${results.length + 1}/${songs.length}] ${song.title} - ${song.artist}`);

    // Tentar Spotify
    let audioUrl = await searchSpotify(song.title, song.artist);
    let source: "spotify" | "youtube" | undefined = "spotify";

    // Se não encontrou no Spotify, tentar YouTube
    if (!audioUrl) {
      audioUrl = await searchYouTube(song.title, song.artist);
      source = "youtube";
    }

    // Se não encontrou em nenhum lugar, usar fallback
    if (!audioUrl) {
      audioUrl = generateFallbackUrl(song.title, song.artist, song.id);
      source = undefined;
      console.log(`  ⚠️  Fallback: ${audioUrl.substring(0, 60)}...`);
      notFound++;
    } else {
      console.log(`  ✅ Encontrado (${source}): ${audioUrl.substring(0, 60)}...`);
      found++;
    }

    results.push({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audioUrl,
      source,
    });

    // Pequeno delay para não sobrecarregar as APIs
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n\n📊 Resultados:`);
  console.log(`  ✅ Encontrados: ${found}`);
  console.log(`  ⚠️  Fallback: ${notFound}`);
  console.log(`  📊 Total: ${results.length}`);

  // Salvar resultados
  const fs = require("fs");
  const outputPath = "/tmp/audio-search-results.json";
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n💾 Resultados salvos em: ${outputPath}`);

  return results;
}

searchAudio().catch(console.error);
