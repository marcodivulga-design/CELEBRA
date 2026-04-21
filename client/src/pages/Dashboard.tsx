import React from "react";
import {
  Calendar,
  Music,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Dados fake realistas
  const stats = [
    {
      title: "Próximas Celebrações",
      value: "5",
      subtitle: "Esta semana",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Músicas no Catálogo",
      value: "540",
      subtitle: "Repertório completo",
      icon: Music,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Membros da Equipe",
      value: "12",
      subtitle: "Ministério de música",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Taxa de Conclusão",
      value: "92%",
      subtitle: "Celebrações completas",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
    },
  ];

  const proximasCelebracoes = [
    {
      id: 1,
      titulo: "Missa Dominical",
      data: "14 de Abril, 10:00",
      local: "Igreja Matriz",
      status: "Confirmada",
      musicas: 8,
    },
    {
      id: 2,
      titulo: "Celebração da Palavra",
      data: "15 de Abril, 19:00",
      local: "Capela São José",
      status: "Em preparação",
      musicas: 5,
    },
    {
      id: 3,
      titulo: "Missa Festiva",
      data: "21 de Abril, 18:00",
      local: "Igreja Matriz",
      status: "Planejamento",
      musicas: 0,
    },
  ];

  const musicasMaisUsadas = [
    { titulo: "A Alegria Está no Coração", artista: "Comunidade Católica", usos: 12 },
    { titulo: "Celebrai com Júbilo ao Senhor", artista: "Coral Paroquial", usos: 10 },
    { titulo: "Cantai ao Senhor um Canto Novo", artista: "Grupo Vocal", usos: 9 },
    { titulo: "Santo, Santo, Santo", artista: "Coral Litúrgico", usos: 8 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Bem-vindo ao CELEBRA</h1>
        <p className="text-sky-700">
          Gerencie suas celebrações, músicas e equipes em um só lugar
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50 hover:border-sky-300/50 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-sky-700 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-sky-600 mt-2">{stat.subtitle}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Celebrações */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Próximas Celebrações</h2>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
              Nova Celebração
            </Button>
          </div>

          <div className="space-y-3">
            {proximasCelebracoes.map((celebracao) => (
              <Card
                key={celebracao.id}
                className="bg-gradient-to-r from-blue-100 to-blue-50 border-sky-300/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {celebracao.titulo}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-sky-700">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {celebracao.data}
                      </span>
                      <span>{celebracao.local}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {celebracao.musicas} músicas
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          celebracao.status === "Confirmada"
                            ? "bg-green-500/20 text-green-400"
                            : celebracao.status === "Em preparação"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-slate-500/20 text-sky-700"
                        }`}
                      >
                        {celebracao.status}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                      →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alertas */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-400" />
                Alertas
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">
                    ⚠️ Celebração de 21/04 sem músicas definidas
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    ℹ️ Novo repertório disponível
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Ações Rápidas */}
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
            <div className="p-6 space-y-3">
              <h3 className="font-semibold text-white">Ações Rápidas</h3>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 justify-start">
                <Music size={16} className="mr-2" />
                Buscar Música
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 justify-start">
                <Users size={16} className="mr-2" />
                Escalar Equipe
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 justify-start">
                <CheckCircle size={16} className="mr-2" />
                Exportar Roteiro
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Músicas Mais Usadas */}
      <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-sky-300/50">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Músicas Mais Usadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {musicasMaisUsadas.map((musica, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <Music size={16} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">
                  {musica.titulo}
                </p>
                <p className="text-xs text-sky-700 mt-1">{musica.artista}</p>
                <p className="text-xs text-amber-400 font-semibold mt-2">
                  {musica.usos} usos
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
