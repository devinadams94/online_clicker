"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function StatsPanel() {
  const { 
    money,
    cpuLevel,
    cpuCost,
    memory,
    memoryMax,
    memoryCost,
    memoryRegenRate,
    upgradeCPU,
    upgradeMemory
  } = useGameStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format money with 2 decimal places
  const formatMoney = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  // Check if player has enough money for upgrades
  const canUpgradeCPU = money >= cpuCost;
  const canUpgradeMemory = money >= memoryCost;
  
  // Calculate memory percentage
  const memoryPercentage = (memory / memoryMax) * 100;
  
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 h-auto pb-5 min-h-[230px] border border-green-400/20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-green-400">System Stats</h2>
        <button 
          className="text-green-300 hover:text-green-400 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle details"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            )}
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col space-y-3">
        {/* CPU Section */}
        <div className="backdrop-blur-sm bg-blue-900/20 p-2 rounded-lg border border-blue-400/30">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-blue-300">CPU Level:</span>
            <span className="font-bold text-blue-400">{cpuLevel}</span>
          </div>
          <div className="flex justify-between text-sm mb-2 text-blue-300/70">
            <span>Memory Regen Rate:</span>
            <span className="text-blue-400">{memoryRegenRate.toFixed(1)}/sec</span>
          </div>
          <button
            className={`w-full py-1 text-sm rounded-lg transition-all duration-300 ${canUpgradeCPU ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}
            onClick={upgradeCPU}
            disabled={!canUpgradeCPU}
          >
            Upgrade CPU ({formatMoney(cpuCost)})
          </button>
        </div>
        
        {/* Memory Section */}
        <div className="backdrop-blur-sm bg-cyan-900/20 p-2 rounded-lg border border-cyan-400/30">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-cyan-300">Memory:</span>
            <span className="font-bold text-cyan-400">{Math.floor(memory)} / {memoryMax}</span>
          </div>
          
          {/* Memory Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              style={{ width: `${memoryPercentage}%` }}
            ></div>
          </div>
          
          <button
            className={`w-full py-1 text-sm rounded-lg transition-all duration-300 ${canUpgradeMemory ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)] hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}
            onClick={upgradeMemory}
            disabled={!canUpgradeMemory}
          >
            Upgrade Memory ({formatMoney(memoryCost)})
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 text-sm space-y-2 border-t border-green-400/20 pt-4 text-green-300/70">
          <p>CPU determines how quickly memory regenerates.</p>
          <p>Memory is consumed by various operations and regenerates over time.</p>
          <p>Upgrade your system stats to perform more complex operations.</p>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-800/50 rounded-lg border border-blue-400/20">
              <div className="font-semibold mb-1 text-blue-400">CPU</div>
              <div className="text-blue-300/70">+0.5 memory/sec per level</div>
            </div>
            <div className="p-2 bg-gray-800/50 rounded-lg border border-cyan-400/20">
              <div className="font-semibold mb-1 text-cyan-400">Memory</div>
              <div className="text-cyan-300/70">+50 capacity per upgrade</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}