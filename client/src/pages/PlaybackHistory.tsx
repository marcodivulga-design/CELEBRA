import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, TrendingUp, Heart, Trash2, BarChart3 } from 'lucide-react';

export function PlaybackHistory() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('month');

  // Dados simulados de histórico
  const history = [
    {
      id: 1,
      songTitle: 'Eis o Tempo de Conversão',
      artist: 'Comunidade Católica',
      playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 240,
      completedPercentage: 100,
    },
    {
      id: 2,
      songTitle: 'Glória a Deus nas Alturas',
      artist: 'Coral da Igreja',
      playedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 180,
      completedPercentage: 95,
    },
    {
      id: 3,
      songTitle: 'Aleluia',
      artist: 'Coro Gregoriano',
      playedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      duration: 120,
      completedPercentage: 100,
    },
  ];

  // Dados simulados de estatísticas
  const stats = {
    totalPlays: 156,
    totalMinutesListened: 4320,
    averagePlayDuration: 27.7,
    favoriteGenre: 'Litúrgico',
    favoriteArtist: 'Comunidade Católica',
    mostPlayedSong: {
      title: 'Eis o Tempo de Conversão',
      plays: 12,
    },
    topGenres: [
      { genre: 'Litúrgico', plays: 89 },
      { genre: 'Hino', plays: 45 },
      { genre: 'Gregoriano', plays: 22 },
    ],
    topArtists: [
      { artist: 'Comunidade Católica', plays: 67 },
      { artist: 'Coral da Igreja', plays: 54 },
      { artist: 'Coro Gregoriano', plays: 35 },
    ],
  };

  // Dados simulados de sugestões
  const suggestions = [
    {
      id: 10,
      title: 'Cântico de Louvor',
      artist: 'Comunidade Católica',
      reason: 'Baseado em: Eis o Tempo de Conversão',
      similarity: 0.92,
    },
    {
      id: 11,
      title: 'Hino de Ação de Graças',
      artist: 'Coral da Igreja',
      reason: 'Baseado em: Glória a Deus nas Alturas',
      similarity: 0.88,
    },
    {
      id: 12,
      title: 'Salmo 23',
      artist: 'Coro Gregoriano',
      reason: 'Baseado em: Aleluia',
      similarity: 0.85,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Histórico de Reprodução</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe suas músicas favoritas e estatísticas de escuta
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
        </TabsList>

        {/* Histórico Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Músicas Recentes</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Limpar Histórico
            </Button>
          </div>

          <div className="space-y-2">
            {history.map((item) => (
              <Card key={item.id} className="hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.songTitle}</h3>
                        <p className="text-sm text-muted-foreground">{item.artist}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(item.playedAt)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.completedPercentage}% reproduzido
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Favoritar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Estatísticas Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Plays */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total de Reproduções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPlays}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nos últimos {timeRange === 'all' ? 'todos os tempos' : timeRange}
                </p>
              </CardContent>
            </Card>

            {/* Total Minutes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tempo Total Ouvido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatMinutes(stats.totalMinutesListened)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(stats.totalMinutesListened / 60).toFixed(1)} horas
                </p>
              </CardContent>
            </Card>

            {/* Average Duration */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.averagePlayDuration.toFixed(1)}m</div>
                <p className="text-xs text-muted-foreground mt-1">Por reprodução</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Genres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gêneros Mais Ouvidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topGenres.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{item.genre}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.plays / stats.topGenres[0].plays) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{item.plays}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Artists */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Artistas Mais Ouvidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topArtists.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{item.artist}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.plays / stats.topArtists[0].plays) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{item.plays}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sugestões Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <h2 className="text-xl font-semibold">Recomendações Personalizadas</h2>
          <p className="text-sm text-muted-foreground">
            Baseadas no seu histórico de reprodução
          </p>

          <div className="space-y-3">
            {suggestions.map((item) => (
              <Card key={item.id} className="hover:bg-accent transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {(item.similarity * 100).toFixed(0)}% compatível
                        </Badge>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                    </div>
                    <Button className="gap-2">
                      <Music className="h-4 w-4" />
                      Ouvir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
