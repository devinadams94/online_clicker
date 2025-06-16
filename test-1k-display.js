// Test what "1k" means in the display

console.log('=== Testing Number Display ===\n');

// The formatNumber function from SpaceLaunchPanel
const formatNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

console.log('Testing formatNumber function:');
console.log('1 displays as:', formatNumber(1));
console.log('10 displays as:', formatNumber(10));
console.log('100 displays as:', formatNumber(100));
console.log('1000 displays as:', formatNumber(1000));
console.log('1100 displays as:', formatNumber(1100));

console.log('\nSo if you see "1.00K", the actual value is 1000');
console.log('If you see "1.10K", the actual value is 1100');

// Check current values
const state = useGameStore.getState();
console.log('\nCurrent actual values (not formatted):');
console.log('- wireHarvesters:', state.wireHarvesters);
console.log('- oreHarvesters:', state.oreHarvesters);
console.log('- factories:', state.factories);

console.log('\nFormatted for display:');
console.log('- wireHarvesters:', formatNumber(state.wireHarvesters));
console.log('- oreHarvesters:', formatNumber(state.oreHarvesters));
console.log('- factories:', formatNumber(state.factories));