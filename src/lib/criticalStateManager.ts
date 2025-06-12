// Critical State Manager - Ensures critical values are never lost
// This provides a robust fallback system for CPU/memory values

interface CriticalValues {
  cpuLevel: number;
  cpuCost: number;
  memory: number;
  memoryMax: number;
  memoryCost: number;
  memoryRegenRate: number;
}

const CRITICAL_STATE_KEY = 'paperclip-critical-state';
const CRITICAL_STATE_BACKUP_KEY = 'paperclip-critical-state-backup';

export class CriticalStateManager {
  private static instance: CriticalStateManager;
  private criticalValues: CriticalValues;
  private lastSaveTime: number = 0;
  
  private constructor() {
    this.criticalValues = this.loadFromStorage() || this.getDefaults();
  }
  
  static getInstance(): CriticalStateManager {
    if (!CriticalStateManager.instance) {
      CriticalStateManager.instance = new CriticalStateManager();
    }
    return CriticalStateManager.instance;
  }
  
  private getDefaults(): CriticalValues {
    return {
      cpuLevel: 1,
      cpuCost: 25,
      memory: 1,
      memoryMax: 1,
      memoryCost: 10,
      memoryRegenRate: 1
    };
  }
  
  private loadFromStorage(): CriticalValues | null {
    try {
      // Try primary storage
      const stored = localStorage.getItem(CRITICAL_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[CriticalStateManager] Loaded from primary storage:', parsed);
        return this.validateValues(parsed);
      }
      
      // Try backup storage
      const backup = localStorage.getItem(CRITICAL_STATE_BACKUP_KEY);
      if (backup) {
        const parsed = JSON.parse(backup);
        console.log('[CriticalStateManager] Loaded from backup storage:', parsed);
        return this.validateValues(parsed);
      }
    } catch (e) {
      console.error('[CriticalStateManager] Failed to load from storage:', e);
    }
    return null;
  }
  
  private validateValues(values: any): CriticalValues {
    const validated: CriticalValues = {
      cpuLevel: Math.max(1, Number(values.cpuLevel) || 1),
      cpuCost: Math.max(25, Number(values.cpuCost) || 25),
      memory: Math.max(1, Number(values.memory) || 1),
      memoryMax: Math.max(1, Number(values.memoryMax) || 1),
      memoryCost: Math.max(10, Number(values.memoryCost) || 10),
      memoryRegenRate: Math.max(1, Number(values.memoryRegenRate) || 1)
    };
    
    // Ensure values make sense
    if (validated.memory > validated.memoryMax) {
      validated.memory = validated.memoryMax;
    }
    
    return validated;
  }
  
  private saveToStorage() {
    try {
      const now = Date.now();
      // Throttle saves to every 100ms
      if (now - this.lastSaveTime < 100) {
        return;
      }
      
      this.lastSaveTime = now;
      const data = JSON.stringify(this.criticalValues);
      
      // Save to primary storage
      localStorage.setItem(CRITICAL_STATE_KEY, data);
      
      // Save backup every 5 seconds
      if (now - this.lastSaveTime > 5000) {
        localStorage.setItem(CRITICAL_STATE_BACKUP_KEY, data);
      }
      
      console.log('[CriticalStateManager] Saved to storage:', this.criticalValues);
    } catch (e) {
      console.error('[CriticalStateManager] Failed to save to storage:', e);
    }
  }
  
  update(values: Partial<CriticalValues>) {
    const oldValues = { ...this.criticalValues };
    
    // Update values, ensuring they never go below minimums
    if (values.cpuLevel !== undefined) {
      this.criticalValues.cpuLevel = Math.max(1, values.cpuLevel);
    }
    if (values.cpuCost !== undefined) {
      this.criticalValues.cpuCost = Math.max(25, values.cpuCost);
    }
    if (values.memory !== undefined) {
      this.criticalValues.memory = Math.max(1, values.memory);
    }
    if (values.memoryMax !== undefined) {
      this.criticalValues.memoryMax = Math.max(1, values.memoryMax);
    }
    if (values.memoryCost !== undefined) {
      this.criticalValues.memoryCost = Math.max(10, values.memoryCost);
    }
    if (values.memoryRegenRate !== undefined) {
      this.criticalValues.memoryRegenRate = Math.max(1, values.memoryRegenRate);
    }
    
    // Log significant changes
    if (oldValues.cpuLevel !== this.criticalValues.cpuLevel || 
        oldValues.memory !== this.criticalValues.memory) {
      console.log('[CriticalStateManager] Values updated:', {
        old: oldValues,
        new: this.criticalValues
      });
    }
    
    this.saveToStorage();
  }
  
  get(): CriticalValues {
    return { ...this.criticalValues };
  }
  
  // Check if current values are valid (not default)
  hasValidValues(): boolean {
    return this.criticalValues.cpuLevel > 1 || 
           this.criticalValues.memory > 1 ||
           this.criticalValues.cpuCost !== 25 ||
           this.criticalValues.memoryCost !== 10;
  }
  
  // Force restore values to a game state object
  restoreToState(state: any): any {
    const critical = this.get();
    
    if (!state.cpuLevel || state.cpuLevel < critical.cpuLevel) {
      console.warn('[CriticalStateManager] Restoring cpuLevel:', critical.cpuLevel);
      state.cpuLevel = critical.cpuLevel;
    }
    if (!state.cpuCost || state.cpuCost === 0) {
      state.cpuCost = critical.cpuCost;
    }
    if (!state.memory || state.memory < critical.memory) {
      console.warn('[CriticalStateManager] Restoring memory:', critical.memory);
      state.memory = critical.memory;
    }
    if (!state.memoryMax || state.memoryMax < critical.memoryMax) {
      state.memoryMax = critical.memoryMax;
    }
    if (!state.memoryCost || state.memoryCost === 0) {
      state.memoryCost = critical.memoryCost;
    }
    if (!state.memoryRegenRate || state.memoryRegenRate === 0) {
      state.memoryRegenRate = critical.memoryRegenRate;
    }
    
    return state;
  }
}

// Export singleton instance
export const criticalStateManager = CriticalStateManager.getInstance();