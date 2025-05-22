"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, MarketData, Stock, StockHolding } from "@/types/game";
// Import type fixes
import "@/types/typeFixJuly2025";
import { 
  calculateDemand, 
  updateMarketTrend, 
  updateSeasonalMultiplier, 
  calculateSales,
  getDayOfYear
} from "@/utils/marketUtils";
// Import space extension functions
import { addSpaceFunctions } from "./spaceExtension";

// Added types for visual effects and upgrades
interface VisualFX {
  particleIntensity: number;
  clickAnimations: boolean;
  floatingText: boolean;
}

interface SpaceStats {
  speed: number;
  exploration: number;
  selfReplication: number;
  wireProduction: number;
  miningProduction: number;
  factoryProduction: number;
  combat?: number;
  [key: string]: number | undefined; // Allow string indexing
}

interface GameStore extends GameState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  visualFX: VisualFX;
  
  // Production actions
  clickPaperclip: () => void;
  buyAutoclipper: () => void;
  buyClickMultiplier: () => void;
  buyWireSpool: () => void;
  buyAutoWireBuyer: () => void;
  upgradeSpoolSize: () => void;
  unlockMetrics: () => void;
  buyMegaClipper: () => void;
  
  // Market actions
  setClipPrice: (price: number) => void;
  sellPaperclips: () => void;
  updateMarket: () => void;
  getMarketData: () => MarketData;
  upgradeMarketDemand: () => void;
  
  // Research actions
  generateResearchPoints: () => void;
  buyResearch: (id: string) => void;
  
  // Trust actions
  buyTrustUpgrade: (level: number, cost: number) => void;
  buyTrustAbility: (id: string, cost: number) => void;
  unlockedTrustAbilities: string[];
  
  // Stock Market actions
  unlockStockMarket: () => void;
  buyTradingBot: () => void;
  upgradeBotIntelligence: () => void;
  setBotTradingBudget: (amount: number) => void;
  withdrawBotTradingBudget: (amount: number) => void;
  botAutoTrade: () => void;
  investInStockMarket: (amount: number) => void;
  generateStockReturns: () => void;
  getStocks: () => Stock[];
  buyStock: (stockId: string, quantity: number) => void;
  sellStock: (stockId: string, quantity: number) => void;
  updateStockPrices: () => void;
  calculatePortfolioValue: () => number;
  
  // Player Stats actions
  upgradeCPU: () => void;
  upgradeMemory: () => void;
  regenerateMemory: () => void;
  useMemory: (amount: number) => boolean;
  useOps: (amount: number) => boolean;
  
  // Advanced resource upgrades
  buyOpsUpgrade: (id: string, cost: number) => void;
  buyCreativityUpgrade: (id: string, cost: number) => void;
  
  // Space Age
  spaceAgeUnlocked: boolean;
  spaceStats: SpaceStats;
  upgradeStat: (stat: string, cost: number) => void;
  unlockCombat: () => void;
  makeProbe: () => void;
  launchWireHarvester: () => void;
  launchOreHarvester: () => void;
  buildFactory: () => void;
  spaceTick: () => void;
  switchPlanet: (planetIndex: number) => void;
  addYomi: (amount: number) => void;
  toggleAutoBattle: () => void;
  unlockAutoBattle: () => void;
  
  // Game loop
  tick: () => void;
  marketTick: () => void;
  researchTick: () => void;
  stockMarketTick: () => void;
  statsTick: () => void;
  trustTick: () => void;
  opsTick: () => void;
  
  // State setters
  setGameState: (gameState: GameState) => void;
  setUserId: (userId: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  resetGame: () => void;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Visual effects
  setParticleIntensity: (intensity: number) => void;
  toggleClickAnimations: () => void;
  toggleFloatingText: () => void;
}

