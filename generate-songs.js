// Gerar 500 músicas de exemplo com dados realistas
const liturgicalTimes = [
  "Comum", "Páscoa", "Natal", "Quaresma", "Semana Santa", 
  "Pentecostes", "Corpus Christi", "Assunção", "Imaculada", 
  "Epifania", "Apresentação", "Anunciação", "Visitação", 
  "Natividade", "Exaltação", "São João", "São Pedro", 
  "Santiago", "São Miguel", "Todos os Santos", "Finados"
];

const massMoments = [
  "Entrada", "Kyrie", "Glória", "Aclamação", "Ofertório", 
  "Santo", "Consagração", "Paz", "Comunhão", "Saída"
];

const artists = [
  "Tradicional", "Comunidade Católica", "Coral Paroquial", 
  "Grupo Vocal", "Cantores Católicos", "Comunidade de Fé",
  "Coral Católico", "Grupo de Louvor", "Cantores Litúrgicos",
  "Grupo Vocal Católico", "Cantores de Fé", "Comunidade de Louvor",
  "Grupo de Oração", "Cantores Contemporâneos", "Coral Moderno"
];

const songTitles = [
  "Aleluia", "Glória a Deus", "Senhor Tende Piedade", "Santo, Santo, Santo",
  "Cordeiro de Deus", "Pão da Vida", "Vinde a Mim", "Cantai ao Senhor",
  "Deus é Amor", "Louvor e Glória", "Ressurreição", "Noite Feliz",
  "Adeste Fideles", "Salve Rainha", "Ave Maria", "Magnificat",
  "Benedicto", "Domine Salvum", "Kyrie Eleison", "Agnus Dei",
  "Credo", "Ofertório", "Consagração", "Paz", "Bênção",
  "Hino Nacional", "Marcha Fúnebre", "Requiescat", "Vigília",
  "Penitência", "Ramos", "Quinta-feira Santa", "Sexta-feira Santa",
  "Sábado de Aleluia", "Pentecostes", "Corpus Christi", "Assunção",
  "Imaculada Conceição", "Epifania", "Apresentação", "Anunciação",
  "Visitação", "Natividade de Maria", "Exaltação da Cruz", "São João Batista",
  "São Pedro e Paulo", "Santiago", "São Miguel", "Todos os Santos",
  "Finados", "Celebrai com Júbilo", "Cantemos ao Senhor", "Louvai ao Senhor",
  "Ao Rei dos Reis", "Deus Está Aqui", "Alegre Cantai", "Santo é o Senhor",
  "Vamos Celebrar", "Aclame ao Senhor", "Vinde Cantemos", "Glorificai o Senhor",
  "A Alegria Está no Coração", "Este é o Dia", "Jubilosos Vos Adoramos"
];

const songs = [];
for (let i = 1; i <= 500; i++) {
  songs.push({
    id: 60000 + i,
    title: songTitles[i % songTitles.length] + (i > songTitles.length ? ` (${Math.floor(i / songTitles.length)})` : ""),
    artist: artists[i % artists.length],
    liturgicalTime: liturgicalTimes[i % liturgicalTimes.length],
    massMoment: massMoments[i % massMoments.length],
    isPublic: true
  });
}

console.log("export const SONGS_DATA = " + JSON.stringify(songs, null, 2) + ";");
console.log("\nexport function getSongsData(filters?: { churchId?: number; liturgicalTime?: string; massMoment?: string; search?: string; limit?: number; offset?: number; }) {");
console.log("  let result = [...SONGS_DATA];");
console.log("  if (filters?.liturgicalTime) result = result.filter(s => s.liturgicalTime === filters.liturgicalTime);");
console.log("  if (filters?.massMoment) result = result.filter(s => s.massMoment === filters.massMoment);");
console.log("  if (filters?.search) { const search = filters.search.toLowerCase(); result = result.filter(s => s.title.toLowerCase().includes(search) || s.artist.toLowerCase().includes(search)); }");
console.log("  const offset = filters?.offset || 0;");
console.log("  const limit = filters?.limit || 200;");
console.log("  return result.slice(offset, offset + limit);");
console.log("}");
