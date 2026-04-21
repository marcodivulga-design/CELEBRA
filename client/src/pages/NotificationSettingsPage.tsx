import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Clock } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  celebrationReminders: boolean;
  pastoralmessages: boolean;
  eventNotifications: boolean;
  newsNotifications: boolean;
  reminderTime: string;
  frequency: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  whatsappNotifications: boolean;
  telegramNotifications: boolean;
}

export function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    celebrationReminders: true,
    pastoralmessages: true,
    eventNotifications: true,
    newsNotifications: false,
    reminderTime: '24h',
    frequency: 'daily',
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    whatsappNotifications: false,
    telegramNotifications: false,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key: keyof NotificationSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    // TODO: Implementar chamada tRPC para salvar configurações
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Configurações de Notificações</h1>
          <p className="text-slate-600">Personalize como você recebe notificações sobre celebrações, mensagens e eventos</p>
        </div>

        {/* Email Notifications */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <CardTitle>Notificações por Email</CardTitle>
            </div>
            <CardDescription>Controle quais tipos de notificações você recebe por email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Master Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="emailNotifications" className="cursor-pointer">
                Ativar notificações por email
              </Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>

            {settings.emailNotifications && (
              <>
                {/* Email Preferences */}
                <div className="space-y-3 pl-3 border-l-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="celebrationReminders" className="cursor-pointer">
                      Lembretes de Celebrações
                    </Label>
                    <Switch
                      id="celebrationReminders"
                      checked={settings.celebrationReminders}
                      onCheckedChange={() => handleToggle('celebrationReminders')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pastoralmessages" className="cursor-pointer">
                      Mensagens Pastorais
                    </Label>
                    <Switch
                      id="pastoralmessages"
                      checked={settings.pastoralmessages}
                      onCheckedChange={() => handleToggle('pastoralmessages')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="eventNotifications" className="cursor-pointer">
                      Notificações de Eventos
                    </Label>
                    <Switch
                      id="eventNotifications"
                      checked={settings.eventNotifications}
                      onCheckedChange={() => handleToggle('eventNotifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="newsNotifications" className="cursor-pointer">
                      Notícias da Comunidade
                    </Label>
                    <Switch
                      id="newsNotifications"
                      checked={settings.newsNotifications}
                      onCheckedChange={() => handleToggle('newsNotifications')}
                    />
                  </div>
                </div>

                {/* Reminder Timing */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="reminderTime" className="mb-2 block">
                      Tempo de Lembrete
                    </Label>
                    <Select value={settings.reminderTime} onValueChange={(value) => handleSelectChange('reminderTime', value)}>
                      <SelectTrigger id="reminderTime">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hora antes</SelectItem>
                        <SelectItem value="24h">24 horas antes</SelectItem>
                        <SelectItem value="48h">48 horas antes</SelectItem>
                        <SelectItem value="1w">1 semana antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="frequency" className="mb-2 block">
                      Frequência
                    </Label>
                    <Select value={settings.frequency} onValueChange={(value) => handleSelectChange('frequency', value)}>
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Imediata</SelectItem>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <CardTitle>Horas Silenciosas</CardTitle>
            </div>
            <CardDescription>Não receba notificações durante esses horários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="quietHoursEnabled" className="cursor-pointer">
                Ativar horas silenciosas
              </Label>
              <Switch
                id="quietHoursEnabled"
                checked={settings.quietHoursEnabled}
                onCheckedChange={() => handleToggle('quietHoursEnabled')}
              />
            </div>

            {settings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 pl-3 border-l-2 border-purple-200">
                <div>
                  <Label htmlFor="quietHoursStart" className="mb-2 block">
                    Início
                  </Label>
                  <input
                    id="quietHoursStart"
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => handleSelectChange('quietHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="quietHoursEnd" className="mb-2 block">
                    Fim
                  </Label>
                  <input
                    id="quietHoursEnd"
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => handleSelectChange('quietHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alternative Channels */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <CardTitle>Canais Alternativos</CardTitle>
            </div>
            <CardDescription>Receba notificações através de outros canais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="whatsappNotifications" className="cursor-pointer">
                Notificações via WhatsApp
              </Label>
              <Switch
                id="whatsappNotifications"
                checked={settings.whatsappNotifications}
                onCheckedChange={() => handleToggle('whatsappNotifications')}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <Label htmlFor="telegramNotifications" className="cursor-pointer">
                Notificações via Telegram
              </Label>
              <Switch
                id="telegramNotifications"
                checked={settings.telegramNotifications}
                onCheckedChange={() => handleToggle('telegramNotifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
          <Button variant="outline">
            Restaurar Padrões
          </Button>
        </div>
      </div>
    </div>
  );
}
