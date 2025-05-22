import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    console.log("Direct auth API: Checking credentials for", email);
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.password) {
      console.log(`User not found: ${email}`);
      return NextResponse.json(
        { success: false, message: "User not found or no password set" },
        { status: 404 }
      );
    }
    
    console.log(`Found user: ${user.name} (${user.id})`);
    console.log(`Stored password hash: ${user.password.substring(0, 20)}...`);
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Direct auth API: Password valid?", isValid);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }
    
    // Success
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Direct auth API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}