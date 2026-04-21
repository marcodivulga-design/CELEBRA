import { getSongsData } from "./server/songs-data";
import * as fs from "fs";
import * as path from "path";

interface SongAudio {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
  source?: string; // spotify, youtube, pixabay, tts
}

async function searchSpotifyPreview(
  title: string,
  artist: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_TOKEN || ""}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = (await response.json()) as any;
    if (data.tracks?.items?.[0]?.preview_url) {
      return data.tracks.items[0].preview_url;
    }
  } catch (error) {
    console.error(`Spotify search error for ${title}:`, error);
  }
  return null;
}

async function searchYouTubeAudio(
  title: string,
  artist: string
): Promise<string | null> {
  try {
    // Usar yt-dlp para buscar no YouTube
    const query = `${title} ${artist} lyrics`;
    console.log(`Searching YouTube for: ${query}`);

    // Placeholder - em produção usaria yt-dlp ou youtube-dl
    // const result = await execSync(`yt-dlp -f bestaudio --get-url "ytsearch:${query}"`);
    // return result.toString().trim();

    return null; // Por enquanto retorna null
  } catch (error) {
    console.error(`YouTube search error for ${title}:`, error);
  }
  return null;
}

async function searchPixabayMusic(
  title: string,
  artist: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${artist}`);
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${process.env.PIXABAY_KEY || ""}&q=${query}&per_page=1`
    );

    if (!response.ok) return null;

    const data = (await response.json()) as any;
    if (data.hits?.[0]?.videos?.medium?.url) {
      return data.hits[0].videos.medium.url;
    }
  } catch (error) {
    console.error(`Pixabay search error for ${title}:`, error);
  }
  return null;
}

async function generateTextToSpeech(
  title: string,
  artist: string
): Promise<string | null> {
  try {
    // Usar API de TTS gratuita como Google Translate ou similar
    const text = `${title} by ${artist}`;
    const encodedText = encodeURIComponent(text);

    // Google Translate TTS URL (funciona sem autenticação)
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=pt-BR&client=tw-ob`;
  } catch (error) {
    console.error(`TTS generation error for ${title}:`, error);
  }
  return null;
}

async function findAudioForSong(
  title: string,
  artist: string
): Promise<{ url: string | null; source: string }> {
  console.log(`Finding audio for: ${title} - ${artist}`);

  // Tentar Spotify primeiro
  let url = await searchSpotifyPreview(title, artist);
  if (url) {
    console.log(`  ✅ Found on Spotify`);
    return { url, source: "spotify" };
  }

  // Tentar Pixabay
  url = await searchPixabayMusic(title, artist);
  if (url) {
    console.log(`  ✅ Found on Pixabay`);
    return { url, source: "pixabay" };
  }

  // Tentar YouTube (placeholder)
  url = await searchYouTubeAudio(title, artist);
  if (url) {
    console.log(`  ✅ Found on YouTube`);
    return { url, source: "youtube" };
  }

  // Fallback para TTS
  url = await generateTextToSpeech(title, artist);
  if (url) {
    console.log(`  ✅ Generated TTS`);
    return { url, source: "tts" };
  }

  console.log(`  ❌ No audio found`);
  return { url: null, source: "none" };
}

async function main() {
  const songs = getSongsData();
  const results: SongAudio[] = [];

  console.log(`🎵 Searching for audio for ${songs.length} songs...`);
  console.log("This may take a few minutes...\n");

  // Processar em lotes de 10 para evitar rate limiting
  for (let i = 0; i < songs.length; i += 10) {
    const batch = songs.slice(i, i + 10);

    const batchResults = await Promise.all(
      batch.map(async (song: any) => {
        const { url, source } = await findAudioForSong(song.title, song.artist);
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          audioUrl: url,
          source,
        };
      })
    );

    results.push(...batchResults);

    console.log(`Progress: ${Math.min(i + 10, songs.length)}/${songs.length}`);

    // Delay entre lotes para evitar rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Salvar resultados
  const outputPath = path.join("/tmp", "audio-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Results saved to ${outputPath}`);

  // Estatísticas
  const stats = {
    total: results.length,
    found: results.filter((r) => r.audioUrl).length,
    spotify: results.filter((r) => r.source === "spotify").length,
    pixabay: results.filter((r) => r.source === "pixabay").length,
    youtube: results.filter((r) => r.source === "youtube").length,
    tts: results.filter((r) => r.source === "tts").length,
    notFound: results.filter((r) => !r.audioUrl).length,
  };

  console.log("\n📊 Statistics:");
  console.log(`  Total: ${stats.total}`);
  console.log(`  Found: ${stats.found} (${((stats.found / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  Spotify: ${stats.spotify}`);
  console.log(`  Pixabay: ${stats.pixabay}`);
  console.log(`  YouTube: ${stats.youtube}`);
  console.log(`  TTS: ${stats.tts}`);
  console.log(`  Not found: ${stats.notFound}`);
}

main().catch(console.error);
