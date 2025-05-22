"use client";

// Conditionally import Phaser
let Phaser: any;
if (typeof window !== 'undefined') {
  try {
    Phaser = require('phaser');
  } catch (error) {
    // Provide fallback values for the constants we need
    Phaser = {
      CANVAS: 'canvas',
      Scale: {
        RESIZE: 'resize'
      }
    };
  }
}

// Default configuration for our Phaser game
export const DEFAULT_PHASER_CONFIG: any = {
  type: typeof window !== 'undefined' ? Phaser?.CANVAS : null, // Use CANVAS instead of AUTO to avoid WebGL context issues
  parent: 'phaser-game',
  backgroundColor: 'transparent',
  scale: {
    mode: typeof window !== 'undefined' ? Phaser?.Scale.RESIZE : null,
    width: '100%',
    height: '100%',
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }, // Reduced gravity for better performance
      debug: false,
    },
  },
  transparent: true,
  canvasStyle: 'display: block; width: 100%; height: 100%;',
  // Improved performance settings
  render: {
    pixelArt: false,
    antialias: false, // Disable antialiasing for better performance
    roundPixels: true,
    powerPreference: 'default' // low-power mode
  },
  // Drastically reduce the fps for better performance
  fps: {
    target: 30, // Lower FPS target (was 60 by default)
    forceSetTimeOut: true
  },
  // Disable unnecessary systems
  audio: false, // Disable audio if not using it
  banner: false, // Disable the Phaser banner
  disableContextMenu: true, // Prevent right-click menu
};