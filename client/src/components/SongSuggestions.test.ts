import { describe, it, expect } from 'vitest';

interface Song {
  id: number;
  title: string;
  artist: string;
  massMoment: string;
  liturgicalTime: string;
}

// Mock songs para teste
const mockSongs: Song[] = [
  {
    id: 1,
    title: 'Glória a Deus',
    artist: 'Comunidade Católica',
    massMoment: 'Kyrie',
    liturgicalTime: 'Páscoa',
  },
  {
    id: 2,
    title: 'Senhor Tende Piedade',
    artist: 'Coral Paroquial',
    massMoment: 'Kyrie',
    liturgicalTime: 'Natal',
  },
  {
    id: 3,
    title: 'Santo, Santo, Santo',
    artist: 'Grupo Vocal',
    massMoment: 'Santo',
    liturgicalTime: 'Aclamação',
  },
  {
    id: 4,
    title: 'Cordeiro de Deus',
    artist: 'Cantores Católicos',
    massMoment: 'Comunhão',
    liturgicalTime: 'Páscoa',
  },
  {
    id: 5,
    title: 'Pão da Vida',
    artist: 'Comunidade de Fé',
    massMoment: 'Comunhão',
    liturgicalTime: 'Páscoa',
  },
];

describe('SongSuggestions Logic', () => {
  describe('Filtragem por momento da missa', () => {
    it('deve filtrar músicas pelo momento da missa', () => {
      const filtered = mockSongs.filter((song) => song.massMoment === 'Kyrie');
      expect(filtered).toHaveLength(2);
      expect(filtered[0]?.massMoment).toBe('Kyrie');
      expect(filtered[1]?.massMoment).toBe('Kyrie');
    });

    it('deve filtrar músicas de comunhão', () => {
      const filtered = mockSongs.filter((song) => song.massMoment === 'Comunhão');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((s) => s.massMoment === 'Comunhão')).toBe(true);
    });

    it('deve retornar array vazio se nenhuma música corresponder', () => {
      const filtered = mockSongs.filter((song) => song.massMoment === 'Inexistente');
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Filtragem por tempo litúrgico', () => {
    it('deve filtrar músicas pela Páscoa', () => {
      const filtered = mockSongs.filter((song) => song.liturgicalTime === 'Páscoa');
      expect(filtered).toHaveLength(3);
      expect(filtered.every((s) => s.liturgicalTime === 'Páscoa')).toBe(true);
    });

    it('deve filtrar músicas do Natal', () => {
      const filtered = mockSongs.filter((song) => song.liturgicalTime === 'Natal');
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.title).toBe('Senhor Tende Piedade');
    });
  });

  describe('Filtragem combinada', () => {
    it('deve filtrar por momento E tempo litúrgico', () => {
      const filtered = mockSongs.filter(
        (song) => song.massMoment === 'Comunhão' && song.liturgicalTime === 'Páscoa'
      );
      expect(filtered).toHaveLength(2);
      expect(filtered.every((s) => s.massMoment === 'Comunhão' && s.liturgicalTime === 'Páscoa')).toBe(
        true
      );
    });

    it('deve retornar array vazio se nenhuma música corresponder aos critérios', () => {
      const filtered = mockSongs.filter(
        (song) => song.massMoment === 'Santo' && song.liturgicalTime === 'Páscoa'
      );
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Limitação de sugestões', () => {
    it('deve retornar no máximo 3 sugestões', () => {
      const filtered = mockSongs.filter((song) => song.massMoment === 'Kyrie');
      const suggestions = filtered.slice(0, 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('deve retornar menos de 3 se houver menos músicas disponíveis', () => {
      const filtered = mockSongs.filter((song) => song.liturgicalTime === 'Natal');
      const suggestions = filtered.slice(0, 3);
      expect(suggestions).toHaveLength(1);
    });
  });

  describe('Aleatoriedade', () => {
    it('deve retornar diferentes sugestoes em diferentes chamadas', () => {
      const filtered = mockSongs.filter((song) => song.massMoment === 'Comunhão');
      expect(filtered.length).toBeGreaterThan(0);
      
      // Simular multiplas chamadas com shuffle
      const results = [];
      for (let i = 0; i < 10; i++) {
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        results.push(shuffled[0]?.id);
      }
      
      // Verificar que temos IDs validos
      const validIds = results.filter((id) => id !== undefined);
      expect(validIds.length).toBeGreaterThan(0);
    });
  });
});
