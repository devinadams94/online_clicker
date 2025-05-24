export interface OfflineProgress {
  paperclipsProduced: number;
  paperclipsSold: number;
  salesRevenue: number;
  researchPoints: number;
  stockMarketReturns: number;
  wireUsed: number;
  offlineTime: number;
}

export interface PrestigeRewards {
  productionMultiplier: number;  // Multiplier for paperclip production
  researchMultiplier: number;    // Multiplier for research point generation
  wireEfficiency: number;        // Wire efficiency (less wire used per clip)
  startingMoney: number;         // Starting money on reset
  clickMultiplier: number;       // Multiplier for click production
}

export interface GameState {
  // Allow string indexing for dynamic access
  [key: string]: any;

  // Prestige System
  prestigeLevel: number;         // Number of times prestiged
  prestigePoints: number;        // Current prestige points
  lifetimePaperclips: number;    // Total paperclips made across all resets
  prestigeRewards: PrestigeRewards; // Current prestige rewards
  
  // Resources
  paperclips: number;
  money: number;
  wire: number;
  yomi: number;
  
  // Space Age Resources
  probes: number;
  universeExplored: number;
  wireHarvesters: number;
  oreHarvesters: number;
  factories: number;
  spaceWirePerSecond: number;
  spaceOrePerSecond: number;
  spacePaperclipsPerSecond: number;
  spaceMatter: number;
  spaceOre: number;
  spaceWire: number;
  totalSpaceMatter: number;
  discoveredPlanets: Planet[];
  currentPlanetIndex: number;
  discoveredCelestialBodies: CelestialBody[];
  aerogradePaperclips: number;
  droneReplicationEnabled: boolean; // Whether drone self-replication is enabled
  droneReplicationCostPerDrone: number; // Cost in Aerograde paperclips to replicate a drone
  autoBattleEnabled: boolean; // Whether auto-battles are enabled
  autoBattleUnlocked: boolean; // Whether auto-battle has been unlocked
  battlesWon: number; // Total battles won for difficulty scaling
  battleDifficulty: number; // Current battle difficulty multiplier
  
  // Production
  autoclippers: number;
  autoclipper_cost: number;
  clicks_per_second: number;
  clickMultiplier: number;
  totalClicks: number;
  totalPaperclipsMade: number;
  revenuePerSecond: number;
  productionMultiplier: number;
  megaClippers: number;
  megaClipperCost: number;
  megaClippersUnlocked: boolean;
  
  // Offline Progress
  offlineProgress?: OfflineProgress | null;
  
  // Wire production
  spoolCost: number;
  wirePerSpool: number;
  autoWireBuyer: boolean;
  autoWireBuyerCost: number;
  spoolSizeLevel: number;
  spoolSizeUpgradeCost: number;
  lastWirePurchaseTime: Date;
  wirePurchaseCount: number;
  
  // Market data
  paperclipPrice: number;
  marketDemand: number;
  paperclipsSold: number;
  totalSales: number;
  
  // Market parameters
  basePaperclipPrice: number;
  elasticity: number;
  marketTrend: number;
  seasonalMultiplier: number;
  volatility: number;
  maxDemand: number;
  minDemand: number;
  marketDemandLevel: number;
  marketDemandUpgradeCost: number;
  
  // Research
  researchPoints: number;
  researchPointsPerSecond: number;
  unlockedResearch: string[];
  
  // Stock Market
  stockMarketUnlocked: boolean;
  tradingBots: number;
  tradingBotCost: number;
  botIntelligence: number;
  botIntelligenceCost: number;
  botTradingBudget: number;
  botLastTradeTime: Date;
  botTradingProfit: number;
  botTradingLosses: number;
  botRiskThreshold: number; // Risk threshold for bot trading (0.1=10%, 0.2=20%, 0.3=30%)
  stockMarketReturns: number;
  stockMarketInvestment: number;
  stockMarketLastUpdate: Date;
  stockPortfolio: StockHolding[];
  stockPriceHistory: Record<string, number[]>;
  portfolioValue: number;
  stockTrendData?: Record<string, {
    trendDirection: number;
    trendStrength: number;
    trendStartTime: Date;
    trendDuration: number;
  } | null>;
  
  // Player Stats
  cpuLevel: number;
  cpuCost: number;
  memory: number;
  memoryMax: number;
  memoryCost: number;
  memoryRegenRate: number;
  
  // Advanced Resources
  trust: number;
  trustLevel: number;
  nextTrustAt: number;
  purchasedTrustLevels: number[];
  unlockedTrustAbilities: string[];
  ops: number;
  opsMax: number;
  opsProductionMultiplier: number;
  creativity: number;
  creativityUnlocked: boolean;
  unlockedOpsUpgrades: string[];
  unlockedCreativityUpgrades: string[];
  unlockedMemoryUpgrades: string[]; // Track purchased memory upgrades
  upgradeCosts: Record<string, number>; // Store the costs of upgrades
  
  // Unlockable Features
  metricsUnlocked: boolean;
  
  // Space Age
  spaceAgeUnlocked: boolean;
  spaceStats: SpaceStats;
  unlockedSpaceResearch: string[];
  
  // Meta
  lastSaved?: Date;
  lastPriceUpdate?: Date;
}

export interface VisualSettings {
  particleIntensity: number;
  clickAnimations: boolean;
  floatingText: boolean;
}

export interface MarketData {
  currentPrice: number;
  currentDemand: number;
  trend: number;
  seasonal: number;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  price: number;
  previousPrice: number;
  volatility: number;
  trend: number;
  volume: number;
  lastUpdate: Date;
  trendDirection: number; // 0 = neutral, 1 = bullish (up), -1 = bearish (down)
  trendStrength: number; // 0-1 scale of how strong the trend is
  trendStartTime: Date; // When the current trend started
  trendDuration: number; // How long the trend has been active in milliseconds
}

export interface StockHolding {
  stockId: string;
  quantity: number;
  averagePurchasePrice: number;
  value: number;
}

export interface StockMarketState {
  stocks: Stock[];
  portfolio: StockHolding[];
  portfolioValue: number;
  cash: number;
  lastUpdate: Date;
}

export interface Planet {
  id: string;
  name: string;
  icon: string;
  matter: number;
  totalMatter: number;
  description: string;
  discoveredAt: number; // Universe exploration percentage when discovered
}

export interface CelestialBody {
  id: string;
  type: 'asteroid' | 'comet' | 'dwarf' | 'debris'; // Type of celestial body
  name: string;
  icon: string;
  resources: {
    matter: number;
    ore: number;
    rareElements?: number;
  };
  totalResources: {
    matter: number;
    ore: number;
    rareElements?: number;
  };
  description: string;
  discoveredAt: number; // Universe exploration percentage when discovered
  isBeingHarvested: boolean; // Whether drones are currently harvesting this body
}

export interface SpaceStats {
  speed: number;
  exploration: number;
  selfReplication: number;
  wireProduction: number;
  miningProduction: number;
  factoryProduction: number;
  combat?: number;
  hazardEvasion?: number; // New stat for hazard evasion - reduces probe crashes and combat losses
  [key: string]: number | undefined; // Allow string indexing
}
