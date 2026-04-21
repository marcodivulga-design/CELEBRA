import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Music, Link2, Unlink, RefreshCw, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

export function SpotifySync() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Dados simulados de playlists sincronizadas
  const syncedPlaylists = [
    {
      id: 1,
      name: 'Quaresma 2026',
      celebraUrl: 'https://celebra.app/playlists/1',
      spotifyUrl: 'https://open.spotify.com/playlist/example1',
      tracksCount: 15,
      lastSyncedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      autoSyncEnabled: true,
      syncInterval: 'daily',
      status: 'synced',
    },
    {
      id: 2,
      name: 'Páscoa 2026',
      celebraUrl: 'https://celebra.app/playlists/2',
      spotifyUrl: 'https://open.spotify.com/playlist/example2',
      tracksCount: 12,
      lastSyncedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      autoSyncEnabled: false,
      syncInterval: null,
      status: 'pending',
    },
  ];

  const handleConnect = () => {
    setIsConnected(true);
    // Aqui seria feito o redirecionamento para Spotify OAuth
  };

  const handleSync = (playlistId: number) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Aqui seria feita a sincronização real
    }, 2000);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Sincronização com Spotify</h1>
        <p className="text-muted-foreground mt-2">
          Sincronize suas playlists do CELEBRA com sua conta Spotify
        </p>
      </div>

      {/* Connection Status */}
      <Card className={isConnected ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <CardTitle className="text-lg">
                  {isConnected ? 'Conectado ao Spotify' : 'Não Conectado'}
                </CardTitle>
                <CardDescription>
                  {isConnected
                    ? 'Sua conta Spotify está conectada e pronta para sincronização'
                    : 'Conecte sua conta Spotify para começar a sincronizar playlists'}
                </CardDescription>
              </div>
            </div>
            {isConnected ? (
              <Button variant="destructive" onClick={() => setIsConnected(false)}>
                <Unlink className="h-4 w-4 mr-2" />
                Desconectar
              </Button>
            ) : (
              <Button onClick={handleConnect} className="gap-2">
                <Link2 className="h-4 w-4" />
                Conectar Spotify
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {isConnected && (
        <Tabs defaultValue="playlists" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="playlists">Playlists Sincronizadas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Playlists Tab */}
          <TabsContent value="playlists" className="space-y-4">
            <div className="space-y-3">
              {syncedPlaylists.map((playlist) => (
                <Card key={playlist.id} className="hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Music className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{playlist.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {playlist.tracksCount} músicas
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={playlist.status === 'synced' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {playlist.status === 'synced' ? '✓ Sincronizado' : '⟳ Pendente'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Última sincronização: {formatDate(playlist.lastSyncedAt)}
                            </span>
                          </div>
                          {playlist.autoSyncEnabled && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                Auto-sincronização: {playlist.syncInterval}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(playlist.id)}
                          disabled={isSyncing}
                          className="gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <a href={playlist.spotifyUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Sincronização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Auto-sync Settings */}
                <div className="space-y-3">
                  <h4 className="font-medium">Sincronização Automática</h4>
                  <div className="space-y-2">
                    {syncedPlaylists.map((playlist) => (
                      <div key={playlist.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-sm">{playlist.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {playlist.autoSyncEnabled
                              ? `Sincroniza ${playlist.syncInterval}`
                              : 'Desativada'}
                          </p>
                        </div>
                        <Checkbox
                          checked={playlist.autoSyncEnabled}
                          onCheckedChange={() => {
                            // Aqui seria feita a atualização
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Privacidade</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="public-playlists" defaultChecked={false} />
                      <label htmlFor="public-playlists" className="text-sm cursor-pointer">
                        Tornar playlists públicas no Spotify
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="collaborative" defaultChecked={false} />
                      <label htmlFor="collaborative" className="text-sm cursor-pointer">
                        Permitir colaboração nas playlists
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-red-600">Zona de Perigo</h4>
                  <Button variant="destructive" className="w-full">
                    Desconectar Spotify Permanentemente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
