import { Users, Plus, Trash2, Edit2, Award, Music, Mic, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function Equipes() {
  const [selectedCelebration, setSelectedCelebration] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  // Queries
  const { data: celebrations, isLoading: celebrationsLoading } = trpc.celebrations.list.useQuery();
  const { data: teams, isLoading: teamsLoading } = trpc.teams.list.useQuery(
    selectedCelebration || 0,
    { enabled: !!selectedCelebration }
  );
  const { data: members, isLoading: membersLoading } = trpc.teams.getMembers.useQuery(
    selectedTeam || 0,
    { enabled: !!selectedTeam }
  );

  // Mutations
  const createTeamMutation = trpc.teams.create.useMutation({
    onSuccess: () => {
      alert("Equipe criada");
      if (selectedCelebration) {
        trpc.useUtils().teams.list.invalidate(selectedCelebration);
      }
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  const deleteTeamMutation = trpc.teams.delete.useMutation({
    onSuccess: () => {
      alert("Equipe removida");
      if (selectedCelebration) {
        trpc.useUtils().teams.list.invalidate(selectedCelebration);
      }
      setSelectedTeam(null);
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  const removeMemberMutation = trpc.teams.removeMember.useMutation({
    onSuccess: () => {
      alert("Membro removido");
      if (selectedTeam) {
        trpc.useUtils().teams.getMembers.invalidate(selectedTeam);
      }
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  // Load first celebration
  useEffect(() => {
    if (!celebrationsLoading && celebrations && celebrations.length > 0) {
      setSelectedCelebration(celebrations[0].id);
    }
  }, [celebrations, celebrationsLoading]);

  // Load first team
  useEffect(() => {
    if (!teamsLoading && teams && teams.length > 0) {
      setSelectedTeam(teams[0].id);
    } else {
      setSelectedTeam(null);
    }
  }, [teams, teamsLoading]);

  const handleAddTeam = () => {
    if (!selectedCelebration) return;

    const name = prompt("Nome da equipe:");
    if (!name) return;

    const description = prompt("Descrição (opcional):");

    createTeamMutation.mutate({
      celebrationId: selectedCelebration,
      name,
      description: description || undefined,
    });
  };

  if (celebrationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!celebrations || celebrations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-sky-700 text-lg">Nenhuma celebração disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
            <Users className="w-8 h-8 text-orange-400" />
            Equipes
          </h1>

          {/* Celebration Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-sky-800 mb-2">
              Celebração
            </label>
            <select
              value={selectedCelebration || ""}
              onChange={(e) => setSelectedCelebration(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-cyan-50 border border-sky-300 rounded-lg text-white"
            >
              {celebrations.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Equipes</h2>
              <Button
                onClick={handleAddTeam}
                disabled={createTeamMutation.isPending}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {teamsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : !teams || teams.length === 0 ? (
              <Card className="p-6 text-center bg-cyan-50/50 border-sky-300">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sky-700 text-sm">Nenhuma equipe</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {teams.map((team: any) => (
                  <Card
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`p-4 cursor-pointer transition ${
                      selectedTeam === team.id
                        ? "bg-orange-500/20 border-orange-400"
                        : "bg-cyan-50/50 border-sky-300 hover:border-orange-400/50"
                    }`}
                  >
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    {team.description && (
                      <p className="text-sky-700 text-sm">{team.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Membros da Equipe</h2>
                  <Button
                    onClick={() => {
                      if (confirm("Tem certeza que deseja remover esta equipe?")) {
                        deleteTeamMutation.mutate(selectedTeam);
                      }
                    }}
                    disabled={deleteTeamMutation.isPending}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {membersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : !members || members.length === 0 ? (
                  <Card className="p-12 text-center bg-cyan-50/50 border-sky-300">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-sky-700 text-lg">Nenhum membro adicionado</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {members.map((member: any) => (
                      <Card key={member.id} className="p-4 bg-cyan-50/50 border-sky-300">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <p className="text-sky-700 text-sm">{member.email}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                              {member.role}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Tem certeza que deseja remover este membro?")) {
                                removeMemberMutation.mutate(member.id);
                              }
                            }}
                            disabled={removeMemberMutation.isPending}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center bg-cyan-50/50 border-sky-300">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-sky-700 text-lg">Selecione uma equipe</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
