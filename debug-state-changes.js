// Debug State Changes
// Run this in the browser console to monitor all state changes

console.log('=== Starting State Change Monitor ===');

// Track specific fields
const fieldsToMonitor = [
  'paperclips',
  'money',
  'wire',
  'wirePerSpool',
  'spoolSizeLevel',
  'wireHarvesters',
  'oreHarvesters',
  'factories',
  'userId',
  'isAuthenticated'
];

// Get initial values
const initialState = useGameStore.getState();
const tracked = {};
fieldsToMonitor.forEach(field => {
  tracked[field] = initialState[field];
});

console.log('Initial state:', tracked);

// Subscribe to all state changes
const unsubscribe = useGameStore.subscribe((state) => {
  let hasChanges = false;
  const changes = {};
  
  fieldsToMonitor.forEach(field => {
    if (state[field] !== tracked[field]) {
      hasChanges = true;
      changes[field] = {
        from: tracked[field],
        to: state[field]
      };
      tracked[field] = state[field];
    }
  });
  
  if (hasChanges) {
    console.log(`[${new Date().toLocaleTimeString()}] State changes detected:`, changes);
    
    // Log stack trace to see what caused the change
    console.trace('State change triggered from:');
    
    // Check localStorage
    const userId = state.userId;
    if (userId) {
      const storageKey = `paperclip-game-storage-${userId}`;
      const guestKey = 'paperclip-game-storage-guest';
      
      console.log('localStorage keys:', {
        userKey: localStorage.getItem(storageKey) ? 'exists' : 'missing',
        guestKey: localStorage.getItem(guestKey) ? 'exists' : 'missing'
      });
    }
  }
});

console.log('Monitor active. Call window.stopStateMonitor() to stop.');

window.stopStateMonitor = () => {
  unsubscribe();
  console.log('State monitor stopped.');
};