import { ReactNode } from "react";
import MobileNav from "./MobileNav";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export default function MobileLayout({
  children,
  title,
  showNav = true
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {showNav && <MobileNav />}

      {/* Mobile Container */}
      <div className="md:hidden">
        {title && (
          <div className="sticky top-16 bg-white border-b border-sky-200 px-4 py-3 z-20 md:hidden">
            <h1 className="text-2xl font-bold text-sky-900 font-playfair">
              {title}
            </h1>
          </div>
        )}

        <div className="p-4 pb-20">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sky-200 md:hidden z-40">
          <div className="flex justify-around items-center h-16">
            <a href="/" className="flex flex-col items-center justify-center w-full h-full hover:bg-sky-50">
              <span className="text-2xl">🏠</span>
              <span className="text-xs text-gray-600 mt-1">Home</span>
            </a>
            <a href="/celebracoes" className="flex flex-col items-center justify-center w-full h-full hover:bg-sky-50">
              <span className="text-2xl">🎵</span>
              <span className="text-xs text-gray-600 mt-1">Celebrações</span>
            </a>
            <a href="/reflexao-diaria" className="flex flex-col items-center justify-center w-full h-full hover:bg-sky-50">
              <span className="text-2xl">📖</span>
              <span className="text-xs text-gray-600 mt-1">Reflexão</span>
            </a>
            <a href="/forum" className="flex flex-col items-center justify-center w-full h-full hover:bg-sky-50">
              <span className="text-2xl">💬</span>
              <span className="text-xs text-gray-600 mt-1">Fórum</span>
            </a>
            <a href="/configuracoes" className="flex flex-col items-center justify-center w-full h-full hover:bg-sky-50">
              <span className="text-2xl">⚙️</span>
              <span className="text-xs text-gray-600 mt-1">Mais</span>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop - just show children */}
      <div className="hidden md:block">
        {children}
      </div>
    </div>
  );
}
