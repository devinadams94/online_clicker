// verify-bot-intelligence.js
// Run with: node scripts/verify-bot-intelligence.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Verifying bot intelligence values in database...');
  
  try {
    // Get all game states
    const gameStates = await prisma.gameState.findMany();
    console.log(`Found ${gameStates.length} game states to verify`);
    
    // Log the current values
    console.log('\nCurrent values:');
    gameStates.forEach(state => {
      console.log(`User ${state.userId}: 
      - botIntelligence = ${state.botIntelligence}
      - botIntelligenceCost = ${state.botIntelligenceCost}
      - tradingBots = ${state.tradingBots}
      - stockMarketUnlocked = ${state.stockMarketUnlocked}
      `);
    });
    
    console.log('\nPROBLEM CHECK:');
    const problemStates = gameStates.filter(state => 
      state.botIntelligence === null || 
      state.botIntelligence === 0 || 
      state.botIntelligence === undefined
    );
    
    if (problemStates.length > 0) {
      console.log(`Found ${problemStates.length} problematic states with missing bot intelligence`);
      // Display problematic states
      problemStates.forEach(state => {
        console.log(`User ${state.userId} has problematic bot intelligence: ${state.botIntelligence}`);
      });
      
      // Fix them
      console.log('\nFixing problematic states...');
      for (const state of problemStates) {
        await prisma.gameState.update({
          where: { id: state.id },
          data: {
            botIntelligence: 1,
            botIntelligenceCost: 1500,
            lastSaved: new Date()
          }
        });
        console.log(`Fixed user ${state.userId}`);
      }
    } else {
      console.log('No problematic states found. All bot intelligence values look good!');
    }
    
    console.log('\nDone!');
  } catch (error) {
    console.error('Error verifying bot intelligence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();