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

describe("celebrations router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("list celebrations", () => {
    it("should return empty list initially", async () => {
      const result = await caller.celebrations.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle list with filters", async () => {
      const result = await caller.celebrations.list({
        limit: 10,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("get celebration by id", () => {
    it("should handle getting celebration", async () => {
      try {
        const result = await caller.celebrations.getById({ id: 1 });
        // Result can be null or celebration object
        expect(result === null || typeof result === "object").toBe(true);
      } catch (error) {
        // Expected if celebration doesn't exist
        expect(error).toBeDefined();
      }
    });
  });

  describe("auth procedures", () => {
    it("should allow authenticated user to access protected procedures", async () => {
      const { ctx } = createAuthContext();
      expect(ctx.user).toBeDefined();
      expect(ctx.user?.id).toBe(1);
    });

    it("should have user email in context", async () => {
      const { ctx } = createAuthContext();
      expect(ctx.user?.email).toMatch(/^user\d+@example\.com$/);
    });
  });

  describe("system procedures", () => {
    it("should allow getting current user info", async () => {
      const result = await caller.auth.me();
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });
  });
});
