import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  MessageCircle,
  Send,
  Heart,
  Copy,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface SocialShareButtonProps {
  songId: number;
  songTitle: string;
  artist: string;
}

export default function SocialShareButton({
  songId,
  songTitle,
  artist,
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (
    platform: "whatsapp" | "instagram" | "telegram" | "facebook" | "twitter"
  ) => {
    setIsLoading(true);
    try {
      // Gerar link de compartilhamento
      const result = await trpc.socialShare.generateShareLink.mutate({
        songId,
        platform,
      });

      // Registrar compartilhamento
      await trpc.socialShare.trackShare.mutate({
        songId,
        platform,
      });

      // Abrir URL de compartilhamento
      window.open(result.platformUrl, "_blank", "width=600,height=400");

      toast.success(`Compartilhado no ${platform}!`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao compartilhar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const result = await trpc.socialShare.generateShareLink.mutate({
        songId,
        platform: "whatsapp",
      });

      await navigator.clipboard.writeText(result.shareUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-50 min-w-max">
          <div className="space-y-1">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-green-50 rounded transition-colors text-left"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
              ) : (
                <MessageCircle className="w-5 h-5 text-green-600" />
              )}
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare("telegram")}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded transition-colors text-left"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <Send className="w-5 h-5 text-blue-600" />
              )}
              <span className="text-sm font-medium">Telegram</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleShare("instagram")}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-pink-50 rounded transition-colors text-left"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
              ) : (
                <Heart className="w-5 h-5 text-pink-600" />
              )}
              <span className="text-sm font-medium">Instagram</span>
            </button>

            {/* Copiar Link */}
            <button
              onClick={handleCopyLink}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded transition-colors text-left border-t border-slate-200 mt-1 pt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-600" />
              )}
              <span className="text-sm font-medium">Copiar Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
