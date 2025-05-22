"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceControlPanel() {
  const {
    spaceAgeUnlocked,
    droneReplicationEnabled,
    toggleDroneReplication,
    unlockedSpaceUpgrades,
    discoveredCelestialBodies,
    harvestCelestialBody,
    honor
  } = useGameStore();
  
  const [showCelestialDetails, setShowCelestialDetails] = useState<string | null>(null);
  
  // Format numbers with appropriate scientific notation for very large numbers
  const formatLargeNumber = (num: number = 0) => {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  // Check if drone replication upgrade is unlocked
  const droneReplicationUnlocked = unlockedSpaceUpgrades?.includes('droneReplication') || false;
  
  // Check if celestial scanner is unlocked
  const celestialScannerUnlocked = unlockedSpaceUpgrades?.includes('celestialScanner') || false;
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return null;
  }
  
  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">🎮</span> Space Controls
      </h2>
      
      {/* Drone Self-Replication Toggle */}
      {droneReplicationUnlocked && (
        <div className="bg-gray-700 p-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Drone Self-Replication</h3>
              <p className="text-xs text-gray-400 mt-1">
                When enabled, harvester drones will self-replicate using Aerograde Paperclips when they find resources
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={droneReplicationEnabled || false}
                onChange={() => toggleDroneReplication()}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      )}
      
      {/* Celestial Bodies */}
      {celestialScannerUnlocked && (
        <div className="bg-gray-700 p-3 rounded mb-4">
          <h3 className="font-medium mb-2">Discovered Celestial Bodies</h3>
          
          {(discoveredCelestialBodies || []).length === 0 ? (
            <p className="text-sm text-gray-400">No celestial bodies discovered yet. Continue exploring the universe.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(discoveredCelestialBodies || []).map(body => (
                <div 
                  key={body.id}
                  className="bg-gray-800 p-2 rounded"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{body.icon}</span>
                      <div>
                        <div className="font-medium">{body.name}</div>
                        <div className="text-xs text-gray-400">{body.type}</div>
                      </div>
                    </div>
                    <button
                      className={`text-xs px-3 py-1 rounded ${
                        body.isBeingHarvested 
                          ? 'bg-red-800 hover:bg-red-900 text-white' 
                          : 'bg-green-700 hover:bg-green-800 text-white'
                      }`}
                      onClick={() => harvestCelestialBody(body.id)}
                    >
                      {body.isBeingHarvested ? 'Stop Harvesting' : 'Harvest'}
                    </button>
                  </div>
                  
                  <button 
                    className="w-full text-left text-xs text-gray-400 mt-1 flex items-center"
                    onClick={() => setShowCelestialDetails(showCelestialDetails === body.id ? null : body.id)}
                  >
                    <span className="mr-1">{showCelestialDetails === body.id ? '▼' : '►'}</span>
                    {showCelestialDetails === body.id ? 'Hide Details' : 'Show Details'}
                  </button>
                  
                  {showCelestialDetails === body.id && (
                    <div className="mt-2 text-xs text-gray-300 bg-gray-900 p-2 rounded">
                      <p className="mb-2">{body.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Matter:</span>
                          <span>{formatLargeNumber(body.resources.matter)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ore:</span>
                          <span>{formatLargeNumber(body.resources.ore)}</span>
                        </div>
                        {body.resources.rareElements !== undefined && (
                          <div className="flex justify-between">
                            <span>Rare Elements:</span>
                            <span>{formatLargeNumber(body.resources.rareElements)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-500">
                          <span>Discovered at:</span>
                          <span>{body.discoveredAt.toFixed(2)}% exploration</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Honor Display */}
      <div className="flex justify-between items-center bg-gray-700 p-3 rounded">
        <div className="flex items-center">
          <span className="text-xl mr-2">🏅</span>
          <div>
            <div className="font-medium">Honor</div>
            <div className="text-xs text-gray-400">Earned from space combat</div>
          </div>
        </div>
        <div className="text-xl font-bold text-yellow-400">{formatLargeNumber(honor || 0)}</div>
      </div>
    </div>
  );
}