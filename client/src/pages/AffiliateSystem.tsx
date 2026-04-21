import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  status: 'active' | 'pending' | 'inactive';
  churchesReferred: number;
  totalCommission: number;
  pendingCommission: number;
  conversionRate: number;
  joinDate: string;
}

interface Commission {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  reason: string;
  date: string;
}

const affiliates: Affiliate[] = [
  {
    id: '1',
    name: 'Padre João Silva',
    email: 'joao@diocese.com',
    referralCode: 'PADRE-JOAO-2025',
    status: 'active',
    churchesReferred: 12,
    totalCommission: 4500.00,
    pendingCommission: 750.00,
    conversionRate: 85,
    joinDate: '2025-01-15',
  },
  {
    id: '2',
    name: 'Irmã Maria Santos',
    email: 'maria@comunidade.com',
    referralCode: 'IRMA-MARIA-2025',
    status: 'active',
    churchesReferred: 8,
    totalCommission: 2800.00,
    pendingCommission: 400.00,
    conversionRate: 72,
    joinDate: '2025-02-01',
  },
  {
    id: '3',
    name: 'Diácono Carlos',
    email: 'carlos@paroquia.com',
    referralCode: 'DIACONO-CARLOS-2025',
    status: 'pending',
    churchesReferred: 3,
    totalCommission: 1050.00,
    pendingCommission: 350.00,
    conversionRate: 60,
    joinDate: '2025-03-10',
  },
];

const commissions: Commission[] = [
  {
    id: '1',
    affiliateId: '1',
    amount: 750.00,
    status: 'pending',
    reason: 'Referência de 3 igrejas - Plano Benfeitor',
    date: '2025-04-10',
  },
  {
    id: '2',
    affiliateId: '1',
    amount: 1200.00,
    status: 'approved',
    reason: 'Referência de 4 igrejas - Plano Patrono',
    date: '2025-03-15',
  },
  {
    id: '3',
    affiliateId: '2',
    amount: 400.00,
    status: 'pending',
    reason: 'Referência de 2 igrejas - Plano Benfeitor',
    date: '2025-04-05',
  },
  {
    id: '4',
    affiliateId: '1',
    amount: 1500.00,
    status: 'paid',
    reason: 'Referência de 5 igrejas - Plano Patrono',
    date: '2025-02-28',
  },
];

export function AffiliateSystem() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(affiliates[0]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalAffiliates = affiliates.length;
  const totalCommissionPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalCommissionPending = commissions
    .filter(c => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalChurchesReferred = affiliates.reduce((sum, a) => sum + a.churchesReferred, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-900';
      case 'pending':
        return 'bg-yellow-100 text-yellow-900';
      case 'inactive':
        return 'bg-slate-100 text-slate-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const getCommissionStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-900';
      case 'approved':
        return 'bg-blue-100 text-blue-900';
      case 'pending':
        return 'bg-yellow-100 text-yellow-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const affiliateCommissions = commissions.filter(c => c.affiliateId === selectedAffiliate?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Sistema de Afiliados</h1>
          <p className="text-slate-600">Programa de referência com comissões para crescimento viral</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Afiliados Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalAffiliates}</p>
              <p className="text-sm text-slate-600 mt-1">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Igrejas Referidas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalChurchesReferred}</p>
              <p className="text-sm text-slate-600 mt-1">Crescimento viral</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Comissões Pagas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                R$ {totalCommissionPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-600 mt-1">Já distribuído</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Comissões Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                R$ {totalCommissionPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-600 mt-1">Aguardando aprovação</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Convidar Afiliado
          </Button>
          <Button variant="outline">
            <Award className="w-4 h-4 mr-2" />
            Ver Leaderboard
          </Button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Convidar Novo Afiliado</CardTitle>
              <CardDescription>Envie um convite para alguém se tornar afiliado CELEBRA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Nome do afiliado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Mensagem Personalizada</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  rows={3}
                  placeholder="Mensagem para o convite"
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">Enviar Convite</Button>
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Affiliates List */}
          <div className="lg:col-span-1 space-y-3">
            {affiliates.map(affiliate => (
              <Card
                key={affiliate.id}
                onClick={() => setSelectedAffiliate(affiliate)}
                className={`cursor-pointer transition-all ${
                  selectedAffiliate?.id === affiliate.id
                    ? 'ring-2 ring-blue-600 bg-blue-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{affiliate.name}</p>
                      <p className="text-xs text-slate-600">{affiliate.email}</p>
                    </div>
                    <Badge className={getStatusColor(affiliate.status)}>
                      {affiliate.status === 'active' ? 'Ativo' : affiliate.status === 'pending' ? 'Pendente' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-900 font-semibold">{affiliate.churchesReferred} igrejas</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Affiliate Details */}
          {selectedAffiliate && (
            <div className="lg:col-span-2 space-y-4">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedAffiliate.name}</CardTitle>
                      <CardDescription>{selectedAffiliate.email}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(selectedAffiliate.status)}>
                      {selectedAffiliate.status === 'active' ? 'Ativo' : 'Pendente'}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Referral Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Código de Referência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg">
                    <code className="flex-1 font-mono text-sm font-semibold text-slate-900">
                      {selectedAffiliate.referralCode}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedAffiliate.referralCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {copiedCode === selectedAffiliate.referralCode && (
                    <p className="text-sm text-green-600 mt-2">✓ Copiado!</p>
                  )}
                </CardContent>
              </Card>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-600 mb-1">Igrejas Referidas</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedAffiliate.churchesReferred}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-600 mb-1">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedAffiliate.conversionRate}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Commissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comissões</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Total Pago</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {selectedAffiliate.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Pendente</p>
                      <p className="text-lg font-bold text-yellow-600">
                        R$ {selectedAffiliate.pendingCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {affiliateCommissions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Histórico de Comissões</p>
                      <div className="space-y-2">
                        {affiliateCommissions.map(commission => (
                          <div key={commission.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <div>
                              <p className="text-sm text-slate-900">{commission.reason}</p>
                              <p className="text-xs text-slate-600">{commission.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-900">
                                R$ {commission.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${getCommissionStatusColor(commission.status)}`}>
                                {commission.status === 'paid' ? 'Pago' : commission.status === 'approved' ? 'Aprovado' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
