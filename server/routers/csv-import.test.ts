import { describe, it, expect, beforeEach, vi } from "vitest";
import { csvImportRouter } from "./csv-import.router";
import { TRPCError } from "@trpc/server";

// Mock do contexto
const mockContext = {
  user: {
    id: 1,
    role: "admin",
    openId: "test-user",
    email: "admin@test.com",
    name: "Admin User",
    loginMethod: "manus",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
};

const mockNonAdminContext = {
  ...mockContext,
  user: { ...mockContext.user, role: "user" },
};

describe("CSV Import Router", () => {
  describe("preview", () => {
    it("deve validar CSV com dados corretos", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
Glória,Vivaldi,Clássico,05:15`;

      const caller = csvImportRouter.createCaller(mockContext);
      const result = await caller.preview({ csvContent });

      expect(result.totalRows).toBe(2);
      expect(result.validRows).toBe(2);
      expect(result.invalidRows).toBe(0);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].isValid).toBe(true);
    });

    it("deve detectar linhas inválidas", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
,Vivaldi,Clássico,05:15
Aleluia,Handel,,06:00`;

      const caller = csvImportRouter.createCaller(mockContext);
      const result = await caller.preview({ csvContent });

      expect(result.totalRows).toBe(3);
      expect(result.validRows).toBe(1);
      expect(result.invalidRows).toBe(2);
      expect(result.rows[1].isValid).toBe(false);
      expect(result.rows[1].errors.length).toBeGreaterThan(0);
      expect(result.rows[2].isValid).toBe(false);
      expect(result.rows[2].errors.length).toBeGreaterThan(0);
    });

    it("deve validar formato de duração MM:SS", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,4:30
Glória,Vivaldi,Clássico,05:15
Aleluia,Handel,Clássico,invalid`;

      const caller = csvImportRouter.createCaller(mockContext);
      const result = await caller.preview({ csvContent });

      expect(result.rows[2].isValid).toBe(false);
      expect(result.rows[2].errors.length).toBeGreaterThan(0);
    });

    it("deve rejeitar se não for admin", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30`;

      const caller = csvImportRouter.createCaller(mockNonAdminContext);

      try {
        await caller.preview({ csvContent });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve rejeitar CSV vazio", async () => {
      const csvContent = "";

      const caller = csvImportRouter.createCaller(mockContext);

      try {
        await caller.preview({ csvContent });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve rejeitar CSV sem cabeçalho", async () => {
      const csvContent = `Ave Maria,Schubert,Clássico,04:30`;

      const caller = csvImportRouter.createCaller(mockContext);

      try {
        await caller.preview({ csvContent });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("import", () => {
    it("deve importar CSV com sucesso", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
Glória,Vivaldi,Clássico,05:15`;

      const caller = csvImportRouter.createCaller(mockContext);
      const result = await caller.import({ csvContent, skipInvalid: true });

      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(2);
      expect(result.skippedCount).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it("deve pular linhas inválidas quando skipInvalid=true", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
,Vivaldi,Clássico,05:15
Aleluia,Handel,Clássico,06:00`;

      const caller = csvImportRouter.createCaller(mockContext);
      const result = await caller.import({ csvContent, skipInvalid: true });

      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(2);
      expect(result.skippedCount).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("deve rejeitar se houver erro e skipInvalid=false", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30
,Vivaldi,Clássico,05:15`;

      const caller = csvImportRouter.createCaller(mockContext);

      try {
        await caller.import({ csvContent, skipInvalid: false });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("deve rejeitar se não for admin (import)", async () => {
      const csvContent = `title,artist,genre,duration
Ave Maria,Schubert,Clássico,04:30`;

      const caller = csvImportRouter.createCaller(mockNonAdminContext);

      try {
        await caller.import({ csvContent });
        expect.fail("Deveria ter lançado erro");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });}
  });
});
