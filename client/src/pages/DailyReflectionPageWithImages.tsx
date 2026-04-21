import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, Bookmark } from "lucide-react";

const REFLECTION_HERO_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-praying-church.png";
const ROSARY_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-hands-prayer.png";

export default function DailyReflectionPage() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const reflection = {
    date: new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    verse: "João 3:16",
    verseText: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    title: "O Amor Infinito de Deus",
    reflection: "Hoje refletimos sobre o amor infinito de Deus por nós. Cada dia é uma oportunidade de reconhecer esse amor e responder com gratidão e fidelidade. Que possamos viver este dia conscientes da graça que nos envolve.",
    prayer: "Senhor, ajuda-nos a compreender a profundidade do Teu amor. Que possamos responder com corações abertos e dispostos a servir. Amém.",
    liturgicalSeason: "Tempo Comum",
    liturgicalColor: "Verde",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50">
      {/* Hero Section with Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={REFLECTION_HERO_IMAGE}
          alt="Reflexão Diária"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            {reflection.date}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-blue-900">
            {reflection.title}
          </h1>
          <p className="mt-2 text-lg text-blue-700">
            Tempo Litúrgico: <span className="font-semibold text-green-600">{reflection.liturgicalSeason}</span>
          </p>
        </div>

        {/* Verse Card */}
        <Card className="mb-8 border-l-4 border-green-500 bg-white/80 p-6 backdrop-blur">
          <p className="text-sm font-semibold text-green-600 uppercase">Versículo do Dia</p>
          <p className="mt-2 text-lg font-semibold text-blue-900">{reflection.verse}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            "{reflection.verseText}"
          </p>
        </Card>

        {/* Reflection Card */}
        <Card className="mb-8 bg-white/80 p-6 backdrop-blur">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Reflexão</h2>
          <p className="text-base leading-relaxed text-gray-700">
            {reflection.reflection}
          </p>
        </Card>

        {/* Prayer Card with Image */}
        <Card className="mb-8 overflow-hidden bg-white/80 backdrop-blur">
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={ROSARY_IMAGE}
              alt="Oração"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Oração</h2>
            <p className="text-base leading-relaxed text-gray-700 italic">
              "{reflection.prayer}"
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLiked(!liked)}
            className={`gap-2 ${liked ? "bg-red-50 text-red-600 border-red-300" : ""}`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            {liked ? "Amado" : "Amar"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setBookmarked(!bookmarked)}
            className={`gap-2 ${bookmarked ? "bg-blue-50 text-blue-600 border-blue-300" : ""}`}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
            {bookmarked ? "Salvo" : "Salvar"}
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Share2 className="h-5 w-5" />
            Compartilhar
          </Button>
        </div>

        {/* Suggestions */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Sugestões para Hoje</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✨ Dedique 10 minutos à oração silenciosa</li>
            <li>📖 Leia o evangelho completo do dia</li>
            <li>🙏 Reze o rosário com intenção especial</li>
            <li>💚 Pratique um ato de caridade</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
