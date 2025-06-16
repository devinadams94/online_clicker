// Debug script to track state resets
// Run this in the browser console immediately after page load

console.log('=== State Reset Debugger ===');

// Override setState to track all state changes
const originalSetState = useGameStore.setState;
let stateChangeCount = 0;

useGameStore.setState = function(...args) {
  const [partial] = args;
  const before = useGameStore.getState();
  
  // Check if critical values are being reset
  if (typeof partial === 'object' && !Array.isArray(partial)) {
    const criticalFields = ['paperclips', 'money', 'wire', 'wirePerSpool'];
    const resetFields = [];
    
    for (const field of criticalFields) {
      if (field in partial && partial[field] === 0 && before[field] > 0) {
        resetFields.push({
          field,
          before: before[field],
          after: partial[field]
        });
      }
    }
    
    if (resetFields.length > 0) {
      console.error(`[STATE RESET DETECTED] #${++stateChangeCount}:`, resetFields);
      console.trace('Reset triggered from:');
      
      // Log the full partial update
      console.log('Full update object:', partial);
      
      // Log current userId
      console.log('Current userId:', before.userId);
    }
  }
  
  // Call original setState
  return originalSetState.apply(this, args);
};

// Monitor localStorage changes
const storageKeys = Object.keys(localStorage).filter(key => key.includes('paperclip-game-storage'));
console.log('Current localStorage keys:', storageKeys);

// Check persist state
const persist = (useGameStore).persist;
if (persist) {
  console.log('Persist middleware info:', {
    hasHydrated: persist.hasHydrated,
    options: {
      name: typeof persist.options.name === 'function' ? 'dynamic' : persist.options.name,
      skipHydration: persist.options.skipHydration
    }
  });
}

console.log('Debugger active. Watch for [STATE RESET DETECTED] messages.');