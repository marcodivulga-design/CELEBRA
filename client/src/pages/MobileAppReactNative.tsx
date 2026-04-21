import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, GitBranch, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface Feature {
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
}

interface Platform {
  name: string;
  icon: string;
  status: 'ready' | 'building' | 'planned';
  version: string;
  downloads: number;
}

const features: Feature[] = [
  { name: 'Autenticação OAuth', status: 'completed', progress: 100 },
  { name: 'Dashboard Principal', status: 'completed', progress: 100 },
  { name: 'Catálogo de Músicas', status: 'in-progress', progress: 75 },
  { name: 'Calendário Litúrgico', status: 'in-progress', progress: 60 },
  { name: 'Notificações Push', status: 'in-progress', progress: 50 },
  { name: 'Sincronização Offline', status: 'planned', progress: 0 },
  { name: 'Integração com Câmera', status: 'planned', progress: 0 },
  { name: 'Compartilhamento Social', status: 'planned', progress: 0 },
];

const platforms: Platform[] = [
  {
    name: 'iOS',
    icon: '🍎',
    status: 'building',
    version: '1.0.0-beta.1',
    downloads: 1250,
  },
  {
    name: 'Android',
    icon: '🤖',
    status: 'building',
    version: '1.0.0-beta.1',
    downloads: 3420,
  },
];

export function MobileAppReactNative() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(features[0]);
  const [showDevGuide, setShowDevGuide] = useState(false);

  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const inProgressFeatures = features.filter(f => f.status === 'in-progress').length;
  const totalDownloads = platforms.reduce((sum, p) => sum + p.downloads, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-900';
      case 'in-progress':
        return 'bg-blue-100 text-blue-900';
      case 'planned':
        return 'bg-slate-100 text-slate-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-900';
      case 'building':
        return 'bg-blue-100 text-blue-900';
      case 'planned':
        return 'bg-slate-100 text-slate-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mobile App - React Native</h1>
          <p className="text-slate-600">Aplicativo nativo para iOS e Android com sincronização offline</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Funcionalidades Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedFeatures}</p>
              <p className="text-sm text-slate-600 mt-1">de {features.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Em Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{inProgressFeatures}</p>
              <p className="text-sm text-slate-600 mt-1">Progresso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Downloads Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalDownloads.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">Beta testers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {Math.round((completedFeatures / features.length) * 100)}%
              </p>
              <p className="text-sm text-slate-600 mt-1">Conclusão</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <GitBranch className="w-4 h-4 mr-2" />
            Ver Repositório
          </Button>
          <Button
            onClick={() => setShowDevGuide(!showDevGuide)}
            variant="outline"
          >
            <Zap className="w-4 h-4 mr-2" />
            Guia do Desenvolvedor
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Baixar Beta
          </Button>
        </div>

        {/* Dev Guide */}
        {showDevGuide && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Guia do Desenvolvedor</CardTitle>
              <CardDescription>Instruções para configurar o ambiente de desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Pré-requisitos</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Node.js 18+ e npm/yarn</li>
                  <li>React Native CLI</li>
                  <li>Xcode (para iOS) ou Android Studio (para Android)</li>
                  <li>Git</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Instalação</h4>
                <pre className="bg-slate-900 text-slate-50 p-3 rounded overflow-x-auto text-sm">
{`git clone https://github.com/celebra/mobile-app.git
cd mobile-app
npm install
npm run ios  # ou npm run android`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Estrutura do Projeto</h4>
                <pre className="bg-slate-900 text-slate-50 p-3 rounded overflow-x-auto text-sm">
{`mobile-app/
├── src/
│   ├── screens/       # Telas da aplicação
│   ├── components/    # Componentes reutilizáveis
│   ├── services/      # Serviços (API, storage)
│   ├── hooks/         # Custom hooks
│   └── utils/         # Utilitários
├── assets/            # Imagens e fontes
└── app.json           # Configuração Expo`}
                </pre>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Abrir Documentação Completa</Button>
            </CardContent>
          </Card>
        )}

        {/* Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {platforms.map(platform => (
            <Card key={platform.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{platform.icon}</span>
                    <div>
                      <CardTitle>{platform.name}</CardTitle>
                      <CardDescription>v{platform.version}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getPlatformStatusColor(platform.status)}>
                    {platform.status === 'ready' ? 'Pronto' : platform.status === 'building' ? 'Em Construção' : 'Planejado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Downloads</p>
                  <p className="text-2xl font-bold text-slate-900">{platform.downloads.toLocaleString()}</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar do {platform.name === 'iOS' ? 'App Store' : 'Google Play'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Features List */}
          <div className="lg:col-span-1 space-y-2">
            {features.map((feature, index) => (
              <Card
                key={index}
                onClick={() => setSelectedFeature(feature)}
                className={`cursor-pointer transition-all ${
                  selectedFeature?.name === feature.name
                    ? 'ring-2 ring-blue-600 bg-blue-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900 text-sm">{feature.name}</p>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status === 'completed' ? '✓' : feature.status === 'in-progress' ? '⟳' : '○'}
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${feature.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{feature.progress}%</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Details */}
          {selectedFeature && (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedFeature.name}</CardTitle>
                    <Badge className={getStatusColor(selectedFeature.status)}>
                      {selectedFeature.status === 'completed'
                        ? 'Completa'
                        : selectedFeature.status === 'in-progress'
                        ? 'Em Desenvolvimento'
                        : 'Planejada'}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Progresso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-900">Conclusão</span>
                      <span className="text-sm font-bold text-slate-900">{selectedFeature.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${selectedFeature.progress}%` }}
                      />
                    </div>
                  </div>

                  {selectedFeature.status === 'completed' && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-900">Funcionalidade implementada e testada</p>
                    </div>
                  )}

                  {selectedFeature.status === 'in-progress' && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-900">Desenvolvimento em andamento</p>
                    </div>
                  )}

                  {selectedFeature.status === 'planned' && (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-slate-600" />
                      <p className="text-sm text-slate-900">Funcionalidade planejada para futuro</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tecnologias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React Native</Badge>
                    <Badge variant="outline">Expo</Badge>
                    <Badge variant="outline">Redux</Badge>
                    <Badge variant="outline">Firebase</Badge>
                    <Badge variant="outline">SQLite</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
