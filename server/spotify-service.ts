import { ENV } from "./_core/env";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  preview_url: string | null;
  external_urls: { spotify: string };
  duration_ms: number;
}

interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
  };
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obter access token do Spotify usando Client Credentials Flow
 */
async function getSpotifyAccessToken(): Promise<string> {
  // Verificar se o token em cache ainda é válido
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // Limpar token antigo se expirou
  if (Date.now() >= tokenExpiresAt) {
    cachedAccessToken = null;
  }

  const clientId = ENV.spotifyClientId;
  const clientSecret = ENV.spotifyClientSecret;

  if (!clientId || !clientSecret) {
    throw new Error("Credenciais do Spotify não configuradas");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Erro ao autenticar com Spotify: ${response.statusText}`);
    }

    const data = await response.json();
    cachedAccessToken = data.access_token as string;
    tokenExpiresAt = Date.now() + (data.expires_in as number) * 1000 - 60000; // Renovar 1 minuto antes

    return cachedAccessToken as string;
  } catch (error) {
    console.error("Erro ao obter access token do Spotify:", error);
    throw error;
  }
}

/**
 * Buscar músicas no Spotify por título e artista
 */
export async function searchSpotifyTracks(
  query: string,
  limit: number = 5
): Promise<SpotifyTrack[]> {
  try {
    const accessToken = await getSpotifyAccessToken();

    const searchQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar no Spotify: ${response.statusText}`);
    }

    const data: SpotifySearchResult = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Erro ao buscar músicas no Spotify:", error);
    return [];
  }
}

/**
 * Buscar artista no Spotify
 */
export async function searchSpotifyArtist(artistName: string) {
  try {
    const accessToken = await getSpotifyAccessToken();

    const searchQuery = encodeURIComponent(artistName);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar artista no Spotify: ${response.statusText}`);
    }

    const data = await response.json();
    return data.artists.items[0] || null;
  } catch (error) {
    console.error("Erro ao buscar artista no Spotify:", error);
    return null;
  }
}

/**
 * Obter detalhes de uma faixa do Spotify
 */
export async function getSpotifyTrackDetails(trackId: string) {
  try {
    const accessToken = await getSpotifyAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter detalhes da faixa: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao obter detalhes da faixa do Spotify:", error);
    return null;
  }
}

/**
 * Buscar preview de áudio de uma música
 */
export async function getSpotifyTrackPreview(
  songTitle: string,
  artistName: string
): Promise<string | null> {
  try {
    const query = `${songTitle} ${artistName}`;
    const tracks = await searchSpotifyTracks(query, 1);

    if (tracks.length === 0) {
      return null;
    }

    const track = tracks[0];
    return track.preview_url; // Pode ser null se não houver preview
  } catch (error) {
    console.error("Erro ao obter preview do Spotify:", error);
    return null;
  }
}
