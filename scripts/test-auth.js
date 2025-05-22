// test-auth.js - Run with node scripts/test-auth.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');

// Set the DATABASE_URL environment variable directly
process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma/dev.db')}`;

async function testAuth() {
  console.log('Testing database connection with explicit DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Check if we have users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        gameState: {
          select: {
            id: true,
            paperclips: true,
            money: true,
          }
        }
      }
    });
    
    console.log('Users found in database:', users.length);
    users.forEach(user => {
      console.log(`- User: ${user.email} (${user.id})`);
      if (user.gameState) {
        console.log(`  Game state: ${user.gameState.paperclips} paperclips, $${user.gameState.money}`);
      } else {
        console.log('  No game state found');
      }
    });
    
    // If no users, create test user
    if (users.length === 0) {
      console.log('No users found - creating test user');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
          gameState: {
            create: {
              money: 1000
            }
          }
        },
        include: {
          gameState: true
        }
      });
      
      console.log('Created test user:', newUser);
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth()
  .then(() => console.log('Auth test completed'))
  .catch(error => console.error('Auth test failed:', error));