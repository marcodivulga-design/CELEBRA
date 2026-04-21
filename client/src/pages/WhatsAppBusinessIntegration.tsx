import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, CheckCircle, AlertCircle, Send, Settings } from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  type: 'confirmation' | 'reminder' | 'notification';
  recipient: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  eventName?: string;
}

const messages: WhatsAppMessage[] = [
  {
    id: '1',
    type: 'confirmation',
    recipient: '+55 11 98765-4321',
    message: 'Seu ingresso para o Retiro Espiritual foi confirmado! 🙏 Código: RET-2025-001',
    status: 'read',
    timestamp: '2025-04-15 14:30',
    eventName: 'Retiro Espiritual',
  },
  {
    id: '2',
    type: 'reminder',
    recipient: '+55 21 99876-5432',
    message: 'Lembrete: Encontro de Coros Diocesanos amanhã às 10h na Catedral Metropolitana! 🎵',
    status: 'delivered',
    timestamp: '2025-04-14 18:00',
    eventName: 'Encontro de Coros',
  },
  {
    id: '3',
    type: 'notification',
    recipient: '+55 31 97654-3210',
    message: 'Nova mensagem pastoral do Padre João: "Celebremos juntos a Páscoa com fé e esperança"',
    status: 'sent',
    timestamp: '2025-04-13 09:15',
  },
];

export function WhatsAppBusinessIntegration() {
  const [isConnected, setIsConnected] = useState(true);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'bg-green-100 text-green-900';
      case 'delivered':
        return 'bg-blue-100 text-blue-900';
      case 'sent':
        return 'bg-yellow-100 text-yellow-900';
      case 'failed':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓✓';
      case 'delivered':
        return '✓✓';
      case 'sent':
        return '✓';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'confirmation':
        return 'Confirmação de Ingresso';
      case 'reminder':
        return 'Lembrete de Evento';
      case 'notification':
        return 'Notificação Geral';
      default:
        return type;
    }
  };

  const sentCount = messages.filter(m => m.status === 'sent' || m.status === 'delivered').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const failedCount = messages.filter(m => m.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">WhatsApp Business API</h1>
          <p className="text-slate-600">Integração para confirmações, lembretes e notificações</p>
        </div>

        {/* Connection Status */}
        <Card className={`mb-6 ${isConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`} />
                <div>
                  <p className="font-semibold text-slate-900">
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {isConnected
                      ? 'WhatsApp Business API está operacional'
                      : 'Clique para reconectar'}
                  </p>
                </div>
              </div>
              <Button className={isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                {isConnected ? 'Reconectar' : 'Conectar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Mensagens Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{messages.length}</p>
              <p className="text-sm text-slate-600 mt-1">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Entregues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{sentCount}</p>
              <p className="text-sm text-slate-600 mt-1">Confirmadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Lidas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{readCount}</p>
              <p className="text-sm text-slate-600 mt-1">Taxa: {((readCount / messages.length) * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Falhas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{failedCount}</p>
              <p className="text-sm text-slate-600 mt-1">Reenviar</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </Button>
          <Button
            onClick={() => setShowTemplateForm(!showTemplateForm)}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            Gerenciar Templates
          </Button>
        </div>

        {/* Template Form */}
        {showTemplateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Criar Template de Mensagem</CardTitle>
              <CardDescription>Crie templates reutilizáveis para diferentes tipos de mensagens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Nome do Template</label>
                  <Input placeholder="Ex: Confirmação de Ingresso" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Tipo</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                    <option>Confirmação</option>
                    <option>Lembrete</option>
                    <option>Notificação</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Mensagem</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  rows={4}
                  placeholder="Sua mensagem aqui. Use {{nome}} para variáveis"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">Salvar Template</Button>
                <Button variant="outline" onClick={() => setShowTemplateForm(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages */}
          <div className="lg:col-span-2 space-y-3">
            {messages.map(message => (
              <Card
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'ring-2 ring-green-600 bg-green-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">{getTypeLabel(message.type)}</p>
                          <p className="text-sm text-slate-600">{message.recipient}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)} {message.status}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-2 line-clamp-2">{message.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{message.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Details */}
          {selectedMessage && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Tipo</p>
                  <p className="font-semibold text-slate-900">{getTypeLabel(selectedMessage.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Destinatário</p>
                  <p className="font-semibold text-slate-900">{selectedMessage.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Data/Hora</p>
                  <p className="font-semibold text-slate-900">{selectedMessage.timestamp}</p>
                </div>
                {selectedMessage.eventName && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Evento</p>
                    <p className="font-semibold text-slate-900">{selectedMessage.eventName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600 mb-1">Mensagem</p>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded">{selectedMessage.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Reenviar
                  </Button>
                  <Button variant="destructive" className="flex-1">Deletar</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
