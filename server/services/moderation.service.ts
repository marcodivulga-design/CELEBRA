import { TRPCError } from "@trpc/server";

/**
 * Serviço de Moderação
 * Gerencia aprovação/rejeição de notícias e posts da comunidade
 */
export class ModerationService {
  /**
   * Obtém posts/notícias aguardando moderação
   */
  static async getPendingItems(organizationId: number, type: "news" | "posts" | "all" = "all") {
    try {
      // TODO: Implementar queries ao banco de dados
      // Por enquanto retorna dados simulados
      
      const pendingNews = [
        {
          id: 1,
          type: "news",
          title: "Festa de São João 2026",
          excerpt: "Celebração especial de São João",
          content: "Convidamos toda a comunidade para a festa de São João...",
          author: "Padre João",
          category: "evento",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: "pending",
        },
        {
          id: 2,
          type: "news",
          title: "Novo horário de confissões",
          excerpt: "Confissões agora de segunda a sexta",
          content: "A partir de segunda-feira próxima, as confissões serão...",
          author: "Padre José",
          category: "avisos",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: "pending",
        },
      ];

      const pendingPosts = [
        {
          id: 1,
          type: "post",
          title: "Testemunho de cura",
          content: "Gostaria de compartilhar meu testemunho de cura...",
          author: "Maria Silva",
          category: "testemunho",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: "pending",
        },
        {
          id: 2,
          type: "post",
          title: "Dúvida sobre sacramento",
          content: "Tenho uma dúvida sobre o sacramento do batismo...",
          author: "João Santos",
          category: "duvida",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          status: "pending",
        },
      ];

      if (type === "news") return pendingNews;
      if (type === "posts") return pendingPosts;
      return [...pendingNews, ...pendingPosts];
    } catch (error) {
      console.error("[Moderation] Erro ao obter itens pendentes:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter itens pendentes",
      });
    }
  }

  /**
   * Aprova uma notícia ou post
   */
  static async approveItem(
    organizationId: number,
    itemId: number,
    itemType: "news" | "post",
    moderatorNotes?: string
  ) {
    try {
      console.log(`[Moderation] Aprovando ${itemType} ${itemId} na organização ${organizationId}`);
      
      // TODO: Implementar update no banco de dados
      // UPDATE parishNews/communityPosts SET status = 'approved', moderatedAt = NOW(), moderatorNotes = ? WHERE id = ?

      return {
        success: true,
        message: `${itemType === "news" ? "Notícia" : "Post"} aprovado com sucesso`,
        itemId,
        status: "approved",
        approvedAt: new Date(),
      };
    } catch (error) {
      console.error("[Moderation] Erro ao aprovar item:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao aprovar item",
      });
    }
  }

  /**
   * Rejeita uma notícia ou post
   */
  static async rejectItem(
    organizationId: number,
    itemId: number,
    itemType: "news" | "post",
    reason: string,
    moderatorNotes?: string
  ) {
    try {
      console.log(`[Moderation] Rejeitando ${itemType} ${itemId} na organização ${organizationId}`);
      
      // TODO: Implementar update no banco de dados
      // UPDATE parishNews/communityPosts SET status = 'rejected', rejectionReason = ?, moderatedAt = NOW(), moderatorNotes = ? WHERE id = ?

      return {
        success: true,
        message: `${itemType === "news" ? "Notícia" : "Post"} rejeitado`,
        itemId,
        status: "rejected",
        reason,
        rejectedAt: new Date(),
      };
    } catch (error) {
      console.error("[Moderation] Erro ao rejeitar item:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao rejeitar item",
      });
    }
  }

  /**
   * Obtém estatísticas de moderação
   */
  static async getModerationStats(organizationId: number) {
    try {
      return {
        totalPending: 2,
        totalApproved: 45,
        totalRejected: 8,
        pendingNews: 2,
        pendingPosts: 0,
        averageModerationTime: "2.5 horas",
        lastModerationTime: new Date(Date.now() - 30 * 60 * 1000),
      };
    } catch (error) {
      console.error("[Moderation] Erro ao obter estatísticas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas de moderação",
      });
    }
  }

  /**
   * Obtém histórico de moderações
   */
  static async getModerationHistory(
    organizationId: number,
    limit: number = 50,
    offset: number = 0
  ) {
    try {
      return [
        {
          id: 1,
          itemId: 1,
          itemType: "news",
          title: "Festa de São João 2026",
          action: "approved",
          moderatorNotes: "Excelente notícia sobre evento",
          moderatedAt: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: 2,
          itemId: 2,
          itemType: "post",
          title: "Testemunho de cura",
          action: "approved",
          moderatorNotes: "Testemunho inspirador",
          moderatedAt: new Date(Date.now() - 60 * 60 * 1000),
        },
        {
          id: 3,
          itemId: 3,
          itemType: "post",
          title: "Spam",
          action: "rejected",
          moderatorNotes: "Conteúdo inapropriado",
          moderatedAt: new Date(Date.now() - 120 * 60 * 1000),
        },
      ];
    } catch (error) {
      console.error("[Moderation] Erro ao obter histórico:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter histórico de moderações",
      });
    }
  }

  /**
   * Obtém detalhes de um item para moderação
   */
  static async getItemDetails(
    organizationId: number,
    itemId: number,
    itemType: "news" | "post"
  ) {
    try {
      if (itemType === "news") {
        return {
          id: itemId,
          type: "news",
          title: "Festa de São João 2026",
          excerpt: "Celebração especial de São João",
          content: "Convidamos toda a comunidade para a festa de São João...",
          author: "Padre João",
          category: "evento",
          createdAt: new Date(),
          status: "pending",
          authorEmail: "padre.joao@paroquia.com",
          authorPhone: "(11) 98765-4321",
        };
      } else {
        return {
          id: itemId,
          type: "post",
          title: "Testemunho de cura",
          content: "Gostaria de compartilhar meu testemunho de cura...",
          author: "Maria Silva",
          category: "testemunho",
          createdAt: new Date(),
          status: "pending",
          authorEmail: "maria@email.com",
          authorPhone: "(11) 91234-5678",
        };
      }
    } catch (error) {
      console.error("[Moderation] Erro ao obter detalhes:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter detalhes do item",
      });
    }
  }

  /**
   * Notifica usuário sobre decisão de moderação
   */
  static async notifyUserAboutModeration(
    userEmail: string,
    itemType: "news" | "post",
    title: string,
    action: "approved" | "rejected",
    reason?: string
  ) {
    try {
      console.log(`[Moderation] Notificando ${userEmail} sobre ${action} de ${itemType}`);
      
      // TODO: Integrar com NotificationsService para enviar email
      
      return {
        success: true,
        message: "Usuário notificado",
        email: userEmail,
      };
    } catch (error) {
      console.error("[Moderation] Erro ao notificar usuário:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao notificar usuário",
      });
    }
  }
}
