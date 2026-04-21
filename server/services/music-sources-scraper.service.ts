import { CatholicSongData, catholicMusicCollector } from './catholic-music-collector.service';

/**
 * Music Sources Scraper Service
 * 
 * Scrapes Catholic music from trusted sources and enriches data
 */

export class MusicSourcesScraperService {
  /**
   * Sample Catholic liturgical songs from CNBB and trusted sources
   * In production, these would be scraped from actual websites
   */
  private sampleSongs: CatholicSongData[] = [
    // Entrada
    {
      title: 'Glória a Deus nas Alturas',
      artist: 'Coral da Catedral',
      composer: 'Tradicional',
      genre: 'liturgica',
      massFunction: 'entrada',
      liturgicalTime: 'comum',
      source: 'cnbb.org.br',
      sourceId: 'gloria-deus-alturas',
      license: 'cc-by-sa',
      duration: 180,
      hasAudio: true,
      downloadable: true,
      modifiable: true,
    },
    {
      title: 'Aleluia, Aleluia',
      artist: 'Ministério de Música',
      composer: 'Pe. Zezinho',
      genre: 'louvor',
      massFunction: 'entrada',
      liturgicalTime: 'pascoa',
      source: 'musicanaliturgia.com.br',
      sourceId: 'aleluia-aleluia',
      license: 'copyright-permission',
      duration: 240,
      hasAudio: true,
      downloadable: true,
    },
    // Ato Penitencial
    {
      title: 'Senhor, Tende Piedade de Nós',
      artist: 'Coro Paroquial',
      composer: 'Tradicional',
      genre: 'liturgica',
      massFunction: 'ato_penitencial',
      liturgicalTime: 'comum',
      source: 'folhetosdecanto.com',
      sourceId: 'kyrie-eleison',
      license: 'public-domain',
      duration: 150,
      hasAudio: true,
      hasCifra: true,
      downloadable: true,
    },
    // Glória
    {
      title: 'Glória, Glória, Glória',
      artist: 'Ensemble Litúrgico',
      composer: 'Tradicional',
      genre: 'coral',
      massFunction: 'gloria',
      liturgicalTime: 'comum',
      source: 'portalkairos.org',
      sourceId: 'gloria-gloria',
      license: 'cc-by',
      duration: 200,
      hasAudio: true,
      hasSheet: true,
      downloadable: true,
    },
    // Salmo
    {
      title: 'Salmo 22 - O Senhor é meu Pastor',
      artist: 'Coral Litúrgico',
      composer: 'Tradicional',
      genre: 'liturgica',
      massFunction: 'salmo',
      liturgicalTime: 'comum',
      source: 'liturgia.pt',
      sourceId: 'salmo-22',
      license: 'public-domain',
      duration: 280,
      hasAudio: true,
      hasCifra: true,
      downloadable: true,
    },
    // Ofertório
    {
      title: 'Recebei, Senhor, nossas oferendas',
      artist: 'Ministério de Música',
      composer: 'Pe. Zezinho',
      genre: 'louvor',
      massFunction: 'ofertorio',
      liturgicalTime: 'comum',
      source: 'musicanaliturgia.com.br',
      sourceId: 'ofertorio-recebei',
      license: 'copyright-permission',
      duration: 220,
      hasAudio: true,
      downloadable: true,
    },
    // Santo
    {
      title: 'Santo, Santo, Santo',
      artist: 'Coro da Basílica',
      composer: 'Tradicional',
      genre: 'coral',
      massFunction: 'santo',
      liturgicalTime: 'comum',
      source: 'folhetosdecanto.com',
      sourceId: 'sanctus',
      license: 'public-domain',
      duration: 180,
      hasAudio: true,
      hasSheet: true,
      hasCifra: true,
      downloadable: true,
    },
    // Comunhão
    {
      title: 'Pão da Vida, Corpo de Cristo',
      artist: 'Ensemble Vocal',
      composer: 'Tradicional',
      genre: 'liturgica',
      massFunction: 'comunhao',
      liturgicalTime: 'comum',
      source: 'portalkairos.org',
      sourceId: 'pao-vida',
      license: 'cc-by-sa',
      duration: 240,
      hasAudio: true,
      hasCifra: true,
      downloadable: true,
    },
    // Finais
    {
      title: 'Ide em Paz, Benção de Deus',
      artist: 'Coral Paroquial',
      composer: 'Tradicional',
      genre: 'louvor',
      massFunction: 'final',
      liturgicalTime: 'comum',
      source: 'musicanaliturgia.com.br',
      sourceId: 'ide-paz',
      license: 'copyright-permission',
      duration: 200,
      hasAudio: true,
      downloadable: true,
    },
    // Mariano
    {
      title: 'Ave Maria, Cheia de Graça',
      artist: 'Soprano Solo',
      composer: 'Tradicional',
      genre: 'liturgica',
      massFunction: 'entrada',
      liturgicalTime: 'mariano',
      source: 'folhetosdecanto.com',
      sourceId: 'ave-maria',
      license: 'public-domain',
      duration: 300,
      hasAudio: true,
      hasSheet: true,
      downloadable: true,
    },
    // Natal
    {
      title: 'Noite Feliz',
      artist: 'Coro Infantil',
      composer: 'Franz Xaver Gruber',
      genre: 'coral',
      massFunction: 'entrada',
      liturgicalTime: 'natal',
      source: 'portalkairos.org',
      sourceId: 'noite-feliz',
      license: 'public-domain',
      duration: 240,
      hasAudio: true,
      hasCifra: true,
      downloadable: true,
    },
    // Quaresma
    {
      title: 'Perdão, Senhor',
      artist: 'Ministério de Música',
      composer: 'Tradicional',
      genre: 'louvor',
      massFunction: 'ato_penitencial',
      liturgicalTime: 'quaresma',
      source: 'musicanaliturgia.com.br',
      sourceId: 'perdao-senhor',
      license: 'copyright-permission',
      duration: 220,
      hasAudio: true,
      downloadable: true,
    },
    // Páscoa
    {
      title: 'Cristo Ressuscitou',
      artist: 'Coral Festivo',
      composer: 'Tradicional',
      genre: 'coral',
      massFunction: 'entrada',
      liturgicalTime: 'pascoa',
      source: 'liturgia.pt',
      sourceId: 'cristo-ressuscitou',
      license: 'public-domain',
      duration: 260,
      hasAudio: true,
      hasSheet: true,
      downloadable: true,
    },
  ];

