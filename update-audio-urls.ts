import * as fs from "fs";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function updateAudioUrls() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(DATABASE_URL);

    // Ler arquivo com URLs de áudio
    const audioResults = JSON.parse(
      fs.readFileSync("/tmp/audio-results.json", "utf-8")
    );

    console.log(`🎵 Updating ${audioResults.length} songs with audio URLs...`);

    // Atualizar em lotes
    const batchSize = 50;
    for (let i = 0; i < audioResults.length; i += batchSize) {
      const batch = audioResults.slice(i, i + batchSize);

      for (const song of batch) {
        const query = `
          UPDATE songs 
          SET audioUrl = ? 
          WHERE id = ?
        `;

        await connection.query(query, [song.audioUrl, song.id]);
      }

      console.log(
        `✅ Updated ${Math.min(i + batchSize, audioResults.length)}/${audioResults.length} songs`
      );
    }

    console.log("✅ All audio URLs updated successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error updating audio URLs:", error);
    process.exit(1);
  }
}

updateAudioUrls();
