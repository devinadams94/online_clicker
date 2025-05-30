"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import useGameStore from "@/lib/gameStore";
import { GameState } from "@/types/game";

// Note: Space functions are now imported directly from spaceExtension.ts in the gameStore
// This function is now just a placeholder for backward compatibility
function initializeSpaceFunctions() {
  // No need to add functions here anymore - they're initialized in gameStore
}
import ResourcesPanel from "./ResourcesPanel";
import UpgradesPanel from "./UpgradesPanel";
import MarketPanel from "./MarketPanel";
import WirePanel from "./WirePanel";
import StatsPanel from "./StatsPanel";
import PaperclipButton from "./PaperclipButton";
// import ProductionMetricsPanel from "./ProductionMetricsPanel";
// import MetricsUpgradePanel from "./MetricsUpgradePanel";
import StockMarketPanel from "./StockMarketPanel";
import MetricsPanel from "./MetricsPanel";
import OpsUpgradesPanel from "./OpsUpgradesPanel";
import CreativityUpgradesPanel from "./CreativityUpgradesPanel";
import TrustUpgradesPanel from "./TrustUpgradesPanel";
import SpaceStatsPanel from "./SpaceStatsPanel";
import SpaceLaunchPanel from "./SpaceLaunchPanel";
import SpaceResourcesPanel from "./SpaceResourcesPanel";
import SpaceUpgradesPanel from "./SpaceUpgradesPanel";
import SpaceResearchPanel from "./SpaceResearchPanel";
import SpaceCombatPanel from "./SpaceCombatPanel";
import SpaceControlPanel from "./SpaceControlPanel";
import PrestigePanel from "./PrestigePanel";
import dynamic from 'next/dynamic';
import FallbackClicker from "./FallbackClicker";

// Add saveGameNow and pending upgrade flags to the Window interface
declare global {
  interface _Window {
    saveGameNow?: () => Promise<void>;
    __pendingCpuUpgrade?: {
      cost: number;
      level: number;
      timestamp: number;
    };
    __pendingMemoryUpgrade?: {
      cost: number;
      max: number;
      timestamp: number;
    };
    __pendingOpsUpdate?: {
      current: number;
      max: number;
      timestamp: number;
    };
  }
}

