"use client";

import { useState, useCallback, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceStatsPanel() {
  const {
    yomi,
    ops,
    spaceStats,
    upgradeStat: originalUpgradeStat,
    unlockCombat: originalUnlockCombat,
    spaceAgeUnlocked
  } = useGameStore();
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Alternative implementation that directly modifies the store state
  const manualUpgradeStat = useCallback((statId: string, cost: number) => {
    // Get current state
    const state = useGameStore.getState();
    
    // Check if we can afford it
    if (state.yomi < cost) {
      return;
    }
    
    // Check if stat exists
    if (state.spaceStats[statId] === undefined) {
      return;
    }
    
    try {
      // Create updated space stats object
      const updatedSpaceStats = {...state.spaceStats};
      updatedSpaceStats[statId] = (updatedSpaceStats[statId] || 0) + 1;
      
      // Update the store directly
      useGameStore.setState({
        spaceStats: updatedSpaceStats,
        yomi: state.yomi - cost
      });
      
      // Force component to re-render
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      // Silently fail
    }
  }, []);
  
  // Alternative implementation for unlocking combat
  const manualUnlockCombat = useCallback(() => {
    // Get current state
    const state = useGameStore.getState();
    
    // Check if combat is already unlocked
    if (state.spaceStats.combat !== undefined) {
      return;
    }
    
    // Check if we can afford it (50,000 OPs)
    const unlockCost = 50000;
    if (state.ops < unlockCost) {
      return;
    }
    
    try {
      // Update the store directly
      useGameStore.setState({
        ops: state.ops - unlockCost,
        spaceStats: {
          ...state.spaceStats,
          combat: 1
        },
        honor: 0 // Initialize honor resource
      });
      
      // Force component to re-render
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      // Silently fail
    }
  }, []);
  
  // Monitor space stats changes
  useEffect(() => {
    // No logging, just track changes
  }, [spaceStats, forceUpdate]);
  
  // Try to trigger a game save after state changes
  useEffect(() => {
    if (forceUpdate > 0) {
      // Wait a moment for state to settle
      const saveTimer = setTimeout(() => {
        try {
          // Attempt to save the game state if the save function is available
          if (typeof window !== 'undefined' && window.saveGameNow) {
            window.saveGameNow().catch(() => {});
          }
        } catch (error) {
          // Silently fail
        }
      }, 500);
      
      return () => clearTimeout(saveTimer);
    }
  }, [forceUpdate]);
  
  // Space stats definitions
  const statDefinitions = [
    {
      id: 'speed',
      name: 'Speed',
      description: 'Determines how quickly your ships travel between star systems',
      costMultiplier: 2.0,
      icon: '🚀'
    },
    {
      id: 'exploration',
      name: 'Exploration',
      description: 'Increases chance of finding rare resources and new star systems',
      costMultiplier: 1.8,
      icon: '🔭'
    },
    {
      id: 'selfReplication',
      name: 'Self-Replication',
      description: 'Improves speed at which your probes replicate themselves',
      costMultiplier: 2.5,
      icon: '🧬'
    },
    {
      id: 'wireProduction',
      name: 'Space Wire Production',
      description: 'Increases space wire production efficiency by processing mined ore',
      costMultiplier: 1.5,
      icon: '🔌'
    },
    {
      id: 'miningProduction',
      name: 'Mining Production',
      description: 'Improves resource extraction from planetary bodies',
      costMultiplier: 1.7,
      icon: '⛏️'
    },
    {
      id: 'factoryProduction',
      name: 'Factory Production',
      description: 'Enhances manufacturing capability on colonized planets',
      costMultiplier: 2.0,
      icon: '🏭'
    },
    {
      id: 'hazardEvasion',
      name: 'Hazard Evasion',
      description: 'Reduces probe crash rate and improves evasion in combat',
      costMultiplier: 2.2,
      icon: '🛡️'
    },
    {
      id: 'combat',
      name: 'Combat',
      description: 'Combat capabilities for defending against or eliminating threats',
      costMultiplier: 3.0,
      icon: '⚔️',
      locked: true,
      unlockCost: 50000,
      unlockCurrency: 'OPs'
    }
  ];
  
  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return (
      <div className="card bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <span className="text-xl mr-2">🌌</span> Space Age Stats
        </h2>
        <div className="p-4 text-center">
          <p className="text-gray-400">Space Age not yet unlocked.</p>
          <p className="text-sm text-gray-500 mt-2">
            Purchase the Space Age upgrade to access interstellar capabilities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="text-xl mr-2">🌌</span> Space Age Stats
      </h2>
      
      <div className="space-y-3">
        {statDefinitions.map(stat => {
          const statValue = spaceStats?.[stat.id] || 0;
          const isLocked = stat.locked && !spaceStats?.[stat.id];
          const baseCost = 10 * Math.pow(stat.costMultiplier, statValue);
          const upgradeCost = Math.floor(baseCost);
          const canAfford = yomi >= upgradeCost;
          const isExpanded = expandedSection === stat.id;
          
          if (stat.id === 'combat' && isLocked) {
            // Special handling for combat which needs to be unlocked with OPs
            return (
              <div key={stat.id} className="bg-gray-700 p-3 rounded relative">
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(stat.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2 opacity-50">{stat.icon}</span>
                    <span className="font-medium text-gray-300">{stat.name}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-red-900 text-red-100 rounded-full">Locked</span>
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ops >= 50000 
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ops >= 50000) {
                        manualUnlockCombat();
                      }
                    }}
                    disabled={ops < 50000}
                  >
                    Unlock (50,000 OPs)
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    {stat.description}
                  </div>
                )}
              </div>
            );
          }
          
          if (isLocked) return null;
          
          return (
            <div key={stat.id} className="bg-gray-700 p-3 rounded relative">
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleSection(stat.id)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{stat.icon}</span>
                  <span className="font-medium">{stat.name}</span>
                  <span className="ml-2 text-sm text-gray-300">Level {statValue}</span>
                </div>
                <button
                  className={`py-1 px-2 rounded text-xs ${
                    canAfford 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canAfford) {
                      manualUpgradeStat(stat.id, upgradeCost);
                    }
                  }}
                  disabled={!canAfford}
                >
                  Upgrade ({upgradeCost} Yomi)
                </button>
              </div>
              
              {isExpanded && (
                <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  {stat.description}
                </div>
              )}
              
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (statValue / 25) * 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}