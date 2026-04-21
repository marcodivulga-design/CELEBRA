import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wifi,
  WifiOff,
  Download,
  Trash2,
  Settings,
  HardDrive,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function OfflineSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    autoSync: true,
    syncOnWifi: true,
    syncOnMobile: false,
    maxOfflineSongs: 100,
    maxStorageSize: 1024,
    deleteOldestFirst: true,
  });

  // Queries
  const statusQuery = trpc.offline.getSyncStatus.useQuery();
  const settingsQuery = trpc.offline.getOfflineSettings.useQuery();
  const offlineSongsQuery = trpc.offline.getOfflineSongs.useQuery();

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // Sincronizar dados
      await trpc.offline.syncOfflineData.mutate({
        songIds: offlineSongsQuery.data?.map((s) => s.id) || [],
        includeAudio: true,
      });
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao sincronizar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm("Tem certeza que deseja limpar o cache offline?")) return;

    setIsLoading(true);
    try {
      await trpc.offline.clearOfflineCache.mutate();
      toast.success("Cache limpo com sucesso!");
    } catch (error) {
      toast.error("Erro ao limpar cache");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await trpc.offline.updateOfflineSettings.mutate(settings);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <WifiOff className="w-8 h-8 text-slate-600" />
            <h1 className="text-4xl font-bold text-slate-900">Modo Offline</h1>
          </div>
          <p className="text-slate-600">
            Configure e gerencie a sincronização para uso offline
          </p>
        </div>

        {/* Status Card */}
        {statusQuery.data && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-600 text-sm">Status de Sincronização</p>
                <div className="flex items-center gap-2 mt-2">
                  {statusQuery.data.isSynced ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">
                        Sincronizado
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900">
                        Não sincronizado
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-slate-600 text-sm">Armazenamento</p>
                <p className="font-semibold text-slate-900 mt-2">
                  {statusQuery.data.storageUsed} / {statusQuery.data.storageAvailable}
                </p>
                <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${(parseInt(statusQuery.data.storageUsed) / parseInt(statusQuery.data.storageAvailable)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-slate-600 text-sm">Músicas Offline</p>
                <p className="font-semibold text-slate-900 mt-2">
                  {statusQuery.data.offlineSongs} / {statusQuery.data.totalSongs}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {statusQuery.data.syncProgress}% sincronizado
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="sync" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="offline">Músicas Offline</TabsTrigger>
          </TabsList>

          {/* Sincronização */}
          <TabsContent value="sync" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Gerenciar Sincronização
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 Sincronize suas músicas favoritas para ouvi-las sem
                    conexão com a internet.
                  </p>
                </div>

                <Button
                  onClick={handleSync}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Sincronizar Agora
                    </>
                  )}
                </Button>

                {statusQuery.data && statusQuery.data.lastSync && (
                  <p className="text-sm text-slate-600 text-center">
                    Última sincronização:{" "}
                    {new Date(statusQuery.data.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Limpeza de Cache
              </h2>

              <div className="space-y-4">
                <p className="text-slate-600">
                  Libere espaço removendo os dados sincronizados. Você pode
                  sincronizar novamente a qualquer momento.
                </p>

                <Button
                  onClick={handleClearCache}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Limpando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Limpar Cache Offline
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Preferências de Sincronização
              </h2>

              <div className="space-y-4">
                {/* Auto Sync */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      Sincronização Automática
                    </p>
                    <p className="text-sm text-slate-600">
                      Sincronizar automaticamente quando conectado
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSync}
                    onChange={(e) =>
                      setSettings({ ...settings, autoSync: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Sync on WiFi */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      Sincronizar no WiFi
                    </p>
                    <p className="text-sm text-slate-600">
                      Permitir sincronização em redes WiFi
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.syncOnWifi}
                    onChange={(e) =>
                      setSettings({ ...settings, syncOnWifi: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Sync on Mobile */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      Sincronizar em Dados Móveis
                    </p>
                    <p className="text-sm text-slate-600">
                      Permitir sincronização com dados móveis (pode usar muitos
                      dados)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.syncOnMobile}
                    onChange={(e) =>
                      setSettings({ ...settings, syncOnMobile: e.target.checked })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Delete Oldest First */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      Deletar Mais Antigos Primeiro
                    </p>
                    <p className="text-sm text-slate-600">
                      Remover músicas antigas quando espaço estiver cheio
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.deleteOldestFirst}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        deleteOldestFirst: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Max Offline Songs */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <label className="block">
                    <p className="font-medium text-slate-900 mb-2">
                      Máximo de Músicas Offline
                    </p>
                    <input
                      type="number"
                      value={settings.maxOfflineSongs}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxOfflineSongs: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </label>
                </div>

                {/* Max Storage Size */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <label className="block">
                    <p className="font-medium text-slate-900 mb-2">
                      Tamanho Máximo de Armazenamento (MB)
                    </p>
                    <input
                      type="number"
                      value={settings.maxStorageSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxStorageSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded"
                    />
                  </label>
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </Card>
          </TabsContent>

          {/* Músicas Offline */}
          <TabsContent value="offline" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Músicas Disponíveis Offline
              </h2>

              {offlineSongsQuery.data && offlineSongsQuery.data.length > 0 ? (
                <div className="space-y-2">
                  {offlineSongsQuery.data.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {song.title}
                        </p>
                        <p className="text-sm text-slate-600">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-slate-600">
                          {(song.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Nenhuma música sincronizada para offline
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
