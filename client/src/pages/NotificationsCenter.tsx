import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Music,
  Users,
  Zap,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Settings,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "new_song" | "recommendation" | "friend_activity" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    newSongs: true,
    recommendations: true,
    friendActivity: true,
    systemNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  // Buscar notificações não lidas
  const unreadQuery = trpc.notificationsRealtime.getUnread.useQuery();

  // Buscar histórico
  const historyQuery = trpc.notificationsRealtime.getHistory.useQuery({
    limit: 50,
  });

  // Buscar configurações
  const settingsQuery = trpc.notificationsRealtime.getSettings.useQuery();

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_song":
        return <Music className="w-5 h-5 text-blue-600" />;
      case "recommendation":
        return <Zap className="w-5 h-5 text-yellow-600" />;
      case "friend_activity":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_song":
        return "bg-blue-50 border-blue-200";
      case "recommendation":
        return "bg-yellow-50 border-yellow-200";
      case "friend_activity":
        return "bg-purple-50 border-purple-200";
      case "system":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await trpc.notificationsRealtime.markAsRead.mutate({
        notificationId,
      });
      toast.success("Marcado como lido");
    } catch (error) {
      toast.error("Erro ao marcar como lido");
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      await trpc.notificationsRealtime.markAllAsRead.mutate();
      toast.success("Todas marcadas como lidas");
    } catch (error) {
      toast.error("Erro ao marcar todas como lidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await trpc.notificationsRealtime.delete.mutate({
        notificationId,
      });
      toast.success("Notificação deletada");
    } catch (error) {
      toast.error("Erro ao deletar notificação");
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await trpc.notificationsRealtime.updateSettings.mutate(settings);
      toast.success("Configurações salvas com sucesso");
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
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Centro de Notificações
            </h1>
          </div>
          <p className="text-slate-600">
            Gerencie suas notificações e preferências
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unread">
              Não Lidas ({unreadQuery.data?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Não Lidas */}
          <TabsContent value="unread" className="space-y-4">
            {unreadQuery.data && unreadQuery.data.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-slate-600">
                    {unreadQuery.data.length} notificação(ões) não lida(s)
                  </p>
                  <Button
                    onClick={handleMarkAllAsRead}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Marcando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar todas como lidas
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {unreadQuery.data.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-4 border-l-4 ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleMarkAsRead(notification.id)
                            }
                            variant="ghost"
                            size="sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Nenhuma notificação não lida</p>
              </Card>
            )}
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history" className="space-y-4">
            {historyQuery.data && historyQuery.data.length > 0 ? (
              <div className="space-y-3">
                {historyQuery.data.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 border-l-4 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Nenhuma notificação no histórico</p>
              </Card>
            )}
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Preferências de Notificação
              </h2>

              <div className="space-y-4">
                {/* Novas Músicas */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Novas Músicas
                      </p>
                      <p className="text-sm text-slate-600">
                        Notificações quando novas músicas são adicionadas
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.newSongs}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newSongs: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Recomendações */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Recomendações
                      </p>
                      <p className="text-sm text-slate-600">
                        Sugestões personalizadas baseadas em suas preferências
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.recommendations}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        recommendations: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Atividade de Amigos */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Atividade de Amigos
                      </p>
                      <p className="text-sm text-slate-600">
                        Notificações sobre atividades de seus amigos
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.friendActivity}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        friendActivity: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Notificações do Sistema */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Notificações do Sistema
                      </p>
                      <p className="text-sm text-slate-600">
                        Alertas importantes e atualizações do sistema
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.systemNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        systemNotifications: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Notificações por Email
                      </p>
                      <p className="text-sm text-slate-600">
                        Receba resumos por email
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>

                {/* Push */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">
                        Notificações Push
                      </p>
                      <p className="text-sm text-slate-600">
                        Alertas em tempo real no navegador
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Configurações"
                )}
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
