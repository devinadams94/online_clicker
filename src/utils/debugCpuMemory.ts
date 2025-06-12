// Debug utility for CPU/Memory issues

export function debugCpuMemory() {
  console.log('=== CPU/Memory Debug Report ===');
  console.log(new Date().toISOString());
  
  // Check Zustand store
  if (typeof window !== 'undefined' && (window as any).useGameStore) {
    const store = (window as any).useGameStore;
    const state = store.getState();
    console.log('\n1. Zustand Store Values:');
    console.log('   cpuLevel:', state.cpuLevel);
    console.log('   cpuCost:', state.cpuCost);
    console.log('   memory:', state.memory);
    console.log('   memoryMax:', state.memoryMax);
    console.log('   memoryCost:', state.memoryCost);
    console.log('   memoryRegenRate:', state.memoryRegenRate);
    console.log('   userId:', state.userId);
  }
  
  // Check localStorage
  console.log('\n2. LocalStorage Keys:');
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter(k => k.includes('paperclip'));
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && value.includes('cpuLevel')) {
          const parsed = JSON.parse(value);
          console.log(`   ${key}:`, {
            cpuLevel: parsed.state?.cpuLevel,
            memory: parsed.state?.memory
          });
        }
      } catch (e) {
        console.log(`   ${key}: [parse error]`);
      }
    });
  }
  
  // Check critical state storage
  console.log('\n3. Critical State Storage:');
  const critical = localStorage.getItem('paperclip-critical-state');
  if (critical) {
    try {
      console.log('   Primary:', JSON.parse(critical));
    } catch (e) {
      console.log('   Primary: [parse error]');
    }
  }
  const backup = localStorage.getItem('paperclip-critical-state-backup');
  if (backup) {
    try {
      console.log('   Backup:', JSON.parse(backup));
    } catch (e) {
      console.log('   Backup: [parse error]');
    }
  }
  
  // Check session storage
  console.log('\n4. SessionStorage:');
  if (typeof window !== 'undefined') {
    const sessionKeys = Object.keys(sessionStorage);
    console.log('   Keys:', sessionKeys);
  }
  
  console.log('\n=== End Debug Report ===');
}

// Add to window for easy access
if (typeof window !== 'undefined') {
  (window as any).debugCpuMemory = debugCpuMemory;
}