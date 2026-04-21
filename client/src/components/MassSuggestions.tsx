import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ChevronRight } from 'lucide-react';

interface Song {
  id?: string;
  title: string;
  artist: string;
  composer?: string;
  genre?: string;
  massFunction?: string;
  duration?: number;
  hasAudio?: boolean;
}

interface MassMoment {
  moment: string;
  label: string;
  description: string;
  suggestions: Song[];
}

export const MassSuggestions: React.FC = () => {
  const [moments, setMoments] = useState<MassMoment[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data - in production, fetch from API
    const massMoments: MassMoment[] = [
      {
        moment: 'entrada',
        label: '🎵 Entrada',
        description: 'Música para recepção e processão de entrada',
        suggestions: [
          { title: 'Glória a Deus nas Alturas', artist: 'Coral da Catedral', composer: 'Tradicional', duration: 180, hasAudio: true },
          { title: 'Aleluia, Aleluia', artist: 'Ministério de Música', composer: 'Pe. Zezinho', duration: 240, hasAudio: true },
          { title: 'Vinde Celebrar', artist: 'Coro Paroquial', composer: 'Tradicional', duration: 200, hasAudio: true },
        ],
      },
      {
        moment: 'ato_penitencial',
        label: '🙏 Ato Penitencial',
        description: 'Música para o momento de contrição e perdão',
        suggestions: [
          { title: 'Senhor, Tende Piedade de Nós', artist: 'Coro Paroquial', composer: 'Tradicional', duration: 150, hasAudio: true },
          { title: 'Perdão, Senhor', artist: 'Ministério de Música', composer: 'Tradicional', duration: 220, hasAudio: true },
          { title: 'Confiteor', artist: 'Coral da Catedral', composer: 'Tradicional', duration: 180, hasAudio: true },
        ],
      },
      {
        moment: 'gloria',
        label: '✨ Glória',
        description: 'Hino de louvor e glorificação',
        suggestions: [
          { title: 'Glória, Glória, Glória', artist: 'Ensemble Litúrgico', composer: 'Tradicional', duration: 200, hasAudio: true },
          { title: 'Glória ao Pai e ao Filho', artist: 'Coro Litúrgico', composer: 'Tradicional', duration: 180, hasAudio: true },
          { title: 'Glória Eterna ao Senhor', artist: 'Ministério de Louvor', composer: 'Tradicional', duration: 210, hasAudio: true },
        ],
      },
      {
        moment: 'salmo',
        label: '📖 Salmo Responsorial',
        description: 'Salmo cantado com resposta da assembleia',
        suggestions: [
          { title: 'Salmo 22 - O Senhor é meu Pastor', artist: 'Coral Litúrgico', composer: 'Tradicional', duration: 280, hasAudio: true },
          { title: 'Salmo 23 - Senhor, Vós Sois meu Pastor', artist: 'Ensemble Vocal', composer: 'Tradicional', duration: 260, hasAudio: true },
          { title: 'Salmo 42 - Como a Corça', artist: 'Coro Paroquial', composer: 'Tradicional', duration: 240, hasAudio: true },
        ],
      },
      {
        moment: 'ofertorio',
        label: '🙌 Ofertório',
        description: 'Música durante a apresentação das oferendas',
        suggestions: [
          { title: 'Recebei, Senhor, nossas oferendas', artist: 'Ministério de Música', composer: 'Pe. Zezinho', duration: 220, hasAudio: true },
          { title: 'Oferenda de Amor', artist: 'Coro Litúrgico', composer: 'Tradicional', duration: 210, hasAudio: true },
          { title: 'Presente Sagrado', artist: 'Ensemble Litúrgico', composer: 'Tradicional', duration: 200, hasAudio: true },
        ],
      },
      {
        moment: 'santo',
        label: '⛪ Santo',
        description: 'Aclamação ao Senhor - Sanctus',
        suggestions: [
          { title: 'Santo, Santo, Santo', artist: 'Coro da Basílica', composer: 'Tradicional', duration: 180, hasAudio: true },
          { title: 'Hosana ao Filho de Davi', artist: 'Ensemble Litúrgico', composer: 'Tradicional', duration: 240, hasAudio: true },
          { title: 'Ó Cordeiro de Deus', artist: 'Ministério de Louvor', composer: 'Tradicional', duration: 190, hasAudio: true },
        ],
      },
      {
        moment: 'comunhao',
        label: '🍞 Comunhão',
        description: 'Música durante a distribuição da Eucaristia',
        suggestions: [
          { title: 'Pão da Vida, Corpo de Cristo', artist: 'Ensemble Vocal', composer: 'Tradicional', duration: 240, hasAudio: true },
          { title: 'Corpo e Sangue de Cristo', artist: 'Coro da Catedral', composer: 'Tradicional', duration: 220, hasAudio: true },
          { title: 'Vinde Receber', artist: 'Ministério de Louvor', composer: 'Pe. Zezinho', duration: 210, hasAudio: true },
        ],
      },
      {
        moment: 'final',
        label: '✝️ Encerramento',
        description: 'Música de despedida e bênção',
        suggestions: [
          { title: 'Ide em Paz, Benção de Deus', artist: 'Coral Paroquial', composer: 'Tradicional', duration: 200, hasAudio: true },
          { title: 'Despedida Abençoada', artist: 'Coro da Catedral', composer: 'Tradicional', duration: 190, hasAudio: true },
          { title: 'Vão em Paz', artist: 'Ensemble Litúrgico', composer: 'Tradicional', duration: 210, hasAudio: true },
        ],
      },
    ];

    setMoments(massMoments);
    setLoading(false);
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">🎵 Sugestões para Missa</h2>
        <p className="text-gray-600">Escolha as músicas perfeitas para cada momento da celebração</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando sugestões...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moments.map((moment) => (
            <Card
              key={moment.moment}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedMoment(selectedMoment === moment.moment ? null : moment.moment)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{moment.label}</CardTitle>
                <CardDescription>{moment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMoment === moment.moment && (
                  <div className="space-y-3">
                    {moment.suggestions.map((song, idx) => (
                      <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{song.title}</p>
                          <p className="text-xs text-gray-600">{song.artist}</p>
                          {song.composer && <p className="text-xs text-gray-500">Comp: {song.composer}</p>}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {song.hasAudio && <Music className="w-4 h-4 text-blue-500" />}
                          <span className="text-xs text-gray-600">{formatDuration(song.duration)}</span>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-3" size="sm" variant="outline">
                      Ver todas as sugestões <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
