import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Zap } from "lucide-react";

export default function LiturgicalCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Liturgical colors
  const COLORS = {
    white: { name: "Branco", hex: "#FFFFFF", border: "#E5E7EB" },
    red: { name: "Vermelho", hex: "#DC143C", border: "#991B1B" },
    green: { name: "Verde", hex: "#228B22", border: "#15803D" },
    purple: { name: "Roxo", hex: "#800080", border: "#6B21A8" },
    gold: { name: "Ouro", hex: "#FFD700", border: "#B8860B" },
    black: { name: "Preto", hex: "#000000", border: "#1F2937" },
    rose: { name: "Rosa", hex: "#FF69B4", border: "#EC4899" },
  };

  // Major feasts
  const FEASTS = [
    { date: "2026-01-01", name: "Circuncisão do Senhor", color: "white" },
    { date: "2026-01-06", name: "Epifania", color: "white" },
    { date: "2026-02-02", name: "Apresentação do Senhor", color: "white" },
    { date: "2026-03-19", name: "São José", color: "white" },
    { date: "2026-03-25", name: "Anunciação", color: "white" },
    { date: "2026-05-01", name: "São José Trabalhador", color: "white" },
    { date: "2026-06-24", name: "Natividade de São João Batista", color: "white" },
    { date: "2026-06-29", name: "São Pedro e São Paulo", color: "red" },
    { date: "2026-08-15", name: "Assunção de Maria", color: "white" },
    { date: "2026-11-01", name: "Todos os Santos", color: "white" },
    { date: "2026-11-02", name: "Finados", color: "black" },
    { date: "2026-12-08", name: "Imaculada Conceição", color: "white" },
    { date: "2026-12-25", name: "Natal do Senhor", color: "white" },
  ];

  // Get current season
  const getCurrentSeason = () => {
    const month = currentMonth.getMonth() + 1;
    if (month >= 11 || month <= 1) return { name: "Advento/Natal", color: "purple" };
    if (month >= 2 && month <= 3) return { name: "Quaresma", color: "purple" };
    if (month >= 4 && month <= 5) return { name: "Páscoa", color: "white" };
    if (month === 6) return { name: "Pentecostes", color: "red" };
    return { name: "Tempo Comum", color: "green" };
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getFeastForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return FEASTS.find((f) => f.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const season = getCurrentSeason();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calendário Litúrgico</h1>
          <p className="text-gray-600">Acompanhe as estações, festas e cores litúrgicas</p>
        </div>

        {/* Current Season Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Estação Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-lg border-4"
                style={{
                  backgroundColor: COLORS[season.color as keyof typeof COLORS].hex,
                  borderColor: COLORS[season.color as keyof typeof COLORS].border,
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{season.name}</p>
                <p className="text-gray-600 mt-1">Cor: {COLORS[season.color as keyof typeof COLORS].name}</p>
                <p className="text-sm text-gray-500 mt-2">Ciclo Litúrgico: Ano {String.fromCharCode(65 + ((new Date().getFullYear() - 1962) % 3))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="feasts">Festas Maiores</TabsTrigger>
            <TabsTrigger value="colors">Cores Litúrgicas</TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</CardTitle>
                    <CardDescription>Clique em um dia para ver detalhes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}

                  {/* Days of month */}
                  {days.map((day) => {
                    const feast = getFeastForDate(day);
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth();

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                        className={`aspect-square rounded-lg p-2 text-sm font-semibold transition-all ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-blue-100"
                            : "hover:bg-gray-100"
                        } ${feast ? "bg-yellow-50 border-2 border-yellow-300" : "border border-gray-200"}`}
                      >
                        <div className="text-gray-900">{day}</div>
                        {feast && <div className="text-xs text-yellow-700 truncate">{feast.name.split(" ")[0]}</div>}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedDate.toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric" })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getFeastForDate(selectedDate.getDate()) ? (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <p className="font-semibold text-yellow-900">{getFeastForDate(selectedDate.getDate())?.name}</p>
                      <p className="text-sm text-yellow-800 mt-1">Festa Maior do Calendário Litúrgico</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="font-semibold text-gray-900">Dia Comum</p>
                      <p className="text-sm text-gray-600 mt-1">Estação: {season.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feasts Tab */}
          <TabsContent value="feasts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Festas Maiores do Ano</CardTitle>
                <CardDescription>Celebrações importantes do calendário litúrgico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FEASTS.map((feast, index) => {
                    const feastDate = new Date(feast.date);
                    const color = COLORS[feast.color as keyof typeof COLORS];
                    return (
                      <div key={index} className="p-4 rounded-lg border-l-4 hover:bg-gray-50" style={{ borderColor: color.hex }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{feast.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{feastDate.toLocaleDateString("pt-BR", { month: "long", day: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{
                                backgroundColor: color.hex,
                                borderColor: color.border,
                              }}
                            ></div>
                            <span className="text-sm font-medium text-gray-600">{color.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cores Litúrgicas</CardTitle>
                <CardDescription>Significados e usos das cores nas celebrações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(COLORS).map(([key, color]) => (
                    <div key={key} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded border-2"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: color.border,
                          }}
                        ></div>
                        <p className="font-semibold text-gray-900">{color.name}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {key === "white" && "Pureza, Alegria, Ressurreição"}
                        {key === "red" && "Martírio, Pentecostes, Amor"}
                        {key === "green" && "Esperança, Crescimento Espiritual"}
                        {key === "purple" && "Penitência, Preparação, Advento"}
                        {key === "gold" && "Solenidade, Glória Divina"}
                        {key === "black" && "Luto, Finados"}
                        {key === "rose" && "Alegria na Penitência"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
