/**
 * Performance optimizations for the game
 * These utilities help reduce lag when producing thousands of paperclips per second
 */

import { GameState } from "@/types/game";

// Cache for expensive calculations
const calculationCache = new Map<string, { value: any; timestamp: number }>();
const CACHE_DURATION = 1000; // 1 second cache

/**
 * Memoize expensive calculations with a time-based cache
 */
export function memoizeCalculation<T>(key: string, calculator: () => T): T {
  const cached = calculationCache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.value;
  }
  
  const value = calculator();
  calculationCache.set(key, { value, timestamp: now });
  return value;
}

/**
 * Batch multiple state updates into a single update
 * This reduces the number of re-renders significantly
 */
export function createBatchedUpdate() {
  let pendingUpdates: Partial<GameState> = {};
  let updateScheduled = false;
  
  return {
    addUpdate: (update: Partial<GameState>) => {
      pendingUpdates = { ...pendingUpdates, ...update };
    },
    
    flush: (setState: (update: Partial<GameState>) => void) => {
      if (Object.keys(pendingUpdates).length > 0) {
        setState(pendingUpdates);
        pendingUpdates = {};
      }
    },
    
    scheduleFlush: (setState: (update: Partial<GameState>) => void, delay = 0) => {
      if (!updateScheduled) {
        updateScheduled = true;
        setTimeout(() => {
          setState(pendingUpdates);
          pendingUpdates = {};
          updateScheduled = false;
        }, delay);
      }
    }
  };
}

/**
 * Throttle function calls to reduce frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  }) as T;
}

/**
 * Optimized number formatting that caches results
 */
const formatCache = new Map<string, string>();
const FORMAT_CACHE_SIZE = 1000;

export function formatNumber(value: number, decimals = 0): string {
  const key = `${value}-${decimals}`;
  
  if (formatCache.has(key)) {
    return formatCache.get(key)!;
  }
  
  let formatted: string;
  
  if (value >= 1e15) {
    formatted = value.toExponential(2);
  } else if (value >= 1e12) {
    formatted = (value / 1e12).toFixed(decimals) + 'T';
  } else if (value >= 1e9) {
    formatted = (value / 1e9).toFixed(decimals) + 'B';
  } else if (value >= 1e6) {
    formatted = (value / 1e6).toFixed(decimals) + 'M';
  } else if (value >= 1e3) {
    formatted = (value / 1e3).toFixed(decimals) + 'K';
  } else {
    formatted = value.toFixed(decimals);
  }
  
  // Limit cache size
  if (formatCache.size >= FORMAT_CACHE_SIZE) {
    const firstKey = formatCache.keys().next().value;
    if (firstKey) {
      formatCache.delete(firstKey);
    }
  }
  
  formatCache.set(key, formatted);
  return formatted;
}

/**
 * Debounce function to delay execution until after a period of inactivity
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Request animation frame based ticker for smooth visual updates
 */
export class SmoothTicker {
  private lastTime = 0;
  private accumulator = 0;
  private readonly tickRate: number;
  private rafId: number | null = null;
  
  constructor(tickRate: number) {
    this.tickRate = tickRate;
  }
  
  start(callback: (deltaTime: number) => void) {
    const tick = (currentTime: number) => {
      if (this.lastTime === 0) {
        this.lastTime = currentTime;
      }
      
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.accumulator += deltaTime;
      
      while (this.accumulator >= this.tickRate) {
        callback(this.tickRate);
        this.accumulator -= this.tickRate;
      }
      
      this.rafId = requestAnimationFrame(tick);
    };
    
    this.rafId = requestAnimationFrame(tick);
  }
  
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

/**
 * Optimize wire buyer calculations by caching time-based factors
 */
export function calculateWirePurchaseCost(
  state: Pick<GameState, 'spoolCost' | 'lastWirePurchaseTime' | 'wirePurchaseCount' | 'spoolSizeLevel'>
): number {
  return memoizeCalculation('wirePurchaseCost', () => {
    const now = new Date();
    const timeSinceLastPurchase = now.getTime() - state.lastWirePurchaseTime.getTime();
    
    const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
    const purchaseCountFactor = Math.min(1, state.wirePurchaseCount / 10);
    
    const baseCost = 5 * state.spoolSizeLevel;
    const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50;
    
    return Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
  });
}