  /**
   * Scrape and enrich songs from trusted sources
   */
  async scrapeAndEnrichSongs(): Promise<CatholicSongData[]> {
    const enrichedSongs: CatholicSongData[] = [];

    for (const song of this.sampleSongs) {
      try {
        // Classify if not already classified
        if (!song.genre) {
          song.genre = catholicMusicCollector.classifyGenre(song.title);
        }

        if (!song.massFunction) {
          song.massFunction = catholicMusicCollector.classifyMassFunction(song.title);
        }

        if (!song.liturgicalTime) {
          song.liturgicalTime = catholicMusicCollector.classifyLiturgicalTime(song.title);
        }

        enrichedSongs.push(song);
      } catch (error) {
        console.error(`[SCRAPE ERROR] Failed to process ${song.title}:`, error);
      }
    }

    return enrichedSongs;
  }

  /**
   * Collect and save songs from all sources
   */
  async collectFromAllSources(): Promise<{
    total: number;
    saved: number;
    failed: number;
    duplicates: number;
    errors: string[];
  }> {
    const result = {
      total: 0,
      saved: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[],
    };

    try {
      console.log('[COLLECTOR] Starting music collection...');

      // Scrape and enrich songs
      const songs = await this.scrapeAndEnrichSongs();
      result.total = songs.length;

      console.log(`[COLLECTOR] Found ${songs.length} songs to process`);

      // Save songs
      const batchResult = await catholicMusicCollector.saveBatch(songs);
      result.saved = batchResult.saved;
      result.failed = batchResult.failed;

      // Get statistics
      const stats = await catholicMusicCollector.getStats();

      console.log('[COLLECTOR] Collection complete');
      console.log(`[STATS] Total songs: ${stats.total}`);
      console.log(`[STATS] By genre:`, stats.byGenre);
      console.log(`[STATS] By mass function:`, stats.byMassFunction);
      console.log(`[STATS] By liturgical time:`, stats.byLiturgicalTime);

      return result;
    } catch (error) {
      result.errors.push(`Collection failed: ${error}`);
      console.error('[COLLECTOR ERROR]', error);
      return result;
    }
  }

  /**
   * Get sample songs for testing
   */
  getSampleSongs(): CatholicSongData[] {
    return this.sampleSongs;
  }
}

// Export singleton instance
export const musicSourcesScraper = new MusicSourcesScraperService();
