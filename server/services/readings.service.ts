import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { readings } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export interface CreateReadingInput {
  celebrationId: number;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  type: "primeira" | "segunda" | "evangelho" | "salmo" | "outro";
  text?: string;
  reader?: string;
}

export interface UpdateReadingInput {
  book?: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
  type?: string;
  text?: string;
  reader?: string;
}

export class ReadingsService {
  private db: Awaited<ReturnType<typeof getDb>>;

  constructor(db: Awaited<ReturnType<typeof getDb>>) {
    this.db = db;
  }

  async create(input: CreateReadingInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const result = await this.db.insert(readings).values({
        celebrationId: input.celebrationId,
        book: input.book,
        chapter: input.chapter,
        verseStart: input.verseStart,
        verseEnd: input.verseEnd,
        type: input.type,
        text: input.text,
        reader: input.reader,
      });

      const readingId = (result as any).insertId;
      return { id: readingId, ...input };
    } catch (error) {
      console.error("Erro ao criar leitura:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar leitura",
      });
    }
  }

  async getByCelebration(celebrationId: number) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(readings)
        .where(eq(readings.celebrationId, celebrationId))
        .orderBy(readings.type);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar leituras:", error);
      return [];
    }
  }

  async getById(id: number) {
    if (!this.db) return null;

    try {
      const result = await this.db
        .select()
        .from(readings)
        .where(eq(readings.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar leitura:", error);
      return null;
    }
  }

  async update(id: number, input: UpdateReadingInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const updateData: Record<string, unknown> = {};

      if (input.book !== undefined) updateData.book = input.book;
      if (input.chapter !== undefined) updateData.chapter = input.chapter;
      if (input.verseStart !== undefined) updateData.verseStart = input.verseStart;
      if (input.verseEnd !== undefined) updateData.verseEnd = input.verseEnd;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.text !== undefined) updateData.text = input.text;
      if (input.reader !== undefined) updateData.reader = input.reader;

      if (Object.keys(updateData).length === 0) {
        return this.getById(id);
      }

      await this.db.update(readings).set(updateData).where(eq(readings.id, id));

      return this.getById(id);
    } catch (error) {
      console.error("Erro ao atualizar leitura:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao atualizar leitura",
      });
    }
  }

  async delete(id: number) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      await this.db.delete(readings).where(eq(readings.id, id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar leitura:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao deletar leitura",
      });
    }
  }
}
