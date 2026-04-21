import { getDb } from '../db';
import { aggregatedSongs } from '../../drizzle/schema';

export class SpotifyMusicService {
  private static readonly SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
  private static accessToken: string | null = null;

  /**
   * Initialize Spotify API with credentials
   */
  static async initialize(clientId: string, clientSecret: string) {
    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json() as any;
      this.accessToken = data.access_token;
      return true;
    } catch (error) {
      console.error('Error initializing Spotify:', error);
      return false;
    }
  }

  /**
   * Search songs on Spotify
   */
  static async searchSongs(query: string, limit = 20) {
    if (!this.accessToken) {
      console.error('Spotify not initialized');
      return [];
    }

    try {
      const response = await fetch(
        `${this.SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const data = await response.json() as any;
      
      return data.tracks?.items?.map((track: any) => ({
        title: track.name,
        artist: track.artists?.[0]?.name || 'Unknown',
        source: 'spotify',
        sourceUrl: track.external_urls?.spotify,
        spotifyId: track.id,
        previewUrl: track.preview_url,
        imageUrl: track.album?.images?.[0]?.url,
        duration: Math.floor(track.duration_ms / 1000),
      })) || [];
    } catch (error) {
      console.error('Error searching Spotify:', error);
      return [];
    }
  }

  /**
   * Get track details from Spotify
   */
  static async getTrackDetails(spotifyId: string) {
    if (!this.accessToken) {
      console.error('Spotify not initialized');
      return null;
    }

    try {
      const response = await fetch(
        `${this.SPOTIFY_API_BASE}/tracks/${spotifyId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const track = await response.json() as any;
      
      return {
        title: track.name,
        artist: track.artists?.[0]?.name,
        spotifyId: track.id,
        previewUrl: track.preview_url,
        imageUrl: track.album?.images?.[0]?.url,
        duration: Math.floor(track.duration_ms / 1000),
        externalUrl: track.external_urls?.spotify,
      };
    } catch (error) {
      console.error('Error fetching track details:', error);
      return null;
    }
  }

  /**
   * Save Spotify song to database
   */
  static async saveSongToDatabase(spotifyData: any) {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const result = await db.insert(aggregatedSongs).values({
        title: spotifyData.title,
        artist: spotifyData.artist,
        source: 'spotify',
        sourceId: spotifyData.spotifyId || '',
        duration: spotifyData.duration || 0,
      });

      return result;
    } catch (error) {
      console.error('Error saving Spotify song:', error);
      throw error;
    }
  }

  /**
   * Get preview URL for a track
   */
  static async getPreviewUrl(spotifyId: string) {
    const track = await this.getTrackDetails(spotifyId);
    return track?.previewUrl || null;
  }

  /**
   * Search Catholic music on Spotify
   */
  static async searchCatholicMusic(query: string, limit = 20) {
    const searchQuery = `${query} católico OR religioso OR litúrgico`;
    return await this.searchSongs(searchQuery, limit);
  }
}
