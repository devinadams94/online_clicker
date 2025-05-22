"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

// Define the upgrade items
const opsUpgradeItems = [
  // Computational efficiency upgrades
  { id: 'parallelProcessing', name: 'Parallel Processing', cost: 45, description: 'Increase CPU level by 1 and OPs capacity by 50', category: 'Computation', repeatable: true },
  { id: 'quantumAlgorithms', name: 'Quantum Algorithms', cost: 90, description: 'Increase research generation by 50%', category: 'Computation', repeatable: true },
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
  const [upgradeCosts, setUpgradeCosts] = useState({});
  
  // Check localStorage for Distributed Storage purchase on component mount
  useEffect(() => {
    // Check if Distributed Storage has been purchased (from localStorage)
    if (localStorage.getItem('distributedStoragePurchased') === 'true') {
      console.log('Distributed Storage purchase detected in localStorage');
      
      // Verify if it's also marked as purchased in the game state
      if (Array.isArray(unlockedOpsUpgrades) && !unlockedOpsUpgrades.includes('distributedStorage')) {
        console.warn('Distributed Storage marked as purchased in localStorage but not in game state!');
        console.log('This could indicate a sync issue - checking if we need to force a save...');
        
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
    
    // For Distributed Storage specifically, check the game state to set localStorage
    if (Array.isArray(unlockedOpsUpgrades) && unlockedOpsUpgrades.includes('distributedStorage')) {
      localStorage.setItem('distributedStoragePurchased', 'true');
      console.log('Distributed Storage is purchased in game state, updated localStorage to match');
    }
  }, [unlockedOpsUpgrades]);

  useEffect(() => {
    console.log("Getting upgrade costs from store or calculating defaults");
    console.log("storedUpgradeCosts from game store:", storedUpgradeCosts);
    
    // Initialize with default costs
    const newCosts = {};
    
    // Set default values first
    opsUpgradeItems.forEach(upgrade => {
      newCosts[upgrade.id] = upgrade.cost;
    });
    
    // Log stored costs type for debugging
    console.log("storedUpgradeCosts type:", typeof storedUpgradeCosts);
    
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
            console.log(`Using stored cost for ${upgrade.id}: ${numCost}`);
          } else {
            console.warn(`Invalid stored cost for ${upgrade.id}: ${storedCost}, using default: ${upgrade.cost}`);
          }
        } else {
          console.log(`No stored cost for ${upgrade.id}, using default: ${upgrade.cost}`);
        }
      });
    } else {
      console.warn("Invalid or missing storedUpgradeCosts, using all default costs");
    }
    
    // Log all costs for debugging
    console.log("FINAL COSTS TO DISPLAY:");
    Object.entries(newCosts).forEach(([key, value]) => {
      console.log(`- ${key}: ${value}`);
    });
    
    setUpgradeCosts(newCosts);
    
    // Debug log for purchased upgrades and their costs
    if (unlockedOpsUpgrades && unlockedOpsUpgrades.length > 0) {
      console.log("Currently unlocked OPs upgrades:", unlockedOpsUpgrades);
      // Count how many times each upgrade has been purchased
      const upgradeCounts = {};
      unlockedOpsUpgrades.forEach(id => {
        upgradeCounts[id] = (upgradeCounts[id] || 0) + 1;
      });
      console.log("Upgrade purchase counts:", upgradeCounts);
    }
  }, [unlockedOpsUpgrades, storedUpgradeCosts]);
  
  // Group upgrades by category
  const categories = [...new Set(opsUpgradeItems.map(item => item.category))];
  
  return (
    <div className="card bg-cyan-50 dark:bg-gray-800 p-4 mb-6 h-[450px]">
      <h2 className="text-lg font-bold text-cyan-700 dark:text-cyan-300 mb-1">Computational Upgrades</h2>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-sm">Operations:</span>
          <span className="font-bold text-cyan-600 text-sm">{Math.floor(ops)}/{opsMax}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-cyan-500 h-2 rounded-full" 
            style={{ width: `${Math.min(100, (ops / opsMax) * 100)}%` }}
          ></div>
        </div>
        {opsMax >= 5000 ? (
          <div className="text-xs text-green-600 font-medium mb-2">
            ✨ Creativity unlocked! (OPs capacity ≥ 5,000)
          </div>
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            Need {5000 - opsMax} more OPs capacity to unlock Creativity
            <div className="mt-1 italic">
              <span className="font-medium">Tip:</span> Purchase "Memory Compression" multiple times to increase memory capacity
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-y-auto pr-1 h-[270px] text-xs">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-cyan-600 dark:text-cyan-400">{category} Upgrades</h3>
            <div className="space-y-2">
              {opsUpgradeItems
                .filter(item => item.category === category)
                .map(upgrade => {
                  // Check if upgrade is unlocked, with array validation
                  const isUnlocked = Array.isArray(unlockedOpsUpgrades) && unlockedOpsUpgrades.includes(upgrade.id);
                  const actualCost = upgradeCosts[upgrade.id];
                  const canAfford = ops >= actualCost;
                  
                  // Debug display info
                  console.log(`Upgrade ${upgrade.id}: cost=${actualCost}, ops=${ops}, canAfford=${canAfford}`);
                
                  return (
                    <div 
                      key={upgrade.id} 
                      className={`p-2 rounded-lg border text-sm ${
                        isUnlocked 
                          ? 'bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-900' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium text-cyan-700 dark:text-cyan-300 text-xs">{upgrade.name}</h3>
                        <span className={`text-xs ${ops >= upgradeCosts[upgrade.id] ? 'text-green-500 font-bold' : ''}`}>{upgradeCosts[upgrade.id]} OPs</span>
                      </div>
                      <p className="text-xs mb-1 text-gray-600 dark:text-gray-300">{upgrade.description}</p>
                      {isUnlocked && !upgrade.repeatable ? (
                        <span className="text-green-600 text-xs">Purchased</span>
                      ) : (
                        <button
                          className={`w-full py-1 px-2 rounded text-xs ${
                            ops >= upgradeCosts[upgrade.id]
                              ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (ops >= upgradeCosts[upgrade.id]) {
                              console.log(`Clicking buy button for ${upgrade.id} with cost ${upgradeCosts[upgrade.id]}`);
                              
                              // For Distributed Storage, add extra validation to ensure it can only be purchased once
                              if (upgrade.id === 'distributedStorage') {
                                // Double-check it's not already purchased
                                if (Array.isArray(unlockedOpsUpgrades) && unlockedOpsUpgrades.includes('distributedStorage')) {
                                  console.log('Distributed Storage already purchased! Preventing duplicate purchase.');
                                  alert('You have already purchased Distributed Storage!');
                                  return;
                                }
                                
                                // Set flag in localStorage to track the purchase
                                localStorage.setItem('distributedStoragePurchased', 'true');
                                
                                // Force immediate save after purchase
                                const purchaseAndSave = async () => {
                                  buyOpsUpgrade(upgrade.id, upgradeCosts[upgrade.id]);
                                  console.log('Distributed Storage purchased, forcing immediate save...');
                                  
                                  // Set a pending upgrade flag
                                  localStorage.setItem('pendingOpsUpgradeSave', 'true');
                                  localStorage.setItem('pendingOpsUpgradeId', 'distributedStorage');
                                  
                                  // Force immediate save if available
                                  if (typeof window !== 'undefined' && window.saveGameNow) {
                                    try {
                                      await window.saveGameNow();
                                      console.log('Distributed Storage purchase saved successfully!');
                                    } catch (err) {
                                      console.error('Error saving Distributed Storage purchase:', err);
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
      
      <p className="text-xs text-gray-500 mt-2">
        OPs unlock Creativity at max capacity
      </p>
    </div>
  );
}