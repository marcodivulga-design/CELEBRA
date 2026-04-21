import { getDb } from '../db';
import { songs } from '../../drizzle/schema';

/**
 * SunoService - Integração com Suno API para geração de músicas
 * Permite gerar, editar e gerenciar músicas criadas com IA
 */
export class SunoService {
  /**
   * Gera uma nova música usando Suno API
   * @param prompt - Descrição da música desejada
   * @param style - Estilo musical (rock, pop, clássico, etc)
   * @param duration - Duração em segundos (máx 600)
   * @param organizationId - ID da organização
   * @returns ID da música gerada
   */
  async generateMusic(
    prompt: string,
    style: string,
    duration: number,
    organizationId: number
  ) {
    try {
      console.log('[Suno] Gerando música:', {
        prompt,
        style,
        duration,
        organizationId,
      });

      // Chamada à Suno API (implementar com credenciais reais)
      const response = await fetch('https://api.suno.ai/api/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          duration,
          tags: ['liturgical', 'catholic'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Salvar música no banco de dados
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const result = await db.insert(songs).values({
        title: `Gerada por IA: ${prompt.substring(0, 50)}`,
        artist: 'Suno AI',
        liturgicalTime: style,
        lyrics: prompt,
        audioUrl: data.audio_url,
        isPublic: 0,
      });

      console.log('[Suno] Música gerada com sucesso:', data.id);
      return { id: result[0], sunoId: data.id, url: data.audio_url };
    } catch (error) {
      console.error('[Suno] Erro ao gerar música:', error);
      throw new Error('Falha ao gerar música com Suno');
    }
  }

  /**
   * Edita uma música existente no Suno
   * @param sunoId - ID da música no Suno
   * @param updates - Atualizações (prompt, style, duration)
   * @returns Música atualizada
   */
  async editMusic(
    sunoId: string,
    updates: {
      prompt?: string;
      style?: string;
      duration?: number;
    }
  ) {
    try {
      console.log('[Suno] Editando música:', { sunoId, updates });

      // Chamada à Suno API para editar
      const response = await fetch(`https://api.suno.ai/api/generate/${sunoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Suno] Música editada com sucesso');
      return data;
    } catch (error) {
      console.error('[Suno] Erro ao editar música:', error);
      throw new Error('Falha ao editar música');
    }
  }

  /**
   * Obtém status de geração de música
   * @param sunoId - ID da música no Suno
   * @returns Status da geração
   */
  async getMusicStatus(sunoId: string) {
    try {
      console.log('[Suno] Obtendo status:', sunoId);

      const response = await fetch(`https://api.suno.ai/api/generate/${sunoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        status: data.status, // 'generating', 'completed', 'failed'
        audioUrl: data.audio_url,
        error: data.error,
      };
    } catch (error) {
      console.error('[Suno] Erro ao obter status:', error);
      throw new Error('Falha ao obter status da música');
    }
  }

  /**
   * Deleta uma música do Suno
   * @param sunoId - ID da música no Suno
   */
  async deleteMusic(sunoId: string) {
    try {
      console.log('[Suno] Deletando música:', sunoId);

      const response = await fetch(`https://api.suno.ai/api/generate/${sunoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      console.log('[Suno] Música deletada com sucesso');
      return { success: true };
    } catch (error) {
      console.error('[Suno] Erro ao deletar música:', error);
      throw new Error('Falha ao deletar música');
    }
  }

  /**
   * Gera múltiplas variações de uma música
   * @param sunoId - ID da música original
   * @param variations - Número de variações (máx 5)
   * @returns Array de IDs das variações
   */
  async generateVariations(sunoId: string, variations: number = 3) {
    try {
      console.log('[Suno] Gerando variações:', { sunoId, variations });

      const response = await fetch(`https://api.suno.ai/api/generate/${sunoId}/variations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: Math.min(variations, 5) }),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Suno] Variações geradas:', data.ids);
      return data.ids;
    } catch (error) {
      console.error('[Suno] Erro ao gerar variações:', error);
      throw new Error('Falha ao gerar variações');
    }
  }

  /**
   * Obtém histórico de músicas geradas
   * @param organizationId - ID da organização
   * @param limit - Número máximo de resultados
   * @returns Array de músicas geradas
   */
  async getGeneratedMusicHistory(organizationId: number, limit: number = 20) {
    try {
      console.log('[Suno] Obtendo histórico:', { organizationId, limit });

      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const result = await db
        .select()
        .from(songs)
        .limit(limit);

      console.log('[Suno] Histórico obtido:', result.length);
      return result;
    } catch (error) {
      console.error('[Suno] Erro ao obter histórico:', error);
      throw new Error('Falha ao obter histórico de músicas');
    }
  }
}

export const sunoService = new SunoService();
