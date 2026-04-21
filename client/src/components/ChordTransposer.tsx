import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChordTransposerProps {
  originalChords: string;
  onTranspose: (transposedChords: string) => void;
}

// Notas musicais em ordem cromática
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Mapa de acordes comuns
const CHORD_PATTERNS = [
  // Acordes maiores e menores
  /\b([A-G](?:[#b])?)(maj7|maj9|maj|m7|m9|m|sus4|sus2|add9|7|9|6|dim|aug)?\b/g,
];

function transposeNote(note: string, semitones: number): string {
  // Encontra o índice da nota
  let index = NOTES.indexOf(note);
  if (index === -1) {
    index = NOTES_FLAT.indexOf(note);
  }
  if (index === -1) return note; // Se não encontrar, retorna a nota original

  // Calcula o novo índice
  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  // Retorna a nota transposta
  return NOTES[newIndex];
}

function transposeChord(chord: string, semitones: number): string {
  // Extrai a nota raiz do acorde
  const match = chord.match(/^([A-G][#b]?)/);
  if (!match) return chord;

  const rootNote = match[1];
  const chordSuffix = chord.slice(rootNote.length);
  const transposedNote = transposeNote(rootNote, semitones);

  return transposedNote + chordSuffix;
}

function transposeChords(chordsText: string, semitones: number): string {
  // Encontra todos os acordes no texto e os transpõe
  return chordsText.replace(/\b([A-G][#b]?)(?:maj7|maj9|maj|m7|m9|m|sus4|sus2|add9|7|9|6|dim|aug)?\b/g, (match) => {
    return transposeChord(match, semitones);
  });
}

export function ChordTransposer({ originalChords, onTranspose }: ChordTransposerProps) {
  const [semitones, setSemitones] = useState(0);

  const handleTranspose = (delta: number) => {
    const newSemitones = semitones + delta;
    if (newSemitones >= -6 && newSemitones <= 6) {
      setSemitones(newSemitones);
      const transposed = transposeChords(originalChords, newSemitones);
      onTranspose(transposed);
    }
  };

  const handleReset = () => {
    setSemitones(0);
    onTranspose(originalChords);
  };

  const getToneLabel = () => {
    if (semitones === 0) return 'Tom Original';
    const direction = semitones > 0 ? '+' : '';
    return `${direction}${semitones} tom${Math.abs(semitones) > 1 ? 'ns' : ''}`;
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleTranspose(-1)}
        disabled={semitones <= -6}
        className="h-8 w-8 p-0"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      <div className="flex-1 text-center">
        <span className="text-sm font-medium">{getToneLabel()}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleTranspose(1)}
        disabled={semitones >= 6}
        className="h-8 w-8 p-0"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {semitones !== 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs"
        >
          Resetar
        </Button>
      )}
    </div>
  );
}
