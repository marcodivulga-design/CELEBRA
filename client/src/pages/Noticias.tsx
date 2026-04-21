import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Filter, Calendar, Tag, MessageSquare, Eye, Clock } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  createdAt: Date;
  views: number;
  comments: number;
  liturgicalSeason?: string;
  featured?: boolean;
}

const CATEGORIES = [
  { id: "avisos", label: "Avisos", color: "bg-blue-100 text-blue-800" },
  { id: "eventos", label: "Eventos", color: "bg-purple-100 text-purple-800" },
  { id: "reflexoes", label: "Reflexões", color: "bg-green-100 text-green-800" },
  { id: "noticias", label: "Notícias", color: "bg-yellow-100 text-yellow-800" },
  { id: "formacao", label: "Formação", color: "bg-pink-100 text-pink-800" },
];

const LITURGICAL_SEASONS = [
  { id: "all", label: "Todos os tempos" },
  { id: "advento", label: "Advento" },
  { id: "natal", label: "Natal" },
  { id: "quaresma", label: "Quaresma" },
  { id: "pascoa", label: "Páscoa" },
  { id: "pentecostes", label: "Pentecostes" },
  { id: "ordinario", label: "Tempo Ordinário" },
];

// Mock data
const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Festa de São João 2026 - Programação Completa",
    excerpt: "Confira a programação especial para a festa de São João com músicas, celebrações e eventos comunitários",
    content: "Convidamos toda a comunidade para participar da festa de São João 2026...",
    category: "eventos",
    author: "Padre João",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 245,
    comments: 12,
    liturgicalSeason: "ordinario",
    featured: true,
  },
  {
    id: 2,
    title: "Novo Horário de Confissões",
    excerpt: "A partir de segunda-feira próxima, as confissões serão realizadas em novo horário",
    content: "Informamos que a partir de segunda-feira próxima, as confissões serão...",
    category: "avisos",
    author: "Padre José",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    views: 189,
    comments: 5,
    liturgicalSeason: "ordinario",
  },
  {
    id: 3,
    title: "Reflexão: A Importância da Comunidade",
    excerpt: "Uma reflexão sobre como a comunidade nos ajuda a crescer na fé",
    content: "A comunidade é fundamental para nosso crescimento espiritual...",
    category: "reflexoes",
    author: "Padre Maria",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    views: 156,
    comments: 8,
    liturgicalSeason: "ordinario",
  },
  {
    id: 4,
    title: "Preparação para a Quaresma 2026",
    excerpt: "Dicas e sugestões para uma Quaresma mais significativa",
    content: "A Quaresma é um tempo de conversão e renovação...",
    category: "formacao",
    author: "Padre João",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    views: 312,
    comments: 24,
    liturgicalSeason: "quaresma",
  },
  {
    id: 5,
    title: "Celebração da Páscoa - Triduum Sagrado",
    excerpt: "Programação especial para o Triduum Sagrado e Páscoa 2026",
    content: "O Triduum Sagrado é o coração da liturgia cristã...",
    category: "eventos",
    author: "Padre José",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    views: 428,
    comments: 35,
    liturgicalSeason: "pascoa",
    featured: true,
  },
];

export default function Noticias() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("noticias");

  // Filter and search news
  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || news.category === selectedCategory;

      const matchesSeason = selectedSeason === "all" || news.liturgicalSeason === selectedSeason;

      return matchesSearch && matchesCategory && matchesSeason;
    });
  }, [searchQuery, selectedCategory, selectedSeason]);

  const handleCreateNews = () => {
    if (!newTitle || !newExcerpt || !newContent) {
      alert("Preencha todos os campos");
      return;
    }

    // TODO: Call API to create news
    console.log("Criando notícia:", { newTitle, newExcerpt, newContent, newCategory });

    // Reset form
    setNewTitle("");
    setNewExcerpt("");
    setNewContent("");
    setNewCategory("noticias");
    setIsCreating(false);

    alert("Notícia criada com sucesso! Aguardando moderação.");
  };

  const getCategoryColor = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.color || "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (categoryId: string) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notícias da Paróquia</h1>
          <p className="text-muted-foreground">Fique atualizado com as últimas notícias e eventos</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Notícia</DialogTitle>
              <DialogDescription>Compartilhe notícias e eventos com a comunidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Título da notícia"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Resumo</label>
                <Input
                  placeholder="Resumo da notícia (será exibido no feed)"
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Conteúdo Completo</label>
                <Textarea
                  placeholder="Conteúdo completo da notícia"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="mt-1"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateNews}>Publicar Notícia</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar por:</span>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Liturgical Season Filter */}
          <Select value={selectedSeason} onValueChange={setSelectedSeason}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LITURGICAL_SEASONS.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured News */}
      {filteredNews.some((n) => n.featured) && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Destaque</h2>
          <div className="grid gap-4">
            {filteredNews
              .filter((n) => n.featured)
              .map((news) => (
                <Card key={news.id} className="border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{news.title}</CardTitle>
                        <CardDescription className="mt-2">{news.excerpt}</CardDescription>
                      </div>
                      <Badge className="ml-2">Destaque</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(news.category)}>
                        {getCategoryLabel(news.category)}
                      </Badge>
                      {news.liturgicalSeason && (
                        <Badge variant="outline">{news.liturgicalSeason}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(news.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {news.views} visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {news.comments} comentários
                      </span>
                      <span className="text-xs">Por {news.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* News Feed */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Notícias ({filteredNews.filter((n) => !n.featured).length})
        </h2>
        {filteredNews.filter((n) => !n.featured).length > 0 ? (
          <div className="grid gap-4">
            {filteredNews
              .filter((n) => !n.featured)
              .map((news) => (
                <Card key={news.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{news.title}</CardTitle>
                        <CardDescription className="mt-2">{news.excerpt}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(news.category)}>
                        {getCategoryLabel(news.category)}
                      </Badge>
                      {news.liturgicalSeason && (
                        <Badge variant="outline">{news.liturgicalSeason}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(news.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {news.views} visualizações
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {news.comments} comentários
                      </span>
                      <span className="text-xs">Por {news.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma notícia encontrada com os filtros selecionados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
