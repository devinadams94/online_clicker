import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
// GameState type is not used in this file

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Handle both regular JSON and sendBeacon blob data
    let body;
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      body = await req.json();
    } else {
      // Handle blob data from sendBeacon
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch (e) {
        console.error('[SAVE API] Failed to parse request body:', e);
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );
      }
    }
    
    // Log diamond values being saved
    console.log('[SAVE API] Saving game state for user:', session.user.id);
    console.log('[SAVE API] Diamond values:', {
      diamonds: body.diamonds,
      totalDiamondsSpent: body.totalDiamondsSpent,
      totalDiamondsPurchased: body.totalDiamondsPurchased
    });
    
    // Check if user has a game state, create one if not
    let existingGameState = await prisma.gameState.findUnique({
      where: { userId: session.user.id },
    });
    
    // Create initial game state if it doesn't exist
    if (!existingGameState) {
      try {
        existingGameState = await prisma.gameState.create({
          data: {
            userId: session.user.id,
            // Add default values for space age fields
            spaceAgeUnlocked: false,
            probes: 0,
            universeExplored: 0,
            wireHarvesters: 0,
            oreHarvesters: 0,
            factories: 0,
            spaceWirePerSecond: 0,
            spaceOrePerSecond: 0,
            spacePaperclipsPerSecond: 0,
            spaceStats: JSON.stringify({
              speed: 1,
              exploration: 1,
              selfReplication: 1,
              wireProduction: 1,
              miningProduction: 1,
              factoryProduction: 1
            }),
            // Initialize space combat fields
            honor: 0,
            battlesWon: 0,
            autoBattleEnabled: false,
            autoBattleUnlocked: false,
            battleDifficulty: 1
          },
        });
      } catch (createError) {
        // Check if this is a foreign key constraint error
        if (String(createError).includes('foreign key')) {
          // The user record might not exist yet
          throw new Error("User account not properly initialized. Please try logging out and back in.");
        }
        throw createError;
      }
    }

    // Use the raw executeRaw command to update money directly
    try {
      // Get money from request body
      const money = parseFloat(body.money || 0);
      
      // Get paperclip price from request body
      const paperclipPrice = parseFloat(body.paperclipPrice || 0.25);
      
      
      
      
      
      
      
      
      
      
      // Get bot intelligence value with fallback
      const botIntelligenceValue = parseInt(body.botIntelligence || 1) || 1;
      
      
      
      
      // Ensure we have valid values with fallbacks
      const cpuLevel = parseInt(body.cpuLevel || 1) || 1;
      const cpuCost = parseFloat(body.cpuCost || 25) || 25;
      const memory = parseFloat(body.memory || 1) || 1;
      const memoryMax = parseFloat(body.memoryMax || 1) || 1;
      const memoryCost = parseFloat(body.memoryCost || 10) || 10;
      const memoryRegenRate = parseFloat(body.memoryRegenRate || 1) || 1;
      const opsMax = parseFloat(body.opsMax || 50) || 50;
      
      // Megaclippers fallbacks
      const megaClippers = parseInt(body.megaClippers || 0) || 0;
      const megaClipperCost = parseFloat(body.megaClipperCost || 5000) || 5000;
      const megaClippersUnlocked = Boolean(body.megaClippersUnlocked);
      const productionMultiplier = parseFloat(body.productionMultiplier || 1) || 1;
      
      // OPs and Yomi fallbacks
      const ops = parseFloat(body.ops || 50) || 50;
      const yomi = parseFloat(body.yomi || 0) || 0;
      
      // Space combat fields
      const honor = parseFloat(body.honor || 0) || 0;
      const battlesWon = parseInt(body.battlesWon || 0) || 0;
      const battleDifficulty = parseFloat(body.battleDifficulty || 1) || 1;
      const aerogradePaperclips = parseFloat(body.aerogradePaperclips || 0) || 0;
      
      // Energy system fields
      const solarArrays = parseFloat(body.solarArrays || 0) || 0;
      const batteries = parseFloat(body.batteries || 0) || 0;
      const energy = parseFloat(body.energy || 0) || 0;
      const maxEnergy = parseFloat(body.maxEnergy || 0) || 0;
      const energyPerSecond = parseFloat(body.energyPerSecond || 0) || 0;
      
      // Space upgrade bonus fields
      const spaceInfrastructureBonus = parseFloat(body.spaceInfrastructureBonus || 1) || 1;
      const passiveIncomeRate = parseFloat(body.passiveIncomeRate || 0) || 0;
      const opsGenerationRate = parseFloat(body.opsGenerationRate || 0) || 0;
      const creativityBonus = parseFloat(body.creativityBonus || 1) || 1;
      const costReductionBonus = parseFloat(body.costReductionBonus || 1) || 1;
      const diplomacyBonus = parseFloat(body.diplomacyBonus || 1) || 1;
      const miningEfficiency = parseFloat(body.miningEfficiency || 1) || 1;
      const droneEfficiency = parseFloat(body.droneEfficiency || 1) || 1;
      const factoryEfficiency = parseFloat(body.factoryEfficiency || 1) || 1;
      const explorationSpeed = parseFloat(body.explorationSpeed || 1) || 1;
      const nanobotRepairEnabled = Boolean(body.nanobotRepairEnabled);
      
      // Probe defection system fields
      const enemyShips = parseFloat(body.enemyShips || 0) || 0;
      const defectionRate = parseFloat(body.defectionRate || 0.001) || 0.001;
      const totalProbesLost = parseFloat(body.totalProbesLost || 0) || 0;
      
      // Diamond system fields - with safeguard
      const diamonds = parseFloat(body.diamonds || 0) || 0;
      const totalDiamondsSpent = parseFloat(body.totalDiamondsSpent || 0) || 0;
      const totalDiamondsPurchased = parseFloat(body.totalDiamondsPurchased || 0) || 0;
      
      // Space Market fields
      const spaceMarketDemand = parseFloat(body.spaceMarketDemand || 100) || 100;
      const spaceMarketMaxDemand = parseFloat(body.spaceMarketMaxDemand || 500) || 500;
      const spaceMarketMinDemand = parseFloat(body.spaceMarketMinDemand || 10) || 10;
      const spacePaperclipPrice = parseFloat(body.spacePaperclipPrice || 0.50) || 0.50;
      const spaceAerogradePrice = parseFloat(body.spaceAerogradePrice || 50.00) || 50.00;
      const spaceOrePrice = parseFloat(body.spaceOrePrice || 5.00) || 5.00;
      const spaceWirePrice = parseFloat(body.spaceWirePrice || 10.00) || 10.00;
      const spacePaperclipsSold = parseFloat(body.spacePaperclipsSold || 0) || 0;
      const spaceAerogradeSold = parseFloat(body.spaceAerogradeSold || 0) || 0;
      const spaceOreSold = parseFloat(body.spaceOreSold || 0) || 0;
      const spaceWireSold = parseFloat(body.spaceWireSold || 0) || 0;
      const spaceTotalSales = parseFloat(body.spaceTotalSales || 0) || 0;
      const spaceMarketTrend = parseFloat(body.spaceMarketTrend || 0) || 0;
      const spaceMarketVolatility = parseFloat(body.spaceMarketVolatility || 0.20) || 0.20;
      const energyConsumedPerSecond = parseFloat(body.energyConsumedPerSecond || 0) || 0;
      const spaceAutoSellEnabled = Boolean(body.spaceAutoSellEnabled);
      const spaceAutoSellUnlocked = Boolean(body.spaceAutoSellUnlocked);
      const spaceSmartPricingEnabled = Boolean(body.spaceSmartPricingEnabled);
      const spaceSmartPricingUnlocked = Boolean(body.spaceSmartPricingUnlocked);
      
      // Play time tracking
      const activePlayTime = parseFloat(body.activePlayTime || 0) || 0;
      const lastDiamondRewardTime = parseFloat(body.lastDiamondRewardTime || 0) || 0;
      
      // Safeguard: if trying to save 0 diamonds but user has purchased diamonds, something is wrong
      if (diamonds === 0 && totalDiamondsPurchased > 0) {
        console.warn('[SAVE] Warning: Attempting to save 0 diamonds when totalDiamondsPurchased is', totalDiamondsPurchased);
        // Get current state from database to prevent overwriting
        const currentState = await prisma.gameState.findUnique({
          where: { userId: session.user.id },
          select: { diamonds: true }
        });
        if (currentState && currentState.diamonds > 0) {
          console.warn('[SAVE] Preventing diamond reset - keeping current value:', currentState.diamonds);
          // Skip this save to prevent data loss
          return NextResponse.json({
            message: "Save skipped - diamond protection activated",
            protected: true
          });
        }
      }
      
      // Update using direct SQL for critical values with SQLite syntax
      // Adding computational values to the critical direct SQL update
      const result = await prisma.$executeRaw`
        UPDATE "GameState" 
        SET "money" = ${money}, 
            "paperclipPrice" = ${paperclipPrice},
            "botIntelligence" = ${botIntelligenceValue},
            "cpuLevel" = ${cpuLevel},
            "cpuCost" = ${cpuCost},
            "memory" = ${memory},
            "memoryMax" = ${memoryMax},
            "memoryCost" = ${memoryCost},
            "memoryRegenRate" = ${memoryRegenRate},
            "opsMax" = ${opsMax},
            "ops" = ${ops},
            "yomi" = ${yomi},
            "honor" = ${honor},
            "battlesWon" = ${battlesWon},
            "battleDifficulty" = ${battleDifficulty},
            "autoBattleEnabled" = ${Boolean(body.autoBattleEnabled) ? 1 : 0},
            "autoBattleUnlocked" = ${Boolean(body.autoBattleUnlocked) ? 1 : 0},
            "aerogradePaperclips" = ${aerogradePaperclips},
            "megaClippers" = ${megaClippers},
            "megaClipperCost" = ${megaClipperCost},
            "megaClippersUnlocked" = ${megaClippersUnlocked ? 1 : 0},
            "productionMultiplier" = ${productionMultiplier},
            "solarArrays" = ${solarArrays},
            "batteries" = ${batteries},
            "energy" = ${energy},
            "maxEnergy" = ${maxEnergy},
            "energyPerSecond" = ${energyPerSecond},
            "spaceInfrastructureBonus" = ${spaceInfrastructureBonus},
            "passiveIncomeRate" = ${passiveIncomeRate},
            "opsGenerationRate" = ${opsGenerationRate},
            "creativityBonus" = ${creativityBonus},
            "costReductionBonus" = ${costReductionBonus},
            "diplomacyBonus" = ${diplomacyBonus},
            "miningEfficiency" = ${miningEfficiency},
            "droneEfficiency" = ${droneEfficiency},
            "factoryEfficiency" = ${factoryEfficiency},
            "explorationSpeed" = ${explorationSpeed},
            "nanobotRepairEnabled" = ${nanobotRepairEnabled ? 1 : 0},
            "enemyShips" = ${enemyShips},
            "defectionRate" = ${defectionRate},
            "totalProbesLost" = ${totalProbesLost},
            "diamonds" = ${diamonds},
            "totalDiamondsSpent" = ${totalDiamondsSpent},
            "totalDiamondsPurchased" = ${totalDiamondsPurchased},
            "spaceMarketDemand" = ${spaceMarketDemand},
            "spaceMarketMaxDemand" = ${spaceMarketMaxDemand},
            "spaceMarketMinDemand" = ${spaceMarketMinDemand},
            "spacePaperclipPrice" = ${spacePaperclipPrice},
            "spaceAerogradePrice" = ${spaceAerogradePrice},
            "spaceOrePrice" = ${spaceOrePrice},
            "spaceWirePrice" = ${spaceWirePrice},
            "spacePaperclipsSold" = ${spacePaperclipsSold},
            "spaceAerogradeSold" = ${spaceAerogradeSold},
            "spaceOreSold" = ${spaceOreSold},
            "spaceWireSold" = ${spaceWireSold},
            "spaceTotalSales" = ${spaceTotalSales},
            "spaceMarketTrend" = ${spaceMarketTrend},
            "spaceMarketVolatility" = ${spaceMarketVolatility},
            "energyConsumedPerSecond" = ${energyConsumedPerSecond},
            "spaceAutoSellEnabled" = ${spaceAutoSellEnabled ? 1 : 0},
            "spaceAutoSellUnlocked" = ${spaceAutoSellUnlocked ? 1 : 0},
            "spaceSmartPricingEnabled" = ${spaceSmartPricingEnabled ? 1 : 0},
            "spaceSmartPricingUnlocked" = ${spaceSmartPricingUnlocked ? 1 : 0},
            "activePlayTime" = ${activePlayTime},
            "lastDiamondRewardTime" = ${lastDiamondRewardTime},
            "lastSaved" = CURRENT_TIMESTAMP
        WHERE "userId" = ${session.user.id}
      `;
      
      // Double-check after saving
      try {
        const gameStateAfterSave = await prisma.gameState.findUnique({
          where: { userId: session.user.id },
          select: { 
            cpuCost: true, 
            memoryCost: true, 
            ops: true, 
            opsMax: true,
            yomi: true,
            honor: true,
            battlesWon: true,
            autoBattleEnabled: true,
            autoBattleUnlocked: true,
            aerogradePaperclips: true
          }
        });
        
      } catch (err) {
      }
      
      
      // For non-money fields, update normally
      const updatedGameState = await prisma.gameState.update({
        where: { userId: session.user.id },
        data: {
          paperclips: parseFloat(body.paperclips || 0),
          wire: parseFloat(body.wire || 1000),
          autoclippers: parseInt(body.autoclippers || 0),
          autoclipper_cost: parseFloat(body.autoclipper_cost || 10),
          clicks_per_second: parseFloat(body.clicks_per_second || 0),
          clickMultiplier: parseInt(body.clickMultiplier || 1),
          totalClicks: parseInt(body.totalClicks || 0),
          totalPaperclipsMade: parseFloat(body.totalPaperclipsMade || 0),
          highestRun: Math.max(parseFloat(body.highestRun || 0), parseFloat(body.paperclips || 0), parseFloat(body.aerogradePaperclips || 0)),
          revenuePerSecond: parseFloat(body.revenuePerSecond || 0),
          
          // Save Space Age values
          spaceAgeUnlocked: Boolean(body.spaceAgeUnlocked),
          probes: parseFloat(body.probes || 0),
          universeExplored: parseFloat(body.universeExplored || 0),
          wireHarvesters: parseFloat(body.wireHarvesters || 0),
          oreHarvesters: parseFloat(body.oreHarvesters || 0),
          factories: parseFloat(body.factories || 0),
          spaceWirePerSecond: parseFloat(body.spaceWirePerSecond || 0),
          spaceOrePerSecond: parseFloat(body.spaceOrePerSecond || 0),
          spacePaperclipsPerSecond: parseFloat(body.spacePaperclipsPerSecond || 0),
          spaceStats: body.spaceStats ? (
            typeof body.spaceStats === 'string' ? body.spaceStats : JSON.stringify(body.spaceStats)
          ) : JSON.stringify({
            speed: 1,
            exploration: 1,
            selfReplication: 1,
            wireProduction: 1,
            miningProduction: 1,
            factoryProduction: 1
          }),
          // Space Upgrades
          unlockedSpaceUpgrades: (() => {
            
            let upgradesList: string[] = [];
            
            try {
              // Handle different possible formats of the incoming data
              if (Array.isArray(body.unlockedSpaceUpgrades)) {
                upgradesList = [...body.unlockedSpaceUpgrades];
              } else if (typeof body.unlockedSpaceUpgrades === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.unlockedSpaceUpgrades);
                  if (Array.isArray(parsed)) {
                    upgradesList = [...parsed];
                  } else {
                  }
                } catch (err) {
                }
              } else {
              }
              
              // Deduplicate the array to ensure each upgrade only appears once
              upgradesList = [...new Set(upgradesList)];
              
              return JSON.stringify(upgradesList);
            } catch (err) {
              return "[]";
            }
          })(),
          
          // Space upgrade tracking arrays
          unlockedMoneySpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedMoneySpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedMoneySpaceUpgrades)]);
              } else if (typeof body.unlockedMoneySpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedMoneySpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          unlockedOpsSpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedOpsSpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedOpsSpaceUpgrades)]);
              } else if (typeof body.unlockedOpsSpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedOpsSpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          unlockedCreativitySpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedCreativitySpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedCreativitySpaceUpgrades)]);
              } else if (typeof body.unlockedCreativitySpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedCreativitySpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          unlockedYomiSpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedYomiSpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedYomiSpaceUpgrades)]);
              } else if (typeof body.unlockedYomiSpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedYomiSpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          unlockedTrustSpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedTrustSpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedTrustSpaceUpgrades)]);
              } else if (typeof body.unlockedTrustSpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedTrustSpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          unlockedEnergySpaceUpgrades: (() => {
            try {
              if (Array.isArray(body.unlockedEnergySpaceUpgrades)) {
                return JSON.stringify([...new Set(body.unlockedEnergySpaceUpgrades)]);
              } else if (typeof body.unlockedEnergySpaceUpgrades === 'string') {
                const parsed = JSON.parse(body.unlockedEnergySpaceUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          
          // Probe defection system fields
          enemyShips: parseFloat(body.enemyShips || 0),
          defectionRate: parseFloat(body.defectionRate || 0.001),
          lastDefectionTime: body.lastDefectionTime ? new Date(body.lastDefectionTime) : new Date(),
          totalProbesLost: parseFloat(body.totalProbesLost || 0),
          defectionEvents: (() => {
            try {
              if (Array.isArray(body.defectionEvents)) {
                return JSON.stringify(body.defectionEvents);
              } else if (typeof body.defectionEvents === 'string') {
                const parsed = JSON.parse(body.defectionEvents);
                return Array.isArray(parsed) ? JSON.stringify(parsed) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          
          // Space Combat Fields
          honor: parseFloat(body.honor || 0),
          battlesWon: parseInt(body.battlesWon || 0),
          autoBattleEnabled: Boolean(body.autoBattleEnabled),
          autoBattleUnlocked: Boolean(body.autoBattleUnlocked),
          battleDifficulty: parseFloat(body.battleDifficulty || 1),
          // paperclipPrice is handled by the direct SQL update
          marketDemand: parseFloat(body.marketDemand || 10),
          paperclipsSold: parseFloat(body.paperclipsSold || 0),
          totalSales: parseFloat(body.totalSales || 0),
          // Market parameters
          maxDemand: parseFloat(body.maxDemand || 50),
          minDemand: parseFloat(body.minDemand || 1),
          marketDemandLevel: parseInt(body.marketDemandLevel || 1),
          marketDemandUpgradeCost: parseFloat(body.marketDemandUpgradeCost || 200),
          // Wire production fields
          autoWireBuyer: Boolean(body.autoWireBuyer),
          autoWireBuyerCost: parseFloat(body.autoWireBuyerCost || 100),
          spoolCost: parseFloat(body.spoolCost || 5),
          wirePerSpool: parseFloat(body.wirePerSpool || 1000),
          spoolSizeLevel: parseInt(body.spoolSizeLevel || 1),
          spoolSizeUpgradeCost: parseFloat(body.spoolSizeUpgradeCost || 125),
          lastWirePurchaseTime: body.lastWirePurchaseTime ? new Date(body.lastWirePurchaseTime) : new Date(),
          wirePurchaseCount: parseInt(body.wirePurchaseCount || 0),
          // Research fields
          researchPoints: parseFloat(body.researchPoints || 0),
          researchPointsPerSecond: parseFloat(body.researchPointsPerSecond || 0.5),
          unlockedResearch: body.unlockedResearch || "[]",
          // Stock Market fields
          stockMarketUnlocked: Boolean(body.stockMarketUnlocked),
          tradingBots: parseInt(body.tradingBots || 0),
          tradingBotCost: parseFloat(body.tradingBotCost || 1000),
          botIntelligence: botIntelligenceValue, // Use the same value as the direct SQL update
          botIntelligenceCost: parseFloat(body.botIntelligenceCost || 1500),
          botTradingBudget: parseFloat(body.botTradingBudget || 0),
          botLastTradeTime: body.botLastTradeTime ? new Date(body.botLastTradeTime) : new Date(),
          botTradingProfit: parseFloat(body.botTradingProfit || 0),
          botTradingLosses: parseFloat(body.botTradingLosses || 0),
          stockMarketReturns: parseFloat(body.stockMarketReturns || 0),
          stockMarketInvestment: parseFloat(body.stockMarketInvestment || 0),
          stockPortfolio: body.stockPortfolio || "[]",
          stockPriceHistory: body.stockPriceHistory || "{}",
          portfolioValue: parseFloat(body.portfolioValue || 0),
          // Player Stats fields - some critical fields are handled in direct SQL
          // cpuLevel, cpuCost, memoryMax, memoryCost, memoryRegenRate are handled in direct SQL now
          memory: parseFloat(body.memory || 1),
          
          // Advanced Resources
          trust: parseFloat(body.trust || 0),
          trustLevel: parseInt(body.trustLevel || 0),
          nextTrustAt: parseFloat(body.nextTrustAt || 100000),
          // Force purchasedTrustLevels to be properly stored with explicit numeric conversion
          purchasedTrustLevels: (() => {
            
            let levelsToSave = [];
            
            // Handle different possible formats of the incoming data
            if (Array.isArray(body.purchasedTrustLevels)) {
              // Map each level to a number to ensure consistent type
              levelsToSave = body.purchasedTrustLevels.map((level: any) => Number(level));
            } else if (typeof body.purchasedTrustLevels === 'string') {
              try {
                // Try to parse if it's already a JSON string
                const parsed = JSON.parse(body.purchasedTrustLevels);
                if (Array.isArray(parsed)) {
                  // Map each level to a number to ensure consistent type
                  levelsToSave = parsed.map((level: any) => Number(level));
                } else {
                  levelsToSave = [];
                }
              } catch (err) {
                levelsToSave = [];
              }
            } else {
              levelsToSave = [];
            }
            
            // Filter out any NaN values from the conversion
            levelsToSave = levelsToSave.filter((level: any) => !isNaN(level));
            
            const jsonString = JSON.stringify(levelsToSave);
            return jsonString;
          })(),
          
          // Debug trust abilities data with enhanced validation
          unlockedTrustAbilities: (() => {
            
            let abilitiesToSave = [];
            
            // Handle different possible formats of the incoming data
            if (Array.isArray(body.unlockedTrustAbilities)) {
              abilitiesToSave = body.unlockedTrustAbilities;
            } else if (typeof body.unlockedTrustAbilities === 'string') {
              try {
                // Try to parse if it's already a JSON string
                abilitiesToSave = JSON.parse(body.unlockedTrustAbilities);
              } catch (err) {
                abilitiesToSave = [];
              }
            } else {
              abilitiesToSave = [];
            }
            
            // Final validation - ensure it's actually an array
            if (!Array.isArray(abilitiesToSave)) {
              abilitiesToSave = [];
            }
            
            const jsonString = JSON.stringify(abilitiesToSave);
            return jsonString;
          })(),
          // ops and opsMax are handled in direct SQL now
          creativity: parseFloat(body.creativity || 0),
          creativityUnlocked: Boolean(body.creativityUnlocked),
          unlockedOpsUpgrades: body.unlockedOpsUpgrades ? JSON.stringify(body.unlockedOpsUpgrades) : "[]",
          unlockedCreativityUpgrades: (() => {
            
            let upgradesList: string[] = [];
            
            try {
              // Handle different possible formats of the incoming data
              if (Array.isArray(body.unlockedCreativityUpgrades)) {
                upgradesList = [...body.unlockedCreativityUpgrades];
              } else if (typeof body.unlockedCreativityUpgrades === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.unlockedCreativityUpgrades);
                  if (Array.isArray(parsed)) {
                    upgradesList = [...parsed];
                  } else {
                  }
                } catch (err) {
                }
              } else {
              }
              
              // Deduplicate the array to ensure each upgrade only appears once
              upgradesList = [...new Set(upgradesList)];
              
            } catch (err) {
            }
            
            return JSON.stringify(upgradesList);
          })(),
          // Save memory upgrades with validation
          unlockedMemoryUpgrades: (() => {
            
            let upgradesList: string[] = [];
            
            try {
              // Handle different data types
              if (Array.isArray(body.unlockedMemoryUpgrades)) {
                upgradesList = [...body.unlockedMemoryUpgrades];
              } else if (typeof body.unlockedMemoryUpgrades === 'string') {
                // Try to parse as JSON
                try {
                  const parsed = JSON.parse(body.unlockedMemoryUpgrades);
                  if (Array.isArray(parsed)) {
                    upgradesList = [...parsed];
                  } else {
                  }
                } catch (err) {
                }
              } else {
              }
              
              const result = JSON.stringify(upgradesList);
              return result;
            } catch (err) {
              return '[]';
            }
          })(),
          // Save upgrade costs with enhanced validation and preprocessing
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
            
            // Initialize with defaults
            let costsToSave = { ...defaultCosts };
            
            try {
              // Handle different possible formats of the incoming data
              if (body.upgradeCosts && typeof body.upgradeCosts === 'object' && !Array.isArray(body.upgradeCosts)) {
                
                // Copy values, ensuring they are valid numbers
                Object.entries(body.upgradeCosts).forEach(([key, value]) => {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    costsToSave[key] = numValue;
                  }
                });
              } else if (typeof body.upgradeCosts === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.upgradeCosts);
                  
                  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    
                    // Copy values, ensuring they are valid numbers
                    Object.entries(parsed).forEach(([key, value]) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        costsToSave[key] = numValue;
                      }
                    });
                  } else {
                  }
                } catch (err) {
                }
              } else {
              }
            } catch (err) {
            }
            
            // CRITICAL: Check final values before saving
            if (!costsToSave.parallelProcessing) {
              costsToSave.parallelProcessing = defaultCosts.parallelProcessing;
            }
            
            
            const jsonString = JSON.stringify(costsToSave);
            return jsonString;
          })(),
          
          // Premium upgrades array
          premiumUpgrades: (() => {
            try {
              if (Array.isArray(body.premiumUpgrades)) {
                return JSON.stringify([...new Set(body.premiumUpgrades)]);
              } else if (typeof body.premiumUpgrades === 'string') {
                const parsed = JSON.parse(body.premiumUpgrades);
                return Array.isArray(parsed) ? JSON.stringify([...new Set(parsed)]) : "[]";
              }
              return "[]";
            } catch (err) {
              return "[]";
            }
          })(),
          
          metricsUnlocked: Boolean(body.metricsUnlocked),
          lastSaved: new Date(),
        }
      });

      // Use the simpler, more consistent approach
      return new Response(
        JSON.stringify({
          message: "Game state saved successfully",
          gameState: updatedGameState,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      
      // Create a detailed error response
      const errorDetails = {
        message: `Database error: ${err instanceof Error ? err.message : 'Unknown SQL error'}`,
        error: true,
        timestamp: new Date().toISOString(),
        details: {
          name: err instanceof Error ? err.name : 'UnknownError',
          code: err instanceof Error ? (err as any).code : undefined,
          errno: err instanceof Error ? (err as any).errno : undefined
        }
      };
      
      
      // Use standard Response constructor instead of NextResponse
      return new Response(
        JSON.stringify(errorDetails),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    
    // Get a more detailed error message
    let errorMessage = "An error occurred while saving the game state";
    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    }
    
    
    
    // Create error object with detailed information
    const errorResponse = {
      message: errorMessage,
      error: true,
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? {
        name: error.name,
        code: (error as any).code, // Capture SQL error codes if available
        errno: (error as any).errno,
      } : 'Unknown error type'
    };
    
    
    // Use standard Response instead of NextResponse for consistency
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}