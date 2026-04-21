import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROSARY_MYSTERIES = {
  joyful: [
    { name: "Anunciação", hail_marys: 10, description: "O anjo Gabriel anuncia a Maria que será mãe de Jesus" },
    { name: "Visitação", hail_marys: 10, description: "Maria visita sua prima Isabel" },
    { name: "Nascimento de Jesus", hail_marys: 10, description: "Jesus nasce em Belém" },
    { name: "Apresentação de Jesus", hail_marys: 10, description: "Jesus é apresentado no templo" },
    { name: "Encontro de Jesus no Templo", hail_marys: 10, description: "Jesus é encontrado no templo aos 12 anos" }
  ],
  sorrowful: [
    { name: "Agonia no Horto", hail_marys: 10, description: "Jesus reza no Getsêmani" },
    { name: "Flagelação", hail_marys: 10, description: "Jesus é flagelado" },
    { name: "Coroação de Espinhos", hail_marys: 10, description: "Jesus é coroado de espinhos" },
    { name: "Carregamento da Cruz", hail_marys: 10, description: "Jesus carrega a cruz" },
    { name: "Crucifixão", hail_marys: 10, description: "Jesus é crucificado" }
  ],
  glorious: [
    { name: "Ressurreição", hail_marys: 10, description: "Jesus ressuscita dos mortos" },
    { name: "Ascensão", hail_marys: 10, description: "Jesus sobe aos céus" },
    { name: "Descida do Espírito Santo", hail_marys: 10, description: "O Espírito Santo desce sobre os apóstolos" },
    { name: "Assunção de Maria", hail_marys: 10, description: "Maria é assunta aos céus" },
    { name: "Coroação de Maria", hail_marys: 10, description: "Maria é coroada rainha dos céus" }
  ]
};

const ROSARY_PRAYERS = {
  signalCross: "Em nome do Pai, do Filho e do Espírito Santo. Amém.",
  creed: "Creio em Deus Pai todo-poderoso, criador do céu e da terra...",
  ourFather: "Pai nosso que estais nos céus, santificado seja o vosso nome...",
  hailMary: "Ave Maria, cheia de graça, o Senhor é convosco...",
  gloryBe: "Glória seja ao Pai, ao Filho e ao Espírito Santo...",
  hailHolyQueen: "Salve Rainha, mãe de misericórdia, vida, doçura e esperança nossa..."
};

export default function RosaryPage() {
  const [selectedMystery, setSelectedMystery] = useState<"joyful" | "sorrowful" | "glorious">("joyful");
  const [currentMysteryIndex, setCurrentMysteryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beadCount, setBeadCount] = useState(0);
  const [showPrayer, setShowPrayer] = useState<keyof typeof ROSARY_PRAYERS | null>(null);

  const mysteries = ROSARY_MYSTERIES[selectedMystery];
  const currentMystery = mysteries[currentMysteryIndex];

  const mysteryColors = {
    joyful: "from-pink-100 to-pink-200 border-pink-400",
    sorrowful: "from-purple-100 to-purple-200 border-purple-400",
    glorious: "from-yellow-100 to-yellow-200 border-yellow-400"
  };

  const handleNextMystery = () => {
    if (currentMysteryIndex < mysteries.length - 1) {
      setCurrentMysteryIndex(currentMysteryIndex + 1);
      setBeadCount(0);
    }
  };

  const handlePrevMystery = () => {
    if (currentMysteryIndex > 0) {
      setCurrentMysteryIndex(currentMysteryIndex - 1);
      setBeadCount(0);
    }
  };

  const handleBeadClick = () => {
    if (beadCount < currentMystery.hail_marys) {
      setBeadCount(beadCount + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-900 mb-2 font-playfair">
            Rosário Digital
          </h1>
          <p className="text-gray-600">
            Reze o rosário com orientação passo a passo
          </p>
        </div>

        {/* Mystery Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { key: "joyful", label: "Mistérios Gozosos", emoji: "🌸" },
            { key: "sorrowful", label: "Mistérios Dolorosos", emoji: "💜" },
            { key: "glorious", label: "Mistérios Gloriosos", emoji: "✨" }
          ].map(m => (
            <button
              key={m.key}
              onClick={() => {
                setSelectedMystery(m.key as any);
                setCurrentMysteryIndex(0);
                setBeadCount(0);
              }}
              className={`p-4 rounded-lg font-semibold transition-all ${
                selectedMystery === m.key
                  ? "bg-sky-500 text-white shadow-lg"
                  : "bg-white border-2 border-sky-200 text-sky-900 hover:border-sky-400"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className={`bg-gradient-to-br ${mysteryColors[selectedMystery]} rounded-2xl shadow-lg p-8 mb-8 border-l-4`}>
          {/* Current Mystery */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Mistério {currentMysteryIndex + 1} de {mysteries.length}
            </p>
            <h2 className="text-3xl font-bold text-sky-900 mb-2 font-playfair">
              {currentMystery.name}
            </h2>
            <p className="text-gray-700 italic">
              {currentMystery.description}
            </p>
          </div>

          {/* Bead Counter */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-4">
              Ave Marias: {beadCount} / {currentMystery.hail_marys}
            </p>
            <div className="flex justify-center gap-2 flex-wrap mb-4">
              {Array.from({ length: currentMystery.hail_marys }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBeadCount(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    i < beadCount
                      ? "bg-sky-500 text-white shadow-lg scale-110"
                      : "bg-white border-2 border-sky-300 text-sky-600 hover:bg-sky-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              onClick={handleBeadClick}
              disabled={beadCount >= currentMystery.hail_marys}
              className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
            >
              Próxima Ave Maria
            </Button>
          </div>

          {/* Prayer Display */}
          {showPrayer && (
            <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-sky-400">
              <p className="text-gray-700 leading-relaxed italic">
                {ROSARY_PRAYERS[showPrayer]}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={handlePrevMystery}
              disabled={currentMysteryIndex === 0}
              className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white disabled:opacity-50"
            >
              <SkipBack className="w-5 h-5" />
              Anterior
            </Button>

            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Iniciar
                </>
              )}
            </Button>

            <Button
              onClick={handleNextMystery}
              disabled={currentMysteryIndex === mysteries.length - 1}
              className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white disabled:opacity-50"
            >
              Próximo
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Prayer Buttons */}
          <div className="grid md:grid-cols-3 gap-2">
            {[
              { key: "ourFather", label: "Pai Nosso", emoji: "🙏" },
              { key: "hailMary", label: "Ave Maria", emoji: "💙" },
              { key: "gloryBe", label: "Glória Seja", emoji: "✨" }
            ].map(p => (
              <button
                key={p.key}
                onClick={() => setShowPrayer(p.key as any)}
                className="p-3 bg-white rounded-lg font-semibold text-sky-600 hover:bg-sky-100 transition-all border border-sky-300"
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg p-6 shadow border border-sky-200">
          <h3 className="font-bold text-sky-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Dicas para Rezar o Rosário
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>✓ Encontre um local tranquilo para rezar</li>
            <li>✓ Comece com o sinal da cruz</li>
            <li>✓ Reze o Credo, Pai Nosso e 3 Ave Marias</li>
            <li>✓ Para cada mistério, reze 1 Pai Nosso e 10 Ave Marias</li>
            <li>✓ Termine com a Salve Rainha</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
