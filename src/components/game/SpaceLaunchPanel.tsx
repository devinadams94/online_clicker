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
    paperclips
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
      const scaleFactor = Math.pow(1.05, currentCount + i);
      totalCost += Math.floor(baseCost * scaleFactor);
    }
    return totalCost;
  };
  
  // Trigger a game save after state changes
  const triggerGameSave = () => {
    try {
      // Attempt to save the game state if the save function is available
      if (typeof window !== 'undefined' && window.saveGameNow) {
        console.log("Triggering game save after bulk purchase");
        window.saveGameNow()
          .then(() => console.log("Game save completed after bulk purchase"))
          .catch(err => console.error("Error saving game after bulk purchase:", err));
      }
    } catch (error) {
      console.error("Failed to trigger game save:", error);
    }
  };
  
  // Bulk purchase functions
  const bulkLaunchWireHarvesters = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 100000; // Base cost for wire harvesters
    const totalCost = calculateBulkCost(baseCost, wireHarvesters, amount);
    
    if (paperclips < totalCost) {
      console.log(`Not enough paperclips for bulk wire harvester purchase. Need ${totalCost}, have ${paperclips}`);
      return;
    }
    
    console.log(`Bulk purchasing ${amount} wire harvesters for ${totalCost} paperclips`);
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      wireHarvesters: wireHarvesters + amount,
      paperclips: paperclips - totalCost
    });
    
    // Save the game state
    setTimeout(triggerGameSave, 200);
  };
  
  const bulkLaunchOreHarvesters = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 100000; // Base cost for ore harvesters
    const totalCost = calculateBulkCost(baseCost, oreHarvesters, amount);
    
    if (paperclips < totalCost) {
      console.log(`Not enough paperclips for bulk ore harvester purchase. Need ${totalCost}, have ${paperclips}`);
      return;
    }
    
    console.log(`Bulk purchasing ${amount} ore harvesters for ${totalCost} paperclips`);
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      oreHarvesters: oreHarvesters + amount,
      paperclips: paperclips - totalCost
    });
    
    // Save the game state
    setTimeout(triggerGameSave, 200);
  };
  
  const bulkBuildFactories = (amount: number) => {
    // Check if player can afford the bulk purchase
    const baseCost = 1000000; // Base cost for factories
    const totalCost = calculateBulkCost(baseCost, factories, amount);
    
    if (paperclips < totalCost) {
      console.log(`Not enough paperclips for bulk factory purchase. Need ${totalCost}, have ${paperclips}`);
      return;
    }
    
    console.log(`Bulk purchasing ${amount} factories for ${totalCost} paperclips`);
    
    // Update state directly with the new count and reduced paperclips
    useGameStore.setState({
      factories: factories + amount,
      paperclips: paperclips - totalCost
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
    const baseCost = 100000;
    const scaleFactor = Math.pow(1.05, wireHarvesters);
    return Math.floor(baseCost * scaleFactor);
  };
  
  const getOreHarvesterCost = () => {
    const baseCost = 100000;
    const scaleFactor = Math.pow(1.05, oreHarvesters);
    return Math.floor(baseCost * scaleFactor);
  };
  
  const getFactoryCost = () => {
    const baseCost = 1000000;
    const scaleFactor = Math.pow(1.05, factories);
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
          <span className="block mt-1 font-semibold text-cyan-300">Cost: 50,000 paperclips</span>
        </p>
        <button
          className={`w-full py-2 px-3 rounded ${
            paperclips >= 50000 
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
          onClick={() => makeProbe()}
          disabled={paperclips < 50000}
        >
          Launch Probe
        </button>
        {paperclips < 50000 && (
          <p className="text-xs text-red-400 mt-2 text-center">
            Not enough paperclips (have {formatNumber(paperclips)}/50,000)
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
            <span className="text-xs text-blue-300">Cost: {formatNumber(getWireHarvesterCost())} paperclips</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= getWireHarvesterCost() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => launchWireHarvester()}
              disabled={paperclips < getWireHarvesterCost()}
            >
              Launch 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(100000, wireHarvesters, 100)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchWireHarvesters(100)}
              disabled={paperclips < calculateBulkCost(100000, wireHarvesters, 100)}
            >
              Launch 100
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(100000, wireHarvesters, 1000)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchWireHarvesters(1000)}
              disabled={paperclips < calculateBulkCost(100000, wireHarvesters, 1000)}
            >
              Launch 1000
            </button>
          </div>
          {paperclips < getWireHarvesterCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getWireHarvesterCost() - paperclips)} more paperclips
            </p>
          )}
        </div>
        
        {/* Ore Harvester Button */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Ore Harvester Drone</span>
            <span className="text-xs text-amber-300">Cost: {formatNumber(getOreHarvesterCost())} paperclips</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= getOreHarvesterCost() 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => launchOreHarvester()}
              disabled={paperclips < getOreHarvesterCost()}
            >
              Launch 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(100000, oreHarvesters, 100)
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchOreHarvesters(100)}
              disabled={paperclips < calculateBulkCost(100000, oreHarvesters, 100)}
            >
              Launch 100
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(100000, oreHarvesters, 1000)
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkLaunchOreHarvesters(1000)}
              disabled={paperclips < calculateBulkCost(100000, oreHarvesters, 1000)}
            >
              Launch 1000
            </button>
          </div>
          {paperclips < getOreHarvesterCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getOreHarvesterCost() - paperclips)} more paperclips
            </p>
          )}
        </div>
        
        {/* Factory Button */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Space Factory</span>
            <span className="text-xs text-purple-300">Cost: {formatNumber(getFactoryCost())} paperclips</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= getFactoryCost() 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => buildFactory()}
              disabled={paperclips < getFactoryCost()}
            >
              Build 1
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(1000000, factories, 100)
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkBuildFactories(100)}
              disabled={paperclips < calculateBulkCost(1000000, factories, 100)}
            >
              Build 100
            </button>
            <button
              className={`py-2 px-3 rounded text-sm ${
                paperclips >= calculateBulkCost(1000000, factories, 1000)
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              onClick={() => bulkBuildFactories(1000)}
              disabled={paperclips < calculateBulkCost(1000000, factories, 1000)}
            >
              Build 1000
            </button>
          </div>
          {paperclips < getFactoryCost() && (
            <p className="text-xs text-red-400 mt-1 text-center">
              Need {formatNumber(getFactoryCost() - paperclips)} more paperclips
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
          </div>
        </div>
      </div>
    </div>
  );
}