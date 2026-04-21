import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Menu,
  X,
  Home,
  Music,
  BookOpen,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  MessageCircle,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export function PremiumLayout({ children }: PremiumLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Celebrações",
      icon: Zap,
      path: "/celebracoes",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Catálogo Musical",
      icon: Music,
      path: "/catalogo",
      color: "from-pink-500 to-pink-600",
    },
    {
      label: "Leituras",
      icon: BookOpen,
      path: "/leituras",
      color: "from-green-500 to-green-600",
    },
    {
      label: "Equipes",
      icon: Users,
      path: "/equipes",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Comunidade",
      icon: MessageCircle,
      path: "/comunidade",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Notícias",
      icon: FileText,
      path: "/noticias",
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Áudio do Padre",
      icon: Music,
      path: "/priest-audio",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Blog Católico",
      icon: BookOpen,
      path: "/catholic-blog",
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Calendário de Santos",
      icon: BookOpen,
      path: "/saints-calendar",
      color: "from-red-500 to-red-600",
    },
    {
      label: "Chat de Repertório",
      icon: MessageCircle,
      path: "/chat",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Sugestões de Músicas",
      icon: Music,
      path: "/sugestoes",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Espaço de Padres",
      icon: BookOpen,
      path: "/espaco-padres",
      color: "from-rose-500 to-rose-600",
    },
    {
      label: "Exportação",
      icon: FileText,
      path: "/exportacao",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Perfil da Igreja",
      icon: Users,
      path: "/church-profile",
      color: "from-red-500 to-red-600",
    },
    {
      label: "Hierarquia de Igrejas",
      icon: Building2,
      path: "/church-hierarchy",
      color: "from-rose-500 to-rose-600",
    },
    {
      label: "Igrejas por Cidade",
      icon: MapPin,
      path: "/city-churches",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Mapa de Igrejas",
      icon: MapPin,
      path: "/churches-map",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Ministérios",
      icon: Music,
      path: "/ministries",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Agendamento de Ensaios",
      icon: Calendar,
      path: "/rehearsal-schedule",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Playlists de Ensaios",
      icon: Music,
      path: "/playlist-manager",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-sky-100 to-blue-50 border-r border-sky-300 transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-sky-300">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028465326/SQHJGPFJeGtHi4ZtSV5v4R/celebra-logo-final-m3aw9FYjmxE84zbpgcPwPP.webp" alt="CELEBRA" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold text-sky-900">CELEBRA</h1>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sky-600 hover:text-sky-800 hover:bg-blue-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : "text-sky-700 hover:text-sky-900 hover:bg-blue-100"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sky-300 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-blue-100 transition-all duration-200">
            <Settings size={20} className="flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">Configurações</span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sky-600 hover:text-red-600 hover:bg-red-100 transition-all duration-200">
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50">
          {children}
        </div>
      </main>
    </div>
  );
}
