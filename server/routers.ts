import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getSongsData } from "./songs-data";
import { getSongsFromDB } from "./db";
import { celebrationsRouter } from "./celebrations-router";
import { spotifyRouter } from "./routers/spotify-router";
import { externalApisRouter } from "./routers/external-apis.router";




import { ministriesRouter } from "./routers/ministries.router";
import { rehearsalsRouter } from "./routers/rehearsals.router";
import { playlistsRouter } from "./routers/playlists.router";
import { stripeRouter } from "./routers/stripe.router";
// import { musicAggregationRouter } from "./routers/music-aggregation.router"; // Removed - will be re-added in V1.1
import { dailyReflectionRouter } from "./routers/daily-reflection.router";
import { liturgicalCalendarRouter } from "./routers/liturgical-calendar.router";
import { donationsRouter } from "./routers/donations.router";
import { psdPaymentsRouter } from "./routers/psd-payments.router";




import { notificationsRouter } from "./routers/notifications.router";

import { getSessionCookieOptions } from "./_core/cookies";
import { z } from "zod";
import { CelebrationsService } from "./services/celebrations.service";
import { ReadingsService } from "./services/readings.service";
import { TeamsService } from "./services/teams.service";
import { SongsService } from "./services/songs.service";


import { AnalyticsService } from "./services/analytics.service";
import { ModerationService } from "./services/moderation.service";
import { getDb } from "./db";
import { COOKIE_NAME } from "../shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  songs: router({
    list: publicProcedure
      .input(z.object({
        liturgicalTime: z.string().optional(),
        massMoment: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        // Try to get from database first, fallback to hardcoded data
        const dbSongs = await getSongsFromDB(input);
        if (dbSongs && dbSongs.length > 0) {
          return dbSongs;
        }
        // Fallback to hardcoded data
        return getSongsData(input);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return null;
        const { songs } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const result = await db.select().from(songs).where(eq(songs.id, input)).limit(1);
        return result[0] || null;
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        massMoment: z.string().optional(),
        liturgicalTime: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const songsService = new SongsService(db);
        return songsService.search(input);
      }),

    getByMassMoment: publicProcedure
      .input(z.object({
        massMoment: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const songsService = new SongsService(db);
        return songsService.getByMassMoment(input.massMoment, input.limit);
      }),

    getByLiturgicalTime: publicProcedure
      .input(z.object({
        liturgicalTime: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const songsService = new SongsService(db);
        return songsService.getByLiturgicalTime(input.liturgicalTime, input.limit);
      }),
  }),

  celebrations: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.getAll(input?.limit, input?.offset);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return null;
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.getById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date(),
        type: z.enum(["missa", "palavra", "batizado", "casamento", "funeral", "vigilia", "outro"]),
        location: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.create({
          ...input,
          createdBy: ctx.user?.id || 1,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.date().optional(),
        type: z.string().optional(),
        location: z.string().optional(),
        status: z.enum(["draft", "scheduled", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const celebrationsService = new CelebrationsService(db);
        const { id, ...updateData } = input;
        return celebrationsService.update(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.delete(input);
      }),

    addSong: protectedProcedure
      .input(z.object({
        celebrationId: z.number(),
        songId: z.number(),
        order: z.number(),
        moment: z.string().optional(),
        transposition: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const celebrationsService = new CelebrationsService(db);
        const { celebrationId, ...songData } = input;
        return celebrationsService.addSong(celebrationId, songData);
      }),

    removeSong: protectedProcedure
      .input(z.object({
        celebrationId: z.number(),
        songId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.removeSong(input.celebrationId, input.songId);
      }),

    getSongs: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const celebrationsService = new CelebrationsService(db);
        return celebrationsService.getSongs(input);
      }),
  }),

  readings: router({
    list: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const readingsService = new ReadingsService(db);
        return readingsService.getByCelebration(input);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return null;
        const readingsService = new ReadingsService(db);
        return readingsService.getById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        celebrationId: z.number(),
        book: z.string(),
        chapter: z.number(),
        verseStart: z.number(),
        verseEnd: z.number().optional(),
        type: z.enum(["primeira", "segunda", "evangelho", "salmo", "outro"]),
        text: z.string().optional(),
        reader: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const readingsService = new ReadingsService(db);
        return readingsService.create(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        book: z.string().optional(),
        chapter: z.number().optional(),
        verseStart: z.number().optional(),
        verseEnd: z.number().optional(),
        type: z.string().optional(),
        text: z.string().optional(),
        reader: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const readingsService = new ReadingsService(db);
        const { id, ...updateData } = input;
        return readingsService.update(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const readingsService = new ReadingsService(db);
        return readingsService.delete(input);
      }),
  }),

  teams: router({
    list: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const teamsService = new TeamsService(db);
        return teamsService.getByCelebration(input);
      }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return null;
        const teamsService = new TeamsService(db);
        return teamsService.getById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        celebrationId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const teamsService = new TeamsService(db);
        return teamsService.create(input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const teamsService = new TeamsService(db);
        const { id, ...updateData } = input;
        return teamsService.update(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const teamsService = new TeamsService(db);
        return teamsService.delete(input);
      }),

    addMember: protectedProcedure
      .input(z.object({
        teamId: z.number(),
        userId: z.number(),
        role: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const teamsService = new TeamsService(db);
        const { teamId, ...memberData } = input;
        return teamsService.addMember(teamId, memberData);
      }),

    removeMember: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database não disponível");
        const teamsService = new TeamsService(db);
        return teamsService.removeMember(input);
      }),

    getMembers: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await (await import("./db")).getDb();
        if (!db) return [];
        const teamsService = new TeamsService(db);
        return teamsService.getMembers(input);
      }),
  }),

  spotify: spotifyRouter,





  analytics: router({
    getOrganizationStats: publicProcedure
      .input(z.object({ organizationId: z.number() }))
      .query(async ({ input }) => {
        return AnalyticsService.getOrganizationStats(input.organizationId);
      }),

    getCommunityEngagement: publicProcedure
      .input(z.object({ organizationId: z.number() }))
      .query(async ({ input }) => {
        return AnalyticsService.getCommunityEngagement(input.organizationId);
      }),

    getScalesStats: publicProcedure
      .input(z.object({ organizationId: z.number() }))
      .query(async ({ input }) => {
        return AnalyticsService.getScalesStats(input.organizationId);
      }),
  }),

  moderation: router({
    getPendingItems: protectedProcedure
      .input(z.object({ organizationId: z.number(), type: z.enum(["news", "posts", "all"]).default("all") }))
      .query(async ({ input }) => {
        return ModerationService.getPendingItems(input.organizationId, input.type);
      }),

    approveItem: protectedProcedure
      .input(z.object({
        organizationId: z.number(),
        itemId: z.number(),
        itemType: z.enum(["news", "post"]),
        moderatorNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return ModerationService.approveItem(input.organizationId, input.itemId, input.itemType, input.moderatorNotes);
      }),

    rejectItem: protectedProcedure
      .input(z.object({
        organizationId: z.number(),
        itemId: z.number(),
        itemType: z.enum(["news", "post"]),
        reason: z.string(),
        moderatorNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return ModerationService.rejectItem(input.organizationId, input.itemId, input.itemType, input.reason, input.moderatorNotes);
      }),

    getModerationStats: protectedProcedure
      .input(z.object({ organizationId: z.number() }))
      .query(async ({ input }) => {
        return ModerationService.getModerationStats(input.organizationId);
      }),

    getModerationHistory: protectedProcedure
      .input(z.object({ organizationId: z.number(), limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return ModerationService.getModerationHistory(input.organizationId, input.limit, input.offset);
      }),
  }),

  ministries: ministriesRouter,
  rehearsals: rehearsalsRouter,
  playlists: playlistsRouter,
  stripe: stripeRouter,
  // musicAggregation: musicAggregationRouter, // Removed - will be re-added in V1.1
  dailyReflection: dailyReflectionRouter,
  liturgicalCalendar: liturgicalCalendarRouter,
  donations: donationsRouter,
  psdPayments: psdPaymentsRouter,
  notifications: notificationsRouter,
  externalApis: externalApisRouter,
});
export type AppRouter = typeof appRouter;
