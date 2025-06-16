// Verification script for state persistence
// Run this in the browser console to verify state changes

console.log('=== State Persistence Verification ===');

// 1. Check current state
const currentState = useGameStore.getState();
console.log('Current state values:', {
  paperclips: currentState.paperclips,
  money: currentState.money,
  wire: currentState.wire,
  wirePerSpool: currentState.wirePerSpool,
  spoolSizeLevel: currentState.spoolSizeLevel,
  userId: currentState.userId,
  isAuthenticated: currentState.isAuthenticated
});

// 2. Check localStorage keys
const storageKeys = Object.keys(localStorage).filter(key => key.includes('paperclip-game-storage'));
console.log('LocalStorage keys:', storageKeys);

// 3. Check specific localStorage content
storageKeys.forEach(key => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(`Storage key "${key}" contains:`, {
      userId: data.state?.userId,
      paperclips: data.state?.paperclips,
      money: data.state?.money,
      wire: data.state?.wire
    });
  } catch (e) {
    console.error(`Failed to parse storage key "${key}"`);
  }
});

// 4. Instructions for testing
console.log('\n=== Testing Instructions ===');
console.log('1. Note the current values above');
console.log('2. Make some changes (buy wire, make paperclips, etc)');
console.log('3. Wait for auto-save or trigger manual save');
console.log('4. Refresh the page');
console.log('5. Run this script again to verify values persisted');
console.log('\n6. If values reset to 0, check the console logs for:');
console.log('   - "[GameInterface] User changed - resetting game state"');
console.log('   - "[GameStore] Merge called" logs');
console.log('   - Any error messages');