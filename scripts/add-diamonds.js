const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addDiamonds(email, diamondAmount) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { gameState: true }
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    if (!user.gameState) {
      console.error(`User ${email} has no game state`);
      return;
    }

    // Update diamonds
    const updatedGameState = await prisma.gameState.update({
      where: { id: user.gameState.id },
      data: {
        diamonds: user.gameState.diamonds + diamondAmount,
        totalDiamondsPurchased: user.gameState.totalDiamondsPurchased + diamondAmount
      }
    });

    console.log(`Successfully added ${diamondAmount} diamonds to ${email}`);
    console.log(`New diamond balance: ${updatedGameState.diamonds}`);
  } catch (error) {
    console.error('Error adding diamonds:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email and amount from command line arguments
const email = process.argv[2] || 'test@example.com';
const amount = parseInt(process.argv[3]) || 500000;

if (!email) {
  console.error('Usage: node add-diamonds.js <email> [amount]');
  process.exit(1);
}

addDiamonds(email, amount);