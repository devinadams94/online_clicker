import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import "@/lib/env"; // Ensure environment variables are loaded

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    
    
    // Create empty game state
    const gameState = await prisma.gameState.create({
      data: {
        userId: user.id,
        // Default values from schema will be used
      },
    });


    // Don't return the password
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown error";
    
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
      
    return NextResponse.json(
      { 
        message: "An error occurred while registering", 
        error: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}