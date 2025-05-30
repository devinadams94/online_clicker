"use client";

import useGameStore from "@/lib/gameStore";
import { useState } from "react";
import { formatNumber, formatCurrency } from "@/utils/numberFormat";

export default function UpgradesPanel() {
  const { 
    autoclippers, 
    money,
    autoclipper_cost, 
    _clicks_per_second, 
    buyAutoclipper, 
    buyClickMultiplier, 
    clickMultiplier,
    visualFX,
    toggleClickAnimations,
    toggleFloatingText,
    setParticleIntensity,
    stockMarketUnlocked,
    unlockStockMarket,
    maxDemand,
    marketDemandLevel,
    marketDemandUpgradeCost,
    upgradeMarketDemand,
    metricsUnlocked,
    unlockMetrics,
    megaClippers,
    megaClipperCost,
    megaClippersUnlocked,
    productionMultiplier,
    buyMegaClipper,
    opsProductionMultiplier,
    prestigeRewards,
    memory,
    memoryMax,
    buyMemoryUpgrade,
    unlockedMemoryUpgrades
  } = useGameStore();

  const [showSettings, setShowSettings] = useState(false);

  // Calculate total production multiplier
  const prestigeProductionMultiplier = prestigeRewards?.productionMultiplier || 1;
  const totalMultiplier = (productionMultiplier + (opsProductionMultiplier || 0)) * prestigeProductionMultiplier;
  
  // Calculate actual production per second
  const actualProductionPerSec = autoclippers * totalMultiplier;

  // Calculate multiplier upgrade cost: 50 * 2^(current multiplier - 1)
  const multiplierCost = Math.floor(50 * Math.pow(2, clickMultiplier - 1));
  
  // No longer needed, using formatCurrency from utility
  
  // Stock market unlock cost
  const stockMarketCost = 50000;
  
  // Memory upgrades definitions
  const memoryUpgrades = [
    { 
      id: 'efficientProcessing', 
      name: 'Efficient Processing', 
      cost: 2, 
      description: 'Increase memory regeneration rate by 20%' 
    },
    { 
      id: 'parallelThinking', 
      name: 'Parallel Thinking', 
      cost: 3, 
      description: 'Double OPs production rate' 
    },
    { 
      id: 'quantumMemory', 
      name: 'Quantum Memory', 
      cost: 5, 
      description: 'Increase memory capacity by 50%' 
    },
    { 
      id: 'neuralCache', 
      name: 'Neural Cache', 
      cost: 4, 
      description: 'Boost research speed by 50%' 
    },
    { 
      id: 'hyperThreading', 
      name: 'Hyper-Threading', 
      cost: 6, 
      description: 'Add +2 to production multiplier' 
    },
    { 
      id: 'memoryOverclock', 
      name: 'Memory Overclock', 
      cost: 8, 
      description: 'Triple memory regeneration rate' 
    }
  ];
  
  // Check if player has enough money to buy upgrades
  const canBuyAutoclipper = money >= autoclipper_cost;
  const canBuyMultiplier = money >= multiplierCost;
  const canUnlockStockMarket = money >= stockMarketCost && !stockMarketUnlocked;
  const canUpgradeMarketDemand = money >= marketDemandUpgradeCost;
  const canUnlockMetrics = money >= 500 && !metricsUnlocked;
  const canBuyMegaClipper = money >= megaClipperCost && megaClippersUnlocked;

  return (
    <div className="relative bg-gradient-to-br from-gray-900/80 via-green-900/20 to-emerald-900/30 backdrop-blur-md border border-green-400/30 rounded-lg p-6 shadow-[0_0_20px_rgba(74,222,128,0.3)] h-[420px]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">Upgrades</h2>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">Scroll for more</div>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {showSettings ? (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Visual Settings</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Click Animations</span>
              <button 
                onClick={toggleClickAnimations}
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${visualFX.clickAnimations ? 'bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-gray-600'}`}
              >
                <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition ${visualFX.clickAnimations ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Floating Text</span>
              <button 
                onClick={toggleFloatingText}
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${visualFX.floatingText ? 'bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-gray-600'}`}
              >
                <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition ${visualFX.floatingText ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Particle Effects</span>
                <span className="text-sm">{visualFX.particleIntensity}x</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3" 
                step="0.5"
                value={visualFX.particleIntensity} 
                onChange={(e) => setParticleIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 h-[340px] overflow-y-auto pr-1">
          {/* Autoclippers Upgrade */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Autoclippers</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Owned: {autoclippers}</span>
              <span>Production: {formatNumber(actualProductionPerSec, 1)}/sec</span>
            </div>
            <p className="text-sm mb-4">
              Autoclippers make paperclips for you automatically at a rate of 1 clip per second each{totalMultiplier > 1 ? ` (×${formatNumber(totalMultiplier, 1)} with multipliers)` : ''}.
            </p>
            <button
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canBuyAutoclipper ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              onClick={buyAutoclipper}
              disabled={!canBuyAutoclipper}
            >
              Buy Autoclipper ({formatCurrency(autoclipper_cost)})
            </button>
          </div>
          
          {/* Click Multiplier Upgrade */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Click Multiplier</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Current: {clickMultiplier}x</span>
              <span>Next: {clickMultiplier + 1}x</span>
            </div>
            <p className="text-sm mb-4">
              Increases the number of paperclips you get per click. Each level adds +1 to your multiplier.
            </p>
            <button
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canBuyMultiplier ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              onClick={buyClickMultiplier}
              disabled={!canBuyMultiplier}
            >
              Buy Multiplier ({formatCurrency(multiplierCost)})
            </button>
          </div>
          
          {/* Mega-Clippers Upgrade */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Mega-Clippers</h3>
            
            {!megaClippersUnlocked ? (
              <div className="bg-gradient-to-br from-yellow-900/30 to-green-900/20 p-3 rounded-md border border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">Locked</span>
                </div>
                <p className="text-sm mt-2 text-yellow-600 dark:text-yellow-400">
                  Requires 100 autoclippers to unlock. You have {autoclippers}/100.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span>Owned: {megaClippers}</span>
                  <span>Multiplier: {formatNumber(productionMultiplier, 1)}x</span>
                </div>
                <p className="text-sm mb-4">
                  Mega-clippers enhance production efficiency. Each one increases your production multiplier by +1.
                </p>
                <button
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canBuyMegaClipper ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                  onClick={buyMegaClipper}
                  disabled={!canBuyMegaClipper}
                >
                  Buy Mega-Clipper ({formatCurrency(megaClipperCost)})
                </button>
              </>
            )}
          </div>
          
          {/* Market Demand Upgrade */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Market Expansion</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>Level: {marketDemandLevel}</span>
              <span>Max Demand: {maxDemand}</span>
            </div>
            <p className="text-sm mb-2">
              Expand your market reach to increase demand for your paperclips. Each level increases max demand by 20% and improves demand at higher prices.
            </p>
            
            {marketDemandLevel < 20 ? (
              <div className="bg-gradient-to-br from-blue-900/30 to-green-900/20 p-2 rounded text-xs mb-3 border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <span className="text-blue-700 dark:text-blue-300">
                  At level 20, you'll be able to sell paperclips even at premium prices ($1.00 each)!
                </span>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-2 rounded text-xs mb-3 border border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                <span className="text-green-700 dark:text-green-300">
                  Maximum level reached! You can now sell paperclips at premium prices ($1.00 each).
                </span>
              </div>
            )}
            
            <button
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canUpgradeMarketDemand ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              onClick={upgradeMarketDemand}
              disabled={!canUpgradeMarketDemand}
            >
              Expand Market ({formatCurrency(marketDemandUpgradeCost)})
            </button>
          </div>
          
          {/* Metrics Unlock */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Production Metrics</h3>
            {!metricsUnlocked ? (
              <>
                <p className="text-sm mb-4">
                  Unlock advanced production metrics to track your paperclip empire's growth and efficiency.
                </p>
                <button
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canUnlockMetrics ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                  onClick={unlockMetrics}
                  disabled={!canUnlockMetrics}
                >
                  Unlock Metrics ({formatCurrency(500)})
                </button>
              </>
            ) : (
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-2 rounded text-sm border border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                <span className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Metrics Unlocked
                </span>
                <p className="mt-2">The Metrics tab is now available in the navigation menu.</p>
              </div>
            )}
          </div>
          
          {/* Stock Market Unlock */}
          <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
            <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Stock Market</h3>
            {!stockMarketUnlocked ? (
              <>
                <p className="text-sm mb-4">
                  Unlock the stock market to invest your money and earn passive income through trading.
                </p>
                <button
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canUnlockStockMarket ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                  onClick={unlockStockMarket}
                  disabled={!canUnlockStockMarket}
                >
                  Unlock Stock Market ({formatCurrency(stockMarketCost)})
                </button>
              </>
            ) : (
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-2 rounded text-sm border border-green-400/30 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                <span className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Stock Market Unlocked
                </span>
                <p className="mt-2">The Stock Market is now available in the navigation menu.</p>
              </div>
            )}
          </div>
          
          {/* Memory Upgrades Section */}
          {memory > 0 && (
            <div className="p-3 bg-gradient-to-br from-gray-800/50 to-green-900/20 rounded-lg border border-green-400/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
              <h3 className="text-lg font-semibold mb-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">Memory Upgrades</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Current Memory: {formatNumber(memory, 1)}/{formatNumber(memoryMax, 0)}</span>
              </div>
              <div className="space-y-2 mt-3">
                {memoryUpgrades.map(upgrade => {
                  const isUnlocked = Array.isArray(unlockedMemoryUpgrades) && unlockedMemoryUpgrades.includes(upgrade.id);
                  const canAfford = memory >= upgrade.cost;
                  
                  return (
                    <div 
                      key={upgrade.id} 
                      className={`p-2 rounded-lg border ${isUnlocked 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{upgrade.name}</h4>
                        <span className={`text-sm ${canAfford ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                          {upgrade.cost} Memory
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{upgrade.description}</p>
                      {isUnlocked ? (
                        <span className="text-green-600 text-xs">✓ Purchased</span>
                      ) : (
                        <button
                          className={`w-full px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${canAfford ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black shadow-[0_0_10px_rgba(74,222,128,0.4)] hover:shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                          onClick={() => buyMemoryUpgrade(upgrade.id, upgrade.cost)}
                          disabled={!canAfford}
                        >
                          Purchase
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
