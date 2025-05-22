// This file contains type fixes for July 2025

// Fix for Phaser types
declare global {
  interface Sprite {
    removeAll?: () => void;
    add?: (...args: any[]) => any;
  }

  // Fix for Canvas context
  interface CanvasRenderingContext2D {
    getExtension?: (name: string) => any;
  }
  
  // Add saveGameNow to Window interface
  interface Window {
    saveGameNow?: () => Promise<void>;
  }
}

// Fix for Zustand persist - uncomment when needed
/*
declare module 'zustand/middleware' {
  export function persist<T>(
    config: (set: any, get: any, api: any) => T,
    options: any
  ): (set: any, get: any, api: any) => T;
}
*/

export {};