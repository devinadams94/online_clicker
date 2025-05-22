"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceResourcesPanel() {
  const {
    spaceAgeUnlocked,
    spaceMatter,
    spaceOre,
    spaceWire,
    totalSpaceMatter,
    spaceWirePerSecond,
    spaceOrePerSecond,
    spacePaperclipsPerSecond,
    discoveredPlanets,
    currentPlanetIndex,
    switchPlanet,
    universeExplored,
    aerogradePaperclips
  } = useGameStore();

  // State for planet selector dropdown
  const [isPlanetDropdownOpen, setIsPlanetDropdownOpen] = useState(false);

  // Format numbers with appropriate scientific notation for very large numbers
  const formatLargeNumber = (num: number = 0) => {
    if (num >= 1e30) return (num / 1e30).toFixed(2) + ' nonillion';
    if (num >= 1e27) return (num / 1e27).toFixed(2) + ' octillion';
    if (num >= 1e24) return (num / 1e24).toFixed(2) + ' septillion';
    if (num >= 1e21) return (num / 1e21).toFixed(2) + ' sextillion';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + ' quintillion';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  // Calculate progress percentage for the matter used
  const matterUsedPercentage = totalSpaceMatter ? ((totalSpaceMatter - (spaceMatter || 0)) / totalSpaceMatter) * 100 : 0;

  // Get current planet
  const currentPlanet = discoveredPlanets?.[currentPlanetIndex] || {
    id: 'earth',
    name: 'Earth',
    icon: '🌎',
    matter: 6e30,
    totalMatter: 6e30,
    description: 'Our home planet. Rich in resources but limited compared to what lies beyond.',
    discoveredAt: 0
  };

  // Handle planet selection
  const handlePlanetSelect = (index: number) => {
    switchPlanet(index);
    setIsPlanetDropdownOpen(false);
  };

  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return null;
  }

  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">🌌</span> Space Resources
      </h2>
      
      {/* Planet Selector */}
      <div className="mb-4 bg-gray-700 p-3 rounded">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl mr-2">{currentPlanet.icon}</span>
            <span className="font-medium">{currentPlanet.name}</span>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
            onClick={() => setIsPlanetDropdownOpen(!isPlanetDropdownOpen)}
          >
            Change Planet
          </button>
        </div>
        
        {/* Planet description */}
        <div className="text-xs text-gray-400 mt-2">
          {currentPlanet.description}
        </div>
        
        {/* Planet dropdown */}
        {isPlanetDropdownOpen && (
          <div className="mt-3 bg-gray-800 rounded p-2 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Discovered Planets ({discoveredPlanets?.length || 1})</h4>
            <div className="space-y-1">
              {(discoveredPlanets || []).map((planet, index) => (
                <div 
                  key={planet.id}
                  className={`flex items-center p-1 rounded cursor-pointer ${index === currentPlanetIndex ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                  onClick={() => handlePlanetSelect(index)}
                >
                  <span className="mr-2">{planet.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm">{planet.name}</div>
                    <div className="text-xs text-gray-400">Matter: {formatLargeNumber(planet.matter)}</div>
                  </div>
                  {index === currentPlanetIndex && (
                    <span className="text-green-400 text-xs">Active</span>
                  )}
                  {planet.discoveredAt > 0 && (
                    <span className="text-xs text-gray-500 ml-2">Found at {planet.discoveredAt}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Universe exploration */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Universe Explored:</span>
          <span className="text-sm font-bold text-blue-400">{universeExplored.toFixed(10)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-blue-500 h-1.5 rounded-full" 
            style={{ width: `${Math.max(0.001, Math.min(100, universeExplored))}%` }}
          ></div>
        </div>
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          <span>Next planet at {Math.ceil(universeExplored)}%</span>
        </div>
      </div>
      
      {/* Matter resource */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Available Matter {currentPlanet.icon}:</span>
          <span className="text-sm font-bold text-green-400">{formatLargeNumber(spaceMatter)}</span>
        </div>
        <div className="flex justify-between mb-1 text-xs text-gray-400">
          <span>Total Matter:</span>
          <span>{formatLargeNumber(totalSpaceMatter)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-green-500 h-1.5 rounded-full" 
            style={{ width: `${Math.max(0.001, Math.min(100, matterUsedPercentage))}%` }}
          ></div>
        </div>
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          <span>{matterUsedPercentage.toFixed(10)}% used</span>
        </div>
      </div>
      
      {/* Resource breakdown */}
      <div className="bg-gray-700 p-3 rounded">
        <h3 className="font-medium mb-3">Resources Stockpile</h3>
        
        <div className="space-y-3">
          {/* Ore */}
          <div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-amber-600 rounded-full mr-2"></span>
                <span>Space Ore</span>
              </span>
              <span className="font-medium">{formatLargeNumber(spaceOre)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Mining Rate:</span>
              <span>{formatLargeNumber(spaceOrePerSecond)}/sec</span>
            </div>
          </div>
          
          {/* Space Wire */}
          <div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                <span>Space Wire</span>
              </span>
              <span className="font-medium">{formatLargeNumber(spaceWire)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Production Rate:</span>
              <span>{formatLargeNumber(spaceWirePerSecond)}/sec</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Conversion Ratio:</span>
              <span>10 Space Wire per 1 Ore</span>
            </div>
          </div>
          
          {/* Aerograde Paperclips */}
          <div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                <span>Aerograde Paperclips</span>
              </span>
              <span className="font-medium">{formatLargeNumber(spacePaperclipsPerSecond)}/sec</span>
            </div>
            <div className="flex justify-between items-center mt-1 bg-purple-900 bg-opacity-30 p-1.5 rounded">
              <span className="text-sm font-medium">Total Stockpile:</span>
              <span className="text-sm font-bold text-purple-300">{formatLargeNumber(aerogradePaperclips || 0)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Conversion Ratio:</span>
              <span>1 Space Wire = 10 Aerograde Paperclips</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}