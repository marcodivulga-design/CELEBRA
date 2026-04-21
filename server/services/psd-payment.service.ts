import axios from "axios";
import crypto from "crypto";

interface PSDPaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

interface PSDPaymentResponse {
  transactionId: string;
  status: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  orderId: string;
  createdAt: Date;
}

interface PSDWebhookEvent {
  eventId: string;
  eventType: string;
  transactionId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

export class PSDPaymentService {
  private apiUrl: string;
  private merchantId: string;
  private apiKey: string;
  private webhookSecret: string;

  constructor(merchantId: string, apiKey: string, webhookSecret: string) {
    this.merchantId = merchantId;
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
    this.apiUrl = "https://api.psd2.pt/v1"; // PSD2 API endpoint
  }

  /**
   * Create payment request
   */
  async createPayment(request: PSDPaymentRequest): Promise<PSDPaymentResponse> {
    try {
      const payload = {
        merchant_id: this.merchantId,
        order_id: request.orderId,
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency || "EUR",
        description: request.description,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
        return_url: request.returnUrl,
        callback_url: request.callbackUrl,
        metadata: request.metadata || {},
        timestamp: new Date().toISOString(),
      };

      // Generate signature
      const signature = this.generateSignature(payload);

      const response = await axios.post(`${this.apiUrl}/payments`, payload, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "X-Signature": signature,
          "Content-Type": "application/json",
        },
      });

      return {
        transactionId: response.data.transaction_id,
        status: response.data.status,
        paymentUrl: response.data.payment_url,
        amount: request.amount,
        currency: request.currency || "EUR",
        orderId: request.orderId,
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error("[PSD] Error creating payment:", error.response?.data || error.message);
      throw new Error(`PSD Payment Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create recurring payment
   */
  async createRecurringPayment(
    request: PSDPaymentRequest,
    frequency: "weekly" | "monthly" | "quarterly" | "yearly",
    maxCharges?: number
  ): Promise<any> {
    try {
      const frequencyMap = {
        weekly: "W",
        monthly: "M",
        quarterly: "Q",
        yearly: "Y",
      };

      const payload = {
        merchant_id: this.merchantId,
        order_id: request.orderId,
        amount: Math.round(request.amount * 100),
        currency: request.currency || "EUR",
        description: request.description,
        customer_email: request.customerEmail,
        customer_phone: request.customerPhone,
        return_url: request.returnUrl,
        callback_url: request.callbackUrl,
        recurring: {
          frequency: frequencyMap[frequency],
          max_charges: maxCharges || 0, // 0 = unlimited
        },
        metadata: request.metadata || {},
        timestamp: new Date().toISOString(),
      };

      const signature = this.generateSignature(payload);

      const response = await axios.post(`${this.apiUrl}/payments/recurring`, payload, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "X-Signature": signature,
          "Content-Type": "application/json",
        },
      });

      return {
        recurringId: response.data.recurring_id,
        transactionId: response.data.transaction_id,
        status: response.data.status,
        paymentUrl: response.data.payment_url,
        frequency,
        amount: request.amount,
        currency: request.currency || "EUR",
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error("[PSD] Error creating recurring payment:", error.response?.data || error.message);
      throw new Error(`PSD Recurring Payment Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/payments/${transactionId}`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return {
        transactionId: response.data.transaction_id,
        orderId: response.data.order_id,
        status: response.data.status,
        amount: response.data.amount / 100,
        currency: response.data.currency,
        createdAt: new Date(response.data.created_at),
        updatedAt: new Date(response.data.updated_at),
      };
    } catch (error: any) {
      console.error("[PSD] Error getting payment status:", error.message);
      throw new Error(`PSD Status Error: ${error.message}`);
    }
  }

  /**
   * Cancel recurring payment
   */
  async cancelRecurringPayment(recurringId: string): Promise<boolean> {
    try {
      await axios.post(
        `${this.apiUrl}/payments/recurring/${recurringId}/cancel`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error: any) {
      console.error("[PSD] Error cancelling recurring payment:", error.message);
      throw new Error(`PSD Cancel Error: ${error.message}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionId: string, amount?: number): Promise<any> {
    try {
      const payload: any = {
        transaction_id: transactionId,
      };

      if (amount) {
        payload.amount = Math.round(amount * 100);
      }

      const response = await axios.post(`${this.apiUrl}/payments/${transactionId}/refund`, payload, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return {
        refundId: response.data.refund_id,
        status: response.data.status,
        amount: response.data.amount / 100,
        createdAt: new Date(),
      };
    } catch (error: any) {
      console.error("[PSD] Error refunding payment:", error.message);
      throw new Error(`PSD Refund Error: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Parse webhook event
   */
  parseWebhookEvent(payload: any): PSDWebhookEvent {
    return {
      eventId: payload.event_id,
      eventType: payload.event_type,
      transactionId: payload.transaction_id,
      orderId: payload.order_id,
      status: payload.status,
      amount: payload.amount / 100,
      currency: payload.currency,
      timestamp: new Date(payload.timestamp),
    };
  }

  /**
   * Generate signature for requests
   */
  private generateSignature(payload: any): string {
    const payloadString = JSON.stringify(payload);
    return crypto.createHmac("sha256", this.apiKey).update(payloadString).digest("hex");
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    limit: number = 20,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/payments`, {
        params: {
          limit,
          offset,
        },
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.transactions.map((t: any) => ({
        transactionId: t.transaction_id,
        orderId: t.order_id,
        amount: t.amount / 100,
        currency: t.currency,
        status: t.status,
        createdAt: new Date(t.created_at),
      }));
    } catch (error: any) {
      console.error("[PSD] Error getting transaction history:", error.message);
      return [];
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/account/balance`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return {
        balance: response.data.balance / 100,
        currency: response.data.currency,
        lastUpdated: new Date(response.data.last_updated),
      };
    } catch (error: any) {
      console.error("[PSD] Error getting account balance:", error.message);
      return null;
    }
  }
}

// Export singleton
let psdService: PSDPaymentService | null = null;

export function initializePSDService(
  merchantId: string,
  apiKey: string,
  webhookSecret: string
) {
  if (!psdService) {
    psdService = new PSDPaymentService(merchantId, apiKey, webhookSecret);
  }
  return psdService;
}

export function getPSDService(): PSDPaymentService | null {
  return psdService;
}
