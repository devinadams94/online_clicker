// Script to update risk threshold for trading bots in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBotRiskThreshold() {
  try {
    console.log('Updating bot risk threshold...');
    
    // Get all game states
    const gameStates = await prisma.gameState.findMany();
    console.log(`Found ${gameStates.length} game states in the database`);
    
    // Update each game state
    for (const gameState of gameStates) {
      console.log(`Processing game state for user ID: ${gameState.userId}`);
      
      try {
        // Update the bot risk threshold to the default value (0.1 = 10%)
        await prisma.gameState.update({
          where: { id: gameState.id },
          data: { 
            botRiskThreshold: 0.1,
            lastSaved: new Date()
          }
        });
        
        console.log(`Successfully updated bot risk threshold for game state ID: ${gameState.id}`);
      } catch (error) {
        console.error(`Error updating bot risk threshold for game state ID ${gameState.id}:`, error);
      }
    }
    
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Error updating bot risk threshold:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateBotRiskThreshold();