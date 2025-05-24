"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

interface SpaceResearchItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: "exploration" | "production" | "combat" | "advanced";
  unlockRequirement?: string[];
}

const spaceResearchItems: SpaceResearchItem[] = [
  // Exploration Research
  {
    id: "stellarCartography",
    name: "Stellar Cartography",
    description: "Advanced star mapping increases universe exploration speed by 50%",
    cost: 1000,
    icon: "🗺️",
    category: "exploration"
  },
  {
    id: "quantumSensors",
    name: "Quantum Sensors",
    description: "Detect hidden celestial bodies and increase discovery rate by 100%",
    cost: 2500,
    icon: "📡",
    category: "exploration",
    unlockRequirement: ["stellarCartography"]
  },
  {
    id: "warpDrive",
    name: "Warp Drive Technology",
    description: "Probes travel 3x faster through space",
    cost: 5000,
    icon: "⚡",
    category: "exploration",
    unlockRequirement: ["quantumSensors"]
  },
  {
    id: "dimensionalMapping",
    name: "Dimensional Mapping",
    description: "Discover parallel universes, increasing exploration capacity by 500%",
    cost: 15000,
    icon: "🌌",
    category: "exploration",
    unlockRequirement: ["warpDrive"]
  },
  
  // Production Research
  {
    id: "nanoAssemblers",
    name: "Nano Assemblers",
    description: "Microscopic builders increase all production by 25%",
    cost: 1500,
    icon: "🔬",
    category: "production"
  },
  {
    id: "fusionReactors",
    name: "Fusion Reactors",
    description: "Unlimited energy doubles factory output",
    cost: 3000,
    icon: "⚛️",
    category: "production",
    unlockRequirement: ["nanoAssemblers"]
  },
  {
    id: "matterCompression",
    name: "Matter Compression",
    description: "Convert matter to ore 100% more efficiently",
    cost: 6000,
    icon: "💎",
    category: "production",
    unlockRequirement: ["fusionReactors"]
  },
  {
    id: "stellarHarvesting",
    name: "Stellar Harvesting",
    description: "Harvest energy directly from stars, tripling all resource production",
    cost: 20000,
    icon: "☀️",
    category: "production",
    unlockRequirement: ["matterCompression"]
  },
  
  // Combat Research
  {
    id: "laserWeaponry",
    name: "Laser Weaponry",
    description: "Basic energy weapons increase combat effectiveness by 50%",
    cost: 2000,
    icon: "🔫",
    category: "combat"
  },
  {
    id: "shieldTechnology",
    name: "Shield Technology",
    description: "Energy shields reduce probe losses by 75%",
    cost: 4000,
    icon: "🛡️",
    category: "combat",
    unlockRequirement: ["laserWeaponry"]
  },
  {
    id: "antimatterWeapons",
    name: "Antimatter Weapons",
    description: "Devastating weapons triple combat power",
    cost: 8000,
    icon: "💥",
    category: "combat",
    unlockRequirement: ["shieldTechnology"]
  },
  {
    id: "temporalWarfare",
    name: "Temporal Warfare",
    description: "Time manipulation makes your forces nearly invincible",
    cost: 25000,
    icon: "⏱️",
    category: "combat",
    unlockRequirement: ["antimatterWeapons"]
  },
  
  // Advanced Research
  {
    id: "artificialIntelligence",
    name: "Advanced AI",
    description: "Self-improving AI doubles yomi generation",
    cost: 10000,
    icon: "🤖",
    category: "advanced"
  },
  {
    id: "quantumComputing",
    name: "Quantum Computing",
    description: "Quantum processors triple OPs generation",
    cost: 15000,
    icon: "💻",
    category: "advanced",
    unlockRequirement: ["artificialIntelligence"]
  },
  {
    id: "singularityResearch",
    name: "Singularity Research",
    description: "Approach technological singularity - all stats +100%",
    cost: 30000,
    icon: "🌀",
    category: "advanced",
    unlockRequirement: ["quantumComputing"]
  },
  {
    id: "omniscience",
    name: "Omniscience",
    description: "Achieve universal knowledge - unlock the secrets of reality",
    cost: 50000,
    icon: "👁️",
    category: "advanced",
    unlockRequirement: ["singularityResearch"]
  }
];

