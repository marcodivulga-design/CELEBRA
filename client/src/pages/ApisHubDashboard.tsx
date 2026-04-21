/**
 * APIS Hub Dashboard
 * 
 * Displays real-time status of all integrated APIs via the PSD Hub
 * Shows health indicators, cache statistics, and request history
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/_core/hooks/useAuth';
import { AlertCircle, CheckCircle2, Clock, Zap, RefreshCw } from 'lucide-react';

interface ApiStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastCheck: string;
  responseTime?: number;
  requestCount?: number;
}

interface CacheStats {
  size: number;
  timeout: number;
  entries: string[];
}

export default function ApisHubDashboard() {
  const { user } = useAuth();
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock API statuses - in production, these would come from the server
  const mockApiStatuses: ApiStatus[] = [
    {
      name: 'Spotify',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 245,
      requestCount: 1523,
    },
    {
      name: 'YouTube',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 312,
      requestCount: 892,
    },
    {
      name: 'Stripe',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 189,
      requestCount: 456,
    },
    {
      name: 'PSD2 (Portugal)',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 267,
      requestCount: 234,
    },
    {
      name: 'WhatsApp Business',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 423,
      requestCount: 145,
    },
    {
      name: 'Suno AI',
      status: 'degraded',
      lastCheck: new Date().toISOString(),
      responseTime: 1245,
      requestCount: 67,
    },
    {
      name: 'Google Calendar',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 178,
      requestCount: 234,
    },
    {
      name: 'Google Maps',
      status: 'online',
      lastCheck: new Date().toISOString(),
      responseTime: 234,
      requestCount: 567,
    },
  ];

  const mockCacheStats: CacheStats = {
    size: 45,
    timeout: 5 * 60 * 1000,
    entries: [
      '/api/spotify/search',
      '/api/youtube/search',
      '/api/stripe/payments',
      '/api/psd2/history',
    ],
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setApiStatuses(mockApiStatuses);
        setCacheStats(mockCacheStats);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar status das APIs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiStatuses(mockApiStatuses);
      setCacheStats(mockCacheStats);
    } catch (err) {
      setError('Erro ao atualizar status');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acesso restrito. Apenas administradores podem acessar este dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">APIS Hub Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitore o status de todas as APIs integradas via PSD Hub
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="apis" className="w-full">
        <TabsList>
          <TabsTrigger value="apis">APIs ({apiStatuses.length})</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* APIs Tab */}
        <TabsContent value="apis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Carregando status das APIs...
              </div>
            ) : (
              apiStatuses.map((api) => (
                <Card key={api.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                      {getStatusIcon(api.status)}
                    </div>
                    <CardDescription>
                      <Badge className={`${getStatusColor(api.status)} text-white`}>
                        {api.status === 'online' ? 'Online' : api.status === 'degraded' ? 'Degradado' : 'Offline'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tempo de resposta:</span>
                      <span className="font-semibold">{api.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Requisições:</span>
                      <span className="font-semibold">{api.requestCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-gray-600">Última verificação:</span>
                      <span className="text-xs">
                        {new Date(api.lastCheck).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Cache</CardTitle>
              <CardDescription>
                Informações sobre o cache de requisições do Hub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cacheStats && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {cacheStats.size}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Entradas em cache
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            5m
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Timeout do cache
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Endpoints em cache:</h3>
                    <div className="space-y-1">
                      {cacheStats.entries.map((entry) => (
                        <div
                          key={entry}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <code className="text-sm text-gray-700">{entry}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Limpar Cache
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Métricas de uso e performance das APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {apiStatuses.reduce((sum, api) => (sum + (api.requestCount || 0)), 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Total de requisições
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {apiStatuses.filter(a => a.status === 'online').length}/{apiStatuses.length}
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          APIs Online
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {Math.round(apiStatuses.reduce((sum, api) => (sum + (api.responseTime || 0)), 0) / apiStatuses.length)}ms
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Tempo médio
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          99.9%
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          Uptime
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top APIs por requisições</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {apiStatuses
                        .sort((a, b) => (b.requestCount || 0) - (a.requestCount || 0))
                        .slice(0, 5)
                        .map((api) => (
                          <div key={api.name} className="flex justify-between items-center">
                            <span className="text-sm">{api.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{
                                    width: `${((api.requestCount || 0) / (apiStatuses[0].requestCount || 1)) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-16 text-right">
                                {api.requestCount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
