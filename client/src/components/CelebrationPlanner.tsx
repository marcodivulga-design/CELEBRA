import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Download, Clock, Music } from 'lucide-react';

interface Song {
  id?: string;
  title: string;
  artist: string;
  composer?: string;
  duration?: number;
  massFunction?: string;
}

interface CelebrationMoment {
  moment: string;
  label: string;
  songs: Song[];
}

export const CelebrationPlanner: React.FC = () => {
  const [celebrationName, setCelebrationName] = useState('Nova Celebração');
  const [moments, setMoments] = useState<CelebrationMoment[]>([
    { moment: 'entrada', label: '🎵 Entrada', songs: [] },
    { moment: 'ato_penitencial', label: '🙏 Ato Penitencial', songs: [] },
    { moment: 'gloria', label: '✨ Glória', songs: [] },
    { moment: 'salmo', label: '📖 Salmo Responsorial', songs: [] },
    { moment: 'ofertorio', label: '🙌 Ofertório', songs: [] },
    { moment: 'santo', label: '⛪ Santo', songs: [] },
    { moment: 'comunhao', label: '🍞 Comunhão', songs: [] },
    { moment: 'final', label: '✝️ Encerramento', songs: [] },
  ]);

  const [draggedSong, setDraggedSong] = useState<{ moment: string; index: number } | null>(null);

  const addSampleSong = (momentIndex: number) => {
    const sampleSongs = [
      { title: 'Glória a Deus nas Alturas', artist: 'Coral da Catedral', composer: 'Tradicional', duration: 180 },
      { title: 'Aleluia, Aleluia', artist: 'Ministério de Música', composer: 'Pe. Zezinho', duration: 240 },
      { title: 'Vinde Celebrar', artist: 'Coro Paroquial', composer: 'Tradicional', duration: 200 },
      { title: 'Senhor, Tende Piedade', artist: 'Coro Paroquial', composer: 'Tradicional', duration: 150 },
      { title: 'Pão da Vida', artist: 'Ensemble Vocal', composer: 'Tradicional', duration: 240 },
    ];

    const newMoments = [...moments];
    const randomSong = sampleSongs[Math.floor(Math.random() * sampleSongs.length)];
    newMoments[momentIndex].songs.push({
      ...randomSong,
      id: `${Date.now()}-${Math.random()}`,
    });
    setMoments(newMoments);
  };

  const removeSong = (momentIndex: number, songIndex: number) => {
    const newMoments = [...moments];
    newMoments[momentIndex].songs.splice(songIndex, 1);
    setMoments(newMoments);
  };

  const moveSong = (fromMoment: number, fromIndex: number, toMoment: number) => {
    const newMoments = [...moments];
    const song = newMoments[fromMoment].songs[fromIndex];
    newMoments[fromMoment].songs.splice(fromIndex, 1);
    newMoments[toMoment].songs.push(song);
    setMoments(newMoments);
  };

  const calculateTotalDuration = () => {
    return moments.reduce((total, moment) => {
      return (
        total +
        moment.songs.reduce((subtotal, song) => subtotal + (song.duration || 0), 0)
      );
    }, 0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportToPDF = () => {
    let content = `CELEBRAÇÃO: ${celebrationName}\n`;
    content += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `Duração Total: ${formatDuration(calculateTotalDuration())}\n\n`;

    moments.forEach((moment) => {
      if (moment.songs.length > 0) {
        content += `${moment.label}\n`;
        moment.songs.forEach((song, idx) => {
          content += `  ${idx + 1}. ${song.title} - ${song.artist} (${formatDuration(song.duration || 0)})\n`;
        });
        content += '\n';
      }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${celebrationName}.txt`;
    a.click();
  };

  const totalSongs = moments.reduce((sum, m) => sum + m.songs.length, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Nome da Celebração</label>
          <Input
            value={celebrationName}
            onChange={(e) => setCelebrationName(e.target.value)}
            placeholder="Ex: Missa de Domingo"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <Music className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{totalSongs}</p>
                <p className="text-xs text-gray-600">Músicas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{formatDuration(calculateTotalDuration())}</p>
                <p className="text-xs text-gray-600">Duração Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{moments.filter((m) => m.songs.length > 0).length}</p>
                <p className="text-xs text-gray-600">Momentos Preenchidos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <Button onClick={exportToPDF} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Exportar Celebração
        </Button>
      </div>

      {/* Moments */}
      <div className="space-y-4">
        {moments.map((moment, momentIndex) => (
          <Card key={moment.moment} className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{moment.label}</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addSampleSong(momentIndex)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Música
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {moment.songs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Nenhuma música adicionada</p>
                  <p className="text-xs">Clique em "Adicionar Música" para começar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {moment.songs.map((song, songIndex) => (
                    <div
                      key={song.id}
                      draggable
                      onDragStart={() => setDraggedSong({ moment: moment.moment, index: songIndex })}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedSong) {
                          const fromMomentIdx = moments.findIndex((m) => m.moment === draggedSong.moment);
                          moveSong(fromMomentIdx, draggedSong.index, momentIndex);
                          setDraggedSong(null);
                        }
                      }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-move transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{song.title}</p>
                        <p className="text-xs text-gray-600">{song.artist}</p>
                        {song.composer && <p className="text-xs text-gray-500">Comp: {song.composer}</p>}
                      </div>
                      <div className="flex items-center gap-3 ml-2">
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {formatDuration(song.duration || 0)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSong(momentIndex, songIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 mt-2">
                    Subtotal: {formatDuration(moment.songs.reduce((sum, s) => sum + (s.duration || 0), 0))}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Dica:</strong> Você pode arrastar e soltar músicas entre os momentos da celebração para reorganizá-las.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
