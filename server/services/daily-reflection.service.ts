import { getDb } from '../db';
import { dailyReflections } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export class DailyReflectionService {
  /**
   * Get today's reflection
   */
  static async getTodayReflection() {
    const db = await getDb();
    if (!db) return null;
    const today = new Date().toISOString().split('T')[0];
    
    const reflection = await db
      .select()
      .from(dailyReflections)
      .where(eq(dailyReflections.date, today))
      .limit(1);
    
    return reflection[0] || null;
  }

  /**
   * Get reflection by date
   */
  static async getReflectionByDate(date: string) {
    const db = await getDb();
    if (!db) return null;
    const reflection = await db
      .select()
      .from(dailyReflections)
      .where(eq(dailyReflections.date, date))
      .limit(1);
    
    return reflection[0] || null;
  }

  /**
   * Get all published reflections
   */
  static async getAllPublishedReflections(limit = 30) {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(dailyReflections)
      .where(eq(dailyReflections.isPublished, true))
      .orderBy(dailyReflections.date)
      .limit(limit);
  }

  /**
   * Create a new reflection
   */
  static async createReflection(data: {
    title: string;
    content: string;
    verse?: string;
    verseText?: string;
    prayer?: string;
    author?: string;
    date: string;
    imageUrl?: string;
    isPublished?: boolean;
  }) {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    const result = await db.insert(dailyReflections).values({
      ...data,
      isPublished: data.isPublished ?? true,
    });

    return result;
  }

  /**
   * Update reflection
   */
  static async updateReflection(id: number, data: Partial<typeof dailyReflections.$inferInsert>) {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    return await db
      .update(dailyReflections)
      .set(data)
      .where(eq(dailyReflections.id, id));
  }

  /**
   * Delete reflection
   */
  static async deleteReflection(id: number) {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    return await db
      .delete(dailyReflections)
      .where(eq(dailyReflections.id, id));
  }
}
