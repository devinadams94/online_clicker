# Date Serialization Fix

This document explains the fix for the TypeError: `state.lastWirePurchaseTime.getTime is not a function` error.

## Problem

When a game state is saved and then loaded, date objects (like `lastWirePurchaseTime`) are serialized to strings. When the game tries to call `.getTime()` on these string values, it causes a TypeError.

## Solution

1. Created a helper function to ensure date values are properly converted:
   ```typescript
   const ensureDate = (dateValue: any): Date => {
     if (!dateValue) {
       return new Date();
     }
     
     if (dateValue instanceof Date) {
       // Check if the date is valid
       if (!isNaN(dateValue.getTime())) {
         return dateValue;
       }
     }
     
     // Try to create a Date from the value
     try {
       const newDate = new Date(dateValue);
       if (!isNaN(newDate.getTime())) {
         return newDate;
       }
     } catch (e) {
       // If conversion fails, return current date
       console.error("Failed to convert date:", dateValue, e);
     }
     
     // Default to current date if all else fails
     return new Date();
   };
   ```

2. Updated the `setGameState` function to properly convert all date values:
   ```typescript
   setGameState: (gameState: GameState) => {
     // Convert all date fields using our helper function
     gameState.lastWirePurchaseTime = ensureDate(gameState.lastWirePurchaseTime);
     gameState.lastSaved = ensureDate(gameState.lastSaved);
     gameState.lastPriceUpdate = ensureDate(gameState.lastPriceUpdate);
     gameState.botLastTradeTime = ensureDate(gameState.botLastTradeTime);
     gameState.stockMarketLastUpdate = ensureDate(gameState.stockMarketLastUpdate);
     
     // Also handle dates inside stock objects
     if (gameState.stocks && Array.isArray(gameState.stocks)) {
       gameState.stocks.forEach(stock => {
         if (stock.lastUpdate) {
           stock.lastUpdate = ensureDate(stock.lastUpdate);
         }
         if (stock.trendStartTime) {
           stock.trendStartTime = ensureDate(stock.trendStartTime);
         }
       });
     }
     
     return set(() => ({ ...gameState }));
   }
   ```

3. Added defensive code at each place where date methods are called:
   ```typescript
   // Use our helper function to ensure we have a valid date
   const lastPurchaseTime = ensureDate(state.lastWirePurchaseTime);
   const timeSinceLastPurchase = now.getTime() - lastPurchaseTime.getTime();
   ```

## Benefits

- Prevents TypeErrors from causing game crashes
- Handles various edge cases like missing, null, or invalid date values
- Provides a consistent approach to date handling throughout the codebase
- Makes the game more robust when loading potentially corrupted or outdated save data

This fix will prevent the "TypeError: state.lastWirePurchaseTime.getTime is not a function" error from occurring.