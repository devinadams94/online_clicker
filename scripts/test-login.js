const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin(email, password) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log(`User ${email} not found`);
      return;
    }
    
    console.log(`Found user: ${user.email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Has password: ${!!user.password}`);
    
    if (user.password) {
      // Test password
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`Password '${password}' is valid: ${isValid}`);
      
      // Also test with a fresh hash to verify bcrypt is working
      const testHash = await bcrypt.hash(password, 12);
      const testCompare = await bcrypt.compare(password, testHash);
      console.log(`Fresh hash test: ${testCompare}`);
    }
  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Test the login
testLogin('test@example.com', 'password123');