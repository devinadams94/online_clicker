#!/bin/bash

# Script to apply CPU OPs and production bonus fixes to gameStore.ts

GAME_STORE_PATH="/Users/devin/Desktop/online_clicker/src/lib/gameStore.ts"
BACKUP_PATH="/Users/devin/Desktop/online_clicker/src/lib/gameStore.ts.bak"
PATCH_PATH="/Users/devin/Desktop/online_clicker/gameStore-ops-fix.patch"

# Create a backup of the original file
cp "$GAME_STORE_PATH" "$BACKUP_PATH"
echo "Created backup at $BACKUP_PATH"

# Apply the patch file
echo "Applying patch file..."
patch "$GAME_STORE_PATH" < "$PATCH_PATH"

if [ $? -eq 0 ]; then
  echo "✅ Successfully applied OPs fix patch to gameStore.ts"
  echo "Changes made:"
  echo "1. CPU now increases OPs max by 50 per level"
  echo "2. OPs production multiplier is now calculated as ops/100 instead of ops/1000"
  echo "3. upgradeMemory function now accounts for CPU level in opsMax calculation"
else
  echo "❌ Failed to apply patch. Restoring from backup."
  cp "$BACKUP_PATH" "$GAME_STORE_PATH"
  echo "Original file restored. Please apply changes manually."
  cat "$PATCH_PATH"
fi