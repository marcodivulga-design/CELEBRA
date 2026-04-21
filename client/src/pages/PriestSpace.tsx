import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Plus, MessageCircle, BookOpen, AlertCircle, Users } from 'lucide-react';

export function PriestSpace() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: 'orientacao',
      title: 'Orientações para Quaresma 2026',
      content: 'Neste período de Quaresma, recomendo que o repertório seja mais contemplativo e penitencial...',
      author: 'Bispo Dom João',
      date: '2026-04-14',
      comments: 5,
    },
    {
      id: 2,
      category: 'formacao',
      title: 'Formação: Teologia do Cântico Litúrgico',
      content: 'O cântico litúrgico não é apenas música, mas oração. Vamos explorar essa dimensão...',
      author: 'Padre Pedro',
      date: '2026-04-13',
      comments: 3,
    },
    {
      id: 3,
      category: 'reflexao',
      title: 'Reflexão: Música como Oração',
      content: 'Como podemos usar a música para aprofundar a experiência espiritual dos fiéis?',
      author: 'Padre Paulo',
      date: '2026-04-12',
      comments: 8,
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'orientacao',
    title: '',
    content: '',
  });

  const categories = [
    { id: 'orientacao', name: 'Orientações', icon: AlertCircle, color: 'from-red-500 to-red-600' },
    { id: 'formacao', name: 'Formação', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'reflexao', name: 'Reflexão', icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
    { id: 'coordenacao', name: 'Coordenação', icon: Users, color: 'from-green-500 to-green-600' },
  ];

  const handleAddPost = () => {
    if (formData.title && formData.content) {
      setPosts([
        {
          id: posts.length + 1,
          ...formData,
          author: 'Você',
          date: new Date().toISOString().split('T')[0],
          comments: 0,
        },
        ...posts,
      ]);
      setFormData({ category: 'orientacao', title: '', content: '' });
      setShowForm(false);
    }
  };

  const filteredPosts = posts.filter(p => filter === 'all' || p.category === filter);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-800 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Espaço Privado de Padres</h1>
          </div>
          <p className="text-gray-400">Apenas padres e bispos têm acesso a este espaço de coordenação e formação</p>
        </div>

        {/* Access Control */}
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-4 rounded-lg mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <div className="text-sm text-yellow-200">
            <strong>Acesso Restrito:</strong> Este espaço é privado e criptografado. Apenas padres, bispos e administradores podem visualizar este conteúdo.
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
            <h3 className="font-bold text-white text-lg">Novo Post</h3>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-700 border-gray-600 text-white px-3 py-2 rounded border"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Input
              placeholder="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <textarea
              placeholder="Conteúdo"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded h-32"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddPost} className="bg-green-600 hover:bg-green-700">
                Publicar
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => {
            const categoryInfo = getCategoryInfo(post.category);
            const Icon = categoryInfo?.icon || MessageCircle;
            return (
              <div key={post.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${categoryInfo?.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{post.title}</h3>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        {categoryInfo?.name}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-medium">{post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments} comentários</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg text-sm text-blue-200">
          <p>💡 <strong>Dica:</strong> Use este espaço para compartilhar orientações, formação, reflexões e coordenação entre padres e bispos. Todos os posts são criptografados e privados.</p>
        </div>
      </div>
    </div>
  );
}
