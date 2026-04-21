import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  genres: string[];
  durationMin: number;
  durationMax: number;
  popularity: 'trending' | 'classic' | 'new' | '';
  liturgicalTime: string;
  massMoment: string;
}

interface AdvancedSearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export function AdvancedSearchFilter({ onSearch, isLoading }: AdvancedSearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genres: [],
    durationMin: 0,
    durationMax: 600,
    popularity: '',
    liturgicalTime: '',
    massMoment: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const genres = ['Litúrgico', 'Hino', 'Gregoriano', 'Contemporâneo', 'Tradicional', 'Coral'];
  const liturgicalTimes = ['Advento', 'Natal', 'Quaresma', 'Páscoa', 'Pentecostes', 'Tempo Comum'];
  const massMoments = ['Entrada', 'Glória', 'Aleluia', 'Ofertório', 'Comunhão', 'Recessional'];
  const popularityOptions = [
    { value: 'trending', label: 'Em Tendência' },
    { value: 'classic', label: 'Clássicas' },
    { value: 'new', label: 'Novas' },
  ];

  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleGenreToggle = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleReset = () => {
    setFilters({
      query: '',
      genres: [],
      durationMin: 0,
      durationMax: 600,
      popularity: '',
      liturgicalTime: '',
      massMoment: '',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, artista..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Active Filters Display */}
      {(filters.genres.length > 0 ||
        filters.liturgicalTime ||
        filters.massMoment ||
        filters.popularity) && (
        <div className="flex flex-wrap gap-2">
          {filters.genres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleGenreToggle(genre)}
              />
            </Badge>
          ))}
          {filters.liturgicalTime && (
            <Badge variant="secondary" className="gap-1">
              {filters.liturgicalTime}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, liturgicalTime: '' }))}
              />
            </Badge>
          )}
          {filters.massMoment && (
            <Badge variant="secondary" className="gap-1">
              {filters.massMoment}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, massMoment: '' }))}
              />
            </Badge>
          )}
          {filters.popularity && (
            <Badge variant="secondary" className="gap-1">
              {popularityOptions.find((p) => p.value === filters.popularity)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, popularity: '' }))}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Expandable Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Genres */}
            <div className="space-y-3">
              <h4 className="font-medium">Gênero</h4>
              <div className="grid grid-cols-2 gap-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={filters.genres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                    />
                    <label
                      htmlFor={`genre-${genre}`}
                      className="text-sm cursor-pointer"
                    >
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <h4 className="font-medium">Duração</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatDuration(filters.durationMin)}</span>
                  <span>{formatDuration(filters.durationMax)}</span>
                </div>
                <Slider
                  min={0}
                  max={600}
                  step={30}
                  value={[filters.durationMin, filters.durationMax]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      durationMin: min,
                      durationMax: max,
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Popularity */}
            <div className="space-y-3">
              <h4 className="font-medium">Popularidade</h4>
              <div className="space-y-2">
                {popularityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`popularity-${option.value}`}
                      checked={filters.popularity === option.value}
                      onCheckedChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          popularity: prev.popularity === option.value ? '' : (option.value as any),
                        }))
                      }
                    />
                    <label
                      htmlFor={`popularity-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Liturgical Time */}
            <div className="space-y-3">
              <h4 className="font-medium">Tempo Litúrgico</h4>
              <select
                value={filters.liturgicalTime}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, liturgicalTime: e.target.value }))
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Todos</option>
                {liturgicalTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Mass Moment */}
            <div className="space-y-3">
              <h4 className="font-medium">Parte da Missa</h4>
              <select
                value={filters.massMoment}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, massMoment: e.target.value }))
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Todas</option>
                {massMoments.map((moment) => (
                  <option key={moment} value={moment}>
                    {moment}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} className="flex-1" disabled={isLoading}>
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
