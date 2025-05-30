"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";
import { formatNumber, formatCurrency } from "@/utils/numberFormat";

// Define the upgrade items
const opsUpgradeItems = [
  // Computational efficiency upgrades
  { id: 'parallelProcessing', name: 'Parallel Processing', cost: 45, description: 'Increase CPU level by 1 and OPs capacity by 50', category: 'Computation', repeatable: true },
  { id: 'quantumAlgorithms', name: 'Quantum Algorithms', cost: 90, description: 'Increase research generation by 50%', category: 'Computation', repeatable: false },
  { id: 'neuralOptimization', name: 'Neural Optimization', cost: 150, description: 'Increase production multiplier by 25%', category: 'Computation', repeatable: true },
  
  // Memory management upgrades
  { id: 'memoryCompression', name: 'Memory Compression', cost: 15000, description: 'Increase memory capacity by 2 (adds 100 OPs capacity)', category: 'Memory', repeatable: true },
  { id: 'cacheOptimization', name: 'Cache Optimization', cost: 105, description: 'Increase memory regeneration rate by 50%', category: 'Memory', repeatable: true },
  { id: 'distributedStorage', name: 'Distributed Storage', cost: 5000, description: 'Double memory capacity (doubles OPs capacity)', category: 'Memory', repeatable: false },
  
  // Market analysis upgrades
  { id: 'marketPrediction', name: 'Market Prediction', cost: 75, description: 'Reduce stock market volatility by 20%', category: 'Market', repeatable: true },
  { id: 'trendAnalysis', name: 'Trend Analysis', cost: 120, description: 'Increase bot intelligence by 1', category: 'Market', repeatable: true },
  { id: 'highFrequencyTrading', name: 'High Frequency Trading', cost: 225, description: 'Make trading bots work faster', category: 'Market', repeatable: true }
];

