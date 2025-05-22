"use client";

// Import Phaser on client-side only
let Phaser: any;
if (typeof window !== 'undefined') {
  try {
    Phaser = require('phaser');
  } catch (error) {
    console.error("Failed to load Phaser:", error);
    // Provide a fallback to prevent crashes
    Phaser = {
      Scene: class DummyScene {
        constructor() {}
      }
    };
  }
}

export default class PaperclipScene extends Phaser.Scene {
  private paperclip!: Phaser.GameObjects.Container;
  private particleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private clickTextPool: Phaser.GameObjects.Text[] = [];
  private autoclippers: Phaser.GameObjects.Container[] = [];
  private autoClipperGroup?: Phaser.GameObjects.Group;
  private statsText?: Phaser.GameObjects.Text;
  
  // Cache for the game store values
  private clickMultiplier = 1;
  private particleIntensity = 1;
  private showAnimations = true;
  private showFloatingTexts = true;
  private prevAutoclipperCount = 0;
  
  // Performance tracking variables
  private _lastParticleEmit = 0;
  private _lastStateUpdate = 0;
  private _lastTextPoolClear = 0;
  private _lastTextShow = 0;

  constructor() {
    super({ key: 'PaperclipScene' });
  }

  preload() {
    // Load assets
    this.load.svg('paperclip', '/assets/paperclip.svg', { width: 200, height: 200 });
    this.load.svg('paperclip-particle', '/assets/paperclip-particle.svg', { width: 20, height: 20 });
    this.load.svg('autoclipper', '/assets/paperclip.svg', { width: 50, height: 50 });
  }

