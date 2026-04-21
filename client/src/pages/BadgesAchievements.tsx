import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Heart, Music, Users, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'first-celebration',
    name: 'Primeira Celebração',
    description: 'Participe de sua primeira celebração',
    icon: <Trophy className="w-8 h-8" />,
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedDate: '2025-01-15',
    rarity: 'common',
  },
  {
    id: 'celebration-streak-7',
    name: 'Semana de Fé',
    description: 'Participe de 7 celebrações consecutivas',
    icon: <Star className="w-8 h-8" />,
    progress: 5,
    target: 7,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'celebration-streak-30',
    name: 'Mês de Devoção',
    description: 'Participe de 30 celebrações em um mês',
    icon: <Heart className="w-8 h-8" />,
    progress: 18,
    target: 30,
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'music-lover',
    name: 'Amante de Música',
    description: 'Adicione 50 músicas aos favoritos',
    icon: <Music className="w-8 h-8" />,
    progress: 42,
    target: 50,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'community-builder',
    name: 'Construtor de Comunidade',
    description: 'Convide 5 amigos para a comunidade',
    icon: <Users className="w-8 h-8" />,
    progress: 2,
    target: 5,
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'spiritual-warrior',
    name: 'Guerreiro Espiritual',
    description: 'Participe de 100 celebrações',
    icon: <Zap className="w-8 h-8" />,
    progress: 47,
    target: 100,
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'playlist-master',
    name: 'Mestre de Playlists',
    description: 'Crie 10 playlists personalizadas',
    icon: <Music className="w-8 h-8" />,
    progress: 7,
    target: 10,
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Participe de 5 celebrações antes das 7 da manhã',
    icon: <Star className="w-8 h-8" />,
    progress: 3,
    target: 5,
    unlocked: false,
    rarity: 'common',
  },
];

const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-900 border-gray-300',
    rare: 'bg-blue-100 text-blue-900 border-blue-300',
    epic: 'bg-purple-100 text-purple-900 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  };
  return colors[rarity] || colors.common;
};

const getRarityBadgeColor = (rarity: string) => {
  const colors: Record<string, string> = {
    common: 'bg-gray-200 text-gray-800',
    rare: 'bg-blue-200 text-blue-800',
    epic: 'bg-purple-200 text-purple-800',
    legendary: 'bg-yellow-200 text-yellow-800',
  };
  return colors[rarity] || colors.common;
};

export function BadgesAchievements() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? 10 : 0), 0);

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Badges e Achievements</h1>
          <p className="text-slate-600">Desbloqueie conquistas e ganhe pontos participando da comunidade CELEBRA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Achievements Desbloqueados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">{unlockedCount}</p>
                <p className="text-sm text-slate-600">de {achievements.length}</p>
              </div>
              <Progress value={(unlockedCount / achievements.length) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pontos Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalPoints}</p>
              <p className="text-sm text-slate-600 mt-1">Pontos acumulados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Próximo Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-slate-900">Semana de Fé</p>
              <p className="text-sm text-slate-600 mt-1">5 de 7 celebrações</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600'
            }`}
          >
            Todos ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unlocked'
                ? 'bg-green-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200 hover:border-green-600'
            }`}
          >
            Desbloqueados ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'locked'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-slate-900 border border-slate-200 hover:border-gray-600'
            }`}
          >
            Bloqueados ({achievements.length - unlockedCount})
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`transition-all ${
                achievement.unlocked
                  ? 'border-2 border-green-300 bg-green-50'
                  : 'border border-slate-200 opacity-75'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg ${
                        achievement.unlocked
                          ? 'bg-green-200 text-green-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{achievement.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {achievement.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getRarityBadgeColor(achievement.rarity)}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {achievement.unlocked ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-900 mb-2">✓ Desbloqueado</p>
                    <p className="text-xs text-slate-600">
                      {achievement.unlockedDate && new Date(achievement.unlockedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">Progresso</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <Progress
                      value={(achievement.progress / achievement.target) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rarity Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Raridade dos Achievements</CardTitle>
            <CardDescription>Entenda os níveis de dificuldade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['common', 'rare', 'epic', 'legendary'].map(rarity => (
                <div key={rarity} className={`p-4 rounded-lg ${getRarityColor(rarity)}`}>
                  <p className="font-semibold capitalize mb-1">{rarity}</p>
                  <p className="text-sm">
                    {rarity === 'common' && 'Fácil de desbloquear'}
                    {rarity === 'rare' && 'Requer esforço moderado'}
                    {rarity === 'epic' && 'Desafio significativo'}
                    {rarity === 'legendary' && 'Extremamente difícil'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
