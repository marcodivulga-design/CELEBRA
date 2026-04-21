import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Scissors, Volume2, Zap } from 'lucide-react';

interface AudioEditorProps {
  audioUrl: string;
  onSave?: (editedAudioUrl: string) => void;
}

export function AudioEditor({ audioUrl, onSave }: AudioEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [selectedEffect, setSelectedEffect] = useState('none');

  useEffect(() => {
    // Simulação de carregamento de áudio
    console.log('Carregando áudio:', audioUrl);
    setDuration(180); // 3 minutos
    setEndTime(180);
  }, [audioUrl]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausado' : 'Reproduzindo');
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    console.log('Áudio resetado');
  };

  const handleTrim = () => {
    console.log('Áudio cortado:', { startTime, endTime });
    alert(`Áudio cortado de ${startTime}s a ${endTime}s`);
  };

  const handleApplyEffect = () => {
    console.log('Efeito aplicado:', selectedEffect);
    alert(`Efeito "${selectedEffect}" aplicado ao áudio`);
  };

  const handleSave = () => {
    console.log('Áudio salvo com edições');
    if (onSave) {
      onSave(audioUrl); // Em produção, retornaria URL do áudio editado
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg space-y-6">
      {/* Waveform Visualization */}
      <div ref={containerRef} className="bg-gray-800 rounded-lg p-4 min-h-24 flex items-center justify-center">
        <div className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded opacity-50 flex items-center justify-center">
          <span className="text-sm text-gray-300">Visualização de Onda de Áudio</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlay}
          className="bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pausar' : 'Reproduzir'}
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Resetar
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            onValueChange={(value) => setCurrentTime(value[0])}
            max={duration}
            step={0.1}
            className="flex-1"
          />
          <span className="text-sm text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-4">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-gray-400 w-12">{volume}%</span>
      </div>

      {/* Trim Controls */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Scissors className="w-4 h-4" />
          Cortar Áudio
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Início (s)</label>
            <Slider
              value={[startTime]}
              onValueChange={(value) => setStartTime(value[0])}
              max={duration}
              step={0.1}
            />
            <span className="text-xs text-gray-500">{formatTime(startTime)}</span>
          </div>
          <div>
            <label className="text-sm text-gray-400">Fim (s)</label>
            <Slider
              value={[endTime]}
              onValueChange={(value) => setEndTime(value[0])}
              max={duration}
              step={0.1}
            />
            <span className="text-xs text-gray-500">{formatTime(endTime)}</span>
          </div>
        </div>
        <Button onClick={handleTrim} className="w-full bg-amber-600 hover:bg-amber-700" size="sm">
          Aplicar Corte
        </Button>
      </div>

      {/* Effects */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Efeitos de Áudio
        </h3>
        <select
          value={selectedEffect}
          onChange={(e) => setSelectedEffect(e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
        >
          <option value="none">Nenhum efeito</option>
          <option value="fade-in">Fade In (Entrada suave)</option>
          <option value="fade-out">Fade Out (Saída suave)</option>
          <option value="normalize">Normalizar (Aumentar volume)</option>
          <option value="compress">Compressão (Reduzir dinâmica)</option>
          <option value="reverb">Reverberação (Eco)</option>
          <option value="eq-bass">EQ Bass (Aumentar graves)</option>
          <option value="eq-treble">EQ Treble (Aumentar agudos)</option>
        </select>
        <Button onClick={handleApplyEffect} className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
          Aplicar Efeito
        </Button>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
          Salvar Áudio Editado
        </Button>
        <Button variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>

      {/* Info */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-3 rounded text-sm text-blue-200">
        <p>💡 Dica: Use os controles acima para editar o áudio. Você pode cortar, aplicar efeitos e ajustar o volume.</p>
      </div>
    </div>
  );
}
