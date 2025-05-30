# CPU OPs Bonus Fix

This document explains the changes made to fix the CPU stat not increasing OPs by 50 per stat point.

## Changes Made

1. Updated the `upgradeCPU` function to include OPs max calculation:
   ```typescript
   // Each CPU level increases OPs max by 50
   const newOpsMax = (state.memoryMax * 50) + (newLevel * 50);
   
   // Update state with new values
   set({
     money: state.money - state.cpuCost,
     cpuLevel: newLevel,
     cpuCost: newCost,
     memoryRegenRate: newRegenRate,
     opsMax: newOpsMax
   });
   ```

2. Updated the `upgradeMemory` function to account for CPU level when calculating OPs max:
   ```typescript
   // OPs max is 50 x memory plus 50 x CPU level
   const newOpsMax = (newMemoryMax * 50) + (state.cpuLevel * 50);
   ```

3. Updated all other places where OPs max is calculated to include CPU contribution:
   - In `quantumComputation` trust upgrade
   - In `quantumComputing` trust upgrade
   - In `memoryCompression` OPs upgrade
   - In `distributedStorage` OPs upgrade
   - In `consciousnessExpansion` creativity upgrade
   - In `singularityInsight` creativity upgrade
   - In `quantumMemory` memory upgrade

## How It Works

Now each CPU level increases the maximum OPs capacity by 50. The total OPs max is calculated as:
```
OPs max = (Memory max × 50) + (CPU level × 50)
```

For example:
- With Memory max = 10 and CPU level = 5:
  - Memory contribution = 10 × 50 = 500
  - CPU contribution = 5 × 50 = 250
  - Total OPs max = 500 + 250 = 750

This means upgrading CPU is now more valuable, as it both increases memory regeneration rate AND increases OPs capacity, giving the player a larger buffer for OPs-based production multipliers.

## Verification

After applying these changes, each CPU upgrade should visibly increase the player's maximum OPs capacity by 50 points. This can be seen in the Resources panel where OPs are displayed.