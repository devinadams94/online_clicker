import { NextResponse } from "next/server";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  
  
  return NextResponse.json({ 
    databaseUrl,
    nextAuthSecret,
    nextAuthUrl,
    nodeEnv: process.env.NODE_ENV
  });
}