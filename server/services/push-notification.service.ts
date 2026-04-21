import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string>;
}

export interface NotificationTrigger {
  type: "celebration" | "pastoral_message" | "event" | "news";
  userId?: string;
  targetRole?: "admin" | "user" | "all";
  payload: PushNotificationPayload;
}

class PushNotificationService {
  /**
   * Send push notification to a specific user
   */
  async sendToUser(userId: string, payload: PushNotificationPayload): Promise<boolean> {
    try {
      const db = await getDb();
      if (!db) {
        console.error("Database not available");
        return false;
      }

      const [user] = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);

      if (!user) {
        console.error(`User ${userId} not found`);
        return false;
      }

      // In a real implementation, this would send to a push notification service
      // like Firebase Cloud Messaging, OneSignal, or Expo Push Notifications
      console.log(`[Push Notification] Sending to user ${user.email}:`, payload);

      // Store notification in database for later retrieval
      // This would be implemented with a notifications table
      return true;
    } catch (error) {
      console.error("Error sending push notification:", error);
      return false;
    }
  }

  /**
   * Send push notification to all users with a specific role
   */
  async sendToRole(role: "admin" | "user", payload: PushNotificationPayload): Promise<number> {
    try {
      const db = await getDb();
      if (!db) {
        console.error("Database not available");
        return 0;
      }

      const targetUsers = await db.select().from(users).where(eq(users.role, role));

      let sentCount = 0;
      for (const user of targetUsers) {
        const sent = await this.sendToUser(user.id.toString(), payload);
        if (sent) sentCount++;
      }

      console.log(`[Push Notification] Sent to ${sentCount} users with role ${role}`);
      return sentCount;
    } catch (error) {
      console.error("Error sending push notifications to role:", error);
      return 0;
    }
  }

  /**
   * Send push notification to all users
   */
  async sendToAll(payload: PushNotificationPayload): Promise<number> {
    try {
      const db = await getDb();
      if (!db) {
        console.error("Database not available");
        return 0;
      }

      const allUsers = await db.select().from(users);

      let sentCount = 0;
      for (const user of allUsers) {
        const sent = await this.sendToUser(user.id.toString(), payload);
        if (sent) sentCount++;
      }

      console.log(`[Push Notification] Sent to all ${sentCount} users`);
      return sentCount;
    } catch (error) {
      console.error("Error sending push notifications to all:", error);
      return 0;
    }
  }

  /**
   * Handle different notification triggers
   */
  async handleTrigger(trigger: NotificationTrigger): Promise<boolean | number> {
    switch (trigger.type) {
      case "celebration":
        return await this.sendCelebrationNotification(trigger);

      case "pastoral_message":
        return await this.sendPastoralMessageNotification(trigger);

      case "event":
        return await this.sendEventNotification(trigger);

      case "news":
        return await this.sendNewsNotification(trigger);

      default:
        console.warn(`Unknown notification trigger type: ${(trigger as any).type}`);
        return false;
    }
  }

  /**
   * Send notification for new celebration
   */
  private async sendCelebrationNotification(trigger: NotificationTrigger): Promise<number> {
    const payload: PushNotificationPayload = {
      title: trigger.payload.title || "🙏 Nova Celebração",
      body: trigger.payload.body || "Uma nova celebração foi agendada",
      icon: "🙏",
      tag: "celebration",
      data: {
        type: "celebration",
        ...trigger.payload.data,
      },
    };

    if (trigger.targetRole === "all") {
      return await this.sendToAll(payload);
    } else if (trigger.targetRole) {
      return await this.sendToRole(trigger.targetRole, payload);
    } else if (trigger.userId) {
      return (await this.sendToUser(trigger.userId, payload)) ? 1 : 0;
    }

    return 0;
  }

  /**
   * Send notification for pastoral message
   */
  private async sendPastoralMessageNotification(trigger: NotificationTrigger): Promise<number> {
    const payload: PushNotificationPayload = {
      title: trigger.payload.title || "📢 Mensagem Pastoral",
      body: trigger.payload.body || "Confira a nova mensagem do padre",
      icon: "📢",
      tag: "pastoral_message",
      data: {
        type: "pastoral_message",
        ...trigger.payload.data,
      },
    };

    // Send to all users by default for pastoral messages
    return await this.sendToAll(payload);
  }

  /**
   * Send notification for event
   */
  private async sendEventNotification(trigger: NotificationTrigger): Promise<number> {
    const payload: PushNotificationPayload = {
      title: trigger.payload.title || "📅 Novo Evento",
      body: trigger.payload.body || "Um novo evento foi criado",
      icon: "📅",
      tag: "event",
      data: {
        type: "event",
        ...trigger.payload.data,
      },
    };

    if (trigger.targetRole === "all") {
      return await this.sendToAll(payload);
    } else if (trigger.targetRole) {
      return await this.sendToRole(trigger.targetRole, payload);
    } else if (trigger.userId) {
      return (await this.sendToUser(trigger.userId, payload)) ? 1 : 0;
    }

    return 0;
  }

  /**
   * Send notification for news
   */
  private async sendNewsNotification(trigger: NotificationTrigger): Promise<number> {
    const payload: PushNotificationPayload = {
      title: trigger.payload.title || "📰 Notícia",
      body: trigger.payload.body || "Confira a nova notícia",
      icon: "📰",
      tag: "news",
      data: {
        type: "news",
        ...trigger.payload.data,
      },
    };

    return await this.sendToAll(payload);
  }
}

export const pushNotificationService = new PushNotificationService();
