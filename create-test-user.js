const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    });

    if (existingUser) {
      console.log('Test user already exists with ID:', existingUser.id);
      // Update password to ensure it's correct
      const hashedPassword = await bcrypt.hash('password123', 12);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      });
      console.log('Updated password for existing test user');
      return;
    }

    // Create a new test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('Created new test user:', newUser);
    
    // Also update existing user password
    const existingTargetUser = await prisma.user.findUnique({
      where: {
        email: 'devinadamsrip@gmail.com'
      }
    });
    
    if (existingTargetUser) {
      console.log('Found target user with ID:', existingTargetUser.id);
      // Update password to ensure it's correct
      const targetHashedPassword = await bcrypt.hash('Chirality9902!', 12);
      await prisma.user.update({
        where: { id: existingTargetUser.id },
        data: { password: targetHashedPassword }
      });
      console.log('Updated password for target user');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();