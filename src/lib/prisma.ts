import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from './env';

// Create Prisma Client with explicit database URL
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });
};

// Set up global type
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Create or reuse existing Prisma Client instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Connect to database
prisma.$connect()
  .then(() => {/* Connection successful */})
  .catch(() => {/* Connection failed */});

export default prisma;
