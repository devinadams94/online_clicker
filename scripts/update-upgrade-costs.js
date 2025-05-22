// Script to update computational upgrade costs in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUpgradeCosts() {
  try {
    console.log('Updating computational upgrade costs...');
    
    // Get all game states
    const gameStates = await prisma.gameState.findMany();
    console.log(`Found ${gameStates.length} game states in the database`);
    
    // Update each game state's upgradeCosts
    for (const gameState of gameStates) {
      console.log(`Processing game state for user ID: ${gameState.userId}`);
      
      try {
        // Parse the current upgradeCosts JSON
        const upgradeCosts = JSON.parse(gameState.upgradeCosts);
        console.log('Current upgrade costs:', upgradeCosts);
        
        // Update costs by 200% (x3) for all upgrades except distributedStorage
        upgradeCosts.parallelProcessing = 45;
        upgradeCosts.quantumAlgorithms = 90;
        upgradeCosts.neuralOptimization = 150;
        upgradeCosts.memoryCompression = 15000;
        upgradeCosts.cacheOptimization = 105;
        // Keep distributedStorage unchanged
        upgradeCosts.marketPrediction = 75;
        upgradeCosts.trendAnalysis = 120;
        upgradeCosts.highFrequencyTrading = 225;
        
        console.log('Updated upgrade costs:', upgradeCosts);
        
        // Save the updated upgradeCosts back to the database
        await prisma.gameState.update({
          where: { id: gameState.id },
          data: { 
            upgradeCosts: JSON.stringify(upgradeCosts),
            lastSaved: new Date()
          }
        });
        
        console.log(`Successfully updated costs for game state ID: ${gameState.id}`);
      } catch (parseError) {
        console.error(`Error parsing or updating upgradeCosts for game state ID ${gameState.id}:`, parseError);
      }
    }
    
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Error updating upgrade costs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateUpgradeCosts();