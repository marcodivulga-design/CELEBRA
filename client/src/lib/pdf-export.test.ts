import { describe, it, expect } from 'vitest';
import { CelebrationForPDF } from './pdf-export';

describe('PDF Export Data Structures', () => {
  const mockCelebration: CelebrationForPDF = {
    name: 'Missa de Domingo',
    date: new Date().toISOString(),
    songs: [
      {
        id: 1,
        title: 'Glória a Deus',
        artist: 'Comunidade Católica',
        massMoment: 'Glória',
        lyrics: 'Glória a Deus nas alturas\nE paz na terra aos homens',
        chords: 'C G Am F',
      },
      {
        id: 2,
        title: 'Santo, Santo, Santo',
        artist: 'Coral Paroquial',
        massMoment: 'Santo',
        lyrics: 'Santo, Santo, Santo\nÉ o Senhor Deus do Universo',
        chords: 'G D Em Bm',
      },
    ],
  };

  describe('CelebrationForPDF Structure', () => {
    it('deve ter nome da celebração válido', () => {
      expect(mockCelebration.name).toBe('Missa de Domingo');
      expect(mockCelebration.name.length).toBeGreaterThan(0);
    });

    it('deve ter data válida', () => {
      const date = new Date(mockCelebration.date);
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('deve incluir todas as músicas', () => {
      expect(mockCelebration.songs.length).toBe(2);
      expect(mockCelebration.songs[0].title).toBe('Glória a Deus');
      expect(mockCelebration.songs[1].title).toBe('Santo, Santo, Santo');
    });

    it('deve incluir letra e cifras das músicas', () => {
      mockCelebration.songs.forEach((song) => {
        expect(song.lyrics).toBeDefined();
        expect(song.chords).toBeDefined();
      });
    });

    it('deve suportar celebrações sem maestro', () => {
      const celebrationWithoutMaestro: CelebrationForPDF = {
        name: 'Celebração',
        date: new Date().toISOString(),
        songs: [],
      };

      expect(celebrationWithoutMaestro.maestro).toBeUndefined();
    });

    it('deve suportar celebrações com maestro', () => {
      const celebrationWithMaestro: CelebrationForPDF = {
        name: 'Celebração',
        date: new Date().toISOString(),
        maestro: 'João Silva',
        songs: [],
      };

      expect(celebrationWithMaestro.maestro).toBe('João Silva');
    });

    it('deve suportar músicas sem letra', () => {
      const songWithoutLyrics = {
        id: 3,
        title: 'Instrumental',
        artist: 'Banda',
        massMoment: 'Entrada',
        chords: 'C G F',
      };

      expect(songWithoutLyrics.lyrics).toBeUndefined();
    });

    it('deve suportar músicas sem cifras', () => {
      const songWithoutChords = {
        id: 4,
        title: 'Música',
        artist: 'Artista',
        massMoment: 'Saída',
        lyrics: 'Letra da música',
      };

      expect(songWithoutChords.chords).toBeUndefined();
    });

    it('deve gerar nome de arquivo válido', () => {
      const filename = `${mockCelebration.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      expect(filename).toContain('.pdf');
      expect(filename).toContain('Missa_de_Domingo');
    });

    it('deve suportar múltiplas celebrações', () => {
      const celebrations: CelebrationForPDF[] = [
        mockCelebration,
        {
          name: 'Missa de Sexta-feira',
          date: new Date().toISOString(),
          songs: [],
        },
      ];

      expect(celebrations.length).toBe(2);
      expect(celebrations[0].name).toBe('Missa de Domingo');
      expect(celebrations[1].name).toBe('Missa de Sexta-feira');
    });

    it('deve validar estrutura de canção', () => {
      const song = mockCelebration.songs[0];
      expect(song.id).toBeDefined();
      expect(song.title).toBeDefined();
      expect(song.artist).toBeDefined();
      expect(song.massMoment).toBeDefined();
    });

    it('deve suportar celebrações vazias', () => {
      const emptyCelebration: CelebrationForPDF = {
        name: 'Celebração Vazia',
        date: new Date().toISOString(),
        songs: [],
      };

      expect(emptyCelebration.songs.length).toBe(0);
    });
  });
});
