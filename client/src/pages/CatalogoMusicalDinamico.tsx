import { useState, useMemo } from "react";
import { Search, Filter, Music, Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Musica {
  id: number;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  liturgicalTime?: string;
  massFunction?: string;
  audioUrl?: string;
  isFavorite?: boolean;
}

// Mock data - será substituído por dados reais do backend
const MOCK_MUSICAS: Musica[] = [
  {
    id: 1,
    title: "A Alegria Está no Coração",
    artist: "Comunidade Católica",
    genre: "Hino",
    duration: "3:45",
    liturgicalTime: "Ordinário",
    massFunction: "Entrada",
  },
  {
    id: 2,
    title: "Celebrai com Júbilo ao Senhor",
    artist: "Coral Paroquial",
    genre: "Cântico",
    duration: "4:12",
    liturgicalTime: "Páscoa",
    massFunction: "Comunhão",
  },
  {
    id: 3,
    title: "Cantai ao Senhor um Canto Novo",
    artist: "Grupo Vocal",
    genre: "Salmo",
    duration: "3:20",
    liturgicalTime: "Pentecostes",
    massFunction: "Glória",
  },
  {
    id: 4,
    title: "Santo, Santo, Santo",
    artist: "Coral Litúrgico",
    genre: "Hino",
    duration: "2:50",
    liturgicalTime: "Ordinário",
    massFunction: "Glória",
  },
];

const LITURGICAL_TIMES = [
  "Advento",
  "Natal",
  "Quaresma",
  "Páscoa",
  "Pentecostes",
  "Ordinário",
];

const MASS_FUNCTIONS = ["Entrada", "Glória", "Comunhão", "Saída"];

const GENRES = ["Hino", "Cântico", "Salmo", "Responsório", "Sequência"];

export default function CatalogoMusicalDinamico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLiturgicalTime, setSelectedLiturgicalTime] = useState<
    string | null
  >(null);
  const [selectedMassFunction, setSelectedMassFunction] = useState<
    string | null
  >(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"title" | "artist" | "recent">("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const itemsPerPage = 20;

  // Filtrar e ordenar músicas
  const filteredMusicas = useMemo(() => {
    let result = MOCK_MUSICAS.filter((musica) => {
      const matchesSearch =
        musica.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musica.artist.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLiturgical =
        !selectedLiturgicalTime ||
        musica.liturgicalTime === selectedLiturgicalTime;

      const matchesMassFunction =
        !selectedMassFunction || musica.massFunction === selectedMassFunction;

      const matchesGenre = !selectedGenre || musica.genre === selectedGenre;

      return (
        matchesSearch &&
        matchesLiturgical &&
        matchesMassFunction &&
        matchesGenre
      );
    });

    // Ordenar
    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "artist") {
        return a.artist.localeCompare(b.artist);
      }
      return 0;
    });

    return result;
  }, [
    searchTerm,
    selectedLiturgicalTime,
    selectedMassFunction,
    selectedGenre,
    sortBy,
  ]);

  // Paginar
  const totalPages = Math.ceil(filteredMusicas.length / itemsPerPage);
  const paginatedMusicas = filteredMusicas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎵 Catálogo Musical
          </h1>
          <p className="text-gray-600">
            {filteredMusicas.length} músicas disponíveis
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por título, artista..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tempo Litúrgico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tempo Litúrgico
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedLiturgicalTime === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedLiturgicalTime(null);
                    setCurrentPage(1);
                  }}
                >
                  Todos
                </Button>
                {LITURGICAL_TIMES.map((time) => (
                  <Button
                    key={time}
                    variant={
                      selectedLiturgicalTime === time ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedLiturgicalTime(time);
                      setCurrentPage(1);
                    }}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Parte da Missa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Parte da Missa
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedMassFunction === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedMassFunction(null);
                    setCurrentPage(1);
                  }}
                >
                  Todas
                </Button>
                {MASS_FUNCTIONS.map((func) => (
                  <Button
                    key={func}
                    variant={
                      selectedMassFunction === func ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedMassFunction(func);
                      setCurrentPage(1);
                    }}
                  >
                    {func}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gênero */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gênero
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGenre === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedGenre(null);
                    setCurrentPage(1);
                  }}
                >
                  Todos
                </Button>
                {GENRES.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedGenre(genre);
                      setCurrentPage(1);
                    }}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "title" | "artist" | "recent")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">Título (A-Z)</option>
                <option value="artist">Artista (A-Z)</option>
                <option value="recent">Recentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Músicas */}
        {paginatedMusicas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {paginatedMusicas.map((musica) => (
              <Card
                key={musica.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-32 flex items-center justify-center relative">
                  <Music className="w-12 h-12 text-white opacity-30" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/40"
                    onClick={() => toggleFavorite(musica.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(musica.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {musica.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{musica.artist}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {musica.genre}
                    </Badge>
                    {musica.liturgicalTime && (
                      <Badge variant="outline" className="text-xs">
                        {musica.liturgicalTime}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {musica.duration}
                    </span>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Play className="w-4 h-4" />
                      Play
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma música encontrada</p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
