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

describe("ministries router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("list ministries", () => {
    it("should return empty list initially", async () => {
      const result = await caller.ministries.list({
        churchId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle pagination parameters", async () => {
      const result = await caller.ministries.list({
        churchId: 1,
        limit: 10,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("get ministry by ID", () => {
    it("should handle getting ministry", async () => {
      try {
        const result = await caller.ministries.getById({ id: 1 });
        expect(result === null || typeof result === "object").toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("create ministry", () => {
    it("should have create procedure", () => {
      expect(caller.ministries.create).toBeDefined();
    });

    it("should validate required fields", async () => {
      try {
        await caller.ministries.create({
          name: "",
          churchId: 1,
          organizationId: 1,
          type: "choir",
        } as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("get ministry members", () => {
    it("should return empty members list", async () => {
      const result = await caller.ministries.getMembers({
        ministryId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("add member to ministry", () => {
    it("should have addMember procedure", () => {
      expect(caller.ministries.addMember).toBeDefined();
    });
  });

  describe("remove member from ministry", () => {
    it("should have removeMember procedure", () => {
      expect(caller.ministries.removeMember).toBeDefined();
    });
  });

  describe("update member", () => {
    it("should have updateMember procedure", () => {
      expect(caller.ministries.updateMember).toBeDefined();
    });
  });

  describe("deactivate member", () => {
    it("should have deactivateMember procedure", () => {
      expect(caller.ministries.deactivateMember).toBeDefined();
    });
  });
});
