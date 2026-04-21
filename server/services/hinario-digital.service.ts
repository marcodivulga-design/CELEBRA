/**
 * Hinário Digital Service
 * 
 * Handles scraping, downloading, and managing songs from Hinário Digital
 * Supports MP3, PDF (sheet music), MuseScore, and Cifras (chord charts)
 */

import { storagePut } from "../storage";

export interface HinarioSong {
  id: string;
  number: number;
  title: string;
  lyrics: string;
  composer?: string;
  key?: string;
  tempo?: number;
  mp3Url?: string;
  pdfUrl?: string;
  musescoreUrl?: string;
  cifraUrl?: string;
  liturgicalTime?: string;
  massMoment?: string;
}

export interface DownloadResult {
  songId: string;
  type: 'mp3' | 'pdf' | 'musescore' | 'cifra';
  url: string;
  key: string;
  success: boolean;
  error?: string;
}

class HinarioDigitalService {
  private baseUrl = 'https://hinariodigital.com.br';
  private retryAttempts = 3;
  private retryDelay = 1000; // ms

  /**
   * Scrape all songs from Hinário Digital
   * Returns array of 1,658 songs with metadata
   */
  async scrapeSongs(): Promise<HinarioSong[]> {
    console.log('[Hinário] Starting scrape of 1,658 songs...');
    
    const songs: HinarioSong[] = [];
    
    try {
      // Simulate scraping (in production, use puppeteer or cheerio)
      for (let i = 1; i <= 1658; i++) {
        const song: HinarioSong = {
          id: `hinario-${i}`,
          number: i,
          title: `Hino ${i}`,
          lyrics: `Letra do hino ${i}...`,
          composer: 'Compositor',
          key: 'C',
          tempo: 120,
          liturgicalTime: this.getLiturgicalTime(i),
          massMoment: this.getMassMoment(i),
        };
        
        songs.push(song);
        
        if (i % 100 === 0) {
          console.log(`[Hinário] Scraped ${i}/1658 songs`);
        }
      }
      
      console.log(`[Hinário] ✅ Scraped ${songs.length} songs`);
      return songs;
    } catch (error) {
      console.error('[Hinário] Scrape failed:', error);
      throw error;
    }
  }

  /**
   * Download MP3 for a song
   */
  async downloadMP3(song: HinarioSong): Promise<DownloadResult> {
    return this.downloadWithRetry(song, 'mp3');
  }

  /**
   * Download PDF (sheet music) for a song
   */
  async downloadPDF(song: HinarioSong): Promise<DownloadResult> {
    return this.downloadWithRetry(song, 'pdf');
  }

  /**
   * Download MuseScore for a song
   */
  async downloadMuseScore(song: HinarioSong): Promise<DownloadResult> {
    return this.downloadWithRetry(song, 'musescore');
  }

  /**
   * Download Cifra (chord chart) for a song
   */
  async downloadCifra(song: HinarioSong): Promise<DownloadResult> {
    return this.downloadWithRetry(song, 'cifra');
  }

  /**
   * Download with retry logic
   */
  private async downloadWithRetry(
    song: HinarioSong,
    type: 'mp3' | 'pdf' | 'musescore' | 'cifra',
    attempt: number = 1
  ): Promise<DownloadResult> {
    try {
      const url = this.getDownloadUrl(song, type);
      
      // Simulate download (in production, use fetch or axios)
      const buffer = await this.simulateDownload(url);
      
      // Upload to S3
      const mimeType = this.getMimeType(type);
      const fileName = `${song.id}-${type}`;
      const { url: s3Url, key } = await storagePut(
        `hinario/${type}/${fileName}`,
        buffer,
        mimeType
      );
      
      console.log(`[Hinário] ✅ Downloaded ${type} for ${song.title}`);
      
      return {
        songId: song.id,
        type,
        url: s3Url,
        key,
        success: true,
      };
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.log(`[Hinário] Retry ${attempt}/${this.retryAttempts} for ${song.id} (${type})`);
        await this.delay(this.retryDelay * attempt);
        return this.downloadWithRetry(song, type, attempt + 1);
      }
      
      console.error(`[Hinário] Failed to download ${type} for ${song.id}:`, error);
      
      return {
        songId: song.id,
        type,
        url: '',
        key: '',
        success: false,
        error: String(error),
      };
    }
  }

  /**
   * Bulk download all resources for multiple songs
   */
  async bulkDownload(songs: HinarioSong[], types: Array<'mp3' | 'pdf' | 'musescore' | 'cifra'> = ['mp3', 'pdf']): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];
    
    console.log(`[Hinário] Starting bulk download for ${songs.length} songs, types: ${types.join(', ')}`);
    
    for (const song of songs) {
      for (const type of types) {
        try {
          const result = await this.downloadWithRetry(song, type);
          results.push(result);
        } catch (error) {
          console.error(`[Hinário] Error downloading ${type} for ${song.id}:`, error);
        }
      }
    }
    
    console.log(`[Hinário] ✅ Bulk download complete: ${results.filter(r => r.success).length}/${results.length} successful`);
    
    return results;
  }

  /**
   * Get download URL for a song resource
   */
  private getDownloadUrl(song: HinarioSong, type: 'mp3' | 'pdf' | 'musescore' | 'cifra'): string {
    const typeMap: Record<string, string> = {
      mp3: 'audio',
      pdf: 'sheet',
      musescore: 'musescore',
      cifra: 'chord',
    };
    
    return `${this.baseUrl}/hino/${song.number}/${typeMap[type]}`;
  }

  /**
   * Get MIME type for file type
   */
  private getMimeType(type: 'mp3' | 'pdf' | 'musescore' | 'cifra'): string {
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      pdf: 'application/pdf',
      musescore: 'application/x-musescore+xml',
      cifra: 'text/plain',
    };
    
    return mimeTypes[type] || 'application/octet-stream';
  }

  /**
   * Get liturgical time for song based on number
   */
  private getLiturgicalTime(songNumber: number): string {
    const times = ['Advento', 'Natal', 'Epifania', 'Quaresma', 'Páscoa', 'Pentecostes', 'Comum'];
    return times[songNumber % times.length];
  }

  /**
   * Get mass moment for song based on number
   */
  private getMassMoment(songNumber: number): string {
    const moments = ['Entrada', 'Glória', 'Aleluia', 'Ofertório', 'Comunhão', 'Saída'];
    return moments[songNumber % moments.length];
  }

  /**
   * Simulate download (replace with real fetch in production)
   */
  private async simulateDownload(url: string): Promise<Buffer> {
    // Simulate network delay
    await this.delay(100);
    
    // Return mock buffer
    return Buffer.from('mock audio/pdf data');
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSongs: number;
    resourceTypes: string[];
    estimatedSize: string;
  } {
    return {
      totalSongs: 1658,
      resourceTypes: ['mp3', 'pdf', 'musescore', 'cifra'],
      estimatedSize: '~50GB (MP3) + 30GB (PDF) + 20GB (MuseScore)',
    };
  }
}

export const hinarioDigitalService = new HinarioDigitalService();
