import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Music, ExternalLink, Play } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  previewUrl: string | null;
  spotifyUrl: string;
  duration: number;
  image?: string;
}

export function SpotifySearch() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const { refetch } = trpc.spotify.searchTracks.useQuery(
    { query: "", limit: 10 },
    { enabled: false }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoadingSearch(true);
    try {
      // Usar refetch com query atualizado
      const result = await refetch();
      if (result.data?.success) {
        setResults(result.data.tracks);
      }
    } catch (error) {
      console.error("Erro ao buscar no Spotify:", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const playPreview = (previewUrl: string | null) => {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Music className="w-6 h-6" />
          Buscar no Spotify
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Buscar música, artista ou álbum..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white text-black placeholder:text-gray-500"
          />
          <Button
            type="submit"
            disabled={isLoadingSearch}
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoadingSearch ? "Buscando..." : "Buscar"}
          </Button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="grid gap-3">
          <p className="text-sm text-gray-600 mb-2">
            {results.length} resultado{results.length > 1 ? "s" : ""} encontrado{results.length > 1 ? "s" : ""}
          </p>
          {results.map((track) => (
            <div
              key={track.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTrack(track)}
            >
              <div className="flex items-start gap-4">
                {track.image && (
                  <img
                    src={track.image}
                    alt={track.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {track.name}
                  </h3>
                  <p className="text-sm text-gray-600">{track.artist}</p>
                  <p className="text-xs text-gray-500">{track.album}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Duração: {formatDuration(track.duration)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {track.previewUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreview(track.previewUrl);
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(track.spotifyUrl, "_blank");
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoadingSearch && query && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum resultado encontrado para "{query}"
        </div>
      )}

      {selectedTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">{selectedTrack.name}</h3>
            <p className="text-gray-600 mb-4">{selectedTrack.artist}</p>
            {selectedTrack.image && (
              <img
                src={selectedTrack.image}
                alt={selectedTrack.name}
                className="w-full h-48 rounded object-cover mb-4"
              />
            )}
            <div className="flex gap-2">
              {selectedTrack.previewUrl && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => playPreview(selectedTrack.previewUrl)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => window.open(selectedTrack.spotifyUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir no Spotify
              </Button>
            </div>
            <Button
              className="w-full mt-2"
              variant="ghost"
              onClick={() => setSelectedTrack(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
