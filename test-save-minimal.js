// Test script to identify save issues
// Run this in the browser console

async function testMinimalSave() {
  console.log('Testing minimal save...');
  
  // Get current state
  const state = useGameStore.getState();
  
  // Create minimal save data
  const minimalData = {
    paperclips: state.paperclips,
    money: state.money,
    wire: state.wire,
    autoclippers: state.autoclippers
  };
  
  console.log('Minimal save data:', minimalData);
  
  try {
    const response = await fetch('/api/game/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Save failed:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error details:', errorJson);
      } catch (e) {
        console.error('Raw error:', errorText);
      }
    } else {
      console.log('Save successful!');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testMinimalSave();