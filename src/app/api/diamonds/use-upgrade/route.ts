import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { upgradeId, cost, upgradeData } = await request.json();

    if (!upgradeId || !cost || !upgradeData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { gameState: true },
    });

    if (!user || !user.gameState) {
      return NextResponse.json({ error: 'User or game state not found' }, { status: 404 });
    }

    // Check if user has enough diamonds
    if (user.gameState.diamonds < cost) {
      return NextResponse.json({ error: 'Not enough diamonds' }, { status: 400 });
    }

    // Check if upgrade already purchased (only for non-repurchasable)
    const premiumUpgrades = JSON.parse(user.gameState.premiumUpgrades || '[]');
    console.log('[USE-UPGRADE API] Current upgrades:', premiumUpgrades);
    console.log('[USE-UPGRADE API] Adding upgrade:', upgradeId);
    
    if (!upgradeData.repurchasable && premiumUpgrades.includes(upgradeId)) {
      return NextResponse.json({ error: 'Upgrade already purchased' }, { status: 400 });
    }

    // Apply upgrade effects
    const updatedPremiumUpgrades = [...premiumUpgrades, upgradeId];
    console.log('[USE-UPGRADE API] Updated upgrades:', updatedPremiumUpgrades);
    
    let updateData: any = {
      diamonds: user.gameState.diamonds - cost,
      totalDiamondsSpent: user.gameState.totalDiamondsSpent + cost,
      premiumUpgrades: JSON.stringify(updatedPremiumUpgrades),
    };

    // Handle different upgrade types
    switch (upgradeData.category) {
      case 'instant':
      case 'space': // Handle space category same as instant
        if (upgradeData.instant) {
          switch (upgradeData.instant.type) {
            case 'paperclips':
              updateData.paperclips = user.gameState.paperclips + upgradeData.instant.amount;
              break;
            case 'money':
              updateData.money = user.gameState.money + upgradeData.instant.amount;
              break;
            case 'wire':
              updateData.wire = user.gameState.wire + upgradeData.instant.amount;
              break;
            case 'ops':
              updateData.ops = user.gameState.ops + upgradeData.instant.amount;
              break;
            case 'creativity':
              updateData.creativity = user.gameState.creativity + upgradeData.instant.amount;
              break;
            case 'yomi':
              updateData.yomi = user.gameState.yomi + upgradeData.instant.amount;
              break;
            case 'aerograde':
              updateData.aerogradePaperclips = user.gameState.aerogradePaperclips + upgradeData.instant.amount;
              break;
            case 'probes':
              updateData.probes = user.gameState.probes + upgradeData.instant.amount;
              break;
            case 'honor':
              updateData.honor = user.gameState.honor + upgradeData.instant.amount;
              break;
          }
        }
        break;
      
      case 'multiplier':
        if (upgradeId === 'quantum_factory') {
          // For repurchasable multipliers, compound the effect
          const quantumCount = premiumUpgrades.filter((id: string) => id === 'quantum_factory').length;
          updateData.productionMultiplier = user.gameState.productionMultiplier * (upgradeData.multiplier || 2);
        } else if (upgradeId === 'diamond_clippers') {
          // This will be handled in the game logic
        } else if (upgradeId === 'prestige_boost') {
          // This will be handled in the game logic
        }
        break;
      
      case 'special':
        if (upgradeId === 'space_jumpstart') {
          updateData.spaceAgeUnlocked = true;
          updateData.probes = 100;
          // Convert all paperclips to aerograde + 1 million bonus
          const totalPaperclips = user.gameState.paperclips;
          updateData.paperclips = 0;
          updateData.aerogradePaperclips = user.gameState.aerogradePaperclips + totalPaperclips + 1000000;
          console.log(`[USE-UPGRADE API] Space jumpstart: Converting ${totalPaperclips} paperclips to aerograde + 1M bonus`);
        }
        break;
    }

    // Update the game state
    const updatedGameState = await prisma.gameState.update({
      where: { id: user.gameState.id },
      data: updateData,
    });
    
    console.log('[USE-UPGRADE API] Saved premium upgrades:', updatedGameState.premiumUpgrades);

    return NextResponse.json({
      success: true,
      diamonds: updatedGameState.diamonds,
      gameState: updatedGameState,
    });
  } catch (error) {
    console.error('Premium upgrade purchase error:', error);
    return NextResponse.json({ error: 'Failed to process upgrade' }, { status: 500 });
  }
}