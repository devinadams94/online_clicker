// Fix Space Drones Reset Issue
// This script will help identify and fix the reset to 1000 issue

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSpaceDronesReset(userId) {
  try {
    if (!userId) {
      console.error('Please provide a userId as argument');
      return;
    }

    console.log('=== Fixing Space Drones Reset Issue ===\n');
    console.log('User ID:', userId);

    // 1. Check current database values
    const gameState = await prisma.gameState.findUnique({
      where: { userId: userId },
      select: {
        wireHarvesters: true,
        oreHarvesters: true,
        factories: true,
        spaceAgeUnlocked: true
      }
    });

    console.log('\nCurrent database values:');
    console.log('- wireHarvesters:', gameState?.wireHarvesters);
    console.log('- oreHarvesters:', gameState?.oreHarvesters);
    console.log('- factories:', gameState?.factories);
    console.log('- spaceAgeUnlocked:', gameState?.spaceAgeUnlocked);

    // 2. Check if values are null (which might default to 1000 somewhere)
    if (gameState) {
      const fieldsToCheck = ['wireHarvesters', 'oreHarvesters', 'factories'];
      
      for (const field of fieldsToCheck) {
        if (gameState[field] === null) {
          console.log(`\n⚠️  ${field} is NULL in database`);
          console.log('This might be causing the default to 1000 issue');
        }
      }
    }

    // 3. If values are exactly 1000, this might be a default being applied
    if (gameState?.wireHarvesters === 1000 || 
        gameState?.oreHarvesters === 1000 || 
        gameState?.factories === 1000) {
      console.log('\n🎯 Found values set to exactly 1000!');
      console.log('This suggests a default value is being applied somewhere.');
      
      // Set to different test values to verify saves work
      console.log('\nSetting test values to verify save functionality...');
      const updateResult = await prisma.gameState.update({
        where: { userId: userId },
        data: {
          wireHarvesters: 5555,
          oreHarvesters: 6666,
          factories: 7777
        }
      });
      
      console.log('✅ Updated to test values');
      console.log('- wireHarvesters:', updateResult.wireHarvesters);
      console.log('- oreHarvesters:', updateResult.oreHarvesters);
      console.log('- factories:', updateResult.factories);
      
      console.log('\n💡 Now refresh the game page and check if these values persist');
      console.log('If they reset to 1000, the issue is in the game initialization');
      console.log('If they show correctly, the issue was with the save process');
    }

    // 4. Check for any migration issues
    console.log('\n📊 Checking field types...');
    const result = await prisma.$queryRaw`
      SELECT 
        sql 
      FROM 
        sqlite_master 
      WHERE 
        type='table' AND 
        name='GameState'
    `;
    
    if (result && result[0]) {
      const tableSchema = result[0].sql;
      console.log('\nChecking GameState table schema for space drone fields...');
      
      if (tableSchema.includes('wireHarvesters')) {
        console.log('✅ wireHarvesters field exists');
      } else {
        console.log('❌ wireHarvesters field missing!');
      }
      
      if (tableSchema.includes('oreHarvesters')) {
        console.log('✅ oreHarvesters field exists');
      } else {
        console.log('❌ oreHarvesters field missing!');
      }
      
      if (tableSchema.includes('factories')) {
        console.log('✅ factories field exists');
      } else {
        console.log('❌ factories field missing!');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run with command line argument
const userId = process.argv[2];
fixSpaceDronesReset(userId);