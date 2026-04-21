import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { organizationUsers, organizations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface MultiTenantContext {
  organizationId: number;
  userId: number;
  organizationName: string;
  plan: "free" | "pro" | "enterprise";
}

/**
 * Injeta contexto multi-tenant no request
 * Busca a organização padrão do usuário
 */
export async function injectOrganizationContext(
  userId: number
): Promise<MultiTenantContext | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    // Buscar primeira organização do usuário
    const [orgUser] = await db
      .select({
        organizationId: organizationUsers.organizationId,
        organizationName: organizations.name,
        plan: organizations.plan,
      })
      .from(organizationUsers)
      .innerJoin(
        organizations,
        eq(organizationUsers.organizationId, organizations.id)
      )
      .where(eq(organizationUsers.userId, userId))
      .limit(1);

    if (!orgUser) {
      return null;
    }

    return {
      organizationId: orgUser.organizationId,
      userId,
      organizationName: orgUser.organizationName,
      plan: orgUser.plan as "free" | "pro" | "enterprise",
    };
  } catch (error) {
    console.error("[MultiTenant] Erro ao injetar contexto:", error);
    return null;
  }
}

/**
 * Middleware para proteger queries por organização
 * Garante que usuários só acessem dados de sua organização
 */
export function withOrganizationFilter<T extends { organizationId?: number }>(
  items: T[],
  organizationId: number
): T[] {
  return items.filter(
    (item) => item.organizationId === null || item.organizationId === organizationId
  );
}

/**
 * Valida se usuário tem acesso à organização
 */
export async function validateOrganizationAccess(
  userId: number,
  organizationId: number
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const [access] = await db
      .select()
      .from(organizationUsers)
      .where(
        eq(organizationUsers.userId, userId) &&
          eq(organizationUsers.organizationId, organizationId)
      )
      .limit(1);

    return !!access;
  } catch (error) {
    console.error("[MultiTenant] Erro ao validar acesso:", error);
    return false;
  }
}

/**
 * Obtém plano da organização
 */
export async function getOrganizationPlan(
  organizationId: number
): Promise<"free" | "pro" | "enterprise" | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    const [org] = await db
      .select({ plan: organizations.plan })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    return org?.plan || null;
  } catch (error) {
    console.error("[MultiTenant] Erro ao obter plano:", error);
    return null;
  }
}

/**
 * Verifica se feature está habilitada para o plano
 */
export async function isFeatureEnabled(
  organizationId: number,
  feature: string
): Promise<boolean> {
  try {
    // Feature flags not implemented yet - all features enabled by default
    return true;
  } catch (error) {
    console.error("[MultiTenant] Erro ao verificar feature:", error);
    return false;
  }
}

/**
 * Obtém limite de uma feature para o plano
 */
export async function getFeatureLimit(
  organizationId: number,
  feature: string
): Promise<number | null> {
  try {
    // Feature limits not implemented yet - unlimited by default
    return null;
  } catch (error) {
    console.error("[MultiTenant] Erro ao obter limite:", error);
    return null;
  }
}

/**
 * Valida se organização atingiu limite de feature
 */
export async function validateFeatureLimit(
  organizationId: number,
  feature: string,
  currentCount: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const limit = await getFeatureLimit(organizationId, feature);

    // Se não há limite (null), é ilimitado
    if (limit === null) {
      return { allowed: true, remaining: -1 };
    }

    const allowed = currentCount < limit;
    const remaining = Math.max(0, limit - currentCount);

    return { allowed, remaining };
  } catch (error) {
    console.error("[MultiTenant] Erro ao validar limite:", error);
    return { allowed: false, remaining: 0 };
  }
}
