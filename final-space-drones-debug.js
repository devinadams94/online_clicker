// Final Space Drones Debug Script
// This will help identify exactly where the issue is

console.log('=== Final Space Drones Debug ===\n');

// 1. Check current state
const state = useGameStore.getState();
console.log('1. Current game state:');
console.log('   - wireHarvesters:', state.wireHarvesters);
console.log('   - oreHarvesters:', state.oreHarvesters);
console.log('   - factories:', state.factories);
console.log('   - userId:', state.userId);

// 2. Set specific test values
console.log('\n2. Setting test values: 12345, 23456, 34567');
useGameStore.setState({
  wireHarvesters: 12345,
  oreHarvesters: 23456,
  factories: 34567
});

// 3. Verify they were set
const afterSet = useGameStore.getState();
console.log('\n3. After setState:');
console.log('   - wireHarvesters:', afterSet.wireHarvesters);
console.log('   - oreHarvesters:', afterSet.oreHarvesters);
console.log('   - factories:', afterSet.factories);

// 4. Force a save
console.log('\n4. Forcing save...');
if (window.saveGameNow) {
  window.saveGameNow().then(() => {
    console.log('   ✅ Save completed');
    
    // 5. Load from server
    console.log('\n5. Loading from server...');
    fetch('/api/game/load')
      .then(res => res.json())
      .then(data => {
        console.log('   Server returned:');
        console.log('   - wireHarvesters:', data.wireHarvesters);
        console.log('   - oreHarvesters:', data.oreHarvesters);
        console.log('   - factories:', data.factories);
        
        // 6. Check localStorage
        const userId = state.userId;
        const storageKey = `paperclip-game-storage-${userId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const localData = JSON.parse(stored);
          console.log('\n6. LocalStorage has:');
          console.log('   - wireHarvesters:', localData.state?.wireHarvesters);
          console.log('   - oreHarvesters:', localData.state?.oreHarvesters);
          console.log('   - factories:', localData.state?.factories);
        }
        
        // 7. Diagnosis
        console.log('\n7. Diagnosis:');
        if (data.wireHarvesters === 12345) {
          console.log('   ✅ Server save/load is working correctly!');
        } else if (data.wireHarvesters === 1000) {
          console.log('   ❌ Values are being reset to 1000 somewhere');
          console.log('   This suggests initialization code is overwriting the values');
        } else if (data.wireHarvesters === 0) {
          console.log('   ❌ Values are not being saved to database');
        } else {
          console.log('   ❓ Unexpected value:', data.wireHarvesters);
        }
        
        console.log('\n💡 Next steps:');
        console.log('   - Check server logs for SQL update results');
        console.log('   - Look for any code that sets default values to 1000');
        console.log('   - Check if game initialization is overwriting loaded values');
      });
  });
} else {
  console.error('   ❌ saveGameNow function not found!');
}

// Monitor for any state changes
console.log('\n8. Monitoring for state changes...');
const unsubscribe = useGameStore.subscribe((newState) => {
  if (newState.wireHarvesters !== afterSet.wireHarvesters ||
      newState.oreHarvesters !== afterSet.oreHarvesters ||
      newState.factories !== afterSet.factories) {
    console.log('   🚨 State changed!');
    console.log('   - wireHarvesters:', afterSet.wireHarvesters, '→', newState.wireHarvesters);
    console.log('   - oreHarvesters:', afterSet.oreHarvesters, '→', newState.oreHarvesters);
    console.log('   - factories:', afterSet.factories, '→', newState.factories);
  }
});

// Clean up after 10 seconds
setTimeout(() => {
  unsubscribe();
  console.log('\n✅ Monitoring stopped');
}, 10000);