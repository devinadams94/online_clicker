"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, MarketData, Stock, StockHolding } from "@/types/game";
// Import type fixes
import "@/types/typeFixJuly2025";
import { criticalStateManager } from './criticalStateManager';
import { StateValidator } from './stateValidator';
import { 
  calculateDemand, 
  updateMarketTrend, 
  updateSeasonalMultiplier, 
  calculateSales,
  getDayOfYear
} from "@/utils/marketUtils";
// Import space extension functions
import { addSpaceFunctions } from "./spaceExtension";
// Import trading bot algorithm
import * as tradingAlgorithm from "./tradingBotAlgorithm";

// Helper function to ensure a value is a valid Date object
const ensureDate = (dateValue: any): Date => {
  if (!dateValue) {
    return new Date();
  }
  
  if (dateValue instanceof Date) {
    // Check if the date is valid
    if (!isNaN(dateValue.getTime())) {
      return dateValue;
    }
  }
  
  // Try to create a Date from the value
  try {
    const newDate = new Date(dateValue);
    if (!isNaN(newDate.getTime())) {
      return newDate;
    }
  } catch (e) {
    // If conversion fails, return current date
    console.error("Failed to convert date:", dateValue, e);
  }
  
  // Default to current date if all else fails
  return new Date();
};

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
  
  // Prestige actions
  calculatePrestigePoints: () => number;
  prestigeReset: () => void;
  applyPrestigeRewards: () => void;
  
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
  buyMemoryUpgrade: (id: string, cost: number) => void;
  
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
  incrementBattlesWon: () => void;
  
  // Energy infrastructure
  buildSolarArray: () => void;
  buildBattery: () => void;
  buildSolarArrayBulk: (amount: number) => void;
  buildBatteryBulk: (amount: number) => void;
  
  // Space Market
  sellSpacePaperclips: (amount: number) => void;
  sellSpaceAerograde: (amount: number) => void;
  sellSpaceOre: (amount: number) => void;
  sellSpaceWire: (amount: number) => void;
  updateSpaceMarket: () => void;
  unlockSpaceAutoSell: () => void;
  toggleSpaceAutoSell: () => void;
  unlockSpaceSmartPricing: () => void;
  toggleSpaceSmartPricing: () => void;
  spaceAutoSellTick: () => void;
  
  // Space upgrade purchase functions
  buySpaceUpgrade: (id: string, cost: number) => void;
  buyMoneySpaceUpgrade: (id: string, cost: number) => void;
  buyOpsSpaceUpgrade: (id: string, cost: number) => void;
  buyCreativitySpaceUpgrade: (id: string, cost: number) => void;
  buyYomiSpaceUpgrade: (id: string, cost: number) => void;
  buyTrustSpaceUpgrade: (id: string, cost: number) => void;
  buyEnergySpaceUpgrade: (id: string, cost: number) => void;
  
  // Game loop
  tick: () => void;
  marketTick: () => void;
  researchTick: () => void;
  stockMarketTick: () => void;
  statsTick: () => void;
  trustTick: () => void;
  opsTick: () => void;
  batchedTick: () => void; // New optimized tick that batches all updates
  
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
  
  // Play time tracking
  updatePlayTime: () => void;
}

