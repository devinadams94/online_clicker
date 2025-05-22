"use client";

import { useState } from 'react';
import useGameStore from '@/lib/gameStore';

export default function FallbackClicker() {
  const { clickPaperclip, clickMultiplier } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    clickPaperclip();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 mb-2">Fallback Mode</p>
        <p className="text-xs text-gray-400">Phaser game engine couldn't load</p>
      </div>
      
      <button
        onClick={handleClick}
        className={`w-full btn btn-primary py-3 text-lg font-semibold
          transition-transform duration-100 transform ${isAnimating ? 'scale-95' : 'scale-100'}`}
        aria-label="Create paperclip"
      >
        Make Paperclip
      </button>
      
      <p className="text-sm text-gray-500 mt-3">Current multiplier: {clickMultiplier}x</p>
      
      <button 
        className="mt-6 text-xs text-blue-500 hover:text-blue-700"
        onClick={() => window.location.reload()}
      >
        Try loading Phaser again
      </button>
    </div>
  );
}