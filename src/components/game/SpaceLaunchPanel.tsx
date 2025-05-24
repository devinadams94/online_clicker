"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceLaunchPanel() {
  const {
    probes,
    universeExplored,
    wireHarvesters,
    oreHarvesters,
    factories,
    spaceWirePerSecond,
    spaceOrePerSecond,
    spacePaperclipsPerSecond,
    spaceStats,
    makeProbe,
    launchWireHarvester,
    launchOreHarvester,
    buildFactory,
    spaceAgeUnlocked,
    paperclips,
    aerogradePaperclips
  } = useGameStore();
  
  // Format numbers with appropriate suffixes
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  // Helper function to calculate total cost for bulk purchases with exponential scaling
  const calculateBulkCost = (baseCost: number, currentCount: number, amount: number) => {
    let totalCost = 0;
    for (let i = 0; i < amount; i++) {
      const scaleFactor = Math.pow(1.0125, currentCount + i); // Changed from 1.05 to 1.0125
      totalCost += Math.floor(baseCost * scaleFactor);
    }
    return totalCost;
  };
  
  // Trigger a game save after state changes
  const triggerGameSave = () => {
    try {
      // Attempt to save the game state if the save function is available
      if (typeof window !== 'undefined' && window.saveGameNow) {
        window.saveGameNow().catch(() => {});
      }
    } catch (error) {
      // Silently fail
    }
  };
  
  // Bulk purchase functions
  const bulkLaunchWireHarvesters = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 10; // Base cost for wire harvesters in aerograde
    const totalCost = calculateBulkCost(baseCost, wireHarvesters, amount);
    
    if ((aerogradePaperclips || 0) < totalCost) {
      return;
    }
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      wireHarvesters: wireHarvesters + amount,
      aerogradePaperclips: (aerogradePaperclips || 0) - totalCost
    });
    
    // Save the game state
    setTimeout(triggerGameSave, 200);
  };
  
  const bulkLaunchOreHarvesters = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 10; // Base cost for ore harvesters in aerograde
    const totalCost = calculateBulkCost(baseCost, oreHarvesters, amount);
    
    if ((aerogradePaperclips || 0) < totalCost) {
      return;
    }
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      oreHarvesters: oreHarvesters + amount,
      aerogradePaperclips: (aerogradePaperclips || 0) - totalCost
    });
    
    // Save the game state
    setTimeout(triggerGameSave, 200);
  };
  
  const bulkBuildFactories = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 100; // Base cost for factories in aerograde
    const totalCost = calculateBulkCost(baseCost, factories, amount);
    
    if ((aerogradePaperclips || 0) < totalCost) {
      return;
    }
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      factories: factories + amount,
      aerogradePaperclips: (aerogradePaperclips || 0) - totalCost
    });
    
    // Save the game state
    setTimeout(triggerGameSave, 200);
  };

  // Format percentage showing all decimal places
  const formatPercentage = (percentage: number) => {
    // For tiny values, display with many decimal places
    if (percentage === 0) {
      return "0.000000000000";
    }
    
    // Format with 12 decimal places, keeping all zeros
    const formattedValue = percentage.toFixed(12);
    
    // Return the full value with all zeros
    return formattedValue;
  };
  
  // Calculate current costs with 5% scaling per purchase
  const getWireHarvesterCost = () => {
    const baseCost = 10; // 10 aerograde
    const scaleFactor = Math.pow(1.0125, wireHarvesters);
    return Math.floor(baseCost * scaleFactor);
  };
  
  const getOreHarvesterCost = () => {
    const baseCost = 10; // 10 aerograde
    const scaleFactor = Math.pow(1.0125, oreHarvesters);
    return Math.floor(baseCost * scaleFactor);
  };
  
  const getFactoryCost = () => {
    const baseCost = 100; // 100 aerograde
    const scaleFactor = Math.pow(1.0125, factories);
    return Math.floor(baseCost * scaleFactor);
  };
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return (
      <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <span className="text-xl mr-2">🚀</span> Space Launch Center
        </h2>
        
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl mb-2 text-center">Space Age Not Unlocked</h3>
          <p className="text-center text-gray-400 mb-4 max-w-md">
            Purchase the Space Age upgrade to access interstellar exploration and expand your paperclip empire to the stars.
          </p>
          <div className="w-48 h-1 bg-gray-700 rounded-full my-4"></div>
          <p className="text-sm text-gray-500">
            Return to the upgrades page to unlock Space Age capabilities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">🚀</span> Space Launch Center
      </h2>
      
      {/* Universe exploration status */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Universe explored:</span>
          <span className="text-sm font-bold text-cyan-400">{formatPercentage(universeExplored)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-cyan-500 h-1.5 rounded-full" 
            style={{ width: `${Math.max(0.001, Math.min(100, universeExplored * 100))}%` }}
          ></div>
        </div>
      </div>
      
      {/* Probe controls */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Probes</span>
          <span className="text-cyan-300 font-bold">{formatNumber(probes)}</span>
        </div>
        <p className="text-xs text-gray-300 mb-3">
          Automated spacecraft that explore the universe and self-replicate based on your exploration and self-replication stats.
          <span className="block mt-1 font-semibold text-cyan-300">Cost: 5 aerograde paperclips</span>
        </p>
        <button
          className={`w-full py-2 px-3 rounded ${
            (aerogradePaperclips || 0) >= 5 
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
          onClick={() => makeProbe()}
          disabled={(aerogradePaperclips || 0) < 5}
        >
          Launch Probe
        </button>
        {(aerogradePaperclips || 0) < 5 && (
          <p className="text-xs text-red-400 mt-2 text-center">
            Not enough aerograde paperclips (have {formatNumber(aerogradePaperclips || 0)}/5)
          </p>
        )}
      </div>
      
      {/* Production Drone Controls */}
      <div className="bg-gray-700 p-3 rounded mb-4">
        <h3 className="font-medium mb-3">Production Controls</h3>
        
        {/* Wire Harvester Button */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Space Wire Production Drone</span>
            <span className="text-xs text-blue-300">Cost: {formatNumber(getWireHarvesterCost())} aerograde</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= getWireHarvesterCost() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => launchWireHarvester()}
              disabled={(aerogradePaperclips || 0) < getWireHarvesterCost()}
            >
              Launch 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(10, wireHarvesters, 100)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchWireHarvesters(100)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(10, wireHarvesters, 100)}
            >
              Launch 100<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(10, wireHarvesters, 100))})
              </span>
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(10, wireHarvesters, 1000)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchWireHarvesters(1000)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(10, wireHarvesters, 1000)}
            >
              Launch 1000<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(10, wireHarvesters, 1000))})
              </span>
            </button>
          </div>
          {(aerogradePaperclips || 0) < getWireHarvesterCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getWireHarvesterCost() - (aerogradePaperclips || 0))} more aerograde
            </p>
          )}
        </div>
        
        {/* Ore Harvester Button */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Ore Harvester Drone</span>
            <span className="text-xs text-amber-300">Cost: {formatNumber(getOreHarvesterCost())} aerograde</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= getOreHarvesterCost() 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => launchOreHarvester()}
              disabled={(aerogradePaperclips || 0) < getOreHarvesterCost()}
            >
              Launch 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(10, oreHarvesters, 100)
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchOreHarvesters(100)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(10, oreHarvesters, 100)}
            >
              Launch 100<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(10, oreHarvesters, 100))})
              </span>
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(10, oreHarvesters, 1000)
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchOreHarvesters(1000)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(10, oreHarvesters, 1000)}
            >
              Launch 1000<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(10, oreHarvesters, 1000))})
              </span>
            </button>
          </div>
          {(aerogradePaperclips || 0) < getOreHarvesterCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getOreHarvesterCost() - (aerogradePaperclips || 0))} more aerograde
            </p>
          )}
        </div>
        
        {/* Factory Button */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Space Factory</span>
            <span className="text-xs text-purple-300">Cost: {formatNumber(getFactoryCost())} aerograde</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= getFactoryCost() 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => buildFactory()}
              disabled={(aerogradePaperclips || 0) < getFactoryCost()}
            >
              Build 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(100, factories, 100)
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkBuildFactories(100)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(100, factories, 100)}
            >
              Build 100<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(100, factories, 100))})
              </span>
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                (aerogradePaperclips || 0) >= calculateBulkCost(100, factories, 1000)
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkBuildFactories(1000)}
              disabled={(aerogradePaperclips || 0) < calculateBulkCost(100, factories, 1000)}
            >
              Build 1000<br/>
              <span className="text-xs opacity-75">
                ({formatNumber(calculateBulkCost(100, factories, 1000))})
              </span>
            </button>
          </div>
          {(aerogradePaperclips || 0) < getFactoryCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getFactoryCost() - (aerogradePaperclips || 0))} more aerograde
            </p>
          )}
        </div>
      </div>
      
      {/* Resource production */}
      <div className="bg-gray-700 p-3 rounded">
        <h3 className="font-medium mb-2">Resource Production</h3>
        
        <div className="space-y-2">
          {/* Wire Harvesters */}
          <div>
            <div className="flex justify-between text-sm">
              <span>Space Wire Production Drones:</span>
              <span>{formatNumber(wireHarvesters)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Space Wire/sec:</span>
              <span>{formatNumber(spaceWirePerSecond)}</span>
            </div>
            <div className="flex justify-between text-xs text-orange-300">
              <span>Energy Required:</span>
              <span>{formatNumber(wireHarvesters * 2)} ⚡/sec</span>
            </div>
          </div>
          
          {/* Ore Harvesters */}
          <div>
            <div className="flex justify-between text-sm">
              <span>Ore Harvester Drones:</span>
              <span>{formatNumber(oreHarvesters)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Space Ore/sec:</span>
              <span>{formatNumber(spaceOrePerSecond)}</span>
            </div>
            <div className="flex justify-between text-xs text-orange-300">
              <span>Energy Required:</span>
              <span>{formatNumber(oreHarvesters * 2)} ⚡/sec</span>
            </div>
          </div>
          
          {/* Factories */}
          <div>
            <div className="flex justify-between text-sm">
              <span>Space Factories:</span>
              <span>{formatNumber(factories)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Aerograde Paperclips/sec:</span>
              <span>{formatNumber(spacePaperclipsPerSecond)}</span>
            </div>
            <div className="flex justify-between text-xs text-orange-300">
              <span>Energy Required:</span>
              <span>{formatNumber(factories * 5)} ⚡/sec</span>
            </div>
          </div>
        </div>
        
        {/* Total Energy Requirements */}
        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="flex justify-between text-sm font-medium text-orange-300">
            <span>Total Energy Required:</span>
            <span>{formatNumber((wireHarvesters * 2) + (oreHarvesters * 2) + (factories * 5))} ⚡/sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}