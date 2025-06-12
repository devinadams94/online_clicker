// Verification script for honor upgrades and auto-battle toggle
// Run this in the browser console to test the functionality

console.log("=== Honor Upgrades & Auto-Battle Verification Script ===");

// Get the game store
const gameStore = window.useGameStore?.getState?.() || {};

console.log("1. Current Honor:", gameStore.honor || 0);
console.log("2. Current unlocked honor upgrades:", gameStore.unlockedHonorUpgrades || []);
console.log("3. Auto-battle unlocked:", gameStore.autoBattleUnlocked || false);
console.log("4. Auto-battle enabled:", gameStore.autoBattleEnabled || false);

// Check if honor upgrades are saved in localStorage
try {
  const localData = localStorage.getItem('paperclip-game-state');
  if (localData) {
    const parsed = JSON.parse(localData);
    console.log("5. Honor upgrades in localStorage:", parsed.unlockedHonorUpgrades || []);
    console.log("6. Auto-battle data in localStorage:", {
      unlocked: parsed.autoBattleUnlocked || false,
      enabled: parsed.autoBattleEnabled || false
    });
  } else {
    console.log("5. No localStorage data found");
  }
} catch (e) {
  console.log("5. Error reading localStorage:", e);
}

// Test honor upgrade purchase (if user has enough honor)
if (gameStore.honor >= 500) {
  console.log("\n=== Testing Honor Upgrade Purchase ===");
  const beforeUpgrades = [...(gameStore.unlockedHonorUpgrades || [])];
  
  // Try to buy Cosmic Harvester (500 honor)
  if (window.useGameStore?.getState?.()?.buyHonorUpgrade) {
    window.useGameStore.getState().buyHonorUpgrade('cosmicHarvester', 500);
    
    setTimeout(() => {
      const afterUpgrades = window.useGameStore.getState().unlockedHonorUpgrades || [];
      console.log("Before purchase:", beforeUpgrades);
      console.log("After purchase:", afterUpgrades);
      console.log("Purchase successful:", afterUpgrades.includes('cosmicHarvester'));
    }, 100);
  }
} else {
  console.log("Not enough honor (need 500) to test purchase");
}

// Test auto-battle toggle visibility
console.log("\n=== Auto-Battle Toggle Test ===");
const spaceCombatPanel = document.querySelector('[class*="SpaceCombatPanel"]');
if (spaceCombatPanel) {
  const autoBattleToggle = spaceCombatPanel.querySelector('button[onclick*="toggleAutoBattle"], button:contains("Enable"), button:contains("Disable")');
  console.log("Auto-battle toggle button found:", !!autoBattleToggle);
  if (autoBattleToggle) {
    console.log("Toggle button text:", autoBattleToggle.textContent);
  }
} else {
  console.log("Space Combat Panel not found - may not be visible");
}

// Check if automated combat system upgrade is available/purchased
const spaceUpgrades = gameStore.unlockedSpaceUpgrades || [];
console.log("Space upgrades purchased:", spaceUpgrades);
console.log("Automated Combat System purchased:", spaceUpgrades.includes('autoBattle'));

console.log("\n=== Recommendations ===");
if (!gameStore.autoBattleUnlocked) {
  console.log("To see auto-battle toggle: Purchase 'Automated Combat System' upgrade for 60,000 Aerograde Paperclips");
}

if ((gameStore.honor || 0) === 0) {
  console.log("To get Honor: Win battles in the Space Combat panel");
}

if ((gameStore.unlockedHonorUpgrades || []).length === 0) {
  console.log("To test honor upgrade save: Win some battles to get Honor, then purchase an honor upgrade");
}