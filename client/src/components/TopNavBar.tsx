import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  isDanger?: boolean;
}

interface NavMenu {
  label: string;
  icon: string;
  items: NavItem[];
}

const navigationData: Record<string, NavMenu> = {
  celebracao: {
    label: "Celebração",
    icon: "🙏",
    items: [
      { label: "Agenda de Celebrações", href: "/celebracoes" },
      { label: "Leituras Litúrgicas", href: "/leituras" },
      { label: "Sugestões de Canto", href: "/sugestoes" },
      { label: "Planejamento de Missa", href: "/celebracoes" },
      { label: "Ensaios", href: "/rehearsal-schedule" },
      { label: "Playlists de Ensaio", href: "/playlist-manager" },
    ],
  },
  musica: {
    label: "Música",
    icon: "🎵",
    items: [
      { label: "Biblioteca Musical", href: "/catalogo" },
      { label: "Repertórios", href: "/catalogo-dinamico" },
      { label: "Ministérios", href: "/ministries" },
      { label: "Áudios e Guias", href: "/priest-audio" },
      { label: "Músicas", href: "/spotify" },
    ],
  },
  igreja: {
    label: "Igreja",
    icon: "⛪",
    items: [
      { label: "Perfil da Igreja", href: "/church-profile" },
      { label: "Paróquias e Comunidades", href: "/city-churches" },
      { label: "Mapa de Igrejas", href: "/churches-map" },
      { label: "Equipes", href: "/equipes" },
    ],
  },
  comunicacao: {
    label: "Comunicação",
    icon: "💬",
    items: [
      { label: "Mensagem Pastoral", href: "/espaco-padres", highlight: true },
      { label: "Notícias", href: "/noticias" },
      { label: "Blog", href: "/catholic-blog" },
      { label: "Comunidade", href: "/comunidade" },
      { label: "Calendário Litúrgico", href: "/saints-calendar" },
    ],
  },
  gestao: {
    label: "Gestão",
    icon: "⚙️",
    items: [
      { label: "Configurações", href: "/admin" },
      { label: "Administração", href: "/admin" },
      { label: "Exportações", href: "/exportacao" },
      { label: "Usuários", href: "/admin" },
      { label: "Sair", href: "/api/auth/logout", isDanger: true },
    ],
  },
};

export function TopNavBar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-2xl">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028465326/SQHJGPFJeGtHi4ZtSV5v4R/celebra-logo-bold-Bh6CNhLnzZ2xzfAEpisQyP.webp" alt="CELEBRA Logo" className="h-16 w-auto" />
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {Object.entries(navigationData).map(([key, menu]) => (
              <div key={key} className="relative group">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="px-4 py-2 text-white text-sm font-medium flex items-center gap-1 hover:bg-white/10 rounded-lg transition-all duration-200 group-hover:bg-white/10"
                >
                  <span>{menu.icon}</span>
                  <span>{menu.label}</span>
                  <ChevronDown
                    size={16}
                    className="group-hover:rotate-180 transition-transform duration-200"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  {menu.items.map((item, idx) => (
                    <Link key={idx} href={item.href}>
                      <a
                        className={`block px-4 py-2 text-sm transition-colors ${
                          item.highlight
                            ? "text-orange-600 font-semibold bg-orange-50 hover:bg-orange-100"
                            : item.isDanger
                            ? "text-red-600 hover:bg-red-50"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline text-white text-sm font-medium">
                  {user.name || "Usuário"}
                </span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {Object.entries(navigationData).map(([key, menu]) => (
              <div key={key}>
                <button
                  onClick={() => toggleDropdown(key)}
                  className="w-full text-left px-4 py-2 text-white font-medium flex items-center justify-between hover:bg-white/10 rounded-lg transition"
                >
                  <span className="flex items-center gap-2">
                    <span>{menu.icon}</span>
                    <span>{menu.label}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      openDropdown === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile Dropdown */}
                {openDropdown === key && (
                  <div className="pl-4 space-y-1 mt-1">
                    {menu.items.map((item, idx) => (
                      <Link key={idx} href={item.href}>
                        <a
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                            item.highlight
                              ? "text-orange-300 font-semibold bg-orange-900/30"
                              : item.isDanger
                              ? "text-red-300 hover:bg-red-900/30"
                              : "text-gray-200 hover:bg-white/10"
                          }`}
                        >
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
