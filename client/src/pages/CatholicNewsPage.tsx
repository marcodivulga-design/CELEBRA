import { useState } from "react";
import { MessageSquare, Share2, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Papa Francisco convida fiéis a refletirem sobre a misericórdia",
    category: "Vaticano",
    date: new Date(),
    image: "https://via.placeholder.com/400x300?text=Papa+Francisco",
    excerpt: "Em sua homilia de hoje, o Papa Francisco enfatizou a importância da misericórdia no mundo moderno...",
    content: "Em sua homilia de hoje, o Papa Francisco enfatizou a importância da misericórdia no mundo moderno, convidando todos os fiéis a refletirem sobre como podem viver esse valor em suas vidas cotidianas.",
    source: "Vatican News"
  },
  {
    id: 2,
    title: "Diocese celebra 50 anos de fundação com missa solene",
    category: "Dioceses",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    image: "https://via.placeholder.com/400x300?text=Diocese",
    excerpt: "A Diocese de São Paulo celebrou 50 anos de sua fundação com uma missa solene presidida pelo arcebispo...",
    content: "A Diocese de São Paulo celebrou 50 anos de sua fundação com uma missa solene presidida pelo arcebispo, contando com a presença de padres, religiosos e fiéis de toda a região.",
    source: "Aleteia"
  },
  {
    id: 3,
    title: "Novo documento da CNBB sobre evangelização digital",
    category: "CNBB",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    image: "https://via.placeholder.com/400x300?text=CNBB",
    excerpt: "A Conferência Nacional dos Bispos do Brasil lançou um novo documento orientando sobre a evangelização...",
    content: "A Conferência Nacional dos Bispos do Brasil lançou um novo documento orientando sobre a evangelização através dos meios digitais, reconhecendo a importância da presença católica nas redes sociais.",
    source: "CNBB"
  }
];

export default function CatholicNewsPage() {
  const [selectedNews, setSelectedNews] = useState<typeof NEWS_ITEMS[0] | null>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (news: typeof NEWS_ITEMS[0]) => {
    if (navigator.share) {
      navigator.share({ title: news.title, text: news.excerpt });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2 font-playfair">
            Notícias Católicas
          </h1>
          <p className="text-gray-600">
            Fique atualizado com as principais notícias da Igreja Católica
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* News List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {NEWS_ITEMS.map((news) => (
                <div
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer border border-sky-200"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-sky-200 rounded-lg overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {news.date.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="font-bold text-sky-900 mb-1 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Fonte: {news.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedNews ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-sky-400 sticky top-4">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold text-sky-900 mb-2 font-playfair">
                  {selectedNews.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedNews.date.toLocaleDateString("pt-BR")}
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {selectedNews.content}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Fonte: {selectedNews.source}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleLike(selectedNews.id)}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      liked[selectedNews.id]
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked[selectedNews.id] ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    onClick={() => handleShare(selectedNews)}
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-sky-50 rounded-2xl p-6 border-2 border-dashed border-sky-300 text-center">
                <MessageSquare className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Selecione uma notícia para ler os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
