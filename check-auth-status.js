// Check authentication status
// Run this in the browser console

async function checkAuthStatus() {
  console.log('=== Authentication Status Check ===');
  
  // 1. Check NextAuth session
  try {
    const sessionResponse = await fetch('/api/auth/session');
    const session = await sessionResponse.json();
    console.log('NextAuth session:', session);
    
    if (session && session.user) {
      console.log('✅ Authenticated as:', session.user.email);
      console.log('User ID:', session.user.id);
    } else {
      console.log('❌ Not authenticated');
    }
  } catch (error) {
    console.error('Failed to check session:', error);
  }
  
  // 2. Check game store auth state
  const gameState = useGameStore.getState();
  console.log('Game store auth state:', {
    isAuthenticated: gameState.isAuthenticated,
    userId: gameState.userId
  });
  
  // 3. Check cookies
  console.log('Auth cookies:', document.cookie.split(';').filter(c => c.includes('next-auth')));
  
  // 4. Test a simple authenticated request
  try {
    console.log('\nTesting authenticated request to /api/game/load...');
    const loadResponse = await fetch('/api/game/load');
    console.log('Load endpoint status:', loadResponse.status);
    
    if (loadResponse.status === 401) {
      console.log('❌ Authentication required for game load');
    } else if (loadResponse.ok) {
      console.log('✅ Load endpoint accessible');
      const data = await loadResponse.json();
      console.log('Loaded data sample:', {
        paperclips: data.paperclips,
        money: data.money
      });
    }
  } catch (error) {
    console.error('Load test failed:', error);
  }
}

checkAuthStatus();