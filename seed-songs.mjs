import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { getSongsData } from "./server/songs-data.js";

const DATABASE_URL = process.env.DATABASE_URL;

async function seedSongs() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("🎵 Iniciando seed de 500 músicas com letra, cifra e áudio...");

    // Pegar dados das 500 músicas
    const songs = getSongsData();

    // Gerar letra, cifra e áudio para cada música
    const songsWithData = songs.map((song, index) => {
      // Gerar letra simples baseada no título
      const lyrics = `${song.title}

Verso 1:
${song.title}
Cantamos com alegria
Louvamos o Senhor
Com toda a harmonia

Verso 2:
${song.artist}
Nos une em comunhão
Celebramos a fé
Com puro coração

Refrão:
Glória, glória, glória
Ao Senhor nosso Deus
Que nos guia e nos protege
Sempre em nossos caminhos`;

      // Gerar cifras simples
      const chords = `[G] ${song.title}
[G] Verso 1:
[G] ${song.title}
[D] Cantamos com alegria
[A] Louvamos o Senhor
[D] Com toda a harmonia

[G] Verso 2:
[G] ${song.artist}
[D] Nos une em comunhão
[A] Celebramos a fé
[D] Com puro coração

[G] Refrão:
[D] Glória, glória, glória
[A] Ao Senhor nosso Deus
[D] Que nos guia e nos protege
[G] Sempre em nossos caminhos`;

      // Gerar URL de áudio (usando um serviço de texto-para-fala ou placeholder)
      const audioUrl = `https://example.com/audio/${song.id}.mp3`;

      return {
        id: song.id,
        title: song.title,
        artist: song.artist,
        massMoment: song.massMoment,
        liturgicalTime: song.liturgicalTime,
        lyrics,
        chords,
        audioUrl,
        isPublic: true,
      };
    });

    // Inserir em lotes de 50
    const batchSize = 50;
    for (let i = 0; i < songsWithData.length; i += batchSize) {
      const batch = songsWithData.slice(i, i + batchSize);
      
      // Usar INSERT IGNORE para evitar duplicatas
      const query = `
        INSERT IGNORE INTO songs 
        (id, title, artist, massMoment, liturgicalTime, lyrics, chords, audioUrl, isPublic)
        VALUES ?
      `;

      const values = batch.map(song => [
        song.id,
        song.title,
        song.artist,
        song.massMoment,
        song.liturgicalTime,
        song.lyrics,
        song.chords,
        song.audioUrl,
        song.isPublic ? 1 : 0,
      ]);

      await connection.query(query, [values]);
      console.log(`✅ Inseridas ${Math.min(i + batchSize, songsWithData.length)}/${songsWithData.length} músicas`);
    }

    console.log("✅ Seed concluído com sucesso!");
    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seedSongs();
