# Space Age Jumpstart - Paperclip Conversion

## Changes Made

### 1. Updated API Handler (`src/app/api/diamonds/use-upgrade/route.ts`)
When the `space_jumpstart` upgrade is purchased:
- All regular paperclips are converted to aerograde paperclips
- An additional 1 million aerograde paperclips are added as a bonus
- Regular paperclips are set to 0
- Space Age is unlocked with 100 starter probes

### 2. Updated Upgrade Description (`src/app/premium-upgrades/page.tsx`)
- Description: "Instantly unlock Space Age, convert all paperclips to aerograde with 1M bonus"
- Effect: "Unlock Space Age + 100 probes + convert paperclips + 1M aerograde"

## How It Works

When a player purchases the Space Age Jumpstart (1000 💎):
1. Space Age is immediately unlocked
2. All regular paperclips are converted to aerograde paperclips
3. 1 million bonus aerograde paperclips are added
4. 100 space probes are granted as starter resources

### Example:
- Player has 500,000 regular paperclips
- Purchases Space Age Jumpstart
- Result: 0 regular paperclips, 1,500,000 aerograde paperclips, 100 probes

## Benefits
- Players don't lose their paperclip progress when jumping to space age
- The 1M bonus ensures they have enough resources to get started in space
- Maintains game balance while providing value for the premium purchase