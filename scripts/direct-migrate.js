// direct-migrate.js
const { execSync } = require('child_process');
const path = require('path');

// Set the DATABASE_URL environment variable directly
process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma/dev.db')}`;

console.log('Running migration with explicit DATABASE_URL:', process.env.DATABASE_URL);

try {
  // Run the Prisma migration command with the DATABASE_URL environment variable set
  execSync('npx prisma migrate dev', { 
    env: { 
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL
    },
    stdio: 'inherit' 
  });
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}