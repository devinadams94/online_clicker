import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log("Test auth API: Checking credentials for", email);
    
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
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Test auth API: Password valid?", isValid);
    
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
    console.error("Test auth API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}