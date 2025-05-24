import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import "@/lib/env"; // Ensure environment variables are loaded

export async function POST(req: Request) {
  try {
    console.log("Starting signup process...");
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      console.log("Missing required fields:", { email: !!email, name: !!name, password: !!password });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`Checking if user exists: ${email}`);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log(`User already exists: ${email}`);
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log(`Creating new user: ${email}`);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    
    console.log(`User created with ID: ${user.id}`);
    
    // Create empty game state
    console.log(`Creating game state for user: ${user.id}`);
    const gameState = await prisma.gameState.create({
      data: {
        userId: user.id,
        // Default values from schema will be used
      },
    });

    console.log(`Game state created with ID: ${gameState.id}`);

    // Don't return the password
    const { password: _password, ...userWithoutPassword } = user;

    console.log("Registration successful");
    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown error";
    
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    console.error("Error stack:", errorStack);
      
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