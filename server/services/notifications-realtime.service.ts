import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export class RealtimeNotificationsService {
  private io: SocketIOServer;
  private userSockets: Map<number, Set<string>> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        return next(new Error("Missing userId"));
      }
      socket.data.userId = parseInt(userId);
      next();
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId;

      // Track user socket connections
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Join user room for targeted notifications
      socket.join(`user:${userId}`);

      console.log(`[WebSocket] User ${userId} connected: ${socket.id}`);

      // Handle disconnection
      socket.on("disconnect", () => {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            this.userSockets.delete(userId);
          }
        }
        console.log(`[WebSocket] User ${userId} disconnected: ${socket.id}`);
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error(`[WebSocket] Error for user ${userId}:`, error);
      });
    });
  }

  // Send notification to specific user
  notifyUser(userId: number, type: string, data: any) {
    this.io.to(`user:${userId}`).emit("notification", {
      type,
      data,
      timestamp: new Date(),
    });
  }

  // Send notification to multiple users
  notifyUsers(userIds: number[], type: string, data: any) {
    userIds.forEach((userId) => {
      this.notifyUser(userId, type, data);
    });
  }

  // Broadcast to all connected clients
  broadcastNotification(type: string, data: any) {
    this.io.emit("notification", {
      type,
      data,
      timestamp: new Date(),
    });
  }

  // Notify about new rehearsal
  notifyNewRehearsal(ministryId: number, rehearsalData: any, memberIds: number[]) {
    this.notifyUsers(memberIds, "rehearsal:new", {
      ministryId,
      ...rehearsalData,
      message: `Novo ensaio agendado: ${rehearsalData.title}`,
    });
  }

  // Notify about rehearsal update
  notifyRehearsalUpdate(rehearsalId: number, updateData: any, memberIds: number[]) {
    this.notifyUsers(memberIds, "rehearsal:updated", {
      rehearsalId,
      ...updateData,
      message: "Ensaio foi atualizado",
    });
  }

  // Notify about attendance marking
  notifyAttendanceMarked(rehearsalId: number, userId: number, status: string) {
    this.notifyUser(userId, "attendance:marked", {
      rehearsalId,
      status,
      message: `Presença marcada: ${status}`,
    });
  }

  // Notify about playlist update
  notifyPlaylistUpdate(playlistId: number, updateData: any, userIds: number[]) {
    this.notifyUsers(userIds, "playlist:updated", {
      playlistId,
      ...updateData,
      message: "Playlist foi atualizada",
    });
  }

  // Notify about new song added
  notifyNewSongAdded(playlistId: number, songData: any, userIds: number[]) {
    this.notifyUsers(userIds, "song:added", {
      playlistId,
      ...songData,
      message: `Nova música adicionada: ${songData.title}`,
    });
  }

  // Notify about payment received
  notifyPaymentReceived(userId: number, paymentData: any) {
    this.notifyUser(userId, "payment:received", {
      ...paymentData,
      message: "Pagamento recebido com sucesso",
    });
  }

  // Notify about subscription status
  notifySubscriptionStatus(userId: number, status: string, data: any) {
    this.notifyUser(userId, "subscription:status", {
      status,
      ...data,
      message: `Status da assinatura: ${status}`,
    });
  }

  // Notify about new celebration
  notifyCelebrationCreated(celebrationData: any, userIds: number[]) {
    this.notifyUsers(userIds, "celebration:created", {
      ...celebrationData,
      message: `Nova celebração agendada: ${celebrationData.title}`,
    });
  }

  // Notify about ministry update
  notifyMinistryUpdate(ministryId: number, updateData: any, memberIds: number[]) {
    this.notifyUsers(memberIds, "ministry:updated", {
      ministryId,
      ...updateData,
      message: "Ministério foi atualizado",
    });
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Get user socket count
  getUserSocketCount(userId: number): number {
    return this.userSockets.get(userId)?.size || 0;
  }

  // Close all connections
  close() {
    this.io.close();
    this.userSockets.clear();
  }
}

// Export singleton instance
let notificationsService: RealtimeNotificationsService | null = null;

export function initializeNotificationsService(httpServer: HTTPServer) {
  if (!notificationsService) {
    notificationsService = new RealtimeNotificationsService(httpServer);
  }
  return notificationsService;
}

export function getNotificationsService(): RealtimeNotificationsService | null {
  return notificationsService;
}
