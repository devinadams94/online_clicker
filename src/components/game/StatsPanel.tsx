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
    <div className="card bg-blue-50 dark:bg-gray-800 h-auto pb-5 min-h-[230px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300">System Stats</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
        <div className="bg-blue-100/50 dark:bg-blue-900/20 p-2 rounded">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-blue-700 dark:text-blue-300">CPU Level:</span>
            <span className="font-bold">{cpuLevel}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Memory Regen Rate:</span>
            <span>{memoryRegenRate.toFixed(1)}/sec</span>
          </div>
          <button
            className={`w-full btn ${canUpgradeCPU ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 cursor-not-allowed'} py-1 text-sm`}
            onClick={upgradeCPU}
            disabled={!canUpgradeCPU}
          >
            Upgrade CPU ({formatMoney(cpuCost)})
          </button>
        </div>
        
        {/* Memory Section */}
        <div className="bg-blue-100/50 dark:bg-blue-900/20 p-2 rounded">
          <div className="flex justify-between mb-1">
            <span className="font-medium text-blue-700 dark:text-blue-300">Memory:</span>
            <span className="font-bold">{Math.floor(memory)} / {memoryMax}</span>
          </div>
          
          {/* Memory Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${memoryPercentage}%` }}
            ></div>
          </div>
          
          <button
            className={`w-full btn ${canUpgradeMemory ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 cursor-not-allowed'} py-1 text-sm`}
            onClick={upgradeMemory}
            disabled={!canUpgradeMemory}
          >
            Upgrade Memory ({formatMoney(memoryCost)})
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 text-sm space-y-2 border-t pt-4 text-gray-600 dark:text-gray-400">
          <p>CPU determines how quickly memory regenerates.</p>
          <p>Memory is consumed by various operations and regenerates over time.</p>
          <p>Upgrade your system stats to perform more complex operations.</p>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-semibold mb-1">CPU</div>
              <div>+0.5 memory/sec per level</div>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-semibold mb-1">Memory</div>
              <div>+50 capacity per upgrade</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}