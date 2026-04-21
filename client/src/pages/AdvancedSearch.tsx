import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Music, Search, Filter, X } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  liturgicalTime: string;
  massMoment: string;
  youtubeUrl?: string;
}

const mockSongs: Song[] = [
  {
    id: 1,
    title: 'Eis o Tempo de Conversão',
    artist: 'Comunidade Católica',
    genre: 'Litúrgico',
    duration: 240,
    liturgicalTime: 'Quaresma',
    massMoment: 'Entrada',
    youtubeUrl: 'https://youtube.com/watch?v=example1',
  },
  {
    id: 2,
    title: 'Glória a Deus nas Alturas',
    artist: 'Coral da Igreja',
    genre: 'Hino',
    duration: 180,
    liturgicalTime: 'Natal',
    massMoment: 'Glória',
    youtubeUrl: 'https://youtube.com/watch?v=example2',
  },
  {
    id: 3,
    title: 'Aleluia',
    artist: 'Coro Gregoriano',
    genre: 'Gregoriano',
    duration: 120,
    liturgicalTime: 'Páscoa',
    massMoment: 'Aleluia',
    youtubeUrl: 'https://youtube.com/watch?v=example3',
  },
  {
    id: 4,
    title: 'Cântico de Louvor',
    artist: 'Comunidade Católica',
    genre: 'Contemporâneo',
    duration: 200,
    liturgicalTime: 'Tempo Comum',
    massMoment: 'Comunhão',
    youtubeUrl: 'https://youtube.com/watch?v=example4',
  },
  {
    id: 5,
    title: 'Hino de Ação de Graças',
    artist: 'Coral da Igreja',
    genre: 'Tradicional',
    duration: 150,
    liturgicalTime: 'Pentecostes',
    massMoment: 'Recessional',
    youtubeUrl: 'https://youtube.com/watch?v=example5',
  },
];

const GENRES = ['Litúrgico', 'Hino', 'Gregoriano', 'Contemporâneo', 'Tradicional', 'Coral'];
const LITURGICAL_TIMES = ['Advento', 'Natal', 'Quaresma', 'Páscoa', 'Pentecostes', 'Tempo Comum'];
const MASS_MOMENTS = ['Entrada', 'Glória', 'Aleluia', 'Ofertório', 'Comunhão', 'Recessional'];

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLiturgicalTimes, setSelectedLiturgicalTimes] = useState<string[]>([]);
  const [selectedMassMoments, setSelectedMassMoments] = useState<string[]>([]);
  const [durationMin, setDurationMin] = useState(0);
  const [durationMax, setDurationMax] = useState(600);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSongs = mockSongs.filter((song) => {
    const matchesQuery =
      query === '' ||
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase());

    const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(song.genre);
    const matchesLiturgicalTime =
      selectedLiturgicalTimes.length === 0 || selectedLiturgicalTimes.includes(song.liturgicalTime);
    const matchesMassMoment =
      selectedMassMoments.length === 0 || selectedMassMoments.includes(song.massMoment);
    const matchesDuration = song.duration >= durationMin && song.duration <= durationMax;

    return (
      matchesQuery &&
      matchesGenre &&
      matchesLiturgicalTime &&
      matchesMassMoment &&
      matchesDuration
    );
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleLiturgicalTime = (time: string) => {
    setSelectedLiturgicalTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleMassMoment = (moment: string) => {
    setSelectedMassMoments((prev) =>
      prev.includes(moment) ? prev.filter((m) => m !== moment) : [...prev, moment]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedGenres([]);
    setSelectedLiturgicalTimes([]);
    setSelectedMassMoments([]);
    setDurationMin(0);
    setDurationMax(600);
  };

  const activeFiltersCount =
    (query ? 1 : 0) +
    selectedGenres.length +
    selectedLiturgicalTimes.length +
    selectedMassMoments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Busca Avançada de Músicas</h1>
        <p className="text-muted-foreground">Encontre músicas perfeitas para sua celebração</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou artista..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={resetFilters} className="gap-2">
                <X className="w-4 h-4" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gênero */}
            <div>
              <h3 className="font-semibold mb-3">Gênero</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tempo Litúrgico */}
            <div>
              <h3 className="font-semibold mb-3">Tempo Litúrgico</h3>
              <div className="flex flex-wrap gap-2">
                {LITURGICAL_TIMES.map((time) => (
                  <Badge
                    key={time}
                    variant={selectedLiturgicalTimes.includes(time) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleLiturgicalTime(time)}
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Parte da Missa */}
            <div>
              <h3 className="font-semibold mb-3">Parte da Missa</h3>
              <div className="flex flex-wrap gap-2">
                {MASS_MOMENTS.map((moment) => (
                  <Badge
                    key={moment}
                    variant={selectedMassMoments.includes(moment) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleMassMoment(moment)}
                  >
                    {moment}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Duração */}
            <div>
              <h3 className="font-semibold mb-3">Duração</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mínimo: {Math.floor(durationMin / 60)}:{String(durationMin % 60).padStart(2, '0')}</span>
                  <span>Máximo: {Math.floor(durationMax / 60)}:{String(durationMax % 60).padStart(2, '0')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="600"
                  value={durationMax}
                  onChange={(e) => setDurationMax(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Resultados ({filteredSongs.length})
        </h2>
        <div className="grid gap-4">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <Card key={song.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-lg">{song.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{song.artist}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{song.genre}</Badge>
                        <Badge variant="outline">{song.liturgicalTime}</Badge>
                        <Badge variant="outline">{song.massMoment}</Badge>
                        <Badge variant="outline">
                          {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                        </Badge>
                      </div>
                    </div>
                    {song.youtubeUrl && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(song.youtubeUrl, '_blank')}
                      >
                        Ouvir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">Nenhuma música encontrada com esses filtros</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
