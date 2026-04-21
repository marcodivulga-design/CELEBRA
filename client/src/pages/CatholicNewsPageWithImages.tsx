import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, MessageCircle, Search } from "lucide-react";

const COMMUNITY_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-community-celebration.png";
const CATHEDRAL_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-light-cathedral.png";
const NATURE_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-nature-spirituality.png";

const news = [
  {
    id: 1,
    title: "Papa Francisco Convida à Oração Pela Paz",
    category: "Vaticano",
    date: "Hoje",
    excerpt: "Sua Santidade Papa Francisco convida os fiéis a rezarem pela paz no mundo durante esta semana de oração especial.",
    image: CATHEDRAL_IMAGE,
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    title: "Celebração de Pentecostes em Igrejas Brasileiras",
    category: "Brasil",
    date: "Ontem",
    excerpt: "Comunidades católicas em todo o Brasil celebram o Pentecostes com missas solenes e procissões.",
    image: COMMUNITY_IMAGE,
    likes: 456,
    comments: 78,
  },
  {
    id: 3,
    title: "Novo Hinário Católico Lançado",
    category: "Música",
    date: "2 dias atrás",
    excerpt: "A CNBB lança novo hinário com 200 músicas litúrgicas modernas e tradicionais.",
    image: NATURE_IMAGE,
    likes: 189,
    comments: 32,
  },
];

export default function CatholicNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Todos", "Vaticano", "Brasil", "Música", "Liturgia", "Comunidade"];

  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={CATHEDRAL_IMAGE}
          alt="Notícias Católicas"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
          <div className="w-full p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Notícias Católicas</h1>
            <p className="text-blue-100">Fique atualizado com as últimas notícias da Igreja</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex gap-2 bg-white/80 rounded-lg p-3 backdrop-blur">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white/80 text-blue-600 border-blue-200"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden bg-white/80 backdrop-blur hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image */}
                <div className="relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.excerpt}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-600 hover:text-red-600"
                    >
                      <Heart className="h-4 w-4" />
                      {item.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-600 hover:text-blue-600"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {item.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-600 hover:text-green-600"
                    >
                      <Share2 className="h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
