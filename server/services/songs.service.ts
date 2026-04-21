import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { songs } from "../../drizzle/schema";
import { eq, like, desc, and, or } from "drizzle-orm";

export interface CreateSongInput {
  title: string;
  artist: string;
  massMoment: string;
  liturgicalTime: string;
  lyrics?: string;
  chords?: string;
  audioUrl?: string;
  isPublic?: boolean;
}

export interface UpdateSongInput {
  title?: string;
  artist?: string;
  massMoment?: string;
  liturgicalTime?: string;
  lyrics?: string;
  chords?: string;
  audioUrl?: string;
  isPublic?: boolean;
}

export interface SearchSongsInput {
  query?: string;
  massMoment?: string;
  liturgicalTime?: string;
  limit?: number;
  offset?: number;
}

export class SongsService {
  private db: Awaited<ReturnType<typeof getDb>>;

  constructor(db: Awaited<ReturnType<typeof getDb>>) {
    this.db = db;
  }

  async create(input: CreateSongInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const result = await this.db.insert(songs).values({
        title: input.title,
        artist: input.artist,
        massMoment: input.massMoment,
        liturgicalTime: input.liturgicalTime,
        lyrics: input.lyrics,
        chords: input.chords,
        audioUrl: input.audioUrl,
        isPublic: (input.isPublic ?? true) ? 1 : 0,
      });

      const songId = (result as any).insertId;
      return { id: songId, ...input };
    } catch (error) {
      console.error("Erro ao criar música:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar música",
      });
    }
  }

  async getAll(limit = 50, offset = 0) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(songs)
        .where(eq(songs.isPublic, 1))
        .orderBy(desc(songs.createdAt))
        .limit(limit)
        .offset(offset);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
      return [];
    }
  }

  async getById(id: number) {
    if (!this.db) return null;

    try {
      const result = await this.db
        .select()
        .from(songs)
        .where(eq(songs.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar música:", error);
      return null;
    }
  }

  async search(input: SearchSongsInput) {
    if (!this.db) return [];

    try {
      const limit = input.limit || 50;
      const offset = input.offset || 0;
      const conditions = [eq(songs.isPublic, 1)];

      if (input.query) {
        const queryCondition = or(
          like(songs.title, `%${input.query}%`),
          like(songs.artist, `%${input.query}%`)
        );
        if (queryCondition) {
          conditions.push(queryCondition);
        }
      }

      if (input.massMoment) {
        conditions.push(eq(songs.massMoment, input.massMoment));
      }

      if (input.liturgicalTime) {
        conditions.push(eq(songs.liturgicalTime, input.liturgicalTime));
      }

      const result = await this.db
        .select()
        .from(songs)
        .where(and(...conditions))
        .orderBy(desc(songs.createdAt))
        .limit(limit)
        .offset(offset);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
      return [];
    }
  }

  async update(id: number, input: UpdateSongInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const updateData: Record<string, unknown> = {};

      if (input.title !== undefined) updateData.title = input.title;
      if (input.artist !== undefined) updateData.artist = input.artist;
      if (input.massMoment !== undefined) updateData.massMoment = input.massMoment;
      if (input.liturgicalTime !== undefined) updateData.liturgicalTime = input.liturgicalTime;
      if (input.lyrics !== undefined) updateData.lyrics = input.lyrics;
      if (input.chords !== undefined) updateData.chords = input.chords;
      if (input.audioUrl !== undefined) updateData.audioUrl = input.audioUrl;
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

      if (Object.keys(updateData).length === 0) {
        return this.getById(id);
      }

      await this.db.update(songs).set(updateData).where(eq(songs.id, id));

      return this.getById(id);
    } catch (error) {
      console.error("Erro ao atualizar música:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao atualizar música",
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
      await this.db.delete(songs).where(eq(songs.id, id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar música:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao deletar música",
      });
    }
  }

  async getByMassMoment(massMoment: string, limit = 10) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(songs)
        .where(and(eq(songs.massMoment, massMoment), eq(songs.isPublic, 1)))
        .limit(limit);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar músicas por momento:", error);
      return [];
    }
  }

  async getByLiturgicalTime(liturgicalTime: string, limit = 10) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(songs)
        .where(and(eq(songs.liturgicalTime, liturgicalTime), eq(songs.isPublic, 1)))
        .limit(limit);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar músicas por tempo litúrgico:", error);
      return [];
    }
  }
}
