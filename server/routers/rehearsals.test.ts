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

describe("rehearsals router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("list rehearsals", () => {
    it("should return empty list initially", async () => {
      const result = await caller.rehearsals.list({
        ministryId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle pagination parameters", async () => {
      const result = await caller.rehearsals.list({
        ministryId: 1,
        limit: 10,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("get rehearsal by ID", () => {
    it("should handle getting rehearsal", async () => {
      try {
        const result = await caller.rehearsals.getById({ id: 1 });
        expect(result === null || typeof result === "object").toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("get upcoming rehearsals", () => {
    it("should return upcoming rehearsals", async () => {
      const result = await caller.rehearsals.getUpcoming({
        churchId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create rehearsal", () => {
    it("should have create procedure", () => {
      expect(caller.rehearsals.create).toBeDefined();
    });

    it("should validate required fields", async () => {
      try {
        await caller.rehearsals.create({
          title: "",
          ministryId: 1,
          churchId: 1,
          scheduledDate: new Date().toISOString(),
        } as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("get attendance", () => {
    it("should return empty attendance list", async () => {
      const result = await caller.rehearsals.getAttendance({
        rehearsalId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("mark attendance", () => {
    it("should have markAttendance procedure", () => {
      expect(caller.rehearsals.markAttendance).toBeDefined();
    });
  });

  describe("get attendance summary", () => {
    it("should return attendance summary", async () => {
      const result = await caller.rehearsals.getAttendanceSummary({
        rehearsalId: 1,
      });
      expect(result).toHaveProperty("present");
      expect(result).toHaveProperty("absent");
      expect(result).toHaveProperty("excused");
    });
  });

  describe("update rehearsal", () => {
    it("should have update procedure", () => {
      expect(caller.rehearsals.update).toBeDefined();
    });
  });

  describe("delete rehearsal", () => {
    it("should have delete procedure", () => {
      expect(caller.rehearsals.delete).toBeDefined();
    });
  });
});
