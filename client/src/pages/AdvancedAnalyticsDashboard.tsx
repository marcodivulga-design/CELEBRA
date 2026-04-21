import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Mail, MessageSquare, Download } from 'lucide-react';

const retentionData = [
  { week: 'Semana 1', retention: 100 },
  { week: 'Semana 2', retention: 85 },
  { week: 'Semana 3', retention: 72 },
  { week: 'Semana 4', retention: 68 },
  { week: 'Semana 5', retention: 65 },
  { week: 'Semana 6', retention: 62 },
  { week: 'Semana 7', retention: 60 },
  { week: 'Semana 8', retention: 58 },
];

const emailOpenRateData = [
  { date: '01/04', openRate: 45 },
  { date: '02/04', openRate: 52 },
  { date: '03/04', openRate: 48 },
  { date: '04/04', openRate: 61 },
  { date: '05/04', openRate: 58 },
  { date: '06/04', openRate: 65 },
  { date: '07/04', openRate: 72 },
];

const engagementData = [
  { name: 'Celebrações', value: 35 },
  { name: 'Mensagens Pastorais', value: 25 },
  { name: 'Eventos', value: 20 },
  { name: 'Notícias', value: 15 },
  { name: 'Outros', value: 5 },
];

const notificationChannelsData = [
  { channel: 'Email', sent: 450, opened: 280, clicked: 120 },
  { channel: 'WhatsApp', sent: 320, opened: 280, clicked: 95 },
  { channel: 'Telegram', sent: 180, opened: 140, clicked: 45 },
  { channel: 'Push', sent: 500, opened: 350, clicked: 180 },
];

const COLORS = ['#6B46C1', '#D4AF37', '#3B82F6', '#10B981', '#F59E0B'];

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics Avançado</h1>
          <p className="text-slate-600">Análise detalhada de retenção, engajamento e performance de notificações</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : range === '90d' ? '90 dias' : '1 ano'}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taxa de Retenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">58%</div>
              <p className="text-xs text-red-600 mt-1">↓ 2% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taxa de Abertura de Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">72%</div>
              <p className="text-xs text-green-600 mt-1">↑ 7% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Engajamento Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">42%</div>
              <p className="text-xs text-green-600 mt-1">↑ 5% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">1,240</div>
              <p className="text-xs text-green-600 mt-1">↑ 12% vs semana anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Retention Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Retenção por Semana</CardTitle>
              <CardDescription>Percentual de usuários retidos ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="retention" stroke="#6B46C1" strokeWidth={2} dot={{ fill: '#6B46C1' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Email Open Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Abertura de Email</CardTitle>
              <CardDescription>Percentual de emails abertos por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emailOpenRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="openRate" fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Engajamento</CardTitle>
              <CardDescription>Engajamento por tipo de notificação</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Notification Channels Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Canal</CardTitle>
              <CardDescription>Comparação de canais de notificação</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={notificationChannelsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3B82F6" />
                  <Bar dataKey="opened" fill="#10B981" />
                  <Bar dataKey="clicked" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas Detalhadas por Canal</CardTitle>
            <CardDescription>Análise completa de performance de cada canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Canal</th>
                    <th className="text-center py-2 px-4 font-semibold">Enviadas</th>
                    <th className="text-center py-2 px-4 font-semibold">Abertas</th>
                    <th className="text-center py-2 px-4 font-semibold">Taxa de Abertura</th>
                    <th className="text-center py-2 px-4 font-semibold">Cliques</th>
                    <th className="text-center py-2 px-4 font-semibold">Taxa de Clique</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationChannelsData.map((row) => (
                    <tr key={row.channel} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{row.channel}</td>
                      <td className="text-center py-3 px-4">{row.sent}</td>
                      <td className="text-center py-3 px-4">{row.opened}</td>
                      <td className="text-center py-3 px-4 text-green-600 font-semibold">
                        {((row.opened / row.sent) * 100).toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-4">{row.clicked}</td>
                      <td className="text-center py-3 px-4 text-blue-600 font-semibold">
                        {((row.clicked / row.opened) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>
    </div>
  );
}
