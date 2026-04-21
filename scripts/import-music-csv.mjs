#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import Catholic Music CSV into CELEBRA Database
 */

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const records = lines.slice(1).map(line => {
    // Simple CSV parser for quoted values
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/"/g, ''));
    
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || '';
    });
    return record;
  });
  
  return records;
}

async function importMusicCSV(csvPath) {
  console.log('\n🎵 CELEBRA - Music CSV Importer');
  console.log('='.repeat(60));

  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    console.log(`✅ Read CSV file: ${csvPath}`);

    // Parse CSV
    const records = parseCSV(csvContent);
    console.log(`✅ Parsed ${records.length} records from CSV`);

    // Transform records for database
    const songs = records.map((record, idx) => ({
      id: `song-${Date.now()}-${idx}`,
      title: record.title,
      artist: record.artist,
      composer: record.composer || null,
      genre: record.genre,
      massFunction: record.massFunction,
      liturgicalTime: record.liturgicalTime,
      source: record.source,
      hasAudio: record.hasAudio === 'true',
      duration: parseInt(record.duration) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Generate import script
    const importScript = generateImportSQL(songs);
    const scriptPath = path.join(__dirname, '..', 'import-songs.sql');
    fs.writeFileSync(scriptPath, importScript);

    console.log(`\n✅ Generated SQL import script: ${scriptPath}`);
    console.log(`\n📊 IMPORT SUMMARY:`);
    console.log(`  Total Songs: ${songs.length}`);
    console.log(`  By Genre:`);
    const genreCount = {};
    songs.forEach((s) => {
      genreCount[s.genre] = (genreCount[s.genre] || 0) + 1;
    });
    Object.entries(genreCount).forEach(([genre, count]) => {
      console.log(`    - ${genre}: ${count}`);
    });

    console.log(`\n  By Mass Function:`);
    const momentCount = {};
    songs.forEach((s) => {
      momentCount[s.massFunction] = (momentCount[s.massFunction] || 0) + 1;
    });
    Object.entries(momentCount).forEach(([moment, count]) => {
      console.log(`    - ${moment}: ${count}`);
    });

    console.log(`\n✅ Import preparation complete!`);
    console.log(`\n📝 Next steps:`);
    console.log(`  1. Review the generated SQL script: ${scriptPath}`);
    console.log(`  2. Execute via: mysql -u root -p < ${scriptPath}`);
    console.log(`  3. Or use tRPC endpoint: catholicMusic.importBatch`);

    return songs;
  } catch (error) {
    console.error(`❌ Error importing CSV: ${error.message}`);
    process.exit(1);
  }
}

function generateImportSQL(songs) {
  const values = songs
    .map(
      (s) =>
        `('${s.id}', '${s.title.replace(/'/g, "\\'")}', '${s.artist.replace(/'/g, "\\'")}', '${s.composer ? s.composer.replace(/'/g, "\\'") : ''}', '${s.genre}', '${s.massFunction}', '${s.liturgicalTime}', '${s.source}', ${s.hasAudio ? 1 : 0}, ${s.duration}, NOW(), NOW())`
    )
    .join(',\n  ');

  return `-- CELEBRA Catholic Music Import
-- Generated: ${new Date().toISOString()}
-- Total Songs: ${songs.length}

INSERT INTO aggregatedSongs (
  id,
  title,
  artist,
  composer,
  genre,
  massFunction,
  liturgicalTime,
  source,
  hasAudio,
  duration,
  createdAt,
  updatedAt
) VALUES
  ${values};

-- Verify import
SELECT COUNT(*) as total_songs FROM aggregatedSongs;
SELECT genre, COUNT(*) as count FROM aggregatedSongs GROUP BY genre;
SELECT massFunction, COUNT(*) as count FROM aggregatedSongs GROUP BY massFunction;
`;
}

// Run importer
const csvPath = path.join(__dirname, '..', 'catholic-music-database.csv');
await importMusicCSV(csvPath);
