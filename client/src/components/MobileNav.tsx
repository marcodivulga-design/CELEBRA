import { useState } from "react";
import { Menu, X, Home, Music, Users, BookOpen, Zap, MessageCircle, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const MOBILE_MENU_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/celebracoes", label: "Celebrações", icon: Music },
  { href: "/comunidade", label: "Comunidade", icon: Users },
  { href: "/reflexao-diaria", label: "Reflexão Diária", icon: BookOpen },
  { href: "/gamificacao", label: "Gamificação", icon: Zap },
  { href: "/forum", label: "Fórum", icon: MessageCircle },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg z-40 h-16 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/celebra-logo-final.png" alt="CELEBRA" className="w-10 h-10 rounded-full" />
          <span className="font-bold text-lg font-playfair">CELEBRA</span>
        </Link>

        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-sky-500 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-30 transition-all duration-300 max-h-[calc(100vh-64px)] overflow-y-auto ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 space-y-2">
          {MOBILE_MENU_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-sky-100 hover:text-sky-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-gray-200 my-4 pt-4">
            {user ? (
              <>
                <div className="px-4 py-3 mb-2">
                  <p className="text-sm text-gray-600">Conectado como</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full px-4 py-3 rounded-lg bg-sky-600 text-white text-center font-semibold hover:bg-sky-700 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header */}
      <div className="md:hidden h-16" />
    </>
  );
}
