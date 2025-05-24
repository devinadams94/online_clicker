/**
 * This script runs ESLint with the --fix option to automatically fix some issues
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

try {
  console.log('Running ESLint fix for src directory...');
  execSync('npx eslint --fix src/', { 
    cwd: ROOT_DIR,
    stdio: 'inherit' 
  });
  
  console.log('\nRunning ESLint fix for pages directory...');
  execSync('npx eslint --fix pages/', { 
    cwd: ROOT_DIR,
    stdio: 'inherit' 
  });
  
  console.log('\nESLint fix completed successfully!');
  console.log('\nSome issues may still require manual fixing. Run "npm run lint" to see remaining issues.');
} catch (error) {
  console.error('Error running ESLint fix:', error.message);
  process.exit(1);
}