// Dynamically import the Phaser component to prevent SSR issues
const PhaserGame = dynamic(
  () => import('./PhaserGame').catch(() => {
    // Return a fallback component on error
    return () => (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-red-500 mb-4">Game engine failed to load</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-pulse h-32 w-32 bg-secondary-200 rounded-full mb-4"></div>
        <p className="text-gray-500">Loading game engine...</p>
        <button 
          className="btn-primary mt-4"
          onClick={() => {
            // Force a reload of the component
            window.location.reload();
          }}
        >
          Click to make paperclips
        </button>
      </div>
    ),
  }
);

// Research Tree component
const ResearchPanel = () => {
  const { 
    researchPoints, 
    researchPointsPerSecond, 
    unlockedResearch, 
    buyResearch 
  } = useGameStore();

  // Define research items
  const researchItems = [
    // Basic research
    { id: 'efficiency', name: 'Efficient Clipping', cost: 100, description: 'Increase your click multiplier by +1', category: 'Basic' },
    { id: 'automation', name: 'Research Automation', cost: 200, description: 'Increase research point generation by 50%', category: 'Basic' },
    { id: 'marketing', name: 'Marketing', cost: 300, description: 'Increase base paperclip price by 20%', category: 'Basic' },
    { id: 'wireProduction', name: 'Wire Production', cost: 400, description: 'Increase wire per spool by 50%', category: 'Basic' },
    { id: 'advancedClippers', name: 'Advanced Clippers', cost: 500, description: 'Increase autoclipper production by 25%', category: 'Basic' },
    { id: 'stockMarket', name: 'Stock Market Trading', cost: 1000, description: 'Unlock stock market investing', category: 'Basic' },
    { id: 'hyperProduction', name: 'Hyper Production', cost: 12000, description: 'Quadruple production multiplier and increase click power by 5x', category: 'Basic' },
    
    // Advanced market research
    { id: 'demandAnalytics', name: 'Demand Analytics', cost: 1500, description: 'Increase market demand by 50% and max demand by 30%', category: 'Market' },
    { id: 'globalMarketing', name: 'Global Marketing', cost: 2000, description: 'Increase base price by 40% and market demand level', category: 'Market' },
    { id: 'marketPsychology', name: 'Market Psychology', cost: 3000, description: 'Reduce price sensitivity and market volatility', category: 'Market' },
    { id: 'viralCampaign', name: 'Viral Campaign', cost: 4000, description: 'Double market demand and max demand, reduce price sensitivity', category: 'Market' },
    { id: 'globalMonopoly', name: 'Global Monopoly', cost: 15000, description: 'Triple base paperclip price and increase max demand by 200%', category: 'Market' },
    { id: 'marketManipulation', name: 'Market Manipulation', cost: 20000, description: 'Gain significant control over market trends and reduce volatility by 75%', category: 'Market' },
    
    // Advanced production research
    { id: 'nanotechnology', name: 'Nanotechnology', cost: 2500, description: 'Increase production multiplier by 50%', category: 'Production' },
    { id: 'quantumEfficiency', name: 'Quantum Efficiency', cost: 3500, description: 'Increase clicks/sec by 75% and click multiplier by +3', category: 'Production' },
    { id: 'selfOptimization', name: 'Self-Optimization', cost: 5000, description: 'Double production multiplier and increase research by 50%', category: 'Production' },
    { id: 'swarmProduction', name: 'Swarm Production', cost: 6000, description: 'Triple clicks per second and increase production by 25%', category: 'Production' },
    { id: 'molecularAssembly', name: 'Molecular Assembly', cost: 18000, description: 'Transform production process to atomic level, increasing efficiency by 300%', category: 'Production' },
    { id: 'quantumFabrication', name: 'Quantum Fabrication', cost: 25000, description: 'Revolutionary production technique increases all production metrics by 500%', category: 'Production' },
    
    // Advanced resource research
    { id: 'materialScience', name: 'Material Science', cost: 2000, description: 'Double wire per spool', category: 'Resources' },
    { id: 'microAlloys', name: 'Micro-Alloys', cost: 3000, description: 'Increase production by 30% and wire per spool by 50%', category: 'Resources' },
    { id: 'wireRecycling', name: 'Wire Recycling', cost: 4000, description: 'Increase production by 80% through wire efficiency', category: 'Resources' },
    { id: 'quantumMaterials', name: 'Quantum Materials', cost: 16000, description: 'Develop materials with quantum properties, increasing wire efficiency by 500%', category: 'Resources' },
    { id: 'matterTransmutation', name: 'Matter Transmutation', cost: 22000, description: 'Convert basic elements into perfect wire material, reducing resource costs by 90%', category: 'Resources' },
    
    // Advanced intelligence research
    { id: 'enhancedLearning', name: 'Enhanced Learning', cost: 1500, description: 'Double research point generation', category: 'Intelligence' },
    { id: 'deepThinking', name: 'Deep Thinking', cost: 3000, description: 'Increase CPU level and memory, gain 10 OPs', category: 'Intelligence' },
    { id: 'computerVision', name: 'Computer Vision', cost: 4500, description: 'Increase bot intelligence by 2 and get 1 free trading bot', category: 'Intelligence' },
    { id: 'creativityEngine', name: 'Creativity Engine', cost: 5500, description: 'Unlock creativity and gain +5 creativity points', category: 'Intelligence' },
    { id: 'neuralAcceleration', name: 'Neural Acceleration', cost: 14000, description: 'Triple creativity generation speed and increase memory capacity by 50%', category: 'Intelligence' },
    { id: 'quantumConsciousness', name: 'Quantum Consciousness', cost: 23000, description: 'Achieve breakthrough in AI capabilities, increasing bot intelligence by 10 and creativity generation by 500%', category: 'Intelligence' },
    
    // Special projects
    { id: 'trustProject', name: 'Trust Project', cost: 10000, description: 'Gain 10 trust points and increase trust level', category: 'Special' },
    { id: 'quantumComputing', name: 'Quantum Computing', cost: 15000, description: 'Double CPU and memory, triple research generation', category: 'Special' },
    { id: 'cosmicExpansion', name: 'Cosmic Expansion', cost: 20000, description: 'Begin preparation for interstellar paperclip production, unlocking new potential upgrades', category: 'Special' },
    { id: 'multidimensionalResearch', name: 'Multidimensional Research', cost: 25000, description: 'Access parallel dimensions for research, boosting all production and research metrics by 1000%', category: 'Special' }
  ];

  // State for active category tab
  const [activeCategory, setActiveCategory] = useState('Basic');
  
  // Get unique categories for tabs
  const categories = [...new Set(researchItems.map(item => item.category))];
  
  // Filter research items by active category
  const filteredResearchItems = researchItems.filter(item => item.category === activeCategory);
  
  return (
    <div className="min-h-screen p-4 relative">
      {/* Neon green background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 mb-6 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">Research Lab</h2>
          <div className="mb-6 space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-green-300">Research Points:</span>
              <span className="text-green-400 font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">{Math.floor(researchPoints)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-300">Generation Rate:</span>
              <span className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">{researchPointsPerSecond.toFixed(2)}/sec</span>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap border-b border-green-400/30 mb-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 mr-2 mb-1 rounded-t transition-all ${activeCategory === category 
                  ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(74,222,128,0.6)]' 
                  : 'bg-gray-800/50 text-green-300 hover:bg-gray-700/50 hover:text-green-400 border border-green-400/20'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                {category === 'Special' && (
                  <span className="ml-1 text-xs bg-yellow-500 text-white px-1 rounded shadow-[0_0_10px_rgba(250,204,21,0.6)]">★</span>
                )}
              </button>
            ))}
          </div>

        {/* Research Items */}
        <div className="space-y-4">
          {filteredResearchItems.map(item => {
            const isUnlocked = unlockedResearch.includes(item.id);
            const canAfford = researchPoints >= item.cost;
            
            // Special styles for different categories with neon effects
            let categoryStyle = '';
            let glowColor = '';
            switch(item.category) {
              case 'Market':
                categoryStyle = isUnlocked ? 'bg-blue-900/30 border-blue-400' : '';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' : '';
                break;
              case 'Production':
                categoryStyle = isUnlocked ? 'bg-purple-900/30 border-purple-400' : '';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(147,51,234,0.5)]' : '';
                break;
              case 'Resources':
                categoryStyle = isUnlocked ? 'bg-yellow-900/30 border-yellow-400' : '';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(250,204,21,0.5)]' : '';
                break;
              case 'Intelligence':
                categoryStyle = isUnlocked ? 'bg-indigo-900/30 border-indigo-400' : '';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)]' : '';
                break;
              case 'Special':
                categoryStyle = isUnlocked ? 'bg-red-900/30 border-red-400' : 'border-yellow-400 border-2';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(250,204,21,0.6)]';
                break;
              default:
                categoryStyle = isUnlocked ? 'bg-green-900/30 border-green-400' : '';
                glowColor = isUnlocked ? 'shadow-[0_0_15px_rgba(74,222,128,0.5)]' : '';
            }
            
            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border backdrop-blur-sm transition-all ${isUnlocked 
                  ? `${categoryStyle} ${glowColor}` 
                  : 'bg-gray-800/50 border-gray-600 hover:border-green-400/50'}`}
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-green-100">
                    {item.name}
                    {item.category === 'Special' && <span className="ml-1 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">★</span>}
                  </h3>
                  <span className={`font-bold ${canAfford ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]' : 'text-gray-400'}`}>{item.cost} RP</span>
                </div>
                <p className="text-sm mb-3 text-gray-300">{item.description}</p>
                {isUnlocked ? (
                  <span className="text-green-400 text-sm font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">✓ Researched</span>
                ) : (
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${canAfford 
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(74,222,128,0.6)] hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    onClick={() => {
                      // Purchase the research
                      buyResearch(item.id);
                      
                      // For expensive research (>10000 points), ensure it's saved immediately
                      if (item.cost >= 10000) {
                        // Track the purchase in localStorage
                        const researchKey = `research_${item.id}_purchased`;
                        localStorage.setItem(researchKey, 'true');
                        
                        // Set pending save flag to ensure it gets saved properly
                        localStorage.setItem('pendingResearchSave', 'true');
                        localStorage.setItem('pendingResearchId', item.id);
                        
                        // Force immediate save if available
                        if (typeof window !== 'undefined' && window.saveGameNow) {
                          window.saveGameNow();
                        }
                        
                        // Trigger manual save event as fallback
                        const saveEvent = new CustomEvent('manual-save-trigger');
                        window.dispatchEvent(saveEvent);
                      }
                    }}
                    disabled={!canAfford}
                  >
                    Research
                  </button>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
};

// Using the imported StockMarketPanel component

export default function GameInterface() {
  const { data: session } = useSession();
  const [phaserFailed, setPhaserFailed] = useState(false);
  const [_justUnlockedSpaceAge, setJustUnlockedSpaceAge] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { 
    tick,
    marketTick,
    researchTick,
    stockMarketTick,
    statsTick,
    isAuthenticated, 
    isLoading, 
    setUserId, 
    setAuthenticated, 
    setLoading,
    // paperclips,
    // money,
    // autoclippers,
    // autoclipper_cost,
    // clicks_per_second,
    // clickMultiplier,
    // totalClicks,
    // paperclipPrice,
    // marketDemand,
    // paperclipsSold,
    // totalSales,
    setGameState,
    currentPage,
    setCurrentPage,
    stockMarketUnlocked,
    metricsUnlocked,
    spaceAgeUnlocked,
    // clickPaperclip, // Added this
  } = useGameStore();
  
  // Initialize space functions when component mounts
  useEffect(() => {
    initializeSpaceFunctions();
  }, []);
  
  // Handle Phaser loading errors
  useEffect(() => {
    const handlePhaserError = () => {
      setPhaserFailed(true);
    };
    
    window.addEventListener('phaser-load-error', handlePhaserError);
    
    // If Phaser doesn't load within 5 seconds, use fallback
    const timeoutId = setTimeout(() => {
      if (!(window as any).PHASER_LOADED) {
        handlePhaserError();
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('phaser-load-error', handlePhaserError);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Effect to handle mobile menu click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the spaceTick function if it exists
  const { spaceTick } = useGameStore();
  
  // Get the optimized batched tick function
  const { batchedTick } = useGameStore();
  
  // Tick function to update the game state every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Use the optimized batched tick for better performance
        if (batchedTick) {
          // Add debug statement once in a while to verify batched tick is being used
          const now = new Date();
          if (now.getSeconds() % 10 === 0 && now.getMilliseconds() < 200) {
            console.log('[GAME_INTERFACE] Using batchedTick for optimization');
          }
          batchedTick();
        } else {
          // Fallback to individual ticks if batched tick is not available
          if (spaceAgeUnlocked) {
            // Only run space tick and stats tick (for memory regen)
            statsTick();     // Stats tick (regenerates memory)
            stockMarketTick(); // Stock market tick (bots continue trading in space age)
            
            // Call spaceTick if it exists
            if (typeof spaceTick === 'function') {
              spaceTick();   // Space tick (handles probes and space resources)
            }
          } else {
            // Run normal game ticks only if space age is not unlocked
            tick();          // Production tick (generates paperclips)
            marketTick();    // Market tick (sells paperclips)
            researchTick();  // Research tick (generates research points)
            stockMarketTick(); // Stock market tick (generates returns)
            statsTick();     // Stats tick (regenerates memory)
          }
        }
      } catch (error) {
        console.error('Error in game tick:', error);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [tick, marketTick, researchTick, stockMarketTick, statsTick, spaceTick, spaceAgeUnlocked, batchedTick]);

  // Save game state periodically
  const saveGameState = useCallback(async () => {
    if (!isAuthenticated || !session?.user?.id) {
      return;
    }
    
    // Check for any pending upgrade flags in the global window object
    if (typeof window !== 'undefined') {
      // Check for pending CPU upgrade
      if (window.__pendingCpuUpgrade) {
        
        // Force update the state before saving
        const { cost, level } = window.__pendingCpuUpgrade;
        if (typeof cost === 'number' && !isNaN(cost)) {
          useGameStore.setState(state => ({
            ...state,
            cpuCost: cost,
            cpuLevel: level || state.cpuLevel
          }));
        }
        
        // Clear the flag
        delete window.__pendingCpuUpgrade;
      }
      
      // Check for pending Memory upgrade
      if (window.__pendingMemoryUpgrade) {
        
        // Force update the state before saving
        const { cost, max } = window.__pendingMemoryUpgrade;
        if (typeof cost === 'number' && !isNaN(cost)) {
          useGameStore.setState(state => ({
            ...state,
            memoryCost: cost,
            memoryMax: max || state.memoryMax
          }));
        }
        
        // Clear the flag
        delete window.__pendingMemoryUpgrade;
      }
      
      // Check for pending OPs update
      if (window.__pendingOpsUpdate) {
        
        // Force update the state before saving
        const { current, max } = window.__pendingOpsUpdate;
        if (typeof current === 'number' && !isNaN(current)) {
          useGameStore.setState(state => ({
            ...state,
            ops: current,
            opsMax: max || state.opsMax
          }));
        }
        
        // Clear the flag
        delete window.__pendingOpsUpdate;
      }
    }

    try {
      const {
        paperclips, 
        money,
        wire,
        autoclippers, 
        autoclipper_cost, 
        clicks_per_second,
        clickMultiplier,
        totalClicks,
        spoolCost,
        wirePerSpool,
        autoWireBuyer,
        autoWireBuyerCost,
        paperclipPrice,
        marketDemand,
        paperclipsSold,
        totalSales,
        basePaperclipPrice,
        elasticity,
        marketTrend,
        seasonalMultiplier,
        volatility,
        maxDemand,
        minDemand,
        marketDemandLevel,
        marketDemandUpgradeCost,
        researchPoints,
        researchPointsPerSecond,
        unlockedResearch,
        stockMarketUnlocked,
        tradingBots,
        tradingBotCost,
        botIntelligence,
        botIntelligenceCost,
        botTradingBudget,
        botTradingProfit,
        botTradingLosses,
        stockMarketReturns,
        stockMarketInvestment,
        cpuLevel,
        cpuCost,
        memory,
        memoryMax,
        memoryCost,
        memoryRegenRate,
        trust,
        trustLevel,
        nextTrustAt,
        ops,
        opsMax,
        creativity,
        creativityUnlocked,
        unlockedOpsUpgrades,
        unlockedCreativityUpgrades,
        metricsUnlocked,
        totalPaperclipsMade,
        highestRun,
        yomi, // Added yomi to the list of values from the store
        honor, // Added honor for space combat
        battlesWon, // Added battles won count for space combat
        autoBattleEnabled, // Added auto-battle enabled state
        autoBattleUnlocked, // Added auto-battle unlocked state
        battleDifficulty, // Added battle difficulty multiplier
        // aerogradePaperclips // Added aerograde paperclips for space resources
      } = useGameStore.getState();
      
      // Debug money value
      
      // Debug market demand upgrade values
      
      // Debug metrics unlock and total paperclips
      
      // Debug advanced resources
      
      // Debug computational upgrade values explicitly
      
      // Get production values from the state
      const { 
        megaClippers, 
        megaClipperCost, 
        megaClippersUnlocked, 
        productionMultiplier,
        upgradeCosts, // Add upgradeCosts to the destructured values
        // Space age values
        probes,
        universeExplored,
        wireHarvesters,
        oreHarvesters,
        factories,
        spaceWirePerSecond,
        spaceOrePerSecond,
        spacePaperclipsPerSecond,
        spaceAgeUnlocked,
        spaceStats
      } = useGameStore.getState();
      
      // Debug mega clippers values explicitly
      
      // Debug upgradeCosts object with enhanced validation
      
      // Validate upgradeCosts to ensure they're properly formatted before saving
      if (upgradeCosts) {
        if (typeof upgradeCosts !== 'object' || Array.isArray(upgradeCosts)) {
        } else {
          // Check key values
          Object.entries(upgradeCosts).forEach(([key, value]) => {
            if (typeof value !== 'number') {
            }
            // Log parallelProcessing specifically since it's causing issues
            if (key === 'parallelProcessing') {
            }
          });
        }
      } else {
      }
      
      // Debug bot intelligence data
      
      // Debug space age data
      
      // Get additional stock market and trading data
      const { 
        stockPortfolio, 
        stockPriceHistory, 
        portfolioValue,
        spoolSizeLevel,
        spoolSizeUpgradeCost,
        lastWirePurchaseTime,
        wirePurchaseCount
      } = useGameStore.getState();
      
      // Get bot trade time separately to avoid lexical declaration issues
      const botTradeData = useGameStore.getState();
      const botLastTradeTime = botTradeData.botLastTradeTime;
      
      // Debug bot trade time after it's been properly declared
      
      // Get trust-specific fields for debugging
      const { purchasedTrustLevels, unlockedTrustAbilities } = useGameStore.getState();
      
      // Debug trust upgrade information
      
      const gameData: { [key: string]: any } = {
        // Resources
        paperclips,
        money,
        wire,
        
        // Production
        autoclippers,
        autoclipper_cost,
        clicks_per_second,
        clickMultiplier,
        totalClicks,
        totalPaperclipsMade,
        highestRun,
        productionMultiplier,
        megaClippers,
        megaClipperCost,
        megaClippersUnlocked,
        
        // Space Age
        spaceAgeUnlocked,
        probes,
        universeExplored,
        wireHarvesters,
        oreHarvesters,
        factories,
        spaceWirePerSecond,
        spaceOrePerSecond,
        spacePaperclipsPerSecond,
        spaceStats: typeof spaceStats === 'object' ? JSON.stringify(spaceStats) : spaceStats,
        
        // Wire production
        spoolCost,
        wirePerSpool,
        autoWireBuyer,
        autoWireBuyerCost,
        spoolSizeLevel,
        spoolSizeUpgradeCost,
        lastWirePurchaseTime,
        wirePurchaseCount,
        
        // Market data
        paperclipPrice,
        marketDemand,
        paperclipsSold,
        totalSales,
        
        // Market parameters
        basePaperclipPrice,
        elasticity,
        marketTrend,
        seasonalMultiplier,
        volatility,
        maxDemand,
        minDemand,
        marketDemandLevel,
        marketDemandUpgradeCost,
        
        // Research
        researchPoints,
        researchPointsPerSecond,
        unlockedResearch: JSON.stringify(unlockedResearch),
        
        // Stock Market
        stockMarketUnlocked,
        tradingBots,
        tradingBotCost,
        botIntelligence: Number(botIntelligence) || 1, // Force to number
        botIntelligenceCost: Number(botIntelligenceCost) || 1500,
        botTradingBudget,
        botTradingProfit,
        botTradingLosses,
        // Serialize the date for bot last trade time - with safeguard for undefined
        botLastTradeTime: (botLastTradeTime instanceof Date) 
          ? botLastTradeTime.toISOString() 
          : new Date().toISOString(),
        stockMarketReturns,
        stockMarketInvestment,
        stockPortfolio: JSON.stringify(stockPortfolio),
        stockPriceHistory: JSON.stringify(stockPriceHistory),
        portfolioValue,
        
        // Player Stats
        cpuLevel,
        cpuCost,
        memory,
        memoryMax,
        memoryCost,
        memoryRegenRate,
        
        // Advanced Resources
        trust,
        trustLevel,
        nextTrustAt,
        ops,
        opsMax,
        yomi: String(typeof yomi === 'string' ? parseFloat(yomi) || 0 : (yomi || 0)), // Handle both string and number types
        creativity,
        creativityUnlocked,
        unlockedOpsUpgrades: JSON.stringify(unlockedOpsUpgrades),
        unlockedCreativityUpgrades: (() => {
          // Enhanced serialization with validation for creativity upgrades
          try {
            // Ensure we have a valid array to serialize
            const validUpgrades = Array.isArray(unlockedCreativityUpgrades) 
              ? unlockedCreativityUpgrades 
              : [];
            
            // Deduplicate upgrades
            const uniqueUpgrades = [...new Set(validUpgrades)];
            
            // Log what we're saving
            
            return JSON.stringify(uniqueUpgrades);
          } catch (err) {
            return "[]";
          }
        })(),
        purchasedTrustLevels,
        unlockedTrustAbilities,
        // Add the upgradeCosts object
        upgradeCosts: (() => {
          // Enhanced serialization with validation
          try {
            // Make sure all values are numbers before stringifying
            const validatedCosts = { ...upgradeCosts };
            Object.entries(validatedCosts).forEach(([key, value]) => {
              // Convert any non-number values to numbers if possible
              validatedCosts[key] = Number(value) || 0;
            });
            
            const stringified = JSON.stringify(validatedCosts);
            return stringified;
          } catch (err) {
            // Fallback to default costs if there's an error
            return JSON.stringify({
              'parallelProcessing': 15,
              'quantumAlgorithms': 30,
              'neuralOptimization': 50,
              'memoryCompression': 20,
              'cacheOptimization': 35,
              'distributedStorage': 60,
              'marketPrediction': 25,
              'trendAnalysis': 40,
              'highFrequencyTrading': 75
            });
          }
        })(),
        
        // Unlockable Features
        metricsUnlocked,
        
        // Space Combat Fields
        honor: String(typeof honor === 'string' ? parseFloat(honor) || 0 : (honor || 0)), // Handle both string and number types
        battlesWon: String(typeof battlesWon === 'string' ? parseInt(battlesWon) || 0 : (battlesWon || 0)), // Handle both string and number types
        autoBattleEnabled: Boolean(autoBattleEnabled), // Ensure boolean
        autoBattleUnlocked: Boolean(autoBattleUnlocked), // Ensure boolean
        battleDifficulty: String(typeof battleDifficulty === 'string' ? parseFloat(battleDifficulty) || 1 : (battleDifficulty || 1)), // Handle both string and number types
        aerogradePaperclips: String(typeof useGameStore.getState().aerogradePaperclips === 'string' ? 
            parseFloat(String(useGameStore.getState().aerogradePaperclips)) || 0 : 
            (useGameStore.getState().aerogradePaperclips || 0)), // Handle both string and number types
        unlockedSpaceUpgrades: JSON.stringify(useGameStore.getState().unlockedSpaceUpgrades || []) // Add space upgrades
      };
      
      // Validate numeric values to avoid NaN issues
      Object.entries(gameData).forEach(([key, value]) => {
        if (typeof value === 'number' && isNaN(value)) {
          gameData[key] = 0; // Default to 0 for NaN values
        }
      });
      
      // Log the full data we're about to send
      // Log specific wire spool data for debugging
      
      
      try {
        const response = await fetch('/api/game/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gameData),
        });
        
        // Log raw response info for debugging
        
        // Process successful response
        if (response.ok) {
        } else {
          // Handle error response
          let errorMessage = `Failed to save: HTTP status ${response.status}`;
          let responseText = '';
          
          try {
            // Try to get the response as text first (works for all responses)
            responseText = await response.text();
            
            // If the text looks like JSON, try to parse it
            if (responseText && responseText.trim().startsWith('{')) {
              try {
                const errorData = JSON.parse(responseText);
                
                if (errorData && errorData.message) {
                  errorMessage += ` - ${errorData.message}`;
                }
              } catch (jsonError) {
                // Use text as fallback
                if (responseText && responseText.trim()) {
                  errorMessage += ` - ${responseText}`;
                }
              }
            } else if (responseText && responseText.trim()) {
              // Use plain text response
              errorMessage += ` - ${responseText}`;
            }
          } catch (readError) {
          }
          
          // Don't throw - just log the error and continue
        }
      } catch (networkError) {
      }
    } catch (error) {
    }
  }, [isAuthenticated, session]);

  // Save game state every 3 seconds to avoid overloading the API
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Add save function to window for upgrades to access
    try {
      // Make sure saveGameNow is a properly defined Promise-returning function
      window.saveGameNow = async () => {
        try {
          await saveGameState();
          // Don't return anything (void return type)
        } catch (err) {
          throw err;
        }
      };
    } catch (err) {
    }
    
    // Add event listener for manual save trigger
    const handleManualSaveTrigger = () => {
      saveGameState();
    };
    window.addEventListener('manual-save-trigger', handleManualSaveTrigger);
    
    // Check localStorage for pending saves from upgrade functions
    const checkPendingSaves = () => {
      // Check for CPU upgrade save
      if (localStorage.getItem('pendingCpuUpgradeSave') === 'true') {
        const pendingCost = localStorage.getItem('pendingCpuUpgradeCost');
        if (pendingCost) {
          const newCost = parseFloat(pendingCost);
          if (!isNaN(newCost)) {
            // Force update the state before saving
            useGameStore.setState(state => ({
              ...state,
              cpuCost: newCost
            }));
          }
        }
        saveGameState();
        localStorage.removeItem('pendingCpuUpgradeSave');
        localStorage.removeItem('pendingCpuUpgradeCost');
      }
      
      // Check for Memory upgrade save
      if (localStorage.getItem('pendingMemoryUpgradeSave') === 'true') {
        const pendingCost = localStorage.getItem('pendingMemoryCost');
        const pendingMax = localStorage.getItem('pendingMemoryMax');
        
        if (pendingCost) {
          const newCost = parseFloat(pendingCost);
          if (!isNaN(newCost)) {
            // Force update the state before saving
            useGameStore.setState(state => ({
              ...state,
              memoryCost: newCost
            }));
          }
        }
        
        if (pendingMax) {
          const newMax = parseFloat(pendingMax);
          if (!isNaN(newMax)) {
            // Force update the state before saving
            useGameStore.setState(state => ({
              ...state,
              memoryMax: newMax
            }));
          }
        }
        
        saveGameState();
        localStorage.removeItem('pendingMemoryUpgradeSave');
        localStorage.removeItem('pendingMemoryCost');
        localStorage.removeItem('pendingMemoryMax');
      }
      
      // Check for OPs upgrade save
      if (localStorage.getItem('pendingOpsUpgradeSave') === 'true') {
        saveGameState();
        localStorage.removeItem('pendingOpsUpgradeSave');
        localStorage.removeItem('pendingOpsUpgradeId');
      }
      
      // Check for Creativity upgrade save
      if (localStorage.getItem('pendingCreativityUpgradeSave') === 'true') {
        saveGameState();
        localStorage.removeItem('pendingCreativityUpgradeSave');
        localStorage.removeItem('pendingCreativityUpgradeId');
      }
      
      // Check for Mega-Clipper purchase save
      if (localStorage.getItem('pendingMegaClipperSave') === 'true') {
        saveGameState();
        localStorage.removeItem('pendingMegaClipperSave');
      }
      
      // Check for pending Space Upgrade save
      if (localStorage.getItem('pendingSpaceUpgradeSave') === 'true') {
        const upgradeId = localStorage.getItem('pendingSpaceUpgradeId');
        if (upgradeId) {
        }
        saveGameState();
        localStorage.removeItem('pendingSpaceUpgradeSave');
        localStorage.removeItem('pendingSpaceUpgradeId');
      }
      
      // Check for OPs usage update
      if (localStorage.getItem('pendingOpsUpdate') === 'true') {
        const pendingOpsCurrent = localStorage.getItem('pendingOpsCurrent');
        
        if (pendingOpsCurrent) {
          const currentOps = parseFloat(pendingOpsCurrent);
          if (!isNaN(currentOps)) {
            // Force update the state before saving
            useGameStore.setState(state => ({
              ...state,
              ops: currentOps
            }));
          }
        }
        
        saveGameState();
        localStorage.removeItem('pendingOpsUpdate');
        localStorage.removeItem('pendingOpsCurrent');
      }
      
      // Check for pending research purchase
      if (localStorage.getItem('pendingResearchSave') === 'true') {
        const researchId = localStorage.getItem('pendingResearchId');
        if (researchId) {
          
          // Verify it's actually in the unlocked research
          const unlockedResearch = useGameStore.getState().unlockedResearch;
          if (Array.isArray(unlockedResearch) && !unlockedResearch.includes(researchId)) {
            
            // Create updated unlocked research list
            const updatedResearch = [...unlockedResearch, researchId];
            
            // Force update the state before saving
            useGameStore.setState(state => ({
              ...state,
              unlockedResearch: updatedResearch
            }));
            
          } else {
          }
        }
        
        saveGameState();
        localStorage.removeItem('pendingResearchSave');
        localStorage.removeItem('pendingResearchId');
      }
    };
    
    // Initial save on component mount and check for any pending saves from previous sessions
    saveGameState();
    checkPendingSaves(); // Check immediately to catch any pending saves from previous sessions
    
    // Regular save interval
    const saveInterval = setInterval(() => {
      saveGameState();
    }, 3000);
    
    // Check for pending saves more frequently
    const pendingSaveCheckInterval = setInterval(checkPendingSaves, 1000);
    
    return () => {
      clearInterval(saveInterval);
      clearInterval(pendingSaveCheckInterval);
      window.removeEventListener('manual-save-trigger', handleManualSaveTrigger);
      delete window.saveGameNow;
    };
  }, [isAuthenticated, saveGameState]);
  
  // Save game state before unload/refresh to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGameState();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveGameState]);

  // Save game state on window blur (tab changing/closing)
  useEffect(() => {
    const handleBlur = () => {
      saveGameState();
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [saveGameState]);

  // Load game state on session change
  useEffect(() => {
    const loadGameState = async () => {
      if (!session || !session.user) {
        // User is not authenticated, clear state
        setAuthenticated(false);
        setUserId(null);
        setLoading(false);
        
        // Reset the game state when not authenticated
        useGameStore.getState().resetGame();
        return;
      }
      
      // Handle user change
      const currentUserId = useGameStore.getState().userId;
      if (currentUserId !== session.user.id) {
        // User has changed, reset the state first to avoid state mixing
        useGameStore.getState().resetGame();
      }

      setAuthenticated(true);
      setUserId(session.user.id);

      try {
        const response = await fetch('/api/game/load');
        if (response.ok) {
          const data = await response.json();
          // Make sure money and paperclip price are properly parsed
          const loadedMoney = typeof data.money === 'number' ? data.money : 0;
          const loadedPaperclipPrice = typeof data.paperclipPrice === 'number' ? data.paperclipPrice : 0.25;
          
          // Calculate time passed since last save for offline progress
          const lastSavedTime = data.lastSaved ? new Date(data.lastSaved) : new Date();
          const currentTime = new Date();
          const timeDiffInSeconds = Math.floor((currentTime.getTime() - lastSavedTime.getTime()) / 1000);
          
          
          // Only apply offline progress if more than 5 seconds have passed
          let offlineProgressApplied = false;
          let offlineProgress = {
            paperclipsProduced: 0,
            paperclipsSold: 0,
            salesRevenue: 0,
            researchPoints: 0,
            stockMarketReturns: 0,
            wireUsed: 0,
            offlineTime: timeDiffInSeconds
          };
          
          if (timeDiffInSeconds > 5) {
            // Calculate offline progress
            offlineProgressApplied = true;
            
            // Load base values from saved data
            const paperclips = data.paperclips || 0;
            const wire = data.wire || 1000;
            const _autoclippers = data.autoclippers || 0;
            const _clicksPerSecond = data.clicks_per_second || 0;
            const _prodMultiplier = data.productionMultiplier || 1;
            const price = loadedPaperclipPrice || 0.25;
            const maxDemand = data.maxDemand || 50;
            const researchPerSec = data.researchPointsPerSecond || 0.1;
            const hasAutoWire = data.autoWireBuyer || false;
            const wirePerSpool = data.wirePerSpool || 1000;
            const spoolCost = data.spoolCost || 5;
            const tradingBots = data.tradingBots || 0;
            const botIntelligence = data.botIntelligence || 1;
            const botBudget = data.botTradingBudget || 0;
            const stockUnlocked = data.stockMarketUnlocked || false;
            
            // Cap offline progress at 12 hours (43,200 seconds) to prevent excessive gains
            const maxOfflineSeconds = 43200;
            const cappedTimeDiff = Math.min(timeDiffInSeconds, maxOfflineSeconds);
            
            // Paperclip production (limited by wire availability)
            const potentialProduction = _clicksPerSecond * cappedTimeDiff;
            const wireAvailable = wire;
            const actualProduction = Math.min(potentialProduction, wireAvailable);
            offlineProgress.paperclipsProduced = actualProduction;
            offlineProgress.wireUsed = actualProduction;
            
            // Paper clip sales (at reduced efficiency - 80% of normal)
            const demandPerSecond = Math.min(maxDemand, 20 * (1 / price));
            const potentialSales = demandPerSecond * cappedTimeDiff * 0.8; // 80% efficiency
            const actualSales = Math.min(potentialSales, actualProduction + paperclips);
            offlineProgress.paperclipsSold = actualSales;
            offlineProgress.salesRevenue = actualSales * price;
            
            // Auto wire buying (if enabled and sales revenue is enough)
            let _autoWireCost = 0;
            if (hasAutoWire && offlineProgress.wireUsed > 0) {
              const spoolsNeeded = Math.ceil(offlineProgress.wireUsed / wirePerSpool);
              const _autoWireCost = spoolsNeeded * spoolCost;
              // We'll apply this later when setting the game state
            }
            
            // Research points generation
            offlineProgress.researchPoints = researchPerSec * cappedTimeDiff;
            
            // Stock market returns (if unlocked and has trading bots)
            if (stockUnlocked && tradingBots > 0) {
              // Each bot generates returns at a reduced rate (60% efficiency)
              const baseReturnPerSecond = 0.001 * botBudget;
              const botEfficiency = 0.001 * botIntelligence;
              const botReturns = (baseReturnPerSecond + botEfficiency * botBudget) * cappedTimeDiff * 0.6;
              offlineProgress.stockMarketReturns = botReturns;
            }
            
          }
          
          // Log auto wire buyer status from database
          
          // Log stock market status from database
          
          // Log market demand upgrade status from database
          
          // Log metrics unlock status from database
          
          // Log wire spool upgrade data from database
          
          // Log advanced resources from database
          
          // Log computational upgrades from database explicitly
          
          // Log upgradeCosts from database
          try {
            if (data.upgradeCosts) {
              // Check if upgradeCosts is already an object or a string that needs parsing
              const parsedUpgradeCosts = typeof data.upgradeCosts === 'object' 
                ? data.upgradeCosts 
                : JSON.parse(data.upgradeCosts);
            } else {
            }
          } catch (err) {
          }
          
          // Let's simplify our approach and use the loaded data directly
          // with a few required defaults to satisfy TypeScript
          const gameData: Partial<GameState> = {
            // Resources
            paperclips: (data.paperclips || 0) + offlineProgress.paperclipsProduced - offlineProgress.paperclipsSold,
            money: loadedMoney + offlineProgress.salesRevenue,
            wire: (data.wire || 1000) - offlineProgress.wireUsed,
            
            // Production
            autoclippers: data.autoclippers,
            autoclipper_cost: data.autoclipper_cost,
            clicks_per_second: data.clicks_per_second,
            clickMultiplier: data.clickMultiplier || 1,
            totalClicks: data.totalClicks || 0,
            totalPaperclipsMade: (data.totalPaperclipsMade || 0) + offlineProgress.paperclipsProduced,
            revenuePerSecond: data.revenuePerSecond || 0,
            productionMultiplier: data.productionMultiplier || 1,
            megaClippers: data.megaClippers || 0,
            megaClipperCost: data.megaClipperCost || 5000,
            megaClippersUnlocked: data.megaClippersUnlocked || false,
            
            // Wire production
            spoolCost: data.spoolCost || 5,
            wirePerSpool: data.wirePerSpool || 1000,
            autoWireBuyer: data.autoWireBuyer || false,
            autoWireBuyerCost: data.autoWireBuyerCost || 100,
            spoolSizeLevel: data.spoolSizeLevel || 1,
            spoolSizeUpgradeCost: data.spoolSizeUpgradeCost || 125,
            lastWirePurchaseTime: new Date(),
            wirePurchaseCount: data.wirePurchaseCount || 0,
            
            // Market data
            paperclipPrice: loadedPaperclipPrice,
            marketDemand: data.marketDemand || 10,
            paperclipsSold: (data.paperclipsSold || 0) + offlineProgress.paperclipsSold,
            totalSales: (data.totalSales || 0) + offlineProgress.salesRevenue,
            
            // Market parameters
            basePaperclipPrice: data.basePaperclipPrice || 0.25,
            elasticity: data.elasticity || 3,
            marketTrend: data.marketTrend || 0,
            seasonalMultiplier: data.seasonalMultiplier || 1,
            volatility: data.volatility || 0.15,
            maxDemand: data.maxDemand || 50,
            minDemand: data.minDemand || 1,
            marketDemandLevel: data.marketDemandLevel || 1,
            marketDemandUpgradeCost: data.marketDemandUpgradeCost || 200,
            
            // Research
            researchPoints: (data.researchPoints || 0) + offlineProgress.researchPoints,
            researchPointsPerSecond: data.researchPointsPerSecond || 0.1,
            unlockedResearch: data.unlockedResearch ? JSON.parse(data.unlockedResearch) : [],
            
            // Stock Market
            stockMarketUnlocked: data.stockMarketUnlocked || false,
            tradingBots: data.tradingBots || 0,
            tradingBotCost: data.tradingBotCost || 1000,
            // Make sure botIntelligence is at least 1, never undefined or 0
            botIntelligence: parseInt(data.botIntelligence || 1) || 1,
            botIntelligenceCost: parseFloat(data.botIntelligenceCost || 1500) || 1500,
            botTradingBudget: parseFloat(data.botTradingBudget || 0) || 0,
            botLastTradeTime: new Date(0), // Reset to allow immediate trading on load
            botTradingProfit: parseFloat((data.botTradingProfit || 0) + offlineProgress.stockMarketReturns) || 0,
            botTradingLosses: parseFloat(data.botTradingLosses || 0) || 0,
            stockMarketReturns: (data.stockMarketReturns || 0) + offlineProgress.stockMarketReturns,
            stockMarketInvestment: data.stockMarketInvestment || 0,
            stockPortfolio: data.stockPortfolio ? JSON.parse(data.stockPortfolio) : [],
            stockPriceHistory: data.stockPriceHistory ? JSON.parse(data.stockPriceHistory) : {},
            portfolioValue: data.portfolioValue || 0,
            
            // Player Stats
            cpuLevel: data.cpuLevel || 1,
            cpuCost: data.cpuCost || 25, // Ensure this matches the default in save/route.ts
            memory: data.memory || 1,
            memoryMax: data.memoryMax || 1,
            memoryCost: data.memoryCost || 10, // Ensure this matches the default in save/route.ts
            memoryRegenRate: data.memoryRegenRate || 1,
            
            // Advanced Resources
            trust: data.trust || 0,
            trustLevel: data.trustLevel || 0,
            nextTrustAt: data.nextTrustAt || 100000,
            // Add yomi with logging
            yomi: (() => {
              const yomiValue = parseFloat(data.yomi || 0) || 0;
              return yomiValue;
            })(),
            // Use the already parsed purchasedTrustLevels from API response
            purchasedTrustLevels: Array.isArray(data.purchasedTrustLevels) ? data.purchasedTrustLevels : [],
            // Log separately for type safety
            // Use the already parsed unlockedTrustAbilities from API response
            unlockedTrustAbilities: Array.isArray(data.unlockedTrustAbilities) ? data.unlockedTrustAbilities : [],
            ops: data.ops || 50, // Ensure this matches the 50 OPs per memory default
            opsMax: data.opsMax || 50, // Ensure this matches the 50 OPs per memory default
            creativity: data.creativity || 0,
            creativityUnlocked: data.creativityUnlocked || false,
            // Ensure unlockedOpsUpgrades is properly parsed from JSON or initialized as empty array
            unlockedOpsUpgrades: (() => {
              if (Array.isArray(data.unlockedOpsUpgrades)) {
                return data.unlockedOpsUpgrades;
              } else if (typeof data.unlockedOpsUpgrades === 'string') {
                try {
                  const parsed = JSON.parse(data.unlockedOpsUpgrades);
                  if (Array.isArray(parsed)) {
                    return parsed;
                  }
                } catch (err) {
                }
              }
              return [];
            })(),
            
            // Process upgradeCosts with enhanced parsing and validation
            upgradeCosts: (() => {
              // Default costs as fallback
              const defaultCosts: { [key: string]: number } = {
                'parallelProcessing': 15,
                'quantumAlgorithms': 30,
                'neuralOptimization': 50,
                'memoryCompression': 20,
                'cacheOptimization': 35,
                'distributedStorage': 60,
                'marketPrediction': 25,
                'trendAnalysis': 40,
                'highFrequencyTrading': 75
              };
              
              // Try to parse upgradeCosts from data with detailed logging
              
              // Track the source of the data for debugging
              let dataSource = "default";
              let parsedCosts: { [key: string]: number } = { ...defaultCosts };
              
              if (data.upgradeCosts) {
                try {
                  // If it's already an object, use it directly
                  if (typeof data.upgradeCosts === 'object' && !Array.isArray(data.upgradeCosts)) {
                    dataSource = "direct object";
                    
                    // Copy values, ensuring they are numbers
                    Object.keys(data.upgradeCosts).forEach(key => {
                      const costValue = Number(data.upgradeCosts[key]);
                      if (!isNaN(costValue)) {
                        parsedCosts[key] = costValue;
                      }
                    });
                  }
                  // If it's a string, parse it
                  else if (typeof data.upgradeCosts === 'string') {
                    try {
                      const parsed = JSON.parse(data.upgradeCosts);
                      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        dataSource = "parsed string";
                        
                        // Copy values, ensuring they are numbers
                        Object.keys(parsed).forEach(key => {
                          const costValue = Number(parsed[key]);
                          if (!isNaN(costValue)) {
                            parsedCosts[key] = costValue;
                          }
                        });
                      }
                    } catch (parseErr) {
                      dataSource = "error fallback - string parse failed";
                    }
                  }
                } catch (err) {
                  dataSource = "error fallback";
                }
              }
              
              // Log the final costs for each upgrade explicitly for debugging
              Object.entries(parsedCosts).forEach(([key, value]) => {
              });
              
              // Always ensure parallelProcessing has a value
              if (!parsedCosts.parallelProcessing || isNaN(parsedCosts.parallelProcessing)) {
                parsedCosts.parallelProcessing = defaultCosts.parallelProcessing;
              }
              
              return parsedCosts;
            })(),
            // Ensure unlockedCreativityUpgrades is properly parsed from JSON or initialized as empty array
            unlockedCreativityUpgrades: (() => {
              
              let parsedCreativityUpgrades: string[] = [];
              
              try {
                // If it's already an array, use it directly
                if (Array.isArray(data.unlockedCreativityUpgrades)) {
                  parsedCreativityUpgrades = [...data.unlockedCreativityUpgrades];
                }
                // If it's a string, try to parse it
                else if (typeof data.unlockedCreativityUpgrades === 'string') {
                  try {
                    const parsed = JSON.parse(data.unlockedCreativityUpgrades);
                    if (Array.isArray(parsed)) {
                      parsedCreativityUpgrades = [...parsed];
                    } else {
                    }
                  } catch (err) {
                  }
                } else {
                }
                
                // Deduplicate the array to ensure each upgrade only appears once
                parsedCreativityUpgrades = [...new Set(parsedCreativityUpgrades)];
                
                // Log final array for debugging
              } catch (err) {
              }
              
              return parsedCreativityUpgrades;
            })(),
            
            // Unlockable Features
            metricsUnlocked: data.metricsUnlocked || false,
            
            // Space Age features - this was missing!
            spaceAgeUnlocked: data.spaceAgeUnlocked || false,
            probes: data.probes || 0,
            universeExplored: data.universeExplored || 0,
            wireHarvesters: data.wireHarvesters || 0,
            oreHarvesters: data.oreHarvesters || 0,
            factories: data.factories || 0,
            spaceWirePerSecond: data.spaceWirePerSecond || 0,
            spaceOrePerSecond: data.spaceOrePerSecond || 0,
            spacePaperclipsPerSecond: data.spacePaperclipsPerSecond || 0,
            // Space Combat fields with logging
            honor: (() => {
              const honorValue = parseFloat(data.honor || 0) || 0;
              return honorValue;
            })(),
            battlesWon: (() => {
              const battlesWonValue = parseInt(data.battlesWon || 0) || 0;
              return battlesWonValue;
            })(),
            autoBattleEnabled: (() => {
              const enabled = Boolean(data.autoBattleEnabled);
              return enabled;
            })(),
            autoBattleUnlocked: (() => {
              const unlocked = Boolean(data.autoBattleUnlocked);
              return unlocked;
            })(),
            battleDifficulty: (() => {
              const difficulty = parseFloat(data.battleDifficulty || 1) || 1;
              return difficulty;
            })(),
            aerogradePaperclips: (() => {
              const amount = parseFloat(data.aerogradePaperclips || 0) || 0;
              return amount;
            })(),
            unlockedSpaceUpgrades: (() => {
              // Check if it's already an array
              if (Array.isArray(data.unlockedSpaceUpgrades)) {
                return data.unlockedSpaceUpgrades;
              }
              // Try to parse from string if it's not an array
              try {
                if (typeof data.unlockedSpaceUpgrades === 'string') {
                  const parsed = JSON.parse(data.unlockedSpaceUpgrades);
                  if (Array.isArray(parsed)) {
                    return parsed;
                  }
                }
              } catch (err) {
              }
              // Default to empty array if parsing fails
              return [];
            })(),
            spaceStats: data.spaceStats ? (
              typeof data.spaceStats === 'string' ? JSON.parse(data.spaceStats) : data.spaceStats
            ) : {
              speed: 1,
              exploration: 1,
              selfReplication: 1,
              wireProduction: 1,
              miningProduction: 1,
              factoryProduction: 1
            },
            
            // Store offline progress for display
            offlineProgress: offlineProgressApplied ? offlineProgress : null,
            // Don't add any more fields here to avoid duplicates
          };
          
          // Add required fields to satisfy TypeScript
          gameData.prestigeLevel = 0;
          gameData.prestigePoints = 0;
          gameData.lifetimePaperclips = data.totalPaperclipsMade || 0;
          gameData.prestigeRewards = {
            productionMultiplier: 1,
            researchMultiplier: 1,
            wireEfficiency: 1,
            startingMoney: 0,
            clickMultiplier: 1
          };
          
          // Required space fields with defaults
          gameData.spaceMatter = 0;
          gameData.spaceOre = 0;
          gameData.spaceWire = 0;
          gameData.totalSpaceMatter = 0;
          gameData.discoveredPlanets = [];
          gameData.currentPlanetIndex = 0;
          gameData.discoveredCelestialBodies = [];
          gameData.opsProductionMultiplier = 1;
          
          // Add other required fields to satisfy the GameState interface
          gameData.droneReplicationEnabled = false;
          gameData.droneReplicationCostPerDrone = 1000;
          gameData.botRiskThreshold = 0.2;
          gameData.stockMarketLastUpdate = new Date();
          gameData.stockTrendData = {};
          
          // Apply the game state using type assertion - we're adding defaults for missing fields
          setGameState(gameData as GameState);
          
          // If space age is unlocked, ensure autoclippers are 0
          if (gameData.spaceAgeUnlocked) {
            useGameStore.setState({
              autoclippers: 0,
              megaClippers: 0,
              clicks_per_second: 0,
              productionMultiplier: 0
            });
          }
          
          // Display offline progress notification if applicable
          if (offlineProgressApplied) {
            // This could be implemented with a toast notification or modal
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadGameState();
  }, [session, setAuthenticated, setUserId, setLoading, setGameState]);

  // Offline progress notification
  const [showOfflineProgress, setShowOfflineProgress] = useState(false);
  const { offlineProgress } = useGameStore();

  // When offlineProgress changes and is not null, show the notification
  useEffect(() => {
    if (offlineProgress) {
      setShowOfflineProgress(true);
    }
  }, [offlineProgress]);
  
  // Track Space Age unlock to show notification and redirect
  // We only want to redirect if Space Age is unlocked DURING the session, not on initial load
  const previousSpaceAgeUnlocked = useRef(spaceAgeUnlocked);
  
  useEffect(() => {
    // Only redirect if Space Age was unlocked during this session (value changed from false to true)
    if (spaceAgeUnlocked && !previousSpaceAgeUnlocked.current) {
      setJustUnlockedSpaceAge(true);
      // Auto-redirect to space page on first unlock
      setTimeout(() => {
        setCurrentPage('space');
      }, 1000);
    }
    // Update the ref to track the current value for next comparison
    previousSpaceAgeUnlocked.current = spaceAgeUnlocked;
  }, [spaceAgeUnlocked, setCurrentPage]);

  // Function to dismiss the offline progress notification
  const dismissOfflineProgress = () => {
    setShowOfflineProgress(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]"></div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    { id: 'game', name: 'Game', always: true },
    { id: 'upgrades', name: 'Upgrades', hideWhenSpaceUnlocked: true },
    { id: 'research', name: 'Research', hideWhenSpaceUnlocked: true },
    { id: 'metrics', name: 'Metrics', requireMetricsUnlock: true },
    { id: 'stock', name: 'Stock Market', requireStockUnlock: true },
    { id: 'space', name: 'Space Age', requireSpaceUnlock: true },
    { id: 'spaceupgrades', name: 'Space Upgrades', requireSpaceUnlock: true },
    { id: 'spaceresearch', name: 'Space Research', requireSpaceUnlock: true },
    { id: 'prestige', name: 'Prestige', always: true }
  ];
  
  // Debug log for unlockable features

  // Render page content based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'space':
        // Check if space age is unlocked
        if (!spaceAgeUnlocked) {
          // Redirect to game page if space age is not unlocked
          setTimeout(() => {
            setCurrentPage('game');
          }, 0);
          
          return (
            <div className="min-h-screen p-4 bg-gray-900 text-white flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold mb-4 text-red-400">Space Age Not Unlocked</h1>
              <p className="text-gray-300 mb-6 max-w-xl text-center">
                You need to unlock the Space Age upgrade first. 
                Return to the upgrades page and purchase the Space Age upgrade.
              </p>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setCurrentPage('upgrades')}
              >
                Go to Upgrades
              </button>
            </div>
          );
        }
        
        // Space Age dedicated page (only shown if unlocked)
        return (
          <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Space Age</h1>
            <p className="text-gray-300 mb-6 max-w-4xl">
              Your paperclip empire now spans across the stars. Explore the vastness of space, deploy autonomous probes, and harvest resources from distant galaxies to expand your interstellar paperclip production network.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main space launch panel - takes 2/3 of the width */}
              <div className="lg:col-span-2">
                <SpaceLaunchPanel />
                <SpaceResourcesPanel />
                <SpaceControlPanel />
                <SpaceCombatPanel />
              </div>
              
              {/* Space stats panel - takes 1/3 of the width */}
              <div>
                <SpaceStatsPanel />
              </div>
            </div>
          </div>
        );
      
      case 'prestige':
        return (
          <div className="min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Prestige System</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-4xl">
              Reset your progress to gain powerful permanent bonuses. The more paperclips you've produced, the more prestige points you'll earn.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main prestige panel - takes 2/3 of the width */}
              <div className="lg:col-span-2">
                <PrestigePanel />
              </div>
              
              {/* Stats panel - takes 1/3 of the width */}
              <div>
                <StatsPanel />
                <div className="card bg-white dark:bg-gray-800 p-4 mt-4">
                  <h2 className="text-lg font-bold mb-3">Prestige Information</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Prestige points are calculated based on your total paperclips produced (current + lifetime).
                    You need at least 1 million paperclips to earn your first prestige point.
                  </p>
                  <h3 className="font-medium mt-4 mb-2">Formula</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono">
                    Points = sqrt(totalPaperclips / 1,000,000)
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Examples:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>1M paperclips = 1 point</li>
                      <li>4M paperclips = 2 points</li>
                      <li>9M paperclips = 3 points</li>
                      <li>16M paperclips = 4 points</li>
                      <li>100M paperclips = 10 points</li>
                      <li>1B paperclips = 31.6 points</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'research':
        return <ResearchPanel />;
        
      case 'stock':
        return <StockMarketPanel />;
        
      case 'metrics':
        return (
          <div className="min-h-screen p-4 relative">
            {/* Neon green background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-green-400/20" />
            </div>
            
            <div className="relative z-10">
              <MetricsPanel />
            </div>
          </div>
        );
        
      case 'upgrades':
        return (
          <div className="min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-6">Upgrades</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <UpgradesPanel />
                <TrustUpgradesPanel />
              </div>
              <div className="space-y-8">
                <StatsPanel />
                <OpsUpgradesPanel />
                <CreativityUpgradesPanel />
              </div>
            </div>
          </div>
        );
        
      case 'spaceupgrades':
        if (!spaceAgeUnlocked) {
          // Redirect to game page if space age is not unlocked
          setTimeout(() => {
            setCurrentPage('game');
          }, 0);
          
          return (
            <div className="min-h-screen p-4 bg-gray-900 text-white flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold mb-4 text-red-400">Space Age Not Unlocked</h1>
              <p className="text-gray-300 mb-6 max-w-xl text-center">
                You need to unlock the Space Age upgrade first.
              </p>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setCurrentPage('game')}
              >
                Return to Game
              </button>
            </div>
          );
        }
        
        return (
          <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Space Upgrades</h1>
            <p className="text-gray-300 mb-6 max-w-4xl">
              Enhance your space capabilities with advanced technologies and upgrades.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main upgrade panels - takes 2/3 of the width */}
              <div className="lg:col-span-2">
                <SpaceUpgradesPanel />
              </div>
              
              {/* Stats panels - takes 1/3 of the width */}
              <div className="space-y-6">
                <SpaceStatsPanel />
                <StatsPanel />
              </div>
            </div>
          </div>
        );
        
      case 'spaceresearch':
        if (!spaceAgeUnlocked) {
          // Redirect to game page if space age is not unlocked
          setTimeout(() => {
            setCurrentPage('game');
          }, 0);
          
          return (
            <div className="min-h-screen p-4 bg-gray-900 text-white flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-3xl font-bold mb-4 text-red-400">Space Age Not Unlocked</h1>
              <p className="text-gray-300 mb-6 max-w-xl text-center">
                You need to unlock the Space Age upgrade first.
              </p>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setCurrentPage('game')}
              >
                Return to Game
              </button>
            </div>
          );
        }
        
        return (
          <div className="min-h-screen p-4 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Space Research</h1>
            <p className="text-gray-300 mb-6 max-w-4xl">
              Unlock advanced space technologies to enhance your cosmic empire.
            </p>
            
            <div className="max-w-6xl mx-auto">
              <SpaceResearchPanel />
            </div>
          </div>
        );
        
      case 'game':
      default:
        // If space age is unlocked, redirect to space page
        if (spaceAgeUnlocked) {
          // Automatically switch to space page
          setTimeout(() => {
            setCurrentPage('space');
          }, 0);
          return (
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="animate-pulse h-32 w-32 bg-secondary-200 rounded-full mb-4 mx-auto"></div>
                <p className="text-gray-500">Entering Space Age...</p>
              </div>
            </div>
          );
        }
        
        // Regular UI for pre-space age
        return (
          <div className="flex flex-col md:flex-row min-h-screen p-4 gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <ResourcesPanel />
              <MarketPanel />
              
              <div className="flex-1 hidden">
                {phaserFailed ? <FallbackClicker /> : <PhaserGame />}
              </div>
            </div>
            
            <div className="md:w-64 lg:w-72 flex flex-col gap-4">
              <div className="card p-4 text-center">
                <PaperclipButton />
              </div>
              <StatsPanel />
              <WirePanel />
            </div>
          </div>
        );
    }
  };

  // Filter navigation items into primary and secondary groups
  const primaryNavItems = navItems.filter(item => 
    item.id === 'game' || item.id === 'upgrades' || item.id === 'research'
  );
  
  const secondaryNavItems = navItems.filter(item => 
    item.id !== 'game' && item.id !== 'upgrades' && item.id !== 'research'
  );
  
  return (
    <>
      {/* Navigation bar */}
      <div className="backdrop-blur-md bg-gradient-to-r from-gray-900/95 via-green-900/95 to-emerald-900/95 text-white mb-4 sticky top-0 z-[9998] shadow-[0_0_15px_rgba(74,222,128,0.3)] border-b border-green-400/20">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-3">
            {/* Left side - Primary navigation items */}
            <div className="flex space-x-1 md:space-x-4">
              {primaryNavItems.map(item => {
                // Hide items when space age is unlocked if specified
                if (item.hideWhenSpaceUnlocked && spaceAgeUnlocked) return null;
                
                return (
                  <button
                    key={item.id}
                    className={`px-2 md:px-3 py-1 rounded-md text-sm md:text-base font-medium transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-[0_0_10px_rgba(250,204,21,0.6)]' 
                        : 'hover:bg-yellow-500/20 text-yellow-300 hover:text-yellow-400'
                    }`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            
            {/* Right side - Secondary navigation and mobile menu button */}
            <div className="flex items-center">
              {/* Desktop view - Show secondary nav items directly */}
              <div className="hidden md:flex md:space-x-4">
                {secondaryNavItems.map(item => {
                  // Hide items when space age is unlocked if specified
                  if (item.hideWhenSpaceUnlocked && spaceAgeUnlocked) return null;
                  
                  // Hide Stock Market tab if it's not unlocked
                  if (item.requireStockUnlock && !stockMarketUnlocked) return null;
                  
                  // Hide Metrics tab if it's not unlocked
                  if (item.requireMetricsUnlock && !metricsUnlocked) return null;
                  
                  // Hide Space Age tab if it's not unlocked
                  if (item.requireSpaceUnlock && !spaceAgeUnlocked) return null;
                  
                  return (
                    <button
                      key={item.id}
                      className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                        currentPage === item.id 
                          ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 font-bold border border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
                          : 'bg-gray-800/50 hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20 border border-gray-700/50 hover:border-green-500/30'
                      }`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      {item.name}
                      {item.id === 'space' && <span className="ml-1 text-blue-300">🚀</span>}
                      {item.id === 'prestige' && <span className="ml-1 text-yellow-300">⭐</span>}
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile view - Menu button and dropdown */}
              <div className="md:hidden relative" ref={mobileMenuRef}>
                <button 
                  className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                
              </div>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown - Outside navigation container */}
      {mobileMenuOpen && (
        <div className="fixed right-4 top-16 w-48 backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.4)] py-1 border border-green-400/30" style={{zIndex: 999999}}>
                    {secondaryNavItems.map(item => {
                      // Hide items when space age is unlocked if specified
                      if (item.hideWhenSpaceUnlocked && spaceAgeUnlocked) return null;
                      
                      // Hide Stock Market tab if it's not unlocked
                      if (item.requireStockUnlock && !stockMarketUnlocked) return null;
                      
                      // Hide Metrics tab if it's not unlocked
                      if (item.requireMetricsUnlock && !metricsUnlocked) return null;
                      
                      // Hide Space Age tab if it's not unlocked
                      if (item.requireSpaceUnlock && !spaceAgeUnlocked) return null;
                      
                      return (
                        <button
                          key={item.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-all duration-200 ${
                            currentPage === item.id 
                              ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 font-bold' 
                              : 'text-green-200 hover:bg-green-500/20 hover:text-green-300'
                          }`}
                          onClick={() => {
                            setCurrentPage(item.id);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {item.name}
                          {item.id === 'space' && <span className="ml-1 text-blue-300">🚀</span>}
                          {item.id === 'prestige' && <span className="ml-1 text-yellow-300">⭐</span>}
                        </button>
                      );
                    })}
                  </div>
              )}
      
      {/* Offline Progress Modal */}
      {showOfflineProgress && offlineProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg p-6 max-w-md w-full mx-4 border border-green-400/30 shadow-[0_0_30px_rgba(74,222,128,0.4)]">
            <h2 className="text-xl font-bold mb-4 text-green-400">While You Were Away</h2>
            <p className="mb-2 text-sm text-green-200/70">
              You were offline for {Math.floor(offlineProgress.offlineTime / 60)} minutes and {offlineProgress.offlineTime % 60} seconds.
            </p>
            
            <div className="space-y-2 my-4">
              {offlineProgress.paperclipsProduced > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Paperclips Produced:</span>
                  <span className="font-medium text-green-400">{Math.floor(offlineProgress.paperclipsProduced)}</span>
                </div>
              )}
              
              {offlineProgress.paperclipsSold > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Paperclips Sold:</span>
                  <span className="font-medium text-green-400">{Math.floor(offlineProgress.paperclipsSold)}</span>
                </div>
              )}
              
              {offlineProgress.salesRevenue > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Revenue Generated:</span>
                  <span className="font-medium text-yellow-500">${offlineProgress.salesRevenue.toFixed(2)}</span>
                </div>
              )}
              
              {offlineProgress.wireUsed > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Wire Used:</span>
                  <span className="font-medium text-green-400">{Math.floor(offlineProgress.wireUsed)}</span>
                </div>
              )}
              
              {offlineProgress.researchPoints > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Research Points Generated:</span>
                  <span className="font-medium text-green-400">{Math.floor(offlineProgress.researchPoints)}</span>
                </div>
              )}
              
              {offlineProgress.stockMarketReturns > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Stock Market Returns:</span>
                  <span className="font-medium text-yellow-500">${offlineProgress.stockMarketReturns.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <button
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300"
              onClick={dismissOfflineProgress}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-emerald-900/20 overflow-visible">
        <div className="container mx-auto overflow-visible">
          {renderPage()}
        </div>
      </div>
    </>
  );
}