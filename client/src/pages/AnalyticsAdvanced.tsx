import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  Download,
  Zap,
  Users,
  Music,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AnalyticsAdvanced() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isExporting, setIsExporting] = useState(false);

  // Queries
  const peakHoursQuery = trpc.analyticsAdvanced.getPeakHoursHeatmap.useQuery({
    days: selectedPeriod,
  });

  const trendsQuery = trpc.analyticsAdvanced.getWeeklyTrends.useQuery({
    weeks: Math.ceil(selectedPeriod / 7),
  });

  const genreQuery = trpc.analyticsAdvanced.getGenreAnalysis.useQuery({
    days: selectedPeriod,
  });

  const engagementQuery =
    trpc.analyticsAdvanced.getEngagementReport.useQuery({
      days: selectedPeriod,
    });

  const predictionsQuery = trpc.analyticsAdvanced.getAIPredictions.useQuery();

  const handleExport = async (format: "pdf" | "csv" | "xlsx") => {
    setIsExporting(true);
    try {
      await trpc.analyticsAdvanced.exportDetailedReport.mutate({
        format,
        days: selectedPeriod,
      });
      toast.success(`Relatório em ${format.toUpperCase()} gerado!`);
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    } finally {
      setIsExporting(false);
    }
  };

  // Transformar heatmap para visualização
  const heatmapData = peakHoursQuery.data
    ? peakHoursQuery.data.flat().map((item) => ({
        hour: item.hour,
        day: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"][item.day],
        plays: item.plays,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900">
                Análise Avançada
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport("pdf")}
                disabled={isExporting}
                size="sm"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
              <Button
                onClick={() => handleExport("csv")}
                disabled={isExporting}
                size="sm"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                CSV
              </Button>
            </div>
          </div>
          <p className="text-slate-600">
            Análise detalhada de uso, tendências e previsões
          </p>
        </div>

        {/* Período */}
        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              variant={selectedPeriod === days ? "default" : "outline"}
            >
              {days === 7 ? "7 dias" : days === 30 ? "30 dias" : "90 dias"}
            </Button>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="genre">Gêneros</TabsTrigger>
            <TabsTrigger value="predictions">Previsões IA</TabsTrigger>
          </TabsList>

          {/* Heatmap */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Horários de Pico (Hora x Dia da Semana)
              </h2>
              {heatmapData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart data={heatmapData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" name="Hora" />
                    <YAxis dataKey="day" name="Dia" type="category" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter
                      name="Reproduções"
                      data={heatmapData}
                      fill="#3b82f6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-400 flex items-center justify-center text-slate-400">
                  Carregando...
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tendências */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Tendências Semanais
              </h2>
              {trendsQuery.data && trendsQuery.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={trendsQuery.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="plays"
                      stroke="#3b82f6"
                      name="Reproduções"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="uniqueUsers"
                      stroke="#8b5cf6"
                      name="Usuários Únicos"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-400 flex items-center justify-center text-slate-400">
                  Carregando...
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Engajamento */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {engagementQuery.data && (
                <>
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm">Total Plays</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                          {engagementQuery.data.totalPlays}
                        </p>
                      </div>
                      <Music className="w-12 h-12 text-blue-600 opacity-20" />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm">Usuários Ativos</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                          {engagementQuery.data.activeUsers}
                        </p>
                      </div>
                      <Users className="w-12 h-12 text-purple-600 opacity-20" />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm">Taxa Retorno</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                          {(engagementQuery.data.returnRate * 100).toFixed(0)}%
                        </p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
                    </div>
                  </Card>
                </>
              )}
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Métricas Detalhadas
              </h2>
              {engagementQuery.data && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Média de Plays por Usuário</span>
                    <span className="font-semibold">
                      {engagementQuery.data.avgPlaysPerUser.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Duração Média de Reprodução</span>
                    <span className="font-semibold">
                      {Math.floor(engagementQuery.data.avgPlayDuration / 60)}m{" "}
                      {engagementQuery.data.avgPlayDuration % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Taxa de Conclusão</span>
                    <span className="font-semibold">
                      {(engagementQuery.data.completionRate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Taxa de Favoritos</span>
                    <span className="font-semibold">
                      {(engagementQuery.data.favoriteRate * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span>Taxa de Compartilhamento</span>
                    <span className="font-semibold">
                      {(engagementQuery.data.shareRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Gêneros */}
          <TabsContent value="genre" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Distribuição por Gênero
              </h2>
              {genreQuery.data && genreQuery.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={genreQuery.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="genre" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="plays" fill="#3b82f6" name="Reproduções" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-400 flex items-center justify-center text-slate-400">
                  Carregando...
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Previsões */}
          <TabsContent value="predictions" className="space-y-6">
            {predictionsQuery.data && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Previsões de IA
                  </h2>

                  <div className="space-y-6">
                    {/* Top Songs Prediction */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Músicas Previstas como Top
                      </h3>
                      <div className="space-y-2">
                        {predictionsQuery.data.predictedTopSongs.map(
                          (song, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded"
                            >
                              <span>{song.title}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-600"
                                    style={{
                                      width: `${song.confidence * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">
                                  {(song.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Peak Hours Prediction */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Horários de Pico Previstos
                      </h3>
                      <div className="space-y-2">
                        {predictionsQuery.data.predictedPeakHours.map(
                          (hour, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded"
                            >
                              <span>{hour.hour}:00</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600"
                                    style={{
                                      width: `${hour.confidence * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">
                                  {(hour.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Churn Risk */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-900">
                            Risco de Churn
                          </h3>
                          <p className="text-sm text-red-800 mt-1">
                            {predictionsQuery.data.predictedChurn.riskUsers}{" "}
                            usuários em risco ({predictionsQuery.data.predictedChurn.riskLevel})
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-red-800">
                            {predictionsQuery.data.predictedChurn.recommendations.map(
                              (rec, idx) => (
                                <li key={idx}>• {rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
