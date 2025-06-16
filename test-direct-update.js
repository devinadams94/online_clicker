// Test direct database update for space drones
// Run with: node test-direct-update.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDirectUpdate(userId) {
  if (!userId) {
    console.error('Usage: node test-direct-update.js <userId>');
    process.exit(1);
  }

  console.log('=== Testing Direct Database Update ===');
  console.log('User ID:', userId);

  try {
    // 1. Check current values
    console.log('\n1. Current values:');
    const before = await prisma.gameState.findUnique({
      where: { userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true,
        userId: true,
        id: true
      }
    });
    
    if (!before) {
      console.error('❌ No game state found for user');
      return;
    }
    
    console.log('Found game state:', before);

    // 2. Try raw SQL update
    console.log('\n2. Attempting raw SQL update...');
    const sqlResult = await prisma.$executeRaw`
      UPDATE "GameState"
      SET "wireHarvesters" = 55555,
          "oreHarvesters" = 66666,
          "factories" = 77777
      WHERE "userId" = ${userId}
    `;
    
    console.log('SQL Result:', sqlResult, 'rows affected');

    // 3. Check after SQL update
    const afterSql = await prisma.gameState.findUnique({
      where: { userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true
      }
    });
    
    console.log('\n3. After SQL update:', afterSql);

    // 4. Try Prisma update
    console.log('\n4. Attempting Prisma update...');
    const prismaResult = await prisma.gameState.update({
      where: { userId },
      data: {
        wireHarvesters: 88888,
        oreHarvesters: 99999,
        factories: 11111
      }
    });
    
    console.log('Prisma update result:', {
      wireHarvesters: prismaResult.wireHarvesters,
      oreHarvesters: prismaResult.oreHarvesters,
      factories: prismaResult.factories
    });

    // 5. Final check
    const final = await prisma.gameState.findUnique({
      where: { userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true
      }
    });
    
    console.log('\n5. Final values:', final);

    // 6. Analysis
    console.log('\n=== Analysis ===');
    if (sqlResult === 0) {
      console.log('❌ SQL UPDATE failed - WHERE clause did not match any records');
      console.log('This suggests a userId mismatch or transaction issue');
    } else {
      console.log('✅ SQL UPDATE succeeded');
    }
    
    if (final.wireHarvesters === 88888) {
      console.log('✅ Prisma update worked correctly');
    } else {
      console.log('❌ Updates are not persisting');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const userId = process.argv[2];
testDirectUpdate(userId);