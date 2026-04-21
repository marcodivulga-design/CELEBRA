import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Music, Calendar } from "lucide-react";

interface Church {
  id: number;
  name: string;
  location: string;
  image: string;
  members: number;
  celebrations: number;
  ministries: string[];
  description: string;
}

const mockChurches: Church[] = [
  {
    id: 1,
    name: "Igreja Matriz de São José",
    location: "Centro, Brasília - DF",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-light-cathedral.png",
    members: 245,
    celebrations: 12,
    ministries: ["Música", "Catequese", "Pastoral Social"],
    description: "Igreja histórica com mais de 50 anos de tradição e comunidade ativa.",
  },
  {
    id: 2,
    name: "Paróquia Nossa Senhora da Paz",
    location: "Asa Sul, Brasília - DF",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-praying-church.png",
    members: 180,
    celebrations: 8,
    ministries: ["Canto Litúrgico", "Juventude", "Acolhimento"],
    description: "Comunidade jovem e dinâmica focada em evangelização e acolhimento.",
  },
  {
    id: 3,
    name: "Santuário de São Tarcísio",
    location: "Lago Sul, Brasília - DF",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-community-celebration.png",
    members: 320,
    celebrations: 15,
    ministries: ["Música Coral", "Diaconia", "Liturgia"],
    description: "Santuário com forte presença de música coral e celebrações especiais.",
  },
  {
    id: 4,
    name: "Capelania Universitária",
    location: "Campus UnB, Brasília - DF",
    image: "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-nature-spirituality.png",
    members: 150,
    celebrations: 6,
    ministries: ["Pastoral Universitária", "Música", "Espiritualidade"],
    description: "Espaço de acolhimento e formação espiritual para a comunidade universitária.",
  },
];

export default function ChurchGalleryPage() {
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredChurches = mockChurches.filter(
    (church) =>
      church.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Galeria de Igrejas e Paróquias
          </h1>
          <p className="text-blue-700">
            Conheça as comunidades católicas que usam CELEBRA
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-blue-200 text-blue-900 placeholder-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Grade
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Lista
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-2">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChurches.map((church) => (
                  <Card
                    key={church.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-white"
                    onClick={() => setSelectedChurch(church)}
                  >
                    <div className="aspect-video overflow-hidden bg-blue-100">
                      <img
                        src={church.image}
                        alt={church.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-blue-900 mb-1">
                        {church.name}
                      </h3>
                      <p className="text-sm text-blue-600 flex items-center gap-1 mb-3">
                        <MapPin className="w-4 h-4" />
                        {church.location}
                      </p>
                      <div className="flex gap-4 text-sm text-blue-700">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {church.members}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {church.celebrations}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChurches.map((church) => (
                  <Card
                    key={church.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-white p-4 flex gap-4"
                    onClick={() => setSelectedChurch(church)}
                  >
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-blue-100">
                      <img
                        src={church.image}
                        alt={church.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 mb-1">
                        {church.name}
                      </h3>
                      <p className="text-sm text-blue-600 flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        {church.location}
                      </p>
                      <p className="text-sm text-blue-700 mb-3">
                        {church.description}
                      </p>
                      <div className="flex gap-6 text-sm text-blue-700">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {church.members} membros
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {church.celebrations} celebrações
                        </span>
                        <span className="flex items-center gap-1">
                          <Music className="w-4 h-4" />
                          {church.ministries.length} ministérios
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div>
            {selectedChurch ? (
              <Card className="sticky top-4 border-blue-200 bg-white overflow-hidden">
                <div className="aspect-video overflow-hidden bg-blue-100">
                  <img
                    src={selectedChurch.image}
                    alt={selectedChurch.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    {selectedChurch.name}
                  </h2>
                  <p className="text-blue-600 flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" />
                    {selectedChurch.location}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 font-semibold mb-1">
                        Descrição
                      </p>
                      <p className="text-blue-900">
                        {selectedChurch.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-900">
                          {selectedChurch.members}
                        </p>
                        <p className="text-xs text-blue-600">Membros</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-900">
                          {selectedChurch.celebrations}
                        </p>
                        <p className="text-xs text-blue-600">Celebrações</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 font-semibold mb-2">
                        Ministérios
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedChurch.ministries.map((ministry, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            {ministry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Ver Detalhes Completos
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="sticky top-4 border-blue-200 bg-blue-50 p-6 text-center">
                <Music className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-blue-700 font-semibold">
                  Selecione uma igreja para ver detalhes
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
