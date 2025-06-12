import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract metadata
        const userId = session.metadata?.userId;
        const diamonds = parseInt(session.metadata?.diamonds || '0');
        const packageId = session.metadata?.packageId;

        if (!userId || !diamonds) {
          console.error('Missing required metadata in checkout session');
          return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
        }

        // Find user's game state
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { gameState: true },
        });

        if (!user || !user.gameState) {
          console.error('User or game state not found:', userId);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user's diamond balance
        await prisma.gameState.update({
          where: { id: user.gameState.id },
          data: {
            diamonds: user.gameState.diamonds + diamonds,
            totalDiamondsPurchased: user.gameState.totalDiamondsPurchased + diamonds,
          },
        });

        console.log(`Successfully added ${diamonds} diamonds to user ${userId} (package: ${packageId})`);
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Stripe webhooks need raw body, so we need to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};