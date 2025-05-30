#!/bin/bash

# Script to apply CPU OPs and production bonus fixes to gameStore.ts directly
# This script will make targeted changes to specific parts of the gameStore.ts file

GAME_STORE_PATH="/Users/devin/Desktop/online_clicker/src/lib/gameStore.ts"
BACKUP_PATH="/Users/devin/Desktop/online_clicker/src/lib/gameStore.ts.bak"

# Create a backup of the original file
cp "$GAME_STORE_PATH" "$BACKUP_PATH"
echo "Created backup at $BACKUP_PATH"

# 1. Fix the upgradeCPU function to add 50 OPs per level
echo "Modifying upgradeCPU function..."
sed -i '' -e '/newRegenRate = 1 + (newLevel - 1) \* 0.5;/a\\
        // Each CPU level increases OPs max by 50 per level\\
        const newOpsMax = state.memoryMax * 50 + (newLevel * 50);\\
' "$GAME_STORE_PATH"

# 2. Update the set() call in upgradeCPU to include opsMax
echo "Updating set() call in upgradeCPU..."
sed -i '' -e '/money: state.money - state.cpuCost,/{
    n
    n
    n
    s/memoryRegenRate: newRegenRate/memoryRegenRate: newRegenRate,\
          opsMax: newOpsMax/
}' "$GAME_STORE_PATH"

# 3. Update the opsMax calculation in upgradeMemory
echo "Updating opsMax calculation in upgradeMemory..."
sed -i '' -e 's/const newOpsMax = newMemoryMax \* 50;/const newOpsMax = newMemoryMax * 50 + (state.cpuLevel * 50);/' "$GAME_STORE_PATH"

# 4. Change the OPs production multiplier calculation in the batchedTick function
echo "Changing OPs production multiplier calculation..."
sed -i '' -e 's/const opsMultiplier = Math.min(0.5, state.ops \/ 1000);/const opsMultiplier = state.ops \/ 100; \/\/ Changed from ops\/1000 to ops\/100/' "$GAME_STORE_PATH"

# Verify if changes were made
if grep -q "const newOpsMax = newMemoryMax \* 50 + (state.cpuLevel \* 50);" "$GAME_STORE_PATH" && \
   grep -q "const opsMultiplier = state.ops / 100;" "$GAME_STORE_PATH"; then
  echo "✅ Successfully applied OPs fix to gameStore.ts"
  echo "Changes made:"
  echo "1. CPU now increases OPs max by 50 per level"
  echo "2. OPs production multiplier is now calculated as ops/100 instead of ops/1000"
  echo "3. upgradeMemory function now accounts for CPU level in opsMax calculation"
else
  echo "❌ Some changes may not have been applied correctly."
  echo "Please verify the changes manually or restore from backup:"
  echo "cp \"$BACKUP_PATH\" \"$GAME_STORE_PATH\""
fi