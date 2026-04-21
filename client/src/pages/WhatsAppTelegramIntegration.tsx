import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function WhatsAppTelegramIntegration() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [telegramVerified, setTelegramVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsappConnect = async () => {
    setLoading(true);
    // TODO: Implementar integração com WhatsApp Business API
    setTimeout(() => {
      setWhatsappVerified(true);
      setLoading(false);
    }, 2000);
  };

  const handleTelegramConnect = async () => {
    setLoading(true);
    // TODO: Implementar integração com Telegram Bot API
    setTimeout(() => {
      setTelegramVerified(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Integração WhatsApp & Telegram</h1>
          <p className="text-slate-600">Receba notificações de celebrações, mensagens pastorais e eventos via WhatsApp e Telegram</p>
        </div>

        {/* WhatsApp Integration */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <CardTitle>WhatsApp Business</CardTitle>
                  <CardDescription>Receba notificações via WhatsApp</CardDescription>
                </div>
              </div>
              <Switch
                checked={whatsappEnabled}
                onCheckedChange={setWhatsappEnabled}
              />
            </div>
          </CardHeader>

          {whatsappEnabled && (
            <CardContent className="space-y-4">
              {whatsappVerified ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">WhatsApp Conectado</p>
                    <p className="text-sm text-green-700">Seu número está verificado e pronto para receber notificações</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="whatsappPhone" className="mb-2 block">
                      Número de Telefone (com código do país)
                    </Label>
                    <Input
                      id="whatsappPhone"
                      placeholder="+55 11 99999-9999"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">Exemplo: +55 11 99999-9999</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Como funciona:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Clique em "Conectar WhatsApp"</li>
                        <li>Você receberá um código de verificação via WhatsApp</li>
                        <li>Confirme o código para ativar as notificações</li>
                      </ol>
                    </div>
                  </div>

                  <Button
                    onClick={handleWhatsappConnect}
                    disabled={!whatsappPhone || loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Conectando...' : 'Conectar WhatsApp'}
                  </Button>
                </>
              )}

              {/* WhatsApp Notification Types */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Tipos de Notificação</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="whatsapp-celebrations" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="whatsapp-celebrations" className="cursor-pointer">Lembretes de Celebrações</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="whatsapp-pastoral" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="whatsapp-pastoral" className="cursor-pointer">Mensagens Pastorais</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="whatsapp-events" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="whatsapp-events" className="cursor-pointer">Notificações de Eventos</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="whatsapp-news" className="w-4 h-4" />
                    <Label htmlFor="whatsapp-news" className="cursor-pointer">Notícias da Comunidade</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Telegram Integration */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle>Telegram Bot</CardTitle>
                  <CardDescription>Receba notificações via Telegram</CardDescription>
                </div>
              </div>
              <Switch
                checked={telegramEnabled}
                onCheckedChange={setTelegramEnabled}
              />
            </div>
          </CardHeader>

          {telegramEnabled && (
            <CardContent className="space-y-4">
              {telegramVerified ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Telegram Conectado</p>
                    <p className="text-sm text-blue-700">Seu usuário está verificado e pronto para receber notificações</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="telegramUsername" className="mb-2 block">
                      Nome de Usuário do Telegram
                    </Label>
                    <Input
                      id="telegramUsername"
                      placeholder="@seu_usuario"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">Você pode encontrar seu usuário nas configurações do Telegram</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Como funciona:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Clique em "Conectar Telegram"</li>
                        <li>Procure pelo bot @CelebraBot no Telegram</li>
                        <li>Clique em "Iniciar" para ativar as notificações</li>
                      </ol>
                    </div>
                  </div>

                  <Button
                    onClick={handleTelegramConnect}
                    disabled={!telegramUsername || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Conectando...' : 'Conectar Telegram'}
                  </Button>
                </>
              )}

              {/* Telegram Notification Types */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Tipos de Notificação</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="telegram-celebrations" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="telegram-celebrations" className="cursor-pointer">Lembretes de Celebrações</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="telegram-pastoral" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="telegram-pastoral" className="cursor-pointer">Mensagens Pastorais</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="telegram-events" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="telegram-events" className="cursor-pointer">Notificações de Eventos</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="telegram-news" className="w-4 h-4" />
                    <Label htmlFor="telegram-news" className="cursor-pointer">Notícias da Comunidade</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Info Card */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Benefícios da Integração</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-purple-900">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Receba notificações instantâneas sem precisar abrir o app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Escolha quais tipos de notificação deseja receber</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Responda mensagens diretamente pelo WhatsApp ou Telegram</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span>Mantenha-se conectado com a comunidade de qualquer lugar</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
