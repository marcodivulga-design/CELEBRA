import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = 'Música',
  artist = 'Artista',
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 space-y-3">
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      {/* Song Info */}
      <div className="text-center">
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={!audioUrl}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Play/Pause */}
        <Button
          size="sm"
          variant="outline"
          onClick={togglePlayPause}
          disabled={!audioUrl}
          className="flex-1"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-1" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" />
              Tocar
            </>
          )}
        </Button>

        {/* Skip Back */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, currentTime - 5);
            }
          }}
          disabled={!audioUrl}
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        {/* Skip Forward */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.min(duration, currentTime + 5);
            }
          }}
          disabled={!audioUrl}
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        {/* Volume Control */}
        <div className="flex items-center gap-1 flex-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMute}
            disabled={!audioUrl}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={!audioUrl}
          />
        </div>
      </div>
    </div>
  );
};
