// Test using the simpler test-save endpoint
fetch('/api/test-save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paperclips: 100,
    money: 50,
    wire: 1000
  })
})
.then(res => {
  console.log('Test save status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Test save result:', data);
})
.catch(err => {
  console.error('Test save error:', err);
});