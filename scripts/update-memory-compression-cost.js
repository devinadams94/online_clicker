// Script to update memory compression upgrade cost in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMemoryCompressionCost() {
  try {
    console.log('Updating memory compression cost...');
    
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
        
        // Update the memoryCompression cost
        upgradeCosts.memoryCompression = 5000;
        console.log('Updated upgrade costs:', upgradeCosts);
        
        // Save the updated upgradeCosts back to the database
        await prisma.gameState.update({
          where: { id: gameState.id },
          data: { 
            upgradeCosts: JSON.stringify(upgradeCosts),
            lastSaved: new Date()
          }
        });
        
        console.log(`Successfully updated cost for game state ID: ${gameState.id}`);
      } catch (parseError) {
        console.error(`Error parsing or updating upgradeCosts for game state ID ${gameState.id}:`, parseError);
      }
    }
    
    // Also update the default in the schema (for new players)
    // This would typically require a migration, but we'll just note it here
    console.log('\nNote: For new players, ensure that prisma/schema.prisma has updated default value');
    console.log('Current default value in schema.prisma:');
    console.log('upgradeCosts String @default("{\"parallelProcessing\":15,\"quantumAlgorithms\":30,\"neuralOptimization\":50,\"memoryCompression\":20,\"cacheOptimization\":35,\"distributedStorage\":60,\"marketPrediction\":25,\"trendAnalysis\":40,\"highFrequencyTrading\":75}")');
    console.log('\nUpdated value should be:');
    console.log('upgradeCosts String @default("{\"parallelProcessing\":15,\"quantumAlgorithms\":30,\"neuralOptimization\":50,\"memoryCompression\":5000,\"cacheOptimization\":35,\"distributedStorage\":60,\"marketPrediction\":25,\"trendAnalysis\":40,\"highFrequencyTrading\":75}")');
    
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Error updating memory compression cost:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateMemoryCompressionCost();