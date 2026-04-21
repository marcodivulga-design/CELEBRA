import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Search, MessageCircle, Eye, Calendar } from 'lucide-react';

const categories = ['Avisos', 'Reflexões', 'Ensinamentos', 'Testemunhos', 'Eventos'];

const mockPosts = [
  {
    id: 1,
    title: 'O Significado da Páscoa na Vida Cristã',
    excerpt: 'A Páscoa é o coração da fé cristã. Neste artigo, exploramos o significado profundo da ressurreição de Cristo...',
    category: 'Reflexões',
    author: 'Pe. João Silva',
    date: '2026-04-10',
    views: 456,
    comments: 23,
    image: '🙏',
  },
  {
    id: 2,
    title: 'Novo Horário de Missas - Abril',
    excerpt: 'A partir de abril, os horários das missas sofrerão algumas alterações. Confira os novos horários...',
    category: 'Avisos',
    author: 'Paróquia',
    date: '2026-04-01',
    views: 234,
    comments: 8,
    image: '⏰',
  },
  {
    id: 3,
    title: 'Testemunho de Fé: A Jornada de Maria',
    excerpt: 'Maria compartilha sua jornada de fé e como a comunidade paroquial a ajudou em momentos difíceis...',
    category: 'Testemunhos',
    author: 'Maria Santos',
    date: '2026-03-28',
    views: 567,
    comments: 45,
    image: '✨',
  },
];

export default function CatholicBlog() {
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Reflexões',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = () => {
    console.log('Artigo publicado:', formData);
    setFormData({ title: '', excerpt: '', content: '', category: 'Reflexões' });
    setShowNewPostForm(false);
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-amber-600" />
            Blog Católico
          </h1>
          <p className="text-gray-600 mt-1">Artigos, reflexões e ensinamentos para a comunidade</p>
        </div>
        <Button onClick={() => setShowNewPostForm(!showNewPostForm)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Criar Novo Artigo</CardTitle>
            <CardDescription>Compartilhe um artigo, reflexão ou ensinamento com a comunidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: O Significado da Páscoa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resumo</label>
              <Textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Um breve resumo do artigo..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Escreva o conteúdo completo do artigo..."
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePublish} className="bg-amber-600 hover:bg-amber-700">
                Publicar Artigo
              </Button>
              <Button onClick={() => setShowNewPostForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'Todos' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('Todos')}
            size="sm"
          >
            Todos
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              size="sm"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="grid gap-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="text-4xl">{post.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Por: {post.author}</span>
                    <Button className="bg-amber-600 hover:bg-amber-700" size="sm">
                      Ler Artigo
                    </Button>
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views} visualizações
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments} comentários
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
