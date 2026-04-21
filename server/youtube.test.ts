import { describe, it, expect } from "vitest";

describe("YouTube API Configuration", () => {
  it("should have YOUTUBE_API_KEY configured", () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it("should have valid YouTube API key format", () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    // YouTube API keys are typically alphanumeric strings
    expect(apiKey).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("should be able to construct YouTube API URL", () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=test&key=${apiKey}`;
    expect(searchUrl).toContain("googleapis.com");
    expect(searchUrl).toContain("youtube/v3");
    expect(searchUrl).toContain(apiKey);
  });
});
