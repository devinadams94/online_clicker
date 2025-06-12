const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword(email, newPassword) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user's password
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log(`Password updated successfully for ${email}`);
    console.log(`User ID: ${user.id}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
    if (error.code === 'P2025') {
      console.error(`User with email ${email} not found`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Reset password for test@example.com
resetPassword('test@example.com', 'password123');