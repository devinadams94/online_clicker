import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    console.log(`Checking credentials for: ${email}`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found'
      });
    }

    console.log(`Found user: ${user.name} (${user.id})`);
    console.log(`Stored password hash: ${user.password.substring(0, 10)}...`);

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isValid}`);

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password'
      });
    }

    // Success - return minimal user info
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // No need to disconnect in serverless functions
    // await prisma.$disconnect();
  }
}