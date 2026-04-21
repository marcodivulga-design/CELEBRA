import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { celebrations, celebrationSongs, songs } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export interface CreateCelebrationInput {
  title: string;
  description?: string;
  date: Date;
  type: "missa" | "palavra" | "batizado" | "casamento" | "funeral" | "vigilia" | "outro";
  location?: string;
  createdBy: number;
}

export interface UpdateCelebrationInput {
  title?: string;
  description?: string;
  date?: Date;
  type?: string;
  location?: string;
  status?: "draft" | "scheduled" | "completed" | "cancelled";
}

export interface AddSongInput {
  songId: number;
  order: number;
  moment?: string;
  transposition?: number;
}

export class CelebrationsService {
  private db: Awaited<ReturnType<typeof getDb>>;

  constructor(db: Awaited<ReturnType<typeof getDb>>) {
    this.db = db;
  }

  async create(input: CreateCelebrationInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const result = await this.db.insert(celebrations).values({
        title: input.title,
        description: input.description,
        date: new Date(input.date).toISOString(),
        type: input.type,
        location: input.location,
        createdBy: input.createdBy,
      });

      const celebrationId = (result as any).insertId;
      return { id: celebrationId, ...input };
    } catch (error) {
      console.error("Erro ao criar celebração:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar celebração",
      });
    }
  }

  async getAll(limit = 50, offset = 0) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(celebrations)
        .orderBy(desc(celebrations.date))
        .limit(limit)
        .offset(offset);

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar celebrações:", error);
      return [];
    }
  }

  async getById(id: number) {
    if (!this.db) return null;

    try {
      const result = await this.db
        .select()
        .from(celebrations)
        .where(eq(celebrations.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar celebração:", error);
      return null;
    }
  }

  async update(id: number, input: UpdateCelebrationInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const updateData: Record<string, unknown> = {};

      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.date !== undefined) updateData.date = input.date;
      if (input.type !== undefined) updateData.type = input.type;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.status !== undefined) updateData.status = input.status;

      if (Object.keys(updateData).length === 0) {
        return this.getById(id);
      }

      await this.db.update(celebrations).set(updateData).where(eq(celebrations.id, id));

      return this.getById(id);
    } catch (error) {
      console.error("Erro ao atualizar celebração:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao atualizar celebração",
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
      await this.db.delete(celebrations).where(eq(celebrations.id, id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar celebração:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao deletar celebração",
      });
    }
  }

  async addSong(celebrationId: number, input: AddSongInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      // Verificar se celebração existe
      const celebration = await this.getById(celebrationId);
      if (!celebration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Celebração não encontrada",
        });
      }

      // Verificar se música existe
      const song = await this.db
        .select()
        .from(songs)
        .where(eq(songs.id, input.songId))
        .limit(1);

      if (!song[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Música não encontrada",
        });
      }

      const result = await this.db.insert(celebrationSongs).values({
        celebrationId,
        songId: input.songId,
        order: input.order,
        moment: input.moment,
        transposition: input.transposition || 0,
      });

      return { success: true, celebrationSongId: (result as any).insertId };
    } catch (error) {
      console.error("Erro ao adicionar música à celebração:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao adicionar música",
      });
    }
  }

  async removeSong(celebrationId: number, songId: number) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      await this.db
        .delete(celebrationSongs)
        .where(
          and(
            eq(celebrationSongs.celebrationId, celebrationId),
            eq(celebrationSongs.songId, songId)
          )
        );

      return { success: true };
    } catch (error) {
      console.error("Erro ao remover música da celebração:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao remover música",
      });
    }
  }

  async getSongs(celebrationId: number) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select({
          id: celebrationSongs.id,
          songId: celebrationSongs.songId,
          order: celebrationSongs.order,
          moment: celebrationSongs.moment,
          transposition: celebrationSongs.transposition,
          title: songs.title,
          artist: songs.artist,
          lyrics: songs.lyrics,
          chords: songs.chords,
        })
        .from(celebrationSongs)
        .innerJoin(songs, eq(celebrationSongs.songId, songs.id))
        .where(eq(celebrationSongs.celebrationId, celebrationId));

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar músicas da celebração:", error);
      return [];
    }
  }
}
