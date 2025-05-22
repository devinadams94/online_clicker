import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This is an admin-only endpoint that should be protected in production
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and newPassword are required' 
      });
    }

    console.log(`Updating password for user: ${email}`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}