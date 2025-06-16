// Debug Space Drones Database Issue
// Run this with: node debug-space-drones-db.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSpaceDrones(userId) {
  try {
    if (!userId) {
      console.error('Please provide a userId as argument');
      console.log('Usage: node debug-space-drones-db.js <userId>');
      return;
    }

    console.log('=== Debugging Space Drones for User:', userId, '===\n');

    // 1. Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('User not found with ID:', userId);
      return;
    }
    
    console.log('✅ User found:', user.email);

    // 2. Check game state
    const gameState = await prisma.gameState.findUnique({
      where: { userId: userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true,
        spaceAgeUnlocked: true,
        aerogradePaperclips: true,
        lastSaved: true
      }
    });

    if (!gameState) {
      console.error('❌ No game state found for user');
      return;
    }

    console.log('\n📊 Current Database Values:');
    console.log('- wireHarvesters:', gameState.wireHarvesters);
    console.log('- oreHarvesters:', gameState.oreHarvesters);
    console.log('- factories:', gameState.factories);
    console.log('- spaceAgeUnlocked:', gameState.spaceAgeUnlocked);
    console.log('- aerogradePaperclips:', gameState.aerogradePaperclips);
    console.log('- lastSaved:', gameState.lastSaved);

    // 3. Test update
    console.log('\n🔧 Testing direct update...');
    const testValues = {
      wireHarvesters: 12345,
      oreHarvesters: 23456,
      factories: 34567
    };

    const updateResult = await prisma.$executeRaw`
      UPDATE "GameState"
      SET "wireHarvesters" = ${testValues.wireHarvesters},
          "oreHarvesters" = ${testValues.oreHarvesters},
          "factories" = ${testValues.factories}
      WHERE "userId" = ${userId}
    `;

    console.log('Update result:', updateResult, 'rows affected');

    // 4. Check after update
    const afterUpdate = await prisma.gameState.findUnique({
      where: { userId: userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true
      }
    });

    console.log('\n📊 Values after test update:');
    console.log('- wireHarvesters:', afterUpdate.wireHarvesters);
    console.log('- oreHarvesters:', afterUpdate.oreHarvesters);
    console.log('- factories:', afterUpdate.factories);

    if (afterUpdate.wireHarvesters === testValues.wireHarvesters) {
      console.log('\n✅ Update successful! Database is working correctly.');
    } else {
      console.log('\n❌ Update failed! Values did not change.');
    }

    // 5. Reset to original values
    console.log('\n🔄 Resetting to original values...');
    await prisma.$executeRaw`
      UPDATE "GameState"
      SET "wireHarvesters" = ${gameState.wireHarvesters},
          "oreHarvesters" = ${gameState.oreHarvesters},
          "factories" = ${gameState.factories}
      WHERE "userId" = ${userId}
    `;

    console.log('✅ Reset complete');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run with command line argument
const userId = process.argv[2];
debugSpaceDrones(userId);