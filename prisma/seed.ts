import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Create game state for the user
  await prisma.gameState.upsert({
    where: { userId: user.id },
    update: {
      money: 1000, // Give some starting money
    },
    create: {
      userId: user.id,
      money: 1000, // Give some starting money
    }
  });

  console.log(`Created test user: ${user.email} (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });