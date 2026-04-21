import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { teams, teamMembers, users } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export interface CreateTeamInput {
  celebrationId: number;
  name: string;
  description?: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
}

export interface AddTeamMemberInput {
  userId: number;
  role: string;
  name?: string;
  email?: string;
}

export class TeamsService {
  private db: Awaited<ReturnType<typeof getDb>>;

  constructor(db: Awaited<ReturnType<typeof getDb>>) {
    this.db = db;
  }

  async create(input: CreateTeamInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const result = await this.db.insert(teams).values({
        celebrationId: input.celebrationId,
        name: input.name,
        description: input.description,
      });

      const teamId = (result as any).insertId;
      return { id: teamId, ...input };
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao criar equipe",
      });
    }
  }

  async getByCelebration(celebrationId: number) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(teams)
        .where(eq(teams.celebrationId, celebrationId))
        .orderBy(desc(teams.createdAt));

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      return [];
    }
  }

  async getById(id: number) {
    if (!this.db) return null;

    try {
      const result = await this.db
        .select()
        .from(teams)
        .where(eq(teams.id, id))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      return null;
    }
  }

  async update(id: number, input: UpdateTeamInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      const updateData: Record<string, unknown> = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;

      if (Object.keys(updateData).length === 0) {
        return this.getById(id);
      }

      await this.db.update(teams).set(updateData).where(eq(teams.id, id));

      return this.getById(id);
    } catch (error) {
      console.error("Erro ao atualizar equipe:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao atualizar equipe",
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
      await this.db.delete(teams).where(eq(teams.id, id));
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar equipe:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao deletar equipe",
      });
    }
  }

  async addMember(teamId: number, input: AddTeamMemberInput) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      // Verificar se equipe existe
      const team = await this.getById(teamId);
      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Equipe não encontrada",
        });
      }

      // Verificar se usuário existe
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      if (!user[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      const result = await this.db.insert(teamMembers).values({
        teamId,
        userId: input.userId,
        role: input.role,
        name: input.name || user[0].name,
        email: input.email || user[0].email,
      });

      return { success: true, teamMemberId: (result as any).insertId };
    } catch (error) {
      console.error("Erro ao adicionar membro à equipe:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao adicionar membro",
      });
    }
  }

  async removeMember(memberId: number) {
    if (!this.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database não disponível",
      });
    }

    try {
      await this.db
        .delete(teamMembers)
        .where(eq(teamMembers.id, memberId));

      return { success: true };
    } catch (error) {
      console.error("Erro ao remover membro da equipe:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao remover membro",
      });
    }
  }

  async getMembers(teamId: number) {
    if (!this.db) return [];

    try {
      const result = await this.db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, teamId));

      return result || [];
    } catch (error) {
      console.error("Erro ao buscar membros da equipe:", error);
      return [];
    }
  }
}
