import { getSongsData } from "./server/songs-data";
import * as fs from "fs";
import * as path from "path";

interface SongAudio {
  id: number;
  title: string;
  artist: string;
  audioUrl?: string;
  source?: string;
}

async function generateTextToSpeech(
  title: string,
  artist: string
): Promise<string | null> {
  try {
    const text = `${title} by ${artist}`;
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=pt-BR&client=tw-ob`;
  } catch (error) {
    console.error(`TTS generation error for ${title}:`, error);
  }
  return null;
}

async function main() {
  const songs = getSongsData();
  const results: SongAudio[] = [];

  console.log(`🎵 Generating TTS audio for ${songs.length} songs...`);

  // Processar todas as 500 músicas
  for (let i = 0; i < songs.length; i++) {
    const song: any = songs[i];
    const url = await generateTextToSpeech(song.title, song.artist);

    results.push({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audioUrl: url,
      source: "tts",
    });

    if ((i + 1) % 50 === 0) {
      console.log(`Progress: ${i + 1}/${songs.length}`);
    }
  }

  // Salvar resultados
  const outputPath = path.join("/tmp", "audio-results-full.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Results saved to ${outputPath}`);
  console.log(`Total: ${results.length}`);
  console.log(`Generated: ${results.filter((r) => r.audioUrl).length}`);
}

main().catch(console.error);
