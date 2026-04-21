import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  searchSpotifyTracks,
  getSpotifyTrackPreview,
} from "../spotify-service";
import { searchYouTubeVideos } from "../youtube-service";

export const spotifyRouter = router({
  /**
   * Buscar músicas no Spotify
   */
  searchTracks: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query é obrigatória"),
        limit: z.number().int().min(1).max(50).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const tracks = await searchSpotifyTracks(input.query, input.limit);
        return {
          success: true,
          tracks: tracks.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0]?.name || "Desconhecido",
            album: track.album.name,
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
            duration: track.duration_ms,
            image: track.album.images[0]?.url,
          })),
        };
      } catch (error) {
        console.error("Erro ao buscar no Spotify:", error);
        return {
          success: false,
          tracks: [],
          error: "Erro ao buscar no Spotify",
        };
      }
    }),

  /**
   * Obter preview de áudio de uma música
   */
  getPreview: publicProcedure
    .input(
      z.object({
        songTitle: z.string().min(1),
        artistName: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const previewUrl = await getSpotifyTrackPreview(
          input.songTitle,
          input.artistName
        );
        return {
          success: true,
          previewUrl,
        };
      } catch (error) {
        console.error("Erro ao obter preview:", error);
        return {
          success: false,
          previewUrl: null,
          error: "Erro ao obter preview",
        };
      }
    }),

  /**
   * Buscar vídeos no YouTube
   */
  searchYouTube: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query é obrigatória"),
        limit: z.number().int().min(1).max(50).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await searchYouTubeVideos(input.query, input.limit);
        return {
          success: !result.error,
          videos: result.videos,
          error: result.error,
        };
      } catch (error) {
        console.error("Erro ao buscar no YouTube:", error);
        return {
          success: false,
          videos: [],
          error: "Erro ao buscar no YouTube",
        };
      }
    }),
});
