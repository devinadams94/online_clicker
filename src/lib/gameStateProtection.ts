// Game State Protection - Prevents critical values from being reset to 0

interface ProtectedValues {
  paperclips: number;
  money: number;
  wire: number;
  wirePerSpool: number;
  spoolSizeLevel: number;
  autoclippers: number;
  totalPaperclipsMade: number;
  wireHarvesters: number;
  oreHarvesters: number;
  factories: number;
}

class GameStateProtection {
  private static instance: GameStateProtection;
  private protectedValues: ProtectedValues | null = null;
  private isProtected: boolean = false;
  
  private constructor() {}
  
  static getInstance(): GameStateProtection {
    if (!GameStateProtection.instance) {
      GameStateProtection.instance = new GameStateProtection();
    }
    return GameStateProtection.instance;
  }
  
  // Protect current values from being reset
  protect(values: Partial<ProtectedValues>) {
    console.log('[GameStateProtection] Protecting values:', values);
    this.protectedValues = { ...this.protectedValues, ...values } as ProtectedValues;
    this.isProtected = true;
    
    // Auto-disable protection after 5 seconds
    setTimeout(() => {
      this.isProtected = false;
      console.log('[GameStateProtection] Protection expired');
    }, 5000);
  }
  
  // Check if a state update would reset protected values
  validateUpdate(newState: any): any {
    if (!this.isProtected || !this.protectedValues) {
      return newState;
    }
    
    const corrected = { ...newState };
    let hasCorrected = false;
    
    // Check each protected value
    const fields: (keyof ProtectedValues)[] = [
      'paperclips', 'money', 'wire', 'wirePerSpool', 'spoolSizeLevel',
      'autoclippers', 'totalPaperclipsMade', 'wireHarvesters', 'oreHarvesters', 'factories'
    ];
    
    for (const field of fields) {
      if (field in newState && 
          this.protectedValues[field] !== undefined &&
          this.protectedValues[field] > 0 && 
          newState[field] === 0) {
        console.warn(`[GameStateProtection] Preventing reset of ${field} from ${this.protectedValues[field]} to 0`);
        corrected[field] = this.protectedValues[field];
        hasCorrected = true;
      }
    }
    
    if (hasCorrected) {
      console.log('[GameStateProtection] Corrected state:', corrected);
    }
    
    return corrected;
  }
  
  // Clear protection
  clear() {
    this.protectedValues = null;
    this.isProtected = false;
  }
}

export const gameStateProtection = GameStateProtection.getInstance();