import axios from "axios";

interface SongAudio {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
  source?: string;
  previewUrl?: string;
}

// Spotify API - Buscar preview
async function searchSpotify(title: string, artist: string): Promise<string | null> {
  try {
    // Nota: Em produção, você precisaria de Client ID e Secret
    // Para teste, vamos usar a API pública do Spotify
    const query = encodeURIComponent(`${title} ${artist}`);
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer test_token`, // Placeholder
        },
      }
    );

    const track = response.data?.tracks?.items?.[0];
    if (track?.preview_url) {
      console.log(`  ✅ Spotify: ${track.name} (${track.preview_url.substring(0, 50)}...)`);
      return track.preview_url;
    }
  } catch (error) {
    // Spotify requer autenticação
  }
  return null;
}

// YouTube - Buscar usando yt-dlp
async function searchYouTube(title: string, artist: string): Promise<string | null> {
  try {
    const { execSync } = require("child_process");
    const query = `${title} ${artist} lyrics`;
    
    // Tentar buscar com yt-dlp
    try {
      const result = execSync(
        `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --get-url "ytsearch:${query}" 2>/dev/null | head -1`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] }
      ).trim();

      if (result && result.startsWith("http")) {
        console.log(`  ✅ YouTube: ${result.substring(0, 50)}...`);
        return result;
      }
    } catch (e) {
      // yt-dlp não instalado
    }

    // Fallback: Usar YouTube Data API (requer API key)
    const query_encoded = encodeURIComponent(`${title} ${artist}`);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query_encoded}&type=video&key=test_key`
    );

    const video = response.data?.items?.[0];
    if (video?.id?.videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      console.log(`  ✅ YouTube: ${videoUrl}`);
      return videoUrl;
    }
  } catch (error) {
    // YouTube API requer autenticação
  }
  return null;
}

// Testar com as primeiras 10 músicas
async function testAudioSearch() {
  const testSongs = [
    { id: 60001, title: "Glória a Deus", artist: "Comunidade Católica" },
    { id: 60002, title: "Senhor Tende Piedade", artist: "Coral Paroquial" },
    { id: 60003, title: "Santo, Santo, Santo", artist: "Grupo Vocal" },
    { id: 60004, title: "Cordeiro de Deus", artist: "Cantores Católicos" },
    { id: 60005, title: "Pão da Vida", artist: "Comunidade de Fé" },
    { id: 60006, title: "Vinde a Mim", artist: "Coral Católico" },
    { id: 60007, title: "Cantai ao Senhor", artist: "Grupo de Louvor" },
    { id: 60008, title: "Deus é Amor", artist: "Cantores Litúrgicos" },
    { id: 60009, title: "Louvor e Glória", artist: "Grupo Vocal Católico" },
    { id: 60010, title: "Ressurreição", artist: "Cantores de Fé" },
  ];

  console.log("🎵 Testando busca de áudio no Spotify e YouTube...\n");

  const results: SongAudio[] = [];

  for (const song of testSongs) {
    console.log(`\n📍 Buscando: ${song.title} - ${song.artist}`);

    // Tentar Spotify
    let audioUrl = await searchSpotify(song.title, song.artist);
    let source = "spotify";

    // Se não encontrou no Spotify, tentar YouTube
    if (!audioUrl) {
      audioUrl = await searchYouTube(song.title, song.artist);
      source = "youtube";
    }

    if (!audioUrl) {
      console.log(`  ❌ Não encontrado`);
    }

    results.push({
      ...song,
      audioUrl: audioUrl || undefined,
      source: audioUrl ? source : undefined,
    });
  }

  console.log("\n\n📊 Resultados:");
  console.log(JSON.stringify(results, null, 2));

  // Estatísticas
  const found = results.filter((r) => r.audioUrl).length;
  console.log(`\n✅ Encontrados: ${found}/${results.length}`);
}

testAudioSearch().catch(console.error);
