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
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 mb-6 border border-green-400/20">
      <h2 className="text-xl font-bold mb-4 text-green-400">Resources</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Paperclips</div>
          <div className="text-2xl font-bold text-green-400">{Math.floor(paperclips)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Money</div>
          <div className="text-2xl font-bold text-yellow-500">${money.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Wire</div>
          <div className="text-2xl font-bold text-yellow-500">{Math.floor(wire)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Per Second</div>
          <div className="text-2xl font-bold text-green-400">{(clicks_per_second / 10).toFixed(1)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">  
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Total Clicks</div>
          <div className="text-xl font-bold text-green-400">{totalClicks}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Total Sales</div>
          <div className="text-xl font-bold text-yellow-500">${totalSales.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Advanced Resources Section */}
      <h3 className="text-lg font-semibold mt-6 mb-3 text-green-400">Advanced Resources</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {/* Trust */}
        <div className="backdrop-blur-sm bg-indigo-900/30 rounded-lg p-3 border border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-300">
          <div className="text-sm text-indigo-300">Trust</div>
          <div className="text-xl font-bold text-indigo-400">{trust} <span className="text-xs font-normal">Level {trustLevel}</span></div>
          <div className="text-xs text-indigo-300/70 mt-1">
            Next: {(nextTrustAt - totalPaperclipsMade).toLocaleString()} clips
          </div>
          <div className="text-xs bg-yellow-900/20 border border-yellow-400/30 p-1 rounded mt-2 text-yellow-400">
            Required for next game stage (50+ Trust)
          </div>
        </div>
        
        {/* OPs */}
        <div className="backdrop-blur-sm bg-cyan-900/30 rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
          <div className="text-sm text-cyan-300">Operations</div>
          <div className="text-xl font-bold text-cyan-400">
            {ops.toFixed(1)} <span className="text-xs font-normal">/ {opsMax}</span>
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            Memory: {memory.toFixed(1)}/{memoryMax}
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            CPU: Level {cpuLevel} (Memory: {memoryRegenRate.toFixed(1)}/sec)
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            OPs Generation: {(cpuLevel * 1.0).toFixed(1)}/sec
          </div>
          <div className="text-xs bg-green-900/20 border border-green-400/30 p-1 rounded mt-2 text-green-400">
            Production bonus: +{opsProductionMultiplier.toFixed(2)}x ({(ops/100).toFixed(2)}x at {Math.floor(ops)} OPs)
          </div>
        </div>
        
        {/* Yomi */}
        <div className={`backdrop-blur-sm rounded-lg p-3 border transition-all duration-300 ${cpuLevel >= 30 || spaceAgeUnlocked ? 'bg-amber-900/30 border-amber-400/30 hover:border-amber-400/50' : 'bg-gray-800/50 border-gray-700/30'}`}>
          <div className={`text-sm ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-300' : 'text-gray-400'}`}>
            Yomi {cpuLevel < 30 && !spaceAgeUnlocked && <span>🔒</span>}
          </div>
          <div className={`text-xl font-bold ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-400' : 'text-gray-400'}`}>
            {cpuLevel >= 30 || spaceAgeUnlocked ? yomi.toFixed(1) : '???'}
          </div>
          <div className="text-xs mt-1">
            {cpuLevel >= 30 || spaceAgeUnlocked ? (
              <span className="text-amber-300/70">
                +{((memory + cpuLevel) * 0.005).toFixed(3)} per second
              </span>
            ) : (
              <span className="text-gray-500">
                Requires CPU Level 30 to unlock
              </span>
            )}
          </div>
          {spaceAgeUnlocked && (
            <div className="text-xs bg-blue-900/20 border border-blue-400/30 p-1 rounded mt-2 text-blue-400">
              Required for Space Age upgrades
            </div>
          )}
        </div>
        
        {/* Creativity */}
        <div className={`backdrop-blur-sm rounded-lg p-3 border transition-all duration-300 ${creativityUnlocked ? 'bg-purple-900/30 border-purple-400/30 hover:border-purple-400/50' : 'bg-gray-800/50 border-gray-700/30'}`}>
          <div className={`text-sm ${creativityUnlocked ? 'text-purple-300' : 'text-gray-400'}`}>
            Creativity {!creativityUnlocked && <span>🔒</span>}
          </div>
          <div className={`text-xl font-bold ${creativityUnlocked ? 'text-purple-400' : 'text-gray-400'}`}>
            {creativityUnlocked ? creativity.toFixed(1) : '???'}
          </div>
          <div className="text-xs mt-1 flex items-center">
            {creativityUnlocked ? (
              <span className="text-purple-300/70">
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
      <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 mb-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-green-300">Production Multiplier:</div>
          <div className="text-lg font-bold text-green-400">
            {((productionMultiplier || 1) + (opsProductionMultiplier || 0)).toFixed(1)}x
          </div>
        </div>
        <div className="flex flex-col text-xs text-green-300/60 mt-1">
          <div>Increases paperclip production rate</div>
          <div className="mt-1 flex justify-between">
            <span>Base: {(productionMultiplier || 1).toFixed(1)}x</span>
            <span>OPs Bonus: +{(opsProductionMultiplier || 0).toFixed(1)}x</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-green-300/60 flex justify-between">
        <div>Autoclippers: {autoclippers}</div>
        <div>Clips Sold: {Math.floor(paperclipsSold)}</div>
      </div>
    </div>
  );
}
