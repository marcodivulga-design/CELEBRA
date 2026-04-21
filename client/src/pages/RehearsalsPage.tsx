import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Calendar, Users, Trash2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RehearsalsPage() {
  const { user } = useAuth();
  const [selectedRehearsal, setSelectedRehearsal] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ministryId: 1,
    scheduledDate: "",
    scheduledTime: "",
    location: "",
    duration: 60,
  });

  const churchId = user?.churchId || 1;

  // Queries
  const { data: rehearsals = [], isLoading: loadingRehearsals } = trpc.rehearsals.list.useQuery({
    ministryId: formData.ministryId,
  });

  const { data: selectedRehearsalData } = trpc.rehearsals.getById.useQuery(
    { id: selectedRehearsal || 0 },
    { enabled: !!selectedRehearsal }
  );

  const { data: attendance = [] } = trpc.rehearsals.getAttendance.useQuery(
    { rehearsalId: selectedRehearsal || 0 },
    { enabled: !!selectedRehearsal }
  );

  const { data: attendanceSummary } = trpc.rehearsals.getAttendanceSummary.useQuery(
    { rehearsalId: selectedRehearsal || 0 },
    { enabled: !!selectedRehearsal }
  );

  // Mutations
  const createMutation = trpc.rehearsals.create.useMutation({
    onSuccess: () => {
      setFormData({
        title: "",
        description: "",
        ministryId: 1,
        scheduledDate: "",
        scheduledTime: "",
        location: "",
        duration: 60,
      });
      setIsCreateOpen(false);
    },
  });

  const deleteMutation = trpc.rehearsals.delete.useMutation();

  const handleCreateRehearsal = async () => {
    if (!formData.title || !formData.scheduledDate) return;

    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime || "19:00"}`);

    await createMutation.mutateAsync({
      title: formData.title,
      description: formData.description,
      ministryId: formData.ministryId,
      churchId,
      scheduledDate: scheduledDateTime.toISOString(),
      location: formData.location,
      duration: formData.duration,
    });
  };

  const handleDeleteRehearsal = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este ensaio?")) {
      await deleteMutation.mutateAsync({ id });
      setSelectedRehearsal(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ensaios</h1>
          <p className="text-gray-600">Gerencie os ensaios e presenças dos ministérios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rehearsals List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Próximos Ensaios</CardTitle>
                  <CardDescription>{rehearsals.length} ensaios</CardDescription>
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
                      <DialogTitle>Criar Novo Ensaio</DialogTitle>
                      <DialogDescription>Agende um novo ensaio para o ministério</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          placeholder="Ex: Ensaio de Coral"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Data *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Hora</Label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.scheduledTime}
                            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Local</Label>
                        <Input
                          id="location"
                          placeholder="Ex: Sala de Música"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration">Duração (minutos)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          placeholder="Detalhes do ensaio..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleCreateRehearsal} disabled={createMutation.isPending} className="w-full">
                        {createMutation.isPending ? "Criando..." : "Criar Ensaio"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>

              <CardContent className="space-y-2">
                {loadingRehearsals ? (
                  <div className="text-center py-8 text-gray-500">Carregando...</div>
                ) : rehearsals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nenhum ensaio agendado</div>
                ) : (
                  <div className="space-y-2">
                    {rehearsals.map((rehearsal) => (
                      <button
                        key={rehearsal.id}
                        onClick={() => setSelectedRehearsal(rehearsal.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          selectedRehearsal === rehearsal.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">{rehearsal.title}</p>
                            <p className="text-xs text-gray-500">
                              {rehearsal.scheduledDate
                                ? format(new Date(rehearsal.scheduledDate), "dd MMM yyyy", { locale: ptBR })
                                : "Data não definida"}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rehearsal Details */}
          <div className="lg:col-span-2">
            {selectedRehearsal && selectedRehearsalData ? (
              <div className="space-y-6">
                {/* Rehearsal Info */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{selectedRehearsalData.title}</CardTitle>
                      <CardDescription>{selectedRehearsalData.description}</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRehearsal(selectedRehearsal)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Data e Hora</p>
                        <p className="font-semibold text-gray-900">
                          {selectedRehearsalData.scheduledDate
                            ? format(new Date(selectedRehearsalData.scheduledDate), "dd MMM yyyy HH:mm", {
                                locale: ptBR,
                              })
                            : "Não definido"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duração</p>
                        <p className="font-semibold text-gray-900">{selectedRehearsalData.duration || 60} minutos</p>
                      </div>
                    </div>

                    {selectedRehearsalData.location && (
                      <div>
                        <p className="text-sm text-gray-600">Local</p>
                        <p className="font-semibold text-gray-900">{selectedRehearsalData.location}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Attendance Summary */}
                {attendanceSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Presença
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Presentes</p>
                            <p className="font-bold text-green-600">{attendanceSummary.present || 0}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm text-gray-600">Ausentes</p>
                            <p className="font-bold text-red-600">{attendanceSummary.absent || 0}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="w-5 h-5 rounded-full bg-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-600">Justificados</p>
                            <p className="font-bold text-yellow-600">{attendanceSummary.excused || 0}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attendance List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Presença</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {attendance.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Nenhum registro de presença</div>
                    ) : (
                      <div className="space-y-2">
                        {attendance.map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{record.memberName}</p>
                              <p className="text-sm text-gray-600">{record.role}</p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                record.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "absent"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {record.status === "present"
                                ? "Presente"
                                : record.status === "absent"
                                  ? "Ausente"
                                  : "Justificado"}
                            </div>
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
                  <p className="text-gray-500">Selecione um ensaio para ver os detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
