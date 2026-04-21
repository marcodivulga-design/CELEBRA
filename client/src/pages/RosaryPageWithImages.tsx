import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

const ROSARY_IMAGE = "https://webdev-static-assets-prod.s3.us-east-1.amazonaws.com/hero-hands-prayer.png";

const mysteries = [
  {
    name: "Mistérios Gozosos",
    day: "Segunda e Sábado",
    color: "bg-green-100 border-green-300",
    beads: [
      "Anunciação",
      "Visitação",
      "Nascimento de Jesus",
      "Apresentação de Jesus",
      "Encontro de Jesus no Templo",
    ],
  },
  {
    name: "Mistérios Luminosos",
    day: "Quinta",
    color: "bg-yellow-100 border-yellow-300",
    beads: [
      "Batismo de Jesus",
      "Bodas de Caná",
      "Proclamação do Reino",
      "Transfiguração",
      "Instituição da Eucaristia",
    ],
  },
  {
    name: "Mistérios Dolorosos",
    day: "Terça e Sexta",
    color: "bg-red-100 border-red-300",
    beads: [
      "Agonia no Horto",
      "Flagelação",
      "Coroação de Espinhos",
      "Carregamento da Cruz",
      "Crucifixão",
    ],
  },
  {
    name: "Mistérios Gloriosos",
    day: "Quarta e Domingo",
    color: "bg-purple-100 border-purple-300",
    beads: [
      "Ressurreição",
      "Ascensão",
      "Descida do Espírito Santo",
      "Assunção de Maria",
      "Coroação de Maria",
    ],
  },
];

export default function RosaryPage() {
  const [selectedMystery, setSelectedMystery] = useState(0);
  const [currentBead, setCurrentBead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mystery = mysteries[selectedMystery];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50">
      {/* Hero Section with Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={ROSARY_IMAGE}
          alt="Rosário Digital"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
          <div className="w-full p-8">
            <h1 className="text-4xl font-bold text-white">Rosário Digital</h1>
            <p className="text-blue-100">Reze o rosário com guia interativo</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Mystery Selection */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mysteries.map((m, idx) => (
            <Button
              key={idx}
              onClick={() => {
                setSelectedMystery(idx);
                setCurrentBead(0);
              }}
              variant={selectedMystery === idx ? "default" : "outline"}
              className={`h-auto p-4 text-left ${
                selectedMystery === idx
                  ? "bg-blue-600 text-white"
                  : "bg-white/80 text-blue-900 border-blue-200"
              }`}
            >
              <div>
                <div className="font-bold">{m.name}</div>
                <div className="text-sm opacity-75">{m.day}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Current Mystery */}
        <Card className={`mb-8 p-8 border-2 ${mystery.color}`}>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">{mystery.name}</h2>
          <p className="text-sm text-gray-600 mb-6">Dia: {mystery.day}</p>

          {/* Beads Grid */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {mystery.beads.map((bead, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBead(idx)}
                className={`aspect-square rounded-full font-bold text-sm transition-all ${
                  currentBead === idx
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : "bg-white/60 text-blue-900 hover:bg-white/80"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Current Bead Info */}
          <div className="bg-white/60 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Mistério {currentBead + 1} de {mystery.beads.length}</p>
            <h3 className="text-2xl font-bold text-blue-900">{mystery.beads[currentBead]}</h3>
          </div>

          {/* Prayer Guide */}
          <div className="space-y-4 mb-6">
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Padre Nosso</p>
              <p className="text-sm text-gray-700">
                Pai Nosso, que estais nos céus, santificado seja o vosso nome...
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">10 Ave-Marias</p>
              <p className="text-sm text-gray-700">
                Ave Maria, cheia de graça, o Senhor é convosco...
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Glória ao Pai</p>
              <p className="text-sm text-gray-700">
                Glória ao Pai, ao Filho e ao Espírito Santo...
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Reproduzir
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentBead(0)}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => setSelectedMystery(Math.max(0, selectedMystery - 1))}
            disabled={selectedMystery === 0}
          >
            ← Mistério Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedMystery(Math.min(mysteries.length - 1, selectedMystery + 1))}
            disabled={selectedMystery === mysteries.length - 1}
          >
            Próximo Mistério →
          </Button>
        </div>
      </div>
    </div>
  );
}
