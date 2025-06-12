import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (!user.password) {
      return NextResponse.json({ error: 'User has no password' }, { status: 400 });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      email: user.email,
      hasPassword: !!user.password,
      passwordValid: isValid,
      userId: user.id,
      // For debugging only - remove in production
      passwordLength: user.password.length,
      passwordPrefix: user.password.substring(0, 10)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 });
  }
}