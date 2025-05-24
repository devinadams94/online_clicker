"use client";

import { useEffect, useRef } from 'react';
import useGameStore from '@/lib/gameStore';
import { DEFAULT_PHASER_CONFIG } from '@/lib/phaserConfig';
// import dynamic from 'next/dynamic';

// Import Phaser and PaperclipScene only on client side
let Phaser: any;
let PaperclipScene: any;

if (typeof window !== 'undefined') {
  try {
    // Use a relative path to ensure the module can be found
    Phaser = require('phaser');
    // Make sure to use the correct path to PaperclipScene
    PaperclipScene = require('../../scenes/PaperclipScene').default;
  } catch (error) {
    console.error("Failed to load Phaser or PaperclipScene:", error);
  }
}

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get game actions and state from Zustand
  const gameStore = useGameStore();
  const { clickPaperclip } = gameStore;

  useEffect(() => {
    // Check if the game has already been initialized
    if (gameRef.current || typeof window === 'undefined') {
      return;
    }

    // Clean up WebGL contexts before creating a new one
    const cleanUpWebGLContexts = () => {
      try {
        // Get all canvas elements
        const canvases = document.querySelectorAll('canvas');
        
        // Look for inactive WebGL canvases and clean them up
        canvases.forEach(canvas => {
          if (canvas && !canvas.parentElement && 
              (canvas.width === 0 || canvas.height === 0 || !canvas.isConnected)) {
            // Remove the canvas from DOM
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
            
            // Force garbage collection on WebGL context
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl && 'getExtension' in gl) {
              (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
            }
          }
        });
      } catch (err) {
        console.warn('Context cleanup error:', err);
      }
    };

    // Clean up WebGL contexts
    cleanUpWebGLContexts();

    // Make sure Phaser is loaded and the container is ready
    if (Phaser && PaperclipScene && containerRef.current) {
      try {
        // Mark that we're attempting to load Phaser
        (window as any).PHASER_LOADING = true;
        
        // Custom config extending the default
        const config = {
          ...DEFAULT_PHASER_CONFIG,
          parent: containerRef.current,
          scene: [PaperclipScene],
          // Ensure we're using a single well-managed canvas renderer
          canvas: document.getElementById('paperclip-game-canvas') as HTMLCanvasElement || undefined,
        };

        // Initialize the Phaser game
        gameRef.current = new Phaser.Game(config);

        // Make the clickPaperclip function available to Phaser scenes
        (window as any).clickPaperclip = clickPaperclip;
        
        // Expose the Zustand store to the Phaser scene
        (window as any).__ZUSTAND_STORE__ = {
          getState: () => gameStore,
          subscribe: (callback: () => void) => {
            try {
              const unsubscribe = useGameStore.subscribe(callback);
              return unsubscribe;
            } catch (err) {
              console.error("Failed to subscribe to game store:", err);
              return () => {}; // Return empty function as fallback
            }
          }
        };
        
        // Mark Phaser as successfully loaded
        (window as any).PHASER_LOADED = true;
        delete (window as any).PHASER_LOADING;
        
      } catch (err) {
        console.error("Failed to initialize Phaser:", err);
        const errorEvent = new Event('phaser-load-error');
        window.dispatchEvent(errorEvent);
      }
    } else {
      // If Phaser or PaperclipScene couldn't be loaded, trigger error event
      if (typeof window !== 'undefined' && !(window as any).PHASER_LOADING) {
        console.error("Could not load Phaser or PaperclipScene");
        const errorEvent = new Event('phaser-load-error');
        window.dispatchEvent(errorEvent);
      }
    }

    // Cleanup function to destroy the game when the component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      
      delete (window as any).__ZUSTAND_STORE__;
    };
  }, [clickPaperclip, gameStore]);

  return (
    <div 
      ref={containerRef} 
      id="phaser-game" 
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: '300px' }} // Reduced height
      data-zustand-store="true"
    >
      {/* Persistent canvas element for Phaser to reuse */}
      <canvas id="paperclip-game-canvas" className="w-full h-full" style={{ display: 'none' }} />
    </div>
  );
}