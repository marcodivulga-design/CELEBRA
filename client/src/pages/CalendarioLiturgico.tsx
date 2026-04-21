import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Music, ChevronLeft, ChevronRight } from 'lucide-react';

interface LiturgicalEvent {
  date: string;
  name: string;
  type: 'festa' | 'solenidade' | 'memoria' | 'feria';
  season: 'advento' | 'natal' | 'quaresma' | 'pascoa' | 'pentecostes' | 'ordinario';
  suggestedMusicTypes: string[];
  color: string;
}

const liturgicalCalendar2024: LiturgicalEvent[] = [
  // Advento
  { date: '2024-12-01', name: 'Primeiro Domingo do Advento', type: 'solenidade', season: 'advento', suggestedMusicTypes: ['Esperança', 'Penitência', 'Vigilância'], color: 'bg-purple-600' },
  { date: '2024-12-08', name: 'Imaculada Conceição', type: 'solenidade', season: 'advento', suggestedMusicTypes: ['Mariologia', 'Alegria', 'Louvor'], color: 'bg-blue-600' },
  { date: '2024-12-25', name: 'Natal do Senhor', type: 'solenidade', season: 'natal', suggestedMusicTypes: ['Alegria', 'Louvor', 'Natividade'], color: 'bg-red-600' },
  
  // Quaresma e Páscoa
  { date: '2025-02-26', name: 'Quarta-feira de Cinzas', type: 'feria', season: 'quaresma', suggestedMusicTypes: ['Penitência', 'Conversão', 'Jejum'], color: 'bg-gray-600' },
  { date: '2025-04-20', name: 'Domingo de Ramos', type: 'solenidade', season: 'quaresma', suggestedMusicTypes: ['Paixão', 'Entrada', 'Louvor'], color: 'bg-green-600' },
  { date: '2025-04-25', name: 'Sexta-feira Santa', type: 'solenidade', season: 'quaresma', suggestedMusicTypes: ['Paixão', 'Redenção', 'Lamento'], color: 'bg-black' },
  { date: '2025-04-27', name: 'Páscoa do Senhor', type: 'solenidade', season: 'pascoa', suggestedMusicTypes: ['Ressurreição', 'Alegria', 'Vitória'], color: 'bg-yellow-600' },
  
  // Pentecostes
  { date: '2025-06-08', name: 'Pentecostes', type: 'solenidade', season: 'pentecostes', suggestedMusicTypes: ['Espírito Santo', 'Fogo', 'Renovação'], color: 'bg-red-500' },
  
  // Tempo Ordinário
  { date: '2025-01-25', name: 'Conversão de São Paulo', type: 'memoria', season: 'ordinario', suggestedMusicTypes: ['Conversão', 'Apóstolos', 'Louvor'], color: 'bg-blue-500' },
  { date: '2025-02-02', name: 'Apresentação do Senhor', type: 'festa', season: 'ordinario', suggestedMusicTypes: ['Luz', 'Apresentação', 'Louvor'], color: 'bg-yellow-500' },
  { date: '2025-03-19', name: 'São José', type: 'solenidade', season: 'ordinario', suggestedMusicTypes: ['Trabalho', 'Família', 'Proteção'], color: 'bg-amber-600' },
  { date: '2025-03-25', name: 'Anunciação do Senhor', type: 'solenidade', season: 'ordinario', suggestedMusicTypes: ['Mariologia', 'Encarnação', 'Alegria'], color: 'bg-pink-600' },
  { date: '2025-05-01', name: 'São Filipe e São Tiago', type: 'festa', season: 'ordinario', suggestedMusicTypes: ['Apóstolos', 'Martírio', 'Louvor'], color: 'bg-red-500' },
  { date: '2025-06-29', name: 'São Pedro e São Paulo', type: 'solenidade', season: 'ordinario', suggestedMusicTypes: ['Apóstolos', 'Igreja', 'Louvor'], color: 'bg-yellow-500' },
  { date: '2025-08-15', name: 'Assunção de Maria', type: 'solenidade', season: 'ordinario', suggestedMusicTypes: ['Mariologia', 'Céu', 'Louvor'], color: 'bg-blue-600' },
  { date: '2025-11-01', name: 'Todos os Santos', type: 'solenidade', season: 'ordinario', suggestedMusicTypes: ['Santidade', 'Comunhão dos Santos', 'Louvor'], color: 'bg-purple-500' },
  { date: '2025-11-02', name: 'Finados', type: 'memoria', season: 'ordinario', suggestedMusicTypes: ['Defuntos', 'Repouso', 'Paz'], color: 'bg-gray-700' },
];

export function CalendarioLiturgico() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<LiturgicalEvent | null>(null);

  const monthEvents = useMemo(() => {
    return liturgicalCalendar2024.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth.getMonth() && 
             eventDate.getFullYear() === currentMonth.getFullYear();
    });
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getSeasonColor = (season: string) => {
    const colors: Record<string, string> = {
      advento: 'bg-purple-100 text-purple-900',
      natal: 'bg-red-100 text-red-900',
      quaresma: 'bg-gray-100 text-gray-900',
      pascoa: 'bg-yellow-100 text-yellow-900',
      pentecostes: 'bg-orange-100 text-orange-900',
      ordinario: 'bg-green-100 text-green-900',
    };
    return colors[season] || 'bg-slate-100 text-slate-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Calendário Litúrgico</h1>
          <p className="text-slate-600">Sincronização automática com o calendário católico para sugestões de músicas e celebrações</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Mês Anterior
          </Button>
          <h2 className="text-2xl font-bold text-slate-900">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" onClick={handleNextMonth}>
            Próximo Mês
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Litúrgicos do Mês</CardTitle>
                <CardDescription>Celebrações, festas e solenidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthEvents.length > 0 ? (
                    monthEvents.map((event) => (
                      <div
                        key={event.date}
                        onClick={() => setSelectedDate(event)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${event.color} text-white hover:shadow-lg ${
                          selectedDate?.date === event.date ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{event.name}</p>
                            <p className="text-sm opacity-90">
                              {new Date(event.date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeasonColor(event.season)}`}>
                            {event.season.charAt(0).toUpperCase() + event.season.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">Nenhum evento especial neste mês</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div>
            {selectedDate ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes do Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Evento</p>
                    <p className="font-semibold text-slate-900">{selectedDate.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Data</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(selectedDate.date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Tipo</p>
                    <p className="font-semibold text-slate-900 capitalize">{selectedDate.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-2">Tempo Litúrgico</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeasonColor(selectedDate.season)}`}>
                      {selectedDate.season.charAt(0).toUpperCase() + selectedDate.season.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-2">Sugestões de Música</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDate.suggestedMusicTypes.map((type) => (
                        <span key={type} className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                    <Music className="w-4 h-4 mr-2" />
                    Ver Sugestões de Músicas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Selecione um Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Clique em um evento litúrgico para ver detalhes e sugestões automáticas de músicas para a celebração.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Solenidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {liturgicalCalendar2024.filter(e => e.type === 'solenidade').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Festas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {liturgicalCalendar2024.filter(e => e.type === 'festa').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Memórias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {liturgicalCalendar2024.filter(e => e.type === 'memoria').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Férias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">
                {liturgicalCalendar2024.filter(e => e.type === 'feria').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
