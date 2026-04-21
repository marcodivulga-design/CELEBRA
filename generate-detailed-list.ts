import { getSongsData } from "./server/songs-data";
import * as fs from "fs";

async function generateDetailedList() {
  const songs = getSongsData();

  // Gerar arquivo Markdown detalhado
  let markdown = "# 🎵 LISTA DETALHADA DE MÚSICAS PARA DOWNLOAD\n\n";
  markdown += `**Total de músicas:** ${songs.length}\n\n`;
  markdown += "---\n\n";

  songs.forEach((song: any, index: number) => {
    markdown += `## ${index + 1}. ${song.title}\n\n`;
    markdown += `**ID:** \`${song.id}\`\n\n`;
    markdown += `**Cantor/Artista:** ${song.artist}\n\n`;
    markdown += `**Época Litúrgica:** ${song.liturgicalTime || "Não especificada"}\n\n`;
    markdown += `**Parte da Missa:** ${song.massMoment || "Não especificada"}\n\n`;

    if (song.lyrics) {
      markdown += `### 📝 Letra\n\n\`\`\`\n${song.lyrics}\n\`\`\`\n\n`;
    } else {
      markdown += `### 📝 Letra\n\nNão disponível\n\n`;
    }

    if (song.chords) {
      markdown += `### 🎸 Cifras\n\n\`\`\`\n${song.chords}\n\`\`\`\n\n`;
    } else {
      markdown += `### 🎸 Cifras\n\nNão disponível\n\n`;
    }

    markdown += `---\n\n`;
  });

  // Salvar arquivo
  const outputPath = "/tmp/LISTA_DETALHADA_MUSICAS.md";
  fs.writeFileSync(outputPath, markdown);

  console.log(`✅ Lista detalhada gerada: ${outputPath}`);
  console.log(`📊 Total de músicas: ${songs.length}`);
  console.log(`📄 Tamanho do arquivo: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Também gerar CSV com todas as informações
  let csv =
    "ID,Título,Artista,Época Litúrgica,Parte da Missa,Letra (primeiras 100 chars),Cifras (primeiras 100 chars)\n";

  songs.forEach((song: any) => {
    const lyrics = song.lyrics ? song.lyrics.substring(0, 100).replace(/"/g, '""') : "";
    const chords = song.chords ? song.chords.substring(0, 100).replace(/"/g, '""') : "";

    csv += `${song.id},"${song.title.replace(/"/g, '""')}","${song.artist.replace(/"/g, '""')}","${song.liturgicalTime || ""}","${song.massMoment || ""}","${lyrics}","${chords}"\n`;
  });

  const csvPath = "/tmp/LISTA_DETALHADA_MUSICAS.csv";
  fs.writeFileSync(csvPath, csv);

  console.log(`✅ CSV detalhado gerado: ${csvPath}`);

  // Gerar arquivo de texto com resumo por música
  let txt = "🎵 LISTA DETALHADA DE MÚSICAS PARA DOWNLOAD\n";
  txt += "=".repeat(80) + "\n\n";

  songs.forEach((song: any, index: number) => {
    txt += `${index + 1}. ${song.title}\n`;
    txt += "-".repeat(80) + "\n";
    txt += `ID: ${song.id}\n`;
    txt += `Cantor/Artista: ${song.artist}\n`;
    txt += `Época Litúrgica: ${song.liturgicalTime || "Não especificada"}\n`;
    txt += `Parte da Missa: ${song.massMoment || "Não especificada"}\n`;
    txt += "\n";

    if (song.lyrics) {
      txt += "LETRA:\n";
      txt += song.lyrics.substring(0, 500) + (song.lyrics.length > 500 ? "\n[...continua...]" : "") + "\n";
    }

    if (song.chords) {
      txt += "\nCIFRAS:\n";
      txt += song.chords.substring(0, 500) + (song.chords.length > 500 ? "\n[...continua...]" : "") + "\n";
    }

    txt += "\n" + "=".repeat(80) + "\n\n";
  });

  const txtPath = "/tmp/LISTA_DETALHADA_MUSICAS.txt";
  fs.writeFileSync(txtPath, txt);

  console.log(`✅ TXT detalhado gerado: ${txtPath}`);

  // Gerar também um JSON para fácil importação
  const jsonData = songs.map((song: any) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    liturgicalTime: song.liturgicalTime,
    massMoment: song.massMoment,
    lyrics: song.lyrics,
    chords: song.chords,
  }));

  const jsonPath = "/tmp/LISTA_DETALHADA_MUSICAS.json";
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

  console.log(`✅ JSON gerado: ${jsonPath}`);

  console.log("\n📁 Arquivos gerados:");
  console.log(`  - ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`  - ${csvPath}`);
  console.log(`  - ${txtPath}`);
  console.log(`  - ${jsonPath}`);
}

generateDetailedList().catch(console.error);
