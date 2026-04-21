import { describe, it, expect, beforeEach, vi } from "vitest";
import { audioUploadRouter } from "./audio-upload.router";

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

describe("Audio Upload Router", () => {
  describe("getUploadUrl", () => {
    it("deve gerar URL de upload para arquivo válido", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.getUploadUrl({
        fileName: "song.mp3",
        mimeType: "audio/mpeg",
        fileSize: 5 * 1024 * 1024, // 5MB
      });

      expect(result).toHaveProperty("fileKey");
      expect(result).toHaveProperty("uploadUrl");
      expect(result).toHaveProperty("expiresIn");
      expect(result.fileKey).toContain("audio/");
      expect(result.fileKey).toContain(mockContext.user.id.toString());
    });

    it("deve rejeitar tipo de arquivo não permitido", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);

      expect(async () => {
        await caller.getUploadUrl({
          fileName: "document.pdf",
          mimeType: "application/pdf",
          fileSize: 1024,
        });
      }).rejects.toThrow();
    });

    it("deve rejeitar arquivo muito grande", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);

      expect(async () => {
        await caller.getUploadUrl({
          fileName: "song.mp3",
          mimeType: "audio/mpeg",
          fileSize: 200 * 1024 * 1024, // 200MB
        });
      }).rejects.toThrow();
    });

    it("deve aceitar todos os tipos de áudio permitidos", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const mimeTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];

      for (const mimeType of mimeTypes) {
        const result = await caller.getUploadUrl({
          fileName: `song.${mimeType.split("/")[1]}`,
          mimeType: mimeType as any,
          fileSize: 5 * 1024 * 1024,
        });

        expect(result).toHaveProperty("fileKey");
        expect(result.uploadUrl).toBeDefined();
      }
    });
  });

  describe("registerUpload", () => {
    it("deve registrar upload com sucesso", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.registerUpload({
        fileKey: "audio/1/1234567890-abc-song.mp3",
        fileName: "song.mp3",
        mimeType: "audio/mpeg",
        fileSize: 5 * 1024 * 1024,
        durationSeconds: 180,
        title: "Ave Maria",
        artist: "Schubert",
      });

      expect(result.success).toBe(true);
      expect(result.fileKey).toBeDefined();
      expect(result.audioUrl).toContain("/manus-storage/");
    });

    it("deve registrar upload sem metadados opcionais", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.registerUpload({
        fileKey: "audio/1/1234567890-abc-song.mp3",
        fileName: "song.mp3",
        mimeType: "audio/mpeg",
        fileSize: 5 * 1024 * 1024,
      });

      expect(result.success).toBe(true);
      expect(result.audioUrl).toBeDefined();
    });
  });

  describe("getUploads", () => {
    it("deve retornar lista de uploads do usuário", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.getUploads({
        limit: 20,
        offset: 0,
      });

      expect(result).toHaveProperty("uploads");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.uploads)).toBe(true);
    });

    it("deve respeitar limite e offset", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.getUploads({
        limit: 10,
        offset: 5,
      });

      expect(Array.isArray(result.uploads)).toBe(true);
    });
  });

  describe("deleteUpload", () => {
    it("deve deletar upload com sucesso", async () => {
      const caller = audioUploadRouter.createCaller(mockContext);
      const result = await caller.deleteUpload({
        fileKey: "audio/1/1234567890-abc-song.mp3",
      });

      expect(result.success).toBe(true);
    });
  });
});
