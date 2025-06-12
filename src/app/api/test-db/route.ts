import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Handle BigInt serialization
const serialize = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

export async function GET() {
  try {
    // Test 1: Database connection - avoid BigInt issues
    const dbTest = await prisma.$queryRaw<{test: number}[]>`SELECT 1 as test`;
    
    // Test 2: Find users
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      take: 5,
    });
    
    // Test 3: Check test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test2@example.com' },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    
    let passwordTest = null;
    if (testUser?.password) {
      // Test password
      const isValid = await bcrypt.compare('test123', testUser.password);
      passwordTest = {
        hasPassword: true,
        passwordLength: testUser.password.length,
        isValid,
      };
    }
    
    return NextResponse.json(serialize({
      database: 'connected',
      dbTest,
      userCount,
      users,
      testUser: testUser ? {
        id: testUser.id,
        email: testUser.email,
        hasPassword: !!testUser.password,
      } : null,
      passwordTest,
    }));
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
    }, { status: 500 });
  }
}