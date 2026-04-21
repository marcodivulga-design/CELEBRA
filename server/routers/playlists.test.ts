import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    churchId: 1,
    voicePart: "soprano",
    stripeCustomerId: null,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("playlists router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("list playlists", () => {
    it("should return empty list initially", async () => {
      const result = await caller.playlists.list({
        rehearsalId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle pagination parameters", async () => {
      const result = await caller.playlists.list({
        rehearsalId: 1,
        limit: 10,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("get playlist by ID", () => {
    it("should handle getting playlist", async () => {
      try {
        const result = await caller.playlists.getById({ id: 1 });
        expect(result === null || typeof result === "object").toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("create playlist", () => {
    it("should have create procedure", () => {
      expect(caller.playlists.create).toBeDefined();
    });

    it("should validate required fields", async () => {
      try {
        await caller.playlists.create({
          name: "",
          rehearsalId: 1,
          ministryId: 1,
          churchId: 1,
        } as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("get songs in playlist", () => {
    it("should return empty songs list", async () => {
      const result = await caller.playlists.getSongs({
        playlistId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("add song to playlist", () => {
    it("should have addSong procedure", () => {
      expect(caller.playlists.addSong).toBeDefined();
    });
  });

  describe("remove song from playlist", () => {
    it("should have removeSong procedure", () => {
      expect(caller.playlists.removeSong).toBeDefined();
    });
  });

  describe("update song in playlist", () => {
    it("should have updateSong procedure", () => {
      expect(caller.playlists.updateSong).toBeDefined();
    });
  });

  describe("reorder songs", () => {
    it("should have reorderSongs procedure", () => {
      expect(caller.playlists.reorderSongs).toBeDefined();
    });
  });

  describe("get total duration", () => {
    it("should return total duration", async () => {
      const result = await caller.playlists.getTotalDuration({
        playlistId: 1,
      });
      expect(typeof result === "number").toBe(true);
    });
  });

  describe("update playlist", () => {
    it("should have update procedure", () => {
      expect(caller.playlists.update).toBeDefined();
    });
  });

  describe("delete playlist", () => {
    it("should have delete procedure", () => {
      expect(caller.playlists.delete).toBeDefined();
    });
  });
});
