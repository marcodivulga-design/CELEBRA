import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Music, ChevronLeft, ChevronRight } from 'lucide-react';

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const saints = [
  { month: 1, day: 1, name: 'Circuncisão do Senhor', color: 'branco', type: 'major' },
  { month: 4, day: 13, name: 'Santo Antônio de Pádua', color: 'vermelho', type: 'major' },
  { month: 6, day: 24, name: 'São João Batista', color: 'branco', type: 'major' },
  { month: 6, day: 29, name: 'São Pedro e São Paulo', color: 'vermelho', type: 'major' },
  { month: 7, day: 22, name: 'Santa Maria Madalena', color: 'branco', type: 'major' },
  { month: 7, day: 25, name: 'São Tiago Maior', color: 'vermelho', type: 'major' },
  { month: 7, day: 26, name: 'Santa Ana', color: 'branco', type: 'major' },
  { month: 8, day: 10, name: 'São Lourenço', color: 'vermelho', type: 'major' },
  { month: 8, day: 15, name: 'Assunção de Maria', color: 'branco', type: 'major' },
  { month: 8, day: 24, name: 'São Bartolomeu', color: 'vermelho', type: 'major' },
  { month: 9, day: 29, name: 'São Miguel Arcanjo', color: 'branco', type: 'major' },
  { month: 10, day: 1, name: 'Santa Teresinha', color: 'branco', type: 'major' },
  { month: 10, day: 4, name: 'São Francisco de Assis', color: 'verde', type: 'major' },
];

const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
  branco: { bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-300' },
  vermelho: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  roxo: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  verde: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
};

export default function SaintsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedSaint, setSelectedSaint] = useState<typeof saints[0] | null>(null);

  const monthSaints = saints.filter(s => s.month === currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev === 1 ? 12 : prev - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev === 12 ? 1 : prev + 1);
  };

  const getColorClasses = (color: string) => {
    return colorMap[color] || colorMap.branco;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          Calendário de Santos
        </h1>
        <p className="text-gray-600 mt-1">Conheça os santos do mês com cores litúrgicas e sugestões de músicas</p>
      </div>

      {/* Month Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button onClick={goToPreviousMonth} variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold">{months[currentMonth - 1]} de {currentYear}</h2>
            <Button onClick={goToNextMonth} variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Saints of the Month */}
      {monthSaints.length > 0 ? (
        <div className="grid gap-4">
          {monthSaints.map((saint, idx) => {
            const colors = getColorClasses(saint.color);
            return (
              <Card
                key={idx}
                className={`cursor-pointer transition-all hover:shadow-lg ${colors.bg} border-2 ${colors.border}`}
                onClick={() => setSelectedSaint(saint)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${colors.text}`}>
                          {saint.day} de {months[saint.month - 1]}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${colors.text} bg-opacity-20`}>
                          Cor: {saint.color.charAt(0).toUpperCase() + saint.color.slice(1)}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>{saint.name}</h3>
                      <p className={`mt-2 ${colors.text} opacity-75`}>
                        Clique para ver sugestões de músicas para este santo
                      </p>
                    </div>
                    <Music className={`w-8 h-8 ${colors.text}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Nenhum santo especial neste mês</p>
          </CardContent>
        </Card>
      )}

      {/* Saint Details */}
      {selectedSaint && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>{selectedSaint.name}</CardTitle>
            <CardDescription>
              {selectedSaint.day} de {months[selectedSaint.month - 1]} - Cor Litúrgica: {selectedSaint.color}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" />
                Sugestões de Músicas
              </h4>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="font-medium">Hino de Louvor</p>
                  <p className="text-sm text-gray-600">Música apropriada para celebrações deste santo</p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="font-medium">Salmo de Ação de Graças</p>
                  <p className="text-sm text-gray-600">Salmo tradicional para este tempo litúrgico</p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="font-medium">Cântico de Encerramento</p>
                  <p className="text-sm text-gray-600">Música para encerramento da celebração</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setSelectedSaint(null)} variant="outline" className="w-full">
              Fechar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Saints */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Santos (Próximos 7 dias)</CardTitle>
          <CardDescription>Prepare-se com antecedência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Santo Antônio de Pádua</p>
                <p className="text-sm text-gray-600">13 de Junho - Cor: Vermelho</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Ver Sugestões
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">São João Batista</p>
                <p className="text-sm text-gray-600">24 de Junho - Cor: Branco</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Ver Sugestões
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
