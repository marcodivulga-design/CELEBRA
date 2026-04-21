import { describe, it, expect } from 'vitest';

// Função de transposição (copiada do componente para teste)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transposeNote(note: string, semitones: number): string {
  let index = NOTES.indexOf(note);
  if (index === -1) {
    index = NOTES_FLAT.indexOf(note);
  }
  if (index === -1) return note;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return NOTES[newIndex];
}

function transposeChord(chord: string, semitones: number): string {
  const match = chord.match(/^([A-G][#b]?)/);
  if (!match) return chord;

  const rootNote = match[1];
  const chordSuffix = chord.slice(rootNote.length);
  const transposedNote = transposeNote(rootNote, semitones);

  return transposedNote + chordSuffix;
}

function transposeChords(chordsText: string, semitones: number): string {
  return chordsText.replace(/\b([A-G][#b]?)(?:maj7|maj9|maj|m7|m9|m|sus4|sus2|add9|7|9|6|dim|aug)?\b/g, (match) => {
    return transposeChord(match, semitones);
  });
}

describe('ChordTransposer', () => {
  describe('transposeNote', () => {
    it('deve transpor uma nota para cima', () => {
      expect(transposeNote('C', 1)).toBe('C#');
      expect(transposeNote('C', 2)).toBe('D');
      expect(transposeNote('C', 12)).toBe('C');
    });

    it('deve transpor uma nota para baixo', () => {
      expect(transposeNote('C', -1)).toBe('B');
      expect(transposeNote('C', -2)).toBe('A#');
      expect(transposeNote('C', -12)).toBe('C');
    });

    it('deve lidar com notas com bemol', () => {
      expect(transposeNote('Db', 1)).toBe('D');
      expect(transposeNote('Db', -1)).toBe('C');
    });

    it('deve retornar a nota original se não encontrada', () => {
      expect(transposeNote('H', 1)).toBe('H');
      expect(transposeNote('X', 5)).toBe('X');
    });
  });

  describe('transposeChord', () => {
    it('deve transpor acordes maiores', () => {
      expect(transposeChord('C', 1)).toBe('C#');
      expect(transposeChord('G', 2)).toBe('A');
      expect(transposeChord('D', -1)).toBe('C#');
    });

    it('deve preservar o sufixo do acorde', () => {
      expect(transposeChord('Cm', 1)).toBe('C#m');
      expect(transposeChord('G7', 2)).toBe('A7');
      expect(transposeChord('Dm7', 1)).toBe('D#m7');
      expect(transposeChord('Cmaj7', 1)).toBe('C#maj7');
    });

    it('deve retornar o acorde original se não tiver nota raiz válida', () => {
      expect(transposeChord('X', 1)).toBe('X');
      expect(transposeChord('123', 1)).toBe('123');
    });
  });

  describe('transposeChords', () => {
    it('deve transpor múltiplos acordes em um texto', () => {
      const input = 'C G D A';
      const expected = 'C# G# D# A#';
      expect(transposeChords(input, 1)).toBe(expected);
    });

    it('deve transpor acordes com sufixos', () => {
      const input = 'Cm G7 Dmaj7';
      const expected = 'C#m G#7 D#maj7';
      expect(transposeChords(input, 1)).toBe(expected);
    });

    it('deve transpor para baixo', () => {
      const input = 'C G D';
      const expected = 'B F# C#';
      expect(transposeChords(input, -1)).toBe(expected);
    });

    it('deve preservar texto não-acorde', () => {
      const input = 'Verso: C G\nRefrão: D A';
      const result = transposeChords(input, 1);
      expect(result).toContain('Verso:');
      expect(result).toContain('Refrão:');
      expect(result).toContain('C#');
      expect(result).toContain('G#');
    });

    it('deve lidar com transposição de 0 semitones', () => {
      const input = 'C G D A';
      expect(transposeChords(input, 0)).toBe(input);
    });

    it('deve lidar com transposição de 12 semitones (uma oitava)', () => {
      const input = 'C G D';
      expect(transposeChords(input, 12)).toBe(input);
    });
  });
});
