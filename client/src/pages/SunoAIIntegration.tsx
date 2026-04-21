import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Zap, Play, Download, Loader } from "lucide-react";
import { toast } from "sonner";

interface GeneratedAudio {
  id: string;
  musicTitle: string;
  style: string;
  duration: string;
  audioUrl: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
}

const MUSIC_STYLES = [
  { id: "gregoriano", label: "Gregoriano", description: "Canto gregoriano tradicional" },
  { id: "coral", label: "Coral Litúrgico", description: "Arranjo para coro completo" },
  { id: "orgao", label: "Órgão Clássico", description: "Acompanhamento de órgão" },
  { id: "instrumental", label: "Instrumental Suave", description: "Instrumental relaxante" },
  { id: "moderno", label: "Moderno Litúrgico", description: "Estilo contemporâneo" },
];

const TOP_SONGS = [
  { id: 1, title: "Ave Maria", composer: "Schubert", duration: "3:45" },
  { id: 2, title: "Glória a Deus", composer: "Tradicional", duration: "2:30" },
  { id: 3, title: "Pão da Vida", composer: "Moderno", duration: "3:15" },
  { id: 4, title: "Aleluia", composer: "Handel", duration: "2:45" },
  { id: 5, title: "Vinde Espírito Santo", composer: "Tradicional", duration: "3:00" },
];

export default function SunoAIIntegration() {
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("coral");
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectSong = (songId: number) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const handleGenerateAudio = async () => {
    if (selectedSongs.length === 0) {
      toast.error("Selecione pelo menos uma música");
      return;
    }

    setIsGenerating(true);
    
    // Simular geração de áudio
    const selectedSongsData = TOP_SONGS.filter((song) => selectedSongs.includes(song.id));
    
    selectedSongsData.forEach((song) => {
      const newAudio: GeneratedAudio = {
        id: `${song.id}-${Date.now()}`,
        musicTitle: song.title,
        style: MUSIC_STYLES.find((s) => s.id === selectedStyle)?.label || selectedStyle,
        duration: song.duration,
        audioUrl: `https://example.com/audio/${song.id}-${selectedStyle}.mp3`,
        status: "generating",
        createdAt: new Date(),
      };
      
      setGeneratedAudios((prev) => [newAudio, ...prev]);

      // Simular conclusão após 3 segundos
      setTimeout(() => {
        setGeneratedAudios((prev) =>
          prev.map((audio) =>
            audio.id === newAudio.id ? { ...audio, status: "completed" } : audio
          )
        );
        toast.success(`${song.title} gerado com sucesso!`);
      }, 3000);
    });

    setIsGenerating(false);
    setSelectedSongs([]);
  };

  const handleDownload = (audio: GeneratedAudio) => {
    toast.success(`Baixando ${audio.musicTitle}...`);
    // Implementar download real
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2 font-playfair">
            🎵 Gerador de Áudios com Suno AI
          </h1>
          <p className="text-gray-600">Gere áudios das 540 músicas do catálogo em diferentes estilos litúrgicos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Configuração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Style Selection */}
                <div>
                  <label className="text-sm font-semibold text-sky-900 mb-3 block">
                    Estilo Litúrgico
                  </label>
                  <div className="space-y-2">
                    {MUSIC_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedStyle === style.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <p className="font-semibold text-sm text-sky-900">{style.label}</p>
                        <p className="text-xs text-gray-600">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateAudio}
                  disabled={isGenerating || selectedSongs.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isGenerating ? "Gerando..." : `Gerar ${selectedSongs.length} Áudio(s)`}
                </Button>

                {/* Info */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    💡 Selecione músicas à esquerda e um estilo litúrgico para gerar áudios profissionais com Suno AI.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Music Selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Selecione Músicas</CardTitle>
                <CardDescription>
                  {selectedSongs.length} música(s) selecionada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {TOP_SONGS.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => handleSelectSong(song.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                        selectedSongs.includes(song.id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedSongs.includes(song.id)
                              ? "bg-purple-500 border-purple-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedSongs.includes(song.id) && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sky-900">{song.title}</p>
                          <p className="text-xs text-gray-600">{song.composer}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{song.duration}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Audios */}
        {generatedAudios.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>🎧 Áudios Gerados</CardTitle>
              <CardDescription>Clique em um áudio para ouvir ou baixar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedAudios.map((audio) => (
                  <div
                    key={audio.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
                        {audio.status === "generating" ? (
                          <Loader className="w-6 h-6 animate-spin" />
                        ) : (
                          <Music className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sky-900">{audio.musicTitle}</p>
                        <p className="text-sm text-gray-600">
                          {audio.style} • {audio.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {audio.status === "completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success("Reproduzindo...")}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(audio)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {audio.status === "generating" && (
                        <span className="text-sm text-purple-600 font-semibold">Gerando...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
