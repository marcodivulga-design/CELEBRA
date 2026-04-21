/**
 * GoogleCalendarService - Sincronização com Google Calendar
 * Exporta eventos, celebrações e escalas para calendários do Google
 */
export class GoogleCalendarService {
  /**
   * Autentica com Google Calendar API
   * @param userId - ID do usuário
   * @param refreshToken - Token de refresh do Google
   */
  async authenticate(userId: number, refreshToken: string) {
    try {
      console.log('[Google Calendar] Autenticando usuário:', userId);

      // Chamada à Google OAuth (implementar com credenciais reais)
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Google OAuth error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Google Calendar] Autenticação bem-sucedida');
      return { accessToken: data.access_token, expiresIn: data.expires_in };
    } catch (error) {
      console.error('[Google Calendar] Erro de autenticação:', error);
      throw new Error('Falha na autenticação com Google Calendar');
    }
  }

  /**
   * Cria um evento no Google Calendar
   * @param accessToken - Token de acesso do Google
   * @param calendarId - ID do calendário (default: 'primary')
   * @param event - Dados do evento
   */
  async createEvent(
    accessToken: string,
    event: {
      title: string;
      description?: string;
      startTime: string; // ISO 8601
      endTime: string; // ISO 8601
      location?: string;
      attendees?: string[]; // emails
    },
    calendarId: string = 'primary'
  ) {
    try {
      console.log('[Google Calendar] Criando evento:', event.title);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: event.title,
            description: event.description,
            start: { dateTime: event.startTime, timeZone: 'America/Sao_Paulo' },
            end: { dateTime: event.endTime, timeZone: 'America/Sao_Paulo' },
            location: event.location,
            attendees: event.attendees?.map(email => ({ email })),
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 1440 }, // 24h antes
                { method: 'popup', minutes: 30 }, // 30min antes
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Google Calendar] Evento criado:', data.id);
      return { eventId: data.id, eventUrl: data.htmlLink };
    } catch (error) {
      console.error('[Google Calendar] Erro ao criar evento:', error);
      throw new Error('Falha ao criar evento no Google Calendar');
    }
  }

  /**
   * Atualiza um evento no Google Calendar
   * @param accessToken - Token de acesso do Google
   * @param eventId - ID do evento
   * @param updates - Atualizações do evento
   * @param calendarId - ID do calendário
   */
  async updateEvent(
    accessToken: string,
    eventId: string,
    updates: {
      title?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      location?: string;
    },
    calendarId: string = 'primary'
  ) {
    try {
      console.log('[Google Calendar] Atualizando evento:', eventId);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: updates.title,
            description: updates.description,
            start: updates.startTime ? { dateTime: updates.startTime, timeZone: 'America/Sao_Paulo' } : undefined,
            end: updates.endTime ? { dateTime: updates.endTime, timeZone: 'America/Sao_Paulo' } : undefined,
            location: updates.location,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar error: ${response.statusText}`);
      }

      console.log('[Google Calendar] Evento atualizado');
      return { success: true };
    } catch (error) {
      console.error('[Google Calendar] Erro ao atualizar evento:', error);
      throw new Error('Falha ao atualizar evento no Google Calendar');
    }
  }

  /**
   * Deleta um evento do Google Calendar
   * @param accessToken - Token de acesso do Google
   * @param eventId - ID do evento
   * @param calendarId - ID do calendário
   */
  async deleteEvent(
    accessToken: string,
    eventId: string,
    calendarId: string = 'primary'
  ) {
    try {
      console.log('[Google Calendar] Deletando evento:', eventId);

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar error: ${response.statusText}`);
      }

      console.log('[Google Calendar] Evento deletado');
      return { success: true };
    } catch (error) {
      console.error('[Google Calendar] Erro ao deletar evento:', error);
      throw new Error('Falha ao deletar evento do Google Calendar');
    }
  }

  /**
   * Exporta celebração para Google Calendar
   * @param accessToken - Token de acesso
   * @param celebration - Dados da celebração
   */
  async exportCelebration(
    accessToken: string,
    celebration: {
      id: number;
      title: string;
      date: string;
      time: string;
      location?: string;
      attendees?: string[];
    }
  ) {
    const startTime = new Date(`${celebration.date}T${celebration.time}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

    return this.createEvent(accessToken, {
      title: `Celebração: ${celebration.title}`,
      description: `Celebração litúrgica: ${celebration.title}`,
      startTime,
      endTime,
      location: celebration.location,
      attendees: celebration.attendees,
    });
  }

  /**
   * Exporta escala para Google Calendar
   * @param accessToken - Token de acesso
   * @param scale - Dados da escala
   */
  async exportScale(
    accessToken: string,
    scale: {
      id: number;
      name: string;
      date: string;
      time: string;
      position: string;
      attendees?: string[];
    }
  ) {
    const startTime = new Date(`${scale.date}T${scale.time}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + 120 * 60 * 1000).toISOString();

    return this.createEvent(accessToken, {
      title: `Escala: ${scale.name} - ${scale.position}`,
      description: `Escala de ministério: ${scale.name}\nPosição: ${scale.position}`,
      startTime,
      endTime,
      attendees: scale.attendees,
    });
  }

  /**
   * Exporta evento para Google Calendar
   * @param accessToken - Token de acesso
   * @param event - Dados do evento
   */
  async exportEvent(
    accessToken: string,
    event: {
      id: number;
      title: string;
      date: string;
      time: string;
      location?: string;
      description?: string;
      attendees?: string[];
    }
  ) {
    const startTime = new Date(`${event.date}T${event.time}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + 120 * 60 * 1000).toISOString();

    return this.createEvent(accessToken, {
      title: event.title,
      description: event.description,
      startTime,
      endTime,
      location: event.location,
      attendees: event.attendees,
    });
  }

  /**
   * Sincroniza todos os eventos da organização
   * @param accessToken - Token de acesso
   * @param events - Array de eventos para sincronizar
   */
  async syncAllEvents(
    accessToken: string,
    events: Array<{
      type: 'celebration' | 'scale' | 'event';
      data: any;
    }>
  ) {
    try {
      console.log('[Google Calendar] Sincronizando', events.length, 'eventos');

      const results = [];
      for (const event of events) {
        try {
          let result;
          if (event.type === 'celebration') {
            result = await this.exportCelebration(accessToken, event.data);
          } else if (event.type === 'scale') {
            result = await this.exportScale(accessToken, event.data);
          } else {
            result = await this.exportEvent(accessToken, event.data);
          }
          results.push({ type: event.type, success: true, result });
        } catch (error) {
          results.push({ type: event.type, success: false, error: String(error) });
        }
      }

      console.log('[Google Calendar] Sincronização concluída');
      return results;
    } catch (error) {
      console.error('[Google Calendar] Erro na sincronização:', error);
      throw new Error('Falha na sincronização com Google Calendar');
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
