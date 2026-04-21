import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, ThumbsDown, Music, Plus, Filter } from 'lucide-react';

export function MusicSuggestions() {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      title: 'Vinde Espírito Santo',
      artist: 'Tradicional',
      genre: 'Hino',
      liturgicalMoment: 'Pentecostes',
      status: 'approved',
      votes: 24,
      userVote: null,
      youtube: 'https://youtube.com/watch?v=...',
      spotify: 'https://spotify.com/track/...',
    },
    {
      id: 2,
      title: 'Aleluia Ressuscitou',
      artist: 'Comunidade Católica',
      genre: 'Cântico',
      liturgicalMoment: 'Páscoa',
      status: 'pending',
      votes: 12,
      userVote: 'up',
      youtube: 'https://youtube.com/watch?v=...',
      spotify: 'https://spotify.com/track/...',
    },
    {
      id: 3,
      title: 'Noite Feliz',
      artist: 'Tradicional',
      genre: 'Cântico',
      liturgicalMoment: 'Natal',
      status: 'approved',
      votes: 18,
      userVote: 'down',
      youtube: 'https://youtube.com/watch?v=...',
      spotify: 'https://spotify.com/track/...',
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    liturgicalMoment: '',
    youtube: '',
    spotify: '',
  });

  const handleVote = (id: number, voteType: 'up' | 'down') => {
    setSuggestions(suggestions.map(s => {
      if (s.id === id) {
        const newVotes = s.userVote === voteType ? s.votes - 1 : s.votes + 1;
        return { ...s, votes: newVotes, userVote: s.userVote === voteType ? null : voteType };
      }
      return s;
    }));
  };

  const handleAddSuggestion = () => {
    if (formData.title && formData.artist) {
      setSuggestions([
        ...suggestions,
        {
          id: suggestions.length + 1,
          ...formData,
          status: 'pending',
          votes: 1,
          userVote: 'up',
        },
      ]);
      setFormData({ title: '', artist: '', genre: '', liturgicalMoment: '', youtube: '', spotify: '' });
      setShowForm(false);
    }
  };

  const filteredSuggestions = suggestions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900 text-green-200';
      case 'rejected':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-yellow-900 text-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓ Aprovada';
      case 'rejected':
        return '✗ Rejeitada';
      default:
        return '⏳ Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-800 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🎵 Sugestões de Músicas</h1>
          <p className="text-gray-400">Sugira músicas para o repertório litúrgico. Padres aprovam as melhores!</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Sugerir Música
          </Button>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="all">Todas as sugestões</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovadas</option>
              <option value="rejected">Rejeitadas</option>
            </select>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4">
            <h3 className="font-bold text-white text-lg">Nova Sugestão de Música</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Título da música"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Artista"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Gênero"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Momento litúrgico"
                value={formData.liturgicalMoment}
                onChange={(e) => setFormData({ ...formData, liturgicalMoment: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                placeholder="Link YouTube"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white col-span-2"
              />
              <Input
                placeholder="Link Spotify"
                value={formData.spotify}
                onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white col-span-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddSuggestion} className="bg-green-600 hover:bg-green-700">
                Enviar Sugestão
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-sky-600" />
                    <div>
                      <h3 className="font-bold text-white">{suggestion.title}</h3>
                      <p className="text-sm text-gray-400">{suggestion.artist}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {suggestion.genre}
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {suggestion.liturgicalMoment}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(suggestion.status)}`}>
                      {getStatusLabel(suggestion.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Voting */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleVote(suggestion.id, 'up')}
                      variant="outline"
                      size="sm"
                      className={suggestion.userVote === 'up' ? 'bg-green-600 border-green-600' : ''}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-bold w-8 text-center">{suggestion.votes}</span>
                    <Button
                      onClick={() => handleVote(suggestion.id, 'down')}
                      variant="outline"
                      size="sm"
                      className={suggestion.userVote === 'down' ? 'bg-red-600 border-red-600' : ''}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    {suggestion.youtube && (
                      <a
                        href={suggestion.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        YouTube
                      </a>
                    )}
                    {suggestion.spotify && (
                      <a
                        href={suggestion.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        Spotify
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg text-sm text-blue-200">
          <p>💡 <strong>Dica:</strong> Vote em sugestões que você gosta! As músicas mais votadas têm maior chance de serem aprovadas pelos padres.</p>
        </div>
      </div>
    </div>
  );
}
