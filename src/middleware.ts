import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Game route requires authentication
  if (request.nextUrl.pathname.startsWith('/game') && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If already logged in, redirect from auth pages to game
  if (
    (request.nextUrl.pathname.startsWith('/login') || 
     request.nextUrl.pathname.startsWith('/signup')) && 
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/game', request.url));
  }

  return NextResponse.next();
}

// Configuration
export const config = {
  matcher: ['/game/:path*', '/login', '/signup'],
};