# CPU and Memory Reset Fix Summary

## Issue
CPU and memory stats were being reset to 0 on page refresh and when navigating to the shop.

## Root Causes
1. **Incorrect default values in load API**: The `/api/game/load/route.ts` was using default values of 1000 for cpuCost and memoryCost, when they should be 25 and 10 respectively
2. **Database schema defaults**: The Prisma schema had default values of 100 for cpuCost and memoryCost
3. **No validation**: There was no validation to ensure CPU and memory values were never 0
4. **Full page navigation**: The shop links in ResourcesPanel were using `<a>` tags instead of Next.js `<Link>` components, causing full page reloads that reset React state
5. **Storage key changes**: The Zustand persist storage key changes when userId changes, potentially losing state

## Fixes Applied

### 1. Updated Database Schema (`prisma/schema.prisma`)
- Changed `cpuCost` default from 100 to 25
- Changed `memoryCost` default from 100 to 10

### 2. Fixed Load API (`src/app/api/game/load/route.ts`)
- Changed default values to match game logic:
  - `cpuCost`: 1000 → 25
  - `memoryCost`: 1000 → 10
  - `memoryRegenRate`: 0.001 → 1
- Added validation to ensure values are never 0

### 3. Added Validation in Game Store (`src/lib/gameStore.ts`)
- Added checks in `setGameState` to ensure CPU and memory values are never 0
- Added console warnings when values would be 0

### 4. Added Debug Logging (`src/components/game/GameInterface.tsx`)
- Added logging to track CPU/memory values during load
- Added validation before calling `setGameState`

### 5. Fixed Existing Database Records
- Ran SQL script to update existing records with incorrect defaults
- Updated all cpuCost values from 100 to 25
- Updated all memoryCost values from 100 to 10

### 6. Fixed Navigation Issues (`src/components/game/ResourcesPanel.tsx`)
- Changed `<a href="/buy-diamonds">` to `<Link href="/buy-diamonds">`
- Changed `<a href="/premium-upgrades">` to `<Link href="/premium-upgrades">`
- This prevents full page reloads that reset React state

### 7. Added State Preservation
- Created state preserver utility to maintain critical values across storage key changes
- Added onRehydrateStorage callback to restore preserved state
- Added logic to preserve existing non-zero values when API returns 0

### 8. Added Duplicate Load Prevention
- Added `hasLoaded` state to prevent multiple API calls on mount

## Testing
1. Check the browser console for any warnings about CPU/memory being 0
2. Refresh the page and verify CPU and memory values persist
3. Navigate to the shop using the diamond buttons and verify values persist
4. Check that new users start with correct defaults (CPU Level 1, Memory 1)

## Future Considerations
- Consider adding a validation layer between the API and game store
- Add unit tests for CPU/memory persistence
- Consider using a more robust state management solution for critical values
- Review all navigation links to ensure they use Next.js Link components