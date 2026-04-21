import { getDb } from '../db';
import { aggregatedSongs } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Catholic Music Collector Service
 * 
 * Intelligent system for collecting, validating, and classifying
 * Catholic liturgical music from trusted sources
 */

export interface CatholicSongData {
  title: string;
  artist: string;
  composer?: string;
  genre?: 'liturgica' | 'louvor' | 'coral' | 'instrumental';
  massFunction?: 'entrada' | 'ato_penitencial' | 'gloria' | 'salmo' | 'ofertorio' | 'santo' | 'comunhao' | 'final';
  liturgicalTime?: 'comum' | 'advento' | 'natal' | 'quaresma' | 'pascoa' | 'pentecostes' | 'mariano' | 'funerario' | 'batizado';
  lyrics?: string;
  cifra?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  source: string;
  sourceId?: string;
  license: string;
  duration?: number;
  hasAudio?: boolean;
  hasSheet?: boolean;
  hasCifra?: boolean;
  hasMuseScore?: boolean;
  downloadable?: boolean;
  modifiable?: boolean;
  commercialUse?: boolean;
}

export class CatholicMusicCollectorService {
  /**
   * Trusted sources for Catholic music
   */
  private trustedSources = {
    liturgical: [
      'musicanaliturgia.com.br',
      'folhetosdecanto.com',
      'portalkairos.org',
      'liturgia.pt',
      'cnbb.org.br',
    ],
    modern: [
      'palcomp3.com',
      'youtube.com',
    ],
    openAudio: [
      'pixabay.com/music',
    ],
  };

  /**
   * Liturgical moments classification
   */
  private momentoKeywords = {
    entrada: ['entrada', 'processional', 'opening'],
    ato_penitencial: ['penitencial', 'confiteor', 'kyrie', 'misericórdia'],
    gloria: ['glória', 'gloria', 'gloria a deus'],
    salmo: ['salmo', 'responsório', 'psalm'],
    ofertorio: ['ofertório', 'ofertorio', 'apresentação'],
    santo: ['santo', 'sanctus', 'hosana'],
    comunhao: ['comunhão', 'comunion', 'eucaristia'],
    final: ['final', 'recessional', 'despedida', 'encerramento'],
  };

  /**
   * Liturgical time classification
   */
  private tempoLiturgico = {
    comum: ['comum', 'ordinário'],
    advento: ['advento', 'advent'],
    natal: ['natal', 'christmas', 'noel'],
    quaresma: ['quaresma', 'lent', 'cinzas'],
    pascoa: ['páscoa', 'easter', 'ressurreição'],
    pentecostes: ['pentecostes', 'pentecost', 'espírito santo'],
    mariano: ['maria', 'marian', 'nossa senhora'],
    funerario: ['fúnebre', 'funeral', 'defunto'],
    batizado: ['batizado', 'batismo', 'baptism'],
  };

  /**
   * Classify music genre based on content
   */
  classifyGenre(title: string): CatholicSongData['genre'] {
    const lower = title.toLowerCase();
    
    if (lower.includes('instrumental') || lower.includes('orquestra')) {
      return 'instrumental';
    }
    if (lower.includes('coral') || lower.includes('coro')) {
      return 'coral';
    }
    if (lower.includes('louvor') || lower.includes('adoração')) {
      return 'louvor';
    }
    
    return 'liturgica';
  }

  /**
   * Classify liturgical moment (mass function)
   */
  classifyMassFunction(title: string, lyrics?: string): CatholicSongData['massFunction'] {
    const searchText = `${title} ${lyrics || ''}`.toLowerCase();
    
    for (const [momento, keywords] of Object.entries(this.momentoKeywords)) {
      if (keywords.some(kw => searchText.includes(kw))) {
        return momento as CatholicSongData['massFunction'];
      }
    }
    
    return undefined;
  }

  /**
   * Classify liturgical time
   */
  classifyLiturgicalTime(title: string): CatholicSongData['liturgicalTime'] {
    const searchText = title.toLowerCase();
    
    for (const [tempo, keywords] of Object.entries(this.tempoLiturgico)) {
      if (keywords.some(kw => searchText.includes(kw))) {
        return tempo as CatholicSongData['liturgicalTime'];
      }
    }
    
    return 'comum';
  }

  /**
   * Validate if source is trusted
   */
  isTrustedSource(url: string): boolean {
    const allTrusted = Object.values(this.trustedSources).flat();
    return allTrusted.some(source => url.includes(source));
  }

