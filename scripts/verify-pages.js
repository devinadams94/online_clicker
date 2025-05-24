/**
 * This script verifies that our newly created pages are accessible
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const PAGES_TO_CHECK = [
  '/',
  '/profile',
  '/highscores',
];

async function checkPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          url,
          ok: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('Verifying pages:');
  
  try {
    const results = await Promise.all(
      PAGES_TO_CHECK.map(page => checkPage(`${BASE_URL}${page}`))
    );
    
    let allPassed = true;
    
    results.forEach(result => {
      const statusSymbol = result.ok ? '✅' : '❌';
      console.log(`${statusSymbol} ${result.url} - Status: ${result.status}`);
      
      if (!result.ok) {
        allPassed = false;
      }
    });
    
    if (allPassed) {
      console.log('\nAll pages are accessible! 🎉');
    } else {
      console.log('\nSome pages failed the check. Make sure the server is running and check the console for errors.');
    }
  } catch (error) {
    console.error('Error checking pages:', error.message);
    console.log('Make sure the development server is running on http://localhost:3000');
  }
}

main();