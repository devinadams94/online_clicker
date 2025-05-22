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
      icon: '⚔️'
    },
    {
      id: 'improvedFactories',
      name: 'Improved Factories',
      description: 'Increases Aerograde Paperclip production by 50%',
      cost: 100000,
      effect: 'factoryEfficiency',
      effectValue: 1.5,
      icon: '🏭'
    },
    {
      id: 'advancedDrones',
      name: 'Advanced Drones',
      description: 'Increases mining and wire production by 25%',
      cost: 250000,
      effect: 'droneEfficiency',
      effectValue: 1.25,
      icon: '🤖'
    },
    {
      id: 'quantumMining',
      name: 'Quantum Mining',
      description: 'Allows ore harvesters to extract 2x matter from planets',
      cost: 500000,
      effect: 'miningEfficiency',
      effectValue: 2.0,
      icon: '⚛️'
    },
    {
      id: 'hyperspaceEngines',
      name: 'Hyperspace Engines',
      description: 'Increases probe exploration speed by 300%',
      cost: 1000000,
      effect: 'explorationSpeed',
      effectValue: 3.0,
      icon: '🌠'
    },
    {
      id: 'droneReplication',
      name: 'Drone Self-Replication',
      description: 'Harvester drones can self-replicate using Aerograde Paperclips when resources are found on celestial bodies',
      cost: 5000000,
      effect: 'droneReplication',
      effectValue: true,
      icon: '🧬'
    },
    {
      id: 'celestialScanner',
      name: 'Celestial Body Scanner',
      description: 'Improves probe ability to detect asteroids and minor celestial bodies while exploring',
      cost: 3000000,
      effect: 'celestialScanner',
      effectValue: true,
      icon: '🔭'
    },
    {
      id: 'resourceExtractor',
      name: 'Advanced Resource Extractor',
      description: 'Improves resource extraction from asteroids by 200%',
      cost: 7500000,
      effect: 'resourceExtraction',
      effectValue: 3.0,
      icon: '⛏️'
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
          const isUnlocked = unlockedSpaceUpgrades?.includes(upgrade.id);
          const canAfford = (aerogradePaperclips || 0) >= upgrade.cost;
          const isExpanded = expandedSection === upgrade.id;
          
          return (
            <div 
              key={upgrade.id} 
              className={`bg-gray-700 p-3 rounded relative ${isUnlocked ? 'opacity-50' : ''}`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleSection(upgrade.id)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{upgrade.icon}</span>
                  <span className="font-medium">{upgrade.name}</span>
                  {isUnlocked && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-green-900 text-green-100 rounded-full">Purchased</span>
                  )}
                </div>
                <button
                  className={`py-1 px-2 rounded text-xs ${
                    !isUnlocked && canAfford 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isUnlocked && canAfford) {
                      buySpaceUpgrade(upgrade.id, upgrade.cost);
                    }
                  }}
                  disabled={isUnlocked || !canAfford}
                >
                  {isUnlocked ? 'Purchased' : `${formatLargeNumber(upgrade.cost)} Aerograde`}
                </button>
              </div>
              
              {isExpanded && (
                <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  <p>{upgrade.description}</p>
                  {!isUnlocked && !canAfford && (
                    <p className="text-red-400 mt-1">
                      Need {formatLargeNumber(upgrade.cost - (aerogradePaperclips || 0))} more Aerograde paperclips
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