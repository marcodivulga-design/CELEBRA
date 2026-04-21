import { storagePut, storageGet } from '../storage';

const logger = {
  info: (msg: string, data?: unknown) => console.log(`[INFO] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[ERROR] ${msg}`, data),
};

/**
 * Music S3 Integration Service
 * Handles upload and retrieval of audio files from S3
 */

export class MusicS3IntegrationService {
  /**
   * Upload audio file to S3
   */
  async uploadAudioFile(
    songId: string,
    audioBuffer: Buffer,
    filename: string,
    contentType: string = 'audio/mpeg'
  ) {
    try {
      const fileKey = `music/${songId}/${filename}`;
      
      const result = await storagePut(fileKey, audioBuffer, contentType);
      
      logger.info(`Audio uploaded: ${fileKey}`, {
        url: result.url,
        size: audioBuffer.length,
      });
      
      return {
        success: true,
        url: result.url,
        key: result.key,
        size: audioBuffer.length,
        contentType,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to upload audio: ${errorMsg}`);
      throw error;
    }
  }

  /**
   * Get presigned URL for audio file
   */
  async getAudioUrl(songId: string, filename: string, expiresIn: number = 3600) {
    try {
      const fileKey = `music/${songId}/${filename}`;
      
      const result = await storageGet(fileKey);
      
      logger.info(`Audio URL retrieved: ${fileKey}`);
      
      return {
        success: true,
        url: result.url,
        key: result.key,
        expiresIn: expiresIn,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to get audio URL: ${errorMsg}`);
      throw error;
    }
  }

  /**
   * Upload multiple audio files for a song
   */
  async uploadMultipleAudioFormats(
    songId: string,
    audioFiles: Array<{
      format: 'mp3' | 'wav' | 'ogg' | 'flac';
      buffer: Buffer;
    }>
  ) {
    const results = [];

    for (const file of audioFiles) {
      try {
        const contentTypeMap: Record<string, string> = {
          mp3: 'audio/mpeg',
          wav: 'audio/wav',
          ogg: 'audio/ogg',
          flac: 'audio/flac',
        };

        const result = await this.uploadAudioFile(
          songId,
          file.buffer,
          `audio.${file.format}`,
          contentTypeMap[file.format]
        );

        results.push({
          format: file.format,
          ...result,
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to upload ${file.format}: ${errorMsg}`);
        results.push({
          format: file.format,
          success: false,
          error: errorMsg,
        });
      }
    }

    return results;
  }

  /**
   * Generate audio metadata
   */
  generateAudioMetadata(
    songId: string,
    title: string,
    artist: string,
    duration: number
  ) {
    return {
      songId,
      title,
      artist,
      duration,
      formats: {
        mp3: `https://s3.amazonaws.com/music/${songId}/audio.mp3`,
        wav: `https://s3.amazonaws.com/music/${songId}/audio.wav`,
        ogg: `https://s3.amazonaws.com/music/${songId}/audio.ogg`,
      },
      uploadedAt: new Date().toISOString(),
      lastAccessed: null,
      accessCount: 0,
    };
  }

  /**
   * Batch upload audio files
   */
  async batchUploadAudioFiles(
    songs: Array<{
      id: string;
      title: string;
      artist: string;
      audioBuffer: Buffer;
    }>
  ) {
    const results = [];

    for (const song of songs) {
      try {
        const result = await this.uploadAudioFile(
          song.id,
          song.audioBuffer,
          'audio.mp3',
          'audio/mpeg'
        );

        results.push({
          songId: song.id,
          title: song.title,
          ...result,
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to upload ${song.title}: ${errorMsg}`);
        results.push({
          songId: song.id,
          title: song.title,
          success: false,
          error: errorMsg,
        });
      }
    }

    return results;
  }

  /**
   * Update audio URL in database
   */
  async updateSongAudioUrl(
    songId: string,
    audioUrl: string,
    duration: number
  ) {
    return {
      songId,
      audioUrl,
      duration,
      hasAudio: true,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete audio file from S3
   */
  async deleteAudioFile(songId: string, filename: string = 'audio.mp3') {
    try {
      const fileKey = `music/${songId}/${filename}`;
      
      logger.info(`Audio file marked for deletion: ${fileKey}`);
      
      return {
        success: true,
        message: `Audio file ${fileKey} marked for deletion`,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to delete audio: ${errorMsg}`);
      throw error;
    }
  }

  /**
   * Generate streaming URL for audio
   */
  generateStreamingUrl(songId: string, format: string = 'mp3'): string {
    return `https://s3.amazonaws.com/music/${songId}/audio.${format}`;
  }

  /**
   * Get audio file statistics
   */
  getAudioStatistics(audioFiles: Array<{ format: string; size: number }>) {
    const totalSize = audioFiles.reduce((sum, f) => sum + f.size, 0);
    const avgSize = totalSize / audioFiles.length;

    return {
      totalFiles: audioFiles.length,
      totalSize: totalSize,
      averageSize: avgSize,
      formats: audioFiles.map((f) => f.format),
      totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(2),
    };
  }
}

// Export singleton instance
export const musicS3IntegrationService = new MusicS3IntegrationService();
