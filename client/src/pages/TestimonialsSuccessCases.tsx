import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, BarChart3, Quote } from 'lucide-react';

interface SuccessCase {
  id: string;
  churchName: string;
  location: string;
  avatar: string;
  testimonial: string;
  author: string;
  role: string;
  metrics: {
    participationIncrease: number;
    engagementGrowth: number;
    usersActive: number;
    eventsOrganized: number;
  };
  image?: string;
  rating: number;
}

const successCases: SuccessCase[] = [
  {
    id: '1',
    churchName: 'Catedral Metropolitana',
    location: 'Belo Horizonte, MG',
    avatar: 'CM',
    testimonial:
      'CELEBRA revolucionou a forma como organizamos nossas celebrações. Com o catálogo de 540 músicas e as sugestões automáticas, conseguimos aumentar a participação em 45% e o engajamento da comunidade cresceu exponencialmente.',
    author: 'Padre João Silva',
    role: 'Pároco',
    metrics: {
      participationIncrease: 45,
      engagementGrowth: 62,
      usersActive: 1250,
      eventsOrganized: 48,
    },
    image: 'https://via.placeholder.com/400x300?text=Catedral+Metropolitana',
    rating: 5,
  },
  {
    id: '2',
    churchName: 'Comunidade São Francisco',
    location: 'São Paulo, SP',
    avatar: 'SF',
    testimonial:
      'O sistema de notificações push e o calendário litúrgico automático transformaram nosso engajamento. Conseguimos organizar 3 retiros espirituais e vender mais de 200 ingressos através da integração com Sympla.',
    author: 'Irmã Maria',
    role: 'Coordenadora de Eventos',
    metrics: {
      participationIncrease: 38,
      engagementGrowth: 71,
      usersActive: 890,
      eventsOrganized: 12,
    },
    image: 'https://via.placeholder.com/400x300?text=Comunidade+São+Francisco',
    rating: 5,
  },
  {
    id: '3',
    churchName: 'Paróquia Nossa Senhora',
    location: 'Brasília, DF',
    avatar: 'PN',
    testimonial:
      'O dashboard de estatísticas nos ajudou a entender melhor o perfil de nossa comunidade. Com as análises avançadas, conseguimos personalizar as celebrações e aumentar significativamente a retenção de membros.',
    author: 'Diácono Carlos',
    role: 'Responsável pela Comunidade',
    metrics: {
      participationIncrease: 52,
      engagementGrowth: 58,
      usersActive: 2100,
      eventsOrganized: 35,
    },
    image: 'https://via.placeholder.com/400x300?text=Paróquia+Nossa+Senhora',
    rating: 5,
  },
  {
    id: '4',
    churchName: 'Igreja Pentecostal da Graça',
    location: 'Rio de Janeiro, RJ',
    avatar: 'IPG',
    testimonial:
      'A integração com Google Calendar e o sistema de doações recorrentes foram game-changers para nossa organização. Conseguimos automatizar processos e aumentar a receita em 80% nos primeiros 6 meses.',
    author: 'Pastor David',
    role: 'Líder Espiritual',
    metrics: {
      participationIncrease: 68,
      engagementGrowth: 85,
      usersActive: 3400,
      eventsOrganized: 52,
    },
    image: 'https://via.placeholder.com/400x300?text=Igreja+Pentecostal+da+Graça',
    rating: 5,
  },
];

export function TestimonialsSuccessCases() {
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(successCases[0]);
  const [filterLocation, setFilterLocation] = useState<string>('all');

  const locations = useMemo(() => ['all', ...Array.from(new Set(successCases.map(c => c.location)))], []);

  const filteredCases = filterLocation === 'all'
    ? successCases
    : successCases.filter(c => c.location === filterLocation);

  const averageParticipationIncrease =
    successCases.reduce((sum, c) => sum + c.metrics.participationIncrease, 0) / successCases.length;
  const totalUsersActive = successCases.reduce((sum, c) => sum + c.metrics.usersActive, 0);
  const totalEventsOrganized = successCases.reduce((sum, c) => sum + c.metrics.eventsOrganized, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Casos de Sucesso</h1>
          <p className="text-slate-600">Histórias inspiradoras de igrejas transformadas por CELEBRA</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Aumento Médio de Participação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">+{averageParticipationIncrease.toFixed(0)}%</p>
              <p className="text-sm text-slate-600 mt-1">Crescimento médio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalUsersActive.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">Em todas as igrejas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Eventos Organizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalEventsOrganized}</p>
              <p className="text-sm text-slate-600 mt-1">Total em 6 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">4.9/5</p>
              <p className="text-sm text-slate-600 mt-1">Avaliação média</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {locations.map(location => (
            <button
              key={location}
              onClick={() => setFilterLocation(location)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterLocation === location
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600'
              }`}
            >
              {location === 'all' ? 'Todas as Regiões' : location}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Cases List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredCases.map(caseItem => (
              <Card
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className={`cursor-pointer transition-all ${
                  selectedCase?.id === caseItem.id
                    ? 'ring-2 ring-blue-600 bg-blue-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                      {caseItem.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{caseItem.churchName}</p>
                      <p className="text-xs text-slate-600">{caseItem.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Details */}
          {selectedCase && (
            <div className="lg:col-span-2 space-y-4">
              {selectedCase.image && (
                <img
                  src={selectedCase.image}
                  alt={selectedCase.churchName}
                  className="w-full rounded-lg object-cover h-64"
                />
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedCase.churchName}</CardTitle>
                      <CardDescription>{selectedCase.location}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(selectedCase.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Testimonial */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Quote className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-slate-700 italic mb-4">"{selectedCase.testimonial}"</p>
                      <div>
                        <p className="font-semibold text-slate-900">{selectedCase.author}</p>
                        <p className="text-sm text-slate-600">{selectedCase.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-slate-600">Participação</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      +{selectedCase.metrics.participationIncrease}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-slate-600">Engajamento</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      +{selectedCase.metrics.engagementGrowth}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-slate-600">Usuários Ativos</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCase.metrics.usersActive.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-slate-600">Eventos</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedCase.metrics.eventsOrganized}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-2">Pronto para transformar sua comunidade?</h3>
            <p className="mb-4">Junte-se a mais de 4 igrejas que já estão tendo sucesso com CELEBRA</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all">
              Começar Agora
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
