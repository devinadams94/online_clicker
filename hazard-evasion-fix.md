# Hazard Evasion Fix

## Issue
The hazard evasion upgrade in the Space Age page was showing "Level 0" when it should start at "Level 1", and clicking the upgrade button wasn't working properly.

## Root Cause
1. The component was using `spaceStats?.[stat.id] || 0` which defaulted to 0 if the value was falsy
2. The upgradeStat functions were using `|| 0` instead of `?? 1` when incrementing, which could reset values
3. All space stats are initialized to 1 in gameStore.ts, but the display logic wasn't respecting this

## Changes Made

### 1. SpaceStatsPanel.tsx
- Changed `const statValue = spaceStats?.[stat.id] || 0;` to `const statValue = spaceStats?.[stat.id] ?? 1;`
- Updated the manualUpgradeStat function to use `?? 1` instead of `|| 0`
- Changed the check from testing if individual stat exists to checking if spaceStats object exists

### 2. spaceExtension.ts
- Updated the upgradeStat function to use `?? 1` instead of `|| 0`
- Changed the check from testing if individual stat exists to checking if spaceStats object exists

## Result
- All space stats now correctly display their initial value of 1
- Clicking the upgrade button properly increments the value from 1 to 2, 3, etc.
- The hazard evasion stat now works exactly like all other space stats