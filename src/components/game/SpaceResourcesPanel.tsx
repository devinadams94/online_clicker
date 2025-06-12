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

  // Handle case where spaceMatter or totalSpaceMatter aren't initialized
  const effectiveSpaceMatter = spaceMatter || 6e30; // Default to 6 nonillion
  const effectiveTotalSpaceMatter = totalSpaceMatter || 6e30; // Default to 6 nonillion
  
  // Calculate progress percentage for the matter used
  const matterUsedPercentage = ((effectiveTotalSpaceMatter - effectiveSpaceMatter) / effectiveTotalSpaceMatter) * 100;

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
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 mb-6 border border-green-400/20 w-full">
      <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center">
        <span className="text-xl mr-2">🌌</span> Space Resources
      </h2>
      
      {/* Planet Selector */}
      <div className="mb-4 backdrop-blur-sm bg-gray-800/50 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl mr-2">{currentPlanet.icon}</span>
            <span className="font-medium text-green-300">{currentPlanet.name}</span>
          </div>
          <button 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs py-2 px-3 rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)] transition-all duration-300"
            onClick={() => setIsPlanetDropdownOpen(!isPlanetDropdownOpen)}
          >
            Change Planet
          </button>
        </div>
        
        {/* Planet description */}
        <div className="text-xs text-green-200/70 mt-2">
          {currentPlanet.description}
        </div>
        
        {/* Planet dropdown */}
        {isPlanetDropdownOpen && (
          <div className="mt-3 backdrop-blur-sm bg-gray-900/80 rounded-lg p-3 max-h-40 overflow-y-auto border border-green-400/20">
            <h4 className="text-sm font-medium mb-2 text-green-300">Discovered Planets ({discoveredPlanets?.length || 1})</h4>
            <div className="space-y-1">
              {(discoveredPlanets || []).map((planet, index) => (
                <div 
                  key={planet.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${index === currentPlanetIndex ? 'bg-green-900/50 border border-green-400/40' : 'hover:bg-gray-700/50 border border-transparent hover:border-green-400/20'}`}
                  onClick={() => handlePlanetSelect(index)}
                >
                  <span className="mr-2">{planet.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-green-200">{planet.name}</div>
                    <div className="text-xs text-green-300/60">Matter: {formatLargeNumber(planet.matter)}</div>
                  </div>
                  {index === currentPlanetIndex && (
                    <span className="text-green-400 text-xs font-semibold">Active</span>
                  )}
                  {planet.discoveredAt > 0 && (
                    <span className="text-xs text-green-400/70 ml-2">Found at {planet.discoveredAt}%</span>
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
          <span className="text-sm font-medium text-green-300">Universe Explored:</span>
          <span className="text-sm font-bold text-green-400">{universeExplored.toFixed(10)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 border border-green-400/20">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.4)]" 
            style={{ width: `${Math.max(0.001, Math.min(100, universeExplored))}%` }}
          ></div>
        </div>
        <div className="flex justify-end text-xs text-green-300/70 mt-1">
          <span>Next planet at {Math.ceil(universeExplored)}%</span>
        </div>
      </div>
      
      {/* Matter resource */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-green-300">Available Matter {currentPlanet.icon}:</span>
          <span className="text-sm font-bold text-green-400">{formatLargeNumber(effectiveSpaceMatter)}</span>
        </div>
        <div className="flex justify-between mb-1 text-xs text-green-300/60">
          <span>Total Matter:</span>
          <span>{formatLargeNumber(effectiveTotalSpaceMatter)}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 border border-green-400/20">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.4)]" 
            style={{ width: `${Math.max(0.001, Math.min(100, matterUsedPercentage))}%` }}
          ></div>
        </div>
        <div className="flex justify-end text-xs text-green-300/70 mt-1">
          <span>{matterUsedPercentage.toFixed(10)}% used</span>
        </div>
      </div>
      
      {/* Resource breakdown */}
      <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <h3 className="font-medium mb-3 text-green-300">Resources Stockpile</h3>
        
        <div className="space-y-4">
          {/* Ore */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 hover:border-green-400/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-2 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                <span className="text-green-200">Space Ore</span>
              </span>
              <span className="font-medium text-green-400">{formatLargeNumber(spaceOre)}</span>
            </div>
            <div className="flex justify-between text-xs text-green-300/60 mt-1">
              <span>Mining Rate:</span>
              <span className="text-green-400">{formatLargeNumber(spaceOrePerSecond)}/sec</span>
            </div>
          </div>
          
          {/* Space Wire */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 hover:border-green-400/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span>
                <span className="text-green-200">Space Wire</span>
              </span>
              <span className="font-medium text-green-400">{formatLargeNumber(spaceWire)}</span>
            </div>
            <div className="flex justify-between text-xs text-green-300/60 mt-1">
              <span>Production Rate:</span>
              <span className="text-green-400">{formatLargeNumber(spaceWirePerSecond)}/sec</span>
            </div>
            <div className="flex justify-between text-xs text-green-300/60 mt-1">
              <span>Conversion Ratio:</span>
              <span className="text-green-300">1 Space Wire per 1 Ore</span>
            </div>
          </div>
          
          {/* Aerograde Paperclips */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 hover:border-green-400/30 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 shadow-[0_0_8px_rgba(168,85,247,0.4)]"></span>
                <span className="text-green-200">Aerograde Paperclips</span>
              </span>
              <span className="font-medium text-green-400">{formatLargeNumber(spacePaperclipsPerSecond)}/sec</span>
            </div>
            <div className="flex justify-between items-center mt-2 bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-2 rounded-lg border border-green-400/20">
              <span className="text-sm font-medium text-green-300">Total Stockpile:</span>
              <span className="text-sm font-bold text-green-400">{formatLargeNumber(aerogradePaperclips || 0)}</span>
            </div>
            <div className="flex justify-between text-xs text-green-300/60 mt-1">
              <span>Conversion Ratio:</span>
              <span className="text-green-300">1 Space Wire = 1 Aerograde Paperclip</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}