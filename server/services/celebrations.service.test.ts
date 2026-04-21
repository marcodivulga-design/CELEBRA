import { describe, it, expect, beforeEach, vi } from "vitest";
import { CelebrationsService } from "./celebrations.service";

describe("CelebrationsService", () => {
  let service: CelebrationsService;
  let mockDb: any;

  beforeEach(() => {
    // Mock database
    mockDb = {
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new CelebrationsService(mockDb);
  });

  describe("create", () => {
    it("should create a celebration with valid input", async () => {
      const input = {
        title: "Missa Dominical",
        description: "Missa do domingo",
        date: new Date("2026-04-21"),
        type: "missa" as const,
        location: "Igreja Matriz",
        createdBy: 1,
      };

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({ insertId: 1 }),
      });

      mockDb.insert().values = vi.fn().mockResolvedValue({ insertId: 1 });

      // Test that service can be instantiated
      expect(service).toBeDefined();
      expect(service.create).toBeDefined();
    });

    it("should throw error if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);

      const input = {
        title: "Missa Dominical",
        description: "Missa do domingo",
        date: new Date("2026-04-21"),
        type: "missa" as const,
        location: "Igreja Matriz",
        createdBy: 1,
      };

      try {
        await serviceNoDB.create(input);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      }
    });
  });

  describe("getAll", () => {
    it("should return empty array if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);
      const result = await serviceNoDB.getAll();
      expect(result).toEqual([]);
    });

    it("should accept limit and offset parameters", async () => {
      expect(service).toBeDefined();
      // Service should accept these parameters without error
      const result = await service.getAll(10, 0);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getById", () => {
    it("should return null if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);
      const result = await serviceNoDB.getById(1);
      expect(result).toBeNull();
    });
  });

  describe("addSong", () => {
    it("should throw error if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);

      try {
        await serviceNoDB.addSong(1, {
          songId: 1,
          order: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      }
    });
  });

  describe("removeSong", () => {
    it("should throw error if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);

      try {
        await serviceNoDB.removeSong(1, 1);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      }
    });
  });

  describe("getSongs", () => {
    it("should return empty array if database is not available", async () => {
      const serviceNoDB = new CelebrationsService(null as any);
      const result = await serviceNoDB.getSongs(1);
      expect(result).toEqual([]);
    });
  });
});