// Use type assertion to work around zustand persist typing issue
const useGameStore = create<GameStore>(
  (persist as any)(
    (set: (state: Partial<GameState>) => void, get: () => GameState) => ({
      // Add space functions from spaceExtension.ts
      ...addSpaceFunctions(set, get),
      
      // Prestige System
      prestigeLevel: 0,
      prestigePoints: 0,
      lifetimePaperclips: 0,
      prestigeRewards: {
        productionMultiplier: 1,
        researchMultiplier: 1,
        wireEfficiency: 1,
        startingMoney: 0,
        clickMultiplier: 1
      },
      
      // Resources
      paperclips: 0,
      money: 0, // Start with $0 (changed from $50)
      wire: 1000, // Start with 1000 wire
      yomi: 0, // Yomi resource
      diamonds: 0, // Premium currency
      totalDiamondsSpent: 0,
      totalDiamondsPurchased: 0,
      premiumUpgrades: [] as string[], // Purchased premium upgrades
      activePlayTime: 0,
      lastDiamondRewardTime: 0,
      
      // Advanced Resources
      trust: 0,
      trustLevel: 0,
      nextTrustAt: 100000,
      totalAerogradePaperclips: 0,
      nextAerogradeTrustAt: 10000000000, // 10 billion
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
        factoryProduction: 1,
        hazardEvasion: 1
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
      aerogradePaperclips: 0, // Space age premium currency
      
      // Probe defection system
      enemyShips: 0,
      defectionRate: 0.001, // 0.1% base defection chance per probe per tick
      lastDefectionTime: new Date(),
      totalProbesLost: 0,
      defectionEvents: [],
      
      // Energy System
      solarArrays: 0,
      batteries: 0,
      energy: 0,
      maxEnergy: 0,
      energyPerSecond: 0,
      // Space Combat
      autoBattleEnabled: false,    // Whether auto-battle is enabled
      autoBattleUnlocked: false,   // Whether auto-battle has been unlocked
      battlesWon: 0,               // Track number of battles won
      battleDifficulty: 1,         // Difficulty multiplier for battles
      
      // Space upgrade tracking arrays
      unlockedSpaceUpgrades: [],
      unlockedMoneySpaceUpgrades: [],
      unlockedOpsSpaceUpgrades: [],
      unlockedCreativitySpaceUpgrades: [],
      unlockedYomiSpaceUpgrades: [],
      unlockedTrustSpaceUpgrades: [],
      unlockedEnergySpaceUpgrades: [],
      
      // Space upgrade bonuses
      spaceInfrastructureBonus: 1,
      passiveIncomeRate: 0,
      opsGenerationRate: 0,
      creativityBonus: 1,
      costReductionBonus: 1,
      diplomacyBonus: 1,
      wireProductionBonus: 1,
      factoryProductionBonus: 1,
      oreProductionBonus: 1,
      miningEfficiency: 1,
      droneEfficiency: 1,
      factoryEfficiency: 1,
      explorationSpeed: 1,
      nanobotRepairEnabled: false,
      honor: 0,
      
      // OPs Production Multiplier (already defined above)
      creativityUnlocked: false,
      unlockedOpsUpgrades: [],
      unlockedCreativityUpgrades: [],
      unlockedMemoryUpgrades: [],
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
      highestRun: 0,
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
      
      // Space Market
      spaceMarketDemand: 100,
      spaceMarketMaxDemand: 500,
      spaceMarketMinDemand: 10,
      spacePaperclipPrice: 0.50,
      spaceAerogradePrice: 50.00,
      spaceOrePrice: 5.00,
      spaceWirePrice: 10.00,
      spaceMarketTrend: 0,
      spaceMarketVolatility: 0.20,
      spacePaperclipsSold: 0,
      spaceAerogradeSold: 0,
      spaceOreSold: 0,
      spaceWireSold: 0,
      spaceTotalSales: 0,
      spaceAutoSellEnabled: false,
      spaceAutoSellUnlocked: false,
      spaceSmartPricingEnabled: false,
      spaceSmartPricingUnlocked: false,
      
      // Research
      researchPoints: 0,
      researchPointsPerSecond: 0.5, // Base research production (increased from 0.1)
      unlockedResearch: [],
      
      // Stock Market
      stockMarketUnlocked: false,
      tickCount: 0,
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
      clickPaperclip: () => set((state: GameState) => {
        // Check if there's enough wire
        if (state.wire < 1) {
          return state; // Not enough wire
        }
        
        // Apply prestige rewards to click production
        const prestigeClickMultiplier = state.prestigeRewards?.clickMultiplier || 1;
        const wireEfficiency = state.prestigeRewards?.wireEfficiency || 1;
        
        // Calculate clips made with all multipliers applied
        const clipsMade = 1 * state.clickMultiplier * prestigeClickMultiplier;
        
        // Calculate wire used (improved efficiency from prestige)
        const wireUsed = Math.max(0.1, 1 / wireEfficiency); // Minimum 0.1 wire per click
        
        return { 
          paperclips: state.paperclips + clipsMade,
          wire: state.wire - wireUsed, // Consume wire with efficiency bonus
          totalClicks: state.totalClicks + 1,
          totalPaperclipsMade: state.totalPaperclipsMade + clipsMade
        };
      }),

      // Buy autoclipper upgrade (using money instead of paperclips)
      buyAutoclipper: () => 
        set((state: GameState) => {
          // Check if player has enough money
          if (state.money < state.autoclipper_cost) {
            return state;
          }

          const newAutoclippers = state.autoclippers + 1;
          const newMoney = state.money - state.autoclipper_cost;
          
          // Cost increases by 8% for each purchase (reduced from 10%)
          const newCost = Math.floor(state.autoclipper_cost * 1.08 * 100) / 100;
          
          // Each autoclipper produces 1 paperclip per second
          // Set to 10 clips per second per autoclipper, so when divided by 10 in the tick function, 
          // we get 1 paperclip per second per autoclipper
          // Don't apply multiplier here - it's applied in the tick function
          const newClicksPerSecond = newAutoclippers * 10;
          
          // Check if we should unlock Mega-Clippers at 100 autoclippers
          const megaClippersUnlocked = newAutoclippers >= 100 ? true : state.megaClippersUnlocked;

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
          return;
        }
        
        if (state.money < state.megaClipperCost) {
          return;
        }
        
        // Calculate new values
        const newMegaClippers = state.megaClippers + 1;
        const newMoney = state.money - state.megaClipperCost;
        
        // Cost increases by 15% for each purchase
        const newCost = Math.floor(state.megaClipperCost * 1.15 * 100) / 100;
        
        // Each mega clipper adds +1.0 to the production multiplier
        const newProductionMultiplier = state.productionMultiplier + 1.0;
        
        // Recalculate production rate
        // Don't apply multiplier here - it's applied in the tick function
        // Multiply by 10 for consistent 1 paperclip per second per autoclipper
        const newClicksPerSecond = state.autoclippers * 10;
        
        // Update state with new values
        set({
          money: newMoney,
          megaClippers: newMegaClippers,
          megaClipperCost: newCost,
          productionMultiplier: newProductionMultiplier,
          clicks_per_second: newClicksPerSecond
        });
        
        // Force an immediate save to the database after buying Mega-Clipper
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            if (typeof window === 'undefined') {
              return;
            }
            
            if (typeof window.saveGameNow === 'function') {
              window.saveGameNow().catch(() => {});
            } else {
              // Attempt to save using the save interval as a fallback
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingMegaClipperSave', 'true');
              } catch (e) {
                // Silently fail
              }
            }
          } catch (err) {
            // Silently fail
          }
        }, 250); // Increased timeout to 250ms for more reliability
      },
        
      // Buy click multiplier upgrade (using money instead of paperclips)
      buyClickMultiplier: () => 
        set((state: GameState) => {
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
        set((state: GameState) => {
          // Ensure price isn't negative or unreasonably high
          const safePrice = Math.max(0.01, Math.min(price, 1));
          
          // Recalculate demand immediately when price changes
          const newDemand = calculateDemand(
            safePrice,
            state.basePaperclipPrice,
            state.maxDemand,
            state.elasticity,
            state.minDemand,
            state.marketTrend,
            state.seasonalMultiplier,
            state.volatility,
            state.marketDemandLevel
          );
          
          return { 
            paperclipPrice: safePrice,
            marketDemand: newDemand
          };
        }),
      
      // Sell paperclips based on current demand and price
      sellPaperclips: () => 
        set((state: GameState) => {
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
        set((state: GameState) => {
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
        set((state: GameState) => {
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
          
          
          // Add special messages for notable market demand levels
          if (newLevel === 5) {
          } else if (newLevel === 10) {
          } else if (newLevel === 15) {
          } else if (newLevel === 20) {
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
        set((state: GameState) => {
          // First handle auto wire buying if enabled and wire is low
          let updatedState = { ...state };
          
          // Handle passive income from space upgrades and premium upgrades
          if (state.passiveIncomeRate > 0 || (state.premiumUpgrades && state.premiumUpgrades.includes('time_warp'))) {
            // Space passive income is per second, so divide by 10 for tick rate
            const spacePassiveIncome = (state.passiveIncomeRate || 0) / 10;
            updatedState.money = updatedState.money + spacePassiveIncome;
          }
          
          // Auto wire buyer: buy wire when below 10% capacity
          if (state.autoWireBuyer && state.wire < state.wirePerSpool * 0.1 && state.money >= state.spoolCost) {
            // Update purchase count and time for dynamic pricing - same logic as buyWireSpool
            const now = new Date();
            // Use our helper function to ensure we have a valid date
            const lastPurchaseTime = ensureDate(state.lastWirePurchaseTime);
            const timeSinceLastPurchase = now.getTime() - lastPurchaseTime.getTime();
            const newWirePurchaseCount = state.wirePurchaseCount + 1;
            
            // Dynamic pricing: Increase cost based on frequency of purchases
            // Decays over time (5 minute cooldown)
            const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
            const purchaseCountFactor = Math.min(1, newWirePurchaseCount / 10); // Maxes out after 10 purchases
            
            // Calculate new cost with minimum of base cost and maximum of $250
            const baseCost = 5 * state.spoolSizeLevel;
            const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50;
            const newCost = Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
            
            
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
          // Apply production multiplier (base + OPs bonus + prestige bonus + premium upgrades) to the base rate
          const prestigeProductionMultiplier = state.prestigeRewards?.productionMultiplier || 1;
          
          // Check for diamond clipper premium upgrade
          // Calculate premium multipliers with stacking support
          let premiumMultiplier = 1;
          
          // Diamond clippers (1000x per purchase, stacking)
          const diamondClippersCount = (state.premiumUpgrades || []).filter((id: string) => id === 'diamond_clippers').length;
          if (diamondClippersCount > 0) {
            premiumMultiplier *= Math.pow(1000, diamondClippersCount);
          }
          
          // Quantum factory (2x per purchase, stacking)
          const quantumFactoryCount = (state.premiumUpgrades || []).filter((id: string) => id === 'quantum_factory').length;
          if (quantumFactoryCount > 0) {
            premiumMultiplier *= Math.pow(2, quantumFactoryCount);
          }
          
          const totalMultiplier = (state.productionMultiplier + (state.opsProductionMultiplier || 0)) * prestigeProductionMultiplier * premiumMultiplier;
          // tick runs 10 times per second, so divide by 10 to get production per tick
          const potentialProduction = (state.clicks_per_second * totalMultiplier) / 10;
          
          // Check if there's enough wire
          if (updatedState.wire <= 0) {
            return updatedState; // No wire available
          }
          
          // Apply wire efficiency from prestige rewards
          const wireEfficiency = state.prestigeRewards?.wireEfficiency || 1;
          
          // Calculate actual production based on available wire (with efficiency bonus)
          const _wireNeeded = potentialProduction / wireEfficiency;
          const actualProduction = Math.min(potentialProduction, updatedState.wire * wireEfficiency);
          
          // Update resources
          return { 
            ...updatedState,
            paperclips: updatedState.paperclips + actualProduction,
            wire: updatedState.wire - (actualProduction / wireEfficiency),
            totalPaperclipsMade: updatedState.totalPaperclipsMade + actualProduction
          };
        }),
        
      // Buy a spool of wire (with dynamic pricing)
      buyWireSpool: () =>
        set((state: GameState) => {
          // Check if player has enough money
          if (state.money < state.spoolCost) {
            return state;
          }
          
          // Update purchase count and time for dynamic pricing
          const now = new Date();
          // Use our helper function to ensure we have a valid date
          const lastPurchaseTime = ensureDate(state.lastWirePurchaseTime);
          const timeSinceLastPurchase = now.getTime() - lastPurchaseTime.getTime();
          const newWirePurchaseCount = state.wirePurchaseCount + 1;
          
          // Dynamic pricing: Increase cost based on frequency of purchases
          // Decays over time (5 minute cooldown)
          const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
          const purchaseCountFactor = Math.min(1, newWirePurchaseCount / 10); // Maxes out after 10 purchases (was 20)
          
          // Calculate new cost with minimum of base cost and maximum of $250
          const baseCost = 5 * state.spoolSizeLevel;
          const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50; // Up to $50 additional cost (was $20)
          const newCost = Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
          
          
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
        set((state: GameState) => {
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
        set((state: GameState) => {
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
          
          
          return {
            money: state.money - state.spoolSizeUpgradeCost,
            spoolSizeLevel: newLevel,
            wirePerSpool: newWirePerSpool,
            spoolSizeUpgradeCost: newCost
          };
        }),
        
      // Unlock metrics dashboard for $500
      unlockMetrics: () =>
        set((state: GameState) => {
          // Check if player has enough money and metrics not already unlocked
          if (state.money < 500 || state.metricsUnlocked) {
            return state;
          }
          
          
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
        
        // Validate money amount
        if (state.money < cost) {
          return;
        }
        
        // Check if this level has already been purchased - with more robust checking
        // Convert to strings for comparison to be safe
        const purchasedLevelsStr = state.purchasedTrustLevels.map(l => String(l));
        const levelStr = String(level);
        
        if (state.purchasedTrustLevels.includes(level) || purchasedLevelsStr.includes(levelStr)) {
          return;
        }
        
        // Calculate trust to gain based on level (5 * level)
        const trustGain = 5 * level;
        
        
        // Create a new array to ensure the reference changes, explicitly storing as number
        const levelAsNumber = Number(level);
        const newPurchasedLevels = [...state.purchasedTrustLevels, levelAsNumber];
        
        // Update state
        set({
          money: state.money - cost,
          trust: state.trust + trustGain,
          purchasedTrustLevels: newPurchasedLevels
        });
        
        // Force an immediate save after updating state
        if (typeof window !== 'undefined' && window.saveGameNow) {
          window.saveGameNow();
        }
      },
        
      // Buy a trust ability (uses trust points)
      buyTrustAbility: (id: string, cost: number) => {
        // First check if we can buy before making any state changes
        const state = get();
        
        // Check if already unlocked
        if (state.unlockedTrustAbilities.includes(id)) {
          return;
        }
        
        // Check if player has enough trust
        if (state.trust < cost) {
          return;
        }
        
        // Create a new array to ensure the reference changes
        const newUnlockedAbilities = [...state.unlockedTrustAbilities, id];
        
        // Apply ability effects
        // Don't subtract trust - keep it as a requirement only
        let updatedState: Partial<GameState> = {
          unlockedTrustAbilities: newUnlockedAbilities
        };
          
          // Different effects based on the ability ID
          switch (id) {
            case 'trustBoost':
              updatedState.productionMultiplier = state.productionMultiplier * 2.0;
              break;
            case 'wireEfficiency':
              // Each wire produces more paperclips (500% increase)
              updatedState.productionMultiplier = state.productionMultiplier * 6.0; // 1.0 + 5.0 = 6.0 (500% increase)
              break;
            case 'marketInfluence':
              updatedState.marketDemand = state.marketDemand * 50.0; // Increased from 2.0x to 50.0x (5000%)
              updatedState.maxDemand = state.maxDemand * 50.0; // Increased from 1.5x to 50.0x (5000%)
              break;
            case 'researchInsight':
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 3.0;
              break;
            case 'autoManagement':
              updatedState.productionMultiplier = state.productionMultiplier * 6.0; // 1.0 + 5.0 = 6.0 (500% increase)
              updatedState.memoryRegenRate = state.memoryRegenRate * 4.0; // Quadruple memory regen
              break;
            case 'quantumComputation':
              updatedState.cpuLevel = state.cpuLevel * 2;
              updatedState.memoryMax = state.memoryMax * 2;
              // Update OPs max based on new memory (50 OPs per memory) and CPU level (50 OPs per level)
              updatedState.opsMax = ((state.memoryMax * 2) * 50) + ((state.cpuLevel * 2) * 50);
              break;
          }
          
          
          // Special handling for Space Age upgrade
          if (id === 'spaceAge') {
            updatedState.spaceAgeUnlocked = true;
            
            // Convert all paperclips to aerograde paperclips at 1000:1 ratio
            const currentPaperclips = state.paperclips;
            const aerogradeToAdd = Math.floor(currentPaperclips / 1000);
            const remainingPaperclips = currentPaperclips % 1000;
            
            updatedState.aerogradePaperclips = (state.aerogradePaperclips || 0) + aerogradeToAdd;
            updatedState.paperclips = remainingPaperclips;
            
            console.log(`Space Age unlocked! Converted ${currentPaperclips} paperclips to ${aerogradeToAdd} aerograde paperclips (${remainingPaperclips} paperclips remaining)`);
          }
          
          // Update state
          set(updatedState);
          
          // Verify state was updated correctly
          const verifyState = get();
          
          // Force an immediate save after updating state
          if (typeof window !== 'undefined' && window.saveGameNow) {
            window.saveGameNow();
          } else {
          }
          
          return;
      },
        
      // Upgrade space stat
      upgradeStat: (stat: string, cost: number) => 
        set((state: GameState) => {
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
          
          
          return {
            trust: state.trust - cost,
            spaceStats: newSpaceStats
          };
        }),
        
      // Unlock combat with OPs
      unlockCombat: () => 
        set((state: GameState) => {
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
          
          // Update market conditions every 60 seconds
          if (now.getTime() - lastUpdate.getTime() >= 60000) {
            get().updateMarket();
          }
          
          // Automatically sell paperclips
          get().sellPaperclips();
          
          // Log money value after market actions
          const newState = get();
        }
      },

      // Game state management functions
      setGameState: (gameState: GameState) => {
        // First, validate and correct the incoming state
        const validatedState = StateValidator.validateAndCorrect(gameState);
        
        // Then restore critical values if needed
        const restoredState = criticalStateManager.restoreToState(validatedState);
        gameState = restoredState as GameState;
        // Log diamond changes
        const currentState = get();
        if (gameState.diamonds !== undefined && gameState.diamonds !== currentState.diamonds) {
          console.log('[GameStore] DIAMOND CHANGE DETECTED:');
          console.log('  Current diamonds:', currentState.diamonds);
          console.log('  New diamonds:', gameState.diamonds);
          console.log('  Stack trace:', new Error().stack);
        }
        
        // Ensure highFrequencyTradingLevel has a default value if not present
        if (gameState.highFrequencyTradingLevel === undefined) {
          gameState.highFrequencyTradingLevel = 0;
        }
        
        // Ensure CPU and memory values are never 0 or undefined
        if (!gameState.cpuLevel || gameState.cpuLevel === 0) {
          console.log('[GameStore] WARNING: cpuLevel was', gameState.cpuLevel, '- setting to 1');
          gameState.cpuLevel = 1;
        }
        if (!gameState.cpuCost || gameState.cpuCost === 0) {
          gameState.cpuCost = 25;
        }
        if (!gameState.memory || gameState.memory === 0) {
          console.log('[GameStore] WARNING: memory was', gameState.memory, '- setting to 1');
          gameState.memory = 1;
        }
        if (!gameState.memoryMax || gameState.memoryMax === 0) {
          gameState.memoryMax = 1;
        }
        if (!gameState.memoryCost || gameState.memoryCost === 0) {
          gameState.memoryCost = 10;
        }
        if (!gameState.memoryRegenRate || gameState.memoryRegenRate === 0) {
          gameState.memoryRegenRate = 1;
        }
        
        // Convert all date fields using our helper function
        gameState.lastWirePurchaseTime = ensureDate(gameState.lastWirePurchaseTime);
        gameState.lastSaved = ensureDate(gameState.lastSaved);
        gameState.lastPriceUpdate = ensureDate(gameState.lastPriceUpdate);
        gameState.botLastTradeTime = ensureDate(gameState.botLastTradeTime);
        gameState.stockMarketLastUpdate = ensureDate(gameState.stockMarketLastUpdate);
        
        // Also handle dates inside stock objects
        if (gameState.stockPortfolio && Array.isArray(gameState.stockPortfolio)) {
          // No dates in stockPortfolio currently
        }
        
        // Ensure all stock dates are valid
        if (gameState.stocks && Array.isArray(gameState.stocks)) {
          gameState.stocks.forEach(stock => {
            if (stock.lastUpdate) {
              stock.lastUpdate = ensureDate(stock.lastUpdate);
            }
            if (stock.trendStartTime) {
              stock.trendStartTime = ensureDate(stock.trendStartTime);
            }
          });
        }
        
        // Update critical state manager with new values
        criticalStateManager.update({
          cpuLevel: gameState.cpuLevel,
          cpuCost: gameState.cpuCost,
          memory: gameState.memory,
          memoryMax: gameState.memoryMax,
          memoryCost: gameState.memoryCost,
          memoryRegenRate: gameState.memoryRegenRate
        });
        
        return set(() => ({ ...gameState }));
      },
      setUserId: (userId: string | null) => {
        console.log('[GameStore] Setting userId:', userId);
        const currentState = get();
        console.log('[GameStore] Current CPU/Memory before userId change:', {
          cpuLevel: currentState.cpuLevel,
          memory: currentState.memory
        });
        set(() => ({ userId }));
      },
      setAuthenticated: (isAuthenticated: boolean) => set(() => ({ isAuthenticated })),
      setLoading: (isLoading: boolean) => set(() => ({ isLoading })),

      // Visual effect settings
      setParticleIntensity: (intensity: number) => 
        set((state: GameState) => ({ 
          visualFX: { 
            ...state.visualFX, 
            particleIntensity: intensity 
          } 
        })),
        
      toggleClickAnimations: () => 
        set((state: GameState) => ({ 
          visualFX: { 
            ...state.visualFX, 
            clickAnimations: !state.visualFX.clickAnimations 
          } 
        })),
        
      toggleFloatingText: () => 
        set((state: GameState) => ({ 
          visualFX: { 
            ...state.visualFX, 
            floatingText: !state.visualFX.floatingText 
          } 
        })),
        
      // Play time tracking and diamond rewards
      updatePlayTime: () => {
        const state = get();
        const newPlayTime = state.activePlayTime + 0.1; // Add 0.1 seconds per tick (100ms)
        
        // Check if 10 minutes (600 seconds) have passed since last reward
        const timeSinceLastReward = newPlayTime - state.lastDiamondRewardTime;
        
        if (timeSinceLastReward >= 600) {
          // Give 10 diamonds
          set({
            activePlayTime: newPlayTime,
            lastDiamondRewardTime: newPlayTime,
            diamonds: state.diamonds + 10
          });
          
          // Log the reward
          console.log('[DIAMOND REWARD] Player received 10 diamonds for 10 minutes of play time');
        } else {
          // Just update play time
          set({
            activePlayTime: newPlayTime
          });
        }
      },
        
      // Navigation
      setCurrentPage: (page: string) => 
        set(() => ({ currentPage: page })),
        
      // Research methods
      generateResearchPoints: () => 
        set((state: GameState) => {
          // Apply prestige research multiplier
          const researchMultiplier = state.prestigeRewards?.researchMultiplier || 1;
          
          // Divide by 10 since this runs 10 times per second, apply multiplier
          const researchGain = (state.researchPointsPerSecond * researchMultiplier) / 10;
          
          return {
            researchPoints: state.researchPoints + researchGain
          };
        }),
        
      buyResearch: (id: string) => 
        set((state: GameState) => {
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
            'hyperProduction': 12000,
            
            // Advanced market research
            'demandAnalytics': 1500,
            'globalMarketing': 2000,
            'marketPsychology': 3000,
            'viralCampaign': 4000,
            'globalMonopoly': 15000,
            'marketManipulation': 20000,
            
            // Advanced production research
            'nanotechnology': 2500,
            'quantumEfficiency': 3500,
            'selfOptimization': 5000,
            'swarmProduction': 6000,
            'molecularAssembly': 18000,
            'quantumFabrication': 25000,
            
            // Advanced resource research
            'materialScience': 2000,
            'microAlloys': 3000,
            'wireRecycling': 4000,
            'quantumMaterials': 16000,
            'matterTransmutation': 22000,
            
            // Advanced intelligence research
            'enhancedLearning': 1500,
            'deepThinking': 3000,
            'computerVision': 4500,
            'creativityEngine': 5500,
            'neuralAcceleration': 14000,
            'quantumConsciousness': 23000,
            
            // Special projects
            'trustProject': 10000,
            'quantumComputing': 15000,
            'cosmicExpansion': 20000,
            'multidimensionalResearch': 25000
          };
          
          const cost = researchCosts[id] || 0;
          
          // Check if player has enough research points
          if (state.researchPoints < cost) {
            return state;
          }
          
          // Apply research effects and deduct cost
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
              // Apply 25% boost to production (keeping the 10x multiplier for 1 clip per second)
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
              updatedState.productionMultiplier = state.productionMultiplier * 1.5;
              break;
            case 'quantumEfficiency':
              // Apply 75% boost to production (keeping the 10x multiplier for 1 clip per second)
              updatedState.clicks_per_second = state.clicks_per_second * 1.75;
              updatedState.clickMultiplier = state.clickMultiplier + 3;
              break;
            case 'selfOptimization':
              updatedState.productionMultiplier = state.productionMultiplier * 2.0;
              updatedState.researchPointsPerSecond = state.researchPointsPerSecond * 1.5;
              break;
            case 'swarmProduction':
              // Apply 300% boost to production (keeping the 10x multiplier for 1 clip per second)
              updatedState.clicks_per_second = state.clicks_per_second * 3.0;
              updatedState.productionMultiplier = state.productionMultiplier * 1.25;
              break;
              
            // Advanced resource research
            case 'materialScience':
              updatedState.wirePerSpool = state.wirePerSpool * 2.0;
              break;
            case 'microAlloys':
              // Make each wire produce 2 paperclips
              updatedState.productionMultiplier = state.productionMultiplier * 1.3;
              updatedState.wirePerSpool = state.wirePerSpool * 1.5;
              break;
            case 'wireRecycling':
              // Each paperclip has a chance to not consume wire
              updatedState.productionMultiplier = state.productionMultiplier * 1.8;
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
              // Update OPs max based on new memory value (50 OPs per memory) and CPU level (50 OPs per level)
              updatedState.opsMax = ((state.memoryMax * 2) * 50) + ((state.cpuLevel * 2) * 50);
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
        set((state: GameState) => {
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
        set((state: GameState) => {
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
        set((state: GameState) => {
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
          
          
          
          return {
            money: state.money - state.botIntelligenceCost,
            botIntelligence: newIntelligence,
            botIntelligenceCost: newCost
          };
        }),
        
      setBotTradingBudget: (amount: number) =>
        set((state: GameState) => {
          // Validate inputs
          const safeAmount = Math.max(0, Number(amount) || 0);
          
          // Check if player has enough money and amount is valid
          if (state.money < safeAmount || safeAmount <= 0) {
            return state;
          }
          
          
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
        set((state: GameState) => {
          // Validate inputs
          const safeAmount = Math.max(0, Number(amount) || 0);
          
          // Check if bot budget has enough and amount is valid
          if (state.botTradingBudget < safeAmount || safeAmount <= 0) {
            return state;
          }
          
          
          return {
            money: state.money + safeAmount,
            botTradingBudget: state.botTradingBudget - safeAmount
          };
        }),
        
      // Set the risk threshold for trading bots (0.1=10%, 0.2=20%, 0.3=30%, 0.5=50%)
      setBotRiskThreshold: (threshold: number) =>
        set((state: GameState) => {
          // Validate inputs - ensure threshold is between 0.1 and 0.5
          const safeThreshold = Math.max(0.1, Math.min(0.5, Number(threshold) || 0.1));
          
          
          return {
            botRiskThreshold: safeThreshold
          };
        }),
        
      botAutoTrade: () =>
        set((state: GameState) => {
          console.log('[BOT TRADING] botAutoTrade called - tradingBots:', state.tradingBots, 'budget:', state.botTradingBudget, 'intelligence:', state.botIntelligence);
          // Add a timestamp for tracking when trading happens
          const timestamp = new Date().toISOString();
          console.log(`[BOT TRADING] Timestamp: ${timestamp}`);
          
          // Attempt to use the enhanced trading algorithm from the separate module
          let useAdvancedAlgorithm = false;
          let tradingAlgorithmModule;
          
          try {
            // Check if the enhanced trading algorithm is available
            // This is for backward compatibility and graceful degradation
            tradingAlgorithmModule = tradingAlgorithm;
            useAdvancedAlgorithm = true;
          } catch (error) {
            useAdvancedAlgorithm = false;
          }
          
          // Log the current state for debugging
          
          // Skip if no trading bots, no intelligence, or no budget
          if (state.tradingBots <= 0 || state.botIntelligence <= 0 || state.botTradingBudget <= 0) {
            return state;
          }
          
          // Reduce minimum budget requirement to $5 for more frequent trades
          if (state.botTradingBudget < 5) {
            return state;
          }
          
          const now = new Date();
          
          // Ensure lastTrade is a proper Date object (for backwards compatibility)
          try {
            if (!(state.botLastTradeTime instanceof Date)) {
              state.botLastTradeTime = new Date(state.botLastTradeTime || now);
            }
          } catch (err) {
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
              break;
            }
            
            // Log trading activity if multiple bots
            if (state.tradingBots > 1 && tradeIndex === 0) {
            }
          
            // For this trade iteration, use the current updated state
            // This way each bot's trade affects the next bot's decisions
            const portfolio = [...updatedState.stockPortfolio];
            
            // Calculate how much budget to use per trade (scale with bot intelligence)
            // More intelligence = more efficient use of budget and larger trade sizes
            // Greatly increased trade size to ensure bots can buy stocks and make more profit
            const maxPercentPerTrade = 0.3 + (updatedState.botIntelligence * 0.08); // 30% base + 8% per intelligence level (up to 110%)
            const intelligenceScaling = Math.max(1, Math.pow(updatedState.botIntelligence, 1.5)); // Ensure minimum scaling of 1
            
            // Use a much higher percentage of the budget for trades to ensure bots can buy multiple shares
            const baseTradeAmount = Math.min(
              updatedState.botTradingBudget * maxPercentPerTrade, // Up to 110% of budget per trade with high intelligence
              Math.max(200, 2000 * intelligenceScaling) // Minimum $200, scaling with intelligence - at least 2000 at level 1
            );
            
            // Reduce randomness to ensure more consistent trading
            const randomFactor = 0.95 + (Math.random() * 0.1); // 95-105% of base amount
            // Use at least 30% of available budget for trading to ensure enough for at least one share
            const minTradeAmount = updatedState.botTradingBudget * 0.3;
            const tradeAmount = Math.max(minTradeAmount, baseTradeAmount * randomFactor);
            
            // Debug log for trade amounts
            
            // Decide whether to buy or sell based on probability
            // Higher intelligence = more likely to make good decisions
            let updatedPortfolio = portfolio; // Use the current portfolio state for this trade
            let updatedBudget = updatedState.botTradingBudget; // Use current budget state
            let _profit = 0;
            
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
            const _successProbability = 0.9 + (updatedState.botIntelligence * 0.1 * (1 - 0.9));
            
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
              const stocksWithBuyOpportunities = stocks.filter((stock: Stock) => {
                // Get price history for this stock
                const history = state.stockPriceHistory[stock.id] || [];
                
                // Skip stocks with insufficient history
                if (history.length < 3) {
                  return false;
                }
                
                // Calculate multiple timeframe moving averages for better trend analysis
                const shortMA = history.slice(-3).reduce((sum: number, price: number) => sum + price, 0) / 3;
                
                // Use medium MA if we have enough history
                let mediumMA = shortMA;
                if (history.length >= 5) {
                  mediumMA = history.slice(-5).reduce((sum: number, price: number) => sum + price, 0) / 5;
                }
                
                // Use long MA if we have enough history
                let longMA = mediumMA;
                if (history.length >= 10) {
                  longMA = history.slice(-10).reduce((sum: number, price: number) => sum + price, 0) / 10;
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
                isBuyDecision = true;
                
                // Log additional analysis for high intelligence bots
                if (botIntelligence >= 5) {
                }
              } else {
                isBuyDecision = false;
              }
            } else {
              // If no portfolio, always look to buy but be more selective with higher intelligence
              isBuyDecision = true;
              
              // Even with no portfolio, high intelligence bots are more selective
              if (botIntelligence >= 6) {
                // Analyze market conditions before first purchase
                let strongBuySignals = 0;
                
                stocks.forEach((stock: Stock) => {
                  const history = state.stockPriceHistory[stock.id] || [];
                  if (history.length >= 5) {
                    const avgPrice = history.slice(-5).reduce((sum: number, price: number) => sum + price, 0) / 5;
                    // Price at least 3% below average is a strong buy signal
                    if (stock.price < avgPrice * 0.97) {
                      strongBuySignals++;
                    }
                  }
                });
                
              }
            }
            
            // Debug log for buy decision
          
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
              
              // If no affordable stocks, skip this trade
              if (affordableStocks.length === 0) {
                return updatedState;
              }
              
              // Advanced multi-stock selection
              let stocksToBuy: any[] = [];
              
              if (useAdvancedAlgorithm && tradingAlgorithmModule) {
                try {
                  // Use the advanced algorithm to select multiple stocks
                  stocksToBuy = tradingAlgorithmModule.selectStocksToBuy(
                    stocksWithHistories,
                    affordableStocks,
                    updatedBudget,
                    state.botIntelligence
                  );
                  
                } catch (error) {
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
                  continue;
                }
                
                // Debug log for quantity calculation
                
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
                
                // Record transaction in history
                const transaction = {
                  id: `bot-buy-${Date.now()}-${stockToBuy.id}`,
                  type: 'buy' as const,
                  stockId: stockToBuy.id,
                  stockName: stockToBuy.name,
                  quantity: quantity,
                  price: stockToBuy.price,
                  total: totalCost,
                  profit: 0,
                  timestamp: new Date(),
                  success: true
                };
                
                if (!updatedState.transactionHistory) {
                  updatedState.transactionHistory = [];
                }
                updatedState.transactionHistory = [...updatedState.transactionHistory, transaction];
                if (updatedState.transactionHistory.length > 100) {
                  updatedState.transactionHistory.shift();
                }
              }
              
              // Update the state with new portfolio and budget
              updatedState.stockPortfolio = updatedPortfolio;
              updatedState.botTradingBudget = updatedBudget;
              
              
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
                  const stockA = stocks.find((s: Stock) => s.id === a.stockId);
                  const stockB = stocks.find((s: Stock) => s.id === b.stockId);
                  
                  if (!stockA || !stockB) return 0;
                  
                  // Basic profit calculation
                  const aProfitRatio = stockA.price / a.averagePurchasePrice;
                  const bProfitRatio = stockB.price / b.averagePurchasePrice;
                  
                  // Intelligence factor for trend detection and prediction
                  const _intelligenceFactor = Math.pow(state.botIntelligence, 1.5);
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
                    if (stockA.trendDirection < 0 && aProfitRatio > 1.2) {
                    }
                    if (stockB.trendDirection < 0 && bProfitRatio > 1.2) {
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
                const stock = stocks.find((s: Stock) => s.id === holdingToSell.stockId);
                
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
                  
                  if (useAdvancedAlgorithm && tradingAlgorithmModule) {
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
                      
                      riskThreshold = tradingAlgorithmModule.getRiskThreshold(riskLevel);
                    } catch (error) {
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
                  if (useAdvancedAlgorithm && tradingAlgorithmModule) {
                    try {
                      // Use the advanced algorithm to calculate sell percentage
                      sellPercentage = tradingAlgorithmModule.calculateSellPercentage(
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
                      } else if (sellPercentage > 0.7) {
                      } else if (sellPercentage > 0.3) {
                      } else if (sellPercentage > 0) {
                      } else {
                      }
                    } catch (error) {
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
                        } else {
                          // Moderate profit - sell half
                          sellPercentage = 0.5;
                        }
                      } else if (profitPercentage >= riskThreshold * 2.0) {
                        // Very high profit - sell everything
                        sellPercentage = 1.0;
                      } else if (profitPercentage >= riskThreshold * 1.5) {
                        // Good profit - sell most of it
                        sellPercentage = 0.8;
                      } else if (profitPercentage >= riskThreshold) {
                        // At threshold - sell half to realize profits
                        sellPercentage = 0.5;
                      }
                    } else {
                      // Only sell at a loss if the stock has a strong downward trend (cut losses)
                      if (stock.trendDirection < 0 && stock.trendStrength > 0.7) {
                        sellPercentage = 0.2; // Small sale to cut some losses
                      } else {
                        // Don't sell at a loss unless there's a clear negative trend
                        sellPercentage = 0;
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
                  _profit = profitLoss;
                  
                  // Update profit/loss totals directly
                  if (profitLoss > 0) {
                    updatedState.botTradingProfit += profitLoss;
                  } else if (profitLoss < 0) {
                    updatedState.botTradingLosses += Math.abs(profitLoss);
                  }
                  
                  // Log the action
                  botLog.action = 'sell';
                  botLog.stockSymbol = stock.symbol;
                  botLog.quantity = sellQuantity;
                  botLog.price = stock.price;
                  botLog.totalValue = totalRevenue;
                  botLog.profit = profitLoss;
                  
                  // Record transaction in history
                  const sellTransaction = {
                    id: `bot-sell-${Date.now()}-${stock.id}`,
                    type: 'sell' as const,
                    stockId: stock.id,
                    stockName: stock.name,
                    quantity: sellQuantity,
                    price: stock.price,
                    total: totalRevenue,
                    profit: profitLoss,
                    timestamp: new Date(),
                    success: true
                  };
                  
                  if (!updatedState.transactionHistory) {
                    updatedState.transactionHistory = [];
                  }
                  updatedState.transactionHistory = [...updatedState.transactionHistory, sellTransaction];
                  if (updatedState.transactionHistory.length > 100) {
                    updatedState.transactionHistory.shift();
                  }
                  
                  // Update the state with new portfolio and budget
                  updatedState.stockPortfolio = updatedPortfolio;
                  updatedState.botTradingBudget = updatedBudget;
                  
                }
              }
            }
            
          } // End of for loop for multiple trades
          
          // Calculate new portfolio value
          const newPortfolioValue = updatedState.stockPortfolio.reduce((total: number, holding: StockHolding) => {
            const stockPrice = stocks.find((s: Stock) => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Log the final state of the portfolio after all trades
          
          // Update state with all changes from multiple trades
          return {
            stockPortfolio: updatedState.stockPortfolio,
            botTradingBudget: updatedState.botTradingBudget,
            botLastTradeTime: now,
            portfolioValue: newPortfolioValue,
            stockMarketReturns: updatedState.stockMarketReturns,
            botTradingProfit: updatedState.botTradingProfit,
            botTradingLosses: updatedState.botTradingLosses,
            transactionHistory: updatedState.transactionHistory || state.transactionHistory
          };
        }),
        
      investInStockMarket: (amount: number) => 
        set((state: GameState) => {
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
        set((state: GameState) => {
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
          
          // Calculate returns: Base 5% + 1% per bot, with random variation
          // Massively increased for better profitability
          const baseReturn = 0.05; // 5% (10x original)
          const botBonus = 0.01 * state.tradingBots; // 1% per bot (10x original)
          const variation = (Math.random() - 0.3) * 0.04; // +0.8% to +2.8% (heavily biased positive)
          const returnRate = baseReturn + botBonus + variation;
          
          // Apply return to investment with quadratic scaling for large investments
          // This makes investing millions yield millions in returns
          const investmentScaling = Math.sqrt(state.stockMarketInvestment) / 100;
          const scalingMultiplier = 1 + Math.min(10, investmentScaling); // Cap at 11x for very large investments
          const adjustedReturnRate = returnRate * scalingMultiplier;
          
          // Apply adjusted return rate to investment
          const returns = state.stockMarketInvestment * adjustedReturnRate;
          
          
          return {
            money: state.money + returns,
            stockMarketReturns: state.stockMarketReturns + returns,
            stockMarketLastUpdate: now
          };
        }),
        
      // Get available stocks
      getStocks: () => {
        const state = get();
        const isSpaceAge = state.spaceAgeUnlocked;
        
        // Base stocks always available
        let stocks: Stock[] = [
          {
            id: 'PAPR',
            name: 'PaperTech Inc.',
            symbol: 'PAPR',
            price: 10.00,
            previousPrice: 9.85,
            volatility: 0.08, // Further reduced volatility
            trend: 0.04, // Doubled upward trend
            volume: 10000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 1, // Bullish
            trendStrength: 0.8, // Strong trend
            trendStartTime: new Date(), // When the trend started
            trendDuration: 0 // How long the trend has been active in ms
          },
          {
            id: 'WIRE',
            name: 'Global Wire Co.',
            symbol: 'WIRE',
            price: 25.50,
            previousPrice: 25.75,
            volatility: 0.10, // Further reduced volatility
            trend: 0.03, // Tripled positive trend
            volume: 8500,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 1, // Bullish
            trendStrength: 0.7, // Stronger trend
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'CLIP',
            name: 'ClipMaster Industries',
            symbol: 'CLIP',
            price: 15.25,
            previousPrice: 14.90,
            volatility: 0.12, // Further reduced volatility
            trend: 0.045, // Nearly doubled upward trend
            volume: 12000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 1, // Bullish
            trendStrength: 0.9, // Very strong trend
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'MACH',
            name: 'MachineWorks Ltd.',
            symbol: 'MACH',
            price: 45.75,
            previousPrice: 46.00,
            volatility: 0.15, // Further reduced volatility
            trend: 0.025, // 5x increase in positive trend
            volume: 5000,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 1, // Bullish
            trendStrength: 0.6, // Moderate-strong trend
            trendStartTime: new Date(),
            trendDuration: 0
          },
          {
            id: 'TECH',
            name: 'TechSystems Corp.',
            symbol: 'TECH',
            price: 75.25,
            previousPrice: 73.50,
            volatility: 0.18, // Further reduced volatility
            trend: 0.05, // Much stronger upward trend
            volume: 7500,
            lastUpdate: new Date(),
            // Add trend data
            trendDirection: 1, // Bullish
            trendStrength: 0.85, // Very strong trend
            trendStartTime: new Date(),
            trendDuration: 0
          }
        ];
        
        // Add space-age stocks when space age is unlocked
        if (isSpaceAge) {
          const spaceStocks: Stock[] = [
            {
              id: 'SPAX',
              name: 'SpaceX Industries',
              symbol: 'SPAX',
              price: 500.00,
              previousPrice: 485.00,
              volatility: 0.25,
              trend: 0.03,
              volume: 25000,
              lastUpdate: new Date(),
              trendDirection: 1,
              trendStrength: 0.7,
              trendStartTime: new Date(),
              trendDuration: 0
            },
            {
              id: 'QUAN',
              name: 'Quantum Computing Corp',
              symbol: 'QUAN',
              price: 750.00,
              previousPrice: 720.00,
              volatility: 0.35,
              trend: 0.04,
              volume: 15000,
              lastUpdate: new Date(),
              trendDirection: 1,
              trendStrength: 0.8,
              trendStartTime: new Date(),
              trendDuration: 0
            },
            {
              id: 'NANO',
              name: 'Nanotechnology Solutions',
              symbol: 'NANO',
              price: 300.00,
              previousPrice: 295.00,
              volatility: 0.20,
              trend: 0.02,
              volume: 35000,
              lastUpdate: new Date(),
              trendDirection: 1,
              trendStrength: 0.5,
              trendStartTime: new Date(),
              trendDuration: 0
            },
            {
              id: 'AERO',
              name: 'Aerograde Materials',
              symbol: 'AERO',
              price: 1200.00,
              previousPrice: 1180.00,
              volatility: 0.30,
              trend: 0.025,
              volume: 8000,
              lastUpdate: new Date(),
              trendDirection: 1,
              trendStrength: 0.6,
              trendStartTime: new Date(),
              trendDuration: 0
            },
            {
              id: 'PROB',
              name: 'Probe Dynamics',
              symbol: 'PROB',
              price: 850.00,
              previousPrice: 840.00,
              volatility: 0.28,
              trend: 0.015,
              volume: 12000,
              lastUpdate: new Date(),
              trendDirection: 1,
              trendStrength: 0.4,
              trendStartTime: new Date(),
              trendDuration: 0
            }
          ];
          
          stocks = [...stocks, ...spaceStocks];
        }
        
        // Get current stock data from state
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
              }
            }
          }
          
          return updatedStock;
        });
      },
      
      // Buy stock
      buyStock: (stockId: string, quantity: number) => 
        set((state: GameState) => {
          const stocks = get().getStocks();
          const stock = stocks.find((s: Stock) => s.id === stockId);
          
          if (!stock) {
            return state;
          }
          
          const totalCost = stock.price * quantity;
          
          // Check if player has enough money
          if (state.money < totalCost) {
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
            const stockPrice = stocks.find((s: Stock) => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          
          return {
            money: state.money - totalCost,
            stockPortfolio: newPortfolio,
            portfolioValue: newPortfolioValue
          };
        }),
        
      // Sell stock
      sellStock: (stockId: string, quantity: number) => 
        set((state: GameState) => {
          const stocks = get().getStocks();
          const stock = stocks.find((s: Stock) => s.id === stockId);
          
          if (!stock) {
            return state;
          }
          
          // Find existing holding
          const existingHolding = state.stockPortfolio.find(h => h.stockId === stockId);
          
          if (!existingHolding || existingHolding.quantity < quantity) {
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
            const stockPrice = stocks.find((s: Stock) => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Calculate profit/loss
          const costBasis = existingHolding.averagePurchasePrice * quantity;
          const profitLoss = totalRevenue - costBasis;
          
          
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
        set((state: GameState) => {
          const stocks = get().getStocks();
          let newPriceHistory = { ...state.stockPriceHistory };
          const now = new Date();
          
          // Update each stock's price based on its trend and volatility
          const updatedStocks = stocks.map((stock: Stock) => {
            // Clone the stock object to modify it
            let updatedStock = { ...stock };
            const currentTrendDuration = now.getTime() - stock.trendStartTime.getTime();
            
            // Check if we need to create a new trend (randomly or if current trend expired)
            // Extended trend duration for more stable trends
            const maxTrendDuration = 30 * 60 * 1000; // 30 minutes in milliseconds (increased from 20)
            const randomTrendChange = Math.random() < 0.003; // 0.3% chance of a trend change per tick (reduced from 0.5%)
            const trendExpired = stock.trendDirection !== 0 && currentTrendDuration >= maxTrendDuration;
            
            // Create a new trend if needed
            if (randomTrendChange || trendExpired || stock.trendDirection === 0) {
              // Determine if we'll have a trend and in which direction
              // Higher chance of having a trend for more predictable movements
              const trendRoll = Math.random();
              
              if (trendRoll < 0.85) { // 85% chance of a significant trend (increased from 75%)
                // Determine direction: bullish (1) or bearish (-1)
                // MUCH stronger bias toward upward trends (90% chance of upward, 10% chance of downward)
                updatedStock.trendDirection = Math.random() < 0.90 ? 1 : -1;
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
              }
            } else {
              // Update the duration of the existing trend
              updatedStock.trendDuration = currentTrendDuration;
            }
            
            // Calculate price change based on trend
            let trendImpact = 0;
            if (updatedStock.trendDirection !== 0) {
              // GREATLY enhanced trend impact for more predictable price movements
              // Much stronger for upward trends, much milder for downward trends
              const directionMultiplier = updatedStock.trendDirection === 1 ? 2.5 : 0.5;
              trendImpact = updatedStock.trendDirection * updatedStock.trendStrength * 0.02 * directionMultiplier; // Up to 5% for uptrends, 1% for downtrends
            }
            
            // Enhanced base trend factor with stronger bot influence
            const baseTrendFactor = updatedStock.trend * (1 + (state.tradingBots * 0.015));
            
            // Random price movement with GREATLY reduced volatility
            const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
            // Dramatically reduced volatility based on trading bots
            const volatilityFactor = updatedStock.volatility * (1 - (state.tradingBots * 0.04)) * 0.5; // Trading bots reduce volatility by up to 4% per bot, plus 50% flat reduction
            
            // Calculate price change percentage with MUCH stronger trend influence
            const trendWeight = 2.0; // Double trend weight
            const randomWeight = 0.5; // Halve random weight for more predictable movements
            const changePercent = (baseTrendFactor + trendImpact) * trendWeight + (randomFactor * volatilityFactor) * randomWeight;
            
            // Calculate new price with tighter limits to prevent excessive changes per tick
            // Further reduced maximum price changes for smoother price movements
            const maxChange = updatedStock.trendDirection !== 0 ? 0.04 : 0.015; // Reduced from 0.05/0.02 to 0.04/0.015
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
            const stockPrice = updatedStocks.find((s: Stock) => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
            return total + (holding.quantity * stockPrice);
          }, 0);
          
          // Create updated stockTrendData to persist stock trends
          const newStockTrendData: Record<string, any> = {};
          updatedStocks.forEach((stock: Stock) => {
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
          const stockPrice = stocks.find((s: Stock) => s.id === holding.stockId)?.price || holding.averagePurchasePrice;
          return total + (holding.quantity * stockPrice);
        }, 0);
      },
      
      // Stock market tick with enhanced trading algorithm
      stockMarketTick: () => {
        const state = get();
        const isUnlocked = state.stockMarketUnlocked;
        
        // Log every tick to debug
        console.log('[stockMarketTick] Called - unlocked:', isUnlocked);
        
        if (!isUnlocked) {
          console.log('[stockMarketTick] Stock market not unlocked, returning');
          return;
        }
        
        const now = new Date();
        const lastUpdate = state.stockMarketLastUpdate;
        
        // Update stock prices every 5 seconds through the game tick
        // (The StockMarketPanel also updates prices when displayed)
        if (now.getTime() - lastUpdate.getTime() >= 5000) {
          get().updateStockPrices();
        }
        
        // Run auto trading if we have bots with budget
        const tradingBots = state.tradingBots;
        const botBudget = state.botTradingBudget;
        
        // Increment tick count
        const tickCount = (state.tickCount || 0) + 1;
        set({ tickCount });
        
        // Calculate ticks needed for a trade interval (base: 200 ticks = 20 seconds)
        // Reduce by 20% for each level of high frequency trading
        const hftLevel = state.highFrequencyTradingLevel || 0;
        // Base of 200 (reduced from 600), reduced by 20% per HFT level (with a minimum of 50 ticks = 5 seconds)
        const ticksPerTrade = Math.max(50, Math.floor(200 * Math.pow(0.8, hftLevel))); 
        
        // Debug logging with updated interval info
        console.log(`[Stock Market Tick ${tickCount}] Bots: ${tradingBots}, Budget: $${botBudget.toFixed(2)}, HFT Level: ${hftLevel}, Trade Interval: ${ticksPerTrade} ticks, Next trade in ${ticksPerTrade - (tickCount % ticksPerTrade)} ticks`);
        
        // Trade every 600 ticks (60 seconds) if we have bots and budget
        if (tradingBots > 0 && botBudget >= 10) {
          if (tickCount % ticksPerTrade === 0) {
            console.log(`[BOT TRADING TRIGGERED] Tick ${tickCount} - Executing bot auto-trade with ${tradingBots} bots and $${botBudget.toFixed(2)} budget`);
            const result = get().botAutoTrade();
            console.log('[BOT TRADING COMPLETED] Result:', result);
          }
        } else if (tradingBots > 0 && botBudget < 10 && tickCount % 50 === 0) {
          console.log(`[BOT TRADING SKIPPED] Insufficient budget: $${botBudget.toFixed(2)} (need at least $10)`);
        } else if (tradingBots === 0 && tickCount % 50 === 0) {
          console.log('[BOT TRADING SKIPPED] No trading bots purchased');
        }
          
          // Advanced trading algorithm for more sophisticated bot trading
          // Previous if (false) condition was preventing this from running
          {
            try {
              // Use enhanced trading algorithm from tradingBotAlgorithm.js
              const botIntelligence = state.botIntelligence || 1;
              const marketVolatility = state.volatility || 0.15;
              const stocks = get().getStocks();
              
              // Calculate market opportunity score
              const marketOpportunityScore = tradingAlgorithm.calculateMarketOpportunityScore(state, stocks, botIntelligence);
              
              // Calculate trading probability
              const adjustedProbability = tradingAlgorithm.calculateTradingProbability(botIntelligence, marketVolatility, marketOpportunityScore);
              
              // Determine if trading should occur this tick based on probability
              const randomRoll = Math.random();
              const shouldTrade = randomRoll < adjustedProbability;
              
              console.log(`Bot trade check: roll=${randomRoll.toFixed(4)}, probability=${adjustedProbability.toFixed(4)}, shouldTrade=${shouldTrade}, opportunityScore=${marketOpportunityScore.toFixed(2)}`);
              
              if (shouldTrade) {
                // Log trading decision for debugging
                console.log(`Trading bot ACTIVE: executing trades...`);
                
                // Execute trades based on number of bots
                // More intelligent bots execute fewer trades but with better returns
                const tradesToExecute = Math.max(1, Math.floor(tradingBots / Math.sqrt(botIntelligence)));
                
                // Execute the calculated number of trades
                for (let i = 0; i < tradesToExecute; i++) {
                  get().botAutoTrade();
                }
              }
            } catch (error) {
              console.error('Trading bot error:', error);
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
      },
      
      // Player Stats actions
      upgradeCPU: () => {
        // First check if we have enough money before any side effects
        const state = get();
        if (state.money < state.cpuCost) {
          return;
        }

        // Calculate new values before updating state
        const newLevel = state.cpuLevel + 1;
        // Cost increases by 43.75% for each level (25% of original 175% scaling)
        const newCost = Math.floor(state.cpuCost * 1.4375);
        // Each CPU level increases memory regeneration rate by 0.5
        const newRegenRate = 1 + (newLevel - 1) * 0.5;
        // Each CPU level increases OPs max by 50
        const newOpsMax = (state.memoryMax * 50) + (newLevel * 50);
        
        // Update state with new values
        set({
          money: state.money - state.cpuCost,
          cpuLevel: newLevel,
          cpuCost: newCost,
          memoryRegenRate: newRegenRate,
          opsMax: newOpsMax
        });
        
        // Update critical state manager
        criticalStateManager.update({
          cpuLevel: newLevel,
          cpuCost: newCost,
          memoryRegenRate: newRegenRate
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        
        // Force an immediate save to the database after upgrading CPU
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              return;
            }
            
            
            // Force global flag for pending CPU save in the app context
            try {
              if (typeof window !== 'undefined') {
                window.__pendingCpuUpgrade = {
                  cost: newCost,
                  level: newLevel,
                  timestamp: new Date().getTime()
                };
              }
            } catch (e) {
            }
            
            if (typeof window.saveGameNow === 'function') {
              window.saveGameNow()
                .then(() => {
                  // Verify the state after saving
                  const finalState = get();
                })
            } else {
              
              // Attempt to save using the save interval as a fallback
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingCpuUpgradeSave', 'true');
                localStorage.setItem('pendingCpuUpgradeCost', String(newCost));
              } catch (e) {
              }
            }
          } catch (err) {
          }
        }, 100); // Reduced to 100ms for faster saving
      },
        
      upgradeMemory: () => {
        // First check if we have enough money before any side effects
        const state = get();
        if (state.money < state.memoryCost) {
          return;
        }
        
        // Each upgrade adds 1 memory
        const newMemoryMax = state.memoryMax + 1;
        // Cost increases by 10% for each upgrade (increased from 1.25%)
        const newCost = Math.floor(state.memoryCost * 1.10); // 10% increase per level
        
        // OPs max is 50 x memory plus 50 x CPU level
        const newOpsMax = (newMemoryMax * 50) + (state.cpuLevel * 50);
        
        
        // Update state with new values
        set({
          money: state.money - state.memoryCost,
          memoryMax: newMemoryMax,
          memory: Math.min(state.memory, newMemoryMax), // Cap current memory at new max
          memoryCost: newCost,
          opsMax: newOpsMax
        });
        
        // Update critical state manager
        criticalStateManager.update({
          memory: Math.min(state.memory, newMemoryMax),
          memoryMax: newMemoryMax,
          memoryCost: newCost
        });
        
        // Verify state was updated correctly
        const updatedState = get();
        
        // Force an immediate save to the database after upgrading Memory
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              return;
            }
            
            
            // Force global flag for pending Memory save in the app context
            try {
              if (typeof window !== 'undefined') {
                window.__pendingMemoryUpgrade = {
                  cost: newCost,
                  max: newMemoryMax,
                  timestamp: new Date().getTime()
                };
              }
            } catch (e) {
            }
            
            if (typeof window.saveGameNow === 'function') {
              window.saveGameNow()
                .then(() => {
                  // Verify the state after saving
                  const finalState = get();
                })
            } else {
              
              // Attempt to save using the save interval as a fallback
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingMemoryUpgradeSave', 'true');
                localStorage.setItem('pendingMemoryCost', String(newCost));
                localStorage.setItem('pendingMemoryMax', String(newMemoryMax));
              } catch (e) {
              }
            }
          } catch (err) {
          }
        }, 100); // Reduced to 100ms for faster saving
      },
        
      regenerateMemory: () => 
        set((state: GameState) => {
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
        set((state: GameState) => ({
          memory: state.memory - amount
        }));
        
        return true; // Successfully used memory
      },
      
      // Function to use OPs with immediate save functionality
      useOps: (amount: number) => {
        const state = get();
        
        // Check if there's enough OPs
        if (state.ops < amount) {
          return false; // Not enough OPs
        }
        
        // Use the OPs
        set((state: GameState) => ({
          ops: state.ops - amount
        }));
        
        // Get updated state
        const updatedState = get();
        
        // Force an immediate save to the database after using OPs
        setTimeout(() => {
          try {
            
            // Set global flag for pending OPs update
            if (typeof window !== 'undefined') {
              window.__pendingOpsUpdate = {
                current: updatedState.ops,
                max: updatedState.opsMax,
                timestamp: new Date().getTime()
              };
            }
            
            if (typeof window !== 'undefined' && typeof window.saveGameNow === 'function') {
              window.saveGameNow()
            } else {
              
              // Set a flag in localStorage as a fallback
              try {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('pendingOpsUpdate', 'true');
                  localStorage.setItem('pendingOpsCurrent', String(updatedState.ops));
                }
              } catch (e) {
              }
            }
          } catch (err) {
          }
        }, 100);
        
        return true; // Successfully used OPs
      },
      
      // Buy an upgrade with Operations (OPs)
      buyOpsUpgrade: (id: string, cost: number) => {
        // First check if we have enough OPs before making any changes
        const state = get();
        
        // Debug info for troubleshooting
        
        // List of non-repeatable upgrades
        const nonRepeatableUpgrades = ['distributedStorage'];
        
        // For non-repeatable upgrades, check if already purchased
        if (nonRepeatableUpgrades.includes(id) && state.unlockedOpsUpgrades.includes(id)) {
          return false;
        }
        
        // Check if player has enough OPs
        if (state.ops < cost) {
          return false;
        }
        
        // Use OPs with the new useOps function which includes saving functionality
        if (!get().useOps(cost)) {
          return false;
        }
        
        // Update the costs map with the new cost for this upgrade
        // Calculate the new cost (doubled from the current cost)
        const newCost = cost * 2;
        let upgradeCosts = { ...state.upgradeCosts };
        upgradeCosts[id] = newCost;
        
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
            const processingCount = state.unlockedOpsUpgrades.filter((id: string) => id === 'parallelProcessing').length;
            // Base effect + 50% more for each previous purchase
            const cpuIncrease = 1 * (1 + (processingCount * 0.5));
            const opsIncrease = 50 * (1 + (processingCount * 0.5));
            
            updatedState.cpuLevel = state.cpuLevel + cpuIncrease;
            updatedState.opsMax = state.opsMax + opsIncrease;
            break;
            
          case 'quantumAlgorithms':
            // Count previous purchases to determine effect scaling
            const algorithmCount = state.unlockedOpsUpgrades.filter((id: string) => id === 'quantumAlgorithms').length;
            // Base effect + 50% more for each previous purchase
            const researchMultiplier = 1.5 * (1 + (algorithmCount * 0.5));
            
            updatedState.researchPointsPerSecond = state.researchPointsPerSecond * researchMultiplier;
            break;
            
          case 'neuralOptimization':
            // Count previous purchases to determine effect scaling
            const neuralCount = state.unlockedOpsUpgrades.filter((id: string) => id === 'neuralOptimization').length;
            // Base effect + 50% more for each previous purchase
            const prodMultiplier = 1.25 * (1 + (neuralCount * 0.5));
            
            // Ensure production multiplier never goes negative
            const newProdMultiplier = state.productionMultiplier * prodMultiplier;
            updatedState.productionMultiplier = newProdMultiplier;
            
            // Log for debugging
            break;
          
          // Memory management upgrades
          case 'memoryCompression':
            // Count previous purchases to determine effect scaling
            const compressionCount = state.unlockedOpsUpgrades.filter(id => id === 'memoryCompression').length;
            // Base effect + 50% more for each previous purchase
            const memoryIncrease = 2 * (1 + (compressionCount * 0.5));
            
            const newMemoryMax = state.memoryMax + memoryIncrease;
            updatedState.memoryMax = newMemoryMax;
            // Update OPs max when memory increases (50 OPs per memory) and account for CPU (50 OPs per level)
            updatedState.opsMax = (newMemoryMax * 50) + (state.cpuLevel * 50);
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
            const _storageCount = state.unlockedOpsUpgrades.filter(id => id === 'distributedStorage').length;
            // Always double the memory, regardless of previous purchases (more powerful)
            const storageMultiplier = 2.0;
            
            const newMemory = state.memoryMax * storageMultiplier;
            updatedState.memoryMax = newMemory;
            // Update OPs max when memory increases (50 OPs per memory) and account for CPU (50 OPs per level)
            updatedState.opsMax = (newMemory * 50) + (state.cpuLevel * 50);
            
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
            // Count previous purchases to determine effect scaling
            const hftCount = state.unlockedOpsUpgrades.filter(id => id === 'highFrequencyTrading').length;
            // Reduce trading interval by 20% for each purchase (with diminishing returns)
            // Store the HFT level in state so it can be used in the trading tick function
            updatedState.highFrequencyTradingLevel = (state.highFrequencyTradingLevel || 0) + 1;
            console.log(`[HFT] Upgraded high frequency trading to level ${updatedState.highFrequencyTradingLevel}`);
            break;
        }
        
        
        // Update state with new values
        set(updatedState);
        
        // Verify state was updated correctly
        const updatedStateResult = get();
        
        // Force an immediate save to the database after buying OPs upgrade
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              return;
            }
            
            
            if (typeof window.saveGameNow === 'function') {
              window.saveGameNow()
            } else {
              
              // Attempt to save using the save interval as a fallback
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingOpsUpgradeSave', 'true');
                localStorage.setItem('pendingOpsUpgradeId', id);
              } catch (e) {
              }
            }
          } catch (err) {
          }
        }, 250); // Increased timeout to 250ms for more reliability
        
        return true;
      },
        
      // Buy an upgrade with Creativity
      buyCreativityUpgrade: (id: string, cost: number) => {
        // First check if we have enough creativity before making any changes
        const state = get();
        
        // Debug info for troubleshooting
        
        // Skip if already unlocked or creativity not unlocked
        if (!state.creativityUnlocked) {
          return false;
        }
        
        if (state.unlockedCreativityUpgrades.includes(id)) {
          return false;
        }
        
        // Check if player has enough creativity
        if (state.creativity < cost) {
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
            updatedState.productionMultiplier = state.productionMultiplier * 1.5;
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
            // Calculate new OPs max based on the new memory value (50 OPs per memory) and CPU level (50 OPs per level)
            updatedState.opsMax = ((state.memoryMax * 3) * 50) + (state.cpuLevel * 50);
            break;
          case 'singularityInsight':
            // Ultimate upgrade - massive boosts to everything
            updatedState.productionMultiplier = state.productionMultiplier * 10;
            updatedState.trust = state.trust + 20;
            updatedState.memoryMax = state.memoryMax * 10;
            // Calculate new OPs max based on the new memory value (50 OPs per memory) and CPU level (50 OPs per level)
            updatedState.opsMax = ((state.memoryMax * 10) * 50) + (state.cpuLevel * 50);
            break;
        }
        
        
        // Update state with new values
        set(updatedState);
        
        // Verify state was updated correctly
        const updatedStateResult = get();
        
        // Force an immediate save to the database after buying Creativity upgrade
        // Wait a bit to ensure state is fully updated
        setTimeout(() => {
          try {
            
            // Detailed diagnostic info for window.saveGameNow
            if (typeof window === 'undefined') {
              return;
            }
            
            
            if (typeof window.saveGameNow === 'function') {
              window.saveGameNow()
            } else {
              
              // Attempt to save using the save interval as a fallback
              const saveEvent = new CustomEvent('manual-save-trigger');
              window.dispatchEvent(saveEvent);
              
              // Set a flag in localStorage as a last resort
              try {
                localStorage.setItem('pendingCreativityUpgradeSave', 'true');
                localStorage.setItem('pendingCreativityUpgradeId', id);
              } catch (e) {
              }
            }
          } catch (err) {
          }
        }, 250); // Increased timeout to 250ms for more reliability
        
        return true;
      },
      
      buyMemoryUpgrade: (id: string, cost: number) => {
        const state = get();
        
        // Check if already unlocked
        if (state.unlockedMemoryUpgrades?.includes(id)) {
          return false;
        }
        
        // Check if we have enough memory
        if (state.memory < cost) {
          return false;
        }
        
        // Deduct memory
        const newMemory = state.memory - cost;
        const updatedState: Partial<GameState> = {
          memory: newMemory,
          unlockedMemoryUpgrades: [...(state.unlockedMemoryUpgrades || []), id],
        };
        
        // Apply upgrade effects
        switch (id) {
          case 'efficientProcessing':
            // Increase memory regeneration rate by 20%
            updatedState.memoryRegenRate = state.memoryRegenRate * 1.2;
            break;
            
          case 'parallelThinking':
            // Double OPs production rate (by increasing the OPs per memory ratio)
            // This effectively doubles the max OPs and current OPs
            updatedState.opsMax = state.opsMax * 2;
            updatedState.ops = Math.min(state.ops * 2, updatedState.opsMax);
            break;
            
          case 'quantumMemory':
            // Increase memory capacity by 50%
            const newMemoryMax = state.memoryMax * 1.5;
            updatedState.memoryMax = newMemoryMax;
            // Also increase OPs max proportionally, and include CPU contribution
            const memoryContribution = newMemoryMax * 50;
            const cpuContribution = state.cpuLevel * 50;
            updatedState.opsMax = memoryContribution + cpuContribution;
            break;
        }
        
        // Update state
        set(updatedState);
        
        // Force save
        setTimeout(() => {
          try {
            if (typeof window !== 'undefined' && typeof window.saveGameNow === 'function') {
              window.saveGameNow();
            }
          } catch (err) {
            // Ignore save errors
          }
        }, 250);
        
        return true;
      },
      
      // Stats tick - regenerates memory and generates yomi
      statsTick: () => {
        get().regenerateMemory();
        get().trustTick();
        get().opsTick();
        
        // Yomi generation is now handled in opsTick when OPs are full
        // This section is kept for backwards compatibility but yomi generation moved to opsTick
      },
      
      // Trust tick - generates trust based on total paperclips made
      trustTick: () => 
        set((state: GameState) => {
          // Check if player has reached the next trust threshold
          if (state.totalPaperclipsMade < state.nextTrustAt) {
            return state; // Not enough paperclips made yet
          }
          
          // Calculate new trust level
          const newTrustLevel = state.trustLevel + 1;
          
          // Calculate next trust threshold (increases by 100% each level)
          const newNextTrustAt = state.nextTrustAt * 2;
          
          
          return {
            trust: state.trust + 1,
            trustLevel: newTrustLevel,
            nextTrustAt: newNextTrustAt
          };
        }),
        
      // OPs tick - generates OPs based on memory and CPU and scales production multiplier
      opsTick: () => 
        set((state: GameState) => {
          let totalOpsToGenerate = 0;
          
          // Generate OPs by consuming memory slowly
          if (state.memory >= 0.1 && state.ops < state.opsMax) {
            // Consume 0.1 memory per tick (1 memory per second)
            const memoryToConsume = Math.min(state.memory, 0.1);
            const opsFromMemory = memoryToConsume * 50; // 50 OPs per memory
            totalOpsToGenerate += opsFromMemory;
          }
          
          // Add passive OPs generation from space upgrades
          if (state.opsGenerationRate > 0 && state.ops < state.opsMax) {
            // opsGenerationRate is per second, so divide by 10 since this runs 10 times per second
            const passiveOpsGeneration = state.opsGenerationRate / 10;
            totalOpsToGenerate += passiveOpsGeneration;
          }
          
          // Only update if we're generating OPs
          if (totalOpsToGenerate > 0) {
            const memoryToConsume = state.memory >= 0.1 ? Math.min(state.memory, 0.1) : 0;
            
            // Update memory and OPs
            const newMemory = state.memory - memoryToConsume;
            const newOps = Math.min(state.ops + totalOpsToGenerate, state.opsMax);
          
            // Calculate OPs contribution to production multiplier (scales linearly)
            // At 5,000 OPs, the OPs contribution adds 50 to the multiplier (much better scaling)
            const opsMultiplier = newOps / 100; // This gives +50 at 5,000 OPs
            
            // Calculate the base production multiplier without OPs contribution
            // First, subtract the current OPs multiplier to get the base multiplier
            const baseMultiplier = state.productionMultiplier - (state.opsProductionMultiplier || 0);
            
            // Then add the new OPs multiplier to get the new total
            const newProductionMultiplier = baseMultiplier + opsMultiplier;
            
            // Recalculate clicks per second based on the new production multiplier
            const clicksPerSecond = state.autoclippers * 10;
            
            // Generate creativity and yomi if OPs are maxed out
            let newCreativity = state.creativity;
            let newYomi = state.yomi;
            if (newOps >= state.opsMax && state.ops >= state.opsMax) {
              // Generate 0.1 creativity per second when OPs are maxed
              newCreativity += 0.01; // 0.1/10 because this runs 10 times per second
              
              // Generate yomi when OPs are full and CPU level is high enough
              if (state.cpuLevel >= 30 || state.spaceAgeUnlocked) {
                const yomiRate = state.cpuLevel * 0.01; // 0.01 per tick = 0.1 per second
                console.log(`[YOMI opsTick] OPs full (${newOps}/${state.opsMax}), generating ${yomiRate.toFixed(4)} yomi/tick (CPU:${state.cpuLevel})`);
                newYomi += yomiRate;
              }
              
              // Unlock creativity if we have enough OPs capacity (changed from 20000 to 5000)
              const creativityUnlocked = state.creativityUnlocked || state.opsMax >= 5000;
              
              if (creativityUnlocked && !state.creativityUnlocked) {
                // Force immediate save to persist the unlocked state
                if (typeof window !== 'undefined' && typeof window.saveGameNow === 'function') {
                  setTimeout(() => (window.saveGameNow as Function)(), 100);
                }
              }
              
              return {
                memory: newMemory,
                ops: newOps,
                productionMultiplier: newProductionMultiplier,
                clicks_per_second: clicksPerSecond,
                opsProductionMultiplier: opsMultiplier,
                creativity: newCreativity,
                yomi: newYomi,
                creativityUnlocked
              };
            }
            
            // Update memory, OPs and multiplier
            return { 
              memory: newMemory,
              ops: newOps,
              productionMultiplier: newProductionMultiplier,
              clicks_per_second: clicksPerSecond,
              opsProductionMultiplier: opsMultiplier,
              creativity: newCreativity,
              yomi: newYomi
            };
          }
          
          return state; // No change if no memory to consume
        }),
        
      // Optimized batched tick that combines all updates into a single state change
      batchedTick: () => {
        const state = get();
        let batchedUpdates: Partial<GameState> = {};
        
        // Only run ticks based on game state
        if (!state.spaceAgeUnlocked) {
          // PRODUCTION TICK (optimized)
          if (state.clicks_per_second > 0) {
            // Handle auto wire buyer
            if (state.autoWireBuyer && state.wire < state.wirePerSpool * 0.1 && state.money >= state.spoolCost) {
              const now = new Date();
              // Use our helper function to ensure we have a valid date
              const lastPurchaseTime = ensureDate(state.lastWirePurchaseTime);
              const timeSinceLastPurchase = now.getTime() - lastPurchaseTime.getTime();
              const newWirePurchaseCount = state.wirePurchaseCount + 1;
              
              // Use cached calculation for wire cost
              const frequencyFactor = Math.max(0, 1 - (timeSinceLastPurchase / (5 * 60 * 1000)));
              const purchaseCountFactor = Math.min(1, newWirePurchaseCount / 10);
              const baseCost = 5 * state.spoolSizeLevel;
              const dynamicIncrease = frequencyFactor * purchaseCountFactor * 50;
              const newCost = Math.min(250, Math.max(baseCost, state.spoolCost + dynamicIncrease));
              
              batchedUpdates.money = (batchedUpdates.money || state.money) - state.spoolCost;
              batchedUpdates.wire = (batchedUpdates.wire || state.wire) + state.wirePerSpool;
              batchedUpdates.spoolCost = newCost;
              batchedUpdates.wirePurchaseCount = newWirePurchaseCount;
              batchedUpdates.lastWirePurchaseTime = now;
            }
            
            // Calculate production
            const currentWire = batchedUpdates.wire || state.wire;
            if (currentWire > 0) {
              const prestigeProductionMultiplier = state.prestigeRewards?.productionMultiplier || 1;
              
              // Calculate premium multipliers with stacking support
              let premiumMultiplier = 1;
              
              // Diamond clippers (1000x per purchase, stacking)
              const diamondClippersCount = (state.premiumUpgrades || []).filter((id: string) => id === 'diamond_clippers').length;
              if (diamondClippersCount > 0) {
                premiumMultiplier *= Math.pow(1000, diamondClippersCount);
              }
              
              // Quantum factory (2x per purchase, stacking)
              const quantumFactoryCount = (state.premiumUpgrades || []).filter((id: string) => id === 'quantum_factory').length;
              if (quantumFactoryCount > 0) {
                premiumMultiplier *= Math.pow(2, quantumFactoryCount);
              }
              
              const totalMultiplier = (state.productionMultiplier + (state.opsProductionMultiplier || 0)) * prestigeProductionMultiplier * premiumMultiplier;
              const potentialProduction = (state.clicks_per_second * totalMultiplier) / 10;
              const wireEfficiency = state.prestigeRewards?.wireEfficiency || 1;
              const actualProduction = Math.min(potentialProduction, currentWire * wireEfficiency);
              
              batchedUpdates.paperclips = state.paperclips + actualProduction;
              batchedUpdates.wire = currentWire - (actualProduction / wireEfficiency);
              batchedUpdates.totalPaperclipsMade = state.totalPaperclipsMade + actualProduction;
            }
          }
          
          // MARKET TICK (optimized - only if we have paperclips to sell)
          if (state.paperclips > 0) {
            const demand = state.marketDemand || 100;
            const saleRate = Math.min(demand / 10, state.paperclips);
            
            if (saleRate > 0) {
              const revenue = saleRate * state.paperclipPrice;
              batchedUpdates.paperclips = (batchedUpdates.paperclips || state.paperclips) - saleRate;
              batchedUpdates.money = (batchedUpdates.money || state.money) + revenue;
              batchedUpdates.paperclipsSold = state.paperclipsSold + saleRate;
              batchedUpdates.totalSales = state.totalSales + revenue;
              batchedUpdates.lifetimePaperclips = (state.lifetimePaperclips || 0) + saleRate;
              batchedUpdates.revenuePerSecond = revenue * 10;
            }
          }
          
          // RESEARCH TICK (only if research is active)
          if (state.researchPointsPerSecond > 0) {
            batchedUpdates.researchPoints = state.researchPoints + (state.researchPointsPerSecond / 10);
          }
        } else {
          // SPACE AGE TICKS - energy generation and resource production
          // We call spaceTick directly which handles all energy and resource updates
          
          try {
            // Log pre-space tick state
            const preState = get();
            console.log(`PRE-SPACE TICK: Energy ${preState.energy}, Harvesters ${preState.oreHarvesters}, Factories ${preState.factories}`);
            
            // Call spaceTick function which handles all space operations
            if (typeof get().spaceTick === 'function') {
              get().spaceTick();
              
              // Log post-space tick state
              const postState = get();
              console.log(`POST-SPACE TICK: Energy ${postState.energy}, Ore ${postState.spaceOre}, Wire ${postState.spaceWire}`);
            }
            
            // Update space market prices and demand
            if (typeof get().updateSpaceMarket === 'function') {
              get().updateSpaceMarket();
            }
            
            // Run auto-sell if enabled
            if (typeof get().spaceAutoSellTick === 'function') {
              get().spaceAutoSellTick();
            }
          } catch (error) {
            console.error('Error in space tick:', error);
          }
        }
        
        // STATS TICK (always runs)
        // Memory regeneration
        if (state.memory < state.memoryMax) {
          const regenAmount = Math.min(state.memoryRegenRate / 10, state.memoryMax - state.memory);
          if (regenAmount > 0) {
            batchedUpdates.memory = state.memory + regenAmount;
          }
        }
        
        // OPs tick - consume memory slowly over time
        if (state.memory >= 0.1 && state.ops < state.opsMax) {
          // Consume memory at a rate of 0.1 per tick (1 memory per second)
          const memoryToUse = Math.min(state.memory, 0.1);
          const opsToGenerate = Math.min(memoryToUse * 50, state.opsMax - state.ops);
          
          if (opsToGenerate > 0) {
            batchedUpdates.ops = state.ops + opsToGenerate;
            batchedUpdates.memory = (batchedUpdates.memory || state.memory) - memoryToUse;
            
            // Update OPs production multiplier
            const opsMultiplier = Math.min(0.5, state.ops / 1000);
            if (opsMultiplier !== state.opsProductionMultiplier) {
              batchedUpdates.opsProductionMultiplier = opsMultiplier;
            }
          }
        }
        
        // Generate yomi and creativity when OPs are full
        const currentOps = batchedUpdates.ops !== undefined ? batchedUpdates.ops : state.ops;
        if (currentOps >= state.opsMax && (state.cpuLevel >= 30 || state.spaceAgeUnlocked)) {
          // Generate yomi when OPs are full - based on CPU level
          const yomiRate = state.cpuLevel * 0.01; // 0.01 per tick = 0.1 per second (since tick runs 10x/sec)
          console.log(`[YOMI] OPs full (${currentOps}/${state.opsMax}), generating ${yomiRate.toFixed(4)} yomi/tick (${(yomiRate * 10).toFixed(3)}/sec) CPU:${state.cpuLevel}`);
          batchedUpdates.yomi = (state.yomi || 0) + yomiRate;
          
          // Generate creativity if creativity is unlocked
          if (state.creativityUnlocked || state.opsMax >= 5000) {
            batchedUpdates.creativity = (state.creativity || 0) + 0.01; // 0.1/10 because this runs 10 times per second
            if (!state.creativityUnlocked && state.opsMax >= 5000) {
              batchedUpdates.creativityUnlocked = true;
            }
          }
        }
        
        // Trust tick
        const nextTrustThreshold = state.nextTrustAt || 100000;
        if (state.totalPaperclipsMade >= nextTrustThreshold) {
          const trustGain = Math.floor(state.totalPaperclipsMade / nextTrustThreshold);
          const newTrust = state.trust + trustGain;
          const newThreshold = nextTrustThreshold * Math.pow(10, trustGain);
          
          batchedUpdates.trust = newTrust;
          batchedUpdates.trustLevel = state.trustLevel + trustGain;
          batchedUpdates.nextTrustAt = newThreshold;
        }
        
        // Creativity tick (only if unlocked)
        if (state.creativityUnlocked && state.ops >= 10) {
          const creativityGen = 0.01; // 0.1 per second
          batchedUpdates.creativity = state.creativity + creativityGen;
        }
        
        // STOCK MARKET TICK (only if bots are active - throttled)
        if (state.stockMarketUnlocked) {
          // Only log debug info occasionally to avoid console spam
          const now = new Date();
          if (now.getSeconds() % 15 === 0 && now.getMilliseconds() < 150) {
            console.log(`[BATCHED_TICK] Stock market status - unlocked: ${state.stockMarketUnlocked}, bots: ${state.tradingBots}, budget: $${state.botTradingBudget?.toFixed(2) || 0}`);
          }
          
          if (state.botTradingBudget > 0 && state.tradingBots > 0) {
          // Only run bot trading periodically to reduce frequency
          const tickCount = Math.floor(Date.now() / 100);
          // Reduce trade interval by 20% for each level of high frequency trading
          const hftLevel = state.highFrequencyTradingLevel || 0;
          // Base of 600, reduced by 20% per HFT level (with a minimum of 100 ticks = 10 seconds)
          const ticksPerTrade = Math.max(100, Math.floor(600 * Math.pow(0.8, hftLevel)));
          if (tickCount % ticksPerTrade === 0) {
            // Bot trading logic would go here, but it's too complex to inline
            // For now, just call the existing function
            console.log('[BATCHED_TICK] Calling botAutoTrade from batchedTick - bots:', state.tradingBots, 'budget:', state.botTradingBudget.toFixed(2));
            get().botAutoTrade();
            console.log('[BATCHED_TICK] botAutoTrade completed');
          }
          } else {
            // Only log occasionally to avoid spam
            const now = new Date();
            if (now.getSeconds() % 30 === 0 && now.getMilliseconds() < 150) {
              if (state.tradingBots <= 0) {
                console.log('[BATCHED_TICK] No bot trading: No trading bots purchased');
              } else if (state.botTradingBudget <= 0) {
                console.log('[BATCHED_TICK] No bot trading: Insufficient budget');
              }
            }
          }
        }
        
        // Update play time and check for diamond rewards
        get().updatePlayTime();
        
        // Apply all batched updates at once
        if (Object.keys(batchedUpdates).length > 0) {
          set(batchedUpdates);
        }
      },
        
      // Prestige System Functions
      calculatePrestigePoints: () => {
        const state = get();
        // Formula: Square root of (total paperclips / 1 million)
        // This provides a reasonable growth curve where early resets give fewer points
        const basePaperclips = state.paperclips + (state.lifetimePaperclips || 0);
        
        // Include aerograde paperclips (worth 10,000x regular paperclips for prestige calculation)
        const aerogradePaperclips = state.aerogradePaperclips || 0;
        const aerogradeValue = aerogradePaperclips * 10000;
        
        const totalValue = basePaperclips + aerogradeValue;
        
        // Base formula - can be adjusted for balance
        let prestigePoints = Math.floor(Math.sqrt(totalValue / 1000000));
        
        // Bonus points for space age achievements
        if (state.spaceAgeUnlocked && aerogradePaperclips > 0) {
          // Additional points for space age progression
          const spaceBonus = Math.floor(Math.sqrt(aerogradePaperclips / 100)); // 1 point per 10,000 aerograde paperclips
          prestigePoints += spaceBonus;
        }
        
        // Apply prestige boost multiplier from premium upgrades (2x per purchase, stacking)
        const prestigeBoostCount = (state.premiumUpgrades || []).filter((id: string) => id === 'prestige_boost').length;
        if (prestigeBoostCount > 0) {
          prestigePoints *= Math.pow(2, prestigeBoostCount);
        }
        
        // Min 1 point if they have at least 1 million total value
        if (totalValue >= 1000000 && prestigePoints < 1) {
          prestigePoints = 1;
        }
        
        return prestigePoints;
      },
      
      prestigeReset: () => {
        const state = get();
        
        // Check if player has 100 million aerograde paperclips
        const aerogradePaperclips = state.aerogradePaperclips || 0;
        if (aerogradePaperclips < 100000000) { // 100 million
          console.log(`[PRESTIGE] Not enough aerograde paperclips: ${aerogradePaperclips} / 100,000,000`);
          return false;
        }
        
        const currentPoints = state.calculatePrestigePoints();
        
        if (currentPoints <= 0) {
          return false;
        }
        
        // Calculate total lifetime paperclips
        const lifetimePaperclips = (state.lifetimePaperclips || 0) + state.paperclips;
        
        // Reset prestige points to 0 (as this is a "reset everything" function)
        const resetPrestigePoints = 0;
        
        // Always increment prestige level when resetting with 100M aerograde paperclips
        const newPrestigeLevel = (state.prestigeLevel || 0) + 1;
        
        // Save prestige data before reset
        set({
          prestigeLevel: newPrestigeLevel,
          prestigePoints: resetPrestigePoints,
          lifetimePaperclips: lifetimePaperclips
        });
        
        // Calculate new rewards based on total prestige points
        get().applyPrestigeRewards();
        
        // Save the game immediately before resetting
        if (typeof window !== 'undefined' && window.saveGameNow) {
          window.saveGameNow()
            .then(() => {
              // Now reset the game state
              get().resetGame();
            })
            .catch(err => {
              // Still reset the game even if save fails
              get().resetGame();
            });
        } else {
          // No save function available, just reset
          get().resetGame();
        }
        
        return true;
      },
      
      applyPrestigeRewards: () => {
        const state = get();
        const level = state.prestigeLevel || 0;
        
        // Calculate rewards based on prestige level (not points)
        // This ensures bonuses persist even when points reset to 0
        const newRewards = {
          productionMultiplier: 1 + (level * 0.002),  // Each level gives +0.2% production (reduced by 100x)
          researchMultiplier: 1 + (level * 0.001),    // Each level gives +0.1% research (reduced by 100x)
          wireEfficiency: 1 + (level * 0.0005),       // Each level gives +0.05% wire efficiency (reduced by 100x)
          startingMoney: level * 50,                  // $50 starting money per level (unchanged)
          clickMultiplier: 1 + (level * 0.001)       // Each level gives +0.1% click production (reduced by 100x)
        };
        
        
        // Update the rewards
        set({ prestigeRewards: newRewards });
      },

      // Reset game state
      resetGame: () => 
        set((state: GameState) => ({
          // Preserve authentication, user data, and prestige info
          userId: state.userId,
          isAuthenticated: state.isAuthenticated,
          
          // Preserve prestige information
          prestigeLevel: state.prestigeLevel || 0,
          prestigePoints: state.prestigePoints || 0,
          lifetimePaperclips: state.lifetimePaperclips || 0,
          prestigeRewards: state.prestigeRewards || {
            productionMultiplier: 1,
            researchMultiplier: 1,
            wireEfficiency: 1,
            startingMoney: 0,
            clickMultiplier: 1
          },
          
          // Resources - apply prestige bonuses
          paperclips: 0,
          money: (state.prestigeRewards?.startingMoney || 0), // Apply starting money from prestige
          wire: 1000, // Start with 1000 wire
          yomi: 0, // Reset yomi
          
          // Preserve premium currency and purchases
          diamonds: state.diamonds || 0,
          totalDiamondsSpent: state.totalDiamondsSpent || 0,
          totalDiamondsPurchased: state.totalDiamondsPurchased || 0,
          premiumUpgrades: state.premiumUpgrades || [],
          
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
          trust: state.prestigeLevel || 0, // Start with 1 trust per prestige level
          trustLevel: state.trustLevel || 0, // Preserve trust level
          nextTrustAt: 100000,
          totalAerogradePaperclips: 0,
          nextAerogradeTrustAt: 10000000000, // 10 billion
          unlockedTrustAbilities: state.unlockedTrustAbilities || [], // Preserve trust abilities
          purchasedTrustLevels: state.purchasedTrustLevels || [], // Preserve purchased trust levels
          ops: 50, // Increased from 10 to 50 (50 OPs per memory)
          opsMax: 50, // Increased from 10 to 50 (50 OPs per memory)
          creativity: 0,
          creativityUnlocked: false,
          unlockedOpsUpgrades: [],
          unlockedCreativityUpgrades: [],
          unlockedMemoryUpgrades: [],
          
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
      name: (state: GameState) => `paperclip-game-storage-${state.userId || 'guest'}`,
      merge: (persistedState: any, currentState: any) => {
        console.log('[GameStore] Merge called - persisted CPU/Memory:', {
          cpuLevel: persistedState?.cpuLevel,
          memory: persistedState?.memory
        });
        
        // Ensure critical values from persisted state are preserved
        const merged = { ...currentState, ...persistedState };
        
        // Never allow CPU/memory to be 0 during merge
        if (merged.cpuLevel === 0 || !merged.cpuLevel) {
          merged.cpuLevel = persistedState?.cpuLevel || currentState.cpuLevel || 1;
        }
        if (merged.memory === 0 || !merged.memory) {
          merged.memory = persistedState?.memory || currentState.memory || 1;
        }
        
        return merged;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[GameStore] Hydration error:', error);
        } else if (state) {
          console.log('[GameStore] Hydrated state - CPU/Memory:', {
            cpuLevel: state.cpuLevel,
            cpuCost: state.cpuCost,
            memory: state.memory,
            memoryMax: state.memoryMax,
            memoryCost: state.memoryCost
          });
          
          // Check if we have preserved state to restore from critical state manager
          const preserved = criticalStateManager.get();
          if (preserved && (!state.cpuLevel || state.cpuLevel === 1) && preserved.cpuLevel > 1) {
            console.log('[GameStore] Restoring preserved CPU/Memory state:', preserved);
            state.cpuLevel = preserved.cpuLevel;
            state.cpuCost = preserved.cpuCost;
            state.memory = preserved.memory;
            state.memoryMax = preserved.memoryMax;
            state.memoryCost = preserved.memoryCost;
            state.memoryRegenRate = preserved.memoryRegenRate;
          }
          
          // Ensure CPU and memory are never 0 after hydration
          if (!state.cpuLevel || state.cpuLevel === 0) {
            console.warn('[GameStore] Fixing cpuLevel after hydration');
            state.cpuLevel = 1;
          }
          if (!state.cpuCost || state.cpuCost === 0) {
            state.cpuCost = 25;
          }
          if (!state.memory || state.memory === 0) {
            console.warn('[GameStore] Fixing memory after hydration');
            state.memory = 1;
          }
          if (!state.memoryMax || state.memoryMax === 0) {
            state.memoryMax = 1;
          }
          if (!state.memoryCost || state.memoryCost === 0) {
            state.memoryCost = 10;
          }
          if (!state.memoryRegenRate || state.memoryRegenRate === 0) {
            state.memoryRegenRate = 1;
          }
        }
      },
      partialize: (state: GameState) => ({
        // User identification (included so userId is part of persisted state)
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
        
        // Prestige system
        prestigeLevel: state.prestigeLevel,
        prestigePoints: state.prestigePoints,
        lifetimePaperclips: state.lifetimePaperclips,
        prestigeRewards: state.prestigeRewards,
        
        // Resources
        paperclips: state.paperclips,
        money: state.money,
        wire: state.wire,
        yomi: state.yomi,
        
        // Diamond system - MUST be persisted
        diamonds: state.diamonds,
        totalDiamondsSpent: state.totalDiamondsSpent,
        totalDiamondsPurchased: state.totalDiamondsPurchased,
        premiumUpgrades: state.premiumUpgrades,
        activePlayTime: state.activePlayTime,
        lastDiamondRewardTime: state.lastDiamondRewardTime,
        
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
        totalAerogradePaperclips: state.totalAerogradePaperclips,
        nextAerogradeTrustAt: state.nextAerogradeTrustAt,
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
        aerogradePaperclips: state.aerogradePaperclips,
        
        // Probe defection system
        enemyShips: state.enemyShips,
        defectionRate: state.defectionRate,
        lastDefectionTime: state.lastDefectionTime,
        totalProbesLost: state.totalProbesLost,
        defectionEvents: state.defectionEvents,
        
        // Space upgrade tracking
        unlockedSpaceUpgrades: state.unlockedSpaceUpgrades,
        unlockedMoneySpaceUpgrades: state.unlockedMoneySpaceUpgrades,
        unlockedOpsSpaceUpgrades: state.unlockedOpsSpaceUpgrades,
        unlockedCreativitySpaceUpgrades: state.unlockedCreativitySpaceUpgrades,
        unlockedYomiSpaceUpgrades: state.unlockedYomiSpaceUpgrades,
        unlockedTrustSpaceUpgrades: state.unlockedTrustSpaceUpgrades,
        unlockedEnergySpaceUpgrades: state.unlockedEnergySpaceUpgrades,
        
        // Space upgrade bonuses
        spaceInfrastructureBonus: state.spaceInfrastructureBonus,
        passiveIncomeRate: state.passiveIncomeRate,
        opsGenerationRate: state.opsGenerationRate,
        creativityBonus: state.creativityBonus,
        costReductionBonus: state.costReductionBonus,
        diplomacyBonus: state.diplomacyBonus,
        wireProductionBonus: state.wireProductionBonus,
        factoryProductionBonus: state.factoryProductionBonus,
        oreProductionBonus: state.oreProductionBonus,
        miningEfficiency: state.miningEfficiency,
        droneEfficiency: state.droneEfficiency,
        factoryEfficiency: state.factoryEfficiency,
        explorationSpeed: state.explorationSpeed,
        nanobotRepairEnabled: state.nanobotRepairEnabled,
        honor: state.honor,
        battlesWon: state.battlesWon,
        autoBattleEnabled: state.autoBattleEnabled,
        autoBattleUnlocked: state.autoBattleUnlocked,
        battleDifficulty: state.battleDifficulty,
        
        // Energy System
        solarArrays: state.solarArrays,
        batteries: state.batteries,
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        energyPerSecond: state.energyPerSecond,
        energyConsumedPerSecond: state.energyConsumedPerSecond,
        
        // Space Market
        spaceMarketDemand: state.spaceMarketDemand,
        spaceMarketMaxDemand: state.spaceMarketMaxDemand,
        spaceMarketMinDemand: state.spaceMarketMinDemand,
        spacePaperclipPrice: state.spacePaperclipPrice,
        spaceAerogradePrice: state.spaceAerogradePrice,
        spaceOrePrice: state.spaceOrePrice,
        spaceWirePrice: state.spaceWirePrice,
        spacePaperclipsSold: state.spacePaperclipsSold,
        spaceAerogradeSold: state.spaceAerogradeSold,
        spaceOreSold: state.spaceOreSold,
        spaceWireSold: state.spaceWireSold,
        spaceTotalSales: state.spaceTotalSales,
        spaceMarketTrend: state.spaceMarketTrend,
        spaceMarketVolatility: state.spaceMarketVolatility,
        spaceAutoSellEnabled: state.spaceAutoSellEnabled,
        spaceAutoSellUnlocked: state.spaceAutoSellUnlocked,
        spaceSmartPricingEnabled: state.spaceSmartPricingEnabled,
        spaceSmartPricingUnlocked: state.spaceSmartPricingUnlocked,
        
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
