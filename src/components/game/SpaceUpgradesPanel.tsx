"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceUpgradesPanel() {
  const {
    spaceAgeUnlocked,
    spacePaperclipsPerSecond,
    aerogradePaperclips,
    buySpaceUpgrade,
    unlockedSpaceUpgrades
  } = useGameStore();
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Space upgrade definitions
  const upgradeDefinitions = [
    {
      id: 'autoBattle',
      name: 'Automated Combat System',
      description: 'Enables auto-battle functionality to automatically engage enemy ships every 10 seconds',
      cost: 10000,
      effect: 'autoBattle',
      effectValue: true,
      icon: '⚔️',
      repeatable: false
    },
    {
      id: 'improvedFactories',
      name: 'Improved Factories',
      description: 'Increases Aerograde Paperclip production by 50%',
      cost: 100000,
      effect: 'factoryEfficiency',
      effectValue: 1.5,
      icon: '🏭',
      repeatable: true, // Made repeatable
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5 // Cost increases by 2.5x each purchase
    },
    {
      id: 'advancedDrones',
      name: 'Advanced Drones',
      description: 'Increases mining and wire production by 25%',
      cost: 250000,
      effect: 'droneEfficiency',
      effectValue: 1.25,
      icon: '🤖',
      repeatable: true, // Made repeatable
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0 // Cost increases by 2x each purchase
    },
    {
      id: 'quantumMining',
      name: 'Quantum Mining',
      description: 'Allows ore harvesters to extract 2x matter from planets',
      cost: 500000,
      effect: 'miningEfficiency',
      effectValue: 2.0,
      icon: '⚛️',
      repeatable: false
    },
    {
      id: 'hyperspaceEngines',
      name: 'Hyperspace Engines',
      description: 'Increases probe exploration speed by 300%',
      cost: 1000000,
      effect: 'explorationSpeed',
      effectValue: 3.0,
      icon: '🌠',
      repeatable: false
    },
    {
      id: 'droneReplication',
      name: 'Drone Self-Replication',
      description: 'Harvester drones can self-replicate using Aerograde Paperclips when resources are found on celestial bodies',
      cost: 5000000,
      effect: 'droneReplication',
      effectValue: true,
      icon: '🧬',
      repeatable: false
    },
    {
      id: 'celestialScanner',
      name: 'Celestial Body Scanner',
      description: 'Improves probe ability to detect asteroids and minor celestial bodies while exploring',
      cost: 3000000,
      effect: 'celestialScanner',
      effectValue: true,
      icon: '🔭',
      repeatable: false
    },
    {
      id: 'resourceExtractor',
      name: 'Advanced Resource Extractor',
      description: 'Improves resource extraction from asteroids by 200%',
      cost: 7500000,
      effect: 'resourceExtraction',
      effectValue: 3.0,
      icon: '⛏️',
      repeatable: false
    },
    {
      id: 'hazardShielding',
      name: 'Hazard Shielding',
      description: 'Reduces probe crash rate and improves survivability in space combat',
      cost: 2000000,
      effect: 'hazardShielding',
      effectValue: 1.5,
      icon: '🛡️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0 // Cost increases by 2x each purchase
    },
    {
      id: 'nanobotRepair',
      name: 'Nanobot Repair Systems',
      description: 'Self-repairing probes have a chance to avoid destruction in combat',
      cost: 4000000,
      effect: 'nanobotRepair',
      effectValue: true,
      icon: '🔧',
      repeatable: false
    },
    {
      id: 'swarmIntelligence',
      name: 'Swarm Intelligence',
      description: 'Improves probe coordination in combat, increasing effectiveness',
      cost: 6000000,
      effect: 'swarmIntelligence',
      effectValue: 2.0,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2 // Cost increases by 2.2x each purchase
    }
  ];
  
  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };
  
  // Format numbers with appropriate scientific notation for very large numbers
  const formatLargeNumber = (num: number = 0) => {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return null;
  }
  
  return (
    <div className="card bg-gray-800 text-white p-4 mb-4">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">🚀</span> Space Upgrades
      </h2>
      
      <div className="space-y-2">
        {upgradeDefinitions.map(upgrade => {
          // Count how many times this upgrade has been purchased (for repeatable upgrades)
          const purchaseCount = unlockedSpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
          const isUnlocked = purchaseCount > 0;
          const isRepeatable = upgrade.repeatable === true;
          
          // Calculate current cost with multiplier for repeatable upgrades
          let currentCost = upgrade.cost;
          if (isRepeatable && purchaseCount > 0) {
            currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
          }
          
          const canAfford = (aerogradePaperclips || 0) >= currentCost;
          const isExpanded = expandedSection === upgrade.id;
          
          return (
            <div 
              key={upgrade.id} 
              className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleSection(upgrade.id)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{upgrade.icon}</span>
                  <span className="font-medium">{upgrade.name}</span>
                  {isUnlocked && (
                    <span className={`ml-2 text-xs px-2 py-0.5 ${
                      isRepeatable 
                        ? 'bg-blue-900 text-blue-100' 
                        : 'bg-green-900 text-green-100'
                    } rounded-full`}>
                      {isRepeatable 
                        ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                        : 'Purchased'}
                    </span>
                  )}
                </div>
                <button
                  className={`py-1 px-2 rounded text-xs ${
                    ((!isUnlocked || isRepeatable) && canAfford)
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if ((!isUnlocked || isRepeatable) && canAfford) {
                      buySpaceUpgrade(upgrade.id, currentCost);
                    }
                  }}
                  disabled={(isUnlocked && !isRepeatable) || !canAfford}
                >
                  {isUnlocked && !isRepeatable 
                    ? 'Purchased' 
                    : `${formatLargeNumber(currentCost)} Aerograde`}
                </button>
              </div>
              
              {isExpanded && (
                <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  <p>{upgrade.description}</p>
                  {isRepeatable && isUnlocked && (
                    <p className="text-blue-300 mt-1">
                      Level {purchaseCount}{purchaseCount > 1 ? ` (${(Number(upgrade.effectValue) - 1) * 100 * purchaseCount}% total bonus)` : ''}
                    </p>
                  )}
                  {(!isUnlocked || isRepeatable) && !canAfford && (
                    <p className="text-red-400 mt-1">
                      Need {formatLargeNumber(currentCost - (aerogradePaperclips || 0))} more Aerograde paperclips
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Aerograde Paperclips: {formatLargeNumber(aerogradePaperclips || 0)} (Production: {formatLargeNumber(spacePaperclipsPerSecond)}/sec)
      </div>
    </div>
  );
}