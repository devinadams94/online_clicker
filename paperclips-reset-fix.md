# Paperclips Reset Fix

## Issue
Paperclips are resetting to 0 when refreshing the page, causing players to lose all progress.

## Root Cause
Paperclips were ONLY being saved in the Prisma update, not in the raw SQL update. The raw SQL update executes first and handles critical values, but paperclips was missing from it.

## Fix Applied

### 1. Added paperclips extraction in save endpoint:
```typescript
// Get paperclips from request body - CRITICAL for player progress
const paperclips = parseFloat(body.paperclips || 0);
```

### 2. Added paperclips to SQL UPDATE:
```sql
UPDATE "GameState" 
SET "money" = ${money}, 
    "paperclips" = ${paperclips},  // Added this line
    "paperclipPrice" = ${paperclipPrice},
    ...
```

### 3. Added logging to track paperclips:
- Save endpoint logs paperclips value before SQL update
- Load endpoint logs both raw and processed paperclips values

## How It Works Now
1. Paperclips are saved in BOTH the SQL update (for reliability) and Prisma update
2. The SQL update ensures critical values like paperclips are persisted even if Prisma has issues
3. On load, paperclips are returned with all other game state data

## Testing
1. Play the game and accumulate some paperclips
2. Check server logs for "[SAVE API] Critical values before SQL update"
3. Refresh the page
4. Check server logs for "[LOAD API] Critical values"
5. Paperclips should now persist correctly

## Related Issues Fixed
- Space drone values (wireHarvesters, oreHarvesters, factories) - similar fix applied
- Added fallback Prisma updates for space drones if SQL fails

## Why This Happened
The game uses a hybrid approach with both raw SQL and Prisma ORM. Some critical values need to be in the SQL update to ensure they persist reliably. Paperclips, being the core game resource, must be included in this critical update.