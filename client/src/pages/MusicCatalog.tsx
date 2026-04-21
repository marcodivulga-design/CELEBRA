import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Music,
  Search,
  Play,
  Heart,
  Share2,
  Loader2,
  Volume2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AudioPlayer from "@/components/AudioPlayer";

interface Song {
  id: number;
  title: string;
  artist: string;
  theme?: string;
  audioUrl?: string;
  isPublic: number;
}

export default function MusicCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedArtist, setSelectedArtist] = useState("all");
  const [currentPlayingSong, setCurrentPlayingSong] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Buscar todas as músicas
  const songsQuery = trpc.songs.getAll.useQuery(
    { limit: 100, offset: 0 },
    { enabled: true }
  );

  // Buscar histórico de reprodução
  const playbackQuery = trpc.playback.getHistory.useQuery(
    { limit: 10 },
    { enabled: true }
  );

  // Buscar favoritos
  const favoritesQuery = trpc.favorites.getAll.useQuery(
    { limit: 100 },
    { enabled: true }
  );

  // Filtrar e buscar músicas
  const filteredSongs = useMemo(() => {
    if (!songsQuery.data) return [];

    let filtered = songsQuery.data;

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist?.toLowerCase().includes(query)
      );
    }

    // Filtro por gênero
    if (selectedGenre !== "all") {
      filtered = filtered.filter((song) => song.theme === selectedGenre);
    }

    // Filtro por artista
    if (selectedArtist !== "all") {
      filtered = filtered.filter((song) => song.artist === selectedArtist);
    }

    return filtered;
  }, [songsQuery.data, searchQuery, selectedGenre, selectedArtist]);

  // Extrair gêneros e artistas únicos
  const genres = useMemo(() => {
    if (!songsQuery.data) return [];
    const unique = new Set(songsQuery.data.map((s) => s.theme).filter(Boolean));
    return Array.from(unique).sort();
  }, [songsQuery.data]);

  const artists = useMemo(() => {
    if (!songsQuery.data) return [];
    const unique = new Set(songsQuery.data.map((s) => s.artist).filter(Boolean));
    return Array.from(unique).sort();
  }, [songsQuery.data]);

  const toggleFavorite = (songId: number) => {
    if (favorites.includes(songId)) {
      setFavorites(favorites.filter((id) => id !== songId));
      toast.success("Removido dos favoritos");
    } else {
      setFavorites([...favorites, songId]);
      toast.success("Adicionado aos favoritos");
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentPlayingSong(song);
    toast.success(`Reproduzindo: ${song.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Catálogo de Músicas</h1>
          </div>
          <p className="text-slate-600">
            Explore {songsQuery.data?.length || 0} músicas em nosso acervo
          </p>
        </div>

        {/* Player */}
        {currentPlayingSong && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-slate-900">
                  {currentPlayingSong.title}
                </h2>
                <p className="text-sm text-slate-600">{currentPlayingSong.artist}</p>
              </div>
            </div>
            <AudioPlayer
              audioUrl={currentPlayingSong.audioUrl}
              title={currentPlayingSong.title}
              artist={currentPlayingSong.artist}
              onEnded={() => setCurrentPlayingSong(null)}
            />
          </Card>
        )}

        {/* Filtros */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Título ou artista..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Gênero */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gênero
              </label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os gêneros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os gêneros</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre || ""}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Artista */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Artista
              </label>
              <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os artistas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os artistas</SelectItem>
                  {artists.map((artist) => (
                    <SelectItem key={artist} value={artist || ""}>
                      {artist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Resultados */}
        {songsQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredSongs.length === 0 ? (
          <Card className="p-12 text-center">
            <Music className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Nenhuma música encontrada</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSongs.map((song) => (
              <Card key={song.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                    {song.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">{song.artist}</p>
                  {song.theme && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {song.theme}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePlaySong(song)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>

                  <Button
                    onClick={() => toggleFavorite(song.id)}
                    variant="outline"
                    size="sm"
                    className={
                      favorites.includes(song.id)
                        ? "border-red-200 text-red-600"
                        : ""
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(song.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>

                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {songsQuery.data?.length || 0}
            </p>
            <p className="text-slate-600">Músicas no Catálogo</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {playbackQuery.data?.length || 0}
            </p>
            <p className="text-slate-600">Reproduções Recentes</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {favorites.length}
            </p>
            <p className="text-slate-600">Favoritos</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
