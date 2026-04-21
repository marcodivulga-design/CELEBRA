import { getDb } from "../db";

export interface AffiliateProgram {
  id: number;
  name: string;
  description: string;
  commissionPercentage: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AffiliateUser {
  id: number;
  userId: number;
  programId: number;
  affiliateCode: string;
  referralLink: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingBalance: number;
  withdrawnBalance: number;
  status: "active" | "inactive" | "suspended";
  joinedAt: Date;
}

export interface AffiliateReferral {
  id: number;
  affiliateId: number;
  referredUserId: number;
  transactionId: string;
  amount: number;
  commission: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}

export class AffiliateService {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  /**
   * Generate unique affiliate code
   */
  generateAffiliateCode(userId: number): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AFF${userId}${randomPart}${timestamp}`.substring(0, 12);
  }

  /**
   * Generate referral link
   */
  generateReferralLink(affiliateCode: string, baseUrl: string = "https://celebra.app"): string {
    return `${baseUrl}/ref/${affiliateCode}`;
  }

  /**
   * Create affiliate program
   */
  async createProgram(
    name: string,
    description: string,
    commissionPercentage: number,
    minWithdrawal: number,
    maxWithdrawal: number
  ): Promise<AffiliateProgram> {
    // Simulate database insert
    return {
      id: Math.floor(Math.random() * 10000),
      name,
      description,
      commissionPercentage,
      minWithdrawal,
      maxWithdrawal,
      isActive: true,
      createdAt: new Date(),
    };
  }

  /**
   * Join affiliate program
   */
  async joinProgram(userId: number, programId: number): Promise<AffiliateUser> {
    const affiliateCode = this.generateAffiliateCode(userId);
    const referralLink = this.generateReferralLink(affiliateCode);

    // Simulate database insert
    return {
      id: Math.floor(Math.random() * 10000),
      userId,
      programId,
      affiliateCode,
      referralLink,
      totalReferrals: 0,
      totalEarnings: 0,
      pendingBalance: 0,
      withdrawnBalance: 0,
      status: "active",
      joinedAt: new Date(),
    };
  }

  /**
   * Track referral
   */
  async trackReferral(
    affiliateCode: string,
    referredUserId: number,
    transactionId: string,
    amount: number,
    commissionPercentage: number
  ): Promise<AffiliateReferral> {
    const commission = (amount * commissionPercentage) / 100;

    // Simulate database insert
    return {
      id: Math.floor(Math.random() * 10000),
      affiliateId: Math.floor(Math.random() * 10000),
      referredUserId,
      transactionId,
      amount,
      commission,
      status: "pending",
      createdAt: new Date(),
    };
  }

  /**
   * Complete referral (after payment confirmed)
   */
  async completeReferral(referralId: number): Promise<boolean> {
    // Simulate database update
    console.log(`[Affiliate] Referral ${referralId} completed`);
    return true;
  }

  /**
   * Get affiliate stats
   */
  async getAffiliateStats(userId: number): Promise<{
    totalReferrals: number;
    totalEarnings: number;
    pendingBalance: number;
    withdrawnBalance: number;
    conversionRate: number;
    averageOrderValue: number;
  }> {
    // Simulate database query
    return {
      totalReferrals: 15,
      totalEarnings: 1250.5,
      pendingBalance: 250.5,
      withdrawnBalance: 1000,
      conversionRate: 0.35,
      averageOrderValue: 83.37,
    };
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(
    userId: number,
    amount: number,
    bankAccount: string
  ): Promise<{
    success: boolean;
    withdrawalId: string;
    message: string;
  }> {
    if (amount < 50) {
      return {
        success: false,
        withdrawalId: "",
        message: "Valor mínimo de saque é R$ 50",
      };
    }

    // Simulate database insert
    const withdrawalId = `WD${Date.now()}`;

    return {
      success: true,
      withdrawalId,
      message: "Solicitação de saque enviada com sucesso",
    };
  }

  /**
   * Get referral history
   */
  async getReferralHistory(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<AffiliateReferral[]> {
    // Simulate database query
    return [
      {
        id: 1,
        affiliateId: userId,
        referredUserId: 123,
        transactionId: "TXN001",
        amount: 99.9,
        commission: 9.99,
        status: "completed",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        affiliateId: userId,
        referredUserId: 124,
        transactionId: "TXN002",
        amount: 149.9,
        commission: 14.99,
        status: "completed",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  /**
   * Get top affiliates
   */
  async getTopAffiliates(limit: number = 10): Promise<any[]> {
    // Simulate database query
    return [
      {
        userId: 1,
        name: "João Silva",
        totalReferrals: 45,
        totalEarnings: 4500,
        status: "active",
      },
      {
        userId: 2,
        name: "Maria Santos",
        totalReferrals: 38,
        totalEarnings: 3800,
        status: "active",
      },
    ];
  }

  /**
   * Calculate commission
   */
  calculateCommission(amount: number, commissionPercentage: number): number {
    return (amount * commissionPercentage) / 100;
  }

  /**
   * Validate affiliate code
   */
  async validateAffiliateCode(code: string): Promise<boolean> {
    // Simulate database query
    return code.startsWith("AFF") && code.length === 12;
  }

  /**
   * Get affiliate by code
   */
  async getAffiliateByCode(code: string): Promise<AffiliateUser | null> {
    // Simulate database query
    if (code === "AFFTEST123") {
      return {
        id: 1,
        userId: 1,
        programId: 1,
        affiliateCode: code,
        referralLink: this.generateReferralLink(code),
        totalReferrals: 10,
        totalEarnings: 1000,
        pendingBalance: 200,
        withdrawnBalance: 800,
        status: "active",
        joinedAt: new Date(),
      };
    }
    return null;
  }

  /**
   * Suspend affiliate
   */
  async suspendAffiliate(userId: number, reason: string): Promise<boolean> {
    console.log(`[Affiliate] User ${userId} suspended. Reason: ${reason}`);
    return true;
  }

  /**
   * Reactivate affiliate
   */
  async reactivateAffiliate(userId: number): Promise<boolean> {
    console.log(`[Affiliate] User ${userId} reactivated`);
    return true;
  }
}

// Export singleton
let affiliateService: AffiliateService | null = null;

export async function initializeAffiliateService() {
  if (!affiliateService) {
    const db = await getDb();
    if (db) {
      affiliateService = new AffiliateService(db);
    }
  }
  return affiliateService;
}

export function getAffiliateService(): AffiliateService | null {
  return affiliateService;
}
