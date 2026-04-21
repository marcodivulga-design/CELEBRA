import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

describe("tRPC Hooks Integration Tests", () => {
  let db: any;
  let caller: any;

  beforeAll(async () => {
    db = await getDb();
    const user: AuthenticatedUser = {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
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
      req: {} as any,
      res: {} as any,
    };
    caller = appRouter.createCaller(ctx);
  });

  describe("Daily Reflection Router", () => {
    it.skip("should fetch today's reflection", async () => {
      const reflection = await caller.dailyReflection.getToday();
      expect(reflection).toBeDefined();
      if (reflection) {
        expect(reflection).toHaveProperty("title");
        expect(reflection).toHaveProperty("verse");
        expect(reflection).toHaveProperty("meditation");
      }
    });

    it.skip("should list reflections", async () => {
      const reflections = await caller.dailyReflection.list({ limit: 5 });
      expect(Array.isArray(reflections)).toBe(true);
      if (reflections.length > 0) {
        expect(reflections[0]).toHaveProperty("title");
        expect(reflections[0]).toHaveProperty("createdAt");
      }
    });
  });

  describe("Catholic News Router", () => {
    it.skip("should list news articles", async () => {
      const news = await caller.catholicNews.list({ limit: 10 });
      expect(Array.isArray(news)).toBe(true);
      if (news.length > 0) {
        expect(news[0]).toHaveProperty("title");
        expect(news[0]).toHaveProperty("content");
      }
    });

    it.skip("should filter news by category", async () => {
      const news = await caller.catholicNews.list({
        category: "Vaticano",
        limit: 5,
      });
      expect(Array.isArray(news)).toBe(true);
    });

    it.skip("should get news by ID", async () => {
      const newsList = await caller.catholicNews.list({ limit: 1 });
      if (newsList.length > 0) {
        const article = await caller.catholicNews.getById({ id: newsList[0].id });
        expect(article).toBeDefined();
        expect(article.id).toBe(newsList[0].id);
      }
    });
  });

  describe("Forum Router", () => {
    it.skip("should list forum topics", async () => {
      const topics = await caller.forum.listTopics({ limit: 10 });
      expect(Array.isArray(topics)).toBe(true);
      if (topics.length > 0) {
        expect(topics[0]).toHaveProperty("title");
        expect(topics[0]).toHaveProperty("content");
      }
    });

    it.skip("should get posts for a topic", async () => {
      const topics = await caller.forum.listTopics({ limit: 1 });
      if (topics.length > 0) {
        const posts = await caller.forum.getPosts({ topicId: topics[0].id });
        expect(Array.isArray(posts)).toBe(true);
      }
    });

    it.skip("should create a new forum topic", async () => {
      const result = await caller.forum.createTopic({
        title: "Test Topic",
        content: "This is a test topic",
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id");
    });

    it.skip("should create a new forum post", async () => {
      const topics = await caller.forum.listTopics({ limit: 1 });
      if (topics.length > 0) {
        const result = await caller.forum.createPost({
          topicId: topics[0].id,
          content: "Test post content",
        });
        expect(result).toBeDefined();
        expect(result).toHaveProperty("id");
      }
    });
  });

  describe("Gamification Router", () => {
    it.skip("should get user gamification stats", async () => {
      const stats = await caller.gamification.getUserStats({
        userId: "test-user-123",
      });
      expect(stats).toBeDefined();
      if (stats) {
        expect(stats).toHaveProperty("points");
        expect(stats).toHaveProperty("level");
      }
    });

    it.skip("should get leaderboard", async () => {
      const leaderboard = await caller.gamification.getLeaderboard({ limit: 10 });
      expect(Array.isArray(leaderboard)).toBe(true);
    });

    it.skip("should get user badges", async () => {
      const badges = await caller.gamification.getUserBadges({
        userId: "test-user-123",
      });
      expect(Array.isArray(badges)).toBe(true);
    });

    it.skip("should get spiritual challenges", async () => {
      const challenges = await caller.gamification.getChallenges();
      expect(Array.isArray(challenges)).toBe(true);
      if (challenges.length > 0) {
        expect(challenges[0]).toHaveProperty("title");
        expect(challenges[0]).toHaveProperty("description");
      }
    });

    it.skip("should join a challenge", async () => {
      const challenges = await caller.gamification.getChallenges();
      if (challenges.length > 0) {
        const result = await caller.gamification.joinChallenge({
          challengeId: challenges[0].id,
          userId: "test-user-123",
        });
        expect(result).toBeDefined();
        expect(result).toHaveProperty("success");
      }
    });
  });

  describe("Rosary Router", () => {
    it.skip("should get rosary guide", async () => {
      const guide = await caller.rosary.getGuide();
      expect(Array.isArray(guide)).toBe(true);
      if (guide.length > 0) {
        expect(guide[0]).toHaveProperty("title");
        expect(guide[0]).toHaveProperty("description");
      }
    });

    it.skip("should get user rosary progress", async () => {
      const progress = await caller.rosary.getUserProgress({
        userId: "test-user-123",
      });
      expect(progress).toBeDefined();
      if (progress) {
        expect(progress).toHaveProperty("rosariesCompleted");
      }
    });

    it.skip("should update rosary progress", async () => {
      const result = await caller.rosary.updateProgress({
        userId: "test-user-123",
        mysteryIndex: 0,
        completed: true,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty("success");
    });
  });

  describe("Music Aggregation Router", () => {
    it.skip("should search for music", async () => {
      const results = await caller.musicAggregation.search({
        query: "Ave Maria",
      });
      expect(Array.isArray(results)).toBe(true);
    });

    it.skip("should get music suggestions for celebration", async () => {
      const suggestions = await caller.musicAggregation.getSuggestions({
        celebrationType: "Missa",
        liturgicalTime: "Natal",
      });
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  afterAll(async () => {
    // Cleanup if needed
  });
});
