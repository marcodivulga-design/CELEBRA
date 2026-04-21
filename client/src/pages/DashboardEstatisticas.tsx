import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Music, Calendar, TrendingUp, Download } from "lucide-react";

interface CelebrationStats {
  month: string;
  celebrations: number;
  attendance: number;
  engagement: number;
}

interface MusicStats {
  name: string;
  plays: number;
  category: string;
}

interface CommunityStats {
  activeUsers: number;
  totalPosts: number;
  averageEngagement: number;
  newMembers: number;
}

const CELEBRATION_DATA: CelebrationStats[] = [
  { month: "Jan", celebrations: 12, attendance: 450, engagement: 85 },
  { month: "Fev", celebrations: 14, attendance: 520, engagement: 88 },
  { month: "Mar", celebrations: 16, attendance: 610, engagement: 92 },
  { month: "Abr", celebrations: 18, attendance: 680, engagement: 95 },
  { month: "Mai", celebrations: 20, attendance: 750, engagement: 98 },
  { month: "Jun", celebrations: 22, attendance: 820, engagement: 100 },
];

const TOP_MUSIC: MusicStats[] = [
  { name: "Ave Maria", plays: 156, category: "Comunhão" },
  { name: "Glória a Deus", plays: 142, category: "Glória" },
  { name: "Pão da Vida", plays: 138, category: "Comunhão" },
  { name: "Aleluia", plays: 125, category: "Saída" },
  { name: "Vinde Espírito Santo", plays: 118, category: "Pentecostes" },
];

const MUSIC_DISTRIBUTION = [
  { name: "Comunhão", value: 35, color: "#3B82F6" },
  { name: "Glória", value: 25, color: "#8B5CF6" },
  { name: "Entrada", value: 20, color: "#EC4899" },
  { name: "Saída", value: 15, color: "#F59E0B" },
  { name: "Outros", value: 5, color: "#10B981" },
];

export default function DashboardEstatisticas() {
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  const communityStats: CommunityStats = {
    activeUsers: 1250,
    totalPosts: 3420,
    averageEngagement: 87,
    newMembers: 145,
  };

  const stats = useMemo(() => {
    const latestMonth = CELEBRATION_DATA[CELEBRATION_DATA.length - 1];
    return {
      totalCelebrations: CELEBRATION_DATA.reduce((acc, d) => acc + d.celebrations, 0),
      totalAttendance: CELEBRATION_DATA.reduce((acc, d) => acc + d.attendance, 0),
      averageEngagement: Math.round(CELEBRATION_DATA.reduce((acc, d) => acc + d.engagement, 0) / CELEBRATION_DATA.length),
      monthlyGrowth: latestMonth.celebrations - CELEBRATION_DATA[CELEBRATION_DATA.length - 2].celebrations,
    };
  }, []);

  const handleExport = () => {
    const data = {
      period: timeRange,
      celebrations: stats.totalCelebrations,
      attendance: stats.totalAttendance,
      engagement: stats.averageEngagement,
      topMusic: TOP_MUSIC,
      timestamp: new Date().toISOString(),
    };
    
    const csv = [
      ["Métrica", "Valor"],
      ["Total de Celebrações", stats.totalCelebrations],
      ["Total de Participantes", stats.totalAttendance],
      ["Engajamento Médio", `${stats.averageEngagement}%`],
      ["Crescimento Mensal", stats.monthlyGrowth],
      ["Usuários Ativos", communityStats.activeUsers],
      ["Posts Totais", communityStats.totalPosts],
      ["Novos Membros", communityStats.newMembers],
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `celebra-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2 font-playfair">
            📊 Dashboard de Estatísticas
          </h1>
          <p className="text-gray-600">Métricas de celebrações, participação e engajamento da comunidade</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(["month", "quarter", "year"] as const).map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant={timeRange === range ? "default" : "outline"}
              className="capitalize"
            >
              {range === "month" ? "Mês" : range === "quarter" ? "Trimestre" : "Ano"}
            </Button>
          ))}
          <Button onClick={handleExport} variant="outline" className="ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Total de Celebrações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-900">{stats.totalCelebrations}</div>
              <p className="text-xs text-green-600 mt-1">+{stats.monthlyGrowth} este mês</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total de Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-900">{stats.totalAttendance}</div>
              <p className="text-xs text-green-600 mt-1">Média: {Math.round(stats.totalAttendance / CELEBRATION_DATA.length)} por celebração</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engajamento Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-900">{stats.averageEngagement}%</div>
              <p className="text-xs text-green-600 mt-1">Crescimento consistente</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-900">{communityStats.activeUsers}</div>
              <p className="text-xs text-green-600 mt-1">+{communityStats.newMembers} novos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Celebrations Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Celebrações</CardTitle>
              <CardDescription>Número de celebrações e participantes por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={CELEBRATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="celebrations" stroke="#3B82F6" name="Celebrações" />
                  <Line type="monotone" dataKey="attendance" stroke="#8B5CF6" name="Participantes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Engajamento da Comunidade</CardTitle>
              <CardDescription>Nível de engajamento ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={CELEBRATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#EC4899" name="Engajamento %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Music and Community Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Music */}
          <Card>
            <CardHeader>
              <CardTitle>🎵 Músicas Mais Tocadas</CardTitle>
              <CardDescription>Top 5 músicas do catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TOP_MUSIC.map((music, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sky-900">{music.name}</p>
                      <p className="text-xs text-gray-500">{music.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{music.plays}</p>
                      <p className="text-xs text-gray-500">execuções</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Music Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Músicas</CardTitle>
              <CardDescription>Por tipo de celebração</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={MUSIC_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {MUSIC_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📱 Estatísticas da Comunidade</CardTitle>
            <CardDescription>Engajamento e atividade dos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-sky-50 rounded-lg">
                <p className="text-2xl font-bold text-sky-900">{communityStats.activeUsers}</p>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">{communityStats.totalPosts}</p>
                <p className="text-sm text-gray-600">Posts Totais</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-900">{communityStats.averageEngagement}%</p>
                <p className="text-sm text-gray-600">Engajamento Médio</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-900">{communityStats.newMembers}</p>
                <p className="text-sm text-gray-600">Novos Membros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
