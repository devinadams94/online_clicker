// This script resets the database to use SQLite
// Run with: node scripts/reset-db-to-sqlite.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Resetting the database to use SQLite...');

  try {
    // Check if dev.db exists and remove it if it does
    const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
    if (fs.existsSync(dbPath)) {
      console.log('Removing existing SQLite database file...');
      fs.unlinkSync(dbPath);
      console.log('Removed existing SQLite database file.');
    }

    // Run the migrations
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate dev --name sqlite_migration', { stdio: 'inherit' });
    
    // Generate Prisma client
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Database has been reset to use SQLite successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

main();