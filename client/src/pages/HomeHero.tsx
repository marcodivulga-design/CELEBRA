import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Users, BookOpen, Heart, Mic2, MessageSquare } from "lucide-react";

const SECTORS = [
  {
    id: "musica",
    icon: Music,
    label: "Música",
    title: "Catálogo Musical",
    description: "Acesso a 1.658+ músicas litúrgicas do Hinário Digital, Spotify e YouTube. Busca avançada, arranjos profissionais e sincronização com suas celebrações.",
    color: "from-amber-400 to-amber-600"
  },
  {
    id: "comunidade",
    icon: Users,
    label: "Comunidade",
    title: "Fórum & Grupos",
    description: "Conecte-se com outros músicos litúrgicos. Participe de fóruns de discussão, grupos de oração online e compartilhe experiências de fé.",
    color: "from-rose-400 to-rose-600"
  },
  {
    id: "educacao",
    icon: BookOpen,
    label: "Educação",
    title: "Aprendizado",
    description: "Catecismo interativo, liturgia das horas, reflexões diárias e cursos de canto litúrgico. Desenvolva sua fé e conhecimento.",
    color: "from-green-400 to-green-600"
  },
  {
    id: "fe",
    icon: Heart,
    label: "Fé",
    title: "Exercício Espiritual",
    description: "Rosário digital, desafios espirituais de 7/14/30 dias, meditações guiadas e mentorado espiritual com padres e mentores.",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "ministerio",
    icon: Mic2,
    label: "Ministério",
    title: "Gestão",
    description: "Organize seus ministérios, equipes de canto, ensaios, celebrações e gere relatórios de atividades.",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "noticias",
    icon: MessageSquare,
    label: "Notícias",
    title: "Informação",
    description: "Notícias católicas curadas, atualizações do Vaticano, eventos diocesanos e conteúdo relevante para sua comunidade.",
    color: "from-cyan-400 to-cyan-600"
  }
];

export default function HomeHero() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-sky-50">
        <div className="animate-spin">
          <Music className="w-12 h-12 text-sky-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO - Apenas a imagem do céu */}
      <div
        className="h-96 md:h-screen w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310419663028465326/SQHJGPFJeGtHi4ZtSV5v4R/25F756E3-A48C-440E-9042-380F871EEC17_8a415110.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* SANDUÍCHE - Diretório */}
      <div className="flex-1 flex flex-col">
        {/* TOPO - Navegação de Setores */}
        <div className="bg-white border-b-2 border-sky-200 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-sky-900 mb-3 font-playfair">CELEBRA</h1>
            <div className="flex flex-wrap gap-2 justify-start md:justify-center">
              {SECTORS.map((sector) => {
                const Icon = sector.icon;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm md:text-base transition-all transform hover:scale-105 flex items-center gap-2 ${
                      selectedSector.id === sector.id
                        ? `bg-gradient-to-r ${sector.color} text-white shadow-lg`
                        : "bg-sky-100 text-sky-900 hover:bg-sky-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{sector.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MEIO - Conteúdo do Setor */}
        <div className="flex-1 bg-gradient-to-b from-sky-50 to-white px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-l-4 border-sky-400">
              <div className="flex items-center gap-3 mb-4">
                {selectedSector.icon && (
                  <selectedSector.icon className="w-8 h-8 text-sky-600" />
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-sky-900 font-playfair">
                  {selectedSector.title}
                </h2>
              </div>
              <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
                {selectedSector.description}
              </p>
              {!isAuthenticated ? (
                <Button
                  onClick={() => window.location.href = `${window.location.origin}/auth/login`}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg"
                >
                  Começar Agora
                </Button>
              ) : (
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg"
                >
                  Ir para Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* FUNDO - Recursos */}
        <div className="bg-gradient-to-b from-white to-sky-50 px-4 py-8 border-t border-sky-100">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-sky-900 mb-6 font-playfair">
              Por que escolher CELEBRA?
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Integração Completa",
                  description: "Música, comunidade, educação e gestão em um único lugar"
                },
                {
                  title: "Fé Prática",
                  description: "Exercícios espirituais, rosário digital e desafios de fé"
                },
                {
                  title: "Comunidade Engajada",
                  description: "Fórum, grupos de oração e mentorado espiritual"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 md:p-6 border border-sky-200 hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-bold text-sky-900 mb-2 font-playfair">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center py-4 border-t border-sky-200 mt-8">
              <p className="text-gray-600 text-sm">
                © 2026 CELEBRA - Gestão Musical Litúrgica | Feito com ❤️ para a comunidade católica
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
