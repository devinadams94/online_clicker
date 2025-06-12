// Hook to preserve critical state values across renders and navigation

import { useEffect, useRef } from 'react';
import useGameStore from '@/lib/gameStore';
import { criticalStateManager } from '@/lib/criticalStateManager';

export function usePreserveState() {
  const cpuLevel = useGameStore(state => state.cpuLevel);
  const cpuCost = useGameStore(state => state.cpuCost);
  const memory = useGameStore(state => state.memory);
  const memoryMax = useGameStore(state => state.memoryMax);
  const memoryCost = useGameStore(state => state.memoryCost);
  const memoryRegenRate = useGameStore(state => state.memoryRegenRate);
  
  const hasInitialized = useRef(false);
  
  // Save to critical state manager whenever values change
  useEffect(() => {
    // Skip the first render to avoid saving default values
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    
    // Only save if values are not defaults
    if (cpuLevel > 1 || memory > 1 || cpuCost !== 25 || memoryCost !== 10) {
      console.log('[usePreserveState] Saving state:', {
        cpuLevel, cpuCost, memory, memoryMax, memoryCost, memoryRegenRate
      });
      
      criticalStateManager.update({
        cpuLevel,
        cpuCost,
        memory,
        memoryMax,
        memoryCost,
        memoryRegenRate
      });
    }
  }, [cpuLevel, cpuCost, memory, memoryMax, memoryCost, memoryRegenRate]);
  
  // On mount, check if we need to restore values
  useEffect(() => {
    const critical = criticalStateManager.get();
    const currentState = useGameStore.getState();
    
    // If current state has default values but critical state has real values, restore
    if (currentState.cpuLevel === 1 && critical.cpuLevel > 1) {
      console.log('[usePreserveState] Restoring critical state on mount');
      useGameStore.setState({
        cpuLevel: critical.cpuLevel,
        cpuCost: critical.cpuCost,
        memory: critical.memory,
        memoryMax: critical.memoryMax,
        memoryCost: critical.memoryCost,
        memoryRegenRate: critical.memoryRegenRate
      });
    }
  }, []);
}