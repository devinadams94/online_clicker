import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Get the bot intelligence value from the request
    const botIntelligence = parseInt(body.botIntelligence || 1) || 1;
    const botIntelligenceCost = parseFloat(body.botIntelligenceCost || 1500) || 1500;
    
    console.log("Forced update bot intelligence to:", botIntelligence);
    console.log("Forced update bot intelligence cost to:", botIntelligenceCost);
    
    // Check if user has a game state
    const existingGameState = await prisma.gameState.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!existingGameState) {
      return NextResponse.json(
        { message: "Game state not found" },
        { status: 404 }
      );
    }
    
    // Update just the bot intelligence directly
    const updatedGameState = await prisma.gameState.update({
      where: { userId: session.user.id },
      data: {
        botIntelligence: botIntelligence,
        botIntelligenceCost: botIntelligenceCost,
        lastSaved: new Date()
      }
    });
    
    // Additional direct SQL update as a backup
    await prisma.$executeRaw`
      UPDATE "GameState" 
      SET "botIntelligence" = ${botIntelligence},
          "botIntelligenceCost" = ${botIntelligenceCost},
          "lastSaved" = CURRENT_TIMESTAMP
      WHERE "userId" = ${session.user.id}
    `;
    
    return NextResponse.json({
      message: "Bot intelligence updated successfully",
      botIntelligence: updatedGameState.botIntelligence,
      botIntelligenceCost: updatedGameState.botIntelligenceCost
    });
  } catch (error) {
    console.error("Force update bot intelligence error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while updating bot intelligence" },
      { status: 500 }
    );
  }
}