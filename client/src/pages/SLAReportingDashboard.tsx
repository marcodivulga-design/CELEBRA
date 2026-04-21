import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Calendar, Download } from 'lucide-react';

interface SLAMetric {
  name: string;
  target: number;
  actual: number;
  status: 'compliant' | 'at-risk' | 'breach';
  trend: 'up' | 'down' | 'stable';
}

interface ApiSLA {
  name: string;
  uptime: number;
  responseTime: number;
  errorRate: number;
  availability: number;
  lastMonth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

interface SLAReport {
  period: string;
  generatedAt: Date;
  totalApis: number;
  compliantApis: number;
  breachApis: number;
  overallUptime: number;
  overallResponseTime: number;
  metrics: SLAMetric[];
}

export default function SLAReportingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedApi, setSelectedApi] = useState<string | null>(null);

  const slaReport: SLAReport = {
    period: 'April 2026',
    generatedAt: new Date(),
    totalApis: 6,
    compliantApis: 5,
    breachApis: 0,
    overallUptime: 99.87,
    overallResponseTime: 287,
    metrics: [
      {
        name: 'Uptime',
        target: 99.9,
        actual: 99.87,
        status: 'at-risk',
        trend: 'down',
      },
      {
        name: 'Response Time',
        target: 300,
        actual: 287,
        status: 'compliant',
        trend: 'stable',
      },
      {
        name: 'Error Rate',
        target: 0.5,
        actual: 0.23,
        status: 'compliant',
        trend: 'up',
      },
      {
        name: 'Availability',
        target: 99.5,
        actual: 99.87,
        status: 'compliant',
        trend: 'stable',
      },
    ],
  };

  const apiSLAs: ApiSLA[] = [
    {
      name: 'Spotify',
      uptime: 99.95,
      responseTime: 245,
      errorRate: 0.12,
      availability: 99.95,
      lastMonth: { uptime: 99.92, responseTime: 256, errorRate: 0.18 },
    },
    {
      name: 'YouTube',
      uptime: 99.88,
      responseTime: 312,
      errorRate: 0.35,
      availability: 99.88,
      lastMonth: { uptime: 99.85, responseTime: 298, errorRate: 0.42 },
    },
    {
      name: 'Stripe',
      uptime: 99.99,
      responseTime: 178,
      errorRate: 0.05,
      availability: 99.99,
      lastMonth: { uptime: 99.98, responseTime: 185, errorRate: 0.08 },
    },
    {
      name: 'OpenAI',
      uptime: 99.78,
      responseTime: 456,
      errorRate: 0.58,
      availability: 99.78,
      lastMonth: { uptime: 99.75, responseTime: 445, errorRate: 0.65 },
    },
    {
      name: 'Asaas',
      uptime: 99.92,
      responseTime: 289,
      errorRate: 0.28,
      availability: 99.92,
      lastMonth: { uptime: 99.89, responseTime: 302, errorRate: 0.35 },
    },
    {
      name: 'AWS S3',
      uptime: 99.99,
      responseTime: 134,
      errorRate: 0.02,
      availability: 99.99,
      lastMonth: { uptime: 99.99, responseTime: 142, errorRate: 0.03 },
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Compliant
          </Badge>
        );
      case 'at-risk':
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> At Risk
          </Badge>
        );
      case 'breach':
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Breach
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  const handleExportReport = () => {
    const report = {
      ...slaReport,
      apis: apiSLAs,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sla-report-${slaReport.period.replace(' ', '-')}.json`;
    link.click();
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">SLA Reporting Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor Service Level Agreements and compliance metrics</p>
        </div>
        <Button onClick={handleExportReport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['current-month', 'last-month', 'last-quarter', 'last-year'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod(period)}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            {period === 'current-month'
              ? 'Current Month'
              : period === 'last-month'
                ? 'Last Month'
                : period === 'last-quarter'
                  ? 'Last Quarter'
                  : 'Last Year'}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Overall Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{slaReport.overallUptime}%</div>
                <p className="text-xs text-gray-600 mt-1">Target: 99.9%</p>
                {getStatusBadge('at-risk')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{slaReport.overallResponseTime}ms</div>
                <p className="text-xs text-gray-600 mt-1">Target: 300ms</p>
                {getStatusBadge('compliant')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Compliant APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {slaReport.compliantApis}/{slaReport.totalApis}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round((slaReport.compliantApis / slaReport.totalApis) * 100)}% compliance
                </p>
                {getStatusBadge('compliant')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Breaches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{slaReport.breachApis}</div>
                <p className="text-xs text-gray-600 mt-1">This period</p>
                {getStatusBadge('compliant')}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>SLA compliance for {slaReport.period}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Report Period</p>
                  <p className="text-lg font-semibold">{slaReport.period}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Generated</p>
                  <p className="text-lg font-semibold">{slaReport.generatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  Overall system performance is <strong>compliant</strong> with SLA targets. All critical APIs are
                  operating within acceptable parameters.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slaReport.metrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.name}</span>
                    {getStatusBadge(metric.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Target</p>
                      <p className="text-2xl font-bold">{metric.target}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Actual</p>
                      <p className="text-2xl font-bold">{metric.actual}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.status === 'compliant' ? 'bg-green-500' : metric.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((metric.actual / metric.target) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-gray-600">Trend</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* APIs Tab */}
        <TabsContent value="apis" className="space-y-4">
          <div className="space-y-3">
            {apiSLAs.map((api) => (
              <Card
                key={api.name}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedApi(selectedApi === api.name ? null : api.name)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{api.name}</span>
                    {getStatusBadge(api.uptime >= 99.9 ? 'compliant' : 'at-risk')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Uptime</p>
                      <p className="text-lg font-semibold">{api.uptime}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {api.uptime > api.lastMonth.uptime ? '↑' : '↓'} vs last month
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Response Time</p>
                      <p className="text-lg font-semibold">{api.responseTime}ms</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {api.responseTime < api.lastMonth.responseTime ? '↓' : '↑'} vs last month
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Error Rate</p>
                      <p className="text-lg font-semibold">{api.errorRate}%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {api.errorRate < api.lastMonth.errorRate ? '↓' : '↑'} vs last month
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Availability</p>
                      <p className="text-lg font-semibold">{api.availability}%</p>
                      <p className="text-xs text-gray-500 mt-1">This period</p>
                    </div>
                  </div>

                  {selectedApi === api.name && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <h4 className="font-semibold">Detailed Comparison</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-gray-600">This Month</p>
                          <p className="font-semibold">{api.uptime}%</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-gray-600">Last Month</p>
                          <p className="font-semibold">{api.lastMonth.uptime}%</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <p className="text-gray-600">Change</p>
                          <p className="font-semibold text-blue-600">
                            {(api.uptime - api.lastMonth.uptime).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance History</CardTitle>
              <CardDescription>Last 12 months of SLA performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { month: 'April 2026', uptime: 99.87, status: 'at-risk' },
                  { month: 'March 2026', uptime: 99.92, status: 'compliant' },
                  { month: 'February 2026', uptime: 99.95, status: 'compliant' },
                  { month: 'January 2026', uptime: 99.88, status: 'at-risk' },
                  { month: 'December 2025', uptime: 99.91, status: 'compliant' },
                  { month: 'November 2025', uptime: 99.89, status: 'at-risk' },
                ].map((record) => (
                  <div key={record.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{record.month}</p>
                      <p className="text-sm text-gray-600">Uptime: {record.uptime}%</p>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
