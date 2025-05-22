"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";

export default function TrustUpgradesPanel() {
  const { 
    money,
    trust,
    ops,
    opsMax,
    buyTrustUpgrade,
    buyTrustAbility,
    unlockedTrustAbilities,
    purchasedTrustLevels,
    spaceAgeUnlocked
  } = useGameStore();
  
  const [expanded, setExpanded] = useState(false);

  // Trust upgrade levels with costs that scale by 5x each level
  // Ensure level is always a number type for consistency
  const trustUpgrades = [
    { level: 1, cost: 1000000, trustGain: 5 },
    { level: 2, cost: 5000000, trustGain: 10 },
    { level: 3, cost: 25000000, trustGain: 15 },
    { level: 4, cost: 125000000, trustGain: 20 },
    { level: 5, cost: 625000000, trustGain: 25 }
  ];
  
  // Log current purchased levels on component mount for debugging
  useEffect(() => {
    console.log("TrustUpgradesPanel loaded, current purchasedTrustLevels:", purchasedTrustLevels);
    
    // Extra validation to force consistent type
    if (purchasedTrustLevels && purchasedTrustLevels.length > 0) {
      // Ensure all levels are stored as numbers
      const numericLevels = purchasedTrustLevels.map(level => Number(level));
      const hasNonNumeric = numericLevels.some(level => isNaN(level));
      
      console.log("purchasedTrustLevels as numbers:", numericLevels);
      console.log("Has non-numeric values:", hasNonNumeric);
      
      // If we find any inconsistencies, force an update to normalize
      if (hasNonNumeric || numericLevels.some((num, i) => num !== purchasedTrustLevels[i])) {
        console.log("Found inconsistent types in purchasedTrustLevels, normalizing...");
        const validLevels = numericLevels.filter(level => !isNaN(level));
        useGameStore.setState({ purchasedTrustLevels: validLevels });
      }
    }
  }, [purchasedTrustLevels]);

  // Trust abilities that can be purchased with trust points
  const trustAbilities = [
    { id: 'trustBoost', name: 'Production Boost', cost: 10, description: 'Double your production multiplier' },
    { id: 'wireEfficiency', name: 'Wire Efficiency', cost: 15, description: 'Increase production by 500% through better wire usage' },
    { id: 'marketInfluence', name: 'Market Influence', cost: 20, description: 'Increase market demand and max demand by 5000%' },
    { id: 'researchInsight', name: 'Research Insight', cost: 10, description: 'Triple research point generation' }, // Cost reduced from 25 to 10
    { id: 'autoManagement', name: 'Auto Management', cost: 15, description: 'Increase production by 500% and quadruple memory regeneration' }, // Cost reduced from 30 to 15
    { id: 'quantumComputation', name: 'Quantum Computation', cost: 20, description: 'Double CPU level and memory capacity' } // Cost reduced from 50 to 20
  ];
  
  // Special space age upgrade - only visible at high trust and OPs levels
  const spaceAgeUpgrade = { 
    id: 'spaceAge', 
    name: 'Enter the Space Age', 
    cost: 100, 
    description: 'Radically transform your operation into an interplanetary paperclip empire', 
    requiresHighTrust: true,
    minTrust: 50,
    minOps: 10000 // Reduced from 50,000 to 10,000
  };

  // Format large numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  return (
    <div className="card bg-indigo-50 dark:bg-gray-800 p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Trust Upgrades</h2>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">Scroll for more</div>
          <button 
            className="text-indigo-500 hover:text-indigo-700 text-xs font-medium"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Info' : 'Info'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded mb-3 text-sm">
          <p className="mb-1">Trust points allow you to unlock powerful abilities that permanently enhance your paperclip production.</p>
          <p>Purchase trust with money, then spend trust on abilities.</p>
        </div>
      )}
      
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-indigo-700 dark:text-indigo-300">Trust Points:</span>
          <span className="font-bold text-indigo-600">{Math.floor(trust)}</span>
        </div>
      </div>
      
      <div className="h-[300px] overflow-y-auto pr-1 space-y-4">
        {/* Trust Purchases Section */}
        <div>
          <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Purchase Trust</h3>
          <div className="space-y-2">
            {trustUpgrades.map((upgrade) => {
              const canAfford = money >= upgrade.cost;
              // Enhanced check for purchased status using multiple comparison methods
              const levelAsNumber = Number(upgrade.level);
              const levelAsString = String(upgrade.level);
              const isPurchased = 
                purchasedTrustLevels.includes(levelAsNumber) || 
                purchasedTrustLevels.includes(levelAsString) ||
                purchasedTrustLevels.some(l => Number(l) === levelAsNumber) ||
                purchasedTrustLevels.some(l => String(l) === levelAsString);
              
              return (
                <div 
                  key={`trust-level-${upgrade.level}`}
                  className={`p-2 rounded border ${
                    isPurchased 
                      ? 'bg-indigo-100 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-800' 
                      : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-900'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className={`font-medium text-sm ${isPurchased ? 'text-indigo-700' : ''}`}>Trust Level {upgrade.level}</span>
                    <span className={`text-sm ${canAfford && !isPurchased ? 'text-green-500 font-bold' : ''}`}>
                      ${formatNumber(upgrade.cost)}
                    </span>
                  </div>
                  <p className="text-xs mb-2">Gain {upgrade.trustGain} trust points</p>
                  
                  {isPurchased ? (
                    <span className="text-green-600 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Purchased
                    </span>
                  ) : (
                    <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                        canAfford && !isPurchased
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        // Enhanced check for level already purchased
                        console.log(`Attempting to buy trust level ${upgrade.level} for ${upgrade.cost}`);
                        console.log(`Current purchasedTrustLevels:`, purchasedTrustLevels);
                        
                        // Check if the level is already purchased using multiple methods
                        const levelAsNumber = Number(upgrade.level);
                        const levelAsString = String(upgrade.level);
                        const isAlreadyPurchased = 
                          purchasedTrustLevels.includes(levelAsNumber) || 
                          purchasedTrustLevels.includes(levelAsString) ||
                          purchasedTrustLevels.some(l => Number(l) === levelAsNumber) ||
                          purchasedTrustLevels.some(l => String(l) === levelAsString);
                        
                        if (isAlreadyPurchased) {
                          console.log(`Trust level ${upgrade.level} already purchased, skipping purchase`);
                          // Force refresh the UI to show the purchase status
                          useGameStore.setState({
                            purchasedTrustLevels: [...purchasedTrustLevels]
                          });
                          return;
                        }
                        
                        if (canAfford) {
                          buyTrustUpgrade(upgrade.level, upgrade.cost);
                        }
                      }}
                      disabled={!canAfford || isPurchased}
                    >
                      Purchase (${formatNumber(upgrade.cost)})
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Trust Abilities Section */}
        <div>
          <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Trust Abilities</h3>
          <div className="space-y-2">
            {trustAbilities.map((ability) => {
              const isUnlocked = unlockedTrustAbilities.includes(ability.id);
              const canAfford = trust >= ability.cost;
              
              return (
                <div 
                  key={ability.id}
                  className={`p-2 rounded border ${
                    isUnlocked 
                      ? 'bg-indigo-100 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-800' 
                      : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-900'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className={`font-medium text-sm ${isUnlocked ? 'text-indigo-700' : ''}`}>
                      {ability.name}
                    </span>
                    <span className={`text-sm ${canAfford && !isUnlocked ? 'text-green-500 font-bold' : ''}`}>
                      {ability.cost} Trust
                    </span>
                  </div>
                  <p className="text-xs mb-2">{ability.description}</p>
                  {isUnlocked ? (
                    <span className="text-green-600 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlocked
                    </span>
                  ) : (
                    <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                        canAfford 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => canAfford && buyTrustAbility(ability.id, ability.cost)}
                      disabled={!canAfford}
                    >
                      Unlock ({ability.cost} Trust)
                    </button>
                  )}
                </div>
              );
            })}
            
          </div>
        </div>
      </div>

      {/* Space Age Upgrade Panel - Always visible */}
      {!spaceAgeUnlocked && (
        <div className="mt-6 card bg-purple-50 dark:bg-gray-800 p-4 border-2 border-purple-300 dark:border-purple-600">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center">
              <span>Space Age</span>
              <span className="ml-2 text-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">Ultimate Upgrade</span>
            </h2>
          </div>
          
          <div className="p-3 rounded bg-white dark:bg-gray-700 shadow-sm mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-sm text-purple-700 dark:text-purple-300">
                {spaceAgeUpgrade.name}
              </span>
              <span className={`text-sm ${trust >= spaceAgeUpgrade.cost ? 'text-green-500 font-bold' : ''}`}>
                {spaceAgeUpgrade.cost} Trust
              </span>
            </div>
            <p className="text-sm mb-3">{spaceAgeUpgrade.description}</p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3 text-xs">
              <h4 className="font-semibold mb-1">Requirements:</h4>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className={trust >= spaceAgeUpgrade.minTrust ? 'text-green-600' : 'text-red-600'}>
                    {trust >= spaceAgeUpgrade.minTrust ? '✓' : '✗'}
                  </span>
                  <span className="ml-2">
                    {trust >= spaceAgeUpgrade.minTrust 
                      ? `Trust: ${Math.floor(trust)}/${spaceAgeUpgrade.minTrust} (Met)`
                      : `Trust: ${Math.floor(trust)}/${spaceAgeUpgrade.minTrust} (Need ${spaceAgeUpgrade.minTrust - Math.floor(trust)} more)`
                    }
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={ops >= spaceAgeUpgrade.minOps ? 'text-green-600' : 'text-red-600'}>
                    {ops >= spaceAgeUpgrade.minOps ? '✓' : '✗'}
                  </span>
                  <span className="ml-2">
                    {ops >= spaceAgeUpgrade.minOps 
                      ? `Operations: ${Math.floor(ops)}/${spaceAgeUpgrade.minOps} (Met)`
                      : `Operations: ${Math.floor(ops)}/${spaceAgeUpgrade.minOps} (Need ${spaceAgeUpgrade.minOps - Math.floor(ops)} more)`
                    }
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={trust >= spaceAgeUpgrade.cost ? 'text-green-600' : 'text-red-600'}>
                    {trust >= spaceAgeUpgrade.cost ? '✓' : '✗'}
                  </span>
                  <span className="ml-2">
                    {trust >= spaceAgeUpgrade.cost 
                      ? `Available Trust: ${Math.floor(trust)}/${spaceAgeUpgrade.cost} (Met)`
                      : `Available Trust: ${Math.floor(trust)}/${spaceAgeUpgrade.cost} (Need ${spaceAgeUpgrade.cost - Math.floor(trust)} more)`
                    }
                  </span>
                </li>
              </ul>
            </div>
            
            <p className="text-xs bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded mb-3 text-yellow-800 dark:text-yellow-300">
              <span className="font-medium">Warning:</span> This will radically transform your game interface into an interplanetary paperclip empire
            </p>
            
            <button
              className={`w-full py-2 px-3 rounded text-sm font-medium ${
                trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps && trust >= spaceAgeUpgrade.minTrust
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps && trust >= spaceAgeUpgrade.minTrust && 
                buyTrustAbility(spaceAgeUpgrade.id, spaceAgeUpgrade.cost)}
              disabled={!(trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps && trust >= spaceAgeUpgrade.minTrust)}
            >
              Enter Space Age ({spaceAgeUpgrade.cost} Trust)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}