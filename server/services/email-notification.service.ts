import nodemailer from "nodemailer";

interface EmailNotification {
  to: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface CelebrationReminder {
  celebrationTitle: string;
  date: string;
  time: string;
  location?: string;
  type: string;
}

interface PastoralMessageNotification {
  title: string;
  author: string;
  excerpt: string;
  publishedAt: string;
}

export class EmailNotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@celebra.app",
        to: Array.isArray(notification.to) ? notification.to.join(",") : notification.to,
        subject: notification.subject,
        html: notification.htmlContent,
        text: notification.textContent,
      });
      return true;
    } catch (error) {
      console.error("[Email] Erro ao enviar email:", error);
      return false;
    }
  }

  async sendCelebrationReminder(
    userEmail: string,
    celebration: CelebrationReminder,
    hoursBeforeEvent: number = 24
  ): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🙏 Lembrete de Celebração</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0; color: #333;">Olá,</p>
          
          <p style="color: #555;">Você tem uma celebração agendada em <strong>${hoursBeforeEvent} horas</strong>:</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Tipo:</strong> ${celebration.type}</p>
            <p style="margin: 5px 0;"><strong>📆 Data:</strong> ${celebration.date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Hora:</strong> ${celebration.time}</p>
            ${celebration.location ? `<p style="margin: 5px 0;"><strong>📍 Local:</strong> ${celebration.location}</p>` : ""}
            <p style="margin: 5px 0;"><strong>✝️ Título:</strong> ${celebration.celebrationTitle}</p>
          </div>
          
          <p style="color: #555;">Certifique-se de estar preparado com as músicas e leituras litúrgicas sugeridas.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.VITE_APP_URL}/agendamento-celebracoes" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver Detalhes
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            Este é um email automático do CELEBRA. Não responda a este email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🙏 Lembrete: ${celebration.celebrationTitle} em ${hoursBeforeEvent}h`,
      htmlContent,
    });
  }

  async sendPastoralMessageNotification(
    userEmail: string,
    message: PastoralMessageNotification
  ): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">💬 Nova Mensagem Pastoral</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0; color: #333;">Olá,</p>
          
          <p style="color: #555;">Uma nova mensagem pastoral foi publicada:</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📝 Título:</strong> ${message.title}</p>
            <p style="margin: 5px 0;"><strong>✍️ Autor:</strong> ${message.author}</p>
            <p style="margin: 5px 0;"><strong>📅 Publicada em:</strong> ${message.publishedAt}</p>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 5px 0; color: #666; font-style: italic;">"${message.excerpt}"</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.VITE_APP_URL}/espaco-padres" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ler Mensagem Completa
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            Este é um email automático do CELEBRA. Não responda a este email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `💬 Nova Mensagem Pastoral: ${message.title}`,
      htmlContent,
    });
  }

  async sendBulkCelebrationReminders(
    userEmails: string[],
    celebration: CelebrationReminder
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const email of userEmails) {
      const result = await this.sendCelebrationReminder(email, celebration);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  async sendBulkPastoralMessages(
    userEmails: string[],
    message: PastoralMessageNotification
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const email of userEmails) {
      const result = await this.sendPastoralMessageNotification(email, message);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🙏 Bem-vindo ao CELEBRA</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0; color: #333;">Olá ${userName},</p>
          
          <p style="color: #555;">Bem-vindo ao CELEBRA, a plataforma de gestão musical litúrgica!</p>
          
          <p style="color: #555;">Aqui você pode:</p>
          <ul style="color: #555;">
            <li>📅 Agendar celebrações com sugestões automáticas de músicas</li>
            <li>🎵 Explorar um catálogo de 540 músicas litúrgicas</li>
            <li>💬 Compartilhar mensagens pastorais com a comunidade</li>
            <li>📊 Visualizar estatísticas de engajamento</li>
            <li>🎧 Gerar áudios com Suno AI</li>
          </ul>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.VITE_APP_URL}/dashboard" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acessar Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            Este é um email automático do CELEBRA. Não responda a este email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: "🙏 Bem-vindo ao CELEBRA",
      htmlContent,
    });
  }
}

export const emailNotificationService = new EmailNotificationService();
