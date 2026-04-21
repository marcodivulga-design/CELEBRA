import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Users, Music, Lock } from 'lucide-react';

export function ChatRoom() {
  const [selectedRoom, setSelectedRoom] = useState('repertorio');
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'João Silva',
      role: 'Músico',
      message: 'Alguém conhece uma música boa para Pentecostes?',
      timestamp: '14:30',
      avatar: '👨‍🎵',
    },
    {
      id: 2,
      author: 'Maria Santos',
      role: 'Padre',
      message: 'Recomendo "Vinde Espírito Santo" - é clássica e os fiéis conhecem bem',
      timestamp: '14:35',
      avatar: '👩‍⚖️',
    },
    {
      id: 3,
      author: 'Pedro Costa',
      role: 'Músico',
      message: 'Ótima sugestão! Vou adicionar ao repertório',
      timestamp: '14:40',
      avatar: '👨‍🎸',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const rooms = [
    { id: 'repertorio', name: 'Repertório', icon: Music, color: 'from-purple-500 to-purple-600', members: 24 },
    { id: 'geral', name: 'Geral', icon: MessageCircle, color: 'from-blue-500 to-blue-600', members: 156 },
    { id: 'musicos', name: 'Músicos', icon: Users, color: 'from-pink-500 to-pink-600', members: 12 },
    { id: 'padres', name: 'Padres (Privado)', icon: Lock, color: 'from-red-500 to-red-600', members: 3 },
  ];

  const currentRoom = rooms.find(r => r.id === selectedRoom);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: 'Você',
          role: 'Usuário',
          message: newMessage,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          avatar: '👤',
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-slate-800 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">💬 Chat de Repertório</h1>
          <p className="text-gray-400">Converse com outros músicos, padres e fiéis sobre o repertório litúrgico</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Rooms */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-white mb-4">Salas de Chat</h3>
              {rooms.map(room => {
                const Icon = room.icon;
                const isActive = selectedRoom === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? `bg-gradient-to-r ${room.color} text-white`
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{room.name}</div>
                      <div className="text-xs opacity-75">{room.members} membros</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className={`bg-gradient-to-r ${currentRoom?.color} p-4 text-white`}>
                <h2 className="font-bold text-lg">{currentRoom?.name}</h2>
                <p className="text-sm opacity-90">{currentRoom?.members} membros online</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="text-2xl">{msg.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{msg.author}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{msg.role}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mt-1">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4 bg-gray-750">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-purple-600 hover:bg-blue-100"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Pressione Enter para enviar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg text-sm text-blue-200">
          <p>💡 <strong>Dica:</strong> Use as salas para discutir repertório, fazer sugestões e compartilhar experiências. A sala de Padres é privada e só acessível para padres e bispos.</p>
        </div>
      </div>
    </div>
  );
}
