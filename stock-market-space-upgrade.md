# Stock Market Unlock in Space Upgrades

## Changes Made

### Added Stock Market Upgrade to Space Upgrades Panel

1. **Import Updates** (`src/components/game/SpaceUpgradesPanel.tsx`):
   - Added `formatCurrency` import
   - Added `stockMarketUnlocked` and `unlockStockMarket` from useGameStore

2. **New Upgrade Definition**:
   ```javascript
   {
     id: 'stockMarket',
     name: 'Stock Market Access',
     description: 'Unlock the stock market to invest your money and earn passive income through trading',
     cost: 50000,
     effect: 'stockMarket',
     effectValue: true,
     icon: '📈',
     repeatable: false,
     special: true // Mark as special to handle differently
   }
   ```

3. **Special Handling**:
   - Added check for `isStockMarket` to use `stockMarketUnlocked` state instead of purchase count
   - Modified click handler to call `unlockStockMarket()` directly for stock market
   - Regular money upgrades continue to use `buyMoneySpaceUpgrade()`

## How It Works

1. The Stock Market upgrade appears in the Money Upgrades section of Space Upgrades
2. Cost: $50,000 (same as original)
3. When purchased:
   - Calls the same `unlockStockMarket()` function from the game store
   - Deducts $50,000 from player's money
   - Unlocks the Stock Market tab in navigation
4. Once purchased, shows as "Purchased" and cannot be bought again

## Benefits

- Players in Space Age can unlock the stock market without going back to regular upgrades
- Same functionality and cost as the original upgrade
- Maintains game balance while improving accessibility