import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;
    
    console.log("Fix password API: Updating password for", email);
    
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
      console.log(`User not found: ${email}`);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    console.log(`Found user: ${user.name} (${user.id})`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log("Generated new password hash");
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    console.log("Password updated successfully");
    
    // Success
    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Fix password API error:", error);
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