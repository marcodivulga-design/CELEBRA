import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, Heart, Plus, Check, X, Play, Pause, Volume2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChordTransposer } from "@/components/ChordTransposer";
import { SongSuggestions } from "@/components/SongSuggestions";

export default function CatalogoMusical() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [addedSongs, setAddedSongs] = useState<Set<number>>(new Set());
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transposedChords, setTransposedChords] = useState<string>("");
  
  const { data: songs, isLoading } = trpc.songs.list.useQuery({
    search: search || undefined,
  });

  const toggleFavorite = (songId: number) => {
    console.log("Favoritar clicado:", songId);
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
  };

  const addToCelebration = (song: any) => {
    console.log("Adicionar clicado:", song);
    try {
      // Salvar música no localStorage para usar na celebração
      const celebrations = JSON.parse(localStorage.getItem("celebrations") || "[]");
      celebrations.push({
        ...song,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem("celebrations", JSON.stringify(celebrations));
      
      // Marcar como adicionada
      const newAdded = new Set(addedSongs);
      newAdded.add(song.id);
      setAddedSongs(newAdded);
      
      // Mostrar feedback visual
      console.log(`✅ "${song.title}" adicionada à celebração!`);
      
      // Remover feedback após 2 segundos
      setTimeout(() => {
        const updated = new Set(addedSongs);
        updated.delete(song.id);
        setAddedSongs(updated);
      }, 2000);
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
    }
  };

  const speakText = (text: string) => {
    // Cancelar fala anterior se estiver tocando
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Criar utterance com o texto
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPlaying(false);
    };

    // Falar
    window.speechSynthesis.speak(utterance);
  };

  const speakSong = (song: any) => {
    const text = `${song.title}, por ${song.artist}. ${song.lyrics || "Letra não disponível"}`;
    speakText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/celebracoes")}
            >
              ←
            </Button>
            <h1 className="text-2xl font-bold text-purple-900">Catálogo Musical</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Buscar por título ou artista..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sugestões Automáticas */}
        {songs && songs.length > 0 && !search && (
          <div className="mb-8">
            <SongSuggestions
              allSongs={songs}
              onSelectSong={setSelectedSong}
            />
          </div>
        )}

        {/* Songs Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Music className="text-purple-600" size={32} />
            </div>
          </div>
        ) : songs && songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <Music className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {song.artist}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {song.massMoment}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {song.liturgicalTime}
                      </span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedSong(song)}
                      >
                        <Music size={16} className="mr-1" />
                        Ver/Ouvir
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(song.id)}
                        className={favorites.has(song.id) ? "text-red-500" : ""}
                      >
                        <Heart
                          size={16}
                          fill={favorites.has(song.id) ? "currentColor" : "none"}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma música encontrada</p>
          </div>
        )}
      </div>

      {/* Modal para visualizar letra e ouvir áudio */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedSong.title}</h2>
                <p className="text-sm text-gray-600">{selectedSong.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedSong(null);
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setIsPlaying(false);
                }}
              >
                <X size={20} />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Audio Player com Web Speech API */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-blue-100"
                    onClick={() => speakSong(selectedSong)}
                  >
                    {isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {isPlaying ? "Tocando..." : "Clique para ouvir a música"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Letra da Música */}
              {selectedSong.lyrics ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Letra</h3>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-48 overflow-y-auto">
                    {selectedSong.lyrics}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Letra não disponível
                </div>
              )}

              {/* Transposição */}
              {selectedSong.chords && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Transposição</h3>
                  <ChordTransposer 
                    originalChords={selectedSong.chords} 
                    onTranspose={setTransposedChords}
                  />
                </div>
              )}

              {/* Cifras */}
              {selectedSong.chords ? (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cifras</h3>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-48 overflow-y-auto">
                    {transposedChords || selectedSong.chords}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Cifras não disponíveis
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedSong(null);
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setIsPlaying(false);
                  }}
                >
                  Fechar
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-blue-100"
                  onClick={() => {
                    addToCelebration(selectedSong);
                    setSelectedSong(null);
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setIsPlaying(false);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar à Celebração
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
