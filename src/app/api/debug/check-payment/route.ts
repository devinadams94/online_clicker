import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    // Get user's current diamond balance
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { gameState: true },
    });

    return NextResponse.json({
      sessionId,
      userEmail: session.user.email,
      currentDiamonds: user?.gameState?.diamonds || 0,
      totalDiamondsPurchased: user?.gameState?.totalDiamondsPurchased || 0,
      hasSessionId: !!sessionId,
    });
  } catch (error) {
    console.error('Debug check error:', error);
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}