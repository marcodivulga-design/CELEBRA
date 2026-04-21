import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, CheckCircle, XCircle, Users, Calendar, FileText, MessageSquare, TrendingUp, Clock } from "lucide-react";

export default function Admin() {
  const [organizationId] = useState(1); // TODO: Get from context
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Queries
  const { data: stats } = trpc.analytics.getOrganizationStats.useQuery({ organizationId });
  const { data: engagement } = trpc.analytics.getCommunityEngagement.useQuery({ organizationId });
  const { data: scalesStats } = trpc.analytics.getScalesStats.useQuery({ organizationId });
  const { data: pendingItems } = trpc.moderation.getPendingItems.useQuery({ organizationId, type: "all" });
  const { data: moderationStats } = trpc.moderation.getModerationStats.useQuery({ organizationId });
  const { data: moderationHistory } = trpc.moderation.getModerationHistory.useQuery({ organizationId, limit: 10, offset: 0 });

  // Mutations
  const approveMutation = trpc.moderation.approveItem.useMutation();
  const rejectMutation = trpc.moderation.rejectItem.useMutation();

  const handleApprove = async (itemId: number, itemType: "news" | "post") => {
    try {
      await approveMutation.mutateAsync({
        organizationId,
        itemId,
        itemType,
        moderatorNotes: "Aprovado pelo administrador",
      });
      alert("Item aprovado com sucesso!");
    } catch (error) {
      alert("Erro ao aprovar item");
    }
  };

  const handleReject = async (itemId: number, itemType: "news" | "post") => {
    const reason = prompt("Motivo da rejeição:");
    if (!reason) return;

    try {
      await rejectMutation.mutateAsync({
        organizationId,
        itemId,
        itemType,
        reason,
      });
      alert("Item rejeitado com sucesso!");
    } catch (error) {
      alert("Erro ao rejeitar item");
    }
  };

  const chartData = [
    { name: "Celebrações", value: stats?.totalCelebrations || 0 },
    { name: "Eventos", value: stats?.totalEvents || 0 },
    { name: "Notícias", value: stats?.totalNews || 0 },
    { name: "Posts", value: stats?.totalPosts || 0 },
  ];

  const engagementData = [
    { name: "Visualizações", value: engagement?.newsViews || 0 },
    { name: "Comentários", value: (engagement?.newsComments || 0) + (engagement?.postComments || 0) },
    { name: "Curtidas", value: engagement?.postLikes || 0 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerencie notícias, escalas e visualize estatísticas</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="moderation">
            Moderação
            {moderationStats && moderationStats.totalPending > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {moderationStats.totalPending}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Membros da comunidade</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Celebrações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCelebrations || 0}</div>
                <p className="text-xs text-muted-foreground">Total de celebrações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notícias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalNews || 0}</div>
                <p className="text-xs text-muted-foreground">Notícias publicadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                <p className="text-xs text-muted-foreground">Posts da comunidade</p>
              </CardContent>
            </Card>
          </div>

          {/* Moderação Pendente */}
          {moderationStats && moderationStats.totalPending > 0 && (
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="h-5 w-5" />
                  Itens Aguardando Moderação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Você tem <strong>{moderationStats.totalPending}</strong> item(ns) aguardando sua aprovação
                </p>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engajamento da Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-6">
          {pendingItems && pendingItems.length > 0 ? (
            <div className="space-y-4">
              {pendingItems.map((item: any) => (
                <Card key={`${item.type}-${item.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Por {item.author} • {item.type === "news" ? "Notícia" : "Post"} • {item.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/90">{item.excerpt || item.content?.substring(0, 200)}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(item.id, item.type)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => handleReject(item.id, item.type)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum item aguardando moderação</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Moderações Aprovadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{moderationStats?.totalApproved || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Moderações Rejeitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{moderationStats?.totalRejected || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Taxa de Confirmação de Escalas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{scalesStats?.confirmationRate || 0}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Escalas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Escalas</p>
                  <p className="text-2xl font-bold">{scalesStats?.totalScales || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Escalas Publicadas</p>
                  <p className="text-2xl font-bold">{scalesStats?.publishedScales || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Atribuições</p>
                  <p className="text-2xl font-bold">{scalesStats?.totalAssignments || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmações</p>
                  <p className="text-2xl font-bold">{scalesStats?.confirmations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Moderações</CardTitle>
              <CardDescription>Últimas ações de moderação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moderationHistory && moderationHistory.length > 0 ? (
                  moderationHistory.map((item: any) => (
                    <div key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.moderatorNotes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.moderatedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.action === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {item.action === "approved" ? "Aprovado" : "Rejeitado"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhuma moderação realizada</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
