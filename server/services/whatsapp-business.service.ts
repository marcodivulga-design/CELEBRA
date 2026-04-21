import axios from "axios";

interface WhatsAppMessage {
  phone: string;
  message: string;
  mediaUrl?: string;
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  parameters?: Record<string, any>;
}

export class WhatsAppBusinessService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;

  constructor(
    accessToken: string,
    phoneNumberId: string,
    businessAccountId: string
  ) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.businessAccountId = businessAccountId;
    this.apiUrl = "https://graph.instagram.com/v18.0";
  }

  /**
   * Send a simple text message
   */
  async sendMessage(phone: string, message: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone.replace(/\D/g, ""),
          type: "text",
          text: {
            preview_url: true,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error("[WhatsApp] Error sending message:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  /**
   * Send a template message (pre-approved by WhatsApp)
   */
  async sendTemplateMessage(
    phone: string,
    templateName: string,
    parameters?: Record<string, string>
  ): Promise<any> {
    try {
      const body: any = {
        messaging_product: "whatsapp",
        to: phone.replace(/\D/g, ""),
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "pt_BR",
          },
        },
      };

      if (parameters) {
        body.template.parameters = {
          body: {
            parameters: Object.values(parameters),
          },
        };
      }

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        body,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error("[WhatsApp] Error sending template:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  /**
   * Send rehearsal reminder notification
   */
  async sendRehearsalReminder(
    phone: string,
    ministryName: string,
    rehearsalDate: Date,
    rehearsalTime: string,
    location: string
  ): Promise<any> {
    const formattedDate = rehearsalDate.toLocaleDateString("pt-BR");
    const message = `🎵 *Lembrete de Ensaio* 🎵\n\nMinistério: ${ministryName}\nData: ${formattedDate}\nHora: ${rehearsalTime}\nLocal: ${location}\n\nNão falte! 🙏`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send celebration announcement
   */
  async sendCelebrationAnnouncement(
    phone: string,
    celebrationTitle: string,
    celebrationDate: Date,
    celebrationTime: string,
    description: string
  ): Promise<any> {
    const formattedDate = celebrationDate.toLocaleDateString("pt-BR");
    const message = `✨ *${celebrationTitle}* ✨\n\nData: ${formattedDate}\nHora: ${celebrationTime}\n\n${description}\n\nVenha celebrar conosco! 🙏`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send attendance confirmation request
   */
  async sendAttendanceRequest(
    phone: string,
    ministryName: string,
    rehearsalDate: Date
  ): Promise<any> {
    const formattedDate = rehearsalDate.toLocaleDateString("pt-BR");
    const message = `👋 Você vai participar do ensaio do ${ministryName} em ${formattedDate}?\n\nResponda: ✅ Sim ou ❌ Não`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(
    phone: string,
    amount: number,
    description: string,
    transactionId: string
  ): Promise<any> {
    const formattedAmount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

    const message = `✅ *Pagamento Confirmado* ✅\n\nDescrição: ${description}\nValor: ${formattedAmount}\nID da Transação: ${transactionId}\n\nObrigado! 🙏`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send donation thank you message
   */
  async sendDonationThankYou(
    phone: string,
    amount: number,
    churchName: string
  ): Promise<any> {
    const formattedAmount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

    const message = `❤️ *Obrigado pela Doação!* ❤️\n\nValor: ${formattedAmount}\n\nSua generosidade ajuda ${churchName} a continuar sua missão.\n\nQue Deus abençoe! 🙏`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send playlist update notification
   */
  async sendPlaylistUpdate(
    phone: string,
    playlistName: string,
    newSongsCount: number
  ): Promise<any> {
    const message = `🎵 *Playlist Atualizada* 🎵\n\n${playlistName}\n${newSongsCount} nova(s) música(s) adicionada(s)!\n\nConfira agora! 🎶`;

    return this.sendMessage(phone, message);
  }

  /**
   * Send ministry member welcome message
   */
  async sendWelcomeMessage(
    phone: string,
    memberName: string,
    ministryName: string
  ): Promise<any> {
    const message = `👋 Bem-vindo ao ${ministryName}, ${memberName}!\n\nEstamos felizes em ter você conosco. Aqui você receberá atualizações sobre ensaios, celebrações e eventos.\n\nQue Deus abençoe! 🙏`;

    return this.sendMessage(phone, message);
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${messageId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return {
        success: true,
        status: response.data.status,
        timestamp: response.data.timestamp,
      };
    } catch (error: any) {
      console.error("[WhatsApp] Error getting message status:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate phone number
   */
  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Format phone number to WhatsApp format
   */
  formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, "");
  }
}

// Export singleton
let whatsappService: WhatsAppBusinessService | null = null;

export function initializeWhatsAppService(
  accessToken: string,
  phoneNumberId: string,
  businessAccountId: string
) {
  if (!whatsappService) {
    whatsappService = new WhatsAppBusinessService(accessToken, phoneNumberId, businessAccountId);
  }
  return whatsappService;
}

export function getWhatsAppService(): WhatsAppBusinessService | null {
  return whatsappService;
}
