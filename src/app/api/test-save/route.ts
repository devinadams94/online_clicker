import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    console.log('[TEST-SAVE] Request body:', body);
    
    // Try a minimal update
    const result = await prisma.gameState.update({
      where: { userId: session.user.id },
      data: {
        paperclips: parseFloat(body.paperclips || 0),
        money: parseFloat(body.money || 0),
        wire: parseFloat(body.wire || 1000)
      }
    });
    
    console.log('[TEST-SAVE] Update successful:', result.id);
    
    return NextResponse.json({ 
      success: true, 
      updated: {
        paperclips: result.paperclips,
        money: result.money,
        wire: result.wire
      }
    });
    
  } catch (error) {
    console.error('[TEST-SAVE] Error:', error);
    return NextResponse.json({ 
      error: String(error),
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}