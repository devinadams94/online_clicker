import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();
  
  return NextResponse.json({
    message: 'NextAuth debug endpoint',
    headers: Object.fromEntries(headersList.entries()),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    },
    routes: {
      providers: '/api/auth/providers',
      session: '/api/auth/session',
      csrf: '/api/auth/csrf',
      signin: '/api/auth/signin',
      callback: '/api/auth/callback/credentials',
    }
  });
}