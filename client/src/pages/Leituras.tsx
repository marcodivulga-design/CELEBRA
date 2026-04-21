import { BookOpen, Search, Filter, Plus, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Leituras() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCelebration, setSelectedCelebration] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Queries
  const { data: celebrations, isLoading: celebrationsLoading } = trpc.celebrations.list.useQuery();
  const { data: readings, isLoading: readingsLoading } = trpc.readings.list.useQuery(
    selectedCelebration || 0,
    { enabled: !!selectedCelebration }
  );

  // Mutations
  const deleteReadingMutation = trpc.readings.delete.useMutation({
    onSuccess: () => {
      alert("Leitura removida");
      if (selectedCelebration) {
        trpc.useUtils().readings.list.invalidate(selectedCelebration);
      }
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  const createReadingMutation = trpc.readings.create.useMutation({
    onSuccess: () => {
      alert("Leitura adicionada");
      if (selectedCelebration) {
        trpc.useUtils().readings.list.invalidate(selectedCelebration);
      }
      setIsCreating(false);
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  // Load first celebration
  useEffect(() => {
    if (!celebrationsLoading && celebrations && celebrations.length > 0) {
      setSelectedCelebration(celebrations[0].id);
    }
  }, [celebrations, celebrationsLoading]);

  const handleAddReading = () => {
    if (!selectedCelebration) return;

    const book = prompt("Livro (ex: Atos dos Apóstolos):");
    if (!book) return;

    const chapter = prompt("Capítulo:");
    if (!chapter) return;

    const verseStart = prompt("Versículo inicial:");
    if (!verseStart) return;

    const type = prompt("Tipo (primeira/segunda/evangelho/salmo/outro):");
    if (!type) return;

    const text = prompt("Texto da leitura:");
    const reader = prompt("Responsável pela leitura:");

    createReadingMutation.mutate({
      celebrationId: selectedCelebration,
      book,
      chapter: parseInt(chapter),
      verseStart: parseInt(verseStart),
      type: type as any,
      text: text || undefined,
      reader: reader || undefined,
    });
  };

  const filteredReadings = readings?.filter((r: any) =>
    r.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.text?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (celebrationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!celebrations || celebrations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-sky-700 text-lg">Nenhuma celebração disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-orange-400" />
            Leituras Bíblicas
          </h1>

          {/* Celebration Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-sky-800 mb-2">
              Celebração
            </label>
            <select
              value={selectedCelebration || ""}
              onChange={(e) => setSelectedCelebration(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-cyan-50 border border-sky-300 rounded-lg text-white"
            >
              {celebrations.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search and Add */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-sky-600" />
              <Input
                placeholder="Buscar leituras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-cyan-50 border-sky-300"
              />
            </div>
            <Button
              onClick={handleAddReading}
              disabled={createReadingMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Leitura
            </Button>
          </div>
        </div>

        {/* Readings List */}
        {readingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredReadings.length === 0 ? (
          <Card className="p-12 text-center bg-cyan-50/50 border-sky-300">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-sky-700 text-lg">Nenhuma leitura adicionada</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReadings.map((reading: any) => (
              <Card key={reading.id} className="p-4 bg-cyan-50/50 border-sky-300 hover:border-orange-400/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded font-semibold">
                        {reading.type.toUpperCase()}
                      </span>
                      <h3 className="text-white font-semibold text-lg">
                        {reading.book} {reading.chapter}, {reading.verseStart}
                        {reading.verseEnd && `-${reading.verseEnd}`}
                      </h3>
                    </div>
                    {reading.text && (
                      <p className="text-sky-800 text-sm mb-2 italic">"{reading.text}"</p>
                    )}
                    {reading.reader && (
                      <p className="text-sky-700 text-xs">Responsável: {reading.reader}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Tem certeza que deseja remover esta leitura?")) {
                        deleteReadingMutation.mutate(reading.id);
                      }
                    }}
                    disabled={deleteReadingMutation.isPending}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
