import { NextResponse } from "next/server";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  
  console.log("Environment variables in API route:");
  console.log("DATABASE_URL:", databaseUrl);
  console.log("NEXTAUTH_SECRET:", nextAuthSecret);
  console.log("NEXTAUTH_URL:", nextAuthUrl);
  
  return NextResponse.json({ 
    databaseUrl,
    nextAuthSecret,
    nextAuthUrl,
    nodeEnv: process.env.NODE_ENV
  });
}