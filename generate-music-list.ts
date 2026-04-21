import { getSongsData } from "./server/songs-data";
import * as fs from "fs";

interface SongsByCategory {
  [key: string]: {
    [key: string]: {
      [key: string]: any[];
    };
  };
}

async function generateMusicList() {
  const songs = getSongsData();

  // Organizar por Época Litúrgica > Parte da Missa > Ano
  const organized: SongsByCategory = {};

  songs.forEach((song: any) => {
    const liturgicalTime = song.liturgicalTime || "Sem classificação";
    const massMoment = song.massMoment || "Sem classificação";
    const year = song.year || "Geral"; // Adicionar ano se existir

    if (!organized[liturgicalTime]) {
      organized[liturgicalTime] = {};
    }
    if (!organized[liturgicalTime][massMoment]) {
      organized[liturgicalTime][massMoment] = {};
    }
    if (!organized[liturgicalTime][massMoment][year]) {
      organized[liturgicalTime][massMoment][year] = [];
    }

    organized[liturgicalTime][massMoment][year].push({
      id: song.id,
      title: song.title,
      artist: song.artist,
    });
  });

  // Gerar arquivo Markdown
  let markdown = "# 🎵 LISTA DE MÚSICAS PARA DOWNLOAD\n\n";
  markdown += `Total de músicas: **${songs.length}**\n\n`;
  markdown += "---\n\n";

  Object.keys(organized)
    .sort()
    .forEach((liturgicalTime) => {
      markdown += `## 📅 ${liturgicalTime}\n\n`;

      Object.keys(organized[liturgicalTime])
        .sort()
        .forEach((massMoment) => {
          markdown += `### ⛪ ${massMoment}\n\n`;

          Object.keys(organized[liturgicalTime][massMoment])
            .sort()
            .forEach((year) => {
              const songList = organized[liturgicalTime][massMoment][year];
              markdown += `#### Ano ${year}\n\n`;
              markdown += "| # | Título | Artista | ID |\n";
              markdown += "|---|--------|---------|----|\n";

              songList.forEach((song, index) => {
                markdown += `| ${index + 1} | ${song.title} | ${song.artist} | ${song.id} |\n`;
              });

              markdown += "\n";
            });
        });
    });

  // Salvar arquivo
  const outputPath = "/tmp/LISTA_MUSICAS_PARA_DOWNLOAD.md";
  fs.writeFileSync(outputPath, markdown);

  console.log(`✅ Lista gerada: ${outputPath}`);
  console.log(`📊 Total de músicas: ${songs.length}`);

  // Também gerar CSV para facilitar
  let csv = "ID,Título,Artista,Época Litúrgica,Parte da Missa,Ano\n";

  songs.forEach((song: any) => {
    const liturgicalTime = song.liturgicalTime || "Sem classificação";
    const massMoment = song.massMoment || "Sem classificação";
    const year = song.year || "Geral";

    csv += `${song.id},"${song.title}","${song.artist}","${liturgicalTime}","${massMoment}","${year}"\n`;
  });

  const csvPath = "/tmp/LISTA_MUSICAS_PARA_DOWNLOAD.csv";
  fs.writeFileSync(csvPath, csv);

  console.log(`✅ CSV gerado: ${csvPath}`);

  // Gerar também um arquivo de texto simples
  let txt = "🎵 LISTA DE MÚSICAS PARA DOWNLOAD\n";
  txt += "=".repeat(50) + "\n\n";

  Object.keys(organized)
    .sort()
    .forEach((liturgicalTime) => {
      txt += `\n📅 ${liturgicalTime}\n`;
      txt += "-".repeat(50) + "\n";

      Object.keys(organized[liturgicalTime])
        .sort()
        .forEach((massMoment) => {
          txt += `\n⛪ ${massMoment}\n`;

          Object.keys(organized[liturgicalTime][massMoment])
            .sort()
            .forEach((year) => {
              const songList = organized[liturgicalTime][massMoment][year];
              txt += `\n  Ano ${year}:\n`;

              songList.forEach((song, index) => {
                txt += `  ${index + 1}. ${song.title} - ${song.artist} (ID: ${song.id})\n`;
              });
            });
        });
    });

  const txtPath = "/tmp/LISTA_MUSICAS_PARA_DOWNLOAD.txt";
  fs.writeFileSync(txtPath, txt);

  console.log(`✅ TXT gerado: ${txtPath}`);

  console.log("\n📁 Arquivos gerados:");
  console.log(`  - ${outputPath}`);
  console.log(`  - ${csvPath}`);
  console.log(`  - ${txtPath}`);
}

generateMusicList().catch(console.error);
