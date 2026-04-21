import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Music, Download, Volume2, ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface MusicSearchTRPCProps {
  onSongSelect?: (song: any) => void;
}

export const MusicSearchTRPC: React.FC<MusicSearchTRPCProps> = ({ onSongSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [transposeKey, setTransposeKey] = useState(0);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  const genres = ['liturgica', 'louvor', 'coral', 'instrumental'];
  const moments = ['entrada', 'ato_penitencial', 'gloria', 'salmo', 'ofertorio', 'santo', 'comunhao', 'final'];
  const times = ['comum', 'advento', 'natal', 'quaresma', 'pascoa', 'pentecostes', 'mariano', 'funerario', 'batizado'];

  // Fetch songs from tRPC
  const { data: allSongs = [], isLoading } = trpc.catholicMusic.getAllSongs.useQuery();

  const filteredSongs = useMemo(() => {
    return allSongs.filter((song: any) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.composer && song.composer.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGenre = !selectedGenre || song.genre === selectedGenre;
      const matchesMoment = !selectedMoment || song.massFunction === selectedMoment;
      const matchesTime = !selectedTime || song.liturgicalTime === selectedTime;

      return matchesSearch && matchesGenre && matchesMoment && matchesTime;
    });
  }, [allSongs, searchTerm, selectedGenre, selectedMoment, selectedTime]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSongSelect = (song: any) => {
    if (onSongSelect) {
      onSongSelect({ ...song, transposeKey });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por título, artista ou compositor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Genre Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Gênero</label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedGenre === null ? 'default' : 'outline'}
                onClick={() => setSelectedGenre(null)}
                disabled={isLoading}
              >
                Todos
              </Button>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  size="sm"
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  onClick={() => setSelectedGenre(genre)}
                  disabled={isLoading}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Moment Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Momento da Missa</label>
            <select
              value={selectedMoment || ''}
              onChange={(e) => setSelectedMoment(e.target.value || null)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isLoading}
            >
              <option value="">Todos os momentos</option>
              {moments.map((moment) => (
                <option key={moment} value={moment}>
                  {moment}
                </option>
              ))}
            </select>
          </div>

          {/* Liturgical Time Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tempo Litúrgico</label>
            <select
              value={selectedTime || ''}
              onChange={(e) => setSelectedTime(e.target.value || null)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled={isLoading}
            >
              <option value="">Todos os tempos</option>
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Carregando músicas...
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">
              {filteredSongs.length} música{filteredSongs.length !== 1 ? 's' : ''} encontrada{filteredSongs.length !== 1 ? 's' : ''}
            </h3>

            {filteredSongs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Nenhuma música encontrada com os filtros selecionados
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredSongs.map((song: any, idx: number) => (
                  <Card
                    key={`${song.id || idx}`}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedSongId(selectedSongId === `${idx}` ? null : `${idx}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{song.title}</CardTitle>
                          <CardDescription>
                            {song.artist}
                            {song.composer && ` • ${song.composer}`}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {song.hasAudio && <Volume2 className="w-4 h-4 text-blue-500" />}
                          {song.hasCifra && <Music className="w-4 h-4 text-green-500" />}
                          {song.hasSheet && <Download className="w-4 h-4 text-purple-500" />}
                          <span className="text-sm text-gray-600">{formatDuration(song.duration)}</span>
                        </div>
                      </div>
                    </CardHeader>

                    {selectedSongId === `${idx}` && (
                      <CardContent className="space-y-4 border-t pt-4">
                        {/* Song Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {song.genre && (
                            <div>
                              <span className="font-medium">Gênero:</span> {song.genre}
                            </div>
                          )}
                          {song.massFunction && (
                            <div>
                              <span className="font-medium">Momento:</span> {song.massFunction}
                            </div>
                          )}
                          {song.liturgicalTime && (
                            <div>
                              <span className="font-medium">Tempo:</span> {song.liturgicalTime}
                            </div>
                          )}
                          {song.source && (
                            <div>
                              <span className="font-medium">Fonte:</span> {song.source}
                            </div>
                          )}
                        </div>

                        {/* Transpose Controls */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Transposição</label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setTransposeKey(transposeKey - 1)}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 text-center">
                              <span className="text-sm font-medium">
                                {transposeKey > 0 ? '+' : ''}{transposeKey} semitons
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setTransposeKey(transposeKey + 1)}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setTransposeKey(0)}
                            >
                              Reset
                            </Button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {song.hasAudio && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Volume2 className="w-4 h-4 mr-2" />
                              Ouvir
                            </Button>
                          )}
                          {song.hasCifra && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Music className="w-4 h-4 mr-2" />
                              Cifra
                            </Button>
                          )}
                          {song.hasSheet && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Partitura
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSongSelect(song)}
                          >
                            Adicionar à Celebração
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
