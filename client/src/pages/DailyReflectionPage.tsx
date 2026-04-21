import { useState, useEffect } from "react";
import { Heart, BookOpen, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DailyReflectionPage() {
  const [reflection, setReflection] = useState({
    title: "Reflexão do Dia",
    verse: "João 3:16",
    content: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reflection: "Hoje somos convidados a refletir sobre o amor infinito de Deus. Cada dia é uma oportunidade de reconhecer esse amor em nossas vidas e compartilhá-lo com aqueles ao nosso redor.",
    prayer: "Senhor, ajude-nos a compreender a profundidade do seu amor. Que possamos viver cada dia com gratidão e compartilhar essa graça com todos ao nosso redor. Amém.",
    author: "Comunidade CELEBRA"
  });

  const [liturgicalInfo, setLiturgicalInfo] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Simular obtenção de informações litúrgicas
    // const info = LiturgicalCalendarService.getLiturgicalInfo();
    // setLiturgicalInfo(info);
  }, []);

  const handleShare = () => {
    const text = `${reflection.title}\n\n${reflection.verse}\n\n${reflection.content}`;
    if (navigator.share) {
      navigator.share({ title: reflection.title, text });
    } else {
      alert("Compartilhamento não suportado neste navegador");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `${reflection.title}\n\n${reflection.verse}\n\n${reflection.content}\n\n${reflection.reflection}\n\n${reflection.prayer}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `reflexao-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2 font-playfair">
            Reflexão do Dia
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-l-4 border-sky-400">
          {/* Verse */}
          <div className="mb-6 pb-6 border-b border-sky-200">
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-2">
              Versículo do Dia
            </p>
            <p className="text-2xl font-bold text-sky-900 mb-3 font-playfair">
              {reflection.verse}
            </p>
            <p className="text-lg text-gray-700 italic leading-relaxed">
              "{reflection.content}"
            </p>
          </div>

          {/* Reflection */}
          <div className="mb-6 pb-6 border-b border-sky-200">
            <h2 className="text-xl font-bold text-sky-900 mb-3 flex items-center gap-2 font-playfair">
              <BookOpen className="w-5 h-5 text-sky-600" />
              Reflexão
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {reflection.reflection}
            </p>
          </div>

          {/* Prayer */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-sky-900 mb-3 font-playfair">
              Oração
            </h2>
            <p className="text-gray-700 leading-relaxed italic bg-sky-50 p-4 rounded-lg border-l-4 border-sky-400">
              {reflection.prayer}
            </p>
          </div>

          {/* Author */}
          <p className="text-sm text-gray-500 text-right">
            — {reflection.author}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 ${
              liked
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            {liked ? "Salvo" : "Salvar"}
          </Button>

          <Button
            onClick={handleShare}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </Button>

          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          >
            <Download className="w-5 h-5" />
            Baixar
          </Button>
        </div>

        {/* Related Reflections */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-sky-900 mb-4 font-playfair">
            Reflexões Anteriores
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border border-sky-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <p className="text-sm text-sky-600 font-semibold mb-1">
                  {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                </p>
                <p className="font-semibold text-sky-900 mb-2">
                  Reflexão anterior {i}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
