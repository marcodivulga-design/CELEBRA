import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, Calendar, Music } from "lucide-react";

export default function AnalyticsReports() {
  const [dateRange, setDateRange] = useState("month");

  // Sample data for charts
  const attendanceData = [
    { week: "Semana 1", attendance: 18, target: 20 },
    { week: "Semana 2", attendance: 19, target: 20 },
    { week: "Semana 3", attendance: 17, target: 20 },
    { week: "Semana 4", attendance: 20, target: 20 },
  ];

  const ministryData = [
    { name: "Coral", value: 35, color: "#3b82f6" },
    { name: "Música", value: 28, color: "#8b5cf6" },
    { name: "Liturgia", value: 22, color: "#ec4899" },
    { name: "Juventude", value: 15, color: "#f59e0b" },
  ];

  const trendData = [
    { month: "Jan", presença: 85, engajamento: 78 },
    { month: "Fev", presença: 88, engajamento: 82 },
    { month: "Mar", presença: 92, engajamento: 85 },
    { month: "Abr", presença: 89, engajamento: 88 },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Relatórios e Análises</h1>
          <p className="text-gray-600">Acompanhe o desempenho dos ministérios e eventos</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Taxa de Presença
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">89%</div>
              <p className="text-xs text-blue-700 mt-1">+2% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Eventos Realizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">24</div>
              <p className="text-xs text-purple-700 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-pink-900 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Músicas Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-900">156</div>
              <p className="text-xs text-pink-700 mt-1">No catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engajamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">87%</div>
              <p className="text-xs text-green-700 mt-1">+5% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Presença</TabsTrigger>
            <TabsTrigger value="ministries">Ministérios</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Presença Semanal</CardTitle>
                <CardDescription>Comparação com meta de presença</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#3b82f6" name="Presença Real" />
                    <Bar dataKey="target" fill="#d1d5db" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendance Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes de Presença</CardTitle>
                <CardDescription>Últimos 10 ensaios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900">Ensaio {i + 1}</p>
                        <p className="text-sm text-gray-600">{new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{18 + Math.floor(Math.random() * 3)} presentes</p>
                        <p className="text-sm text-green-600">{85 + Math.floor(Math.random() * 15)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ministries Tab */}
          <TabsContent value="ministries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Ministério</CardTitle>
                <CardDescription>Membros ativos por ministério</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={ministryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ministryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {ministryData.map((ministry, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{ministry.name}</p>
                          <span className="text-sm font-bold text-gray-600">{ministry.value} membros</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(ministry.value / 35) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Presença e Engajamento</CardTitle>
                <CardDescription>Últimos 4 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="presença" stroke="#3b82f6" strokeWidth={2} name="Taxa de Presença %" />
                    <Line type="monotone" dataKey="engajamento" stroke="#8b5cf6" strokeWidth={2} name="Engajamento %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
                <CardDescription>Análises importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="font-semibold text-green-900">✓ Presença em alta</p>
                  <p className="text-sm text-green-800">Taxa de presença aumentou 4% em relação ao mês anterior</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="font-semibold text-blue-900">ℹ Ministério mais ativo</p>
                  <p className="text-sm text-blue-800">Coral tem o maior número de membros ativos (35 pessoas)</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="font-semibold text-yellow-900">⚠ Atenção necessária</p>
                  <p className="text-sm text-yellow-800">Ministério de Juventude tem baixa participação (15 membros)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatórios</CardTitle>
                <CardDescription>Baixe relatórios em diferentes formatos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Relatório de Presença", format: "PDF", icon: "📄" },
                    { title: "Análise de Ministérios", format: "Excel", icon: "📊" },
                    { title: "Tendências Mensais", format: "CSV", icon: "📈" },
                    { title: "Relatório Completo", format: "PDF", icon: "📋" },
                  ].map((report, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            {report.icon} {report.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Formato: {report.format}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date Range Selector */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="font-semibold text-gray-900 mb-3">Período do Relatório</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Última Semana", "Último Mês", "Últimos 3 Meses", "Último Ano"].map((period) => (
                      <Button key={period} variant="outline" className="justify-center">
                        {period}
                      </Button>
                    ))}
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
