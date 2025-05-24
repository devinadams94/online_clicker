"use client";

import useGameStore from "@/lib/gameStore";

export default function ResourcesPanel() {
  const { 
    paperclips, 
    money,
    wire,
    yomi,
    clicks_per_second, 
    // clickMultiplier, 
    autoclippers,
    totalClicks,
    totalPaperclipsMade,
    paperclipsSold,
    totalSales,
    trust,
    trustLevel,
    nextTrustAt,
    ops,
    opsMax,
    creativity,
    creativityUnlocked,
    memory,
    memoryMax,
    productionMultiplier,
    cpuLevel,
    memoryRegenRate,
    opsProductionMultiplier,
    spaceAgeUnlocked
  } = useGameStore();
  
  // Format money with 2 decimal places
  const _formatMoney = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Resources</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Paperclips</div>
          <div className="text-2xl font-bold">{Math.floor(paperclips)}</div>
        </div>
        
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Money</div>
          <div className="text-2xl font-bold text-green-600">${money.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Wire</div>
          <div className="text-2xl font-bold text-yellow-600">{Math.floor(wire)}</div>
        </div>
        
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Per Second</div>
          <div className="text-2xl font-bold">{(clicks_per_second / 10).toFixed(1)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">  
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</div>
          <div className="text-xl font-bold">{totalClicks}</div>
        </div>
        
        <div className="card bg-white dark:bg-gray-800 p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
          <div className="text-xl font-bold">${totalSales.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Advanced Resources Section */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Advanced Resources</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {/* Trust */}
        <div className="card bg-indigo-50 dark:bg-indigo-900/30 p-3">
          <div className="text-sm text-indigo-600 dark:text-indigo-300">Trust</div>
          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{trust} <span className="text-xs font-normal">Level {trustLevel}</span></div>
          <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
            Next: {(nextTrustAt - totalPaperclipsMade).toLocaleString()} clips
          </div>
          <div className="text-xs bg-yellow-100 dark:bg-yellow-900/20 p-1 rounded mt-2 text-yellow-700 dark:text-yellow-400">
            Required for next game stage (50+ Trust)
          </div>
        </div>
        
        {/* OPs */}
        <div className="card bg-cyan-50 dark:bg-cyan-900/30 p-3">
          <div className="text-sm text-cyan-600 dark:text-cyan-300">Operations</div>
          <div className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            {ops.toFixed(1)} <span className="text-xs font-normal">/ {opsMax}</span>
          </div>
          <div className="text-xs text-cyan-500 dark:text-cyan-400 mt-1">
            Memory: {memory.toFixed(1)}/{memoryMax}
          </div>
          <div className="text-xs text-cyan-500 dark:text-cyan-400 mt-1">
            CPU: Level {cpuLevel} (Memory: {memoryRegenRate.toFixed(1)}/sec)
          </div>
          <div className="text-xs text-cyan-500 dark:text-cyan-400 mt-1">
            OPs Generation: {(cpuLevel * 1.0).toFixed(1)}/sec
          </div>
          <div className="text-xs bg-green-100 dark:bg-green-900/20 p-1 rounded mt-2 text-green-700 dark:text-green-400">
            Production bonus: +{opsProductionMultiplier.toFixed(2)}x ({(ops/100).toFixed(2)}x at {Math.floor(ops)} OPs)
          </div>
        </div>
        
        {/* Yomi */}
        <div className={`card p-3 ${cpuLevel >= 30 || spaceAgeUnlocked ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className={`text-sm ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-600 dark:text-amber-300' : 'text-gray-400'}`}>
            Yomi {cpuLevel < 30 && !spaceAgeUnlocked && <span>🔒</span>}
          </div>
          <div className={`text-xl font-bold ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-700 dark:text-amber-300' : 'text-gray-400'}`}>
            {cpuLevel >= 30 || spaceAgeUnlocked ? yomi.toFixed(1) : '???'}
          </div>
          <div className="text-xs mt-1">
            {cpuLevel >= 30 || spaceAgeUnlocked ? (
              <span className="text-amber-500 dark:text-amber-400">
                +{((memory + cpuLevel) * 0.005).toFixed(3)} per second
              </span>
            ) : (
              <span className="text-gray-500">
                Requires CPU Level 30 to unlock
              </span>
            )}
          </div>
          {spaceAgeUnlocked && (
            <div className="text-xs bg-blue-100 dark:bg-blue-900/20 p-1 rounded mt-2 text-blue-700 dark:text-blue-400">
              Required for Space Age upgrades
            </div>
          )}
        </div>
        
        {/* Creativity */}
        <div className={`card p-3 ${creativityUnlocked ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <div className={`text-sm ${creativityUnlocked ? 'text-purple-600 dark:text-purple-300' : 'text-gray-400'}`}>
            Creativity {!creativityUnlocked && <span>🔒</span>}
          </div>
          <div className={`text-xl font-bold ${creativityUnlocked ? 'text-purple-700 dark:text-purple-300' : 'text-gray-400'}`}>
            {creativityUnlocked ? creativity.toFixed(1) : '???'}
          </div>
          <div className="text-xs mt-1 flex items-center">
            {creativityUnlocked ? (
              <span className="text-purple-500 dark:text-purple-400">
                +0.1 per second when OPs are full
              </span>
            ) : (
              <span className="text-gray-500">
                Requires 20000 OPs capacity to unlock
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Production Stats */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Production Multiplier:</div>
          <div className="text-lg font-bold text-green-600">
            {((productionMultiplier || 1) + (opsProductionMultiplier || 0)).toFixed(1)}x
          </div>
        </div>
        <div className="flex flex-col text-xs text-gray-500 mt-1">
          <div>Increases paperclip production rate</div>
          <div className="mt-1 flex justify-between">
            <span>Base: {(productionMultiplier || 1).toFixed(1)}x</span>
            <span>OPs Bonus: +{(opsProductionMultiplier || 0).toFixed(1)}x</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div>Autoclippers: {autoclippers}</div>
        <div>Clips Sold: {Math.floor(paperclipsSold)}</div>
      </div>
      
      <div className="flex space-x-2">
        {/* Debug: Add a manual save button */}
        <button 
          className="mt-3 text-xs text-blue-500 hover:text-blue-700 border border-blue-300 p-1 rounded"
          onClick={() => {
            // Force money value to increase (debug only)
            const gameState = useGameStore.getState();
            const origMoney = gameState.money;
            useGameStore.setState({ 
              money: origMoney + 100000000,
              botLastTradeTime: new Date() // Set to current time to avoid undefined issues
            });
            // Call whatever save function exists on window
            if (window.saveGameNow) {
              window.saveGameNow();
            }
          }}
        >
          DEBUG: Save Game + $100M
        </button>
        
        {/* Debug: Add yomi for testing */}
        <button 
          className="mt-3 text-xs text-amber-500 hover:text-amber-700 border border-amber-300 p-1 rounded"
          onClick={() => {
            // Add yomi (debug only)
            const gameState = useGameStore.getState();
            const origYomi = gameState.yomi || 0;
            useGameStore.setState({ 
              yomi: origYomi + 1000
              // spaceAgeUnlocked is no longer automatically set to true
            });
            // Call save function
            if (window.saveGameNow) {
              window.saveGameNow();
            }
          }}
        >
          DEBUG: +1000 Yomi
        </button>
        
        {/* Debug: Add a reload button */}
        <button 
          className="mt-3 text-xs text-green-500 hover:text-green-700 border border-green-300 p-1 rounded"
          onClick={() => {
            // Reload from server
            fetch('/api/game/load')
              .then(r => r.json())
              .then(data => {
                // Apply money and paperclip price values from database to game state
                const state = useGameStore.getState();
                let updates: Record<string, number> = {};
                let updateMessage: string[] = [];
                
                if (data && typeof data.money === 'number') {
                  const origMoney = state.money;
                  updates.money = data.money;
                  updateMessage.push(`Money: ${origMoney} → ${data.money}`);
                }
                
                if (data && typeof data.paperclipPrice === 'number') {
                  const origPrice = state.paperclipPrice;
                  updates.paperclipPrice = data.paperclipPrice;
                  updateMessage.push(`Price: ${origPrice} → ${data.paperclipPrice}`);
                }
                
                // Apply updates if we have any
                if (Object.keys(updates).length > 0) {
                  useGameStore.setState(updates);
                  alert(`Updated values:\n${updateMessage.join('\n')}`);
                }
              });
          }}
        >
          DEBUG: Check Saved Data
        </button>
      </div>
    </div>
  );
}
