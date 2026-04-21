import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Users, Edit2, Trash2, ChevronRight } from "lucide-react";

export default function MinistriesPage() {
  const { user } = useAuth();
  const [selectedMinistry, setSelectedMinistry] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "music" as const,
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorPhone: "",
  });

  const churchId = user?.churchId || 1;

  // Queries
  const { data: ministries = [], isLoading: loadingMinistries } = trpc.ministries.list.useQuery({
    churchId,
  });

  const { data: selectedMinistryData } = trpc.ministries.getById.useQuery(
    { id: selectedMinistry || 0 },
    { enabled: !!selectedMinistry }
  );

  const { data: members = [] } = trpc.ministries.getMembers.useQuery(
    { ministryId: selectedMinistry || 0 },
    { enabled: !!selectedMinistry }
  );

  // Mutations
  const createMutation = trpc.ministries.create.useMutation({
    onSuccess: () => {
      setFormData({
        name: "",
        description: "",
        type: "music",
        coordinatorName: "",
        coordinatorEmail: "",
        coordinatorPhone: "",
      });
      setIsCreateOpen(false);
    },
  });

  const deleteMutation = trpc.ministries.delete.useMutation();

  const handleCreateMinistry = async () => {
    if (!formData.name) return;

    await createMutation.mutateAsync({
      name: formData.name,
      description: formData.description,
      churchId,
      organizationId: 1,
      type: formData.type,
      coordinatorName: formData.coordinatorName,
      coordinatorEmail: formData.coordinatorEmail,
      coordinatorPhone: formData.coordinatorPhone,
    });
  };

  const handleDeleteMinistry = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este ministério?")) {
      await deleteMutation.mutateAsync({ id });
      setSelectedMinistry(null);
    }
  };

  const ministryTypes = [
    { value: "choir", label: "Coral" },
    { value: "music", label: "Música" },
    { value: "liturgy", label: "Liturgia" },
    { value: "youth", label: "Juventude" },
    { value: "pastoral", label: "Pastoral" },
    { value: "education", label: "Educação" },
    { value: "social", label: "Social" },
    { value: "other", label: "Outro" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ministérios</h1>
          <p className="text-gray-600">Gerencie os ministérios da sua igreja</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ministries List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Ministérios</CardTitle>
                  <CardDescription>{ministries.length} ministérios</CardDescription>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Novo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Ministério</DialogTitle>
                      <DialogDescription>Adicione um novo ministério à sua igreja</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Coral de Vozes"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                          <SelectTrigger id="type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ministryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          placeholder="Descreva o ministério..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coordinatorName">Coordenador</Label>
                        <Input
                          id="coordinatorName"
                          placeholder="Nome do coordenador"
                          value={formData.coordinatorName}
                          onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coordinatorEmail">Email</Label>
                        <Input
                          id="coordinatorEmail"
                          type="email"
                          placeholder="Email do coordenador"
                          value={formData.coordinatorEmail}
                          onChange={(e) => setFormData({ ...formData, coordinatorEmail: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coordinatorPhone">Telefone</Label>
                        <Input
                          id="coordinatorPhone"
                          placeholder="Telefone do coordenador"
                          value={formData.coordinatorPhone}
                          onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleCreateMinistry} disabled={createMutation.isPending} className="w-full">
                        {createMutation.isPending ? "Criando..." : "Criar Ministério"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="space-y-2">
                {loadingMinistries ? (
                  <div className="text-center py-8 text-gray-500">Carregando...</div>
                ) : ministries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum ministério criado</div>
                ) : (
                  <div className="space-y-2">
                    {ministries.map((ministry) => (
                      <button
                        key={ministry.id}
                        onClick={() => setSelectedMinistry(ministry.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          selectedMinistry === ministry.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{ministry.name}</p>
                            <p className="text-sm text-gray-500">{ministry.memberCount || 0} membros</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ministry Details */}
          <div className="lg:col-span-2">
            {selectedMinistry && selectedMinistryData ? (
              <div className="space-y-6">
                {/* Ministry Info */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{selectedMinistryData.name}</CardTitle>
                      <CardDescription>{selectedMinistryData.description}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMinistry(selectedMinistry)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-semibold text-gray-900">{selectedMinistryData.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Membros</p>
                        <p className="font-semibold text-gray-900">{selectedMinistryData.memberCount || 0}</p>
                      </div>
                    </div>

                    {selectedMinistryData.coordinatorName && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">Coordenador</p>
                        <p className="font-semibold text-gray-900">{selectedMinistryData.coordinatorName}</p>
                        {selectedMinistryData.coordinatorEmail && (
                          <p className="text-sm text-gray-600">{selectedMinistryData.coordinatorEmail}</p>
                        )}
                        {selectedMinistryData.coordinatorPhone && (
                          <p className="text-sm text-gray-600">{selectedMinistryData.coordinatorPhone}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Members List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Membros ({members.length})
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {members.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Nenhum membro adicionado</div>
                    ) : (
                      <div className="space-y-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <p className="text-gray-500">Selecione um ministério para ver os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
