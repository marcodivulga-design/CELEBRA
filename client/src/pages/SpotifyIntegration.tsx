import { useState } from "react";
import { Search, Music, Play, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  previewUrl?: string;
  spotifyUrl: string;
  duration: number;
  isAdded?: boolean;
}

// Mock data - será substituído por dados reais do Spotify API
const MOCK_SPOTIFY_TRACKS: SpotifyTrack[] = [
  {
    id: "1",
    name: "Hino Nacional Brasileiro",
    artist: "Orquestra Sinfônica",
    album: "Clássicos Brasileiros",
    image: "https://via.placeholder.com/200?text=Spotify+1",
    spotifyUrl: "https://open.spotify.com/track/1",
    duration: 240,
    previewUrl: "https://p.scdn.co/mp3-preview/1",
  },
  {
    id: "2",
    name: "Ave Maria",
    artist: "Andrea Bocelli",
    album: "Clássicos Sagrados",
    image: "https://via.placeholder.com/200?text=Spotify+2",
    spotifyUrl: "https://open.spotify.com/track/2",
    duration: 300,
    previewUrl: "https://p.scdn.co/mp3-preview/2",
  },
  {
    id: "3",
    name: "Aleluia",
    artist: "Coro Gregoriano",
    album: "Cânticos Sagrados",
    image: "https://via.placeholder.com/200?text=Spotify+3",
    spotifyUrl: "https://open.spotify.com/track/3",
    duration: 180,
    previewUrl: "https://p.scdn.co/mp3-preview/3",
  },
];

export default function SpotifyIntegration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [addedTracks, setAddedTracks] = useState<Set<string>>(new Set());
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // Simular busca no Spotify
    setTimeout(() => {
      setResults(
        MOCK_SPOTIFY_TRACKS.filter(
          (track) =>
            track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            track.artist.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setIsSearching(false);
    }, 500);
  };

  const handleAddToLibrary = (trackId: string) => {
    const newAdded = new Set(addedTracks);
    if (newAdded.has(trackId)) {
      newAdded.delete(trackId);
    } else {
      newAdded.add(trackId);
    }
    setAddedTracks(newAdded);
  };

  const handlePlayPreview = (trackId: string) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Integração Spotify
            </h1>
          </div>
          <p className="text-gray-600">
            Busque músicas no Spotify e adicione ao catálogo do CELEBRA
          </p>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar músicas, artistas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-green-500 hover:bg-green-600 text-white px-6"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            💡 <strong>Dica:</strong> Você pode ouvir uma prévia de 30 segundos
            de cada música antes de adicionar ao catálogo.
          </p>
        </div>

        {/* Resultados */}
        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {results.length} resultado(s) encontrado(s)
            </h2>

            {results.map((track) => (
              <Card key={track.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* Imagem */}
                  <div className="flex-shrink-0">
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {track.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {track.artist}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{track.album}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {formatDuration(track.duration)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        Spotify
                      </Badge>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2 justify-center">
                    {/* Preview */}
                    {track.previewUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => handlePlayPreview(track.id)}
                      >
                        <Play className="w-4 h-4" />
                        {playingTrackId === track.id ? "Pausar" : "Preview"}
                      </Button>
                    )}

                    {/* Adicionar ao Catálogo */}
                    <Button
                      size="sm"
                      variant={
                        addedTracks.has(track.id) ? "default" : "outline"
                      }
                      className={`gap-1 ${
                        addedTracks.has(track.id)
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() => handleAddToLibrary(track.id)}
                    >
                      <Plus className="w-4 h-4" />
                      {addedTracks.has(track.id) ? "Adicionado" : "Adicionar"}
                    </Button>

                    {/* Link Spotify */}
                    <a
                      href={track.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-green-600 hover:text-green-700 w-full"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm
                ? "Nenhuma música encontrada"
                : "Digite um termo de busca para começar"}
            </p>
          </div>
        )}

        {/* Resumo de Adições */}
        {addedTracks.size > 0 && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white rounded-lg shadow-lg p-4">
            <p className="font-semibold">
              {addedTracks.size} música(s) selecionada(s)
            </p>
            <Button
              size="sm"
              className="mt-2 bg-white text-green-600 hover:bg-gray-100 w-full"
              onClick={() => {
                // Salvar no catálogo
                console.log("Adicionando", addedTracks.size, "músicas");
              }}
            >
              Salvar no Catálogo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
