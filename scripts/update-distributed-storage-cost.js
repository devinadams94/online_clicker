// Script to update distributed storage cost in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDistributedStorageCost() {
  try {
    console.log('Updating distributed storage cost...');
    
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
        
        // Update the distributedStorage cost
        upgradeCosts.distributedStorage = 5000;
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
    
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Error updating distributed storage cost:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateDistributedStorageCost();