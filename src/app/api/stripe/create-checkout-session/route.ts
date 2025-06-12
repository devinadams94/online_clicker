import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Define price IDs for each package (you'll need to create these in Stripe Dashboard)
const PRICE_MAP: { [key: string]: { priceInCents: number; diamonds: number } } = {
  starter: { priceInCents: 100, diamonds: 1000 },
  value: { priceInCents: 500, diamonds: 5500 },
  popular: { priceInCents: 1000, diamonds: 12000 },
  pro: { priceInCents: 2000, diamonds: 26000 },
  mega: { priceInCents: 4000, diamonds: 55000 },
  ultimate: { priceInCents: 10000, diamonds: 140000 },
};

export async function POST(request: Request) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Ensure we have a user ID
    const userId = session.user.id || session.user.email;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const { packageId } = await request.json();

    if (!packageId || !PRICE_MAP[packageId]) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const packageDetails = PRICE_MAP[packageId];

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageDetails.diamonds.toLocaleString()} Diamonds`,
              description: `Diamond package for Paperclip Clicker`,
              images: ['https://paper-clips.com/assets/favicon.png'], // You can update this with a diamond image
            },
            unit_amount: packageDetails.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/buy-diamonds`,
      metadata: {
        userId: userId,
        userEmail: session.user.email,
        packageId: packageId,
        diamonds: packageDetails.diamonds.toString(),
      },
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      error: 'Failed to create checkout session',
      message: errorMessage,
      type: error instanceof Error ? error.constructor.name : 'Unknown',
    };
    
    // Check for specific Stripe errors
    if (errorMessage.includes('Invalid API Key')) {
      errorDetails.error = 'Invalid Stripe configuration';
      errorDetails.message = 'Please check your Stripe API keys';
    }
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}