import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env files
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

// Export the environment variables
export const DATABASE_URL = process.env.DATABASE_URL || 'file:/Users/devin/Desktop/clicker_game_online/prisma/dev.db';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'ae27f8c7e19fcbac7318f9e85241dc59c1bfd35d6b8a6b4fab56781d04377a94';
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'https://paper-clips.com';

