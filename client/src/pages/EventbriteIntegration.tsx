import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket, Calendar, MapPin, Users, DollarSign, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketsAvailable: number;
  ticketsSold: number;
  price: number;
  platform: 'eventbrite' | 'sympla';
  url: string;
  image?: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Retiro Espiritual - Semana Santa 2025',
    date: '2025-04-15 a 2025-04-17',
    location: 'Serra da Piedade, MG',
    ticketsAvailable: 100,
    ticketsSold: 67,
    price: 150.00,
    platform: 'sympla',
    url: 'https://www.sympla.com.br/retiro-celebra',
    image: 'https://via.placeholder.com/300x200?text=Retiro+Espiritual',
  },
  {
    id: '2',
    title: 'Encontro de Coros Diocesanos',
    date: '2025-05-10 a 2025-05-11',
    location: 'Catedral Metropolitana, BH',
    ticketsAvailable: 200,
    ticketsSold: 145,
    price: 80.00,
    platform: 'eventbrite',
    url: 'https://www.eventbrite.com/encontro-coros',
    image: 'https://via.placeholder.com/300x200?text=Encontro+de+Coros',
  },
  {
    id: '3',
    title: 'Peregrinação ao Santuário de Aparecida',
    date: '2025-10-12',
    location: 'Santuário Nacional de Aparecida, SP',
    ticketsAvailable: 300,
    ticketsSold: 89,
    price: 200.00,
    platform: 'sympla',
    url: 'https://www.sympla.com.br/peregrinacao-aparecida',
    image: 'https://via.placeholder.com/300x200?text=Peregrinação',
  },
];

export function EventbriteIntegration() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const totalRevenue = events.reduce((sum, event) => sum + (event.ticketsSold * event.price), 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);

  const getProgressPercentage = (sold: number, available: number) => {
    return (sold / available) * 100;
  };

  const getPlatformColor = (platform: string) => {
    return platform === 'eventbrite' ? 'bg-blue-100 text-blue-900' : 'bg-purple-100 text-purple-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Venda de Ingressos</h1>
          <p className="text-slate-600">Integração com Eventbrite e Sympla para eventos especiais</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Eventos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{events.length}</p>
              <p className="text-sm text-slate-600 mt-1">Eventos em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Ingressos Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalTicketsSold}</p>
              <p className="text-sm text-slate-600 mt-1">Total de ingressos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-sm text-slate-600 mt-1">Faturamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Event Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Criar Novo Evento
          </Button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Criar Novo Evento</CardTitle>
              <CardDescription>Preencha os detalhes do evento para criar ingressos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Título do Evento</label>
                  <Input placeholder="Ex: Retiro Espiritual" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Data</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Local</label>
                  <Input placeholder="Ex: Catedral Metropolitana" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Preço do Ingresso (R$)</label>
                  <Input type="number" placeholder="0.00" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Quantidade de Ingressos</label>
                  <Input type="number" placeholder="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Plataforma</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Eventbrite</option>
                    <option>Sympla</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">Criar Evento</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {events.map(event => (
            <Card
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedEvent?.id === event.id ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPlatformColor(event.platform)}`}>
                    {event.platform === 'eventbrite' ? 'Eventbrite' : 'Sympla'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  R$ {event.price.toFixed(2)}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      {event.ticketsSold}/{event.ticketsAvailable} ingressos
                    </span>
                    <span className="text-sm text-slate-600">
                      {getProgressPercentage(event.ticketsSold, event.ticketsAvailable).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(event.ticketsSold, event.ticketsAvailable)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Details */}
        {selectedEvent && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedEvent.title}</CardTitle>
                  <CardDescription>{selectedEvent.location}</CardDescription>
                </div>
                <Button
                  onClick={() => window.open(selectedEvent.url, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver no {selectedEvent.platform === 'eventbrite' ? 'Eventbrite' : 'Sympla'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Data</p>
                  <p className="font-semibold text-slate-900">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Preço</p>
                  <p className="font-semibold text-slate-900">R$ {selectedEvent.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Ingressos Vendidos</p>
                  <p className="font-semibold text-slate-900">{selectedEvent.ticketsSold}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Receita</p>
                  <p className="font-semibold text-slate-900">R$ {(selectedEvent.ticketsSold * selectedEvent.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Progresso de Vendas</p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsAvailable)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {selectedEvent.ticketsSold} de {selectedEvent.ticketsAvailable} ingressos vendidos ({getProgressPercentage(selectedEvent.ticketsSold, selectedEvent.ticketsAvailable).toFixed(0)}%)
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">Editar Evento</Button>
                <Button variant="outline">Duplicar Evento</Button>
                <Button variant="destructive">Cancelar Evento</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
