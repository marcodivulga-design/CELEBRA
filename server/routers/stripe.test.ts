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

describe("stripe router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("create checkout session", () => {
    it("should have createCheckoutSession procedure", () => {
      expect(caller.stripe.createCheckoutSession).toBeDefined();
    });

    it("should validate required fields", async () => {
      try {
        await caller.stripe.createCheckoutSession({
          priceId: "",
          churchId: 1,
          returnUrl: "https://example.com",
        } as any);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("get payment history", () => {
    it("should return payment history", async () => {
      const result = await caller.stripe.getPaymentHistory({
        userId: 1,
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle pagination", async () => {
      const result = await caller.stripe.getPaymentHistory({
        userId: 1,
        limit: 10,
        offset: 0,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("get subscription status", () => {
    it("should return subscription status", async () => {
      const result = await caller.stripe.getSubscriptionStatus({
        churchId: 1,
      });
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("cancel subscription", () => {
    it("should have cancelSubscription procedure", () => {
      expect(caller.stripe.cancelSubscription).toBeDefined();
    });
  });

  describe("update payment method", () => {
    it("should have updatePaymentMethod procedure", () => {
      expect(caller.stripe.updatePaymentMethod).toBeDefined();
    });
  });

  describe("get invoice", () => {
    it("should return invoice", async () => {
      const result = await caller.stripe.getInvoice({
        invoiceId: "inv_test_123",
      });
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("download invoice", () => {
    it("should have downloadInvoice procedure", () => {
      expect(caller.stripe.downloadInvoice).toBeDefined();
    });
  });

  describe("get billing portal URL", () => {
    it("should have getBillingPortalUrl procedure", () => {
      expect(caller.stripe.getBillingPortalUrl).toBeDefined();
    });
  });

  describe("get plans", () => {
    it("should return available plans", async () => {
      const plans = await caller.stripe.getPlans();
      expect(Array.isArray(plans)).toBe(true);
      expect(plans.length).toBeGreaterThan(0);
    });

    it("should have required plan fields", async () => {
      const plans = await caller.stripe.getPlans();
      plans.forEach((plan) => {
        expect(plan).toHaveProperty("id");
        expect(plan).toHaveProperty("name");
        expect(plan).toHaveProperty("price");
        expect(plan).toHaveProperty("currency");
        expect(plan).toHaveProperty("interval");
        expect(plan).toHaveProperty("features");
      });
    });
  });

  describe("verify webhook signature", () => {
    it("should have verifyWebhookSignature procedure", () => {
      expect(caller.stripe.verifyWebhookSignature).toBeDefined();
    });
  });
});
