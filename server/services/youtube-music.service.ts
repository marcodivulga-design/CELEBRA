import { getDb } from '../db';
import { aggregatedSongs } from '../../drizzle/schema';

export class YouTubeMusicService {
  private static readonly YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
  private static apiKey: string | null = null;

  /**
   * Initialize YouTube API with API key
   */
  static initialize(apiKey: string) {
    this.apiKey = apiKey;
    return true;
  }

  /**
   * Search videos on YouTube
   */
  static async searchVideos(query: string, limit = 20) {
    if (!this.apiKey) {
      console.error('YouTube API not initialized');
      return [];
    }

    try {
      const response = await fetch(
        `${this.YOUTUBE_API_BASE}/search?` +
        `key=${this.apiKey}` +
        `&q=${encodeURIComponent(query)}` +
        `&type=video` +
        `&part=snippet` +
        `&maxResults=${limit}` +
        `&relevanceLanguage=pt`
      );

      const data = await response.json() as any;

      return data.items?.map((item: any) => ({
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        youtubeId: item.id.videoId,
        source: 'youtube',
        sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        imageUrl: item.snippet.thumbnails?.high?.url,
        description: item.snippet.description,
      })) || [];
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }

  /**
   * Get video details from YouTube
   */
  static async getVideoDetails(videoId: string) {
    if (!this.apiKey) {
      console.error('YouTube API not initialized');
      return null;
    }

    try {
      const response = await fetch(
        `${this.YOUTUBE_API_BASE}/videos?` +
        `key=${this.apiKey}` +
        `&id=${videoId}` +
        `&part=snippet,contentDetails`
      );

      const data = await response.json() as any;
      const video = data.items?.[0];

      if (!video) return null;

      // Parse duration from ISO 8601 format (PT1H23M45S)
      const duration = this.parseDuration(video.contentDetails?.duration || 'PT0S');

      return {
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        youtubeId: videoId,
        imageUrl: video.snippet.thumbnails?.high?.url,
        duration,
        description: video.snippet.description,
        externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private static parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match?.[1]?.replace('H', '') || '0') * 3600;
    const minutes = parseInt(match?.[2]?.replace('M', '') || '0') * 60;
    const seconds = parseInt(match?.[3]?.replace('S', '') || '0');
    return hours + minutes + seconds;
  }

  /**
   * Save YouTube video to database
   */
  static async saveVideoToDatabase(youtubeData: any) {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const result = await db.insert(aggregatedSongs).values({
        title: youtubeData.title,
        artist: youtubeData.artist,
        source: 'youtube',
        sourceId: youtubeData.youtubeId || '',
        duration: youtubeData.duration || 0,
      });

      return result;
    } catch (error) {
      console.error('Error saving YouTube video:', error);
      throw error;
    }
  }

  /**
   * Get embed URL for YouTube video
   */
  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Search Catholic music on YouTube
   */
  static async searchCatholicMusic(query: string, limit = 20) {
    const searchQuery = `${query} católico OR religioso OR litúrgico OR missa`;
    return await this.searchVideos(searchQuery, limit);
  }

  /**
   * Search choir music on YouTube
   */
  static async searchChoirMusic(query: string, limit = 20) {
    const searchQuery = `${query} coral OR coro OR ensemble`;
    return await this.searchVideos(searchQuery, limit);
  }
}
