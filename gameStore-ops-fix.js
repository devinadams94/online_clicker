// CPU OPs and Production Bonus Fix

/**
 * This script modifies the gameStore.ts file to make the following changes:
 * 1. Make CPU add 50 OPs per level
 * 2. Change opsProductionMultiplier calculation to use ops/100 instead of ops/1000
 *
 * Apply this to the gameStore.ts file by replacing the relevant sections:
 */

// REPLACEMENT 1: In the upgradeCPU function, after calculating newRegenRate, add:
const newOpsMax = (state.memoryMax * 50) + (newLevel * 50);

// And update the set() call to include opsMax:
set({
  money: state.money - state.cpuCost,
  cpuLevel: newLevel,
  cpuCost: newCost,
  memoryRegenRate: newRegenRate,
  opsMax: newOpsMax
});

// REPLACEMENT 2: In the upgradeMemory function, change the opsMax calculation:
// FROM:
const newOpsMax = newMemoryMax * 50;

// TO:
const newOpsMax = (newMemoryMax * 50) + (state.cpuLevel * 50);

// REPLACEMENT 3: In the batchedTick function or wherever opsProductionMultiplier is calculated, change:
// FROM:
const opsMultiplier = Math.min(0.5, state.ops / 1000);

// TO:
const opsMultiplier = state.ops / 100;

// REPLACEMENT 4: In the opsMax calculation when initializing state, change to account for CPU level:
// For example in quantumComputation and other places that modify opsMax:
updatedState.opsMax = (state.memoryMax * 2) * 50;

// TO:
updatedState.opsMax = (state.memoryMax * 2) * 50 + (state.cpuLevel * 50);

/**
 * Note: Since the file is very large, you may need to search for these patterns in the file
 * and apply the changes manually.
 */