import { ENV } from "./_core/env";

interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  url: string;
}

interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  error?: string;
}

/**
 * Buscar vídeos no YouTube
 */
export async function searchYouTubeVideos(
  query: string,
  maxResults: number = 5
): Promise<YouTubeSearchResult> {
  try {
    if (!ENV.youtubeApiKey) {
      return {
        videos: [],
        error: "YouTube API Key não configurada",
      };
    }

    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("q", query);
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("maxResults", maxResults.toString());
    searchUrl.searchParams.append("key", ENV.youtubeApiKey);
    searchUrl.searchParams.append("videoEmbeddable", "true");

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API Error:", errorData);
      return {
        videos: [],
        error: `YouTube API Error: ${response.status}`,
      };
    }

    const data = await response.json();

    const videos: YouTubeVideo[] = (data.items || []).map(
      (item: Record<string, any>) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      })
    );

    return { videos };
  } catch (error) {
    console.error("Erro ao buscar no YouTube:", error);
    return {
      videos: [],
      error: "Erro ao buscar no YouTube",
    };
  }
}

/**
 * Obter URL de áudio do YouTube (usando yt-dlp ou similar)
 * Nota: Esta é uma implementação simplificada
 */
export async function getYouTubeAudioUrl(videoId: string): Promise<string> {
  try {
    // Retornar URL do vídeo (em produção, usar yt-dlp para extrair áudio)
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error("Erro ao obter áudio do YouTube:", error);
    throw error;
  }
}

/**
 * Buscar música no YouTube com fallback do Spotify
 */
export async function searchMusicMultiSource(
  title: string,
  artist: string
): Promise<{
  spotifyUrl?: string;
  youtubeUrl?: string;
  previewUrl?: string;
}> {
  const query = `${title} ${artist}`;

  // Buscar no YouTube
  const youtubeResult = await searchYouTubeVideos(query, 1);

  return {
    youtubeUrl: youtubeResult.videos[0]?.url,
  };
}
