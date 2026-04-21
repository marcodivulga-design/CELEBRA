import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Music, Trash2, Eye } from 'lucide-react';
import { useLocation } from 'wouter';

interface CelebrationHistory {
  id: string;
  name: string;
  date: string;
  songCount: number;
  maestro?: string;
  members?: string[];
  songs: Array<{
    id: number;
    title: string;
    artist: string;
  }>;
}

export default function HistoricoCelebracoes() {
  const [, setLocation] = useLocation();
  const [history, setHistory] = useState<CelebrationHistory[]>([]);
  const [selectedCelebration, setSelectedCelebration] = useState<CelebrationHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Carregar histórico do localStorage
    const savedHistory = localStorage.getItem('celebrationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Erro ao carregar histórico:', e);
      }
    }
  }, []);

  const saveCelebrationToHistory = (celebration: any) => {
    const newEntry: CelebrationHistory = {
      id: Date.now().toString(),
      name: celebration.name || 'Celebração sem nome',
      date: new Date().toISOString(),
      songCount: celebration.songs?.length || 0,
      songs: celebration.songs || [],
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('celebrationHistory', JSON.stringify(updatedHistory));
  };

  const deleteCelebration = (id: string) => {
    const updatedHistory = history.filter((c) => c.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('celebrationHistory', JSON.stringify(updatedHistory));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              onClick={() => setLocation('/')}
            >
              ←
            </Button>
            <h1 className="text-2xl font-bold text-purple-900">Histórico de Celebrações</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {history.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">Nenhuma celebração no histórico</p>
            <Button
              className="bg-purple-600 hover:bg-blue-100"
              onClick={() => setLocation('/celebracoes')}
            >
              <Music className="mr-2" size={16} />
              Criar Celebração
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((celebration) => (
              <div
                key={celebration.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {celebration.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-600" />
                        {formatDate(celebration.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Music size={16} className="text-purple-600" />
                        {celebration.songCount} música{celebration.songCount !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Preview de músicas */}
                    {celebration.songs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Músicas:</p>
                        <div className="flex flex-wrap gap-2">
                          {celebration.songs.slice(0, 3).map((song) => (
                            <span
                              key={song.id}
                              className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {song.title}
                            </span>
                          ))}
                          {celebration.songs.length > 3 && (
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              +{celebration.songs.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCelebration(celebration);
                        setShowDetails(true);
                      }}
                    >
                      <Eye size={16} className="mr-2" />
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCelebration(celebration.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCelebration.name}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Data da celebração:</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedCelebration.date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-4">Músicas ({selectedCelebration.songs.length}):</p>
                  <div className="space-y-2">
                    {selectedCelebration.songs.map((song, index) => (
                      <div
                        key={song.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-semibold text-purple-600 min-w-[24px]">
                          {index + 1}.
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{song.title}</p>
                          <p className="text-sm text-gray-600">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
