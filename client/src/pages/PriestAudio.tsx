import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Music, Upload, Play, MessageCircle, Eye } from 'lucide-react';

const categories = [
  { value: 'reflexao', label: 'Reflexão', color: 'bg-blue-100' },
  { value: 'homilia', label: 'Homilia', color: 'bg-purple-100' },
  { value: 'bencao', label: 'Bênção', color: 'bg-yellow-100' },
  { value: 'ensinamento', label: 'Ensinamento', color: 'bg-green-100' },
  { value: 'oracao', label: 'Oração', color: 'bg-pink-100' },
];

const mockAudios = [
  {
    id: 1,
    title: 'Reflexão sobre a Páscoa',
    description: 'Uma reflexão profunda sobre o significado da Páscoa na vida cristã',
    category: 'reflexao',
    duration: 15,
    views: 234,
    comments: 12,
    date: '2026-04-10',
    priest: 'Pe. João Silva',
  },
  {
    id: 2,
    title: 'Homilia do Domingo de Ramos',
    description: 'Homilia completa do Domingo de Ramos com mensagem de esperança',
    category: 'homilia',
    duration: 22,
    views: 567,
    comments: 28,
    date: '2026-04-05',
    priest: 'Pe. Carlos Santos',
  },
  {
    id: 3,
    title: 'Bênção para as Famílias',
    description: 'Bênção especial para as famílias da paróquia',
    category: 'bencao',
    duration: 8,
    views: 145,
    comments: 5,
    date: '2026-04-01',
    priest: 'Pe. João Silva',
  },
];

export default function PriestAudio() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('reflexao');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'reflexao',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    console.log('Áudio enviado:', formData);
    setFormData({ title: '', description: '', category: 'reflexao' });
    setShowUploadForm(false);
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100';
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-600" />
            Mensagens de Áudio do Padre
          </h1>
          <p className="text-gray-600 mt-1">Reflexões, homilias e bênçãos para a comunidade</p>
        </div>
        <Button onClick={() => setShowUploadForm(!showUploadForm)} className="bg-purple-600 hover:bg-blue-100">
          <Upload className="w-4 h-4 mr-2" />
          Fazer Upload
        </Button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>Fazer Upload de Áudio</CardTitle>
            <CardDescription>Compartilhe uma reflexão, homilia ou bênção com a comunidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Reflexão sobre a Páscoa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o conteúdo do áudio..."
                rows={3}
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
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Arquivo de Áudio</label>
              <Input type="file" accept="audio/*" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpload} className="bg-purple-600 hover:bg-blue-100">
                Publicar Áudio
              </Button>
              <Button onClick={() => setShowUploadForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === 'todos' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('todos')}
          size="sm"
        >
          Todos
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.value)}
            size="sm"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Áudios */}
      <div className="grid gap-4">
        {mockAudios.map(audio => (
          <Card key={audio.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${getCategoryColor(audio.category)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {getCategoryLabel(audio.category)}
                    </div>
                    <span className="text-sm text-gray-500">{audio.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{audio.title}</h3>
                  <p className="text-gray-600 mb-3">{audio.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Por: {audio.priest}</span>
                    <span>Duração: {audio.duration}min</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button className="bg-purple-600 hover:bg-blue-100">
                    <Play className="w-4 h-4 mr-2" />
                    Ouvir
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{audio.views} visualizações</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{audio.comments} comentários</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
