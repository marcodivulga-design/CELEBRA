import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("spotify router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("spotify procedures", () => {
    it("should handle spotify router existence", async () => {
      expect(caller.spotify).toBeDefined();
    });

    it("should have spotify search procedure", () => {
      expect(caller.spotify.search).toBeDefined();
    });

    it("should have spotify sync procedure", () => {
      expect(caller.spotify.sync).toBeDefined();
    });
  });

  describe("music aggregation", () => {
    it("should have music aggregation router", () => {
      expect(caller.musicAggregation).toBeDefined();
    });

    it("should have search procedure in music aggregation", () => {
      expect(caller.musicAggregation.search).toBeDefined();
    });
  });

  describe("daily reflection", () => {
    it("should have daily reflection router", () => {
      expect(caller.dailyReflection).toBeDefined();
    });

    it("should have getToday procedure", () => {
      expect(caller.dailyReflection.getToday).toBeDefined();
    });
  });
});