export default function OpsUpgradesPanel() {
  const { 
    ops, 
    opsMax, 
    unlockedOpsUpgrades, 
    buyOpsUpgrade,
    upgradeCosts: storedUpgradeCosts 
  } = useGameStore();
  
  // Pre-calculate costs for all upgrades to ensure consistency
  // Use useEffect to get costs from game state or calculate them if not available
  const [upgradeCosts, setUpgradeCosts] = useState<{ [key: string]: number }>({}); 
  
  // Check localStorage for non-repeatable upgrades purchase on component mount
  useEffect(() => {
    // Check for Distributed Storage
    if (localStorage.getItem('distributedStoragePurchased') === 'true') {
      // Verify if it's also marked as purchased in the game state
      if (Array.isArray(unlockedOpsUpgrades) && !unlockedOpsUpgrades.includes('distributedStorage')) {
        // Set pending save flag to ensure it gets saved properly
        localStorage.setItem('pendingOpsUpgradeSave', 'true');
        localStorage.setItem('pendingOpsUpgradeId', 'distributedStorage');
        
        // Trigger manual save event
        if (typeof window !== 'undefined') {
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
        }
      }
    }
    
    // Check for Quantum Algorithms
    if (localStorage.getItem('quantumAlgorithmsPurchased') === 'true') {
      // Verify if it's also marked as purchased in the game state
      if (Array.isArray(unlockedOpsUpgrades) && !unlockedOpsUpgrades.includes('quantumAlgorithms')) {
        // Set pending save flag to ensure it gets saved properly
        localStorage.setItem('pendingOpsUpgradeSave', 'true');
        localStorage.setItem('pendingOpsUpgradeId', 'quantumAlgorithms');
        
        // Trigger manual save event
        if (typeof window !== 'undefined') {
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
        }
      }
    }
    
    // Update localStorage based on game state
    if (Array.isArray(unlockedOpsUpgrades)) {
      // For Distributed Storage
      if (unlockedOpsUpgrades.includes('distributedStorage')) {
        localStorage.setItem('distributedStoragePurchased', 'true');
      }
      
      // For Quantum Algorithms
      if (unlockedOpsUpgrades.includes('quantumAlgorithms')) {
        localStorage.setItem('quantumAlgorithmsPurchased', 'true');
      }
    }
  }, [unlockedOpsUpgrades]);

  useEffect(() => {
    // Initialize with default costs
    const newCosts: { [key: string]: number } = {};
    
    // Set default values first
    opsUpgradeItems.forEach(upgrade => {
      newCosts[upgrade.id] = upgrade.cost;
    });
    
    // For each upgrade item, check if we have a stored cost in the game state
    if (storedUpgradeCosts && typeof storedUpgradeCosts === 'object' && !Array.isArray(storedUpgradeCosts)) {
      // For each upgrade item, check if we have a stored cost in the game state
      opsUpgradeItems.forEach(upgrade => {
        // Use the cost from the store if available and valid
        const storedCost = storedUpgradeCosts[upgrade.id];
        if (storedCost !== undefined && storedCost !== null) {
          const numCost = Number(storedCost);
          if (!isNaN(numCost) && numCost > 0) {
            newCosts[upgrade.id] = numCost;
          }
        }
      });
    }
    
    setUpgradeCosts(newCosts);
  }, [unlockedOpsUpgrades, storedUpgradeCosts]);
  
  // Group upgrades by category
  const categories = [...new Set(opsUpgradeItems.map(item => item.category))];
  
  return (
    <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-4 mb-6 h-[450px] border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
      <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] mb-1">Computational Upgrades</h2>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-sm text-green-300">Operations:</span>
          <span className="font-bold text-green-400 text-sm drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">{formatNumber(Math.floor(ops), 0)}/{formatNumber(opsMax, 0)}</span>
        </div>
        <div className="w-full bg-gray-700/70 rounded-full h-2 mb-2">
          <div 
            className="bg-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" 
            style={{ width: `${Math.min(100, (ops / opsMax) * 100)}%` }}
          ></div>
        </div>
        {opsMax >= 5000 ? (
          <div className="text-xs text-green-400 font-medium mb-2 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
            ✨ Creativity unlocked! (OPs capacity ≥ 5,000)
          </div>
        ) : (
          <div className="text-xs text-green-200 mb-2">
            Need {formatNumber(5000 - opsMax, 0)} more OPs capacity to unlock Creativity
            <div className="mt-1 italic">
              <span className="font-medium text-green-300">Tip:</span> Purchase "Memory Compression" multiple times to increase memory capacity
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto pr-1 h-[270px] text-xs">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{category} Upgrades</h3>
            <div className="space-y-2">
              {opsUpgradeItems
                .filter(item => item.category === category)
                .map(upgrade => {
                  // Check if upgrade is unlocked, with array validation
                  const isUnlocked = Array.isArray(unlockedOpsUpgrades) && unlockedOpsUpgrades.includes(upgrade.id);
                  const actualCost = upgradeCosts[upgrade.id];
                  const canAfford = ops >= actualCost;
                  
                  return (
                    <div 
                      key={upgrade.id} 
                      className={`p-2 rounded-lg border backdrop-blur-sm ${
                        isUnlocked 
                          ? 'bg-green-900/20 border-green-400/40 shadow-[0_0_10px_rgba(74,222,128,0.3)]' 
                          : 'bg-gray-800/50 border-green-400/20'
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium text-green-400 text-xs drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{upgrade.name}</h3>
                        <span className={`text-xs ${canAfford ? 'text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-green-200'}`}>{upgradeCosts[upgrade.id]} OPs</span>
                      </div>
                      <p className="text-xs mb-1 text-green-200">{upgrade.description}</p>
                      {isUnlocked && !upgrade.repeatable ? (
                        <span className="text-green-400 text-xs flex items-center drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Purchased
                        </span>
                      ) : (
                        <button
                          className={`w-full py-1 px-2 rounded text-xs ${
                            canAfford
                              ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]' 
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (ops >= upgradeCosts[upgrade.id]) {
                              // For non-repeatable upgrades, add extra validation to ensure they can only be purchased once
                              if (upgrade.id === 'distributedStorage' || upgrade.id === 'quantumAlgorithms') {
                                // Double-check it's not already purchased
                                if (Array.isArray(unlockedOpsUpgrades) && unlockedOpsUpgrades.includes(upgrade.id)) {
                                  alert(`You have already purchased ${upgrade.name}!`);
                                  return;
                                }
                                
                                // Set flag in localStorage to track the purchase
                                localStorage.setItem(`${upgrade.id}Purchased`, 'true');
                                
                                // Force immediate save after purchase
                                const purchaseAndSave = async () => {
                                  buyOpsUpgrade(upgrade.id, upgradeCosts[upgrade.id]);
                                  
                                  // Set a pending upgrade flag
                                  localStorage.setItem('pendingOpsUpgradeSave', 'true');
                                  localStorage.setItem('pendingOpsUpgradeId', upgrade.id);
                                  
                                  // Force immediate save if available
                                  if (typeof window !== 'undefined' && window.saveGameNow) {
                                    try {
                                      await window.saveGameNow();
                                    } catch (err) {
                                      // Silently fail
                                    }
                                  }
                                };
                                
                                purchaseAndSave();
                              } else {
                                // Normal purchase for other upgrades
                                buyOpsUpgrade(upgrade.id, upgradeCosts[upgrade.id]);
                              }
                            }
                          }}
                          disabled={ops < upgradeCosts[upgrade.id]}
                        >
                          {ops >= upgradeCosts[upgrade.id] ? 
                            (isUnlocked && upgrade.repeatable ? 'Upgrade Again' : 'Purchase') : 
                            'Not enough OPs'}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-green-200 mt-2">
        OPs unlock Creativity at max capacity
      </p>
    </div>
  );
}