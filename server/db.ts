import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../drizzle/schema";
import type { InferInsertModel } from "drizzle-orm";

type InsertUser = InferInsertModel<typeof users>;

let _db: ReturnType<typeof drizzle> | undefined = undefined;
let _pool: mysql.Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (!_pool) {
        _pool = mysql.createPool(process.env.DATABASE_URL);
      }
      _db = drizzle(_pool);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = undefined;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: Partial<InsertUser>): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === process.env.OWNER_OPEN_ID) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date().toISOString();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date().toISOString();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { eq } = await import("drizzle-orm");
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return null;
  }
}

// Cleanup function for graceful shutdown
export async function closeDb() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = undefined;
  }
}

// TODO: add feature queries here as your schema grows.

// Get songs from database
export async function getSongsFromDB(filters?: {
  liturgicalTime?: string;
  massMoment?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot fetch songs: database not available");
    return [];
  }

  try {
    const { eq } = await import("drizzle-orm");
    const { songs } = await import("../drizzle/schema");
    
    const limit = filters?.limit || 200;
    const offset = filters?.offset || 0;

    // Build query with where clause
    const result = await db.select().from(songs).where(eq(songs.isPublic, 1 as any)).limit(limit).offset(offset);
    
    return result || [];
  } catch (error) {
    console.error("[Database] Failed to fetch songs:", error);
    return [];
  }
}


// ===== BUSCA AVANÇADA =====
export async function recordSearch(userId: number, organizationId: number, query: string, filters: any, resultsCount: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { searchHistory } = await import("../drizzle/schema");
    const result = await db.insert(searchHistory).values({
      userId,
      organizationId,
      query,
      filters: JSON.stringify(filters),
      resultsCount,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to record search:", error);
    return null;
  }
}

export async function getSearchHistory(userId: number, organizationId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { searchHistory } = await import("../drizzle/schema");
    const { eq, and, desc } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(searchHistory)
      .where(and(eq(searchHistory.userId, userId), eq(searchHistory.organizationId, organizationId)))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get search history:", error);
    return [];
  }
}

export async function saveSearchFilter(userId: number, organizationId: number, name: string, filterData: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { searchFilters } = await import("../drizzle/schema");
    const result = await db.insert(searchFilters).values({
      userId,
      organizationId,
      name,
      filterData: JSON.stringify(filterData),
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to save search filter:", error);
    return null;
  }
}

// ===== HISTÓRICO DE REPRODUÇÃO =====
export async function recordPlayback(userId: number, organizationId: number, songId: number, playlistId: number | null, durationSeconds: number, completedPercentage: number, source: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { playbackHistory } = await import("../drizzle/schema");
    const result = await db.insert(playbackHistory).values({
      userId,
      organizationId,
      songId,
      playlistId,
      durationSeconds,
      completedPercentage,
      source,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to record playback:", error);
    return null;
  }
}

export async function getPlaybackHistory(userId: number, organizationId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { playbackHistory } = await import("../drizzle/schema");
    const { eq, and, desc } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(playbackHistory)
      .where(and(eq(playbackHistory.userId, userId), eq(playbackHistory.organizationId, organizationId)))
      .orderBy(desc(playbackHistory.playedAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get playback history:", error);
    return [];
  }
}

export async function addFavoriteSong(userId: number, organizationId: number, songId: number, rating?: number, notes?: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { favoriteSongs } = await import("../drizzle/schema");
    const result = await db.insert(favoriteSongs).values({
      userId,
      organizationId,
      songId,
      rating,
      notes,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to add favorite song:", error);
    return null;
  }
}

export async function getFavoriteSongs(userId: number, organizationId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { favoriteSongs } = await import("../drizzle/schema");
    const { eq, and, desc } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(favoriteSongs)
      .where(and(eq(favoriteSongs.userId, userId), eq(favoriteSongs.organizationId, organizationId)))
      .orderBy(desc(favoriteSongs.addedAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get favorite songs:", error);
    return [];
  }
}

export async function getPlaybackStats(userId: number, organizationId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { playbackStats } = await import("../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(playbackStats)
      .where(and(eq(playbackStats.userId, userId), eq(playbackStats.organizationId, organizationId)))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get playback stats:", error);
    return null;
  }
}

// ===== SINCRONIZAÇÃO COM SPOTIFY =====
export async function createSpotifyConnection(userId: number, organizationId: number, spotifyUserId: string, accessToken: string, refreshToken: string | null, expiresAt: Date, scope: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifyConnections } = await import("../drizzle/schema");
    const result = await db.insert(spotifyConnections).values({
      userId,
      organizationId,
      spotifyUserId,
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      scope,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create Spotify connection:", error);
    return null;
  }
}

export async function getSpotifyConnection(userId: number, organizationId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifyConnections } = await import("../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(spotifyConnections)
      .where(and(eq(spotifyConnections.userId, userId), eq(spotifyConnections.organizationId, organizationId), eq(spotifyConnections.isActive, true)))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get Spotify connection:", error);
    return null;
  }
}

export async function createSpotifyPlaylistSync(userId: number, organizationId: number, playlistId: number, spotifyPlaylistId: string, spotifyPlaylistUrl: string, isPublic: boolean = false) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifyPlaylistSync } = await import("../drizzle/schema");
    const result = await db.insert(spotifyPlaylistSync).values({
      userId,
      organizationId,
      playlistId,
      spotifyPlaylistId,
      spotifyPlaylistUrl,
      isPublic,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create Spotify playlist sync:", error);
    return null;
  }
}

export async function getSpotifyPlaylistSync(playlistId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifyPlaylistSync } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(spotifyPlaylistSync)
      .where(eq(spotifyPlaylistSync.playlistId, playlistId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get Spotify playlist sync:", error);
    return null;
  }
}

export async function updateSpotifyPlaylistSync(syncId: number, updates: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifyPlaylistSync } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const result = await db
      .update(spotifyPlaylistSync)
      .set(updates)
      .where(eq(spotifyPlaylistSync.id, syncId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update Spotify playlist sync:", error);
    return null;
  }
}

export async function getSyncedPlaylists(userId: number, organizationId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { spotifyPlaylistSync } = await import("../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await db
      .select()
      .from(spotifyPlaylistSync)
      .where(and(eq(spotifyPlaylistSync.userId, userId), eq(spotifyPlaylistSync.organizationId, organizationId)))
      .orderBy(spotifyPlaylistSync.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get synced playlists:", error);
    return [];
  }
}

export async function recordSpotifySyncHistory(syncId: number, action: string, tracksAdded: number, tracksUpdated: number, tracksRemoved: number, details: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { spotifySyncHistory } = await import("../drizzle/schema");
    const result = await db.insert(spotifySyncHistory).values({
      syncId,
      action: (action as 'synced' | 'added' | 'updated' | 'removed'),
      tracksAdded,
      tracksUpdated,
      tracksRemoved,
      details: JSON.stringify(details),
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to record Spotify sync history:", error);
    return null;
  }
}
