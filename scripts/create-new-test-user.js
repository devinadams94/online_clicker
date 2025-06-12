const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Create a new test user with a simple password
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test User 2',
        password: hashedPassword,
        gameState: {
          create: {
            money: 1000,
            diamonds: 100000, // Start with 100k diamonds
          }
        }
      }
    });
    
    console.log('Created new test user:');
    console.log('Email: test2@example.com');
    console.log('Password: test123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();