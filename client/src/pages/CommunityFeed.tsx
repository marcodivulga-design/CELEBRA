import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Search, Plus } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'celebration' | 'pastoral' | 'event' | 'news';
  author: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  image?: string;
}

const feedItems: FeedItem[] = [
  {
    id: '1',
    type: 'celebration',
    author: 'Padre João Silva',
    avatar: 'JJ',
    title: 'Missa Solene - Domingo de Ramos',
    content: 'Celebração especial de Domingo de Ramos com procissão. Todos convidados a participar! A missa começará às 10h na Igreja Matriz.',
    timestamp: '2 horas atrás',
    likes: 24,
    comments: 8,
    liked: true,
    image: 'https://via.placeholder.com/400x200?text=Domingo+de+Ramos',
  },
  {
    id: '2',
    type: 'pastoral',
    author: 'Bispo Carlos',
    avatar: 'BC',
    title: 'Mensagem Pastoral - Semana Santa',
    content: 'Queridos filhos, nesta Semana Santa, somos convidados a refletir sobre o sacrifício de Cristo. Que possamos viver com mais fé e amor ao próximo.',
    timestamp: '4 horas atrás',
    likes: 156,
    comments: 42,
    liked: false,
  },
  {
    id: '3',
    type: 'event',
    author: 'Comunidade Celebra',
    avatar: 'CC',
    title: 'Encontro de Coros - 15 de Abril',
    content: 'Convite para o encontro de coros diocesanos. Será uma oportunidade de partilha e aprendizado musical. Inscrições abertas!',
    timestamp: '6 horas atrás',
    likes: 45,
    comments: 12,
    liked: false,
  },
  {
    id: '4',
    type: 'news',
    author: 'Notícias da Igreja',
    avatar: 'NI',
    title: 'Canonização de Santo Anselmo',
    content: 'O Papa Francisco canonizou Santo Anselmo em cerimônia solene no Vaticano. Sua vida é exemplo de fé e dedicação à Igreja.',
    timestamp: '1 dia atrás',
    likes: 89,
    comments: 23,
    liked: false,
  },
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    celebration: 'bg-blue-100 text-blue-900 border-blue-300',
    pastoral: 'bg-purple-100 text-purple-900 border-purple-300',
    event: 'bg-green-100 text-green-900 border-green-300',
    news: 'bg-orange-100 text-orange-900 border-orange-300',
  };
  return colors[type] || colors.celebration;
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    celebration: '🙏 Celebração',
    pastoral: '✝️ Mensagem Pastoral',
    event: '📅 Evento',
    news: '📰 Notícia',
  };
  return labels[type] || type;
};

export function CommunityFeed() {
  const [feedData, setFeedData] = useState(feedItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'celebration' | 'pastoral' | 'event' | 'news'>('all');

  const toggleLike = (id: string) => {
    setFeedData(feedData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          liked: !item.liked,
          likes: item.liked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));
  };

  const filteredFeed = feedData.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Comunidade CELEBRA</h1>
          <p className="text-slate-600">Conecte-se com a comunidade, compartilhe celebrações e eventos</p>
        </div>

        {/* Create Post Button */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-100">
                <Plus className="w-4 h-4 mr-2" />
                Compartilhar com a Comunidade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Buscar na comunidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'celebration', 'pastoral', 'event', 'news'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600'
                }`}
              >
                {type === 'all' ? 'Todos' : getTypeLabel(type).split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {filteredFeed.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.author}</p>
                      <p className="text-xs text-slate-600">{item.timestamp}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-700">{item.content}</p>
                </div>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full rounded-lg object-cover h-48"
                  />
                )}

                {/* Interactions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                      item.liked
                        ? 'bg-red-100 text-red-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${item.liked ? 'fill-current' : ''}`}
                    />
                    <span className="text-sm font-medium">{item.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.comments}</span>
                  </button>

                  <button className="flex items-center gap-2 px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 transition-all ml-auto">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Compartilhar</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredFeed.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">Nenhuma postagem encontrada</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Community Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Membros Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">1,240</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Postagens Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">24</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">8.5k</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
