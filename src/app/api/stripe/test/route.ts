import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email || null,
      userId: session?.user?.id || null,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'not set',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 });
  }
}