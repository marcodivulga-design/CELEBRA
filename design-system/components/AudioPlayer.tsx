import React, { useRef, useState, useEffect } from "react";
import CelebraButton from "./CelebraButton";

interface AudioPlayerProps {
  audioUrl?: string;
  title: string;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  ({ audioUrl, title, duration = 0, onPlay, onPause, onEnded }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    const handlePlayPause = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };

    const formatTime = (time: number) => {
      if (!time || isNaN(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    return (
      <div
        ref={ref}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-purple-200 dark:border-slate-700"
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {title}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-2 bg-purple-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <CelebraButton
                variant="primary"
                size="sm"
                onClick={handlePlayPause}
                className="flex-shrink-0"
              >
                {isPlaying ? "⏸" : "▶"}
              </CelebraButton>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {isPlaying ? "Reproduzindo" : "Pausado"}
              </span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-purple-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          {/* Status */}
          {!audioUrl && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                Nenhum arquivo de áudio disponível
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
