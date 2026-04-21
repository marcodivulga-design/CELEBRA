import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Lightbulb } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  massMoment: string;
  liturgicalTime: string;
  lyrics?: string;
  chords?: string;
}

interface SongSuggestionsProps {
  massMoment?: string;
  liturgicalTime?: string;
  allSongs: Song[];
  onSelectSong: (song: Song) => void;
}

export function SongSuggestions({
  massMoment,
  liturgicalTime,
  allSongs,
  onSelectSong,
}: SongSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Song[]>([]);

  useEffect(() => {
    if (!massMoment && !liturgicalTime) {
      setSuggestions([]);
      return;
    }

    // Filtrar sugestões baseadas no momento da missa e tempo litúrgico
    const filtered = allSongs.filter((song) => {
      const matchesMoment = massMoment ? song.massMoment === massMoment : true;
      const matchesTime = liturgicalTime ? song.liturgicalTime === liturgicalTime : true;
      return matchesMoment && matchesTime;
    });

    // Pegar até 3 sugestões aleatórias
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setSuggestions(shuffled.slice(0, 3));
  }, [massMoment, liturgicalTime, allSongs]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-amber-900">Sugestões para este momento</h3>
      </div>

      <div className="space-y-2">
        {suggestions.map((song) => (
          <button
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="w-full text-left p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors border border-amber-100 hover:border-amber-300"
          >
            <div className="flex items-start gap-3">
              <Music className="h-4 w-4 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{song.title}</p>
                <p className="text-sm text-gray-600 truncate">{song.artist}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
