const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'devinadamsrip@gmail.com'
      }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Testing password for user:', user.name);
    const testPassword = 'Chirality9902!';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      // Let's create a new password hash for this user
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      console.log('New password hash:', hashedPassword);
      
      // Update the user's password
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      console.log('User password updated successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword();