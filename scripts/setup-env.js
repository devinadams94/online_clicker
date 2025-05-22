// setup-env.js
const fs = require('fs');
const path = require('path');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envLocalPath = path.join(process.cwd(), '.env.local');

// Create .env file if it doesn't exist
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  fs.writeFileSync(
    envPath,
    `DATABASE_URL=file:${path.join(process.cwd(), 'prisma/dev.db')}
NEXTAUTH_SECRET=ae27f8c7e19fcbac7318f9e85241dc59c1bfd35d6b8a6b4fab56781d04377a94
NEXTAUTH_URL=http://localhost:3000
`
  );
  console.log('.env file created successfully');
}

// Check if DATABASE_URL exists in .env
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.log('Adding DATABASE_URL to .env file...');
  fs.writeFileSync(
    envPath,
    `DATABASE_URL=file:${path.join(process.cwd(), 'prisma/dev.db')}\n${envContent}`
  );
  console.log('DATABASE_URL added to .env file');
}

console.log('Environment setup complete');