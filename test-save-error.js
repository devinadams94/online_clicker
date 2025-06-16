// Test save and see the exact error
fetch('/api/game/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paperclips: 100,
    money: 50,
    wire: 1000,
    autoclippers: 1,
    // Don't include space drones to see if that's the issue
    wireHarvesters: 0,
    oreHarvesters: 0,
    factories: 0,
    spaceAgeUnlocked: false
  })
})
.then(res => {
  console.log('Status:', res.status);
  return res.text();
})
.then(text => {
  console.log('Response:', text);
  try {
    const json = JSON.parse(text);
    console.log('Error details:', json);
    if (json.details) {
      console.log('SQL Error Code:', json.details.code);
      console.log('SQL Error Number:', json.details.errno);
    }
  } catch (e) {
    console.log('Raw response:', text);
  }
});