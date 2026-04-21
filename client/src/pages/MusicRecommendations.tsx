import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Music,
  Sparkles,
  Play,
  Heart,
  Share2,
  Lightbulb,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Recommendation {
  id?: number;
  title: string;
  artist: string;
  genre?: string;
  reason: string;
}

export default function MusicRecommendations() {
  const [activeTab, setActiveTab] = useState<"personalized" | "genre" | "similar">(
    "personalized"
  );
  const [selectedGenre, setSelectedGenre] = useState("Clássico");
  const [searchArtist, setSearchArtist] = useState("");

  const personalizedQuery = trpc.recommendations.getPersonalized.useQuery(
    { limit: 10, genres: ["Clássico", "Litúrgico"] },
    { enabled: activeTab === "personalized" }
  );

  const genreQuery = trpc.recommendations.getByGenre.useQuery(
    { genre: selectedGenre, limit: 10 },
    { enabled: activeTab === "genre" }
  );

  const similarQuery = trpc.recommendations.getSimilar.useQuery(
    { songTitle: searchArtist || "Ave Maria", limit: 10 },
    { enabled: activeTab === "similar" && searchArtist.length > 0 }
  );

  const genres = ["Clássico", "Litúrgico", "Contemporâneo", "Gospel", "Coral"];

  const renderRecommendationCard = (rec: Recommendation, index: number) => (
    <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{rec.title}</h3>
          <p className="text-sm text-slate-600">{rec.artist}</p>
          {rec.genre && (
            <p className="text-xs text-slate-500 mt-1 bg-slate-100 inline-block px-2 py-1 rounded">
              {rec.genre}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Play className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Heart className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">{rec.reason}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Recomendações Musicais
            </h1>
          </div>
          <p className="text-slate-600">
            Descubra novas músicas baseadas em seus gostos e histórico
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "personalized" | "genre" | "similar")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Personalizadas
            </TabsTrigger>
            <TabsTrigger value="genre" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Por Gênero
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Similares
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Personalized */}
          <TabsContent value="personalized" className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Recomendações Personalizadas
              </h2>
              <p className="text-slate-600">
                Baseadas no seu histórico de reprodução e preferências
              </p>
            </Card>

            {personalizedQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : personalizedQuery.error ? (
              <Card className="p-6 bg-red-50 border-red-200">
                <p className="text-red-900">
                  Erro ao carregar recomendações. Tente novamente.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedQuery.data?.map((rec, idx) =>
                  renderRecommendationCard(rec, idx)
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: By Genre */}
          <TabsContent value="genre" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Selecione um Gênero
              </h2>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    className={
                      selectedGenre === genre
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </Card>

            {genreQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : genreQuery.error ? (
              <Card className="p-6 bg-red-50 border-red-200">
                <p className="text-red-900">
                  Erro ao carregar recomendações. Tente novamente.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {genreQuery.data?.map((rec, idx) =>
                  renderRecommendationCard(rec, idx)
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Similar */}
          <TabsContent value="similar" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Encontrar Músicas Similares
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite o título da música..."
                  value={searchArtist}
                  onChange={(e) => setSearchArtist(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={() => similarQuery.refetch()}
                  disabled={similarQuery.isLoading || !searchArtist}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {similarQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </div>
            </Card>

            {similarQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : similarQuery.error ? (
              <Card className="p-6 bg-red-50 border-red-200">
                <p className="text-red-900">
                  Erro ao carregar recomendações. Tente novamente.
                </p>
              </Card>
            ) : similarQuery.data && similarQuery.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarQuery.data.map((rec, idx) =>
                  renderRecommendationCard(rec, idx)
                )}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-slate-600">
                  Digite o título de uma música para encontrar similares
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