  /**
   * Validate license for use
   */
  validateLicense(license: string): boolean {
    const validLicenses = [
      'cc0',
      'cc-by',
      'cc-by-sa',
      'public-domain',
      'open-source',
      'copyright-permission',
    ];
    
    return validLicenses.some(lic => license.toLowerCase().includes(lic));
  }

  /**
   * Check for duplicate songs
   */
  async checkDuplicate(title: string, artist: string): Promise<boolean> {
    try {
      const db = await getDb();
      if (!db) return false;
      
      const existing = await db
        .select()
        .from(aggregatedSongs)
        .where(
          and(
            eq(aggregatedSongs.title, title),
            eq(aggregatedSongs.artist, artist)
          )
        )
        .limit(1);
      
      return existing.length > 0;
    } catch (error) {
      console.error('[DUPLICATE CHECK ERROR]', error);
      return false;
    }
  }

  /**
   * Normalize song title
   */
  normalizeTitle(title: string): string {
    return title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-áéíóúãõç]/g, '');
  }

  /**
   * Save song to database
   */
  async saveSong(song: CatholicSongData): Promise<boolean> {
    try {
      const db = await getDb();
      if (!db) {
        console.log('[DATABASE] Not available');
        return false;
      }

      // Check for duplicates
      const isDuplicate = await this.checkDuplicate(song.title, song.artist);
      if (isDuplicate) {
        console.log(`[DUPLICATE] ${song.title} by ${song.artist}`);
        return false;
      }

      // Validate license
      if (!this.validateLicense(song.license)) {
        console.log(`[INVALID LICENSE] ${song.title} - ${song.license}`);
        return false;
      }

      // Insert into database
      await db.insert(aggregatedSongs).values({
        title: song.title,
        artist: song.artist,
        composer: song.composer,
        source: song.source,
        sourceId: song.sourceId,
        duration: song.duration,
        genre: song.genre,
        liturgicalTime: song.liturgicalTime,
        massFunction: song.massFunction,
        hasAudio: song.hasAudio || false,
        hasSheet: song.hasSheet || false,
        hasCifra: song.hasCifra || false,
        hasMuseScore: song.hasMuseScore || false,
        audioUrl: song.audioUrl,
        cifraUrl: song.cifra,
        downloadable: song.downloadable !== false,
        modifiable: song.modifiable !== false,
        commercialUse: song.commercialUse || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`[SAVED] ${song.title} by ${song.artist}`);
      return true;
    } catch (error) {
      console.error(`[ERROR] Failed to save ${song.title}:`, error);
      return false;
    }
  }

  /**
   * Batch save songs
   */
  async saveBatch(songs: CatholicSongData[]): Promise<{ saved: number; failed: number }> {
    let saved = 0;
    let failed = 0;

    for (const song of songs) {
      const result = await this.saveSong(song);
      if (result) {
        saved++;
      } else {
        failed++;
      }
    }

    return { saved, failed };
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<{
    total: number;
    byGenre: Record<string, number>;
    byMassFunction: Record<string, number>;
    byLiturgicalTime: Record<string, number>;
  }> {
    try {
      const db = await getDb();
      if (!db) return { total: 0, byGenre: {}, byMassFunction: {}, byLiturgicalTime: {} };
      
      const songs = await db.select().from(aggregatedSongs);
      
      const stats = {
        total: songs.length,
        byGenre: {} as Record<string, number>,
        byMassFunction: {} as Record<string, number>,
        byLiturgicalTime: {} as Record<string, number>,
      };

      for (const song of songs) {
        // Count by genre
        if (song.genre) {
          stats.byGenre[song.genre] = (stats.byGenre[song.genre] || 0) + 1;
        }
        
        // Count by mass function
        if (song.massFunction) {
          stats.byMassFunction[song.massFunction] = (stats.byMassFunction[song.massFunction] || 0) + 1;
        }
        
        // Count by liturgical time
        if (song.liturgicalTime) {
          stats.byLiturgicalTime[song.liturgicalTime] = (stats.byLiturgicalTime[song.liturgicalTime] || 0) + 1;
        }
      }

      return stats;
    } catch (error) {
      console.error('[STATS ERROR]', error);
      return {
        total: 0,
        byGenre: {},
        byMassFunction: {},
        byLiturgicalTime: {},
      };
    }
  }
}

// Export singleton instance
export const catholicMusicCollector = new CatholicMusicCollectorService();
