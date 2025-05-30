"use client";

import { useState, useEffect } from "react";
import useGameStore from "@/lib/gameStore";
import { formatNumber, formatCurrency } from "@/utils/numberFormat";

export default function TrustUpgradesPanel() {
  const { 
    money,
    trust,
    ops,
    // opsMax,
    buyTrustUpgrade,
    buyTrustAbility,
    unlockedTrustAbilities,
    purchasedTrustLevels,
    spaceAgeUnlocked
  } = useGameStore();
  
  // Convert purchasedTrustLevels to an array of numbers
  const purchasedLevelsAsNumbers = purchasedTrustLevels.map(level => Number(level));
  
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
  
  // Validate purchased levels on component mount
  useEffect(() => {
    // Extra validation to force consistent type
    if (purchasedTrustLevels && purchasedTrustLevels.length > 0) {
      // Ensure all levels are stored as numbers
      const numericLevels = purchasedTrustLevels.map(level => Number(level));
      const hasNonNumeric = numericLevels.some(level => isNaN(level));
      
      // If we find any inconsistencies, force an update to normalize
      if (hasNonNumeric || numericLevels.some((num, i) => num !== purchasedTrustLevels[i])) {
        const validLevels = numericLevels.filter(level => !isNaN(level));
        useGameStore.setState({ purchasedTrustLevels: validLevels });
      }
    }
  }, [purchasedTrustLevels]);

  // Trust abilities that can be purchased with trust points
  const trustAbilities = [
    { id: 'trustBoost', name: 'Production Boost', cost: 10, description: 'Double your production multiplier' },
    { id: 'wireEfficiency', name: 'Wire Efficiency', cost: 15, description: 'Increase production by 500% through better wire usage' },
    { id: 'marketInfluence', name: 'Market Influence', cost: 30, description: 'Increase market demand and max demand by 5000%' },
    { id: 'researchInsight', name: 'Research Insight', cost: 10, description: 'Triple research point generation' }, // Cost reduced from 25 to 10
    { id: 'autoManagement', name: 'Auto Management', cost: 15, description: 'Increase production by 500% and quadruple memory regeneration' }, // Cost reduced from 30 to 15
    { id: 'quantumComputation', name: 'Quantum Computation', cost: 40, description: 'Double CPU level and memory capacity' } // Updated cost from 20 to 40
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

  // Using imported formatNumber utility instead of local implementation
  
  return (
    <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-4 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">Trust Upgrades</h2>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-green-300">Scroll for more</div>
          <button 
            className="text-green-400 hover:text-green-300 text-xs font-medium drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Info' : 'Info'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="backdrop-blur-sm bg-gray-800/50 p-2 rounded mb-3 text-sm border border-green-400/20">
          <p className="mb-1 text-green-300">Trust points allow you to unlock powerful abilities that permanently enhance your paperclip production.</p>
          <p className="text-green-300">Purchase trust with money, then spend trust on abilities.</p>
        </div>
      )}
      
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-green-300">Trust Points:</span>
          <span className="font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">{Math.floor(trust)}</span>
        </div>
      </div>
      
      <div className="h-[300px] overflow-y-auto pr-1 space-y-4">
        {/* Trust Purchases Section */}
        <div>
          <h3 className="text-sm font-semibold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] mb-2">Purchase Trust</h3>
          <div className="space-y-2">
            {trustUpgrades.map((upgrade) => {
              const canAfford = money >= upgrade.cost;
              // Enhanced check for purchased status using multiple comparison methods
              const levelAsNumber = Number(upgrade.level);
              const _levelAsString = String(upgrade.level);
              const isPurchased = purchasedLevelsAsNumbers.includes(levelAsNumber);
              
              return (
                <div 
                  key={`trust-level-${upgrade.level}`}
                  className={`p-2 rounded border backdrop-blur-sm ${
                    isPurchased 
                      ? 'bg-green-900/20 border-green-400/40 shadow-[0_0_10px_rgba(74,222,128,0.3)]' 
                      : 'bg-gray-800/50 border-green-400/20'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className={`font-medium text-sm ${isPurchased ? 'text-green-400' : 'text-green-300'}`}>Trust Level {upgrade.level}</span>
                    <span className={`text-sm ${canAfford && !isPurchased ? 'text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-gray-400'}`}>
                      {formatCurrency(upgrade.cost)}
                    </span>
                  </div>
                  <p className="text-xs mb-2 text-green-200">Gain {upgrade.trustGain} trust points</p>
                  
                  {isPurchased ? (
                    <span className="text-green-400 text-xs flex items-center drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Purchased
                    </span>
                  ) : (
                    <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                        canAfford && !isPurchased
                          ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        // Check if the level is already purchased using multiple methods
                        const levelAsNumber = Number(upgrade.level);
                        const _levelAsString = String(upgrade.level);
                        const isAlreadyPurchased = purchasedLevelsAsNumbers.includes(levelAsNumber);
                        
                        if (isAlreadyPurchased) {
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
                      Purchase ({formatCurrency(upgrade.cost)})
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Trust Abilities Section */}
        <div>
          <h3 className="text-sm font-semibold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] mb-2">Trust Abilities</h3>
          <p className="text-xs text-green-200 mb-2 italic">Trust is required but not consumed when unlocking abilities</p>
          <div className="space-y-2">
            {trustAbilities.map((ability) => {
              const isUnlocked = unlockedTrustAbilities.includes(ability.id);
              const canAfford = trust >= ability.cost;
              
              return (
                <div 
                  key={ability.id}
                  className={`p-2 rounded-lg border backdrop-blur-sm ${
                    isUnlocked 
                      ? 'bg-green-900/20 border-green-400/40 shadow-[0_0_10px_rgba(74,222,128,0.3)]' 
                      : 'bg-gray-800/50 border-green-400/20'
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className={`font-medium text-sm ${isUnlocked ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-green-300'}`}>
                      {ability.name}
                    </span>
                    <span className={`text-sm ${canAfford && !isUnlocked ? 'text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-green-200'}`}>
                      Requires {ability.cost} Trust
                    </span>
                  </div>
                  <p className="text-xs mb-2 text-green-200">{ability.description}</p>
                  {isUnlocked ? (
                    <span className="text-green-400 text-xs flex items-center drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlocked
                    </span>
                  ) : (
                    <button
                      className={`w-full py-1 px-2 rounded text-xs ${
                        canAfford 
                          ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => canAfford && buyTrustAbility(ability.id, ability.cost)}
                      disabled={!canAfford}
                    >
                      Unlock (Requires {ability.cost} Trust)
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
        <div className="mt-6 backdrop-blur-md bg-gray-900/60 p-4 rounded-xl border-2 border-green-400/40 shadow-[0_0_25px_rgba(74,222,128,0.4)]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] flex items-center">
              <span>Space Age</span>
              <span className="ml-2 text-xs bg-red-900/60 text-red-300 px-2 py-0.5 rounded-full border border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.6)]">Ultimate Upgrade</span>
            </h2>
          </div>
          
          <div className="p-3 rounded-lg backdrop-blur-sm bg-gray-800/50 border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.2)] mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-bold text-sm text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
                {spaceAgeUpgrade.name}
              </span>
              <span className={`text-sm ${trust >= spaceAgeUpgrade.cost ? 'text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-green-200'}`}>
                {spaceAgeUpgrade.cost} Trust
              </span>
            </div>
            <p className="text-sm mb-3 text-green-200">{spaceAgeUpgrade.description}</p>
            
            <div className="bg-gray-900/70 p-3 rounded-lg mb-3 text-xs border border-green-400/20">
              <h4 className="font-semibold mb-1 text-green-300">Requirements:</h4>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className={trust >= spaceAgeUpgrade.cost ? 'text-green-400' : 'text-red-400'}>
                    {trust >= spaceAgeUpgrade.cost ? '✓' : '✗'}
                  </span>
                  <span className="ml-2 text-green-200">
                    {trust >= spaceAgeUpgrade.cost 
                      ? <span>Trust: <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{Math.floor(trust)}/{spaceAgeUpgrade.cost}</span> (Met)</span>
                      : <span>Trust: {Math.floor(trust)}/{spaceAgeUpgrade.cost} (Need {spaceAgeUpgrade.cost - Math.floor(trust)} more)</span>
                    }
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={ops >= spaceAgeUpgrade.minOps ? 'text-green-400' : 'text-red-400'}>
                    {ops >= spaceAgeUpgrade.minOps ? '✓' : '✗'}
                  </span>
                  <span className="ml-2 text-green-200">
                    {ops >= spaceAgeUpgrade.minOps 
                      ? <span>Operations: <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{Math.floor(ops)}/{spaceAgeUpgrade.minOps}</span> (Met)</span>
                      : <span>Operations: {Math.floor(ops)}/{spaceAgeUpgrade.minOps} (Need {spaceAgeUpgrade.minOps - Math.floor(ops)} more)</span>
                    }
                  </span>
                </li>
              </ul>
            </div>
            
            <p className="text-xs bg-yellow-900/30 p-2 rounded-lg mb-3 text-yellow-300 border border-yellow-500/30">
              <span className="font-medium">Warning:</span> This will radically transform your game interface into an interplanetary paperclip empire
            </p>
            
            <button
              className={`w-full py-2 px-3 rounded text-sm font-medium ${
                trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps
                  ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps && 
                buyTrustAbility(spaceAgeUpgrade.id, spaceAgeUpgrade.cost)}
              disabled={!(trust >= spaceAgeUpgrade.cost && ops >= spaceAgeUpgrade.minOps)}
            >
              Enter Space Age (Requires {spaceAgeUpgrade.cost} Trust)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}