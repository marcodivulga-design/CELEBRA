import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Users, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface MinistryMember {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Ministry {
  id: number;
  name: string;
  description: string;
  maestroName: string;
  maestroEmail: string;
  members: MinistryMember[];
}

export default function Ministerio() {
  const [, setLocation] = useLocation();
  const [ministry, setMinistry] = useState<Ministry>({
    id: 1,
    name: 'Ministério de Música',
    description: 'Grupo de cantores e instrumentistas da paróquia',
    maestroName: 'João Silva',
    maestroEmail: 'joao@paroquia.com',
    members: [
      {
        id: 1,
        name: 'Maria Santos',
        email: 'maria@paroquia.com',
        role: 'Soprano',
        joinedAt: '2024-01-15',
      },
      {
        id: 2,
        name: 'Pedro Oliveira',
        email: 'pedro@paroquia.com',
        role: 'Tenor',
        joinedAt: '2024-02-20',
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedMinistry, setEditedMinistry] = useState<Ministry>(ministry);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [showAddMember, setShowAddMember] = useState(false);

  const handleSaveMinistry = () => {
    setMinistry(editedMinistry);
    setIsEditing(false);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      const member: MinistryMember = {
        id: Date.now(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setEditedMinistry({
        ...editedMinistry,
        members: [...editedMinistry.members, member],
      });
      setNewMember({ name: '', email: '', role: '' });
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (memberId: number) => {
    setEditedMinistry({
      ...editedMinistry,
      members: editedMinistry.members.filter((m) => m.id !== memberId),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
            >
              ←
            </Button>
            <h1 className="text-2xl font-bold text-purple-900">Perfil do Ministério</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Ministry Info Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Music className="text-purple-600" size={28} />
              <h2 className="text-xl font-semibold text-gray-900">Informações do Ministério</h2>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(true);
                  setEditedMinistry(ministry);
                }}
              >
                <Edit2 size={16} className="mr-2" />
                Editar
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Ministério
                </label>
                <Input
                  value={editedMinistry.name}
                  onChange={(e) =>
                    setEditedMinistry({ ...editedMinistry, name: e.target.value })
                  }
                  placeholder="Nome do ministério"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editedMinistry.description}
                  onChange={(e) =>
                    setEditedMinistry({ ...editedMinistry, description: e.target.value })
                  }
                  placeholder="Descrição do ministério"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Maestro
                  </label>
                  <Input
                    value={editedMinistry.maestroName}
                    onChange={(e) =>
                      setEditedMinistry({ ...editedMinistry, maestroName: e.target.value })
                    }
                    placeholder="Nome do maestro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email do Maestro
                  </label>
                  <Input
                    type="email"
                    value={editedMinistry.maestroEmail}
                    onChange={(e) =>
                      setEditedMinistry({ ...editedMinistry, maestroEmail: e.target.value })
                    }
                    placeholder="Email do maestro"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="bg-purple-600 hover:bg-blue-100"
                  onClick={handleSaveMinistry}
                >
                  <Save size={16} className="mr-2" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={16} className="mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="text-lg font-semibold text-gray-900">{ministry.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="text-gray-700">{ministry.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Maestro</p>
                  <p className="text-gray-900">{ministry.maestroName}</p>
                  <p className="text-sm text-gray-600">{ministry.maestroEmail}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={28} />
              <h2 className="text-xl font-semibold text-gray-900">
                Membros ({editedMinistry.members.length})
              </h2>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddMember(!showAddMember)}
              >
                <Plus size={16} className="mr-2" />
                Adicionar Membro
              </Button>
            )}
          </div>

          {showAddMember && isEditing && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4">Novo Membro</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Nome do membro"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email (opcional)"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Selecione a voz/instrumento</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Tenor">Tenor</option>
                  <option value="Baixo">Baixo</option>
                  <option value="Violão">Violão</option>
                  <option value="Piano">Piano</option>
                  <option value="Bateria">Bateria</option>
                  <option value="Baixo Elétrico">Baixo Elétrico</option>
                  <option value="Outro">Outro</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-blue-100"
                    onClick={handleAddMember}
                  >
                    Adicionar
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => setShowAddMember(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {editedMinistry.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  {member.email && <p className="text-sm text-gray-500">{member.email}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    Entrou em {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {editedMinistry.members.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-600">Nenhum membro adicionado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
