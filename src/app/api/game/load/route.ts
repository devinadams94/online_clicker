import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's game state
    const gameState = await prisma.gameState.findUnique({
      where: { userId: session.user.id },
    });

    if (!gameState) {
      return NextResponse.json(
        { message: "Game state not found" },
        { status: 404 }
      );
    }
    
    // Log stock portfolio data for debugging
    if (gameState.stockPortfolio) {
      console.log("Stock portfolio loaded from database:", gameState.stockPortfolio);
      try {
        const parsedPortfolio = JSON.parse(gameState.stockPortfolio);
        console.log("Loaded portfolio has", parsedPortfolio.length, "stock holdings");
        if (parsedPortfolio.length > 0) {
          console.log("First stock holding from database:", parsedPortfolio[0]);
        }
      } catch (err) {
        console.error("Error parsing loaded portfolio:", err);
      }
    } else {
      console.log("No stock portfolio data found in database");
    }
    
    // Log wire spool data loaded from database
    console.log("Wire spool data loaded from database:");
    console.log("- Spool cost:", gameState.spoolCost);
    console.log("- Wire per spool:", gameState.wirePerSpool);
    console.log("- Spool size level:", gameState.spoolSizeLevel);
    console.log("- Spool size upgrade cost:", gameState.spoolSizeUpgradeCost);
    
    // Log bot intelligence data loaded from database
    console.log("Bot intelligence data loaded from database:");
    console.log("- Bot intelligence level:", gameState.botIntelligence);
    console.log("- Bot intelligence level type:", typeof gameState.botIntelligence);
    console.log("- Bot intelligence truthy check:", Boolean(gameState.botIntelligence));
    console.log("- Bot intelligence parsed as int:", parseInt(String(gameState.botIntelligence)));
    console.log("- Bot intelligence upgrade cost:", gameState.botIntelligenceCost);
    console.log("- Bot trading budget:", gameState.botTradingBudget);
    console.log("- Bot trading profit:", gameState.botTradingProfit);
    console.log("- Bot last trade time:", gameState.botLastTradeTime);
    console.log("- Bot last trade time type:", typeof gameState.botLastTradeTime);
    
    // For debugging, let's check all database fields directly
    console.log("\nFull gameState raw data from database:");
    // Print just the key database fields
    console.log(JSON.stringify({
      botIntelligence: gameState.botIntelligence,
      botIntelligenceCost: gameState.botIntelligenceCost,
      tradingBots: gameState.tradingBots,
      stockMarketUnlocked: gameState.stockMarketUnlocked,
      yomi: gameState.yomi
    }, null, 2));
    
    // Try to parse the date to see if it's valid
    try {
      const testDate = new Date(gameState.botLastTradeTime);
      console.log("- Bot last trade time parsed:", testDate, "Is valid:", !isNaN(testDate.getTime()));
    } catch (err) {
      console.error("- Error parsing bot last trade time:", err);
    }

    // Log space age resources
    console.log("Space age resources loaded from database:");
    console.log("- Aerograde Paperclips:", gameState.aerogradePaperclips);
    console.log("- Honor:", gameState.honor);
    console.log("- Battles Won:", gameState.battlesWon);
    console.log("- Auto Battle Enabled:", gameState.autoBattleEnabled);
    console.log("- Auto Battle Unlocked:", gameState.autoBattleUnlocked);

    // Process trust-related fields for debugging
    console.log("Loading trust-related fields from database:");
    console.log("- Raw purchasedTrustLevels:", gameState.purchasedTrustLevels);
    console.log("- Raw unlockedTrustAbilities:", gameState.unlockedTrustAbilities);
    
    // Parse trust-related arrays with error handling and explicit type conversion
    let parsedPurchasedTrustLevels: number[] = [];
    let parsedUnlockedTrustAbilities: string[] = [];
    
    try {
      // Parse purchasedTrustLevels and ensure consistent number format
      if (gameState.purchasedTrustLevels) {
        const parsed = JSON.parse(gameState.purchasedTrustLevels);
        if (Array.isArray(parsed)) {
          // Convert all values to numbers to ensure consistent type
          parsedPurchasedTrustLevels = parsed.map(level => Number(level))
            .filter(level => !isNaN(level)); // Filter out any NaN values
        }
      }
      console.log("- Parsed purchasedTrustLevels:", parsedPurchasedTrustLevels);
      console.log("- Types:", parsedPurchasedTrustLevels.map(level => typeof level));
    } catch (err) {
      console.error("- Error parsing purchasedTrustLevels:", err);
      console.error("- Raw value:", gameState.purchasedTrustLevels);
    }
    
    try {
      // Parse unlockedTrustAbilities
      parsedUnlockedTrustAbilities = gameState.unlockedTrustAbilities ? JSON.parse(gameState.unlockedTrustAbilities) : [];
      console.log("- Parsed unlockedTrustAbilities:", parsedUnlockedTrustAbilities);
    } catch (err) {
      console.error("- Error parsing unlockedTrustAbilities:", err);
      console.error("- Raw value:", gameState.unlockedTrustAbilities);
    }
    
    // Parse Ops and Creativity upgrades
    let parsedOpsUpgrades: string[] = [];
    let parsedCreativityUpgrades: string[] = [];
    let parsedUpgradeCosts: { [key: string]: number } = {
      // Default costs for upgrades if not found in database
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
    
    try {
      if (gameState.unlockedOpsUpgrades) {
        const parsed = JSON.parse(gameState.unlockedOpsUpgrades);
        parsedOpsUpgrades = Array.isArray(parsed) ? parsed : [];
        console.log("- Parsed unlockedOpsUpgrades:", parsedOpsUpgrades);
      }
    } catch (err) {
      console.error("- Error parsing unlockedOpsUpgrades:", err);
      console.error("- Raw value:", gameState.unlockedOpsUpgrades);
    }
    
    try {
      console.log("- Raw unlockedCreativityUpgrades from database:", gameState.unlockedCreativityUpgrades);
      
      if (gameState.unlockedCreativityUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedCreativityUpgrades);
          
          if (Array.isArray(parsed)) {
            // Successfully parsed as array
            parsedCreativityUpgrades = [...parsed]; // Create a fresh copy
            
            // Deduplicate to ensure each upgrade only appears once
            parsedCreativityUpgrades = [...new Set(parsedCreativityUpgrades)];
            
            console.log("- Successfully parsed unlockedCreativityUpgrades:", parsedCreativityUpgrades);
          } else {
            console.warn("- Parsed unlockedCreativityUpgrades is not an array:", parsed);
            parsedCreativityUpgrades = [];
          }
        } catch (parseErr) {
          console.error("- Error parsing unlockedCreativityUpgrades JSON:", parseErr);
          parsedCreativityUpgrades = [];
        }
      } else {
        console.log("- No unlockedCreativityUpgrades found in database");
        parsedCreativityUpgrades = [];
      }
      
      // Log final array for verification
      console.log("- Final unlockedCreativityUpgrades to return:", parsedCreativityUpgrades);
    } catch (err) {
      console.error("- Error in unlockedCreativityUpgrades processing:", err);
      console.error("- Raw value:", gameState.unlockedCreativityUpgrades);
      parsedCreativityUpgrades = [];
    }
    
    // Parse memory upgrades with validation
    let parsedMemoryUpgrades: string[] = [];
    try {
      console.log("Processing unlockedMemoryUpgrades...");
      console.log("- Raw unlockedMemoryUpgrades from database:", gameState.unlockedMemoryUpgrades);
      
      if (gameState.unlockedMemoryUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedMemoryUpgrades);
          
          // Validate the parsed result
          if (Array.isArray(parsed)) {
            // Filter out any non-string values and ensure uniqueness
            parsedMemoryUpgrades = [...new Set(parsed.filter(item => typeof item === 'string'))];
            console.log("- Successfully parsed unlockedMemoryUpgrades:", parsedMemoryUpgrades);
          } else {
            console.warn("- Parsed unlockedMemoryUpgrades is not an array:", parsed);
            parsedMemoryUpgrades = [];
          }
        } catch (parseErr) {
          console.error("- Error parsing unlockedMemoryUpgrades JSON:", parseErr);
          parsedMemoryUpgrades = [];
        }
      } else {
        console.log("- No unlockedMemoryUpgrades found in database");
        parsedMemoryUpgrades = [];
      }
      
      console.log("- Final unlockedMemoryUpgrades to return:", parsedMemoryUpgrades);
    } catch (err) {
      console.error("- Error in unlockedMemoryUpgrades processing:", err);
      console.error("- Raw value:", gameState.unlockedMemoryUpgrades);
      parsedMemoryUpgrades = [];
    }
    
    // Parse upgrade costs with enhanced validation and error handling
    try {
      console.log("Raw upgradeCosts from database:", gameState.upgradeCosts);
      
      if (gameState.upgradeCosts) {
        try {
          const parsed = JSON.parse(gameState.upgradeCosts);
          
          // Validate the parsed result is a proper object
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            console.log("- Successfully parsed upgradeCosts from database");
            
            // Create a validated copy with number conversion
            const validatedCosts = { ...parsedUpgradeCosts }; // Start with defaults
            
            // Copy values from parsed data, ensuring they are numbers
            Object.entries(parsed).forEach(([key, value]) => {
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                validatedCosts[key] = numValue;
                console.log(`- Validated ${key} cost: ${numValue}`);
              } else {
                console.warn(`- Invalid ${key} cost: ${value}, using default: ${validatedCosts[key]}`);
              }
            });
            
            // Assign validated costs back to parsedUpgradeCosts
            parsedUpgradeCosts = validatedCosts;
            
            // CRITICAL DEBUG: Check the value of parallelProcessing
            if (parsedUpgradeCosts.parallelProcessing) {
              console.log("CRITICAL: parallelProcessing cost from database =", parsedUpgradeCosts.parallelProcessing);
            } else {
              console.log("CRITICAL: parallelProcessing cost not found after validation");
            }
          } else {
            console.error("- Parsed upgradeCosts is not a valid object:", parsed);
          }
        } catch (parseErr) {
          console.error("- Error parsing upgradeCosts JSON:", parseErr);
        }
      } else {
        console.log("CRITICAL: upgradeCosts field is empty or null in database");
      }
      
      // Log all final costs for verification
      console.log("FINAL PARSED COSTS (to be returned to client):");
      Object.entries(parsedUpgradeCosts).forEach(([key, value]) => {
        console.log(`- ${key}: ${value} (${typeof value})`);
      });
      
    } catch (err) {
      console.error("- Error in upgradeCosts processing:", err);
      console.error("- Raw value:", gameState.upgradeCosts);
    }
    
    // Parse space stats
    let parsedSpaceStats = {
      speed: 1,
      exploration: 1,
      selfReplication: 1,
      wireProduction: 1,
      miningProduction: 1,
      factoryProduction: 1
    };
    
    try {
      if (gameState.spaceStats) {
        const parsed = JSON.parse(gameState.spaceStats);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          console.log("- Successfully parsed spaceStats from database");
          parsedSpaceStats = { ...parsedSpaceStats, ...parsed };
        }
      }
    } catch (err) {
      console.error("- Error parsing spaceStats:", err);
    }
    
    // Parse space upgrades
    let parsedSpaceUpgrades: string[] = [];
    
    try {
      console.log("- Raw unlockedSpaceUpgrades from database:", gameState.unlockedSpaceUpgrades);
      
      if (gameState.unlockedSpaceUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedSpaceUpgrades);
          
          if (Array.isArray(parsed)) {
            // Successfully parsed as array
            parsedSpaceUpgrades = [...parsed]; // Create a fresh copy
            console.log("- Successfully parsed unlockedSpaceUpgrades:", parsedSpaceUpgrades);
          } else {
            console.warn("- Parsed unlockedSpaceUpgrades is not an array:", parsed);
            parsedSpaceUpgrades = [];
          }
        } catch (parseErr) {
          console.error("- Error parsing unlockedSpaceUpgrades JSON:", parseErr);
          parsedSpaceUpgrades = [];
        }
      } else {
        console.log("- No unlockedSpaceUpgrades found in database");
        parsedSpaceUpgrades = [];
      }
      
      // Log final array for verification
      console.log("- Final unlockedSpaceUpgrades to return:", parsedSpaceUpgrades);
    } catch (err) {
      console.error("- Error in unlockedSpaceUpgrades processing:", err);
      console.error("- Raw value:", gameState.unlockedSpaceUpgrades);
      parsedSpaceUpgrades = [];
    }
    
    // Ensure critical values are never null or undefined
    const safeGameState = {
      ...gameState,
      botIntelligence: gameState.botIntelligence || 1, // Ensure botIntelligence is at least 1
      botIntelligenceCost: gameState.botIntelligenceCost || 1500,
      // Ensure yomi is included and properly set
      yomi: gameState.yomi || 0,
      // Ensure all array fields are properly parsed
      purchasedTrustLevels: parsedPurchasedTrustLevels,
      unlockedTrustAbilities: parsedUnlockedTrustAbilities,
      unlockedOpsUpgrades: parsedOpsUpgrades,
      unlockedCreativityUpgrades: parsedCreativityUpgrades,
      unlockedMemoryUpgrades: parsedMemoryUpgrades,
      // Add the parsed upgrade costs
      upgradeCosts: parsedUpgradeCosts,
      // Add space age fields with defaults
      spaceAgeUnlocked: gameState.spaceAgeUnlocked || false,
      probes: gameState.probes || 0,
      universeExplored: gameState.universeExplored || 0,
      wireHarvesters: gameState.wireHarvesters || 0,
      oreHarvesters: gameState.oreHarvesters || 0,
      factories: gameState.factories || 0,
      spaceWirePerSecond: gameState.spaceWirePerSecond || 0,
      spaceOrePerSecond: gameState.spaceOrePerSecond || 0,
      spacePaperclipsPerSecond: gameState.spacePaperclipsPerSecond || 0,
      spaceStats: parsedSpaceStats,
      // Space combat fields
      honor: gameState.honor || 0,
      battlesWon: gameState.battlesWon || 0,
      autoBattleEnabled: gameState.autoBattleEnabled || false,
      autoBattleUnlocked: gameState.autoBattleUnlocked || false,
      battleDifficulty: gameState.battleDifficulty || 1,
      // Space resources
      aerogradePaperclips: gameState.aerogradePaperclips || 0,
      // Space upgrades
      unlockedSpaceUpgrades: parsedSpaceUpgrades
    };
    
    return NextResponse.json(safeGameState);
  } catch (error) {
    console.error("Load game state error:", error);
    return NextResponse.json(
      { message: "An error occurred while loading the game state" },
      { status: 500 }
    );
  }
}