  create() {
    // Set up the scene center
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create a text button instead of the paperclip sprite
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    // Create a rounded rectangle for the button
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4f46e5, 1); // Primary button color
    graphics.fillRoundedRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight, 8);
    
    // Add text to the button
    const buttonText = this.add.text(centerX, centerY, 'Make Paperclip', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Group the button parts into a container
    this.paperclip = this.add.container(0, 0, [graphics, buttonText]);
    this.paperclip.setSize(buttonWidth, buttonHeight);
    this.paperclip.setInteractive({ useHandCursor: true });

    // Simplified idle animation - only if animations are enabled
    if (this.showAnimations) {
      this.tweens.add({
        targets: this.paperclip,
        y: { from: 0, to: -2 }, // Slight hover effect
        duration: 1500, // Slower animation
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Set up the particle emitter - handle both newer and older Phaser versions
    try {
      if (typeof Phaser.GameObjects.Particles.ParticleEmitterManager !== 'undefined') {
        // Older Phaser version (pre-3.60) - optimized for performance
        const particles = this.add.particles('paperclip-particle');
        this.particleEmitter = particles.createEmitter({
          speed: { min: 80, max: 150 }, // Lower speed range
          angle: { min: 0, max: 360 },
          scale: { start: 0.3, end: 0 }, // Smaller particles
          lifespan: { min: 400, max: 600 }, // Shorter lifespan
          blendMode: 'NORMAL', // Changed from ADD to NORMAL for better performance
          frequency: -1, // emit only when explicitly called
          maxParticles: 15, // Limit max particles
        });
      } else {
        // Newer Phaser version (3.60+) - optimized for performance
        const particles = this.add.particles();
        const emitter = particles.createEmitter({
          key: 'paperclip-particle',
          speed: { min: 80, max: 150 }, // Lower speed range
          angle: { min: 0, max: 360 },
          scale: { start: 0.3, end: 0 }, // Smaller particles
          lifespan: { min: 400, max: 600 }, // Shorter lifespan
          blendMode: 'NORMAL', // Changed from ADD to NORMAL for better performance
          frequency: -1, // emit only when explicitly called
          maxParticles: 15, // Limit max particles
          quantity: 1, // Reduce quantity
        });
        this.particleEmitter = emitter;
      }
    } catch (err) {
      console.warn("Particle system initialization failed:", err);
      // Create a dummy emitter object to prevent application crashes
      this.particleEmitter = {
        explode: () => {} // No-op function
      } as any;
    }

    // Group for autoclippers
    this.autoClipperGroup = this.add.group();

    // Add stats text (for debugging and info)
    this.statsText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 2,
      fontFamily: 'Arial, sans-serif'
    }).setDepth(100);
    if (this.statsText) this.statsText.setVisible(false); // Hide by default

    // Handle paperclip click
    this.paperclip.on('pointerdown', () => {
      // Get the latest values from the store
      this.updateGameStateFromStore();
      
      // Call the global clickPaperclip function from our store
      if (typeof window !== 'undefined' && (window as any).clickPaperclip) {
        (window as any).clickPaperclip();
      }

      // Visual feedback: emit particles based on intensity (with rate limiting)
      if (this.showAnimations && this.particleEmitter) {
        // Limit rate of particle emission to prevent lag
        const now = Date.now();
        const lastEmit = this._lastParticleEmit || 0;
        
        // Only emit particles if enough time has passed (100ms minimum)
        if (now - lastEmit > 100) {
          this._lastParticleEmit = now;
          
          // Significantly reduced particle count
          const particleCount = Math.max(2, Math.floor(5 * this.particleIntensity));
          
          try {
            // Check if it has the explode method (older Phaser version)
            if (typeof this.particleEmitter.explode === 'function') {
              this.particleEmitter.explode(particleCount, this.paperclip.x, this.paperclip.y);
            } 
            // For newer Phaser versions that use emitParticle
            else if (typeof this.particleEmitter.emitParticle === 'function') {
              for (let i = 0; i < particleCount; i++) {
                this.particleEmitter.emitParticle(1, this.paperclip.x, this.paperclip.y);
              }
            }
          } catch (err) {
            console.warn("Particle emission failed:", err);
          }
        }
      }

      // Visual feedback: scale down the button
      if (this.showAnimations) {
        this.tweens.add({
          targets: this.paperclip,
          scaleX: { from: 1, to: 0.97 },
          scaleY: { from: 1, to: 0.97 },
          duration: 50,
          yoyo: true,
          ease: 'Cubic.easeOut',
        });
      }

      // Create floating text showing the value gained
      if (this.showFloatingTexts) {
        const valueText = this.clickMultiplier > 1 ? `+${this.clickMultiplier}` : '+1';
        this.showFloatingText(valueText, this.paperclip.x, this.paperclip.y);
      }
    });

    // Add resize listener to keep the paperclip centered
    this.scale.on('resize', this.handleResize, this);
    
    // Set up a timer to update the game state from store periodically
    this.time.addEvent({
      delay: 1000, // every second
      callback: this.updateGameStateFromStore,
      callbackScope: this,
      loop: true
    });
  }

  private updateGameStateFromStore() {
    if (typeof window === 'undefined') return;
    
    // Rate limit state updates to once per second max
    const now = Date.now();
    if (now - this._lastStateUpdate < 1000 && this._lastStateUpdate !== 0) {
      return;
    }
    this._lastStateUpdate = now;
    
    try {
      // Access the game store through the window object
      const store = (window as any).__ZUSTAND_STORE__;
      if (!store) return;
      
      const state = store.getState();
      
      // Update our cached values
      this.clickMultiplier = state.clickMultiplier || 1;
      this.particleIntensity = state.visualFX?.particleIntensity || 1;
      this.showAnimations = state.visualFX?.clickAnimations !== false;
      this.showFloatingTexts = state.visualFX?.floatingText !== false;
      
      // Update autoclippers visualization - but only if the count changed
      const autoclipperCount = state.autoclippers || 0;
      if (autoclipperCount !== this.prevAutoclipperCount) {
        this.updateAutoclippers(autoclipperCount);
        this.prevAutoclipperCount = autoclipperCount;
      }
      
      // Update stats text - disabled for performance
      /* if (this.statsText) {
        this.statsText.setText(`Multiplier: ${this.clickMultiplier}x | Autoclippers: ${autoclipperCount}`);
      } */
    } catch (error) {
      console.error('Failed to update from game store:', error);
    }
  }
  
  private updateAutoclippers(count: number) {
    // First remove all existing autoclippers
    this.autoclippers.forEach(clipper => clipper.destroy());
    this.autoclippers = [];
    
    if (count <= 0) return;
    
    // Limit visual representations to a very small number to reduce lag
    const maxVisual = Math.min(count, 5); // Reduced from 10 to 5 max visual clippers
    const { width, height } = this.scale;
    
    // Create a circle of autoclippers around the main paperclip
    const radius = 120; // Reduced radius
    for (let i = 0; i < maxVisual; i++) {
      const angle = (i / maxVisual) * Math.PI * 2;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      // Create autoclipper (smaller scale)
      const clipper = this.add.sprite(0, 0, 'autoclipper');
      clipper.setScale(0.3); // Smaller autoclippers
      const container = this.add.container(x, y, [clipper]);
      
      // Only add animation if there are few autoclippers (to reduce lag)
      if (maxVisual <= 3) {
        // Add subtle animation with longer duration
        this.tweens.add({
          targets: container,
          y: y + 5, // Smaller movement range
          duration: 3000, // Slower animation
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        
        // Slower rotation
        this.tweens.add({
          targets: clipper,
          angle: 360,
          duration: 12000, // Slower rotation
          repeat: -1,
          ease: 'Linear',
        });
      }
      
      this.autoclippers.push(container);
    }
  }

  private handleResize() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // For our container-based button, we need to reposition its components
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    // Remove old graphics and text
    // Cast to Container to access removeAll method
    (this.paperclip as Phaser.GameObjects.Container).removeAll(true);
    
    // Recreate the button at the new center position
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4f46e5, 1);
    graphics.fillRoundedRect(centerX - buttonWidth/2, centerY - buttonHeight/2, buttonWidth, buttonHeight, 8);
    
    const buttonText = this.add.text(centerX, centerY, 'Make Paperclip', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Cast to Container to access add method
    (this.paperclip as Phaser.GameObjects.Container).add([graphics, buttonText]);
    
    // Also reposition autoclippers
    this.updateAutoclippers(this.prevAutoclipperCount);
  }

  private showFloatingText(text: string, x: number, y: number) {
    // Limit the number of floating texts for performance
    const now = Date.now();
    
    // Rate limiting - only show text every 300ms max
    if (now - (this._lastTextShow || 0) < 300) {
      return;
    }
    this._lastTextShow = now;
    
    // Limit text pool size
    if (this.clickTextPool.length > 10) {
      // Clean up excess text objects periodically
      if (now - this._lastTextPoolClear > 10000) { // Every 10 seconds
        this._lastTextPoolClear = now;
        // Remove half of the pooled text objects
        const toRemove = Math.floor(this.clickTextPool.length / 2);
        for (let i = 0; i < toRemove; i++) {
          const text = this.clickTextPool.pop();
          if (text) text.destroy();
        }
      }
    }
    
    // Add a smaller random offset to prevent overlapping texts
    const offsetX = (Math.random() - 0.5) * 20;
    
    // Reuse a text object from the pool or create a new one
    let floatingText: Phaser.GameObjects.Text;
    if (this.clickTextPool.length > 0) {
      floatingText = this.clickTextPool.pop()!;
      floatingText.setPosition(x + offsetX, y);
      floatingText.setAlpha(1);
      floatingText.setText(text);
      floatingText.setVisible(true);
    } else {
      floatingText = this.add.text(x + offsetX, y, text, {
        fontSize: '18px', // Smaller text
        color: '#fff',
        stroke: '#000',
        strokeThickness: 2, // Thinner stroke
        fontFamily: 'Arial, sans-serif'
      }).setOrigin(0.5);
    }

    // Animate the text floating upward - shorter animation
    this.tweens.add({
      targets: floatingText,
      y: y - 40, // Shorter distance
      alpha: 0,
      duration: 700, // Faster animation
      ease: 'Cubic.easeOut',
      onComplete: () => {
        floatingText.setVisible(false);
        if (this.clickTextPool.length < 15) { // Limit pool size
          this.clickTextPool.push(floatingText);
        } else {
          floatingText.destroy(); // Destroy if pool is full
        }
      }
    });
  }

  update() {
    // Make the Zustand store accessible to the Phaser scene
    if (typeof window !== 'undefined' && !(window as any).__ZUSTAND_STORE__) {
      // Try to detect and expose the Zustand store for our internal use
      const storeElements = document.querySelectorAll('[data-zustand-store]');
      if (storeElements.length > 0) {
        const storeElement = storeElements[0] as any;
        if (storeElement.__store) {
          (window as any).__ZUSTAND_STORE__ = storeElement.__store;
        }
      }
    }
  }
}