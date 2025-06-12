// State Validator - Ensures game state integrity between API and store

import type { GameState } from '@/types/game';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedState?: Partial<GameState>;
}

export class StateValidator {
  // Minimum valid values for critical fields
  private static readonly MIN_VALUES = {
    cpuLevel: 1,
    cpuCost: 25,
    memory: 1,
    memoryMax: 1,
    memoryCost: 10,
    memoryRegenRate: 1,
    ops: 50,
    opsMax: 50
  };
  
  // Fields that should never be null/undefined
  private static readonly REQUIRED_FIELDS = [
    'cpuLevel', 'cpuCost', 'memory', 'memoryMax', 'memoryCost', 'memoryRegenRate',
    'ops', 'opsMax', 'paperclips', 'money', 'wire'
  ];
  
  static validateState(state: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      correctedState: {}
    };
    
    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (state[field] === undefined || state[field] === null) {
        result.errors.push(`Required field '${field}' is missing`);
        result.isValid = false;
        
        // Apply correction
        if (this.MIN_VALUES[field as keyof typeof this.MIN_VALUES] !== undefined) {
          result.correctedState![field] = this.MIN_VALUES[field as keyof typeof this.MIN_VALUES];
        }
      }
    }
    
    // Validate minimum values
    for (const [field, minValue] of Object.entries(this.MIN_VALUES)) {
      const value = state[field];
      if (value !== undefined && value !== null && value < minValue) {
        result.warnings.push(`Field '${field}' has invalid value ${value}, should be at least ${minValue}`);
        result.correctedState![field] = minValue;
      }
    }
    
    // Validate relationships
    if (state.memory > state.memoryMax) {
      result.warnings.push(`Memory (${state.memory}) exceeds memoryMax (${state.memoryMax})`);
      result.correctedState!.memory = state.memoryMax;
    }
    
    if (state.ops > state.opsMax) {
      result.warnings.push(`Ops (${state.ops}) exceeds opsMax (${state.opsMax})`);
      result.correctedState!.ops = state.opsMax;
    }
    
    // Check for NaN values
    const numericFields = ['cpuLevel', 'cpuCost', 'memory', 'memoryMax', 'memoryCost', 
                          'memoryRegenRate', 'ops', 'opsMax', 'paperclips', 'money', 'wire'];
    
    for (const field of numericFields) {
      if (state[field] !== undefined && isNaN(state[field])) {
        result.errors.push(`Field '${field}' has NaN value`);
        result.isValid = false;
        
        if (this.MIN_VALUES[field as keyof typeof this.MIN_VALUES] !== undefined) {
          result.correctedState![field] = this.MIN_VALUES[field as keyof typeof this.MIN_VALUES];
        } else {
          result.correctedState![field] = 0;
        }
      }
    }
    
    return result;
  }
  
  static validateAndCorrect(state: any): any {
    const validation = this.validateState(state);
    
    if (validation.errors.length > 0) {
      console.error('[StateValidator] Validation errors:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.warn('[StateValidator] Validation warnings:', validation.warnings);
    }
    
    // Apply corrections
    if (validation.correctedState && Object.keys(validation.correctedState).length > 0) {
      console.log('[StateValidator] Applying corrections:', validation.correctedState);
      return { ...state, ...validation.correctedState };
    }
    
    return state;
  }
  
  // Validate state transition (before -> after)
  static validateTransition(beforeState: any, afterState: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    // Check for suspicious resets
    if (beforeState.cpuLevel > 1 && afterState.cpuLevel === 1) {
      result.warnings.push(`CPU Level reset from ${beforeState.cpuLevel} to 1`);
    }
    
    if (beforeState.memory > 1 && afterState.memory === 1) {
      result.warnings.push(`Memory reset from ${beforeState.memory} to 1`);
    }
    
    // Check for impossible transitions
    if (beforeState.cpuCost > afterState.cpuCost && beforeState.cpuLevel === afterState.cpuLevel) {
      result.errors.push(`CPU cost decreased without level change`);
      result.isValid = false;
    }
    
    if (beforeState.memoryCost > afterState.memoryCost && beforeState.memoryMax === afterState.memoryMax) {
      result.errors.push(`Memory cost decreased without max change`);
      result.isValid = false;
    }
    
    return result;
  }
}