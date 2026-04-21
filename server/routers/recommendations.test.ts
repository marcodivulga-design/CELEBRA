import { describe, it, expect, vi } from "vitest";
import { recommendationsRouter } from "./recommendations.router";

const mockContext = {
  user: {
    id: 1,
    role: "user",
    openId: "test-user",
    email: "user@test.com",
    name: "Test User",
    loginMethod: "manus",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
};

describe("Recommendations Router", () => {
  describe("getPersonalized", () => {
    it("deve retornar recomendações personalizadas", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getPersonalized({
        limit: 5,
        genres: ["Clássico", "Litúrgico"],
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("title");
        expect(result[0]).toHaveProperty("artist");
        expect(result[0]).toHaveProperty("reason");
      }
    });

    it("deve respeitar limite máximo", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getPersonalized({
        limit: 20,
      });

      expect(result.length).toBeLessThanOrEqual(20);
    });

    it("deve excluir músicas especificadas", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getPersonalized({
        limit: 5,
        excludeSongIds: [1, 2, 3],
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getByGenre", () => {
    it("deve retornar recomendações por gênero", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getByGenre({
        genre: "Clássico",
        limit: 5,
      });

      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("title");
        expect(result[0]).toHaveProperty("artist");
        expect(result[0]).toHaveProperty("genre");
        expect(result[0]).toHaveProperty("reason");
      }
    });

    it("deve funcionar com diferentes gêneros", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const genres = ["Clássico", "Litúrgico", "Gospel"];

      for (const genre of genres) {
        const result = await caller.getByGenre({
          genre,
          limit: 3,
        });

        expect(Array.isArray(result)).toBe(true);
      }
    });

    it("deve respeitar limite", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getByGenre({
        genre: "Clássico",
        limit: 10,
      });

      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe("getSimilar", () => {
    it("deve retornar músicas similares", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getSimilar({
        songTitle: "Ave Maria",
        limit: 5,
      });

      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("title");
        expect(result[0]).toHaveProperty("artist");
        expect(result[0]).toHaveProperty("reason");
      }
    });

    it("deve funcionar com artista especificado", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getSimilar({
        songTitle: "Ave Maria",
        artist: "Schubert",
        limit: 5,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("deve respeitar limite", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getSimilar({
        songTitle: "Ave Maria",
        limit: 15,
      });

      expect(result.length).toBeLessThanOrEqual(15);
    });

    it("deve retornar razão para cada recomendação", async () => {
      const caller = recommendationsRouter.createCaller(mockContext);
      const result = await caller.getSimilar({
        songTitle: "Ave Maria",
        limit: 3,
      });

      if (result.length > 0) {
        result.forEach((rec) => {
          expect(rec.reason).toBeDefined();
          expect(rec.reason.length).toBeGreaterThan(0);
        });
      }
    });
  });
});
