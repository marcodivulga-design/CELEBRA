import { Music, Trash2, Download, Plus, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { generateSimplePDF } from "@/lib/pdf-export";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CelebrationSong {
  id: number;
  title: string;
  artist: string;
  massMoment: string;
  liturgicalTime: string;
  lyrics?: string;
  chords?: string;
  audioUrl?: string;
  addedAt: string;
}

export default function Celebracoes() {
  const [, setLocation] = useLocation();
  const [songs, setSongs] = useState<CelebrationSong[]>([]);
  const [celebrationName, setCelebrationName] = useState("Celebração");
  const [isExporting, setIsExporting] = useState(false);
  const [celebrationId, setCelebrationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Queries
  const { data: celebrations, isLoading: celebrationsLoading } = trpc.celebrations.list.useQuery();
  const { data: celebrationSongs, isLoading: songsLoading } = trpc.celebrations.getSongs.useQuery(
    celebrationId || 0,
    { enabled: !!celebrationId }
  );

  // Mutations
  const removeSongMutation = trpc.celebrations.removeSong.useMutation({
    onSuccess: () => {
      alert("Música removida da celebração");
      // Refetch songs
      if (celebrationId) {
        trpc.useUtils().celebrations.getSongs.invalidate(celebrationId);
      }
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  const createCelebrationMutation = trpc.celebrations.create.useMutation({
    onSuccess: (data) => {
      setCelebrationId(data.id);
      setCelebrationName(data.title);
      alert("Celebração criada");
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  // Load first celebration or create new one
  useEffect(() => {
    if (!celebrationsLoading && celebrations && celebrations.length > 0) {
      setCelebrationId(celebrations[0].id);
      setCelebrationName(celebrations[0].title);
      setIsLoading(false);
    } else if (!celebrationsLoading && (!celebrations || celebrations.length === 0)) {
      // Create a new celebration
      createCelebrationMutation.mutate({
        title: "Celebração " + new Date().toLocaleDateString("pt-BR"),
        description: "Celebração criada automaticamente",
        date: new Date(),
        type: "missa",
        location: "Igreja",
      });
      setIsLoading(false);
    }
  }, [celebrations, celebrationsLoading]);

  // Update songs when celebrationSongs changes
  useEffect(() => {
    if (celebrationSongs) {
      const formattedSongs = celebrationSongs.map((song: any) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        massMoment: song.massMoment || "Outro",
        liturgicalTime: song.liturgicalTime || "Outro",
        lyrics: song.lyrics,
        chords: song.chords,
        audioUrl: song.audioUrl,
        addedAt: new Date().toISOString(),
      }));
      setSongs(formattedSongs);
    }
  }, [celebrationSongs]);

  const removeSong = (songId: number) => {
    if (!celebrationId) return;
    
    if (confirm("Tem certeza que deseja remover esta música?")) {
      removeSongMutation.mutate({
        celebrationId,
        songId,
      });
    }
  };

  const clearAll = () => {
    if (!celebrationId) return;
    
    if (confirm("Tem certeza que deseja remover todas as músicas?")) {
      songs.forEach((song) => {
        removeSongMutation.mutate({
          celebrationId,
          songId: song.id,
        });
      });
    }
  };

  const exportAsPDF = async () => {
    if (songs.length === 0) {
      alert("Adicione músicas à celebração primeiro!");
      return;
    }

    setIsExporting(true);
    try {
      await generateSimplePDF({
        name: celebrationName,
        date: new Date().toISOString(),
        songs: songs,
      });
      alert("PDF exportado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    if (songs.length === 0) {
      alert("Adicione músicas à celebração primeiro!");
      return;
    }

    // Criar conteúdo em texto
    let content = `${celebrationName}\n`;
    content += `Gerado em ${new Date().toLocaleDateString("pt-BR")}\n`;
    content += `Total de músicas: ${songs.length}\n\n`;
    content += "=".repeat(80) + "\n\n";

    songs.forEach((song, index) => {
      content += `${index + 1}. ${song.title}\n`;
      content += `   Artista: ${song.artist}\n`;
      content += `   Momento: ${song.massMoment} | Tempo Litúrgico: ${song.liturgicalTime}\n`;
      
      if (song.lyrics) {
        content += `\n   LETRA:\n`;
        song.lyrics.split("\n").forEach(line => {
          content += `   ${line}\n`;
        });
      }
      
      if (song.chords) {
        content += `\n   CIFRAS:\n`;
        song.chords.split("\n").forEach(line => {
          content += `   ${line}\n`;
        });
      }
      
      content += "\n" + "-".repeat(80) + "\n\n";
    });

    // Baixar arquivo
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `${celebrationName}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert("Arquivo de texto exportado");
  };

  if (isLoading || celebrationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="p-2 hover:bg-cyan-50 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-orange-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Music className="w-8 h-8 text-orange-400" />
                {celebrationName}
              </h1>
              <p className="text-sky-700 text-sm mt-1">
                {songs.length} música{songs.length !== 1 ? "s" : ""} selecionada{songs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportAsPDF}
              disabled={isExporting || songs.length === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Gerando..." : "Exportar PDF"}
            </Button>
            <Button
              onClick={exportAsText}
              disabled={songs.length === 0}
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar TXT
            </Button>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-4">
          {songs.length === 0 ? (
            <Card className="p-12 text-center bg-cyan-50/50 border-sky-300">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-sky-700 text-lg">Nenhuma música adicionada ainda</p>
              <Button
                onClick={() => setLocation("/catalogo")}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Músicas
              </Button>
            </Card>
          ) : (
            <>
              {songs.map((song, index) => (
                <Card key={song.id} className="p-4 bg-cyan-50/50 border-sky-300 hover:border-orange-400/50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-orange-400 font-bold text-lg">{index + 1}.</span>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{song.title}</h3>
                          <p className="text-sky-700 text-sm">{song.artist}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                              {song.massMoment}
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                              {song.liturgicalTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSong(song.id)}
                      disabled={removeSongMutation.isPending}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
              <Button
                onClick={clearAll}
                disabled={removeSongMutation.isPending}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Todas
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
