"use client";

import useGameStore from "@/lib/gameStore";
import { formatNumber, formatCurrency } from "@/utils/numberFormat";

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
  
  // Using our new currency formatter instead of the old function
  // This function is no longer used but kept for backward compatibility
  const _formatMoney = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 mb-6 border border-green-400/20">
      <h2 className="text-xl font-bold mb-4 text-green-400">Resources</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Paperclips</div>
          <div className="text-2xl font-bold text-green-400">{formatNumber(paperclips, 1, 0)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Money</div>
          <div className="text-2xl font-bold text-yellow-500">{formatCurrency(money)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Wire</div>
          <div className="text-2xl font-bold text-yellow-500">{formatNumber(wire, 1, 0)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Per Second</div>
          <div className="text-2xl font-bold text-green-400">{formatNumber(clicks_per_second / 10, 1)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">  
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Total Clicks</div>
          <div className="text-xl font-bold text-green-400">{formatNumber(totalClicks, 1, 0)}</div>
        </div>
        
        <div className="backdrop-blur-sm bg-gray-800/50 rounded-lg p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
          <div className="text-sm text-green-300/70">Total Sales</div>
          <div className="text-xl font-bold text-yellow-500">{formatCurrency(totalSales)}</div>
        </div>
      </div>
      
      {/* Advanced Resources Section */}
      <h3 className="text-lg font-semibold mt-6 mb-3 text-green-400">Advanced Resources</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {/* Trust */}
        <div className="backdrop-blur-sm bg-indigo-900/30 rounded-lg p-3 border border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-300">
          <div className="text-sm text-indigo-300">Trust</div>
          <div className="text-xl font-bold text-indigo-400">{formatNumber(trust, 1, 0)} <span className="text-xs font-normal">Level {trustLevel}</span></div>
          <div className="text-xs text-indigo-300/70 mt-1">
            Next: {formatNumber(nextTrustAt - totalPaperclipsMade, 1, 0)} clips
          </div>
          <div className="text-xs bg-yellow-900/20 border border-yellow-400/30 p-1 rounded mt-2 text-yellow-400">
            Required for next game stage (50+ Trust)
          </div>
        </div>
        
        {/* OPs */}
        <div className="backdrop-blur-sm bg-cyan-900/30 rounded-lg p-3 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
          <div className="text-sm text-cyan-300">Operations</div>
          <div className="text-xl font-bold text-cyan-400">
            {formatNumber(ops, 1)} <span className="text-xs font-normal">/ {formatNumber(opsMax, 1, 0)}</span>
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            Memory: {formatNumber(memory, 1)}/{formatNumber(memoryMax, 0)}
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            CPU: Level {cpuLevel} (Memory: {formatNumber(memoryRegenRate, 1)}/sec)
          </div>
          <div className="text-xs text-cyan-300/70 mt-1">
            OPs Generation: {formatNumber(cpuLevel * 1.0, 1)}/sec
          </div>
          <div className="text-xs bg-green-900/20 border border-green-400/30 p-1 rounded mt-2 text-green-400">
            Production bonus: +{formatNumber(ops/100, 2)}x at {formatNumber(Math.floor(ops), 0)} OPs (CPU adds {formatNumber(cpuLevel * 50, 0)} OPs max)
          </div>
        </div>
        
        {/* Yomi */}
        <div className={`backdrop-blur-sm rounded-lg p-3 border transition-all duration-300 ${cpuLevel >= 30 || spaceAgeUnlocked ? 'bg-amber-900/30 border-amber-400/30 hover:border-amber-400/50' : 'bg-gray-800/50 border-gray-700/30'}`}>
          <div className={`text-sm ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-300' : 'text-gray-400'}`}>
            Yomi {cpuLevel < 30 && !spaceAgeUnlocked && <span>🔒</span>}
          </div>
          <div className={`text-xl font-bold ${cpuLevel >= 30 || spaceAgeUnlocked ? 'text-amber-400' : 'text-gray-400'}`}>
            {cpuLevel >= 30 || spaceAgeUnlocked ? formatNumber(yomi, 1) : '???'}
          </div>
          <div className="text-xs mt-1">
            {cpuLevel >= 30 || spaceAgeUnlocked ? (
              <span className="text-amber-300/70">
                +{formatNumber((memory + cpuLevel) * 0.005, 3)} per second
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
            {creativityUnlocked ? formatNumber(creativity, 1) : '???'}
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
          <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">Production Multiplier:</div>
          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
            {formatNumber((productionMultiplier || 1) * (1 + (ops / 100)), 1)}x
          </div>
        </div>
        <div className="flex flex-col text-xs text-green-300/60 mt-1">
          <div>Increases paperclip production rate</div>
          <div className="mt-1 flex justify-between">
            <span>Base: {formatNumber(productionMultiplier || 1, 1)}x</span>
            <span>OPs Bonus: +{formatNumber(ops / 100, 2)}x</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-green-300/60 flex justify-between">
        <div>Autoclippers: {formatNumber(autoclippers, 0)}</div>
        <div>Clips Sold: {formatNumber(paperclipsSold, 0)}</div>
      </div>
    </div>
  );
}