const useGameStore = create<GameStore>(
  persist(
    (set, get) => ({
      // Add space functions from spaceExtension.ts
      ...addSpaceFunctions(set, get),
      // Resources
      paperclips: 0,
      money: 0, // Start with $0 (changed from $50)
      wire: 1000, // Start with 1000 wire
      yomi: 0, // Yomi resource
      
      // Advanced Resources
      trust: 0,
      trustLevel: 0,
      nextTrustAt: 100000,
      purchasedTrustLevels: [], // Track which trust levels have been purchased
      unlockedTrustAbilities: [], // Track unlocked trust abilities
      ops: 50, // Increased from 10 to 50 (50 OPs per memory)
      opsMax: 50, // Increased from 10 to 50 (50 OPs per memory)
      opsProductionMultiplier: 0.5, // Production multiplier from OPs (halved)
      creativity: 0,
      
      // Space Age
      spaceAgeUnlocked: false,
      spaceStats: {
        speed: 1,
        exploration: 1,
        selfReplication: 1,
        wireProduction: 1,
        miningProduction: 1,
        factoryProduction: 1
      },
      // Space Age Resources
      probes: 0,
      universeExplored: 0,
      wireHarvesters: 0,
      oreHarvesters: 0,
      factories: 0,
      spaceWirePerSecond: 0,
      spaceOrePerSecond: 0,
      spacePaperclipsPerSecond: 0,
      totalSpaceMatter: 6e30, // 6 nonillion available matter
      spaceMatter: 6e30,      // Current available matter
      spaceOre: 0,            // Stored ore
      spaceWire: 0,           // Space wire (different from regular wire)
      // Space Combat
      autoBattleEnabled: false,    // Whether auto-battle is enabled
      autoBattleUnlocked: false,   // Whether auto-battle has been unlocked
      battlesWon: 0,               // Track number of battles won
      battleDifficulty: 1,         // Difficulty multiplier for battles
      
      // OPs Production Multiplier (already defined above)
      creativityUnlocked: false,
      unlockedOpsUpgrades: [],
      unlockedCreativityUpgrades: [],
      // Default costs for upgrades
      upgradeCosts: {
        'parallelProcessing': 15,
        'quantumAlgorithms': 30,
        'neuralOptimization': 50,
        'memoryCompression': 20,
        'cacheOptimization': 35,
        'distributedStorage': 60,
        'marketPrediction': 25,
        'trendAnalysis': 40,
        'highFrequencyTrading': 75
      },
      
      // Unlockable Features
      metricsUnlocked: false,
      
      // Production
      autoclippers: 0,
      autoclipper_cost: 5, // $5 starter price (reduced from $10)
      clicks_per_second: 0,
      clickMultiplier: 1,
      totalClicks: 0,
      totalPaperclipsMade: 0,
      revenuePerSecond: 0,
      productionMultiplier: 1,
      megaClippers: 0,
      megaClipperCost: 5000,
      megaClippersUnlocked: false,
      
      // Wire production
      spoolCost: 5, // $5 per spool
      wirePerSpool: 1000, // 1000 wire per spool
      autoWireBuyer: false,
      autoWireBuyerCost: 100, // $100 for auto wire buyer
      spoolSizeUpgradeCost: 125, // $125 for first spool size upgrade (50% discount)
      spoolSizeLevel: 1, // Starts at level 1
      lastWirePurchaseTime: new Date(),
      wirePurchaseCount: 0, // Count of wire purchases for dynamic pricing
      
      // Market data
      paperclipPrice: 0.25,
      marketDemand: 10,
      paperclipsSold: 0,
      totalSales: 0,
      
      // Market parameters
      basePaperclipPrice: 0.25,
      elasticity: 3,
      marketTrend: 0,
      seasonalMultiplier: 1,
      volatility: 0.15,
      maxDemand: 50,
      minDemand: 1,
      marketDemandLevel: 1,
      marketDemandUpgradeCost: 200,
      
      // Research
      researchPoints: 0,
      researchPointsPerSecond: 0.5, // Base research production (increased from 0.1)
      unlockedResearch: [],
      
      // Stock Market
      stockMarketUnlocked: false,
      tradingBots: 0,
      tradingBotCost: 1000,
      botIntelligence: 1,
      botIntelligenceCost: 1500,
      botTradingBudget: 0,
      botLastTradeTime: new Date(), // Initialize to current time as a fallback
      botTradingProfit: 0, // Initialize total bot trading profit to zero
      botTradingLosses: 0, // Initialize total bot trading losses to zero
      botRiskThreshold: 0.1, // Default to low risk (10% profit threshold)
      stockMarketReturns: 0,
      stockMarketInvestment: 0,
      stockMarketLastUpdate: new Date(),
      stockPortfolio: [],
      stockPriceHistory: {},
      portfolioValue: 0,
      stockTrendData: {},
      
      // Player Stats
      cpuLevel: 1,
      cpuCost: 25, // Reduced to 25% of original cost (was 100)
      memory: 1,
      memoryMax: 1,
      memoryCost: 10, // Reduced to 10% of original cost (was 100)
      memoryRegenRate: 1, // Memory per second
      
      // Operations (OPs) - initially 50 OPs per memory (increased from 10)
      // ops and opsMax already defined above
      
      // Navigation
      currentPage: 'game',
      
      // Meta
      isLoading: true,
      isAuthenticated: false,
      userId: null,
      lastSaved: new Date(),
      lastPriceUpdate: new Date(),
      
      // Visual settings
      visualFX: {
        particleIntensity: 1,
        clickAnimations: true,
        floatingText: true,
      },

      // Click to generate paperclips with multiplier (consumes wire)
      clickPaperclip: () => set((state) => {
        // Check if there's enough wire
        if (state.wire < 1) {
          return state; // Not enough wire
        }
        
        const clipsMade = 1 * state.clickMultiplier;
        
        return { 
          paperclips: state.paperclips + clipsMade,
          wire: state.wire - 1, // Consume 1 wire per paperclip
          totalClicks: state.totalClicks + 1,
          totalPaperclipsMade: state.totalPaperclipsMade + clipsMade
        };
      }),

      // Buy autoclipper upgrade (using money instead of paperclips)
      buyAutoclipper: () => 
        set((state) => {
          // Check if player has enough money
          if (state.money < state.autoclipper_cost) {
            return state;
          }

          const newAutoclippers = state.autoclippers + 1;
          const newMoney = state.money - state.autoclipper_cost;
          
          // Cost increases by 8% for each purchase (reduced from 10%)
          const newCost = Math.floor(state.autoclipper_cost * 1.08 * 100) / 100;
          
          // Each autoclipper produces 1 paperclip per second (affected by total production multiplier)
          const totalMultiplier = state.productionMultiplier + (state.opsProductionMultiplier || 0);
          const newClicksPerSecond = newAutoclippers * 1 * totalMultiplier;
          
          // Check if we should unlock Mega-Clippers at 100 autoclippers
          const megaClippersUnlocked = newAutoclippers >= 100 ? true : state.megaClippersUnlocked;
          
          console.log("Buying autoclipper:");
          console.log("- Current money:", state.money);
          console.log("- Cost:", state.autoclipper_cost);
          console.log("- New money:", newMoney);
          console.log("- Base multiplier:", state.productionMultiplier.toFixed(1));
          console.log("- OPs bonus:", (state.opsProductionMultiplier || 0).toFixed(1));
          console.log("- Total multiplier:", totalMultiplier.toFixed(1));
          console.log("- New production rate:", newClicksPerSecond.toFixed(1));
          
          if (newAutoclippers === 100) {
            console.log("Mega-Clippers UNLOCKED at 100 autoclippers!");
          }

          // Return the updated state
          return {
            money: newMoney,
            autoclippers: newAutoclippers,
            autoclipper_cost: newCost,
            clicks_per_second: newClicksPerSecond,
            megaClippersUnlocked
          };
        }),
        
      // Buy Mega-Clipper upgrade
      buyMegaClipper: () => {
        // First check if we have enough money before any side effects
        const state = get();
        if (!state.megaClippersUnlocked) {
          console.log(`Cannot buy Mega-Clipper: Not unlocked yet`);
          return;
        }
        
        if (state.money < state.megaClipperCost) {
          console.log(`Cannot buy Mega-Clipper: Not enough money. Have $${state.money.toFixed(2)}, need $${state.megaClipperCost.toFixed(2)}`);
          return;
        }
        
        // Calculate new values
        const newMegaClippers = state.megaClippers + 1;
        const newMoney = state.money - state.megaClipperCost;
        
        // Cost increases by 15% for each purchase
        const newCost = Math.floor(state.megaClipperCost * 1.15 * 100) / 100;
        
        // Each mega clipper adds +5.0 to the production multiplier (increased from 1.0)
        const newProductionMultiplier = Math.max(0.1, state.productionMultiplier + 5.0);
        
        // Recalculate production rate, including OPs production multiplier
        const totalMultiplier = newProductionMultiplier + (state.opsProductionMultiplier || 0);
        const newClicksPerSecond = state.autoclippers * 1 * totalMultiplier;
        
        console.log("Buying Mega-Clipper:");
        console.log("- New base production multiplier:", newProductionMultiplier.toFixed(1));
        console.log("- Total multiplier with OPs bonus:", totalMultiplier.toFixed(1));
        console.log("- New production rate:", newClicksPerSecond.toFixed(1));
        
        // Update state with new values
        set({
          money: newMoney,
          megaClippers: newMegaClippers,
          megaClipperCost: newCost,
          productionMultiplier: newProductionMultiplier,
          clicks_per_second: newClicksPerSecond
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        console.log(`Mega-Clipper purchase verified: Count ${updatedState.megaClippers}, Cost: $${updatedState.megaClipperCost}, Production Multiplier: ${updatedState.productionMultiplier}`);
        
        // Force an immediate save to the database after buying Mega-Clipper
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            console.log('Attempting to save after Mega-Clipper purchase');
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              console.error('Cannot save game: window is undefined (server-side context)');
              return;
            }
            
            console.log('window exists:', !!window);
            console.log('window.saveGameNow exists:', !!window.saveGameNow);
            console.log('window.saveGameNow type:', typeof window.saveGameNow);
            
            if (typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after Mega-Clipper purchase');
              window.saveGameNow()
                .then(() => console.log('Mega-Clipper purchase save completed successfully'))
                .catch(saveErr => console.error('Error during Mega-Clipper purchase save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function');
              
              // Attempt to save using the save interval as a fallback
              console.log('Attempting to trigger a manual save event');
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingMegaClipperSave', 'true');
                console.log('Set pendingMegaClipperSave flag in localStorage');
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after Mega-Clipper purchase:', err);
          }
        }, 250); // Increased timeout to 250ms for more reliability
      },
        
      // Buy click multiplier upgrade (using money instead of paperclips)
      buyClickMultiplier: () => 
        set((state) => {
          const multiplierCost = Math.floor(50 * Math.pow(2, state.clickMultiplier - 1));
          
          // Check if player has enough money
          if (state.money < multiplierCost) {
            return state;
          }
          
          return {
            money: state.money - multiplierCost,
            clickMultiplier: state.clickMultiplier + 1,
          };
        }),
      
      // Set the paperclip price (player controlled)
      setClipPrice: (price: number) => 
        set((state) => {
          // Ensure price isn't negative or unreasonably high
          const safePrice = Math.max(0.01, Math.min(price, 1));
          return { paperclipPrice: safePrice };
        }),
      
      // Sell paperclips based on current demand and price
      sellPaperclips: () => 
        set((state) => {
          // Calculate current demand based on price and market conditions
          const demand = calculateDemand(
            state.paperclipPrice,
            state.basePaperclipPrice,
            state.maxDemand,
            state.elasticity,
            state.minDemand,
            state.marketTrend,
            state.seasonalMultiplier,
            state.volatility,
            state.marketDemandLevel
          );
          
          // Calculate how many can actually be sold
          const clipsSold = calculateSales(demand, state.paperclips);
          
          if (clipsSold <= 0) {
            return state;
          }
          
          // Calculate revenue
          const revenue = clipsSold * state.paperclipPrice;
          
          // Calculate revenue per second (10 ticks per second)
          const revenuePerSecond = revenue * 10;
          
          // Log the money update
          console.log("Current money:", state.money);
          console.log("Revenue from sales:", revenue);
          console.log("New money total:", state.money + revenue);
          console.log("Revenue per second:", revenuePerSecond);
          
          return {
            paperclips: state.paperclips - clipsSold,
            money: state.money + revenue,
            paperclipsSold: state.paperclipsSold + clipsSold,
            totalSales: state.totalSales + revenue,
            marketDemand: demand,
            revenuePerSecond: revenuePerSecond
          };
        }),
        
      // Get current market data for display
      getMarketData: () => {
        const state = get();
        return {
          currentPrice: state.paperclipPrice,
          currentDemand: state.marketDemand,
          trend: state.marketTrend,
          seasonal: state.seasonalMultiplier
        };
      },
      
      // Update market conditions (called periodically)
      updateMarket: () => 
        set((state) => {
          const newTrend = updateMarketTrend(state.marketTrend);
          const newSeasonal = updateSeasonalMultiplier(getDayOfYear());
          
          return {
            marketTrend: newTrend,
            seasonalMultiplier: newSeasonal,
            lastPriceUpdate: new Date()
          };
        }),
        
      // Upgrade market demand to increase maximum demand and unlock $1.00 pricing
      upgradeMarketDemand: () =>
        set((state) => {
          // Check if player has enough money
          if (state.money < state.marketDemandUpgradeCost) {
            return state;
          }
          
          const newLevel = state.marketDemandLevel + 1;
          
          // Each level increases max demand by 20%
          const demandIncrease = 1.2;
          const newMaxDemand = Math.floor(state.maxDemand * demandIncrease);
          
          // Cost increases exponentially: cost * (1.8 ^ level)
          const newCost = Math.floor(state.marketDemandUpgradeCost * 1.8);
          
          console.log("Upgrading market demand:");
          console.log("- New max demand:", newMaxDemand);
          console.log("- New demand level:", newLevel);
          console.log("- New upgrade cost:", newCost);
          
          // Add special messages for notable market demand levels
          if (newLevel === 5) {
            console.log("MARKET MILESTONE: Limited sales at $1.00 now possible (1 clip/sec)");
          } else if (newLevel === 10) {
            console.log("MARKET MILESTONE: Medium-scale sales at $1.00 now possible (100 clips/sec)");
          } else if (newLevel === 15) {
            console.log("MARKET MILESTONE: Large-scale sales at $1.00 now possible (1,000 clips/sec)");
          } else if (newLevel === 20) {
            console.log("MARKET MILESTONE: Mass production at $1.00 now possible (10,000 clips/sec)");
          }
          
          return {
            money: state.money - state.marketDemandUpgradeCost,
            maxDemand: newMaxDemand,
            marketDemandLevel: newLevel,
            marketDemandUpgradeCost: newCost
          };
        }),

      // Production tick - generates paperclips (consumes wire)
      tick: () => 
        set((state) => {
          // First handle auto wire buying if enabled and wire is low
          let updatedState = { ...state };
          
          // Auto wire buyer: buy wire when below 10% capacity
          if (state.autoWireBuyer && state.wire < state.wirePerSpool * 0.1 && state.money >= state.spoolCost) {
            // Update purchase count and time for dynamic pricing - same logic as buyWireSpool
            const now = new Date();
            const timeSinceLastPurchase = now.getTime() - state.lastWirePurchaseTime.getTime();
            const newWirePurchaseCount = state.wirePurchaseCount + 1;
            
            // Dynamic pricing: Increase cost based on frequency of purchases
            // Decays over time (5 minute cooldown)
            const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
            const purchaseCountFactor = Math.min(1, newWirePurchaseCount / 10); // Maxes out after 10 purchases
            
            // Calculate new cost with minimum of base cost and maximum of $250
            const baseCost = 5 * state.spoolSizeLevel;
            const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50;
            const newCost = Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
            
            console.log(`Auto-wire purchased: Count=${newWirePurchaseCount}, Time factor=${frequencyFactor.toFixed(2)}, New cost=$${newCost.toFixed(2)}`);
            
            updatedState = {
              ...updatedState,
              money: state.money - state.spoolCost,
              wire: state.wire + state.wirePerSpool,
              spoolCost: newCost,
              wirePurchaseCount: newWirePurchaseCount,
              lastWirePurchaseTime: now
            };
          }
          
          if (state.clicks_per_second <= 0) {
            return updatedState;
          }

          // Calculate how many paperclips could be produced in this tick
          // Apply production multiplier (base + OPs bonus) to the base rate
          const totalMultiplier = state.productionMultiplier + (state.opsProductionMultiplier || 0);
          const potentialProduction = (state.clicks_per_second * totalMultiplier) / 10;
          
          // Check if there's enough wire
          if (updatedState.wire <= 0) {
            return updatedState; // No wire available
          }
          
          // Calculate actual production based on available wire
          const actualProduction = Math.min(potentialProduction, updatedState.wire);
          
          // Update resources
          return { 
            ...updatedState,
            paperclips: updatedState.paperclips + actualProduction,
            wire: updatedState.wire - actualProduction,
            totalPaperclipsMade: updatedState.totalPaperclipsMade + actualProduction
          };
        }),
        
      // Buy a spool of wire (with dynamic pricing)
      buyWireSpool: () =>
        set((state) => {
          // Check if player has enough money
          if (state.money < state.spoolCost) {
            return state;
          }
          
          // Update purchase count and time for dynamic pricing
          const now = new Date();
          const timeSinceLastPurchase = now.getTime() - state.lastWirePurchaseTime.getTime();
          const newWirePurchaseCount = state.wirePurchaseCount + 1;
          
          // Dynamic pricing: Increase cost based on frequency of purchases
          // Decays over time (5 minute cooldown)
          const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
          const purchaseCountFactor = Math.min(1, newWirePurchaseCount / 10); // Maxes out after 10 purchases (was 20)
          
          // Calculate new cost with minimum of base cost and maximum of $250
          const baseCost = 5 * state.spoolSizeLevel;
          const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50; // Up to $50 additional cost (was $20)
          const newCost = Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
          
          console.log(`Wire purchased: Count=${newWirePurchaseCount}, Time factor=${frequencyFactor.toFixed(2)}, New cost=$${newCost.toFixed(2)}`);
          
          return {
            money: state.money - state.spoolCost,
            wire: state.wire + state.wirePerSpool,
            spoolCost: newCost,
            wirePurchaseCount: newWirePurchaseCount,
            lastWirePurchaseTime: now
          };
        }),
        
      // Buy auto wire buyer upgrade
      buyAutoWireBuyer: () =>
        set((state) => {
          // Check if player has enough money
          if (state.money < state.autoWireBuyerCost || state.autoWireBuyer) {
            return state;
          }
          
          return {
            money: state.money - state.autoWireBuyerCost,
            autoWireBuyer: true
          };
        }),
        
      // Upgrade spool size - increases wire per spool
      upgradeSpoolSize: () =>
        set((state) => {
          // Check if player has enough money
          if (state.money < state.spoolSizeUpgradeCost) {
            return state;
          }
          
          const newLevel = state.spoolSizeLevel + 1;
          // Each level increases wire per spool by 500% (instead of 50%)
          const newWirePerSpool = Math.floor(state.wirePerSpool * 6.0); // 500% increase = 6x multiplier
          // Cost increases exponentially: cost * (level * 1.2)
          // Original calculation would be: Math.floor(state.spoolSizeUpgradeCost * (newLevel * 1.2))
          // 50% discount applied to the formula
          const newCost = Math.floor(state.spoolSizeUpgradeCost * (newLevel * 1.2) * 0.5);
          
          console.log(`Upgrading spool size: Level ${state.spoolSizeLevel} -> ${newLevel}`);
          console.log(`Wire per spool: ${state.wirePerSpool} -> ${newWirePerSpool}`);
          console.log(`Next upgrade cost: $${newCost}`);
          
          return {
            money: state.money - state.spoolSizeUpgradeCost,
            spoolSizeLevel: newLevel,
            wirePerSpool: newWirePerSpool,
            spoolSizeUpgradeCost: newCost
          };
        }),
        
      // Unlock metrics dashboard for $500
      unlockMetrics: () =>
        set((state) => {
          // Check if player has enough money and metrics not already unlocked
          if (state.money < 500 || state.metricsUnlocked) {
            return state;
          }
          
          console.log("Unlocking metrics for $500");
          
          return {
            money: state.money - 500,
            metricsUnlocked: true
          };
        }),
        
      // Trust upgrades and abilities are initialized at store creation time
      
      // Buy a trust upgrade (converts money to trust) - one-time purchase per level
      buyTrustUpgrade: (level: number, cost: number) => {
        // First check if we can buy before making any state changes
        const state = get();
        
        // Extra debug information
        console.log(`==== TRUST UPGRADE ATTEMPT ====`);
        console.log(`Trust level: ${level}, Cost: $${cost.toFixed(2)}`);
        console.log(`Current money: $${state.money.toFixed(2)}`);
        console.log(`Current purchasedTrustLevels:`, state.purchasedTrustLevels);
        
        // Validate money amount
        if (state.money < cost) {
          console.log(`Not enough money to buy trust level ${level}. Have: $${state.money.toFixed(2)}, Need: $${cost.toFixed(2)}`);
          return;
        }
        
        // Check if this level has already been purchased - with more robust checking
        // Convert to strings for comparison to be safe
        const purchasedLevelsStr = state.purchasedTrustLevels.map(l => String(l));
        const levelStr = String(level);
        
        if (state.purchasedTrustLevels.includes(level) || purchasedLevelsStr.includes(levelStr)) {
          console.log(`Trust level ${level} already purchased - ABORTING PURCHASE`);
          console.log(`Current purchased levels:`, state.purchasedTrustLevels);
          console.log(`As strings:`, purchasedLevelsStr);
          return;
        }
        
        // Calculate trust to gain based on level (5 * level)
        const trustGain = 5 * level;
        
        console.log(`Buying trust upgrade level ${level} for $${cost.toFixed(2)}`);
        console.log(`Gaining ${trustGain} trust points`);
        
        // Create a new array to ensure the reference changes, explicitly storing as number
        const levelAsNumber = Number(level);
        const newPurchasedLevels = [...state.purchasedTrustLevels, levelAsNumber];
        console.log(`New purchasedTrustLevels:`, newPurchasedLevels);
        console.log(`Types of items:`, newPurchasedLevels.map(l => typeof l));
        
        // Update state
        set({
          money: state.money - cost,
          trust: state.trust + trustGain,
          purchasedTrustLevels: newPurchasedLevels
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        console.log(`State after update - purchasedTrustLevels:`, updatedState.purchasedTrustLevels);
        console.log(`Verifying level ${level} was added:`, updatedState.purchasedTrustLevels.includes(level));
        
        // Force an immediate save after updating state
        console.log("Forcing immediate save after trust purchase");
        if (typeof window !== 'undefined' && window.saveGameNow) {
          window.saveGameNow();
        } else {
          console.warn("window.saveGameNow is not available!");
        }
      },
        
      // Buy a trust ability (uses trust points)
      buyTrustAbility: (id: string, cost: number) => {
        // First check if we can buy before making any state changes
        const state = get();
        
        // Extra debug information
        console.log(`==== TRUST ABILITY PURCHASE ATTEMPT ====`);
        console.log(`Ability ID: ${id}, Cost: ${cost} trust points`);
        console.log(`Current trust: ${state.trust}`);
        console.log(`Current unlockedTrustAbilities:`, state.unlockedTrustAbilities);
        
        // Check if already unlocked
        if (state.unlockedTrustAbilities.includes(id)) {
          console.log(`Trust ability ${id} already unlocked - ABORTING PURCHASE`);
          return;
        }
        
        // Check if player has enough trust
        if (state.trust < cost) {
          console.log(`Not enough trust to buy ability ${id}. Have: ${state.trust}, Need: ${cost}`);
          return;
        }
        
        console.log(`Buying trust ability ${id} for ${cost} trust points`);
        
        // Create a new array to ensure the reference changes
        const newUnlockedAbilities = [...state.unlockedTrustAbilities, id];
        console.log(`New unlockedTrustAbilities:`, newUnlockedAbilities);
        
        // Apply ability effects
        let updatedState: Partial<GameState> = {
          trust: state.trust - cost,
          unlockedTrustAbilities: newUnlockedAbilities
        };
          
          // Different effects based on the ability ID
          switch (id) {
            case 'trustBoost':
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 2.0);
              break;
            case 'wireEfficiency':
              // Each wire produces more paperclips (500% increase)
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 6.0); // 1.0 + 5.0 = 6.0 (500% increase)
              console.log(`Wire Efficiency upgrade: Production multiplier ${state.productionMultiplier} -> ${state.productionMultiplier * 6.0} (500% increase)`);
              break;
            case 'marketInfluence':
              updatedState.marketDemand = state.marketDemand * 50.0; // Increased from 2.0x to 50.0x (5000%)
              updatedState.maxDemand = state.maxDemand * 50.0; // Increased from 1.5x to 50.0x (5000%)
              console.log(`Market Influence upgrade: Demand ${state.marketDemand} -> ${state.marketDemand * 50}, Max Demand ${state.maxDemand} -> ${state.maxDemand * 50}`);
              break;
            case 'researchInsight':
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 3.0;
              break;
            case 'autoManagement':
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 6.0); // 1.0 + 5.0 = 6.0 (500% increase)
              updatedState.memoryRegenRate = state.memoryRegenRate * 4.0; // Quadruple memory regen
              console.log(`Auto Management upgrade: Production multiplier ${state.productionMultiplier} -> ${state.productionMultiplier * 6.0} (500% increase)`);
              console.log(`Auto Management upgrade: Memory regen ${state.memoryRegenRate} -> ${state.memoryRegenRate * 4.0} (quadrupled)`);
              break;
            case 'quantumComputation':
              updatedState.cpuLevel = state.cpuLevel * 2;
              updatedState.memoryMax = state.memoryMax * 2;
              // Update OPs max based on new memory (50 OPs per memory)
              updatedState.opsMax = (state.memoryMax * 2) * 50;
              break;
          }
          
          console.log(`Purchased trust ability: ${id} for ${cost} trust points`);
          
          // Special handling for Space Age upgrade
          if (id === 'spaceAge') {
            updatedState.spaceAgeUnlocked = true;
            console.log("Space Age unlocked!");
          }
          
          // Update state
          set(updatedState);
          
          // Verify state was updated correctly
          const verifyState = get();
          console.log(`State after update - unlockedTrustAbilities:`, verifyState.unlockedTrustAbilities);
          console.log(`Verifying ability ${id} was added:`, verifyState.unlockedTrustAbilities.includes(id));
          
          // Force an immediate save after updating state
          console.log("Forcing immediate save after trust ability purchase");
          if (typeof window !== 'undefined' && window.saveGameNow) {
            window.saveGameNow();
          } else {
            console.warn("window.saveGameNow is not available!");
          }
          
          return;
      },
        
      // Upgrade space stat
      upgradeStat: (stat: string, cost: number) => 
        set((state) => {
          // Skip if space age not unlocked
          if (!state.spaceAgeUnlocked) {
            return state;
          }
          
          // Check if player has enough trust
          if (state.trust < cost) {
            return state;
          }
          
          // Get current stat value
          const currentValue = state.spaceStats[stat] || 1;
          
          // Create new space stats object with updated stat
          const newSpaceStats = {
            ...state.spaceStats,
            [stat]: currentValue + 1
          };
          
          console.log(`Upgraded space stat: ${stat} to level ${currentValue + 1} for ${cost} trust`);
          
          return {
            trust: state.trust - cost,
            spaceStats: newSpaceStats
          };
        }),
        
      // Unlock combat with OPs
      unlockCombat: () => 
        set((state) => {
          // Skip if combat already unlocked or space age not unlocked
          if (state.spaceStats.combat || !state.spaceAgeUnlocked) {
            return state;
          }
          
          // Check if player has enough OPs
          if (state.ops < 50000) {
            return state;
          }
          
          // Create new space stats object with combat unlocked
          const newSpaceStats = {
            ...state.spaceStats,
            combat: 1
          };
          
          console.log(`Unlocked combat capability for 50,000 OPs`);
          
          return {
            ops: state.ops - 50000,
            spaceStats: newSpaceStats
          };
        }),

      // Market tick - automatically sells paperclips based on demand
      marketTick: () => {
        const state = get();
        
        // Only run market tick every 10 game ticks (about once per second)
        const now = new Date();
        const lastUpdate = state.lastPriceUpdate || new Date(0);
        
        if (now.getTime() - lastUpdate.getTime() >= 1000) {
          // Log money value every market tick
          console.log("Money before market tick:", state.money);
          
          // Update market conditions every 60 seconds
          if (now.getTime() - lastUpdate.getTime() >= 60000) {
            get().updateMarket();
          }
          
          // Automatically sell paperclips
          get().sellPaperclips();
          
          // Log money value after market actions
          const newState = get();
          console.log("Money after market tick:", newState.money);
        }
      },

      // Game state management functions
      setGameState: (gameState: GameState) => set(() => ({ ...gameState })),
      setUserId: (userId: string | null) => set(() => ({ userId })),
      setAuthenticated: (isAuthenticated: boolean) => set(() => ({ isAuthenticated })),
      setLoading: (isLoading: boolean) => set(() => ({ isLoading })),

      // Visual effect settings
      setParticleIntensity: (intensity: number) => 
        set((state) => ({ 
          visualFX: { 
            ...state.visualFX, 
            particleIntensity: intensity 
          } 
        })),
        
      toggleClickAnimations: () => 
        set((state) => ({ 
          visualFX: { 
            ...state.visualFX, 
            clickAnimations: !state.visualFX.clickAnimations 
          } 
        })),
        
      toggleFloatingText: () => 
        set((state) => ({ 
          visualFX: { 
            ...state.visualFX, 
            floatingText: !state.visualFX.floatingText 
          } 
        })),
        
      // Navigation
      setCurrentPage: (page: string) => 
        set(() => ({ currentPage: page })),
        
      // Research methods
      generateResearchPoints: () => 
        set((state) => ({
          // Divide by 10 since this runs 10 times per second
          researchPoints: state.researchPoints + (state.researchPointsPerSecond / 10)
        })),
        
      buyResearch: (id: string) => 
        set((state) => {
          // Skip if already unlocked
          if (state.unlockedResearch.includes(id)) {
            return state;
          }
          
          // Research costs are defined here
          const researchCosts: Record<string, number> = {
            // Basic research
            'efficiency': 100,
            'automation': 200,
            'marketing': 300,
            'wireProduction': 400,
            'advancedClippers': 500,
            'stockMarket': 1000,
            
            // Advanced market research
            'demandAnalytics': 1500,
            'globalMarketing': 2000,
            'marketPsychology': 3000,
            'viralCampaign': 4000,
            
            // Advanced production research
            'nanotechnology': 2500,
            'quantumEfficiency': 3500,
            'selfOptimization': 5000,
            'swarmProduction': 6000,
            
            // Advanced resource research
            'materialScience': 2000,
            'microAlloys': 3000,
            'wireRecycling': 4000,
            
            // Advanced intelligence research
            'enhancedLearning': 1500,
            'deepThinking': 3000,
            'computerVision': 4500,
            'creativityEngine': 5500,
            
            // Special projects
            'trustProject': 10000,
            'quantumComputing': 15000
          };
          
          const cost = researchCosts[id] || 0;
          
          // Check if player has enough research points
          if (state.researchPoints < cost) {
            return state;
          }
          
          // Apply research effects
          let updatedState: Partial<GameState> = {
            researchPoints: state.researchPoints - cost,
            unlockedResearch: [...state.unlockedResearch, id]
          };
          
          // Special handling for specific research
          switch (id) {
            // Basic research
            case 'efficiency':
              updatedState.clickMultiplier = state.clickMultiplier + 1;
              break;
            case 'automation':
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 1.5;
              break;
            case 'marketing':
              updatedState.basePaperclipPrice = state.basePaperclipPrice * 1.2;
              break;
            case 'wireProduction':
              updatedState.wirePerSpool = state.wirePerSpool * 1.5;
              break;
            case 'advancedClippers':
              updatedState.clicks_per_second = state.clicks_per_second * 1.25;
              break;
            case 'stockMarket':
              updatedState.stockMarketUnlocked = true;
              break;
              
            // Advanced market research
            case 'demandAnalytics':
              updatedState.marketDemand = state.marketDemand * 1.5;
              updatedState.maxDemand = state.maxDemand * 1.3;
              break;
            case 'globalMarketing':
              updatedState.basePaperclipPrice = state.basePaperclipPrice * 1.4;
              updatedState.marketDemandLevel = state.marketDemandLevel + 1;
              break;
            case 'marketPsychology':
              updatedState.elasticity = Math.max(1, state.elasticity * 0.7); // Lower elasticity means less price sensitivity
              updatedState.volatility = Math.max(0.05, state.volatility * 0.8); // Reduce market volatility
              break;
            case 'viralCampaign':
              updatedState.marketDemand = state.marketDemand * 2.0;
              updatedState.maxDemand = state.maxDemand * 2.0;
              updatedState.elasticity = Math.max(1, state.elasticity * 0.6);
              break;
              
            // Advanced production research
            case 'nanotechnology':
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 1.5);
              break;
            case 'quantumEfficiency':
              updatedState.clicks_per_second = state.clicks_per_second * 1.75;
              updatedState.clickMultiplier = state.clickMultiplier + 3;
              break;
            case 'selfOptimization':
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 2.0);
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 1.5;
              break;
            case 'swarmProduction':
              updatedState.clicks_per_second = state.clicks_per_second * 3.0;
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 1.25);
              break;
              
            // Advanced resource research
            case 'materialScience':
              updatedState.wirePerSpool = state.wirePerSpool * 2.0;
              break;
            case 'microAlloys':
              // Make each wire produce 2 paperclips
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 1.3);
              updatedState.wirePerSpool = state.wirePerSpool * 1.5;
              break;
            case 'wireRecycling':
              // Each paperclip has a chance to not consume wire
              updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 1.8);
              break;
              
            // Advanced intelligence research
            case 'enhancedLearning':
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 2.0;
              break;
            case 'deepThinking':
              updatedState.cpuLevel = state.cpuLevel + 2;
              updatedState.memoryMax = state.memoryMax + 2;
              updatedState.ops = Math.min(state.opsMax, state.ops + 50); // Increased from 10 to 50
              break;
            case 'computerVision':
              // Equivalent to having more trading bots
              updatedState.botIntelligence = state.botIntelligence + 2;
              updatedState.tradingBots = state.tradingBots + 1;
              break;
            case 'creativityEngine':
              // Unlocks and boosts creativity
              updatedState.creativityUnlocked = true;
              updatedState.creativity = state.creativity + 5;
              break;
              
            // Special projects
            case 'trustProject':
              // Major trust boost
              updatedState.trust = state.trust + 10;
              updatedState.trustLevel = state.trustLevel + 1;
              break;
            case 'quantumComputing':
              // Massive boost to multiple systems
              updatedState.cpuLevel = state.cpuLevel * 2;
              updatedState.memoryMax = state.memoryMax * 2;
              // Update OPs max based on new memory value (50 OPs per memory)
              updatedState.opsMax = (state.memoryMax * 2) * 50;
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 3;
              updatedState.creativityUnlocked = true;
              break;
          }
          
          return updatedState;
        }),
      
      // Research tick - generates research points
      researchTick: () => {
        get().generateResearchPoints();
      },
      
      // Stock Market methods
      unlockStockMarket: () => 
        set((state) => {
          // Check if player has enough money to unlock
          if (state.money < 50000) {
            return state;
          }
          
          return {
            money: state.money - 50000,
            stockMarketUnlocked: true
          };
        }),
        
      buyTradingBot: () => 
        set((state) => {
          // Check if player has enough money
          if (state.money < state.tradingBotCost) {
            return state;
          }
          
          const newBots = state.tradingBots + 1;
          // Each bot increases cost by 25%
          const newCost = Math.floor(state.tradingBotCost * 1.25 * 100) / 100;
          
          return {
            money: state.money - state.tradingBotCost,
            tradingBots: newBots,
            tradingBotCost: newCost
          };
        }),
        
      upgradeBotIntelligence: () =>
        set((state) => {
          // Check if player has enough money
          if (state.money < state.botIntelligenceCost) {
            return state;
          }
          
          // Ensure current intelligence is at least 1
          const currentIntelligence = Math.max(1, Number(state.botIntelligence || 1));
          
          // Greatly enhanced intelligence gain - adds multiple levels at once based on current level
          // At level 1: +2 levels (to 3)
          // At level 5: +3 levels (to 8)
          // At level 10: +4 levels (to 14)
          const intelligenceBoost = 1 + Math.floor(currentIntelligence / 5);
          const newIntelligence = currentIntelligence + intelligenceBoost;
          
          // Each level increases cost by 80%, but the cost is reduced for bulk upgrades
          const costMultiplier = 1.8 * (0.8 + (0.2 / intelligenceBoost)); // Discount for larger boosts
          const newCost = Math.floor(state.botIntelligenceCost * costMultiplier * 100) / 100;
          
          console.log(`STORE: Upgrading bot intelligence from ${currentIntelligence} to ${newIntelligence} (+${intelligenceBoost} levels)`);
          console.log(`STORE: Raw store value before: ${state.botIntelligence}`);
          console.log(`STORE: New cost will be: $${newCost.toFixed(2)}`);
          
          console.log(`Massive intelligence upgrade: Level ${currentIntelligence} -> ${newIntelligence} (+${intelligenceBoost} levels)`);
          console.log(`New upgrade cost: $${newCost.toFixed(2)}`);
          console.log(`This significantly improves trading performance and stock evaluation accuracy!`);
          
          return {
            money: state.money - state.botIntelligenceCost,
            botIntelligence: newIntelligence,
            botIntelligenceCost: newCost
          };
        }),
        
      setBotTradingBudget: (amount: number) =>
        set((state) => {
          // Validate inputs
          const safeAmount = Math.max(0, Number(amount) || 0);
          
          // Check if player has enough money and amount is valid
          if (state.money < safeAmount || safeAmount <= 0) {
            console.log(`Invalid amount for bot trading budget: ${amount} (parsed as ${safeAmount})`);
            return state;
          }
          
          console.log(`Setting bot trading budget: $${state.botTradingBudget} -> $${state.botTradingBudget + safeAmount}`);
          
          // Ensure botLastTradeTime is valid
          const safeLastTradeTime = state.botLastTradeTime instanceof Date && !isNaN(state.botLastTradeTime.getTime())
            ? state.botLastTradeTime
            : new Date(0); // Use a past date to ensure first trade happens immediately
            
          return {
            money: state.money - safeAmount,
            botTradingBudget: state.botTradingBudget + safeAmount,
            botLastTradeTime: safeLastTradeTime
          };
        }),
        
      withdrawBotTradingBudget: (amount: number) =>
        set((state) => {
          // Validate inputs
          const safeAmount = Math.max(0, Number(amount) || 0);
          
          // Check if bot budget has enough and amount is valid
          if (state.botTradingBudget < safeAmount || safeAmount <= 0) {
            console.log(`Invalid amount for bot trading budget withdrawal: ${amount} (parsed as ${safeAmount})`);
            return state;
          }
          
          console.log(`Withdrawing from bot trading budget: $${state.botTradingBudget} -> $${state.botTradingBudget - safeAmount}`);
          
          return {
            money: state.money + safeAmount,
            botTradingBudget: state.botTradingBudget - safeAmount
          };
        }),
        
      // Set the risk threshold for trading bots (0.1=10%, 0.2=20%, 0.3=30%)
      setBotRiskThreshold: (threshold: number) =>
        set((state) => {
          // Validate inputs - ensure threshold is between 0.1 and 0.3
          const safeThreshold = Math.max(0.1, Math.min(0.3, Number(threshold) || 0.1));
          
          console.log(`Setting bot risk threshold: ${state.botRiskThreshold} -> ${safeThreshold}`);
          
          return {
            botRiskThreshold: safeThreshold
          };
        }),
        
      botAutoTrade: () =>
        set((state) => {
          // Attempt to use the enhanced trading algorithm from the separate module
          let useAdvancedAlgorithm = false;
          let tradingAlgorithm;
          
          try {
            // Check if the enhanced trading algorithm is available
            // This is for backward compatibility and graceful degradation
            tradingAlgorithm = require('./tradingBotAlgorithm');
            useAdvancedAlgorithm = true;
            console.log("Using enhanced trading algorithm");
          } catch (error) {
            console.log("Enhanced trading algorithm not available, using fallback");
            useAdvancedAlgorithm = false;
          }
          
          // Log the current state for debugging
          console.log(`Bot auto trade check - Bots: ${state.tradingBots}, Intelligence: ${state.botIntelligence}, Budget: $${state.botTradingBudget.toFixed(2)}`);
          
          // Skip if no trading bots, no intelligence, or no budget
          if (state.tradingBots <= 0 || state.botIntelligence <= 0 || state.botTradingBudget <= 0) {
            console.log("Bot trading skipped: missing bots, intelligence, or budget");
            return state;
          }
          
          // Reduce minimum budget requirement to $10 for more frequent trades
          if (state.botTradingBudget < 10) {
            console.log(`Bot trading budget too low for meaningful trades: $${state.botTradingBudget.toFixed(2)}`);
            return state;
          }
          
          const now = new Date();
          
          // Ensure lastTrade is a proper Date object (for backwards compatibility)
          try {
            if (!(state.botLastTradeTime instanceof Date)) {
              console.log("Converting botLastTradeTime to Date object");
              state.botLastTradeTime = new Date(state.botLastTradeTime || now);
            }
          } catch (err) {
            console.error("Error parsing botLastTradeTime:", err);
          }
          
          // Number of trades to execute in this tick depends on number of bots
          // Each bot can make one trade per tick (no longer limited by time)
          const tradesPerTick = state.tradingBots;
          
          // Track state changes across multiple trades
          let updatedState = { ...state };
          
          // Get current stocks for this trading round
          const stocks = get().getStocks();
          if (stocks.length === 0) return state;
          
          // Execute multiple trades based on number of bots
          // More bots = more trades per tick
          for (let tradeIndex = 0; tradeIndex < tradesPerTick; tradeIndex++) {
            // Skip further trades if budget is depleted
            if (updatedState.botTradingBudget <= 0) {
              console.log(`Stopping trading: Bot trading budget depleted after ${tradeIndex} trades`);
              break;
            }
            
            // Log trading activity if multiple bots
            if (state.tradingBots > 1 && tradeIndex === 0) {
              console.log(`Executing ${tradesPerTick} bot trades (${state.tradingBots} trading bots active)`);
            }
          
            // For this trade iteration, use the current updated state
            // This way each bot's trade affects the next bot's decisions
            const portfolio = [...updatedState.stockPortfolio];
            
            // Calculate how much budget to use per trade (scale with bot intelligence)
            // More intelligence = more efficient use of budget and larger trade sizes
            // Increased trade size to ensure bots can buy stocks
            const maxPercentPerTrade = 0.2 + (updatedState.botIntelligence * 0.05); // 20% base + 5% per intelligence level (up to 70%)
            const intelligenceScaling = Math.max(1, Math.pow(updatedState.botIntelligence, 1.5)); // Ensure minimum scaling of 1
            
            // Use a higher percentage of the budget for trades to ensure bots can buy at least one share
            const baseTradeAmount = Math.min(
              updatedState.botTradingBudget * maxPercentPerTrade, // Up to 70% of budget per trade with high intelligence
              Math.max(100, 1000 * intelligenceScaling) // Minimum $100, scaling with intelligence - at least 1000 at level 1
            );
            
            // Reduce randomness to ensure more consistent trading
            const randomFactor = 0.95 + (Math.random() * 0.1); // 95-105% of base amount
            // Use at least 30% of available budget for trading to ensure enough for at least one share
            const minTradeAmount = updatedState.botTradingBudget * 0.3;
            const tradeAmount = Math.max(minTradeAmount, baseTradeAmount * randomFactor);
            
            // Debug log for trade amounts
            console.log(`Bot trading: Budget: $${updatedState.botTradingBudget.toFixed(2)}, Trade amount: $${tradeAmount.toFixed(2)}`);
            
            // Decide whether to buy or sell based on probability
            // Higher intelligence = more likely to make good decisions
            let updatedPortfolio = portfolio; // Use the current portfolio state for this trade
            let updatedBudget = updatedState.botTradingBudget; // Use current budget state
            let profit = 0;
            
            // Initialize log object to track bot's actions
            const botLog = {
              action: '',
              stockSymbol: '',
              quantity: 0,
              price: 0,
              totalValue: 0,
              profit: 0
            };
            
            // Calculate trade success probability based on intelligence
            // DRAMATICALLY higher chance of profitable trades with increased intelligence
            // Starting at 90% success rate even at intelligence level 1, scaling up to 100%
            // This makes bots with higher intelligence extremely profitable
            const successProbability = 0.9 + (updatedState.botIntelligence * 0.1 * (1 - 0.9));
            
            // Determine if this is a buy or sell decision
            // Make bots more likely to sell when they have a portfolio (50/50 chance instead of favoring buying)
            // This helps capitalize on gains and reduces holding positions too long
            const hasPortfolio = updatedPortfolio.length > 0;
            
            // Instead of random buy/sell decisions, use price trend data to make informed decisions
            // Advanced multi-factor analysis to determine optimal buying and selling points
            // Using sophisticated pattern recognition and trend analysis that scales with bot intelligence
            
            let isBuyDecision = false;
            
            // Advanced buying decision logic that scales with bot intelligence
            const botIntelligence = updatedState.botIntelligence || 1;
            
            // Default to selling if we have a portfolio
            if (hasPortfolio) {
              // Advanced multi-factor analysis for identifying buying opportunities
              const stocksWithBuyOpportunities = stocks.filter(stock => {
                // Get price history for this stock
                const history = state.stockPriceHistory[stock.id] || [];
                
                // Skip stocks with insufficient history
                if (history.length < 3) {
                  return false;
                }
                
                // Calculate multiple timeframe moving averages for better trend analysis
                const shortMA = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
                
                // Use medium MA if we have enough history
                let mediumMA = shortMA;
                if (history.length >= 5) {
                  mediumMA = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
                }
                
                // Use long MA if we have enough history
                let longMA = mediumMA;
                if (history.length >= 10) {
                  longMA = history.slice(-10).reduce((sum, price) => sum + price, 0) / 10;
                }
                
                // Multi-factor opportunity scoring system
                let buySignalStrength = 0;
                
                // Factor 1: Current price relative to short-term MA
                const shortMADrop = (stock.price / shortMA) - 1;
                if (shortMADrop < -0.02) { // 2% below short MA
                  buySignalStrength += 1;
                }
                
                // Factor 2: Current price relative to medium-term MA (stronger signal)
                if (history.length >= 5) {
                  const mediumMADrop = (stock.price / mediumMA) - 1;
                  if (mediumMADrop < -0.03) { // 3% below medium MA
                    buySignalStrength += 2;
                  }
                }
                
                // Factor 3: Current price relative to long-term MA (strongest signal)
                if (history.length >= 10) {
                  const longMADrop = (stock.price / longMA) - 1;
                  if (longMADrop < -0.04) { // 4% below long MA
                    buySignalStrength += 3;
                  }
                }
                
                // Factor 4: Trend pattern recognition (for higher intelligence bots)
                if (botIntelligence >= 4 && history.length >= 6) {
                  // Detect potential reversal patterns (price declined then stabilized)
                  const recent3Avg = history.slice(-3).reduce((sum, price) => sum + price, 0) / 3;
                  const previous3Avg = history.slice(-6, -3).reduce((sum, price) => sum + price, 0) / 3;
                  
                  // Previous decline followed by stabilization indicates potential bottom
                  if (previous3Avg > recent3Avg * 1.04 && 
                      Math.abs(stock.price / recent3Avg - 1) < 0.02) {
                    buySignalStrength += 2;
                    
                    // Log pattern detection for high-intelligence bots
                    if (botIntelligence >= 6) {
                      console.log(`Bot detected potential reversal pattern in ${stock.symbol}: Previous decline ${((previous3Avg/recent3Avg-1)*100).toFixed(1)}%, now stabilizing`);
                    }
                  }
                }
                
                // Factor 5: Trend analysis for high intelligence bots
                if (botIntelligence >= 7 && stock.trendDirection !== 0) {
                  // For downtrends that might be ending soon (buying opportunity)
                  if (stock.trendDirection < 0) {
                    const trendTimeRemaining = 1 - (stock.trendDuration / (5 * 60 * 1000));
                    // Downtrend near exhaustion (less than 30% remaining)
                    if (trendTimeRemaining < 0.3) {
                      buySignalStrength += 3;
                      console.log(`Bot detected downtrend exhaustion in ${stock.symbol}: ${(trendTimeRemaining*100).toFixed(0)}% remaining`);
                    }
                  }
                }
                
                // Calculate required signal strength based on bot intelligence
                // Lower intelligence bots need stronger signals to buy
                const requiredSignalStrength = Math.max(1, Math.ceil(3 - (botIntelligence * 0.25)));
                
                // Return true if buy signals are strong enough
                return buySignalStrength >= requiredSignalStrength;
              });
              
              // If there are good buying opportunities and we have budget, set to buy mode
              if (stocksWithBuyOpportunities.length > 0 && updatedBudget > 100) {
                console.log(`Bot found ${stocksWithBuyOpportunities.length} stocks with strong buying signals - switching to BUY mode`);
                isBuyDecision = true;
                
                // Log additional analysis for high intelligence bots
                if (botIntelligence >= 5) {
                  console.log(`Advanced market analysis complete: Found ${stocksWithBuyOpportunities.length} buying opportunities with bot intelligence ${botIntelligence}`);
                }
              } else {
                console.log(`Bot found no good buying opportunities - remaining in SELL mode`);
                isBuyDecision = false;
              }
            } else {
              // If no portfolio, always look to buy but be more selective with higher intelligence
              isBuyDecision = true;
              
              // Even with no portfolio, high intelligence bots are more selective
              if (botIntelligence >= 6) {
                // Analyze market conditions before first purchase
                let strongBuySignals = 0;
                
                stocks.forEach(stock => {
                  const history = state.stockPriceHistory[stock.id] || [];
                  if (history.length >= 5) {
                    const avgPrice = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
                    // Price at least 3% below average is a strong buy signal
                    if (stock.price < avgPrice * 0.97) {
                      strongBuySignals++;
                    }
                  }
                });
                
                console.log(`High intelligence bot market analysis: ${strongBuySignals} stocks with strong buy signals`);
              }
            }
            
            // Debug log for buy decision
            console.log(`Bot trade decision: ${isBuyDecision ? "BUY" : "SELL"} (has portfolio: ${hasPortfolio})`)
          
            if (isBuyDecision) {
              // Buy operation
              // Rank stocks by potential (smart bots pick better stocks and can detect trends)
              const rankedStocks = [...stocks].sort((a, b) => {
                // Massively enhanced stock evaluation algorithm that scales with bot intelligence
                // This formula accounts for trend, volatility, price movement, and trend detection
                // BOOSTED intelligence scaling - now intelligence has a MUCH greater impact
                // Using power of 2.5 instead of 1.5 gives intelligence 10x more impact at higher levels
                const intelligenceFactor = Math.pow(state.botIntelligence, 2.5); // Super-exponential scaling with intelligence
                
                // Trend awareness - higher intelligence means VASTLY better at identifying and capitalizing on trends
                // Calculate trend awareness (0-1 scale of how well the bot can detect trends)
                // Maxes out at intelligence 5 instead of 10, giving bots much better trend detection at lower levels
                // This makes even mid-level intelligence bots very effective at trend detection
                const trendAwareness = Math.min(1, state.botIntelligence / 5); // Maxes out at intelligence 5
                
                // Trend evaluation weights - DOUBLED for much stronger impact
                // These weights determine how much bots value different stock attributes
                const baseTrendWeight = 2 + (intelligenceFactor * 0.4); // 2x from previous (1 + intelligence*0.2)
                const priceMovementWeight = 0.4 + (intelligenceFactor * 0.2); // 2x from previous (0.2 + intelligence*0.1)
                const volatilityBonus = (1 - a.volatility) * (intelligenceFactor * 0.1); // 2x from previous (intelligence*0.05)
                
                // NEW: Trend direction detection (smarter bots capitalize on trends)
                // For stock A
                let aTrendBonus = 0;
                if (a.trendDirection !== 0) {
                  // Strong trends get a big bonus if bot is smart enough to detect them
                  // Formula: direction * strength * trendAwareness * intelligence factor
                  // For buy decisions, positive trends (trendDirection = 1) get a bonus
                  aTrendBonus = a.trendDirection * a.trendStrength * trendAwareness * intelligenceFactor * 2;
                  
                  // Add time factor - newer trends have more potential for profit
                  const trendTimeRemaining = 1 - (a.trendDuration / (5 * 60 * 1000));
                  aTrendBonus *= Math.max(0.1, trendTimeRemaining); // More bonus for newer trends
                }
                
                // For stock B
                let bTrendBonus = 0;
                if (b.trendDirection !== 0) {
                  bTrendBonus = b.trendDirection * b.trendStrength * trendAwareness * intelligenceFactor * 2;
                  const trendTimeRemaining = 1 - (b.trendDuration / (5 * 60 * 1000));
                  bTrendBonus *= Math.max(0.1, trendTimeRemaining);
                }
              
                // Enhanced scoring model that significantly improves profitability
                // Strong emphasis on upward trends and price movements
                
                // Add a price factor that favors cheaper stocks
                const aPriceFactor = 1.0 / (a.price + 0.1); // Add 0.1 to avoid division by zero
                const bPriceFactor = 1.0 / (b.price + 0.1);
                
                // Enhanced historical analysis for buying at the right time
                // Calculate how much below recent average the price is (deeper drops = better buying opportunity)
                const aHistory = state.stockPriceHistory[a.id] || [];
                const bHistory = state.stockPriceHistory[b.id] || [];
                
                // For stock A: calculate how far below recent average
                let aRecentDropBonus = 0;
                if (aHistory.length >= 5) {
                  // Calculate 5-point moving average
                  const aRecentAverage = aHistory.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
                  // Calculate drop percentage from recent average (negative = drop)
                  const aDropPercent = (a.price / aRecentAverage) - 1;
                  // Convert to bonus (bigger drops = bigger bonus)
                  if (aDropPercent < 0) {
                    // Exponentially scale the bonus based on drop size
                    aRecentDropBonus = Math.pow(Math.abs(aDropPercent) * 10, 1.5) * 5;
                    
                    // Log significant drops for debugging
                    if (aRecentDropBonus > 3) {
                      console.log(`Stock ${a.symbol} significant price drop: ${(aDropPercent * 100).toFixed(1)}% below average (bonus: ${aRecentDropBonus.toFixed(2)})`);
                    }
                  }
                } else if (a.price < a.previousPrice) {
                  // Fallback if not enough history: simple previous price comparison
                  aRecentDropBonus = 1.5;
                }
                
                // For stock B: same calculation
                let bRecentDropBonus = 0;
                if (bHistory.length >= 5) {
                  const bRecentAverage = bHistory.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
                  const bDropPercent = (b.price / bRecentAverage) - 1;
                  if (bDropPercent < 0) {
                    bRecentDropBonus = Math.pow(Math.abs(bDropPercent) * 10, 1.5) * 5;
                    
                    if (bRecentDropBonus > 3) {
                      console.log(`Stock ${b.symbol} significant price drop: ${(bDropPercent * 100).toFixed(1)}% below average (bonus: ${bRecentDropBonus.toFixed(2)})`);
                    }
                  }
                } else if (b.price < b.previousPrice) {
                  bRecentDropBonus = 1.5;
                }
                
                // MASSIVELY increased weight on positive trends (10x instead of 3x)
                // This makes bots heavily prioritize stocks with upward trends, leading to much better returns
                const aDirectionalTrendBonus = a.trendDirection > 0 ? 10.0 : 0;
                const bDirectionalTrendBonus = b.trendDirection > 0 ? 10.0 : 0;
                
                // More sophisticated scoring model that better predicts future performance
                // Now includes trend detection bonus and price factors
                const aScore = (a.trend * baseTrendWeight * 2) + // 2x weight on trend 
                               ((a.price > a.previousPrice ? 1 : -1) * priceMovementWeight) + 
                               volatilityBonus + 
                               (aTrendBonus * 3) + // 3x weight on trend bonus
                               (aPriceFactor * intelligenceFactor * 10) + // Price factor scales with intelligence
                               aRecentDropBonus + // Bonus for price drops (buying opportunity)
                               aDirectionalTrendBonus + // Bonus for upward trends
                               (Math.random() * (1 - trendAwareness) * 0.1); // Reduced randomness
                
                const bScore = (b.trend * baseTrendWeight * 2) + // 2x weight on trend
                               ((b.price > b.previousPrice ? 1 : -1) * priceMovementWeight) + 
                               volatilityBonus + 
                               (bTrendBonus * 3) + // 3x weight on trend bonus
                               (bPriceFactor * intelligenceFactor * 10) + // Price factor scales with intelligence
                               bRecentDropBonus + // Bonus for price drops (buying opportunity)
                               bDirectionalTrendBonus + // Bonus for upward trends
                               (Math.random() * (1 - trendAwareness) * 0.1); // Reduced randomness
                
                // Debug logging for significant trends
                if ((a.trendStrength > 0.7 || b.trendStrength > 0.7) && state.botIntelligence >= 5) {
                  const aInfo = a.trendDirection !== 0 ? `${a.symbol}: ${a.trendDirection > 0 ? "UP" : "DOWN"} trend (${(a.trendStrength*100).toFixed(0)}%), score=${aScore.toFixed(2)}` : "";
                  const bInfo = b.trendDirection !== 0 ? `${b.symbol}: ${b.trendDirection > 0 ? "UP" : "DOWN"} trend (${(b.trendStrength*100).toFixed(0)}%), score=${bScore.toFixed(2)}` : "";
                  if (aInfo || bInfo) {
                    console.log(`Bot trend analysis (intelligence ${state.botIntelligence}):`);
                    if (aInfo) console.log(aInfo);
                    if (bInfo) console.log(bInfo);
                  }
                }
                
                return bScore - aScore; // Higher score first
              });
            
              // Prepare stocks with price histories for analysis
              const stocksWithHistories = rankedStocks.map(stock => {
                return {
                  ...stock,
                  priceHistory: state.stockPriceHistory[stock.id] || []
                };
              });
              
              // Find affordable stocks first - only consider stocks that we can afford at least one share of
              const affordableStocks = stocksWithHistories.filter(stock => stock.price <= updatedBudget);
              
              // Debug log for affordable stocks
              console.log(`Bot trading: Found ${affordableStocks.length} affordable stocks out of ${rankedStocks.length} total`);
              
              // If no affordable stocks, skip this trade
              if (affordableStocks.length === 0) {
                console.log(`Bot trading: No affordable stocks found, skipping buy operation`);
                return updatedState;
              }
              
              // Advanced multi-stock selection
              let stocksToBuy = [];
              
              if (useAdvancedAlgorithm && tradingAlgorithm) {
                try {
                  // Use the advanced algorithm to select multiple stocks
                  stocksToBuy = tradingAlgorithm.selectStocksToBuy(
                    stocksWithHistories,
                    affordableStocks,
                    updatedBudget,
                    state.botIntelligence
                  );
                  
                  console.log(`Advanced stock selection algorithm selected ${stocksToBuy.length} stocks to buy`);
                } catch (error) {
                  console.error("Error using advanced stock selection algorithm:", error);
                  useAdvancedAlgorithm = false;
                }
              }
              
              // Fallback to basic algorithm if advanced failed
              if (!useAdvancedAlgorithm || stocksToBuy.length === 0) {
                // Traditional single stock selection
                // Pick a stock - higher intelligence picks from top affordable stocks more consistently
                const pickRange = Math.max(1, Math.ceil(3 - (state.botIntelligence * 0.2)));
                const pickIndex = Math.floor(Math.random() * pickRange);
                const stockToBuy = affordableStocks[Math.min(pickIndex, affordableStocks.length - 1)];
                
                // Calculate quantity
                const quantity = Math.max(1, Math.floor(tradeAmount / stockToBuy.price));
                const cost = quantity * stockToBuy.price;
                
                if (cost <= updatedBudget && quantity > 0) {
                  stocksToBuy = [{
                    stock: stockToBuy,
                    quantity: quantity,
                    cost: cost
                  }];
                }
              }
              
              // Process all selected stocks
              for (const purchase of stocksToBuy) {
                const stockToBuy = purchase.stock;
                const quantity = purchase.quantity;
                const totalCost = purchase.cost;
                
                // Skip if we don't have enough budget
                if (updatedBudget < totalCost || quantity <= 0) {
                  console.log(`Skipping purchase of ${stockToBuy.symbol}: Not enough budget`);
                  continue;
                }
                
                // Debug log for quantity calculation
                console.log(`Bot trading: Buying ${quantity} shares of ${stockToBuy.symbol} for $${totalCost.toFixed(2)}`);
                console.log(`Bot trading: Budget check - Available: $${updatedBudget.toFixed(2)}, Required: $${totalCost.toFixed(2)}`);
                
                // Update budget
                updatedBudget -= totalCost;
                
                // Check if we already have this stock
                const existingHolding = updatedPortfolio.find(h => h.stockId === stockToBuy.id);
                
                if (existingHolding) {
                  // Update existing holding
                  const newAveragePrice = (existingHolding.averagePurchasePrice * existingHolding.quantity + totalCost) / (existingHolding.quantity + quantity);
                  
                  updatedPortfolio = updatedPortfolio.map(h => {
                    if (h.stockId === stockToBuy.id) {
                      return {
                        ...h,
                        quantity: h.quantity + quantity,
                        averagePurchasePrice: newAveragePrice,
                        value: (h.quantity + quantity) * stockToBuy.price
                      };
                    }
                    return h;
                  });
                } else {
                  // Add new holding
                  updatedPortfolio.push({
                    stockId: stockToBuy.id,
                    quantity,
                    averagePurchasePrice: stockToBuy.price,
                    value: quantity * stockToBuy.price
                  });
                }
                
                // Log the action
                console.log(`PURCHASE SUCCESSFUL: Bot bought ${quantity} shares of ${stockToBuy.symbol} for $${totalCost.toFixed(2)}`);
              }
              
              // Update the state with new portfolio and budget
              updatedState.stockPortfolio = updatedPortfolio;
              updatedState.botTradingBudget = updatedBudget;
              
              console.log(`Bot trading complete: Remaining budget: $${updatedBudget.toFixed(2)}`);
              
              // Record only the last purchase in the bot log for simplicity
              if (stocksToBuy.length > 0) {
                const lastPurchase = stocksToBuy[stocksToBuy.length - 1];
                botLog.action = 'buy';
                botLog.stockSymbol = lastPurchase.stock.symbol;
                botLog.quantity = lastPurchase.quantity;
                botLog.price = lastPurchase.stock.price;
                botLog.totalValue = lastPurchase.cost;
              }
            } else {
              // Sell operation - only if we have stocks to sell
              if (updatedPortfolio.length > 0) {
                // Rank holdings by potential profit/loss and trend detection
                const rankedHoldings = [...updatedPortfolio].sort((a, b) => {
                  const stockA = stocks.find(s => s.id === a.stockId);
                  const stockB = stocks.find(s => s.id === b.stockId);
                  
                  if (!stockA || !stockB) return 0;
                  
                  // Basic profit calculation
                  const aProfitRatio = stockA.price / a.averagePurchasePrice;
                  const bProfitRatio = stockB.price / b.averagePurchasePrice;
                  
                  // Intelligence factor for trend detection and prediction
                  const intelligenceFactor = Math.pow(state.botIntelligence, 1.5);
                  const trendAwareness = Math.min(1, state.botIntelligence / 10); // Maxes out at intelligence 10
                  
                  // NEW: Trend-based selling strategy
                  // Bearish trends (down) are good to sell on, bullish trends (up) are good to hold
                  let aTrendFactor = 0;
                  if (stockA.trendDirection !== 0) {
                    // Negative trends increase sell score, positive trends decrease it
                    // Higher intelligence detects trends better
                    aTrendFactor = -stockA.trendDirection * stockA.trendStrength * trendAwareness * 2;
                    
                    // Factor in how much of the trend is left - sell earlier in downtrends
                    const trendTimeRemaining = 1 - (stockA.trendDuration / (5 * 60 * 1000));
                    if (stockA.trendDirection < 0) {
                      // For downtrends, sell earlier (higher score for newer downtrends)
                      aTrendFactor *= (1 + trendTimeRemaining);
                    } else {
                      // For uptrends, maybe sell near the end (lower negative score for ending uptrends)
                      aTrendFactor *= trendTimeRemaining;
                    }
                  }
                  
                  // Same for stock B
                  let bTrendFactor = 0;
                  if (stockB.trendDirection !== 0) {
                    bTrendFactor = -stockB.trendDirection * stockB.trendStrength * trendAwareness * 2;
                    const trendTimeRemaining = 1 - (stockB.trendDuration / (5 * 60 * 1000));
                    if (stockB.trendDirection < 0) {
                      bTrendFactor *= (1 + trendTimeRemaining);
                    } else {
                      bTrendFactor *= trendTimeRemaining;
                    }
                  }
                  
                  // Log significant trend-based selling decisions
                  if ((stockA.trendStrength > 0.7 || stockB.trendStrength > 0.7) && 
                      (aProfitRatio > 1.2 || bProfitRatio > 1.2) &&
                      state.botIntelligence >= 5) {
                    console.log(`Bot selling analysis (intelligence ${state.botIntelligence}):`);
                    if (stockA.trendDirection < 0 && aProfitRatio > 1.2) {
                      console.log(`${stockA.symbol}: SELL SIGNAL - Downtrend (${(stockA.trendStrength*100).toFixed(0)}%) with profit ratio ${aProfitRatio.toFixed(2)}`);
                    }
                    if (stockB.trendDirection < 0 && bProfitRatio > 1.2) {
                      console.log(`${stockB.symbol}: SELL SIGNAL - Downtrend (${(stockB.trendStrength*100).toFixed(0)}%) with profit ratio ${bProfitRatio.toFixed(2)}`);
                    }
                  }
                  
                  // Enhanced score combines profit ratio, base trend, and trend detection
                  // Higher sell scores for:
                  // 1. Higher profits (aProfitRatio) - heavily prioritize profitable trades
                  // 2. Negative trends detected (aTrendFactor)
                  // 3. Higher intelligence provides better trend prediction
                  
                  // DRAMATICALLY prioritize selling stocks that are currently profitable (10x weight)
                  // Even more extreme profit weighting based on bot intelligence
                  // Higher intelligence bots get MUCH better at selecting profitable stocks to sell
                  const intelligenceMultiplier = 1 + (state.botIntelligence * 0.5); // Scales profit bonus with intelligence
                  const aProfitBonus = aProfitRatio > 1.0 ? 10.0 * intelligenceMultiplier * (aProfitRatio - 1.0) : 0.0;
                  const bProfitBonus = bProfitRatio > 1.0 ? 10.0 * intelligenceMultiplier * (bProfitRatio - 1.0) : 0.0;
                  
                  const aScore = (aProfitRatio * 1.5) + 
                                 aProfitBonus + // Add large bonus for profitable positions
                                 aTrendFactor + 
                                 (Math.random() * (1 - trendAwareness) * 0.2); // Less randomness with higher intelligence
                  
                  const bScore = (bProfitRatio * 1.5) + 
                                 bProfitBonus + // Add large bonus for profitable positions
                                 bTrendFactor + 
                                 (Math.random() * (1 - trendAwareness) * 0.2);
                  
                  return bScore - aScore; // Higher score first (prioritize profitable stocks in downtrends)
                });
                
                // Pick a holding - more intelligent bots make better selling decisions
                const holdingToSell = rankedHoldings[0];
                const stock = stocks.find(s => s.id === holdingToSell.stockId);
                
                if (stock) {
                  // Calculate quantity to sell (partial sells for large holdings)
                  const maxQuantity = holdingToSell.quantity;
                  
                  // Check if we're in profit for this holding
                  const stockPrice = stock.price;
                  const avgPurchasePrice = holdingToSell.averagePurchasePrice;
                  const inProfit = stockPrice > avgPurchasePrice;
                  
                  // Calculate profit percentage
                  const profitRatio = stockPrice / avgPurchasePrice;
                  const profitPercentage = profitRatio - 1; // Convert ratio to percentage (0.1 = 10%)
                  
                  // Set risk threshold based on intelligence level
                  // Use enhanced algorithm if available
                  let riskThreshold = 0.2; // Default fallback
                  
                  if (useAdvancedAlgorithm && tradingAlgorithm) {
                    try {
                      // Determine risk level based on intelligence
                      let riskLevel = "medium"; // Default
                      
                      if (state.botIntelligence <= 3) {
                        riskLevel = "low"; // 15% threshold
                      } else if (state.botIntelligence <= 7) {
                        riskLevel = "medium"; // 30% threshold
                      } else {
                        riskLevel = "high"; // 50% threshold
                      }
                      
                      riskThreshold = tradingAlgorithm.getRiskThreshold(riskLevel);
                      console.log(`Using ${riskLevel} risk threshold: ${(riskThreshold * 100).toFixed(0)}%`);
                    } catch (error) {
                      console.error("Error calculating risk threshold:", error);
                      // Fallback to traditional calculation
                      useAdvancedAlgorithm = false;
                    }
                  }
                  
                  // Fallback calculation if advanced algorithm not available
                  if (!useAdvancedAlgorithm) {
                    // Traditional risk calculation
                    const baseRiskThreshold = state.botRiskThreshold || 0.2;
                    riskThreshold = baseRiskThreshold * (1 + (state.botIntelligence * 0.1));
                  }
                  
                  // Advanced sell logic using our enhanced trading algorithm
                  let sellPercentage = 0; // Default to not selling
                  
                  // Get price history for analysis
                  const history = state.stockPriceHistory[stock.id] || [];
                  
                  // Use the enhanced algorithm if available
                  if (useAdvancedAlgorithm && tradingAlgorithm) {
                    try {
                      // Use the advanced algorithm to calculate sell percentage
                      sellPercentage = tradingAlgorithm.calculateSellPercentage(
                        stock,
                        stockPrice,
                        avgPurchasePrice,
                        inProfit,
                        profitPercentage,
                        riskThreshold,
                        history,
                        state.botIntelligence
                      );
                      
                      // Log the decision based on the calculated sell percentage
                      if (sellPercentage >= 1.0) {
                        console.log(`Bot selling entire position of ${stock.symbol}: Advanced algorithm recommends complete sell with ${(profitPercentage * 100).toFixed(1)}% profit`);
                      } else if (sellPercentage > 0.7) {
                        console.log(`Bot selling ${(sellPercentage * 100).toFixed(0)}% of ${stock.symbol}: Advanced algorithm detects peak or trend exhaustion`);
                      } else if (sellPercentage > 0.3) {
                        console.log(`Bot selling ${(sellPercentage * 100).toFixed(0)}% of ${stock.symbol}: Advanced algorithm detected partial sell opportunity`);
                      } else if (sellPercentage > 0) {
                        console.log(`Bot selling ${(sellPercentage * 100).toFixed(0)}% of ${stock.symbol}: Advanced algorithm recommends small position reduction`);
                      } else {
                        console.log(`Bot holding ${stock.symbol}: Advanced algorithm recommends holding position`);
                      }
                    } catch (error) {
                      console.error("Error using advanced sell algorithm:", error);
                      // Fall back to basic algorithm if advanced fails
                      useAdvancedAlgorithm = false;
                    }
                  }
                  
                  // Fallback to original algorithm if enhanced version not available or failed
                  if (!useAdvancedAlgorithm) {
                    if (inProfit) {
                      // Only sell if price is above purchase price
                      
                      // Check if current price is higher than recent average (indicating a peak)
                      let isPriceAtPeak = false;
                      if (history.length >= 5) {
                        const recentAverage = history.slice(-5).reduce((sum, price) => sum + price, 0) / 5;
                        isPriceAtPeak = stockPrice > recentAverage * 1.02; // Price is at least 2% above recent average
                      }
                      
                      if (isPriceAtPeak) {
                        // Price is at a local peak - good time to sell
                        if (profitPercentage >= riskThreshold) {
                          // High profit - sell everything
                          sellPercentage = 1.0;
                          console.log(`Bot selling entire position of ${stock.symbol}: Price at peak and profit ${(profitPercentage * 100).toFixed(1)}% meets threshold ${(riskThreshold * 100).toFixed(1)}%`);
                        } else {
                          // Moderate profit - sell half
                          sellPercentage = 0.5;
                          console.log(`Bot selling half position of ${stock.symbol}: Price at peak with ${(profitPercentage * 100).toFixed(1)}% profit`);
                        }
                      } else if (profitPercentage >= riskThreshold * 1.5) {
                        // Very high profit even without a peak - sell everything
                        sellPercentage = 1.0;
                        console.log(`Bot selling entire position of ${stock.symbol}: High profit ${(profitPercentage * 100).toFixed(1)}% exceeds threshold ${(riskThreshold * 100 * 1.5).toFixed(1)}%`);
                      } else if (profitPercentage >= riskThreshold) {
                        // Above threshold but not at peak - sell a smaller amount
                        sellPercentage = 0.3;
                        console.log(`Bot selling 30% of ${stock.symbol}: Profit ${(profitPercentage * 100).toFixed(1)}% meets threshold but price not at peak`);
                      }
                    } else {
                      // Only sell at a loss if the stock has a strong downward trend (cut losses)
                      if (stock.trendDirection < 0 && stock.trendStrength > 0.7) {
                        sellPercentage = 0.2; // Small sale to cut some losses
                        console.log(`Bot selling 20% of ${stock.symbol} at a loss: Strong downward trend detected`);
                      } else {
                        // Don't sell at a loss unless there's a clear negative trend
                        sellPercentage = 0;
                        console.log(`Bot holding ${stock.symbol} despite ${Math.abs(profitPercentage * 100).toFixed(1)}% loss: Waiting for recovery`);
                      }
                    }
                  }
                  
                  const sellQuantity = Math.max(1, Math.min(
                    maxQuantity,
                    Math.floor(Math.random() * maxQuantity * sellPercentage) + 1
                  ));
                  
                  // Calculate revenue
                  const totalRevenue = sellQuantity * stock.price;
                  
                  // Calculate profit/loss
                  const costBasis = holdingToSell.averagePurchasePrice * sellQuantity;
                  const profitLoss = totalRevenue - costBasis;
                  
                  // Update portfolio
                  if (sellQuantity >= holdingToSell.quantity) {
                    // Remove holding entirely
                    updatedPortfolio = updatedPortfolio.filter(h => h.stockId !== holdingToSell.stockId);
                  } else {
                    // Update existing holding
                    updatedPortfolio = updatedPortfolio.map(h => {
                      if (h.stockId === holdingToSell.stockId) {
                        return {
                          ...h,
                          quantity: h.quantity - sellQuantity,
                          value: (h.quantity - sellQuantity) * stock.price
                        };
                      }
                      return h;
                    });
                  }
                  
                  // Update budget and profit
                  updatedBudget += totalRevenue;
                  profit = profitLoss;
                  
                  // Update profit/loss totals directly
                  if (profitLoss > 0) {
                    updatedState.botTradingProfit += profitLoss;
                    console.log(`Added $${profitLoss.toFixed(2)} to trading profit, new total: $${updatedState.botTradingProfit.toFixed(2)}`);
                  } else if (profitLoss < 0) {
                    updatedState.botTradingLosses += Math.abs(profitLoss);
                    console.log(`Added $${Math.abs(profitLoss).toFixed(2)} to trading losses, new total: $${updatedState.botTradingLosses.toFixed(2)}`);
                  }
                  
                  // Log the action
                  botLog.action = 'sell';
                  botLog.stockSymbol = stock.symbol;
                  botLog.quantity = sellQuantity;
                  botLog.price = stock.price;
                  botLog.totalValue = totalRevenue;
                  botLog.profit = profitLoss;
                  
                  // Update the state with new portfolio and budget
                  updatedState.stockPortfolio = updatedPortfolio;
                  updatedState.botTradingBudget = updatedBudget;
                  
                  console.log(`Bot sold ${sellQuantity} shares of ${stock.symbol} for $${totalRevenue.toFixed(2)} (${profitLoss >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(profitLoss).toFixed(2)})`);
                }
              }
            }
            
          } // End of for loop for multiple trades
          
          // Calculate new portfolio value
          const newPortfolioValue = updatedState.stockPortfolio.reduce((total, holding) => {
            const stockPrice = stocks.find(s => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Log the final state of the portfolio after all trades
          console.log(`Bot trading complete. Portfolio size: ${updatedState.stockPortfolio.length}, Budget: $${updatedState.botTradingBudget.toFixed(2)}, Portfolio value: $${newPortfolioValue.toFixed(2)}`);
          
          // Update state with all changes from multiple trades
          return {
            stockPortfolio: updatedState.stockPortfolio,
            botTradingBudget: updatedState.botTradingBudget,
            botLastTradeTime: now,
            portfolioValue: newPortfolioValue,
            stockMarketReturns: updatedState.stockMarketReturns,
            botTradingProfit: updatedState.botTradingProfit,
            botTradingLosses: updatedState.botTradingLosses
          };
        }),
        
      investInStockMarket: (amount: number) => 
        set((state) => {
          // Check if player has enough money
          if (state.money < amount) {
            return state;
          }
          
          return {
            money: state.money - amount,
            stockMarketInvestment: state.stockMarketInvestment + amount
          };
        }),
        
      generateStockReturns: () => 
        set((state) => {
          // Skip if no investment or bots
          if (state.stockMarketInvestment <= 0 || state.tradingBots <= 0) {
            return state;
          }
          
          const now = new Date();
          const lastUpdate = state.stockMarketLastUpdate;
          
          // Only update every 10 seconds
          if (now.getTime() - lastUpdate.getTime() < 10000) {
            return state;
          }
          
          // Calculate returns: Base 2.5% + 0.5% per bot, with random variation
          // Significantly increased from original 0.5% + 0.1% per bot
          const baseReturn = 0.025; // 2.5% (5x original)
          const botBonus = 0.005 * state.tradingBots; // 0.5% per bot (5x original)
          const variation = (Math.random() - 0.5) * 0.03; // ±1.5% (3x original)
          const returnRate = baseReturn + botBonus + variation;
          
          // Apply return to investment with quadratic scaling for large investments
          // This makes investing millions yield millions in returns
          const investmentScaling = Math.sqrt(state.stockMarketInvestment) / 100;
          const scalingMultiplier = 1 + Math.min(10, investmentScaling); // Cap at 11x for very large investments
          const adjustedReturnRate = returnRate * scalingMultiplier;
          
          // Apply adjusted return rate to investment
          const returns = state.stockMarketInvestment * adjustedReturnRate;
          
          console.log(`Stock market returns: $${returns.toFixed(2)} (${(adjustedReturnRate * 100).toFixed(2)}% rate)`);
          console.log(`Base rate: ${(returnRate * 100).toFixed(2)}%, Scaling: ${scalingMultiplier.toFixed(2)}x`);
          
          return {
            money: state.money + returns,
            stockMarketReturns: state.stockMarketReturns + returns,
            stockMarketLastUpdate: now
          };
        }),
        
      // Get available stocks
      getStocks: () => {
        // Predefined list of stocks
        const stocks: Stock[] = [
          {
            id: 'PAPR',
            name: 'PaperTech Inc.',
            symbol: 'PAPR',
            price: 10.00,
            previousPrice: 9.85,
            volatility: 0.15,
            trend: 0.01,
            volume: 10000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 0, // 0 neutral, 1 bullish, -1 bearish
            trendStrength: 0, // 0-1, how strong the trend is
            trendStartTime: new Date(), // When the trend started
            trendDuration: 0 // How long the trend has been active in ms
          },
          {
            id: 'WIRE',
            name: 'Global Wire Co.',
            symbol: 'WIRE',
            price: 25.50,
            previousPrice: 25.75,
            volatility: 0.2,
            trend: -0.005,
            volume: 8500,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 0,
            trendStrength: 0,
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'CLIP',
            name: 'ClipMaster Industries',
            symbol: 'CLIP',
            price: 15.25,
            previousPrice: 14.90,
            volatility: 0.25,
            trend: 0.02,
            volume: 12000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 0,
            trendStrength: 0,
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'MACH',
            name: 'MachineWorks Ltd.',
            symbol: 'MACH',
            price: 45.75,
            previousPrice: 46.00,
            volatility: 0.3,
            trend: -0.01,
            volume: 5000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 0,
            trendStrength: 0,
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'TECH',
            name: 'TechSystems Corp.',
            symbol: 'TECH',
            price: 75.25,
            previousPrice: 73.50,
            volatility: 0.4,
            trend: 0.015,
            volume: 7500,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 0,
            trendStrength: 0,
            trendStartTime: new Date(),
            trendDuration: 0
          }
        ];
        
        // Get current stock data from state
        const state = get();
        const stockPriceHistory = state.stockPriceHistory;
        const stockTrendData = state.stockTrendData || {}; // Get saved trend data if available
        
        // Update stocks with latest prices and trend data from state history if available
        return stocks.map(stock => {
          let updatedStock = { ...stock };
          
          // Update price data if available
          if (stockPriceHistory[stock.id] && stockPriceHistory[stock.id].length > 0) {
            const latestPrice = stockPriceHistory[stock.id][stockPriceHistory[stock.id].length - 1];
            const previousPrice = stockPriceHistory[stock.id].length > 1 
              ? stockPriceHistory[stock.id][stockPriceHistory[stock.id].length - 2] 
              : stock.previousPrice;
            
            updatedStock = {
              ...updatedStock,
              price: latestPrice,
              previousPrice: previousPrice
            };
          }
          
          // Load persisted trend data if available
          if (stockTrendData[stock.id]) {
            const trendData = stockTrendData[stock.id];
            
            // Only use saved trend data if it has a valid direction
            if (trendData && (trendData.trendDirection === 1 || trendData.trendDirection === -1 || trendData.trendDirection === 0)) {
              // For trend times, ensure we have valid dates
              const trendStartTime = trendData.trendStartTime instanceof Date ? 
                trendData.trendStartTime : new Date(trendData.trendStartTime);
              
              // Recalculate duration based on current time if needed
              const now = new Date();
              const currentDuration = trendData.trendDuration || (now.getTime() - trendStartTime.getTime());
              
              // Only use the trend if it hasn't expired (5 min = 300,000 ms)
              if (currentDuration < 300000) {
                updatedStock = {
                  ...updatedStock,
                  trendDirection: trendData.trendDirection,
                  trendStrength: trendData.trendStrength,
                  trendStartTime: trendStartTime,
                  trendDuration: currentDuration
                };
                
                // Log restored trend for debugging
                const direction = updatedStock.trendDirection === 1 ? "BULLISH" : 
                                (updatedStock.trendDirection === -1 ? "BEARISH" : "NEUTRAL");
                console.log(`Restored ${direction} trend for ${updatedStock.symbol} with ${updatedStock.trendStrength.toFixed(2)} strength (${Math.floor(currentDuration/1000)}s old)`);
              }
            }
          }
          
          return updatedStock;
        });
      },
      
      // Buy stock
      buyStock: (stockId: string, quantity: number) => 
        set((state) => {
          const stocks = get().getStocks();
          const stock = stocks.find(s => s.id === stockId);
          
          if (!stock) {
            console.error(`Stock ${stockId} not found`);
            return state;
          }
          
          const totalCost = stock.price * quantity;
          
          // Check if player has enough money
          if (state.money < totalCost) {
            console.error(`Not enough money to buy ${quantity} shares of ${stock.symbol}`);
            return state;
          }
          
          // Find existing holding or create new one
          const existingHolding = state.stockPortfolio.find(h => h.stockId === stockId);
          let newPortfolio = [...state.stockPortfolio];
          
          if (existingHolding) {
            // Update existing holding
            const newAveragePrice = (existingHolding.averagePurchasePrice * existingHolding.quantity + totalCost) / (existingHolding.quantity + quantity);
            
            newPortfolio = state.stockPortfolio.map(h => {
              if (h.stockId === stockId) {
                return {
                  ...h,
                  quantity: h.quantity + quantity,
                  averagePurchasePrice: newAveragePrice,
                  value: (h.quantity + quantity) * stock.price
                };
              }
              return h;
            });
          } else {
            // Add new holding
            newPortfolio.push({
              stockId,
              quantity,
              averagePurchasePrice: stock.price,
              value: quantity * stock.price
            });
          }
          
          // Calculate new portfolio value
          const newPortfolioValue = newPortfolio.reduce((total, holding) => {
            const stockPrice = stocks.find(s => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          console.log(`Bought ${quantity} shares of ${stock.symbol} at $${stock.price} for a total of $${totalCost}`);
          
          return {
            money: state.money - totalCost,
            stockPortfolio: newPortfolio,
            portfolioValue: newPortfolioValue
          };
        }),
        
      // Sell stock
      sellStock: (stockId: string, quantity: number) => 
        set((state) => {
          const stocks = get().getStocks();
          const stock = stocks.find(s => s.id === stockId);
          
          if (!stock) {
            console.error(`Stock ${stockId} not found`);
            return state;
          }
          
          // Find existing holding
          const existingHolding = state.stockPortfolio.find(h => h.stockId === stockId);
          
          if (!existingHolding || existingHolding.quantity < quantity) {
            console.error(`Not enough shares of ${stock.symbol} to sell`);
            return state;
          }
          
          const totalRevenue = stock.price * quantity;
          let newPortfolio = [...state.stockPortfolio];
          
          if (existingHolding.quantity === quantity) {
            // Remove holding entirely
            newPortfolio = state.stockPortfolio.filter(h => h.stockId !== stockId);
          } else {
            // Update existing holding
            newPortfolio = state.stockPortfolio.map(h => {
              if (h.stockId === stockId) {
                return {
                  ...h,
                  quantity: h.quantity - quantity,
                  value: (h.quantity - quantity) * stock.price
                };
              }
              return h;
            });
          }
          
          // Calculate new portfolio value
          const newPortfolioValue = newPortfolio.reduce((total, holding) => {
            const stockPrice = stocks.find(s => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Calculate profit/loss
          const costBasis = existingHolding.averagePurchasePrice * quantity;
          const profitLoss = totalRevenue - costBasis;
          
          console.log(`Sold ${quantity} shares of ${stock.symbol} at $${stock.price} for a total of $${totalRevenue}`);
          console.log(`Profit/Loss: $${profitLoss.toFixed(2)}`);
          
          return {
            money: state.money + totalRevenue,
            stockPortfolio: newPortfolio,
            portfolioValue: newPortfolioValue,
            stockMarketReturns: state.stockMarketReturns + (profitLoss > 0 ? profitLoss : 0),
            botTradingLosses: state.botTradingLosses + (profitLoss < 0 ? Math.abs(profitLoss) : 0)
          };
        }),
        
      // Update stock prices
      updateStockPrices: () => 
        set((state) => {
          const stocks = get().getStocks();
          let newPriceHistory = { ...state.stockPriceHistory };
          const now = new Date();
          
          // Update each stock's price based on its trend and volatility
          const updatedStocks = stocks.map(stock => {
            // Clone the stock object to modify it
            let updatedStock = { ...stock };
            const currentTrendDuration = now.getTime() - stock.trendStartTime.getTime();
            
            // Check if we need to create a new trend (randomly or if current trend expired)
            // Max trend duration is increased significantly for longer-lasting trends
            const maxTrendDuration = 20 * 60 * 1000; // 20 minutes in milliseconds (increased from 10)
            const randomTrendChange = Math.random() < 0.005; // 0.5% chance of a trend change per tick (reduced from 1%)
            const trendExpired = stock.trendDirection !== 0 && currentTrendDuration >= maxTrendDuration;
            
            // Create a new trend if needed
            if (randomTrendChange || trendExpired || stock.trendDirection === 0) {
              // Determine if we'll have a trend and in which direction
              // Higher chance of neutral (no trend) than strong trends
              const trendRoll = Math.random();
              
              if (trendRoll < 0.75) { // 75% chance of a significant trend (increased from 60%)
                // Determine direction: bullish (1) or bearish (-1)
                // Bias toward upward trends (65% chance of upward, 35% chance of downward)
                updatedStock.trendDirection = Math.random() < 0.65 ? 1 : -1;
                // Determine strength (0.3 to 1.0 - stronger trends are rarer)
                // Stronger trends for all directions
                updatedStock.trendStrength = 0.4 + (Math.random() * 0.6);
              } else {
                // Neutral trend (small movements)
                updatedStock.trendDirection = 0;
                updatedStock.trendStrength = 0;
              }
              
              // Reset trend timing
              updatedStock.trendStartTime = now;
              updatedStock.trendDuration = 0;
              
              // Log trend changes
              if (updatedStock.trendDirection !== 0) {
                const direction = updatedStock.trendDirection === 1 ? "BULLISH" : "BEARISH";
                const strength = (updatedStock.trendStrength * 100).toFixed(0);
                console.log(`${updatedStock.symbol}: New ${direction} trend starting with ${strength}% strength!`);
              }
            } else {
              // Update the duration of the existing trend
              updatedStock.trendDuration = currentTrendDuration;
            }
            
            // Calculate price change based on trend
            let trendImpact = 0;
            if (updatedStock.trendDirection !== 0) {
              // Stronger trends have larger price movements, but reduced impact for more gradual changes
              trendImpact = updatedStock.trendDirection * updatedStock.trendStrength * 0.01; // Up to 1% per tick from trend (reduced from 3%)
            }
            
            // Base trend factor (from the original model)
            const baseTrendFactor = updatedStock.trend * (1 + (state.tradingBots * 0.01));
            
            // Random price movement with trend bias
            const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
            const volatilityFactor = updatedStock.volatility * (1 - (state.tradingBots * 0.01)); // Trading bots reduce volatility
            
            // Calculate price change percentage (combining base trend, trend impact, and random movement)
            const changePercent = baseTrendFactor + trendImpact + (randomFactor * volatilityFactor);
            
            // Calculate new price (with limits to prevent excessive changes per tick)
            // Reduced maximum price changes by 67% to make fluctuations more gradual
            const maxChange = updatedStock.trendDirection !== 0 ? 0.05 : 0.02; // Reduced from 0.15/0.05 to 0.05/0.02
            const limitedChangePercent = Math.max(Math.min(changePercent, maxChange), -maxChange);
            const newPrice = Math.max(0.01, updatedStock.price * (1 + limitedChangePercent));
            
            // Update price history
            const stockHistory = newPriceHistory[updatedStock.id] || [];
            // Limit history to last 100 points
            if (stockHistory.length >= 100) {
              stockHistory.shift();
            }
            stockHistory.push(newPrice);
            newPriceHistory[updatedStock.id] = stockHistory;
            
            return {
              ...updatedStock,
              previousPrice: updatedStock.price,
              price: newPrice,
              lastUpdate: now
            };
          });
          
          // Calculate new portfolio value
          const newPortfolioValue = state.stockPortfolio.reduce((total, holding) => {
            const stockPrice = updatedStocks.find(s => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Create updated stockTrendData to persist stock trends
          const newStockTrendData = {};
          updatedStocks.forEach(stock => {
            // Only store trend data for stocks with active trends
            if (stock.trendDirection !== 0) {
              newStockTrendData[stock.id] = {
                trendDirection: stock.trendDirection,
                trendStrength: stock.trendStrength,
                trendStartTime: stock.trendStartTime,
                trendDuration: stock.trendDuration
              };
            }
          });
          
          return {
            stockPriceHistory: newPriceHistory,
            portfolioValue: newPortfolioValue,
            stockMarketLastUpdate: new Date(),
            stockTrendData: newStockTrendData // Update trend data for persistence
          };
        }),
        
      // Calculate portfolio value
      calculatePortfolioValue: () => {
        const state = get();
        const stocks = get().getStocks();
        
        return state.stockPortfolio.reduce((total, holding) => {
          const stockPrice = stocks.find(s => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
          return total + (holding.quantity * stockPrice);
        }, 0);
      },
      
      // Stock market tick with enhanced trading algorithm
      stockMarketTick: () => {
        if (get().stockMarketUnlocked) {
          const state = get();
          const now = new Date();
          const lastUpdate = state.stockMarketLastUpdate;
          
          // Update stock prices every 5 seconds through the game tick
          // (The StockMarketPanel also updates prices when displayed)
          if (now.getTime() - lastUpdate.getTime() >= 5000) {
            get().updateStockPrices();
          }
          
          // Run auto trading if we have bots with budget
          const tradingBots = state.tradingBots;
          if (tradingBots > 0) {
            try {
              // Use enhanced trading algorithm from tradingBotAlgorithm.js
              const botIntelligence = state.botIntelligence || 1;
              const marketVolatility = state.volatility || 0.15;
              const stocks = get().getStocks();
              
              // Import dynamically to avoid circular dependencies
              import('./tradingBotAlgorithm').then(tradingAlgorithm => {
                // Calculate market opportunity score
                const marketOpportunityScore = tradingAlgorithm.calculateMarketOpportunityScore(state, stocks, botIntelligence);
                
                // Calculate trading probability
                const adjustedProbability = tradingAlgorithm.calculateTradingProbability(botIntelligence, marketVolatility, marketOpportunityScore);
                
                // Determine if trading should occur this tick based on probability
                const shouldTrade = Math.random() < adjustedProbability;
                
                if (shouldTrade) {
                  // Log trading decision for debugging
                  console.log(`Bot trading triggered: Intelligence=${botIntelligence}, Volatility=${marketVolatility.toFixed(2)}, Opportunity=${marketOpportunityScore.toFixed(2)}, Probability=${adjustedProbability.toFixed(2)}`);
                  
                  // Execute trades based on number of bots
                  // More intelligent bots execute fewer trades but with better returns
                  const tradesToExecute = Math.max(1, Math.floor(tradingBots / Math.sqrt(botIntelligence)));
                  console.log(`Executing ${tradesToExecute} trades with ${tradingBots} bots at intelligence level ${botIntelligence}`);
                  
                  // Execute the calculated number of trades
                  for (let i = 0; i < tradesToExecute; i++) {
                    get().botAutoTrade();
                  }
                }
              }).catch(error => {
                console.error("Error importing trading algorithm:", error);
                // Fallback to simple trading if module import fails
                if (Math.random() < 0.1) {
                  get().botAutoTrade();
                }
              });
            } catch (error) {
              console.error("Error in advanced trading algorithm:", error);
              // Fallback to simple trading
              if (Math.random() < 0.1) {
                get().botAutoTrade();
              }
            }
          }
          
          // Update portfolio value on each tick to ensure performance metrics stay current
          if (state.stockPortfolio.length > 0) {
            const updatedPortfolioValue = get().calculatePortfolioValue();
            if (updatedPortfolioValue !== state.portfolioValue) {
              set({ portfolioValue: updatedPortfolioValue });
            }
          }
          
          // Still run the old passive returns system for backward compatibility
          get().generateStockReturns();
        }
      },
      
      // Player Stats actions
      upgradeCPU: () => {
        // First check if we have enough money before any side effects
        const state = get();
        if (state.money < state.cpuCost) {
          console.log(`Cannot upgrade CPU: Not enough money. Have $${state.money.toFixed(2)}, need $${state.cpuCost.toFixed(2)}`);
          return;
        }

        // Calculate new values before updating state
        const newLevel = state.cpuLevel + 1;
        // Cost increases by 43.75% for each level (25% of original 175% scaling)
        const newCost = Math.floor(state.cpuCost * 1.4375);
        // Each CPU level increases memory regeneration rate by 0.5
        const newRegenRate = 1 + (newLevel - 1) * 0.5;
        
        console.log(`CPU upgraded to level ${newLevel}, new regen rate: ${newRegenRate}, new cost: ${newCost}`);
        
        // Update state with new values
        set({
          money: state.money - state.cpuCost,
          cpuLevel: newLevel,
          cpuCost: newCost,
          memoryRegenRate: newRegenRate
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        console.log(`CPU upgrade verified: Level ${updatedState.cpuLevel}, Cost: $${updatedState.cpuCost}, Regen Rate: ${updatedState.memoryRegenRate}`);
        
        // Force an immediate save to the database after upgrading CPU
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            console.log('Attempting to save after CPU upgrade');
            console.log('CRITICAL CPU COST TO BE SAVED:', newCost);
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              console.error('Cannot save game: window is undefined (server-side context)');
              return;
            }
            
            console.log('window exists:', !!window);
            console.log('window.saveGameNow exists:', !!window.saveGameNow);
            console.log('window.saveGameNow type:', typeof window.saveGameNow);
            
            // Force global flag for pending CPU save in the app context
            try {
              if (typeof window !== 'undefined') {
                window.__pendingCpuUpgrade = {
                  cost: newCost,
                  level: newLevel,
                  timestamp: new Date().getTime()
                };
                console.log('Set global __pendingCpuUpgrade flag');
              }
            } catch (e) {
              console.error('Error setting global flag:', e);
            }
            
            if (typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after CPU upgrade');
              window.saveGameNow()
                .then(() => {
                  console.log('CPU upgrade save completed successfully');
                  // Verify the state after saving
                  const finalState = get();
                  console.log('VERIFICATION - Final CPU Cost after save:', finalState.cpuCost);
                })
                .catch(saveErr => console.error('Error during CPU upgrade save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function');
              
              // Attempt to save using the save interval as a fallback
              console.log('Attempting to trigger a manual save event');
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingCpuUpgradeSave', 'true');
                localStorage.setItem('pendingCpuUpgradeCost', String(newCost));
                console.log('Set pendingCpuUpgradeSave flag in localStorage with cost:', newCost);
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after CPU upgrade:', err);
          }
        }, 100); // Reduced to 100ms for faster saving
      },
        
      upgradeMemory: () => {
        // First check if we have enough money before any side effects
        const state = get();
        if (state.money < state.memoryCost) {
          console.log(`Cannot upgrade Memory: Not enough money. Have $${state.money.toFixed(2)}, need $${state.memoryCost.toFixed(2)}`);
          return;
        }
        
        // Each upgrade adds 1 memory
        const newMemoryMax = state.memoryMax + 1;
        // Cost increases by 10% for each upgrade (increased from 1.25%)
        const newCost = Math.floor(state.memoryCost * 1.10); // 10% increase per level
        
        // OPs max is 50 x memory (increased from 10x)
        const newOpsMax = newMemoryMax * 50;
        
        console.log(`Upgrading memory: ${state.memoryMax} -> ${newMemoryMax}`);
        console.log(`Memory cost: $${state.memoryCost.toFixed(2)} -> $${newCost.toFixed(2)} (10% increase)`);
        console.log(`OPs capacity: ${state.opsMax} -> ${newOpsMax} (50 OPs per memory)`);
        
        // Update state with new values
        set({
          money: state.money - state.memoryCost,
          memoryMax: newMemoryMax,
          memory: Math.min(state.memory, newMemoryMax), // Cap current memory at new max
          memoryCost: newCost,
          opsMax: newOpsMax
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        console.log(`Memory upgrade verified: Max ${updatedState.memoryMax}, Cost: $${updatedState.memoryCost}, OPs max: ${updatedState.opsMax}`);
        
        // Force an immediate save to the database after upgrading Memory
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            console.log('Attempting to save after Memory upgrade');
            console.log('CRITICAL MEMORY COST TO BE SAVED:', newCost);
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              console.error('Cannot save game: window is undefined (server-side context)');
              return;
            }
            
            console.log('window exists:', !!window);
            console.log('window.saveGameNow exists:', !!window.saveGameNow);
            console.log('window.saveGameNow type:', typeof window.saveGameNow);
            
            // Force global flag for pending Memory save in the app context
            try {
              if (typeof window !== 'undefined') {
                window.__pendingMemoryUpgrade = {
                  cost: newCost,
                  max: newMemoryMax,
                  timestamp: new Date().getTime()
                };
                console.log('Set global __pendingMemoryUpgrade flag');
              }
            } catch (e) {
              console.error('Error setting global flag:', e);
            }
            
            if (typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after Memory upgrade');
              window.saveGameNow()
                .then(() => {
                  console.log('Memory upgrade save completed successfully');
                  // Verify the state after saving
                  const finalState = get();
                  console.log('VERIFICATION - Final Memory Cost after save:', finalState.memoryCost);
                })
                .catch(saveErr => console.error('Error during Memory upgrade save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function');
              
              // Attempt to save using the save interval as a fallback
              console.log('Attempting to trigger a manual save event');
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingMemoryUpgradeSave', 'true');
                localStorage.setItem('pendingMemoryCost', String(newCost));
                localStorage.setItem('pendingMemoryMax', String(newMemoryMax));
                console.log('Set pendingMemoryUpgradeSave flag in localStorage with cost:', newCost);
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after Memory upgrade:', err);
          }
        }, 100); // Reduced to 100ms for faster saving
      },
        
      regenerateMemory: () => 
        set((state) => {
          // Calculate how much memory to regenerate based on CPU level
          const regenAmount = state.memoryRegenRate / 10; // Divide by 10 because this runs 10 times per second
          const newMemory = Math.min(state.memory + regenAmount, state.memoryMax);
          
          if (newMemory === state.memory) {
            return state; // No change needed
          }
          
          return {
            memory: newMemory
          };
        }),
        
      useMemory: (amount: number) => {
        const state = get();
        // Check if there's enough memory
        if (state.memory < amount) {
          return false; // Not enough memory
        }
        
        // Use the memory
        set((state) => ({
          memory: state.memory - amount
        }));
        
        return true; // Successfully used memory
      },
      
      // Function to use OPs with immediate save functionality
      useOps: (amount: number) => {
        const state = get();
        console.log(`Attempting to use ${amount} OPs. Current OPs: ${state.ops}`);
        
        // Check if there's enough OPs
        if (state.ops < amount) {
          console.log(`Not enough OPs: have ${state.ops}, need ${amount}`);
          return false; // Not enough OPs
        }
        
        // Use the OPs
        set((state) => ({
          ops: state.ops - amount
        }));
        
        // Get updated state
        const updatedState = get();
        console.log(`Used ${amount} OPs. New OPs: ${updatedState.ops}/${updatedState.opsMax}`);
        
        // Force an immediate save to the database after using OPs
        setTimeout(() => {
          try {
            console.log('Attempting to save after OPs usage');
            
            // Set global flag for pending OPs update
            if (typeof window !== 'undefined') {
              window.__pendingOpsUpdate = {
                current: updatedState.ops,
                max: updatedState.opsMax,
                timestamp: new Date().getTime()
              };
              console.log('Set global __pendingOpsUpdate flag');
            }
            
            if (typeof window !== 'undefined' && typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after OPs usage');
              window.saveGameNow()
                .then(() => console.log('OPs usage save completed successfully'))
                .catch(saveErr => console.error('Error during OPs usage save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function or window is undefined');
              
              // Set a flag in localStorage as a fallback
              try {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('pendingOpsUpdate', 'true');
                  localStorage.setItem('pendingOpsCurrent', String(updatedState.ops));
                  console.log('Set pendingOpsUpdate flag in localStorage');
                }
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after OPs usage:', err);
          }
        }, 100);
        
        return true; // Successfully used OPs
      },
      
      // Buy an upgrade with Operations (OPs)
      buyOpsUpgrade: (id: string, cost: number) => {
        // First check if we have enough OPs before making any changes
        const state = get();
        
        // Debug info for troubleshooting
        console.log(`Buying Ops upgrade ${id} with cost ${cost}`);
        console.log(`Current ops: ${state.ops}`);
        console.log(`Current unlockedOpsUpgrades:`, state.unlockedOpsUpgrades);
        
        // List of non-repeatable upgrades
        const nonRepeatableUpgrades = ['distributedStorage'];
        
        // For non-repeatable upgrades, check if already purchased
        if (nonRepeatableUpgrades.includes(id) && state.unlockedOpsUpgrades.includes(id)) {
          console.log(`Cannot buy upgrade: ${id} is not repeatable and has already been purchased`);
          return false;
        }
        
        // Check if player has enough OPs
        if (state.ops < cost) {
          console.log(`Not enough OPs: have ${state.ops}, need ${cost}`);
          return false;
        }
        
        // Use OPs with the new useOps function which includes saving functionality
        if (!get().useOps(cost)) {
          console.log(`Failed to use ${cost} OPs for upgrade ${id}`);
          return false;
        }
        
        // Update the costs map with the new cost for this upgrade
        // Calculate the new cost (doubled from the current cost)
        const newCost = cost * 2;
        let upgradeCosts = { ...state.upgradeCosts };
        upgradeCosts[id] = newCost;
        console.log(`Updating cost for ${id}: ${cost} -> ${newCost}`);
        
        // Apply upgrade effects (without changing ops which is now handled by useOps)
        let updatedState: Partial<GameState> = {
          unlockedOpsUpgrades: [...state.unlockedOpsUpgrades, id],
          upgradeCosts: upgradeCosts // Save the updated costs
        };
        
        // Different effects based on the upgrade ID
        switch (id) {
          // Computational efficiency upgrades
          case 'parallelProcessing':
            // Count previous purchases to determine effect scaling
            const processingCount = state.unlockedOpsUpgrades.filter(id => id === 'parallelProcessing').length;
            // Base effect + 50% more for each previous purchase
            const cpuIncrease = 1 * (1 + (processingCount * 0.5));
            const opsIncrease = 50 * (1 + (processingCount * 0.5));
            
            updatedState.cpuLevel = state.cpuLevel + cpuIncrease;
            updatedState.opsMax = state.opsMax + opsIncrease;
            break;
            
          case 'quantumAlgorithms':
            // Count previous purchases to determine effect scaling
            const algorithmCount = state.unlockedOpsUpgrades.filter(id => id === 'quantumAlgorithms').length;
            // Base effect + 50% more for each previous purchase
            const researchMultiplier = 1.5 * (1 + (algorithmCount * 0.5));
            
            updatedState.researchPointsPerSecond = state.researchPointsPerSecond * researchMultiplier;
            break;
            
          case 'neuralOptimization':
            // Count previous purchases to determine effect scaling
            const neuralCount = state.unlockedOpsUpgrades.filter(id => id === 'neuralOptimization').length;
            // Base effect + 50% more for each previous purchase
            const prodMultiplier = 1.25 * (1 + (neuralCount * 0.5));
            
            // Ensure production multiplier never goes negative
            const newProdMultiplier = state.productionMultiplier * prodMultiplier;
            updatedState.productionMultiplier = Math.max(0.1, newProdMultiplier);
            
            // Log for debugging
            console.log(`Neural Optimization upgrade: Production multiplier ${state.productionMultiplier} * ${prodMultiplier} = ${newProdMultiplier} (capped at ${updatedState.productionMultiplier})`);
            break;
          
          // Memory management upgrades
          case 'memoryCompression':
            // Count previous purchases to determine effect scaling
            const compressionCount = state.unlockedOpsUpgrades.filter(id => id === 'memoryCompression').length;
            // Base effect + 50% more for each previous purchase
            const memoryIncrease = 2 * (1 + (compressionCount * 0.5));
            
            const newMemoryMax = state.memoryMax + memoryIncrease;
            updatedState.memoryMax = newMemoryMax;
            // Update OPs max when memory increases (50 OPs per memory)
            updatedState.opsMax = newMemoryMax * 50;
            break;
            
          case 'cacheOptimization':
            // Count previous purchases to determine effect scaling
            const cacheCount = state.unlockedOpsUpgrades.filter(id => id === 'cacheOptimization').length;
            // Base effect + 50% more for each previous purchase
            const regenMultiplier = 1.5 * (1 + (cacheCount * 0.5));
            
            updatedState.memoryRegenRate = state.memoryRegenRate * regenMultiplier;
            break;
            
          case 'distributedStorage':
            // Count previous purchases to determine effect scaling
            const storageCount = state.unlockedOpsUpgrades.filter(id => id === 'distributedStorage').length;
            // Always double the memory, regardless of previous purchases (more powerful)
            const storageMultiplier = 2.0;
            
            const newMemory = state.memoryMax * storageMultiplier;
            updatedState.memoryMax = newMemory;
            // Update OPs max when memory increases (50 OPs per memory)
            updatedState.opsMax = newMemory * 50;
            
            console.log(`Distributed Storage purchased! Memory: ${state.memoryMax} → ${newMemory}, OPs capacity: ${state.opsMax} → ${newMemory * 50}`);
            break;
          
          // Market analysis upgrades
          case 'marketPrediction':
            // Count previous purchases to determine effect scaling
            const predictionCount = state.unlockedOpsUpgrades.filter(id => id === 'marketPrediction').length;
            // Base effect + 50% more for each previous purchase (0.8 becomes 0.7, 0.6, etc.)
            const volatilityReduction = 0.8 - (predictionCount * 0.1);
            // Ensure we don't go below minimum
            const newVolatility = Math.max(0.05, state.volatility * volatilityReduction);
            
            // Reduce market volatility
            updatedState.volatility = newVolatility;
            break;
            
          case 'trendAnalysis':
            // Count previous purchases to determine effect scaling
            const trendCount = state.unlockedOpsUpgrades.filter(id => id === 'trendAnalysis').length;
            // Base effect + 50% more for each previous purchase
            const intelligenceIncrease = 1 * (1 + (trendCount * 0.5));
            
            // Enhance bot intelligence
            updatedState.botIntelligence = state.botIntelligence + intelligenceIncrease;
            break;
            
          case 'highFrequencyTrading':
            // Make bots trade faster - implement in botAutoTrade function
            break;
        }
        
        console.log(`Purchased OPs upgrade: ${id} for ${cost} OPs`);
        
        // Update state with new values
        set(updatedState);
        
        // Verify state was updated correctly
        const updatedStateResult = get();
        console.log(`OPs upgrade '${id}' verified: OPs: ${updatedStateResult.ops}, Upgrades: ${updatedStateResult.unlockedOpsUpgrades.length}`);
        
        // Force an immediate save to the database after buying OPs upgrade
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            console.log('Attempting to save after OPs upgrade purchase');
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              console.error('Cannot save game: window is undefined (server-side context)');
              return;
            }
            
            console.log('window exists:', !!window);
            console.log('window.saveGameNow exists:', !!window.saveGameNow);
            console.log('window.saveGameNow type:', typeof window.saveGameNow);
            
            if (typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after OPs upgrade purchase');
              window.saveGameNow()
                .then(() => console.log('OPs upgrade save completed successfully'))
                .catch(saveErr => console.error('Error during OPs upgrade save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function');
              
              // Attempt to save using the save interval as a fallback
              console.log('Attempting to trigger a manual save event');
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingOpsUpgradeSave', 'true');
                localStorage.setItem('pendingOpsUpgradeId', id);
                console.log('Set pendingOpsUpgradeSave flag in localStorage');
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after OPs upgrade purchase:', err);
          }
        }, 250); // Increased timeout to 250ms for more reliability
        
        return true;
      },
        
      // Buy an upgrade with Creativity
      buyCreativityUpgrade: (id: string, cost: number) => {
        // First check if we have enough creativity before making any changes
        const state = get();
        
        // Debug info for troubleshooting
        console.log(`Buying Creativity upgrade ${id} with cost ${cost}`);
        console.log(`Current creativity: ${state.creativity}`);
        console.log(`Creativity unlocked: ${state.creativityUnlocked}`);
        console.log(`Current unlockedCreativityUpgrades:`, state.unlockedCreativityUpgrades);
        
        // Skip if already unlocked or creativity not unlocked
        if (!state.creativityUnlocked) {
          console.log(`Cannot buy creativity upgrade: Creativity not unlocked yet`);
          return false;
        }
        
        if (state.unlockedCreativityUpgrades.includes(id)) {
          console.log(`Cannot buy creativity upgrade: ${id} already purchased`);
          return false;
        }
        
        // Check if player has enough creativity
        if (state.creativity < cost) {
          console.log(`Not enough creativity: have ${state.creativity}, need ${cost}`);
          return false;
        }
        
        // Apply upgrade effects
        let updatedState: Partial<GameState> = {
          creativity: state.creativity - cost,
          unlockedCreativityUpgrades: [...state.unlockedCreativityUpgrades, id]
        };
        
        // Different effects based on the upgrade ID
        switch (id) {
          // Production creativity upgrades
          case 'algorithmicDesign':
            updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 1.5);
            break;
          case 'selfImprovement':
            updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 2;
            break;
          case 'quantumEntanglement':
            updatedState.botIntelligence = state.botIntelligence + 3;
            break;
            
          // Resource management creativity upgrades
          case 'resourceSynthesis':
            updatedState.wirePerSpool = state.wirePerSpool * 2;
            break;
          case 'matterReplication':
            // Add paperclips - one-time boost
            updatedState.paperclips = state.paperclips + 1000000;
            break;
          case 'temporalEfficiency':
            // Make everything run faster - implemented in tick functions
            break;
            
          // Trust upgrades
          case 'trustFramework':
            updatedState.trust = state.trust + 5;
            break;
          case 'consciousnessExpansion':
            updatedState.memoryMax = state.memoryMax * 3;
            // Calculate new OPs max based on the new memory value (50 OPs per memory)
            updatedState.opsMax = (state.memoryMax * 3) * 50;
            break;
          case 'singularityInsight':
            // Ultimate upgrade - massive boosts to everything
            updatedState.productionMultiplier = Math.max(0.1, state.productionMultiplier * 10);
            updatedState.trust = state.trust + 20;
            updatedState.memoryMax = state.memoryMax * 10;
            // Calculate new OPs max based on the new memory value (50 OPs per memory)
            updatedState.opsMax = (state.memoryMax * 10) * 50;
            break;
        }
        
        console.log(`Purchased Creativity upgrade: ${id} for ${cost} creativity points`);
        
        // Update state with new values
        set(updatedState);
        
        // Verify state was updated correctly
        const updatedStateResult = get();
        console.log(`Creativity upgrade '${id}' verified: Creativity: ${updatedStateResult.creativity}, Upgrades: ${updatedStateResult.unlockedCreativityUpgrades.length}`);
        
        // Force an immediate save to the database after buying Creativity upgrade
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            console.log('Attempting to save after Creativity upgrade purchase');
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              console.error('Cannot save game: window is undefined (server-side context)');
              return;
            }
            
            console.log('window exists:', !!window);
            console.log('window.saveGameNow exists:', !!window.saveGameNow);
            console.log('window.saveGameNow type:', typeof window.saveGameNow);
            
            if (typeof window.saveGameNow === 'function') {
              console.log('Forcing game save after Creativity upgrade purchase');
              window.saveGameNow()
                .then(() => console.log('Creativity upgrade save completed successfully'))
                .catch(saveErr => console.error('Error during Creativity upgrade save operation:', saveErr));
            } else {
              console.error('Cannot save game: window.saveGameNow is not a function');
              
              // Attempt to save using the save interval as a fallback
              console.log('Attempting to trigger a manual save event');
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingCreativityUpgradeSave', 'true');
                localStorage.setItem('pendingCreativityUpgradeId', id);
                console.log('Set pendingCreativityUpgradeSave flag in localStorage');
              } catch (e) {
                console.error('Could not set localStorage flag:', e);
              }
            }
          } catch (err) {
            console.error('Error saving game after Creativity upgrade purchase:', err);
          }
        }, 250); // Increased timeout to 250ms for more reliability
        
        return true;
      },
      
      // Stats tick - regenerates memory and generates yomi
      statsTick: () => {
        get().regenerateMemory();
        get().trustTick();
        get().opsTick();
        
        // Generate yomi if CPU is at least 30
        const state = get();
        if (state.cpuLevel >= 30) {
          const yomiRate = (state.memory + state.cpuLevel) * 0.005 / 10; // Divide by 10 because this runs 10 times per second
          set((state) => ({
            yomi: state.yomi + yomiRate
          }));
        }
      },
      
      // Trust tick - generates trust based on total paperclips made
      trustTick: () => 
        set((state) => {
          // Check if player has reached the next trust threshold
          if (state.totalPaperclipsMade < state.nextTrustAt) {
            return state; // Not enough paperclips made yet
          }
          
          // Calculate new trust level
          const newTrustLevel = state.trustLevel + 1;
          
          // Calculate next trust threshold (increases by 100% each level)
          const newNextTrustAt = state.nextTrustAt * 2;
          
          console.log(`Trust Level Up: ${state.trustLevel} -> ${newTrustLevel}`);
          console.log(`Next trust at: ${newNextTrustAt} paperclips`);
          
          return {
            trust: state.trust + 1,
            trustLevel: newTrustLevel,
            nextTrustAt: newNextTrustAt
          };
        }),
        
      // OPs tick - generates OPs based on memory and CPU and scales production multiplier
      opsTick: () => 
        set((state) => {
          // Calculate OPs generation rate based on CPU level (10x faster than original)
          const opsRate = (state.cpuLevel * 1.0) / 10; // 1.0 per CPU level per second (10x the original 0.1) - Divided by 10 because this runs 10 times per second
          
          // New OPs value
          const newOps = Math.min(state.ops + opsRate, state.opsMax);
          
          // Calculate OPs contribution to production multiplier (scales linearly)
          // At 5,000 OPs, the OPs contribution adds 50 to the multiplier (much better scaling)
          const opsMultiplier = newOps / 100; // This gives +50 at 5,000 OPs
          
          // Calculate the base production multiplier without OPs contribution
          // First, subtract the current OPs multiplier to get the base multiplier
          const baseMultiplier = state.productionMultiplier - (state.opsProductionMultiplier || 0);
          
          // Then add the new OPs multiplier to get the new total
          const newProductionMultiplier = baseMultiplier + opsMultiplier;
          
          // Recalculate clicks per second based on the new production multiplier
          const clicksPerSecond = state.autoclippers * 1 * newProductionMultiplier;
          
          // Generate creativity if OPs are maxed out and creativity is unlocked
          let newCreativity = state.creativity;
          if (newOps >= state.opsMax && state.ops >= state.opsMax) {
            // Generate 0.1 creativity per second when OPs are maxed
            newCreativity += 0.01; // 0.1/10 because this runs 10 times per second
            
            // Unlock creativity if we have enough OPs capacity (changed from 20000 to 5000)
            const creativityUnlocked = state.creativityUnlocked || state.opsMax >= 5000;
            
            if (creativityUnlocked && !state.creativityUnlocked) {
              console.log("Creativity unlocked! OPs Max capacity reached 5000");
              // Force immediate save to persist the unlocked state
              if (typeof window !== 'undefined' && window.saveGameNow) {
                setTimeout(() => window.saveGameNow(), 100);
              }
            }
            
            return {
              ops: newOps,
              productionMultiplier: Math.max(0.1, newProductionMultiplier),
              clicks_per_second: clicksPerSecond,
              opsProductionMultiplier: opsMultiplier,
              creativity: newCreativity,
              creativityUnlocked
            };
          }
          
          // Just update OPs and multiplier if we didn't generate creativity
          if (newOps !== state.ops) {
            return { 
              ops: newOps,
              productionMultiplier: Math.max(0.1, newProductionMultiplier),
              clicks_per_second: clicksPerSecond,
              opsProductionMultiplier: opsMultiplier
            };
          }
          
          return state; // No change
        }),

      // Reset game state
      resetGame: () => 
        set((state) => ({
          // Preserve authentication and user data
          userId: state.userId,
          isAuthenticated: state.isAuthenticated,
          // Resources
          paperclips: 0,
          money: 0, // Start with $0
          wire: 1000, // Start with 1000 wire
          yomi: 0, // Reset yomi
          
          // Unlockable Features
          metricsUnlocked: false,
          
          // Production
          autoclippers: 0,
          autoclipper_cost: 5, // Reduced from 10
          clicks_per_second: 0,
          clickMultiplier: 1,
          totalClicks: 0,
          totalPaperclipsMade: 0,
          revenuePerSecond: 0,
          productionMultiplier: 1,
          megaClippers: 0,
          megaClipperCost: 5000,
          megaClippersUnlocked: false,
          
          // Wire production
          spoolCost: 5,
          wirePerSpool: 1000,
          autoWireBuyer: false,
          autoWireBuyerCost: 100,
          spoolSizeUpgradeCost: 125,
          spoolSizeLevel: 1,
          lastWirePurchaseTime: new Date(),
          wirePurchaseCount: 0,
          
          // Market data
          paperclipPrice: 0.25,
          marketDemand: 10,
          paperclipsSold: 0,
          totalSales: 0,
          
          // Market parameters
          basePaperclipPrice: 0.25,
          elasticity: 3,
          marketTrend: 0,
          seasonalMultiplier: 1,
          volatility: 0.15,
          maxDemand: 50,
          minDemand: 1,
          marketDemandLevel: 1,
          marketDemandUpgradeCost: 200,
          
          // Research
          researchPoints: 0,
          researchPointsPerSecond: 0.5,
          unlockedResearch: [],
          
          // Stock Market
          stockMarketUnlocked: false,
          tradingBots: 0,
          tradingBotCost: 1000,
          botIntelligence: 1, // Force to exactly 1
          botIntelligenceCost: 1500,
          botTradingBudget: 0, 
          botLastTradeTime: new Date(), // Initialize to current time as a fallback
          botTradingProfit: 0, // Reset bot trading profit
          botTradingLosses: 0, // Reset bot trading losses
          stockMarketReturns: 0,
          stockMarketInvestment: 0,
          stockMarketLastUpdate: new Date(),
          stockPortfolio: [],
          stockPriceHistory: {},
          portfolioValue: 0,
          stockTrendData: {},
          
          // Player Stats
          cpuLevel: 1,
          cpuCost: 25, // Reduced to 25% of original cost (was 100)
          memory: 1,
          memoryMax: 1,
          memoryCost: 10, // Reduced to 10% of original cost (was 100)
          memoryRegenRate: 1,
          
          // Advanced Resources
          trust: 0,
          trustLevel: 0,
          nextTrustAt: 100000,
          unlockedTrustAbilities: [],
          purchasedTrustLevels: [],
          ops: 50, // Increased from 10 to 50 (50 OPs per memory)
          opsMax: 50, // Increased from 10 to 50 (50 OPs per memory)
          creativity: 0,
          creativityUnlocked: false,
          unlockedOpsUpgrades: [],
          unlockedCreativityUpgrades: [],
          
          // Space Age
          spaceAgeUnlocked: false,
          spaceStats: {
            speed: 1,
            exploration: 1,
            selfReplication: 1,
            wireProduction: 1,
            miningProduction: 1,
            factoryProduction: 1
          },
          
          // OPs Production Multiplier
          opsProductionMultiplier: 1,
          
          // Navigation
          currentPage: 'game',
          
          // Meta
          lastSaved: new Date(),
          lastPriceUpdate: new Date(),
          
          // Visual settings
          visualFX: {
            particleIntensity: 1,
            clickAnimations: true,
            floatingText: true,
          },
        })),
    }),
    {
      name: (state) => `paperclip-game-storage-${state.userId || 'guest'}`,
      partialize: (state) => ({
        // User identification (included so userId is part of persisted state)
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
        // Resources
        paperclips: state.paperclips,
        money: state.money,
        wire: state.wire,
        yomi: state.yomi,
        
        // Unlockable Features
        metricsUnlocked: state.metricsUnlocked,
        
        // Production
        autoclippers: state.autoclippers,
        autoclipper_cost: state.autoclipper_cost,
        clicks_per_second: state.clicks_per_second,
        clickMultiplier: state.clickMultiplier,
        totalClicks: state.totalClicks,
        totalPaperclipsMade: state.totalPaperclipsMade,
        revenuePerSecond: state.revenuePerSecond,
        productionMultiplier: state.productionMultiplier,
        megaClippers: state.megaClippers,
        megaClipperCost: state.megaClipperCost,
        megaClippersUnlocked: state.megaClippersUnlocked,
        
        // Wire production
        spoolCost: state.spoolCost,
        wirePerSpool: state.wirePerSpool,
        autoWireBuyer: state.autoWireBuyer,
        autoWireBuyerCost: state.autoWireBuyerCost,
        spoolSizeUpgradeCost: state.spoolSizeUpgradeCost,
        spoolSizeLevel: state.spoolSizeLevel,
        lastWirePurchaseTime: state.lastWirePurchaseTime,
        wirePurchaseCount: state.wirePurchaseCount,
        
        // Market data
        paperclipPrice: state.paperclipPrice,
        marketDemand: state.marketDemand,
        paperclipsSold: state.paperclipsSold,
        totalSales: state.totalSales,
        
        // Market parameters
        basePaperclipPrice: state.basePaperclipPrice,
        elasticity: state.elasticity,
        marketTrend: state.marketTrend,
        seasonalMultiplier: state.seasonalMultiplier,
        volatility: state.volatility,
        maxDemand: state.maxDemand,
        minDemand: state.minDemand,
        marketDemandLevel: state.marketDemandLevel,
        marketDemandUpgradeCost: state.marketDemandUpgradeCost,
        
        // Research
        researchPoints: state.researchPoints,
        researchPointsPerSecond: state.researchPointsPerSecond,
        unlockedResearch: state.unlockedResearch,
        
        // Stock Market
        stockMarketUnlocked: state.stockMarketUnlocked,
        tradingBots: state.tradingBots,
        tradingBotCost: state.tradingBotCost,
        botIntelligence: state.botIntelligence || 1, // Ensure it's never null
        botIntelligenceCost: state.botIntelligenceCost,
        botTradingBudget: state.botTradingBudget,
        botLastTradeTime: state.botLastTradeTime,
        botTradingProfit: state.botTradingProfit,
        botTradingLosses: state.botTradingLosses,
        stockMarketReturns: state.stockMarketReturns,
        stockMarketInvestment: state.stockMarketInvestment,
        stockPortfolio: state.stockPortfolio,
        stockPriceHistory: state.stockPriceHistory,
        portfolioValue: state.portfolioValue,
        
        // Stock trend data - persistence to survive page refresh
        stockTrendData: state.stockTrendData || {},
        
        // Player Stats
        cpuLevel: state.cpuLevel,
        cpuCost: state.cpuCost,
        memory: state.memory,
        memoryMax: state.memoryMax,
        memoryCost: state.memoryCost,
        memoryRegenRate: state.memoryRegenRate,
        
        // Advanced Resources
        trust: state.trust,
        trustLevel: state.trustLevel,
        nextTrustAt: state.nextTrustAt,
        unlockedTrustAbilities: state.unlockedTrustAbilities,
        ops: state.ops,
        opsMax: state.opsMax,
        creativity: state.creativity,
        creativityUnlocked: state.creativityUnlocked,
        unlockedOpsUpgrades: state.unlockedOpsUpgrades,
        unlockedCreativityUpgrades: state.unlockedCreativityUpgrades,
        
        // Space Age
        spaceAgeUnlocked: state.spaceAgeUnlocked,
        spaceStats: state.spaceStats,
        probes: state.probes,
        universeExplored: state.universeExplored,
        wireHarvesters: state.wireHarvesters,
        oreHarvesters: state.oreHarvesters,
        factories: state.factories,
        spaceWirePerSecond: state.spaceWirePerSecond,
        spaceOrePerSecond: state.spaceOrePerSecond,
        spacePaperclipsPerSecond: state.spacePaperclipsPerSecond,
        totalSpaceMatter: state.totalSpaceMatter,
        spaceMatter: state.spaceMatter,
        spaceOre: state.spaceOre,
        spaceWire: state.spaceWire,
        opsProductionMultiplier: state.opsProductionMultiplier,
        
        // Navigation
        currentPage: state.currentPage,
        
        // Visual settings
        visualFX: state.visualFX,
      }),
    }
  )
);

export default useGameStore;
