import { describe, it, expect, beforeAll } from "vitest";

describe("Spotify API Integration", () => {
  let accessToken: string;

  beforeAll(async () => {
    // Testar autenticação com Spotify
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    expect(clientId).toBeDefined();
    expect(clientSecret).toBeDefined();

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

      expect(response.ok).toBe(true);
      const data = await response.json();
      accessToken = data.access_token;
      expect(accessToken).toBeDefined();
    } catch (error) {
      console.error("Erro ao autenticar com Spotify:", error);
      throw error;
    }
  });

  it("deve autenticar com sucesso usando credenciais do Spotify", () => {
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe("string");
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it("deve buscar artista no Spotify com token válido", async () => {
    if (!accessToken) {
      throw new Error("Access token não disponível");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/search?q=The%20Beatles&type=artist&limit=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.artists).toBeDefined();
    expect(data.artists.items.length).toBeGreaterThan(0);
  });

  it("deve buscar música no Spotify com token válido", async () => {
    if (!accessToken) {
      throw new Error("Access token não disponível");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/search?q=Imagine&type=track&limit=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.tracks).toBeDefined();
    expect(data.tracks.items.length).toBeGreaterThan(0);
  });
});
