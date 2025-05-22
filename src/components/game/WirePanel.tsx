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
  
  // Verify spool size data on mount
  useEffect(() => {
    console.log("WirePanel mounted with spool data:");
    console.log("- Spool size level:", spoolSizeLevel);
    console.log("- Wire per spool:", wirePerSpool);
    console.log("- Spool upgrade cost:", spoolSizeUpgradeCost);
    
    // Return cleanup function to log values when component unmounts
    return () => {
      const state = useGameStore.getState();
      console.log("WirePanel unmounting with spool data:");
      console.log("- Final spool size level:", state.spoolSizeLevel);
      console.log("- Final wire per spool:", state.wirePerSpool);
      console.log("- Final spool upgrade cost:", state.spoolSizeUpgradeCost);
    };
  }, [spoolSizeLevel, wirePerSpool, spoolSizeUpgradeCost]);
  
  // Function to handle spool upgrade with UI verification
  const handleUpgradeSpoolSize = () => {
    console.log("Before upgrade - Level:", spoolSizeLevel, "Cost:", spoolSizeUpgradeCost, "Wire per spool:", wirePerSpool);
    upgradeSpoolSize();
    // Use setTimeout to log the values after the state update is applied
    setTimeout(() => {
      const state = useGameStore.getState();
      console.log("After upgrade - Level:", state.spoolSizeLevel, "Cost:", state.spoolSizeUpgradeCost, "Wire per spool:", state.wirePerSpool);
      
      // Force a save to test database persistence
      if (window.saveGameNow) {
        console.log("Forcing save after spool upgrade");
        window.saveGameNow();
      }
    }, 100);
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Wire Management</h2>
        <button 
          className="text-xs text-blue-500 hover:text-blue-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Info' : 'Info'}
        </button>
      </div>
      
      <div className="mb-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex items-center justify-between">
        <div className="flex-1 mr-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full" style={{ 
              width: `${Math.min(100, (wire / wirePerSpool) * 100)}%` 
            }}></div>
          </div>
        </div>
        <span className="text-sm whitespace-nowrap">{Math.floor(wire)} wire</span>
      </div>
      
      <div className="mb-2 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
        <span>Spool Size: {wirePerSpool}</span>
        <span>Level: {spoolSizeLevel}</span>
      </div>
      
      {isExpanded && (
        <div className="text-xs mb-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
          <ul className="list-disc list-inside space-y-1">
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
          className={`py-1 rounded text-sm ${canBuyWire ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'}`}
          onClick={buyWireSpool}
          disabled={!canBuyWire}
        >
          Buy Spool (${spoolCost.toFixed(2)})
        </button>
        
        <button
          className={`py-1 rounded text-sm ${canUpgradeSpoolSize ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'}`}
          onClick={handleUpgradeSpoolSize}
          disabled={!canUpgradeSpoolSize}
        >
          Upgrade Size (${spoolSizeUpgradeCost})
        </button>
      </div>
      
      <div className="w-full">
        {!autoWireBuyer ? (
          <button
            className={`w-full py-1 rounded text-sm ${canBuyAutoWire ? 'bg-secondary-600 text-white hover:bg-secondary-700' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={buyAutoWireBuyer}
            disabled={!canBuyAutoWire}
          >
            Auto-Buy Wire (${autoWireBuyerCost.toFixed(2)})
          </button>
        ) : (
          <div className="w-full py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs flex items-center justify-center text-green-600">
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