import React from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioControlProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function AudioControl({ isPlaying, onToggle }: AudioControlProps) {
  return (
    <button
      onClick={onToggle}
      className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6" />
      ) : (
        <Play className="w-6 h-6" />
      )}
    </button>
  );
}