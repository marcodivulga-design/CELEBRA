import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Music, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface CelebrationSuggestion {
  part: string;
  suggestedSongs: Array<{
    title: string;
    composer: string;
    duration: string;
    category: string;
  }>;
}

interface ScheduledCelebration {
  id: string;
  date: string;
  time: string;
  type: string;
  liturgicalSeason: string;
  expectedAttendance: number;
  musicSuggestions: CelebrationSuggestion[];
  status: "draft" | "confirmed" | "completed";
}

const LITURGICAL_SEASONS = [
  { id: "advento", label: "Advento", color: "bg-purple-100 text-purple-900" },
  { id: "natal", label: "Natal", color: "bg-red-100 text-red-900" },
  { id: "quaresma", label: "Quaresma", color: "bg-green-100 text-green-900" },
  { id: "pascoa", label: "Páscoa", color: "bg-yellow-100 text-yellow-900" },
  { id: "pentecostes", label: "Pentecostes", color: "bg-orange-100 text-orange-900" },
  { id: "ordinario", label: "Ordinário", color: "bg-blue-100 text-blue-900" },
];

const CELEBRATION_TYPES = [
  { id: "missa", label: "Missa Dominical" },
  { id: "missa-semana", label: "Missa de Semana" },
  { id: "casamento", label: "Casamento" },
  { id: "batizado", label: "Batizado" },
  { id: "funeral", label: "Funeral" },
  { id: "adoracao", label: "Adoração" },
];

const MUSIC_SUGGESTIONS_BY_PART = {
  entrada: [
    { title: "Glória a Deus", composer: "Tradicional", duration: "2:30", category: "Entrada" },
    { title: "Vinde Adorar", composer: "Moderno", duration: "3:00", category: "Entrada" },
  ],
  gloria: [
    { title: "Glória a Deus nas Alturas", composer: "Tradicional", duration: "2:45", category: "Glória" },
    { title: "Aleluia ao Senhor", composer: "Moderno", duration: "2:15", category: "Glória" },
  ],
  comunhao: [
    { title: "Pão da Vida", composer: "Moderno", duration: "3:15", category: "Comunhão" },
    { title: "Ave Maria", composer: "Schubert", duration: "3:45", category: "Comunhão" },
  ],
  saida: [
    { title: "Aleluia", composer: "Handel", duration: "2:45", category: "Saída" },
    { title: "Vinde Espírito Santo", composer: "Tradicional", duration: "3:00", category: "Saída" },
  ],
};

export default function CelebrationScheduling() {
  const [celebrations, setCelebrations] = useState<ScheduledCelebration[]>([
    {
      id: "1",
      date: "2026-04-19",
      time: "10:00",
      type: "missa",
      liturgicalSeason: "pascoa",
      expectedAttendance: 250,
      musicSuggestions: [
        {
          part: "Entrada",
          suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.entrada,
        },
        {
          part: "Glória",
          suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.gloria,
        },
        {
          part: "Comunhão",
          suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.comunhao,
        },
        {
          part: "Saída",
          suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.saida,
        },
      ],
      status: "draft",
    },
  ]);

  const [newCelebration, setNewCelebration] = useState({
    date: "",
    time: "",
    type: "missa",
    season: "ordinario",
    attendance: 200,
  });

  const handleAddCelebration = () => {
    if (!newCelebration.date || !newCelebration.time) {
      toast.error("Preencha data e hora");
      return;
    }

    const musicSuggestions: CelebrationSuggestion[] = [
      { part: "Entrada", suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.entrada },
      { part: "Glória", suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.gloria },
      { part: "Comunhão", suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.comunhao },
      { part: "Saída", suggestedSongs: MUSIC_SUGGESTIONS_BY_PART.saida },
    ];

    const celebration: ScheduledCelebration = {
      id: Date.now().toString(),
      date: newCelebration.date,
      time: newCelebration.time,
      type: newCelebration.type,
      liturgicalSeason: newCelebration.season,
      expectedAttendance: newCelebration.attendance,
      musicSuggestions,
      status: "draft",
    };

    setCelebrations([celebration, ...celebrations]);
    setNewCelebration({ date: "", time: "", type: "missa", season: "ordinario", attendance: 200 });
    toast.success("Celebração agendada com sugestões automáticas!");
  };

  const handleConfirm = (id: string) => {
    setCelebrations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "confirmed" } : c))
    );
    toast.success("Celebração confirmada!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2 font-playfair">
            📅 Agendamento de Celebrações
          </h1>
          <p className="text-gray-600">Agende celebrações com sugestões automáticas de músicas por tempo litúrgico</p>
        </div>

        {/* New Celebration Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Agendar Nova Celebração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-sky-900 mb-2 block">Data</label>
                <input
                  type="date"
                  value={newCelebration.date}
                  onChange={(e) => setNewCelebration({ ...newCelebration, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-semibold text-sky-900 mb-2 block">Hora</label>
                <input
                  type="time"
                  value={newCelebration.time}
                  onChange={(e) => setNewCelebration({ ...newCelebration, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-sky-900 mb-2 block">Tipo</label>
                <select
                  value={newCelebration.type}
                  onChange={(e) => setNewCelebration({ ...newCelebration, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {CELEBRATION_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="text-sm font-semibold text-sky-900 mb-2 block">Tempo Litúrgico</label>
                <select
                  value={newCelebration.season}
                  onChange={(e) => setNewCelebration({ ...newCelebration, season: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {LITURGICAL_SEASONS.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attendance */}
              <div>
                <label className="text-sm font-semibold text-sky-900 mb-2 block">Participantes</label>
                <input
                  type="number"
                  value={newCelebration.attendance}
                  onChange={(e) => setNewCelebration({ ...newCelebration, attendance: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleAddCelebration}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Celebrations */}
        <div className="space-y-6">
          {celebrations.map((celebration) => {
            const season = LITURGICAL_SEASONS.find((s) => s.id === celebration.liturgicalSeason);
            const type = CELEBRATION_TYPES.find((t) => t.id === celebration.type);

            return (
              <Card key={celebration.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-sky-900">{type?.label}</h3>
                        {season && (
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${season.color}`}>
                            {season.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(celebration.date).toLocaleDateString("pt-BR")} às {celebration.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {celebration.expectedAttendance} participantes
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {celebration.status === "draft" && (
                        <Button
                          onClick={() => handleConfirm(celebration.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmar
                        </Button>
                      )}
                      {celebration.status === "confirmed" && (
                        <span className="px-4 py-2 bg-green-100 text-green-900 rounded-lg font-semibold text-sm">
                          ✓ Confirmada
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Sugestões de Músicas
                  </h4>

                  <div className="space-y-4">
                    {celebration.musicSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                        <h5 className="font-semibold text-sky-900 mb-3">{suggestion.part}</h5>
                        <div className="space-y-2">
                          {suggestion.suggestedSongs.map((song, songIdx) => (
                            <div
                              key={songIdx}
                              className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-purple-300 transition-colors"
                            >
                              <div>
                                <p className="font-semibold text-sm text-sky-900">{song.title}</p>
                                <p className="text-xs text-gray-600">{song.composer}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-600">{song.duration}</span>
                                <Button size="sm" variant="ghost">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
