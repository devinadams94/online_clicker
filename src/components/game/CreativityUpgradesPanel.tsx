"use client";

import useGameStore from "@/lib/gameStore";

// Define the upgrade items
const creativityUpgradeItems = [
  // Production creativity upgrades
  { id: 'algorithmicDesign', name: 'Algorithmic Design', cost: 100, description: 'Increase production multiplier by 50%', category: 'Production' },
  { id: 'selfImprovement', name: 'Self-Improvement', cost: 250, description: 'Double research point generation', category: 'Production' },
  { id: 'quantumEntanglement', name: 'Quantum Entanglement', cost: 400, description: 'Increase bot intelligence by 3', category: 'Production' },
  
  // Resource management creativity upgrades
  { id: 'resourceSynthesis', name: 'Resource Synthesis', cost: 150, description: 'Double wire per spool', category: 'Resources' },
  { id: 'matterReplication', name: 'Matter Replication', cost: 300, description: 'Generate 1,000,000 paperclips instantly', category: 'Resources' },
  { id: 'temporalEfficiency', name: 'Temporal Efficiency', cost: 500, description: 'Make everything run faster', category: 'Resources' },
  
  // Trust upgrades
  { id: 'trustFramework', name: 'Trust Framework', cost: 200, description: 'Gain 5 trust points', category: 'Trust' },
  { id: 'consciousnessExpansion', name: 'Consciousness Expansion', cost: 600, description: 'Triple OPs and memory capacity', category: 'Trust' },
  { id: 'singularityInsight', name: 'Singularity Insight', cost: 1000, description: 'Unlock true potential: 10x production, +20 trust, 10x OPs and memory', category: 'Trust' }
];

export default function CreativityUpgradesPanel() {
  const { 
    creativity, 
    creativityUnlocked, 
    unlockedCreativityUpgrades, 
    buyCreativityUpgrade 
  } = useGameStore();
  
  // Track unlockedCreativityUpgrades
  
  // Group upgrades by category
  const categories = [...new Set(creativityUpgradeItems.map(item => item.category))];
  
  if (!creativityUnlocked) {
    return (
      <div className="card bg-purple-50 dark:bg-gray-800 p-4 mb-6 h-64">
        <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-2 text-center">Creative Insights</h2>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <p className="text-sm mb-1">Creativity is currently locked</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Reach 20,000 OPs capacity to unlock creativity. Fully charge your OPs to generate creativity points.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card bg-purple-50 dark:bg-gray-800 p-4 mb-6 h-[400px]">
      <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-1 text-center">Creative Insights</h2>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-sm">Creativity:</span>
          <span className="font-bold text-purple-600 text-sm">{Math.floor(creativity)}</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          +0.1/sec when OPs are full
        </div>
      </div>
      
      <div className="overflow-y-auto pr-1 h-[270px] text-xs">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-purple-600 dark:text-purple-400">{category} Upgrades</h3>
            <div className="space-y-2">
              {creativityUpgradeItems
                .filter(item => item.category === category)
                .map(upgrade => {
                  // Check if upgrade is unlocked with validation
                  const isUnlocked = Array.isArray(unlockedCreativityUpgrades) && 
                    unlockedCreativityUpgrades.includes(upgrade.id);
                  const canAfford = creativity >= upgrade.cost;
                  
                  // Special styling for Singularity upgrade
                  const isSingularity = upgrade.id === 'singularityInsight';
                  
                  return (
                    <div 
                      key={upgrade.id} 
                      className={`p-2 rounded-lg border text-sm ${
                        isUnlocked 
                          ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900' 
                          : isSingularity
                            ? 'bg-purple-50 dark:bg-gray-800 border-yellow-300 dark:border-yellow-600 border-2'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <h3 className={`font-medium text-xs ${isSingularity ? 'text-yellow-600 dark:text-yellow-400' : 'text-purple-700 dark:text-purple-300'}`}>
                          {upgrade.name} {isSingularity && '✨'}
                        </h3>
                        <span className={`text-xs ${canAfford ? 'text-green-500 font-bold' : ''}`}>{upgrade.cost} CP</span>
                      </div>
                      <p className="text-xs mb-1 text-gray-600 dark:text-gray-300">{upgrade.description}</p>
                      {isUnlocked ? (
                        <span className="text-green-600 text-xs">Unlocked</span>
                      ) : (
                        <button
                          className={`w-full py-1 px-2 rounded text-xs ${
                            canAfford 
                              ? isSingularity
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-purple-600 text-white hover:bg-purple-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (canAfford) {
                              buyCreativityUpgrade(upgrade.id, upgrade.cost);
                              
                              // Trigger a save to ensure the upgrade is persisted immediately
                              setTimeout(() => {
                                if (window.saveGameNow) {
                                  window.saveGameNow().catch(() => {});
                                }
                              }, 500);
                            }
                          }}
                          disabled={!canAfford}
                        >
                          {canAfford ? 'Purchase' : 'Not enough'}
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
        Creative solutions to complex problems
      </p>
    </div>
  );
}