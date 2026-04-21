import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Zap, Users, TrendingUp, Check } from 'lucide-react';

interface DonationPlan {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'annual';
  benefits: string[];
  icon: React.ReactNode;
  color: string;
  popular: boolean;
}

const donationPlans: DonationPlan[] = [
  {
    id: '1',
    name: 'Apoiador',
    amount: 29.90,
    frequency: 'monthly',
    benefits: [
      'Acesso a todas as funcionalidades básicas',
      'Suporte por email',
      'Relatórios mensais',
      'Comunidade exclusiva',
    ],
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-red-100 text-red-900',
    popular: false,
  },
  {
    id: '2',
    name: 'Benfeitor',
    amount: 99.90,
    frequency: 'monthly',
    benefits: [
      'Tudo do plano Apoiador',
      'Acesso a conteúdo premium',
      'Análises avançadas',
      'Suporte prioritário por chat',
      'Relatórios personalizados',
      'Badge de Benfeitor na comunidade',
    ],
    icon: <Star className="w-8 h-8" />,
    color: 'bg-yellow-100 text-yellow-900',
    popular: true,
  },
  {
    id: '3',
    name: 'Patrono',
    amount: 299.90,
    frequency: 'monthly',
    benefits: [
      'Tudo do plano Benfeitor',
      'Consultoria estratégica mensal',
      'Integração com sistemas externos',
      'Suporte telefônico 24/7',
      'Relatórios executivos',
      'Badge de Patrono na comunidade',
      'Reconhecimento no site',
    ],
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-purple-100 text-purple-900',
    popular: false,
  },
];

interface DonorStats {
  totalDonors: number;
  monthlyRecurring: number;
  annualRecurring: number;
  totalMonthlyRevenue: number;
  growthRate: number;
}

const donorStats: DonorStats = {
  totalDonors: 342,
  monthlyRecurring: 287,
  annualRecurring: 55,
  totalMonthlyRevenue: 28450.30,
  growthRate: 12.5,
};

export function RecurringDonations() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<'monthly' | 'annual'>('monthly');

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.9; // 10% discount for annual
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Doações Recorrentes</h1>
          <p className="text-slate-600">Apoie a missão de CELEBRA com doações mensais ou anuais</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Doadores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{donorStats.totalDonors}</p>
              <p className="text-sm text-slate-600 mt-1">Doadores ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Doações Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{donorStats.monthlyRecurring}</p>
              <p className="text-sm text-slate-600 mt-1">Recorrentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                R$ {donorStats.totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-600 mt-1">Faturamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">+{donorStats.growthRate}%</p>
              <p className="text-sm text-slate-600 mt-1">Mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Frequency Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setFrequency('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              frequency === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setFrequency('annual')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              frequency === 'annual'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200'
            }`}
          >
            Anual (10% desconto)
          </button>
        </div>

        {/* Donation Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {donationPlans.map(plan => (
            <Card
              key={plan.id}
              className={`transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-blue-600 shadow-lg'
                  : 'hover:shadow-lg'
              } ${plan.popular ? 'md:scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm font-semibold">
                  ⭐ Mais Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg ${plan.color}`}>
                    {plan.icon}
                  </div>
                  {plan.popular && <Badge className="bg-blue-600">Recomendado</Badge>}
                </div>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-slate-900">
                    R$ {frequency === 'monthly' ? plan.amount.toFixed(2) : getAnnualPrice(plan.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    por {frequency === 'monthly' ? 'mês' : 'ano'}
                  </p>
                </div>

                <div className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}
                >
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Donor Stories */}
        <Card>
          <CardHeader>
            <CardTitle>Histórias de Doadores</CardTitle>
            <CardDescription>Conheça quem está ajudando CELEBRA a crescer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="font-semibold text-slate-900">Padre João Silva</p>
                <p className="text-sm text-slate-600 mb-2">Benfeitor desde Janeiro/2025</p>
                <p className="text-slate-700">
                  "CELEBRA transformou a forma como organizamos nossas celebrações. Com as análises avançadas, conseguimos aumentar a participação em 40%."
                </p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4">
                <p className="font-semibold text-slate-900">Comunidade São Francisco</p>
                <p className="text-sm text-slate-600 mb-2">Patrono desde Março/2025</p>
                <p className="text-slate-700">
                  "O suporte prioritário e consultoria estratégica foram essenciais para implementar CELEBRA em toda a diocese. Recomendamos para todos!"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900 mb-2">Posso cancelar minha doação a qualquer momento?</p>
              <p className="text-slate-700">Sim! Você pode cancelar sua doação recorrente a qualquer momento sem penalidades.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-2">Quais são os métodos de pagamento aceitos?</p>
              <p className="text-slate-700">Aceitamos cartão de crédito, PIX e transferência bancária para doações recorrentes.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-2">Recebo recibos das minhas doações?</p>
              <p className="text-slate-700">Sim! Você recebe recibos mensais por email e pode acessar seu histórico de doações no seu perfil.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-2">Posso mudar de plano?</p>
              <p className="text-slate-700">Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
