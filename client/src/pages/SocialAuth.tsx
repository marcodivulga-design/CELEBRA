import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Music, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"google" | "facebook" | null>(null);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthMethod("google");
    try {
      // Simular autenticação Google
      // Em produção, usar: google-auth-library ou similar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Autenticado com Google!");
      // Redirecionar ou atualizar estado
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao autenticar com Google");
    } finally {
      setIsLoading(false);
      setAuthMethod(null);
    }
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    setAuthMethod("facebook");
    try {
      // Simular autenticação Facebook
      // Em produção, usar: facebook-sdk ou similar
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Autenticado com Facebook!");
      // Redirecionar ou atualizar estado
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao autenticar com Facebook");
    } finally {
      setIsLoading(false);
      setAuthMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">CELEBRA</h1>
          </div>
          <p className="text-slate-600">Plataforma de Músicas Litúrgicas</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo!</h2>
          <p className="text-slate-600 mb-6">
            Faça login para acessar nosso catálogo de músicas
          </p>

          {/* Google Login */}
          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full mb-4 bg-white hover:bg-gray-50 text-slate-900 border border-slate-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading && authMethod === "google" ? "Autenticando..." : "Continuar com Google"}
          </Button>

          {/* Facebook Login */}
          <Button
            onClick={handleFacebookAuth}
            disabled={isLoading}
            className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {isLoading && authMethod === "facebook" ? "Autenticando..." : "Continuar com Facebook"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">ou</span>
            </div>
          </div>

          {/* Manus Auth */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            Continuar com Manus
          </Button>
        </Card>

        {/* Info Box */}
        <Alert className="mt-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Primeira vez aqui?</strong> Crie uma conta gratuitamente usando qualquer
            um dos métodos acima.
          </AlertDescription>
        </Alert>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">860+ Músicas</p>
              <p className="text-sm text-slate-600">Catálogo completo</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Recomendações</p>
              <p className="text-sm text-slate-600">Personalizadas por IA</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Player</p>
              <p className="text-sm text-slate-600">Reprodução integrada</p>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Favoritos</p>
              <p className="text-sm text-slate-600">Suas músicas salvas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
