// fix-bot-intelligence.js
// Run with: node scripts/fix-bot-intelligence.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating bot intelligence persistence...');
  
  try {
    // Get all game states
    const gameStates = await prisma.gameState.findMany();
    console.log(`Found ${gameStates.length} game states to update`);
    
    // Log the current values
    console.log('\nCurrent values:');
    gameStates.forEach(state => {
      console.log(`User ${state.userId}: botIntelligence = ${state.botIntelligence}, botIntelligenceCost = ${state.botIntelligenceCost}`);
    });
    
    // Force update botIntelligence for each game state to ensure it persists correctly
    const promises = gameStates.map(state => {
      return prisma.gameState.update({
        where: { id: state.id },
        data: {
          // Only reset if the value is null or 0
          botIntelligence: state.botIntelligence || 1,
          botIntelligenceCost: state.botIntelligenceCost || 1500,
          // Update the timestamp to mark the record as modified
          lastSaved: new Date()
        }
      });
    });
    
    const results = await Promise.all(promises);
    console.log(`\nSuccessfully updated ${results.length} game states`);
    
    // Log the new values
    console.log('\nNew values:');
    results.forEach(state => {
      console.log(`User ${state.userId}: botIntelligence = ${state.botIntelligence}, botIntelligenceCost = ${state.botIntelligenceCost}`);
    });
    
    console.log('\nDone!');
  } catch (error) {
    console.error('Error updating bot intelligence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();