export default function SpaceResearchPanel() {
  const {
    researchPoints,
    researchPointsPerSecond,
    unlockedSpaceResearch = [],
    buySpaceResearch,
    spaceAgeUnlocked
  } = useGameStore();
  
  const [selectedCategory, setSelectedCategory] = useState<"all" | "exploration" | "production" | "combat" | "advanced">("all");
  
  // Format numbers with appropriate suffixes
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
  };
  
  // Check if research is available (requirements met)
  const isResearchAvailable = (item: SpaceResearchItem) => {
    if (!item.unlockRequirement) return true;
    return item.unlockRequirement.every(req => unlockedSpaceResearch.includes(req));
  };
  
  // Filter research items by category
  const filteredResearch = spaceResearchItems.filter(item => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="card bg-gray-800 text-white p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Space Research Locked</h2>
          <p className="text-gray-400">
            You must unlock the Space Age to access advanced space research technologies.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Space Research Laboratory</h1>
      
      {/* Research Points Display */}
      <div className="card bg-gradient-to-r from-purple-800 to-blue-800 text-white p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">Research Points</h2>
            <p className="text-3xl font-bold">{formatNumber(researchPoints)}</p>
            <p className="text-sm opacity-80">+{formatNumber(researchPointsPerSecond)}/sec</p>
          </div>
          <div className="text-6xl opacity-20">🧪</div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setSelectedCategory("all")}
        >
          All Research
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "exploration" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setSelectedCategory("exploration")}
        >
          🚀 Exploration
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "production" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setSelectedCategory("production")}
        >
          ⚙️ Production
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "combat" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setSelectedCategory("combat")}
        >
          ⚔️ Combat
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "advanced" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          onClick={() => setSelectedCategory("advanced")}
        >
          🔮 Advanced
        </button>
      </div>
      
      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResearch.map(item => {
          const isUnlocked = unlockedSpaceResearch.includes(item.id);
          const isAvailable = isResearchAvailable(item);
          const canAfford = researchPoints >= item.cost;
          const canResearch = !isUnlocked && isAvailable && canAfford;
          
          return (
            <div
              key={item.id}
              className={`card p-4 ${
                isUnlocked 
                  ? "bg-green-900/20 border-green-600" 
                  : isAvailable 
                    ? "bg-gray-800 border-gray-600" 
                    : "bg-gray-900/50 border-gray-700 opacity-50"
              } border`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                  
                  {isUnlocked ? (
                    <div className="text-green-400 font-bold">✓ Researched</div>
                  ) : (
                    <>
                      <div className="text-sm mb-2">
                        Cost: <span className="font-bold text-purple-400">{formatNumber(item.cost)} RP</span>
                      </div>
                      
                      {!isAvailable && item.unlockRequirement && (
                        <div className="text-xs text-red-400 mb-2">
                          Requires: {item.unlockRequirement.join(", ")}
                        </div>
                      )}
                      
                      <button
                        className={`w-full py-2 px-3 rounded text-sm ${
                          canResearch
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => canResearch && buySpaceResearch(item.id, item.cost)}
                        disabled={!canResearch}
                      >
                        {!isAvailable ? "Locked" : !canAfford ? "Insufficient RP" : "Research"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Research Tree Visualization */}
      <div className="mt-12 card bg-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">Research Progress</h2>
        <div className="grid grid-cols-4 gap-4">
          {["exploration", "production", "combat", "advanced"].map(category => {
            const categoryItems = spaceResearchItems.filter(item => item.category === category);
            const unlockedCount = categoryItems.filter(item => unlockedSpaceResearch.includes(item.id)).length;
            const percentage = (unlockedCount / categoryItems.length) * 100;
            
            return (
              <div key={category} className="text-center">
                <div className="capitalize font-medium mb-2">{category}</div>
                <div className="bg-gray-700 rounded-full h-2 mb-1">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">{unlockedCount}/{categoryItems.length}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}