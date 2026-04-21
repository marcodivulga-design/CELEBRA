import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Building2, MapPin, Users } from 'lucide-react';

interface Church {
  id: number;
  name: string;
  type: 'cathedral' | 'church' | 'chapel' | 'sanctuary' | 'basilica';
  address: string;
  patronSaint: string;
  priests: number;
}

interface Parish {
  id: number;
  name: string;
  city: string;
  patronSaint: string;
  churches: Church[];
}

interface Diocese {
  id: number;
  name: string;
  state: string;
  bishop: string;
  parishes: Parish[];
}

interface Archdiocese {
  id: number;
  name: string;
  archbishop: string;
  dioceses: Diocese[];
}

export function ChurchHierarchy() {
  const [expandedArchdiocese, setExpandedArchdiocese] = useState<number | null>(null);
  const [expandedDiocese, setExpandedDiocese] = useState<number | null>(null);
  const [expandedParish, setExpandedParish] = useState<number | null>(null);

  // Mock data - será substituído por dados reais da API
  const mockData: Archdiocese[] = [
    {
      id: 1,
      name: 'Arquidiocese de São Paulo',
      archbishop: 'Dom Orani João Tempesta',
      dioceses: [
        {
          id: 1,
          name: 'Diocese de São Paulo',
          state: 'SP',
          bishop: 'Dom Orani João Tempesta',
          parishes: [
            {
              id: 1,
              name: 'Paróquia da Catedral',
              city: 'São Paulo',
              patronSaint: 'Nossa Senhora da Conceição',
              churches: [
                {
                  id: 1,
                  name: 'Catedral Metropolitana',
                  type: 'cathedral',
                  address: 'Av. Paulista, 1000',
                  patronSaint: 'Nossa Senhora da Conceição',
                  priests: 5,
                },
              ],
            },
            {
              id: 2,
              name: 'Paróquia de Santo Antônio',
              city: 'São Paulo',
              patronSaint: 'Santo Antônio de Pádua',
              churches: [
                {
                  id: 2,
                  name: 'Igreja de Santo Antônio',
                  type: 'church',
                  address: 'Rua Santo Antônio, 500',
                  patronSaint: 'Santo Antônio de Pádua',
                  priests: 2,
                },
                {
                  id: 3,
                  name: 'Capela de São Benedito',
                  type: 'chapel',
                  address: 'Rua São Benedito, 200',
                  patronSaint: 'São Benedito',
                  priests: 1,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Diocese de Guarulhos',
          state: 'SP',
          bishop: 'Dom Arnaldo Carvalheiro',
          parishes: [
            {
              id: 3,
              name: 'Paróquia de Nossa Senhora Aparecida',
              city: 'Guarulhos',
              patronSaint: 'Nossa Senhora Aparecida',
              churches: [
                {
                  id: 4,
                  name: 'Santuário de Nossa Senhora Aparecida',
                  type: 'sanctuary',
                  address: 'Av. Aparecida, 1500',
                  patronSaint: 'Nossa Senhora Aparecida',
                  priests: 3,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Arquidiocese do Rio de Janeiro',
      archbishop: 'Dom Orani João Tempesta',
      dioceses: [
        {
          id: 3,
          name: 'Diocese do Rio de Janeiro',
          state: 'RJ',
          bishop: 'Dom Orani João Tempesta',
          parishes: [
            {
              id: 4,
              name: 'Paróquia de São Jorge',
              city: 'Rio de Janeiro',
              patronSaint: 'São Jorge',
              churches: [
                {
                  id: 5,
                  name: 'Igreja de São Jorge',
                  type: 'church',
                  address: 'Rua São Jorge, 100',
                  patronSaint: 'São Jorge',
                  priests: 2,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const typeLabels = {
    cathedral: { label: 'Catedral', color: 'bg-red-100 text-red-800', icon: '⛪' },
    church: { label: 'Igreja', color: 'bg-blue-100 text-blue-800', icon: '🏛️' },
    chapel: { label: 'Capela', color: 'bg-green-100 text-green-800', icon: '⛩️' },
    sanctuary: { label: 'Santuário', color: 'bg-purple-100 text-purple-800', icon: '✨' },
    basilica: { label: 'Basílica', color: 'bg-yellow-100 text-yellow-800', icon: '🕌' },
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Hierarquia de Igrejas</h1>
        <p className="text-gray-600 mt-1">Visualize a estrutura religiosa: Arquidiocese → Diocese → Paróquia → Igreja</p>
      </div>

      {/* Hierarchy Tree */}
      <div className="space-y-4">
        {mockData.map((archdiocese) => (
          <Card key={archdiocese.id} className="overflow-hidden">
            {/* Archdiocese Level */}
            <CardHeader 
              className="bg-gradient-to-r from-purple-50 to-purple-100 cursor-pointer hover:from-purple-100 hover:to-purple-200 transition-colors"
              onClick={() => setExpandedArchdiocese(
                expandedArchdiocese === archdiocese.id ? null : archdiocese.id
              )}
            >
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto"
                >
                  {expandedArchdiocese === archdiocese.id ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{archdiocese.name}</CardTitle>
                  <CardDescription>Arcebispo: {archdiocese.archbishop}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-100">
                  {archdiocese.dioceses.length} Dioceses
                </Badge>
              </div>
            </CardHeader>

            {/* Dioceses */}
            {expandedArchdiocese === archdiocese.id && (
              <CardContent className="pt-6 space-y-4">
                {archdiocese.dioceses.map((diocese) => (
                  <div key={diocese.id} className="ml-4 border-l-2 border-purple-200 pl-4">
                    {/* Diocese Level */}
                    <div 
                      className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-colors"
                      onClick={() => setExpandedDiocese(
                        expandedDiocese === diocese.id ? null : diocese.id
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-auto"
                        >
                          {expandedDiocese === diocese.id ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </Button>
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          D
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{diocese.name}</p>
                          <p className="text-sm text-gray-600">
                            Bispo: {diocese.bishop} • {diocese.state}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-100">
                          {diocese.parishes.length} Paróquias
                        </Badge>
                      </div>
                    </div>

                    {/* Parishes */}
                    {expandedDiocese === diocese.id && (
                      <div className="mt-4 space-y-3 ml-4 border-l-2 border-blue-200 pl-4">
                        {diocese.parishes.map((parish) => (
                          <div key={parish.id}>
                            {/* Parish Level */}
                            <div 
                              className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg cursor-pointer hover:from-green-100 hover:to-green-200 transition-colors"
                              onClick={() => setExpandedParish(
                                expandedParish === parish.id ? null : parish.id
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="p-0 h-auto"
                                >
                                  {expandedParish === parish.id ? (
                                    <ChevronDown className="w-5 h-5" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5" />
                                  )}
                                </Button>
                                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                                  P
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold">{parish.name}</p>
                                  <p className="text-sm text-gray-600">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {parish.city} • Padroeiro: {parish.patronSaint}
                                  </p>
                                </div>
                                <Badge variant="outline" className="bg-green-100">
                                  {parish.churches.length} Igreja{parish.churches.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                            </div>

                            {/* Churches */}
                            {expandedParish === parish.id && (
                              <div className="mt-3 space-y-2 ml-4 border-l-2 border-green-200 pl-4">
                                {parish.churches.map((church) => (
                                  <div 
                                    key={church.id}
                                    className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {typeLabels[church.type]?.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold">{church.name}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <Badge className={typeLabels[church.type]?.color}>
                                            {typeLabels[church.type]?.label}
                                          </Badge>
                                          <span className="text-xs text-gray-600">
                                            <Users className="w-3 h-3 inline mr-1" />
                                            {church.priests} padre{church.priests !== 1 ? 's' : ''}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                          <MapPin className="w-3 h-3 inline mr-1" />
                                          {church.address}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Padroeiro: <span className="font-medium">{church.patronSaint}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Legenda da Hierarquia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm">Arquidiocese</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">D</div>
              <span className="text-sm">Diocese</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center text-xs font-bold">P</div>
              <span className="text-sm">Paróquia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center text-xs">⛪</div>
              <span className="text-sm">Igreja</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-600 text-white flex items-center justify-center text-xs">✨</div>
              <span className="text-sm">Santuário</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
