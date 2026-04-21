import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Users, Music, Calendar, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const churchId = user?.churchId || 1;

  // Queries for dashboard data
  const { data: ministries = [] } = trpc.ministries.list.useQuery({
    churchId,
    limit: 100,
  });

  const { data: rehearsals = [] } = trpc.rehearsals.list.useQuery({
    ministryId: 1,
  });

  const { data: playlists = [] } = trpc.playlists.list.useQuery({
    rehearsalId: 1,
  });

  // Calculate statistics
  const totalMinistries = ministries.length;
  const totalRehersals = rehearsals.length;
  const totalPlaylists = playlists.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie todos os aspectos do CELEBRA</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Ministérios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalMinistries}</div>
              <p className="text-xs text-blue-700 mt-1">Total de ministérios ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ensaios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{totalRehersals}</div>
              <p className="text-xs text-purple-700 mt-1">Ensaios agendados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-pink-900 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Playlists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-900">{totalPlaylists}</div>
              <p className="text-xs text-pink-700 mt-1">Playlists criadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Assinaturas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">0</div>
              <p className="text-xs text-green-700 mt-1">Planos ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ministries">Ministérios</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                    <div>
                      <p className="font-semibold text-gray-900">Novo ministério criado</p>
                      <p className="text-sm text-gray-600">Coral de Adultos - há 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                    <div>
                      <p className="font-semibold text-gray-900">Ensaio agendado</p>
                      <p className="text-sm text-gray-600">Próximo domingo às 18:00 - há 1 hora</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-lg bg-pink-50 border border-pink-200">
                    <div className="w-2 h-2 rounded-full bg-pink-600 mt-2" />
                    <div>
                      <p className="font-semibold text-gray-900">Playlist criada</p>
                      <p className="text-sm text-gray-600">Missa Dominical - há 30 minutos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Rápidas</CardTitle>
                  <CardDescription>Métricas importantes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-700">Taxa de Presença</span>
                    <span className="text-2xl font-bold text-green-600">92%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-700">Membros Ativos</span>
                    <span className="text-2xl font-bold text-blue-600">145</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-700">Celebrações/Mês</span>
                    <span className="text-2xl font-bold text-purple-600">8</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-700">Músicas no Catálogo</span>
                    <span className="text-2xl font-bold text-pink-600">342</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ministries Tab */}
          <TabsContent value="ministries" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Ministérios</CardTitle>
                  <CardDescription>{totalMinistries} ministérios cadastrados</CardDescription>
                </div>
                <Button>Novo Ministério</Button>
              </CardHeader>
              <CardContent>
                {ministries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum ministério cadastrado</div>
                ) : (
                  <div className="space-y-3">
                    {ministries.map((ministry) => (
                      <div
                        key={ministry.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{ministry.name}</p>
                          <p className="text-sm text-gray-600">{ministry.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {ministry.type === "choir"
                              ? "Coral"
                              : ministry.type === "music"
                                ? "Música"
                                : ministry.type === "liturgy"
                                  ? "Liturgia"
                                  : ministry.type}
                          </p>
                          <p className="text-xs text-gray-500">Ativo</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Próximos Eventos</CardTitle>
                  <CardDescription>Ensaios e celebrações agendados</CardDescription>
                </div>
                <Button>Novo Evento</Button>
              </CardHeader>
              <CardContent>
                {rehearsals.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-900">Nenhum evento agendado</p>
                      <p className="text-sm text-yellow-800">Comece criando um novo ensaio ou celebração</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rehearsals.map((rehearsal) => (
                      <div
                        key={rehearsal.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{rehearsal.title}</p>
                            <p className="text-sm text-gray-600">{rehearsal.location}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Faturamento</CardTitle>
                <CardDescription>Planos, pagamentos e assinaturas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Free Plan */}
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300">
                    <h3 className="font-semibold text-gray-900 mb-2">Plano Gratuito</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">R$ 0</p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-4">
                      <li>✓ 3 ministérios</li>
                      <li>✓ Até 50 membros</li>
                      <li>✓ Catálogo básico</li>
                      <li>✗ Relatórios avançados</li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Seu Plano Atual
                    </Button>
                  </div>

                  {/* Pro Plan */}
                  <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Plano Pro</h3>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Popular</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-4">R$ 99<span className="text-lg">/mês</span></p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-4">
                      <li>✓ Ministérios ilimitados</li>
                      <li>✓ Membros ilimitados</li>
                      <li>✓ Catálogo completo</li>
                      <li>✓ Relatórios avançados</li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Fazer Upgrade
                    </Button>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-gray-300">
                    <h3 className="font-semibold text-gray-900 mb-2">Plano Enterprise</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">Personalizado</p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-4">
                      <li>✓ Tudo do Pro</li>
                      <li>✓ Suporte prioritário</li>
                      <li>✓ Integrações customizadas</li>
                      <li>✓ Consultoria incluída</li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Contatar Vendas
                    </Button>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Transações Recentes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">Assinatura Plano Pro</p>
                        <p className="text-sm text-gray-600">15 de Abril de 2026</p>
                      </div>
                      <span className="font-semibold text-green-600">+R$ 99,00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
