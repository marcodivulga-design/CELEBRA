import { useState } from "react";
import { Trophy, Star, Award, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const USER_STATS = {
  points: 2450,
  level: 12,
  streak: 15,
  badges: [
    { id: 1, name: "Primeira Reflexão", icon: "🙏", earned: true },
    { id: 2, name: "Semana Completa", icon: "📅", earned: true },
    { id: 3, name: "Mês Perfeito", icon: "🏆", earned: false },
    { id: 4, name: "Mestre do Fórum", icon: "💬", earned: true },
    { id: 5, name: "Rosário Completo", icon: "📿", earned: true },
    { id: 6, name: "Evangelizador", icon: "✝️", earned: false }
  ]
};

const LEADERBOARD = [
  { rank: 1, name: "Pe. João", points: 5200, level: 18 },
  { rank: 2, name: "Maria Silva", points: 4800, level: 17 },
  { rank: 3, name: "Carlos Santos", points: 4200, level: 16 },
  { rank: 4, name: "Ana Costa", points: 3900, level: 15 },
  { rank: 5, name: "Você", points: 2450, level: 12, isYou: true }
];

const CHALLENGES = [
  {
    id: 1,
    title: "Desafio de 7 Dias",
    description: "Faça uma reflexão diária por 7 dias",
    progress: 5,
    total: 7,
    reward: 100,
    icon: "📖"
  },
  {
    id: 2,
    title: "Rosário Completo",
    description: "Reze o rosário completo",
    progress: 1,
    total: 1,
    reward: 150,
    icon: "📿"
  },
  {
    id: 3,
    title: "Participação no Fórum",
    description: "Responda 10 tópicos no fórum",
    progress: 7,
    total: 10,
    reward: 75,
    icon: "💬"
  }
];

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "leaderboard" | "challenges">("overview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2 font-playfair">
            Seu Progresso Espiritual
          </h1>
          <p className="text-gray-600">
            Acompanhe seu crescimento na fé e ganhe recompensas
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border-l-4 border-purple-400 shadow">
            <p className="text-gray-600 text-sm mb-2">Pontos</p>
            <p className="text-3xl font-bold text-purple-600">{USER_STATS.points}</p>
            <p className="text-xs text-gray-500 mt-2">+150 esta semana</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-400 shadow">
            <p className="text-gray-600 text-sm mb-2">Nível</p>
            <p className="text-3xl font-bold text-blue-600">{USER_STATS.level}</p>
            <p className="text-xs text-gray-500 mt-2">Faltam 450 pontos</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-red-400 shadow">
            <p className="text-gray-600 text-sm mb-2">Sequência</p>
            <p className="text-3xl font-bold text-red-600">{USER_STATS.streak}</p>
            <p className="text-xs text-gray-500 mt-2">dias consecutivos</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-green-400 shadow">
            <p className="text-gray-600 text-sm mb-2">Badges</p>
            <p className="text-3xl font-bold text-green-600">
              {USER_STATS.badges.filter(b => b.earned).length}/{USER_STATS.badges.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">conquistadas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-sky-200 overflow-x-auto">
          {[
            { id: "overview", label: "Visão Geral", icon: "📊" },
            { id: "badges", label: "Badges", icon: "🏅" },
            { id: "leaderboard", label: "Ranking", icon: "🏆" },
            { id: "challenges", label: "Desafios", icon: "🎯" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-sky-600 border-b-2 border-sky-600"
                  : "text-gray-600 hover:text-sky-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Progress Bar */}
              <div className="bg-white rounded-lg p-6 shadow border border-sky-200">
                <h3 className="font-bold text-sky-900 mb-4">Progresso para Nível 13</h3>
                <div className="w-full bg-sky-100 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-4 rounded-full transition-all"
                    style={{ width: "65%" }}
                  />
                </div>
                <p className="text-sm text-gray-600">450 / 700 pontos</p>
              </div>

              {/* Next Rewards */}
              <div className="bg-white rounded-lg p-6 shadow border border-sky-200">
                <h3 className="font-bold text-sky-900 mb-4">Próximas Recompensas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Badge: Mês Perfeito</span>
                    <span className="text-xs text-gray-500">+250 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nível 13</span>
                    <span className="text-xs text-gray-500">+450 pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          {activeTab === "badges" && (
            <div className="grid md:grid-cols-3 gap-4">
              {USER_STATS.badges.map(badge => (
                <div
                  key={badge.id}
                  className={`rounded-lg p-6 text-center transition-all ${
                    badge.earned
                      ? "bg-white border-2 border-yellow-400 shadow"
                      : "bg-gray-100 border-2 border-gray-300 opacity-50"
                  }`}
                >
                  <p className="text-4xl mb-2">{badge.icon}</p>
                  <p className="font-semibold text-sky-900">{badge.name}</p>
                  {badge.earned && (
                    <p className="text-xs text-green-600 mt-2">✓ Conquistada</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-sky-100 border-b border-sky-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-sky-900">Posição</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-sky-900">Nome</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-sky-900">Pontos</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-sky-900">Nível</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-200">
                  {LEADERBOARD.map(user => (
                    <tr
                      key={user.rank}
                      className={user.isYou ? "bg-sky-50" : "hover:bg-gray-50"}
                    >
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-sky-600">
                          {user.rank === 1 && "🥇"}
                          {user.rank === 2 && "🥈"}
                          {user.rank === 3 && "🥉"}
                          {user.rank > 3 && user.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-sky-900">
                        {user.name} {user.isYou && "(Você)"}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {user.points.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-sky-600">
                        Nv. {user.level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Challenges */}
          {activeTab === "challenges" && (
            <div className="space-y-4">
              {CHALLENGES.map(challenge => (
                <div key={challenge.id} className="bg-white rounded-lg p-6 shadow border border-sky-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <p className="text-4xl">{challenge.icon}</p>
                      <div>
                        <h3 className="font-bold text-sky-900">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+{challenge.reward} pts</span>
                  </div>
                  <div className="w-full bg-sky-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {challenge.progress} / {challenge.total}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
