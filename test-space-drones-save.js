// Test Space Drones Save Issue
// Run this in the browser console

console.log('=== Testing Space Drones Save Issue ===\n');

// Function to manually save with specific values
async function testManualSave() {
  const state = useGameStore.getState();
  
  console.log('Current state values:');
  console.log('- wireHarvesters:', state.wireHarvesters);
  console.log('- oreHarvesters:', state.oreHarvesters);
  console.log('- factories:', state.factories);
  
  // Prepare save data exactly as GameInterface does
  const saveData = {
    // Include all required fields
    paperclips: state.paperclips,
    money: state.money,
    wire: state.wire,
    // ... other fields ...
    
    // Space drone fields - explicitly set test values
    wireHarvesters: 99999,
    oreHarvesters: 88888,
    factories: 77777,
    spaceAgeUnlocked: true,
    
    // Include other space fields
    probes: state.probes,
    universeExplored: state.universeExplored,
    aerogradePaperclips: state.aerogradePaperclips,
    
    // Include all other fields to match save endpoint expectations
    ...state
  };
  
  console.log('\nSending save request with test values:');
  console.log('- wireHarvesters:', saveData.wireHarvesters);
  console.log('- oreHarvesters:', saveData.oreHarvesters);
  console.log('- factories:', saveData.factories);
  
  try {
    const response = await fetch('/api/game/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Save successful!');
      console.log('Response:', result);
      
      // Now load to see what was actually saved
      console.log('\nLoading game state to verify...');
      const loadResponse = await fetch('/api/game/load');
      if (loadResponse.ok) {
        const loadedData = await loadResponse.json();
        console.log('\nLoaded values:');
        console.log('- wireHarvesters:', loadedData.wireHarvesters);
        console.log('- oreHarvesters:', loadedData.oreHarvesters);
        console.log('- factories:', loadedData.factories);
        
        if (loadedData.wireHarvesters === 99999) {
          console.log('\n✅ SUCCESS: Values were saved and loaded correctly!');
        } else {
          console.log('\n❌ FAIL: Values were not saved correctly.');
          console.log('Expected 99999, got:', loadedData.wireHarvesters);
        }
      }
    } else {
      console.error('❌ Save failed:', response.status);
      const error = await response.text();
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Function to check what's in localStorage vs server
function checkStorageVsServer() {
  const state = useGameStore.getState();
  const userId = state.userId;
  
  if (!userId) {
    console.error('No userId found');
    return;
  }
  
  const storageKey = `paperclip-game-storage-${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      console.log('\n📦 LocalStorage values:');
      console.log('- wireHarvesters:', data.state?.wireHarvesters);
      console.log('- oreHarvesters:', data.state?.oreHarvesters);
      console.log('- factories:', data.state?.factories);
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
    }
  }
  
  console.log('\n🎮 Current game state:');
  console.log('- wireHarvesters:', state.wireHarvesters);
  console.log('- oreHarvesters:', state.oreHarvesters);
  console.log('- factories:', state.factories);
}

// Run tests
console.log('1. Checking current storage vs state...');
checkStorageVsServer();

console.log('\n2. Running manual save test...');
testManualSave().then(() => {
  console.log('\n3. Test complete. Check server logs for SQL update details.');
});