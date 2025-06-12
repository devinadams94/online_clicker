import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { packageId, diamonds, price } = await request.json();

    if (!packageId || !diamonds || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify the payment with your payment processor
    // 2. Check that the price matches the expected price for the package
    // 3. Handle payment failures, etc.

    // For now, we'll simulate a successful purchase
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { gameState: true },
    });

    if (!user || !user.gameState) {
      return NextResponse.json({ error: 'User or game state not found' }, { status: 404 });
    }

    // Update the user's diamond balance
    const updatedGameState = await prisma.gameState.update({
      where: { id: user.gameState.id },
      data: {
        diamonds: user.gameState.diamonds + diamonds,
        totalDiamondsPurchased: user.gameState.totalDiamondsPurchased + diamonds,
      },
    });

    return NextResponse.json({
      success: true,
      newDiamondBalance: updatedGameState.diamonds,
      diamondsPurchased: diamonds,
    });
  } catch (error) {
    console.error('Diamond purchase error:', error);
    return NextResponse.json({ error: 'Failed to process purchase' }, { status: 500 });
  }
}