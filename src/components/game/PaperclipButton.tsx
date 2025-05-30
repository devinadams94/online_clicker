"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function PaperclipButton() {
  const { clickPaperclip, spaceAgeUnlocked } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, tx: number, ty: number, size: number}[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Don't allow clicking if space age is unlocked
    if (spaceAgeUnlocked) return;
    
    // Get the click position for particles
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create particles
    const newParticles = Array(5).fill(0).map((_, i) => ({
      id: clickCount + i,
      x,
      y,
      tx: -50 + Math.random() * 100, // Random x translation -50px to 50px
      ty: -80 - Math.random() * 50,  // Random y translation -80px to -130px (always up)
      size: 3 + Math.random() * 6
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    setClickCount(prev => prev + 5);
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 600);
    
    // Button animation
    clickPaperclip();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <button
        onClick={handleClick}
        disabled={spaceAgeUnlocked}
        className={`w-full py-3 text-lg font-semibold rounded-lg
          transition-all duration-150 transform relative overflow-hidden
          ${isAnimating ? "scale-95" : "scale-100"}
          ${spaceAgeUnlocked 
            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" 
            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.7)] active:shadow-[0_0_10px_rgba(74,222,128,0.3)]"}`}
        aria-label="Create paperclip"
      >
        {/* Pulse effect */}
        <span className={`absolute inset-0 bg-white opacity-30 rounded-md ${isAnimating ? 'animate-ping' : 'hidden'}`}></span>
        
        {/* Animated particles */}
        {particles.map(particle => (
          <span 
            key={particle.id}
            className={`absolute inline-block rounded-full bg-green-300 opacity-80 pointer-events-none animate-fly-out shadow-[0_0_10px_rgba(134,239,172,0.8)]`}
            style={{
              left: `${particle.x}px`, 
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
            } as React.CSSProperties}
          />
        ))}
        
        <span className={`relative ${isAnimating ? "text-white" : ""}`}>
          {spaceAgeUnlocked ? "Production Halted" : "Make Paperclip"}
        </span>
      </button>
    </div>
  );
}