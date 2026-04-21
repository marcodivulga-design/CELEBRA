import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, RefreshCw, Server, TrendingUp } from 'lucide-react';

interface ApiStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  latency: number;
  lastCheck: Date;
  successRate: number;
  requestsPerMinute: number;
}

interface HubStatus {
  available: boolean;
  fallbackActive: boolean;
  failureCount: number;
  successCount: number;
  lastCheck: Date;
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  avgSize: number;
}

export default function ApiMonitoringDashboard() {
  const [hubStatus, setHubStatus] = useState<HubStatus>({
    available: true,
    fallbackActive: false,
    failureCount: 0,
    successCount: 0,
    lastCheck: new Date(),
  });

  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: 'Spotify',
      status: 'online',
      latency: 245,
      lastCheck: new Date(),
      successRate: 99.8,
      requestsPerMinute: 156,
    },
    {
      name: 'YouTube',
      status: 'online',
      latency: 312,
      lastCheck: new Date(),
      successRate: 99.5,
      requestsPerMinute: 89,
    },
    {
      name: 'Stripe',
      status: 'online',
      latency: 178,
      lastCheck: new Date(),
      successRate: 100,
      requestsPerMinute: 42,
    },
    {
      name: 'OpenAI',
      status: 'online',
      latency: 456,
      lastCheck: new Date(),
      successRate: 98.9,
      requestsPerMinute: 23,
    },
    {
      name: 'Asaas',
      status: 'online',
      latency: 289,
      lastCheck: new Date(),
      successRate: 99.2,
      requestsPerMinute: 67,
    },
    {
      name: 'AWS S3',
      status: 'online',
      latency: 134,
      lastCheck: new Date(),
      successRate: 99.9,
      requestsPerMinute: 234,
    },
  ]);

  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalEntries: 1247,
    hitRate: 87.3,
    missRate: 12.7,
    avgSize: 2.4,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setHubStatus((prev) => ({
        ...prev,
        lastCheck: new Date(),
      }));
      setRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'degraded':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500">Offline</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">API Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor PSD Hub and integrated APIs health status</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hub Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  PSD Hub Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hub Available</span>
                  {getStatusBadge(hubStatus.available ? 'online' : 'offline')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fallback Active</span>
                  <Badge variant={hubStatus.fallbackActive ? 'destructive' : 'secondary'}>
                    {hubStatus.fallbackActive ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Count</span>
                  <span className="font-semibold text-green-600">{hubStatus.successCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failure Count</span>
                  <span className="font-semibold text-red-600">{hubStatus.failureCount}</span>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Last check: {hubStatus.lastCheck.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>

            {/* System Health Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">APIs Online</span>
                  <span className="font-semibold text-green-600">
                    {apiStatuses.filter((a) => a.status === 'online').length}/{apiStatuses.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Latency</span>
                  <span className="font-semibold">
                    {Math.round(apiStatuses.reduce((a, b) => a + b.latency, 0) / apiStatuses.length)}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Success Rate</span>
                  <span className="font-semibold text-green-600">
                    {(apiStatuses.reduce((a, b) => a + b.successRate, 0) / apiStatuses.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Requests/min</span>
                  <span className="font-semibold">
                    {apiStatuses.reduce((a, b) => a + b.requestsPerMinute, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Cache Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Entries</span>
                  <span className="font-semibold">{cacheStats.totalEntries.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hit Rate</span>
                  <span className="font-semibold text-green-600">{cacheStats.hitRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Miss Rate</span>
                  <span className="font-semibold text-yellow-600">{cacheStats.missRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Size</span>
                  <span className="font-semibold">{cacheStats.avgSize.toFixed(1)} MB</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* APIs Tab */}
        <TabsContent value="apis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiStatuses.map((api) => (
              <Card key={api.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      {api.name}
                    </span>
                    {getStatusBadge(api.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Latency</p>
                      <p className="text-lg font-semibold">{api.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Success Rate</p>
                      <p className="text-lg font-semibold text-green-600">{api.successRate}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Requests/min</p>
                    <p className="text-lg font-semibold">{api.requestsPerMinute}</p>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Last check: {api.lastCheck.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance</CardTitle>
              <CardDescription>Monitor cache hit/miss rates and storage usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Hit Rate</span>
                  <span className="font-semibold">{cacheStats.hitRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${cacheStats.hitRate}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Miss Rate</span>
                  <span className="font-semibold">{cacheStats.missRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${cacheStats.missRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold">{cacheStats.totalEntries.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Entry Size</p>
                  <p className="text-2xl font-bold">{cacheStats.avgSize.toFixed(1)} MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Detailed metrics and performance data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {apiStatuses.reduce((a, b) => a + b.requestsPerMinute, 0) * 60}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(apiStatuses.reduce((a, b) => a + b.successRate, 0) / apiStatuses.length).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600">Avg Latency</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(apiStatuses.reduce((a, b) => a + b.latency, 0) / apiStatuses.length)}ms
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600">Cache Hit Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{cacheStats.hitRate.toFixed(1)}%</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  API Performance Ranking
                </h3>
                <div className="space-y-2">
                  {apiStatuses
                    .sort((a, b) => a.latency - b.latency)
                    .map((api, idx) => (
                      <div key={api.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {idx + 1}. {api.name}
                        </span>
                        <span className="text-sm font-semibold">{api.latency}ms</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
