import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;
    
    
    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email and new password are required" },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    
    // Success
    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
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