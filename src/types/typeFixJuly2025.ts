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
  
  // Add saveGameNow and other properties to Window interface
  interface Window {
    saveGameNow?: () => Promise<void>;
    PHASER_LOADING?: boolean;
    PHASER_LOADED?: boolean;
    __ZUSTAND_STORE__?: {
      getState: () => any;
      subscribe: (callback: () => void) => () => void;
    };
    __pendingCpuUpgrade?: {
      cost: number;
      level: number;
      timestamp: number;
    };
    __pendingMemoryUpgrade?: {
      cost: number;
      max: number;
      timestamp: number;
    };
    __pendingOpsUpdate?: {
      current: number;
      max: number;
      timestamp: number;
    };
    clickPaperclip?: () => void;
  }
}

// Add types for GameStoreFunctions with space-related properties
declare module '@/lib/gameStore' {
  interface GameStoreFunctions {
    // Properties that might be missing
    miningEfficiency?: number;
    droneEfficiency?: number;
    factoryEfficiency?: number;
    explorationSpeed?: number;
    nanobotRepairEnabled?: boolean;
    honor?: number;
    battlesWon?: number;
    autoBattleEnabled?: boolean;
    autoBattleUnlocked?: boolean;
    battleDifficulty?: number;
    aerogradePaperclips?: number;
    unlockedSpaceUpgrades?: string[];
    autoDrones?: boolean;
  }
}

export {};