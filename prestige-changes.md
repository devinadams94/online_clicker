# Prestige System Changes

## Changes to implement:

1. **Modify `calculatePrestigePoints` function in gameStore.ts**:
   - Change the formula from `Math.floor(Math.sqrt(totalPaperclips / 1000000))` to `Math.floor(Math.sqrt(totalPaperclips / 1000000000))`
   - This changes the requirement from 1 million paperclips to 1 billion paperclips for the first prestige point

2. **Modify `prestigeReset` function in gameStore.ts**:
   - Change from accumulating prestige points to resetting them on each prestige
   - Instead of `const newPrestigePoints = (state.prestigePoints || 0) + points;`, use `const newPrestigePoints = points;`
   - This will reset prestige points to 0 after each prestige, giving only the points earned in the current run

3. **Modify market demand calculation in prestigeReset**:
   - Add code to increase market demand based on prestige level
   - Change `marketDemand: state.marketDemand || 0.05,` to:
   ```javascript
   marketDemand: Math.max(0.05, state.marketDemand || 0.05) * (1 + (newPrestigePoints * 0.1)),
   ```
   - This will increase market demand by 10% per prestige point

4. **Update PrestigePanel.tsx example text**:
   - Change any text references to prestige point thresholds
   - The text currently mentions 1 million paperclips; update to 1 billion
   - Text like "You need at least 1 million paperclips to gain prestige points" should be updated to "You need at least 1 billion paperclips"

## Implementation Steps:

1. Find and edit the `calculatePrestigePoints` function in gameStore.ts
2. Find and edit the `prestigeReset` function in gameStore.ts
3. Update the text in PrestigePanel.tsx that mentions the paperclip thresholds

## Testing:

After implementing these changes:
1. Verify that prestige points are calculated correctly based on the new threshold
2. Confirm that prestige points reset after each prestige
3. Check that market demand increases with each prestige
4. Ensure all text references to prestige thresholds are updated to reflect the new value