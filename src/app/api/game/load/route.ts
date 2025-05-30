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
    } catch (err) {
    }
    
    try {
      // Parse unlockedTrustAbilities
      parsedUnlockedTrustAbilities = gameState.unlockedTrustAbilities ? JSON.parse(gameState.unlockedTrustAbilities) : [];
    } catch (err) {
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
      }
    } catch (err) {
    }
    
    try {
      
      if (gameState.unlockedCreativityUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedCreativityUpgrades);
          
          if (Array.isArray(parsed)) {
            // Successfully parsed as array
            parsedCreativityUpgrades = [...parsed]; // Create a fresh copy
            
            // Deduplicate to ensure each upgrade only appears once
            parsedCreativityUpgrades = [...new Set(parsedCreativityUpgrades)];
            
          } else {
            parsedCreativityUpgrades = [];
          }
        } catch (parseErr) {
          parsedCreativityUpgrades = [];
        }
      } else {
        parsedCreativityUpgrades = [];
      }
      
    } catch (err) {
      parsedCreativityUpgrades = [];
    }
    
    // Parse memory upgrades with validation
    let parsedMemoryUpgrades: string[] = [];
    try {
      
      if (gameState.unlockedMemoryUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedMemoryUpgrades);
          
          // Validate the parsed result
          if (Array.isArray(parsed)) {
            // Filter out any non-string values and ensure uniqueness
            parsedMemoryUpgrades = [...new Set(parsed.filter(item => typeof item === 'string'))];
          } else {
            parsedMemoryUpgrades = [];
          }
        } catch (parseErr) {
          parsedMemoryUpgrades = [];
        }
      } else {
        parsedMemoryUpgrades = [];
      }
      
    } catch (err) {
      parsedMemoryUpgrades = [];
    }
    
    // Parse upgrade costs with enhanced validation and error handling
    try {
      
      if (gameState.upgradeCosts) {
        try {
          const parsed = JSON.parse(gameState.upgradeCosts);
          
          // Validate the parsed result is a proper object
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            
            // Create a validated copy with number conversion
            const validatedCosts = { ...parsedUpgradeCosts }; // Start with defaults
            
            // Copy values from parsed data, ensuring they are numbers
            Object.entries(parsed).forEach(([key, value]) => {
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                validatedCosts[key] = numValue;
              }
            });
            
            // Assign validated costs back to parsedUpgradeCosts
            parsedUpgradeCosts = validatedCosts;
            
          } else {
          }
        } catch (parseErr) {
        }
      } else {
      }
      
      
    } catch (err) {
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
          parsedSpaceStats = { ...parsedSpaceStats, ...parsed };
        }
      }
    } catch (err) {
    }
    
    // Parse space upgrades
    let parsedSpaceUpgrades: string[] = [];
    
    try {
      
      if (gameState.unlockedSpaceUpgrades) {
        try {
          const parsed = JSON.parse(gameState.unlockedSpaceUpgrades);
          
          if (Array.isArray(parsed)) {
            // Successfully parsed as array
            parsedSpaceUpgrades = [...parsed]; // Create a fresh copy
          } else {
            parsedSpaceUpgrades = [];
          }
        } catch (parseErr) {
          parsedSpaceUpgrades = [];
        }
      } else {
        parsedSpaceUpgrades = [];
      }
      
    } catch (err) {
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
      
      // Probe defection system
      enemyShips: gameState.enemyShips || 0,
      defectionRate: gameState.defectionRate || 0.001,
      lastDefectionTime: gameState.lastDefectionTime || new Date(),
      totalProbesLost: gameState.totalProbesLost || 0,
      defectionEvents: (() => {
        try {
          if (typeof gameState.defectionEvents === 'string') {
            return JSON.parse(gameState.defectionEvents);
          }
          return gameState.defectionEvents || [];
        } catch (err) {
          return [];
        }
      })(),
      
      // Space upgrades
      unlockedSpaceUpgrades: parsedSpaceUpgrades,
      
      // Highest run tracking
      highestRun: gameState.highestRun || 0
    };
    
    return NextResponse.json(safeGameState);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while loading the game state" },
      { status: 500 }
    );
  }
}
