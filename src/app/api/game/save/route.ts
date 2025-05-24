import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { GameState } from "@/types/game";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Check if user has a game state, create one if not
    let existingGameState = await prisma.gameState.findUnique({
      where: { userId: session.user.id },
    });
    
    // Create initial game state if it doesn't exist
    if (!existingGameState) {
      console.log("Creating new game state for user", session.user.id);
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
        console.log("Created new game state with default space age fields");
      } catch (createError) {
        console.error("Error creating new game state:", createError);
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
      console.log("Money value before save:", money);
      
      // Get paperclip price from request body
      const paperclipPrice = parseFloat(body.paperclipPrice || 0.25);
      console.log("Paperclip price before save:", paperclipPrice);
      
      // Log auto wire buyer status for debugging
      console.log("Auto wire buyer status:", body.autoWireBuyer);
      console.log("Auto wire buyer cost:", body.autoWireBuyerCost);
      
      // Log wire spool data for debugging
      console.log("Wire spool data being saved:");
      console.log("- Spool cost:", body.spoolCost);
      console.log("- Wire per spool:", body.wirePerSpool);
      console.log("- Spool size level:", body.spoolSizeLevel);
      console.log("- Spool size upgrade cost:", body.spoolSizeUpgradeCost);
      
      // Log research points for debugging
      console.log("Research points being saved:", body.researchPoints);
      console.log("Research points per second:", body.researchPointsPerSecond);
      
      // Log stock market status for debugging
      console.log("Stock market unlocked status during save:", body.stockMarketUnlocked);
      
      // Log bot intelligence data for debugging
      console.log("Bot intelligence level:", body.botIntelligence);
      console.log("Bot intelligence level (parsed):", parseInt(body.botIntelligence || 1));
      console.log("Bot intelligence raw type:", typeof body.botIntelligence);
      console.log("Bot intelligence upgrade cost:", body.botIntelligenceCost);
      console.log("Bot trading budget:", body.botTradingBudget);
      console.log("Bot trading profit:", body.botTradingProfit);
      console.log("Bot trading losses:", body.botTradingLosses);
      
      // Log stock portfolio data for debugging
      if (body.stockPortfolio) {
        console.log("Stock portfolio being saved:", body.stockPortfolio);
        try {
          const parsedPortfolio = JSON.parse(body.stockPortfolio);
          console.log("Parsed portfolio has", parsedPortfolio.length, "stock holdings");
          if (parsedPortfolio.length > 0) {
            console.log("First stock holding:", parsedPortfolio[0]);
          }
        } catch (err) {
          console.error("Error parsing portfolio:", err);
        }
      } else {
        console.log("No stock portfolio data to save");
      }
      
      // Log metrics unlock status for debugging
      console.log("Metrics unlock status during save:", body.metricsUnlocked);
      console.log("Total paperclips made during save:", body.totalPaperclipsMade);
      
      // Log advanced resources
      console.log("Trust level during save:", body.trustLevel);
      console.log("Next trust at during save:", body.nextTrustAt);
      console.log("OPs during save:", body.ops, "/", body.opsMax);
      console.log("Creativity during save:", body.creativity);
      console.log("Creativity unlocked during save:", body.creativityUnlocked);
      
      // Log market demand upgrade values for debugging
      console.log("Market demand level being saved:", body.marketDemandLevel);
      console.log("Market demand upgrade cost being saved:", body.marketDemandUpgradeCost);
      console.log("Max demand being saved:", body.maxDemand);
      
      // Get bot intelligence value with fallback
      const botIntelligenceValue = parseInt(body.botIntelligence || 1) || 1;
      console.log("Bot intelligence value for direct SQL update:", botIntelligenceValue);
      
      // Log computational upgrade costs explicitly
      console.log("CPU Level being saved:", body.cpuLevel);
      console.log("CPU Cost being saved:", body.cpuCost);
      console.log("Memory Max being saved:", body.memoryMax);
      console.log("Memory Cost being saved:", body.memoryCost);
      console.log("Memory Regen Rate being saved:", body.memoryRegenRate);
      
      // Log upgradeCosts object for computational upgrades
      console.log("Upgrade costs being saved:", body.upgradeCosts);
      
      // Log megaclippers data explicitly
      console.log("Mega Clippers being saved:", body.megaClippers);
      console.log("Mega Clipper Cost being saved:", body.megaClipperCost);
      console.log("Mega Clippers Unlocked being saved:", body.megaClippersUnlocked);
      console.log("Production Multiplier being saved:", body.productionMultiplier);
      
      // Ensure we have valid values with fallbacks
      const cpuLevel = parseInt(body.cpuLevel || 1) || 1;
      const cpuCost = parseFloat(body.cpuCost || 25) || 25;
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
      
      console.log("OPs Max being saved:", opsMax);
      console.log("Current OPs being saved:", ops);
      console.log("Yomi being saved:", yomi);
      console.log("Production Multiplier validated:", productionMultiplier);
      console.log("Aerograde Paperclips being saved:", aerogradePaperclips);
      
      // Log space combat fields
      console.log("Space combat fields being saved:");
      console.log("- Honor:", honor);
      console.log("- Battles Won:", battlesWon);
      console.log("- Battle Difficulty:", battleDifficulty);
      console.log("- Auto Battle Enabled:", Boolean(body.autoBattleEnabled));
      console.log("- Auto Battle Unlocked:", Boolean(body.autoBattleUnlocked));
      
      // Extra debug logs for computational costs
      console.log(`CRITICAL SAVING - CPU COST: ${cpuCost}`);
      console.log(`CRITICAL SAVING - MEMORY COST: ${memoryCost}`);
      
      // Dump all values being saved in one place for easy debugging
      console.log('SAVE DUMP - ALL CRITICAL VALUES:', {
        cpuLevel,
        cpuCost,
        memoryMax,
        memoryCost,
        memoryRegenRate,
        opsMax,
        megaClippers,
        megaClipperCost
      });
      
      // Update using direct SQL for critical values with SQLite syntax
      // Adding computational values to the critical direct SQL update
      const result = await prisma.$executeRaw`
        UPDATE "GameState" 
        SET "money" = ${money}, 
            "paperclipPrice" = ${paperclipPrice},
            "botIntelligence" = ${botIntelligenceValue},
            "cpuLevel" = ${cpuLevel},
            "cpuCost" = ${cpuCost},
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
        
        console.log('VERIFICATION - VALUES AFTER SAVE:', gameStateAfterSave);
        if (gameStateAfterSave) {
          console.log(`VERIFIED OPS: ${gameStateAfterSave.ops}/${gameStateAfterSave.opsMax}`);
          console.log(`VERIFIED YOMI: ${gameStateAfterSave.yomi}`);
          console.log(`VERIFIED HONOR: ${gameStateAfterSave.honor}`);
          console.log(`VERIFIED BATTLES WON: ${gameStateAfterSave.battlesWon}`);
          console.log(`VERIFIED AUTO BATTLE ENABLED: ${gameStateAfterSave.autoBattleEnabled}`);
          console.log(`VERIFIED AUTO BATTLE UNLOCKED: ${gameStateAfterSave.autoBattleUnlocked}`);
          console.log(`VERIFIED AEROGRADE PAPERCLIPS: ${gameStateAfterSave.aerogradePaperclips}`);
        }
      } catch (err) {
        console.error('Error verifying save:', err);
      }
      
      console.log("Direct SQL update result:", result);
      
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
            console.log("Space upgrades received from client:", body.unlockedSpaceUpgrades);
            
            let upgradesList: string[] = [];
            
            try {
              // Handle different possible formats of the incoming data
              if (Array.isArray(body.unlockedSpaceUpgrades)) {
                console.log("Processing unlockedSpaceUpgrades as direct array");
                upgradesList = [...body.unlockedSpaceUpgrades];
              } else if (typeof body.unlockedSpaceUpgrades === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.unlockedSpaceUpgrades);
                  if (Array.isArray(parsed)) {
                    console.log("Processing unlockedSpaceUpgrades as parsed string");
                    upgradesList = [...parsed];
                  } else {
                    console.warn("Parsed unlockedSpaceUpgrades is not an array, using empty array");
                  }
                } catch (err) {
                  console.error("Failed to parse unlockedSpaceUpgrades string:", err);
                }
              } else {
                console.warn("unlockedSpaceUpgrades is neither array nor string, using empty array");
              }
              
              // Deduplicate the array to ensure each upgrade only appears once
              upgradesList = [...new Set(upgradesList)];
              
              // Log the final list for debugging
              console.log("Final space upgrades to save:", upgradesList);
              return JSON.stringify(upgradesList);
            } catch (err) {
              console.error("Error processing unlockedSpaceUpgrades:", err);
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
            console.log("Trust levels received from client:", body.purchasedTrustLevels);
            console.log("Trust levels type:", typeof body.purchasedTrustLevels);
            
            let levelsToSave = [];
            
            // Handle different possible formats of the incoming data
            if (Array.isArray(body.purchasedTrustLevels)) {
              // Map each level to a number to ensure consistent type
              levelsToSave = body.purchasedTrustLevels.map((level: any) => Number(level));
              console.log("Converted array data to numbers for purchasedTrustLevels");
            } else if (typeof body.purchasedTrustLevels === 'string') {
              try {
                // Try to parse if it's already a JSON string
                const parsed = JSON.parse(body.purchasedTrustLevels);
                if (Array.isArray(parsed)) {
                  // Map each level to a number to ensure consistent type
                  levelsToSave = parsed.map((level: any) => Number(level));
                  console.log("Parsed string data and converted to numbers for purchasedTrustLevels");
                } else {
                  console.error("Parsed purchasedTrustLevels is not an array");
                  levelsToSave = [];
                }
              } catch (err) {
                console.error("Failed to parse purchasedTrustLevels string:", err);
                levelsToSave = [];
              }
            } else {
              console.warn("purchasedTrustLevels is neither array nor string, using empty array");
              levelsToSave = [];
            }
            
            // Filter out any NaN values from the conversion
            levelsToSave = levelsToSave.filter((level: any) => !isNaN(level));
            console.log("Filtered purchasedTrustLevels:", levelsToSave);
            
            const jsonString = JSON.stringify(levelsToSave);
            console.log("Trust levels final JSON for database:", jsonString);
            return jsonString;
          })(),
          
          // Debug trust abilities data with enhanced validation
          unlockedTrustAbilities: (() => {
            console.log("Trust abilities received from client:", body.unlockedTrustAbilities);
            console.log("Trust abilities type:", typeof body.unlockedTrustAbilities);
            
            let abilitiesToSave = [];
            
            // Handle different possible formats of the incoming data
            if (Array.isArray(body.unlockedTrustAbilities)) {
              abilitiesToSave = body.unlockedTrustAbilities;
              console.log("Using direct array data for unlockedTrustAbilities");
            } else if (typeof body.unlockedTrustAbilities === 'string') {
              try {
                // Try to parse if it's already a JSON string
                abilitiesToSave = JSON.parse(body.unlockedTrustAbilities);
                console.log("Parsed string data for unlockedTrustAbilities");
              } catch (err) {
                console.error("Failed to parse unlockedTrustAbilities string:", err);
                abilitiesToSave = [];
              }
            } else {
              console.warn("unlockedTrustAbilities is neither array nor string, using empty array");
              abilitiesToSave = [];
            }
            
            // Final validation - ensure it's actually an array
            if (!Array.isArray(abilitiesToSave)) {
              console.warn("unlockedTrustAbilities is not an array after processing, forcing to empty array");
              abilitiesToSave = [];
            }
            
            const jsonString = JSON.stringify(abilitiesToSave);
            console.log("Trust abilities final JSON for database:", jsonString);
            return jsonString;
          })(),
          // ops and opsMax are handled in direct SQL now
          creativity: parseFloat(body.creativity || 0),
          creativityUnlocked: Boolean(body.creativityUnlocked),
          unlockedOpsUpgrades: body.unlockedOpsUpgrades ? JSON.stringify(body.unlockedOpsUpgrades) : "[]",
          unlockedCreativityUpgrades: (() => {
            console.log("Creativity upgrades received from client:", body.unlockedCreativityUpgrades);
            console.log("Creativity upgrades type:", typeof body.unlockedCreativityUpgrades);
            
            let upgradesList: string[] = [];
            
            try {
              // Handle different possible formats of the incoming data
              if (Array.isArray(body.unlockedCreativityUpgrades)) {
                console.log("Processing unlockedCreativityUpgrades as direct array");
                upgradesList = [...body.unlockedCreativityUpgrades];
              } else if (typeof body.unlockedCreativityUpgrades === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.unlockedCreativityUpgrades);
                  if (Array.isArray(parsed)) {
                    console.log("Processing unlockedCreativityUpgrades as parsed string");
                    upgradesList = [...parsed];
                  } else {
                    console.warn("Parsed unlockedCreativityUpgrades is not an array, using empty array");
                  }
                } catch (err) {
                  console.error("Failed to parse unlockedCreativityUpgrades string:", err);
                }
              } else {
                console.warn("unlockedCreativityUpgrades is neither array nor string, using empty array");
              }
              
              // Deduplicate the array to ensure each upgrade only appears once
              upgradesList = [...new Set(upgradesList)];
              
              // Log the final list for debugging
              console.log("Final creativity upgrades to save:", upgradesList);
            } catch (err) {
              console.error("Error processing unlockedCreativityUpgrades:", err);
            }
            
            return JSON.stringify(upgradesList);
          })(),
          // Save upgrade costs with enhanced validation and preprocessing
          upgradeCosts: (() => {
            console.log("Upgrade costs received from client:", body.upgradeCosts);
            console.log("Upgrade costs type:", typeof body.upgradeCosts);
            
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
                console.log("Processing upgradeCosts as direct object");
                
                // Copy values, ensuring they are valid numbers
                Object.entries(body.upgradeCosts).forEach(([key, value]) => {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    costsToSave[key] = numValue;
                    console.log(`- Validated ${key} cost: ${numValue}`);
                  } else {
                    console.warn(`- Invalid ${key} cost in direct object: ${value}, using default: ${costsToSave[key]}`);
                  }
                });
              } else if (typeof body.upgradeCosts === 'string') {
                try {
                  // Try to parse if it's already a JSON string
                  const parsed = JSON.parse(body.upgradeCosts);
                  
                  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    console.log("Processing upgradeCosts as parsed string");
                    
                    // Copy values, ensuring they are valid numbers
                    Object.entries(parsed).forEach(([key, value]) => {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        costsToSave[key] = numValue;
                        console.log(`- Validated ${key} cost: ${numValue}`);
                      } else {
                        console.warn(`- Invalid ${key} cost in parsed string: ${value}, using default: ${costsToSave[key]}`);
                      }
                    });
                  } else {
                    console.warn("Parsed upgradeCosts is not a valid object, using defaults");
                  }
                } catch (err) {
                  console.error("Failed to parse upgradeCosts string:", err);
                }
              } else {
                console.warn("upgradeCosts is neither valid object nor string, using defaults");
              }
            } catch (err) {
              console.error("Error processing upgradeCosts:", err);
            }
            
            // CRITICAL DEBUG: Check final values before saving
            if (costsToSave.parallelProcessing) {
              console.log("CRITICAL: Final parallelProcessing cost =", costsToSave.parallelProcessing);
            } else {
              console.log("CRITICAL: parallelProcessing cost not found in final costs, using default");
              costsToSave.parallelProcessing = defaultCosts.parallelProcessing;
            }
            
            // Log all final costs for verification
            console.log("FINAL COSTS TO SAVE:");
            Object.entries(costsToSave).forEach(([key, value]) => {
              console.log(`- ${key}: ${value} (${typeof value})`);
            });
            
            const jsonString = JSON.stringify(costsToSave);
            console.log("CRITICAL: Upgrade costs final JSON for database:", jsonString);
            return jsonString;
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
      console.error("SQL update error:", err);
      
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
      
      console.error('Sending SQL error response:', errorDetails);
      
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
    console.error("Save game state error:", error);
    
    // Get a more detailed error message
    let errorMessage = "An error occurred while saving the game state";
    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    }
    
    // Try to log the error details
    try {
      const errorDetails = JSON.stringify(error);
      console.error("Error details:", errorDetails);
    } catch (e) {
      console.error("Could not stringify error:", e);
    }
    
    // Log stacktrace if available
    if (error instanceof Error && error.stack) {
      console.error("Error stack trace:", error.stack);
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
    
    console.error('Sending error response:', errorResponse);
    
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