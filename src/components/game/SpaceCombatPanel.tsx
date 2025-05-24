"use client";

import { useState, useEffect, useRef } from "react";
import useGameStore from "@/lib/gameStore";

interface Ship {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: { x: number; y: number };
  isEnemy: boolean;
}

export default function SpaceCombatPanel() {
  const {
    spaceAgeUnlocked,
    probes,
    honor,
    addHonor,
    spaceStats,
    battlesWon,
    autoBattleEnabled,
    autoBattleUnlocked,
    toggleAutoBattle
  } = useGameStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [battleActive, setBattleActive] = useState(false);
  const [enemyCount, setEnemyCount] = useState(0);
  const [ships, setShips] = useState<Ship[]>([]);
  const [message, setMessage] = useState<string>("");
  const [battleResults, setBattleResults] = useState<{
    won: boolean;
    honor: number;
    enemiesDestroyed: number;
    probesLost: number;
  } | null>(null);
  
  const combatUnlocked = spaceStats?.combat !== undefined;
  
  // Animation frame reference
  const animationRef = useRef<number>(0);
  
  // Format numbers with appropriate suffixes
  const formatNumber = (num: number = 0) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
  };
  
  // Initialize battle
  const startBattle = () => {
    if (probes <= 0) {
      setMessage("You need at least one probe to engage in combat");
      return;
    }
    
    // Reset battle state
    setBattleResults(null);
    setMessage("Battle started!");
    
    // Calculate difficulty multiplier based on battles won
    // Battle difficulty increases as the player wins more battles
    const difficultyMultiplier = 1 + (Math.log10(Math.max(1, battlesWon || 0)) * 0.3);
    
    // Generate a random number of enemies based on progress and difficulty
    // Add one more enemy for each battle won as requested
    const battleWonBonus = Math.min(20, battlesWon || 0); // Cap at 20 extra enemies for performance
    const minEnemies = Math.max(1, Math.floor(difficultyMultiplier) + battleWonBonus);
    const maxEnemies = Math.max(3, Math.floor(Math.log2(probes) * 2 * difficultyMultiplier) + battleWonBonus);
    const enemyCount = minEnemies + Math.floor(Math.random() * (maxEnemies - minEnemies + 1));
    setEnemyCount(enemyCount);
    
    // Create ships array
    const newShips: Ship[] = [];
    
    // Add player probes (up to a max of 50 on screen for performance)
    const probesToDeploy = Math.min(probes, 50);
    for (let i = 0; i < probesToDeploy; i++) {
      newShips.push({
        id: `probe-${i}`,
        x: 50 + Math.random() * 100, // Left side of screen
        y: 50 + Math.random() * 300,
        size: 4,
        speed: 1 + (spaceStats?.speed || 1) * 0.5,
        direction: { x: 0, y: 0 }, // Initially stationary
        isEnemy: false
      });
    }
    
    // Add enemy ships with increased stats based on difficulty (using the same multiplier calculated above)
    for (let i = 0; i < enemyCount; i++) {
      newShips.push({
        id: `enemy-${i}`,
        x: 650 + Math.random() * 100, // Right side of screen
        y: 50 + Math.random() * 300,
        size: 6 + Math.min(2, Math.floor(difficultyMultiplier) - 1), // Larger ships as difficulty increases
        speed: (0.7 + Math.random() * 0.6) * Math.min(1.5, difficultyMultiplier), // Faster ships as difficulty increases
        direction: { x: -1, y: (Math.random() - 0.5) * 0.5 }, // Moving left with slight y variation
        isEnemy: true
      });
    }
    
    setShips(newShips);
    setBattleActive(true);
  };
  
  // Update the battle simulation
  const updateBattle = () => {
    if (!battleActive || !ships.length) return;
    
    // Create new array for updated ships
    const updatedShips = [...ships];
    
    // Get combat and hazard evasion stats
    const combatStat = spaceStats?.combat || 1;
    const hazardEvasionStat = spaceStats?.hazardEvasion || 1;
    
    // Update ship directions randomly with some influence from combat stat
    updatedShips.forEach((ship, index) => {
      // Random movement behavior for all ships
      const randomizeDirection = () => {
        // Generate random direction change
        const randX = (Math.random() - 0.5) * 0.2; // Small random adjustment
        const randY = (Math.random() - 0.5) * 0.2;
        
        // Get current direction
        let dx = ship.direction.x + randX;
        let dy = ship.direction.y + randY;
        
        // Normalize
        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;
        dx = dx / magnitude;
        dy = dy / magnitude;
        
        return { x: dx, y: dy };
      };
      
      // Combat intelligence for player ships based on combat stat
      // Higher combat stat means more likely to seek out enemies
      if (!ship.isEnemy) {
        // Roll to see if ship uses combat intelligence (based on combat stat)
        // This makes higher combat stat give better ship targeting
        const usesCombatIntelligence = Math.random() < (combatStat * 0.1);
        
        if (usesCombatIntelligence) {
          // Find the nearest enemy
          let nearestEnemy: Ship | null = null;
          let minDistance = Infinity;
          
          updatedShips.forEach(otherShip => {
            if (otherShip.isEnemy) {
              const distance = Math.sqrt(
                Math.pow(otherShip.x - ship.x, 2) + 
                Math.pow(otherShip.y - ship.y, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = otherShip;
              }
            }
          });
          
          // If found an enemy, adjust direction towards it
          if (nearestEnemy !== null) {
            // Type assertion to ensure TypeScript knows this is a Ship
            const enemy = nearestEnemy as Ship;
            const dx = enemy.x - ship.x;
            const dy = enemy.y - ship.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Update direction with some randomness
            const targetDir = {
              x: dx / magnitude,
              y: dy / magnitude
            };
            
            // Mix current direction with target direction based on combat stat
            const combatInfluence = Math.min(0.8, combatStat * 0.1); // Cap at 80% influence
            updatedShips[index].direction = {
              x: ship.direction.x * (1 - combatInfluence) + targetDir.x * combatInfluence,
              y: ship.direction.y * (1 - combatInfluence) + targetDir.y * combatInfluence
            };
            
            // Normalize
            const newMagnitude = Math.sqrt(
              updatedShips[index].direction.x * updatedShips[index].direction.x + 
              updatedShips[index].direction.y * updatedShips[index].direction.y
            ) || 1;
            
            updatedShips[index].direction.x /= newMagnitude;
            updatedShips[index].direction.y /= newMagnitude;
          } else {
            // No enemies found, move randomly
            updatedShips[index].direction = randomizeDirection();
          }
        } else {
          // Not using combat intelligence, move randomly
          updatedShips[index].direction = randomizeDirection();
        }
      } else {
        // Enemy ships always move randomly
        updatedShips[index].direction = randomizeDirection();
      }
    });
    
    // Move all ships
    updatedShips.forEach((ship, index) => {
      updatedShips[index].x += ship.direction.x * ship.speed;
      updatedShips[index].y += ship.direction.y * ship.speed;
      
      // Bounce off edges of canvas instead of just constraining
      if (updatedShips[index].x <= 0) {
        updatedShips[index].x = 0;
        updatedShips[index].direction.x = Math.abs(updatedShips[index].direction.x); // Reverse x direction
      } else if (updatedShips[index].x >= 800) {
        updatedShips[index].x = 800;
        updatedShips[index].direction.x = -Math.abs(updatedShips[index].direction.x); // Reverse x direction
      }
      
      if (updatedShips[index].y <= 0) {
        updatedShips[index].y = 0;
        updatedShips[index].direction.y = Math.abs(updatedShips[index].direction.y); // Reverse y direction
      } else if (updatedShips[index].y >= 400) {
        updatedShips[index].y = 400;
        updatedShips[index].direction.y = -Math.abs(updatedShips[index].direction.y); // Reverse y direction
      }
    });
    
    // Random crashes based on hazard evasion stat
    // Higher hazard evasion means less crashes
    const probeCrashChance = 0.01 / hazardEvasionStat; // Base 1% crash chance divided by hazard evasion
    
    // Check for random probe crashes
    const crashIndices: number[] = [];
    updatedShips.forEach((ship, index) => {
      if (!ship.isEnemy && Math.random() < probeCrashChance) {
        // Mark this probe for removal (crashed)
        crashIndices.push(index);
      }
    });
    
    // Check for collisions
    const collisions: number[] = []; // Indices to remove
    
    for (let i = 0; i < updatedShips.length; i++) {
      // Skip if already crashed
      if (crashIndices.includes(i)) continue;
      
      for (let j = i + 1; j < updatedShips.length; j++) {
        // Skip if already crashed
        if (crashIndices.includes(j)) continue;
        
        // Skip if both are same type (enemy vs enemy or probe vs probe)
        if (updatedShips[i].isEnemy === updatedShips[j].isEnemy) continue;
        
        const ship1 = updatedShips[i];
        const ship2 = updatedShips[j];
        
        // Calculate distance between ships
        const distance = Math.sqrt(
          Math.pow(ship2.x - ship1.x, 2) + 
          Math.pow(ship2.y - ship1.y, 2)
        );
        
        // Collision detected if distance is less than sum of radii
        if (distance < (ship1.size + ship2.size)) {
          // Mark both for removal
          collisions.push(i, j);
          
          // Chance to randomly destroy another player probe to make battles harder
          // Reduced based on hazard evasion
          const extraDestructionChance = 0.3 / hazardEvasionStat;
          if (Math.random() < extraDestructionChance) {
            // Find a random player probe to destroy
            const playerProbes = updatedShips.map((s, idx) => ({ index: idx, isEnemy: s.isEnemy }))
              .filter(s => !s.isEnemy && !collisions.includes(s.index) && !crashIndices.includes(s.index));
            
            if (playerProbes.length > 0) {
              // Choose a random probe to destroy
              const randomProbeIndex = Math.floor(Math.random() * playerProbes.length);
              const probeToDestroy = playerProbes[randomProbeIndex].index;
              
              // Add it to collisions if not already there
              if (!collisions.includes(probeToDestroy)) {
                collisions.push(probeToDestroy);
              }
            }
          }
        }
      }
    }
    
    // Combine crashed ships with collisions
    const allCrashes = [...collisions, ...crashIndices];
    
    // Get count of probes before removing them
    const initialProbeCount = updatedShips.filter(ship => !ship.isEnemy).length;
    
    // Remove crashed and collided ships (need to remove in reverse order to not mess up indices)
    const uniqueRemoved = [...new Set(allCrashes)].sort((a, b) => b - a);
    uniqueRemoved.forEach(index => {
      updatedShips.splice(index, 1);
    });
    
    // Count remaining ships
    const remainingProbes = updatedShips.filter(ship => !ship.isEnemy).length;
    const remainingEnemies = updatedShips.filter(ship => ship.isEnemy).length;
    
    // Calculate probes lost this update
    const probesLostThisUpdate = initialProbeCount - remainingProbes;
    
    // If probes were lost, update the total probes in the game state
    if (probesLostThisUpdate > 0) {
      // This actually reduces the player's total probe count
      useGameStore.setState(state => ({
        probes: Math.max(0, state.probes - probesLostThisUpdate)
      }));
    }
    
    // Check if battle is over
    if (remainingProbes === 0 || remainingEnemies === 0) {
      setBattleActive(false);
      
      // Calculate honor gained (based on number of enemies destroyed)
      const enemiesDestroyed = enemyCount - remainingEnemies;
      
      // Calculate total probes lost (only count the actual probes lost in the battle)
      const deployedProbes = Math.min(probes, 50); // Same number we deployed in startBattle
      const probesLost = deployedProbes - remainingProbes;
      
      const honorGained = Math.floor(enemiesDestroyed * 10 * (1 + (spaceStats?.combat || 0) * 0.2));
      
      // Award honor
      if (honorGained > 0) {
        addHonor(honorGained);
      }
      
      // Show battle results
      const battleWon = remainingEnemies === 0;
      
      // Save game state after battle to ensure probe loss is saved
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.saveGameNow) {
          window.saveGameNow()
            .then(() => console.log("Game saved after battle"))
            .catch(err => console.error("Error saving after battle:", err));
        }
      }, 500);
      
      setBattleResults({
        won: battleWon,
        honor: honorGained,
        enemiesDestroyed,
        probesLost: probesLost > 0 ? probesLost : 0 // Ensure we never show negative probes lost
      });
      
      setMessage(battleWon ? "Victory! All enemies destroyed." : "Defeat! All probes lost.");
    }
    
    // Update the ships state
    setShips(updatedShips);
  };
  
  // Draw the battle
  const drawBattle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw ships
    ships.forEach(ship => {
      ctx.fillStyle = ship.isEnemy ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(ship.x, ship.y, ship.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  // Animation loop
  useEffect(() => {
    if (!battleActive) return;
    
    const animate = () => {
      updateBattle();
      drawBattle();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [battleActive, ships]);
  
  // Initial draw
  useEffect(() => {
    drawBattle();
  }, []);
  
  // Auto-battle logic
  useEffect(() => {
    // Only run auto-battle if enabled and combat is unlocked
    if (autoBattleEnabled && !battleActive && combatUnlocked && probes > 0) {
      // Start a battle automatically every 10 seconds
      const autoBattleInterval = setInterval(() => {
        if (!battleActive && probes > 0) {
          startBattle();
        }
      }, 10000);
      
      return () => clearInterval(autoBattleInterval);
    }
  }, [autoBattleEnabled, battleActive, combatUnlocked, probes]);
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return null;
  }
  
  // Check if combat is unlocked
  if (!combatUnlocked) {
    return (
      <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
        <h2 className="text-lg font-bold mb-3 flex items-center">
          <span className="text-xl mr-2">⚔️</span> Space Combat
        </h2>
        
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl mb-2 text-center">Combat Not Unlocked</h3>
          <p className="text-center text-gray-400 mb-4 max-w-md">
            Unlock the Combat capability in Space Age Stats to engage in battles against enemy ships.
          </p>
          <div className="w-48 h-1 bg-gray-700 rounded-full my-4"></div>
          <p className="text-sm text-gray-500">
            Return to the Space Age Stats panel to unlock Combat capabilities.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card bg-gray-800 text-white p-4 mb-4 w-full">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="text-xl mr-2">⚔️</span> Space Combat
      </h2>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-sm mr-3">Probes: <span className="font-bold text-blue-400">{formatNumber(probes)}</span></span>
          <span className="text-sm">Honor: <span className="font-bold text-yellow-400">{formatNumber(honor || 0)}</span></span>
          {battlesWon > 0 && (
            <span className="text-sm ml-3">Battles Won: <span className="font-bold text-green-400">{formatNumber(battlesWon)}</span></span>
          )}
          <div className="mt-1 text-xs text-gray-400">
            <span className="mr-3">Combat: <span className="font-medium text-blue-300">{spaceStats?.combat?.toFixed(1) || 1}</span></span>
            <span>Hazard Evasion: <span className="font-medium text-green-300">{spaceStats?.hazardEvasion?.toFixed(1) || 1}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {autoBattleUnlocked && (
            <div className={`flex items-center px-2 py-1 rounded ${
              autoBattleEnabled ? 'bg-green-900 text-green-100' : 'bg-gray-700 text-gray-300'
            }`}>
              <span className="text-xs mr-1">Auto-Battle:</span>
              <span className="text-xs font-bold">{autoBattleEnabled ? 'ON' : 'OFF'}</span>
            </div>
          )}
          <button
            className={`px-3 py-1 rounded text-sm ${
              !battleActive && probes > 0
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
            onClick={() => !battleActive && probes > 0 && startBattle()}
            disabled={battleActive || probes <= 0}
          >
            {battleActive ? 'Battle in progress...' : 'Start Battle'}
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`mb-3 p-2 text-center text-sm rounded ${
          message.includes('Victory') ? 'bg-green-900 text-green-100' :
          message.includes('Defeat') ? 'bg-red-900 text-red-100' :
          'bg-gray-700 text-gray-100'
        }`}>
          {message}
        </div>
      )}
      
      {/* Battle canvas */}
      <div className="relative w-full h-96 mb-3 border border-gray-700 rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          width={800}
          height={400}
        />
        
        {/* Battle stats overlay */}
        {battleActive && (
          <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded p-2 text-xs">
            <div>Player Probes: {ships.filter(s => !s.isEnemy).length}</div>
            <div>Enemy Ships: {ships.filter(s => s.isEnemy).length}</div>
          </div>
        )}
        
        {/* Battle results overlay */}
        {battleResults && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-4 rounded max-w-md">
              <h3 className={`text-xl font-bold mb-2 ${battleResults.won ? 'text-green-400' : 'text-red-400'}`}>
                {battleResults.won ? 'Victory!' : 'Defeat!'}
              </h3>
              <div className="space-y-2 mb-4">
                <div>Enemies Destroyed: <span className="font-bold text-red-400">{battleResults.enemiesDestroyed}</span></div>
                <div>Probes Lost: <span className="font-bold text-blue-400">{battleResults.probesLost}</span></div>
                <div>Honor Gained: <span className="font-bold text-yellow-400">{battleResults.honor}</span></div>
              </div>
              <button
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                onClick={() => {
                  setBattleResults(null);
                  setMessage("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Start prompt overlay */}
        {!battleActive && !battleResults && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚔️</div>
              <p className="mb-4 text-gray-300">
                Deploy your probes against enemy ships to gain Honor.
              </p>
              <button
                className={`px-4 py-2 rounded ${
                  probes > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
                onClick={() => probes > 0 && startBattle()}
                disabled={probes <= 0}
              >
                Start Battle
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-400">
        <p>Your probes (blue) move randomly with some guidance from the Combat stat, while enemy ships (red) move randomly.</p>
        <p>When ships collide, both are destroyed. Probes may also randomly crash based on your Hazard Evasion stat.</p>
        <p>Probes lost in battle are permanently lost from your total probes. Win battles to earn Honor for upgrades.</p>
        <p className="mt-2">Higher Combat stat helps ships find enemies. Higher Hazard Evasion reduces crashes and battle losses.</p>
        {autoBattleUnlocked && (
          <div className="mt-2 p-2 border border-gray-700 rounded">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Auto-Battle: </span>
                <span className={`${autoBattleEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {autoBattleEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                className={`px-2 py-0.5 text-xs rounded ${
                  autoBattleEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={() => toggleAutoBattle()}
              >
                {autoBattleEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
            <p className="mt-1">When enabled, battles will automatically start every 10 seconds if you have available probes.</p>
          </div>
        )}
      </div>
    </div>
  );
}