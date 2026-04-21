import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Music, ListMusic, Users, Clock, Search } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to app if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/catalogo");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-purple-900 mb-2">Celebra</h1>
        <p className="text-xl text-gray-600 mb-12">Gestão Musical Litúrgica</p>
        
        {!isAuthenticated ? (
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="bg-purple-600 hover:bg-blue-100 w-full"
          >
            Entrar
          </Button>
        ) : (
          <div className="space-y-3">
            <Button 
              onClick={() => setLocation("/catalogo")}
              size="lg"
              className="w-full bg-purple-600 hover:bg-blue-100"
            >
              <Music className="mr-2" size={20} />
              Catálogo Musical
            </Button>
            <Button 
              onClick={() => setLocation("/celebracoes")}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <ListMusic className="mr-2" size={20} />
              Minhas Celebrações
            </Button>
            <Button 
              onClick={() => setLocation("/ministerio")}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <Users className="mr-2" size={20} />
              Perfil do Ministério
            </Button>
            <Button 
              onClick={() => setLocation("/historico")}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <Clock className="mr-2" size={20} />
              Histórico de Celebrações
            </Button>
            <Button 
              onClick={() => setLocation("/spotify-search")}
              size="lg"
              variant="outline"
              className="w-full bg-green-50 hover:bg-green-100 border-green-200"
            >
              <Search className="mr-2" size={20} />
              Buscar no Spotify
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
