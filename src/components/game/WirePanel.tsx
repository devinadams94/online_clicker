"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

export default function WirePanel() {
  const { 
    wire,
    money,
    spoolCost,
    wirePerSpool,
    buyWireSpool,
    autoWireBuyer,
    autoWireBuyerCost,
    buyAutoWireBuyer,
    spoolSizeLevel,
    spoolSizeUpgradeCost,
    upgradeSpoolSize
  } = useGameStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if player has enough money to buy wire, auto-buyer, and spool upgrade
  const canBuyWire = money >= spoolCost;
  const canBuyAutoWire = money >= autoWireBuyerCost && !autoWireBuyer;
  const canUpgradeSpoolSize = money >= spoolSizeUpgradeCost;
  
  // Track spool size data
  useEffect(() => {
    // No operations needed, just dependency tracking
  }, [spoolSizeLevel, wirePerSpool, spoolSizeUpgradeCost]);
  
  // Function to handle spool upgrade
  const handleUpgradeSpoolSize = () => {
    upgradeSpoolSize();
    // Use setTimeout to ensure state is updated before saving
    setTimeout(() => {
      // Force a save to ensure database persistence
      if (window.saveGameNow) {
        window.saveGameNow();
      }
    }, 100);
  };
  
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 border border-green-400/20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-green-400">Wire Management</h2>
        <button 
          className="text-xs text-green-300 hover:text-green-400 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Info' : 'Info'}
        </button>
      </div>
      
      <div className="mb-2 backdrop-blur-sm bg-gray-800/50 p-2 rounded-lg flex items-center justify-between border border-green-400/20">
        <div className="flex-1 mr-2">
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ 
              width: `${Math.min(100, (wire / wirePerSpool) * 100)}%` 
            }}></div>
          </div>
        </div>
        <span className="text-sm whitespace-nowrap text-yellow-400 font-medium">{Math.floor(wire)} wire</span>
      </div>
      
      <div className="mb-2 flex justify-between items-center text-xs text-green-300/70">
        <span>Spool Size: <span className="text-green-400">{wirePerSpool}</span></span>
        <span>Level: <span className="text-green-400">{spoolSizeLevel}</span></span>
      </div>
      
      {isExpanded && (
        <div className="text-xs mb-2 p-2 backdrop-blur-sm bg-blue-900/20 rounded-lg border border-blue-400/30">
          <ul className="list-disc list-inside space-y-1 text-blue-300">
            <li>1 paperclip needs 1 wire</li>
            <li>1 spool = {wirePerSpool} wire</li>
            <li>Spool price: ${spoolCost.toFixed(2)} (max $250)</li>
            <li>Price scales faster with frequent purchases</li>
            <li>Each upgrade increases wire by 500%</li>
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          className={`py-1 rounded-lg text-sm transition-all duration-300 ${canBuyWire ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-[0_0_10px_rgba(74,222,128,0.4)] hover:shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}
          onClick={buyWireSpool}
          disabled={!canBuyWire}
        >
          Buy Spool (${spoolCost.toFixed(2)})
        </button>
        
        <button
          className={`py-1 rounded-lg text-sm transition-all duration-300 ${canUpgradeSpoolSize ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-[0_0_10px_rgba(251,191,36,0.4)] hover:shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}
          onClick={handleUpgradeSpoolSize}
          disabled={!canUpgradeSpoolSize}
        >
          Upgrade Size (${spoolSizeUpgradeCost})
        </button>
      </div>
      
      <div className="w-full">
        {!autoWireBuyer ? (
          <button
            className={`w-full py-1 rounded-lg text-sm transition-all duration-300 ${canBuyAutoWire ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}
            onClick={buyAutoWireBuyer}
            disabled={!canBuyAutoWire}
          >
            Auto-Buy Wire (${autoWireBuyerCost.toFixed(2)})
          </button>
        ) : (
          <div className="w-full py-1 bg-green-900/20 rounded-lg text-xs flex items-center justify-center text-green-400 border border-green-400/30">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Auto-Buy Active
          </div>
        )}
      </div>
    </div>
  );
}