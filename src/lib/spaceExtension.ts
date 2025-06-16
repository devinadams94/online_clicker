// Space-related extensions for the game store
import type { GameState } from '@/types/game';
import { Planet, CelestialBody } from '@/types/game';

// Type for partial GameStore functions
interface GameStoreFunctions {
  [key: string]: any;
}

// Helper function to generate a random planet name
const generatePlanetName = (): string => {
  const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 
                    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 
                    'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
  const suffixes = ['Prime', 'Minor', 'Major', 'Secundus', 'Tertius', 'Centauri', 'Proxima',
                    'Nova', 'Orionis', 'Cygni', 'Eridani', 'Draconis', 'Persei', 'Andromeda'];
  const types = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return `${prefix} ${suffix} ${type}`;
};

// Helper function to select a random planet icon
const getPlanetIcon = (): string => {
  const planetIcons = ['🪐', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return planetIcons[Math.floor(Math.random() * planetIcons.length)];
};

// Helper function to generate a random planet description
const generatePlanetDescription = (): string => {
  const terrains = ['rocky', 'gaseous', 'icy', 'desert', 'volcanic', 'oceanic', 'forest', 'mountainous'];
  const atmospheres = ['thin', 'thick', 'toxic', 'breathable', 'corrosive', 'non-existent', 'methane-rich', 'hydrogen-rich'];
  const features = ['giant rings', 'multiple moons', 'binary star system', 'extreme temperatures', 'violent storms', 'rare minerals', 'ancient ruins', 'strange life forms'];
  
  const terrain = terrains[Math.floor(Math.random() * terrains.length)];
  const atmosphere = atmospheres[Math.floor(Math.random() * atmospheres.length)];
  const feature = features[Math.floor(Math.random() * features.length)];
  
  return `A ${terrain} planet with a ${atmosphere} atmosphere. Notable for its ${feature}.`;
};

// Helper function to generate celestial body name
const generateCelestialBodyName = (type: string): string => {
  const prefixes = ['K', 'X', 'Z', 'V', 'R', 'S', 'T', 'M', 'N', 'C'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const suffixes = ['a', 'b', 'c', 'd', 'e', 'alpha', 'beta', 'gamma', 'prime'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${type.charAt(0).toUpperCase()}${type.slice(1)} ${prefix}${number}${suffix}`;
};

// Helper function to get celestial body icon
const getCelestialBodyIcon = (type: string): string => {
  const icons = {
    asteroid: ['☄️', '🌑', '🪨'],
    comet: ['☄️', '💫', '✨'],
    dwarf: ['🌑', '🪐', '🌒'],
    debris: ['🌠', '💫', '⭐']
  };
  
  const typeIcons = icons[type as keyof typeof icons] || ['🌌'];
  return typeIcons[Math.floor(Math.random() * typeIcons.length)];
};

// Helper function to generate celestial body description
const generateCelestialBodyDescription = (type: string): string => {
  const descriptions = {
    asteroid: [
      'A rocky celestial body rich in minerals and ore.',
      'A dense asteroid composed of valuable metals and minerals.',
      'A small planetary body with significant mining potential.'
    ],
    comet: [
      'A celestial body of ice and dust with a distinctive tail.',
      'A volatile ice body with unusual resource composition.',
      'A fast-moving comet with exotic material traces.'
    ],
    dwarf: [
      'A small planetary body that failed to clear its orbit.',
      'A minor planet with significant gravitational influence.',
      'A planet-like body orbiting in an unusual pattern.'
    ],
    debris: [
      'A collection of space debris with unusual resource traces.',
      'Remnants of a cosmic collision, rich in scattered resources.',
      'A debris field containing valuable fragmented materials.'
    ]
  };
  
  const typeDescriptions = descriptions[type as keyof typeof descriptions] || ['An unknown celestial body.'];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

export const addSpaceFunctions = (set: (_state: Partial<GameState>) => void, get: () => GameState): GameStoreFunctions => ({
  // Switch to a different planet
  switchPlanet: (planetIndex: number) => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Ensure we have planets and index is valid
    if (!state.discoveredPlanets || state.discoveredPlanets.length === 0) {
      return;
    }
    
    if (planetIndex < 0 || planetIndex >= state.discoveredPlanets.length) {
      return;
    }
    
    // Update current planet index
    set({
      currentPlanetIndex: planetIndex
    });
  },

  // Launch a new probe
  makeProbe: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Use aerograde paperclips for probes - increased cost for balance
    const probeCost = 10000;
    
    if ((state.aerogradePaperclips || 0) < probeCost) {
      return;
    }
    
    // Create new probe and deduct aerograde paperclips
    set({
      probes: state.probes + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - probeCost
    });
  },
  
  // Space tick function - runs every game tick
  spaceTick: () => {
    const state = get();
    
    console.log('[SPACE TICK] Starting spaceTick function');
    
    // Skip if space age not unlocked
    if (!state.spaceAgeUnlocked) {
      console.log('[SPACE TICK] Space age not unlocked, skipping');
      return;
    }
    
    // Always ensure space matter is initialized correctly, even if we skip processing
    if (state.spaceMatter === undefined || state.spaceMatter === 0 || state.spaceMatter === null) {
      set({
        spaceMatter: 6e30, // 6 nonillion
        totalSpaceMatter: 6e30
      });
      return; // Return after fixing initialization to avoid processing with wrong values
    }
    
    // Check if we have any production units (drones/factories)
    const oreHarvesters = state.oreHarvesters || 0;
    const wireHarvesters = state.wireHarvesters || 0;
    const factories = state.factories || 0;
    const hasProductionUnits = oreHarvesters > 0 || wireHarvesters > 0 || factories > 0;
    
    console.log(`[SPACE TICK] Probes: ${state.probes}, Ore Harvesters: ${oreHarvesters}, Wire Harvesters: ${wireHarvesters}, Factories: ${factories}`);
    
    // Skip most processing if no probes AND no production units, but still allow energy generation
    if (state.probes <= 0 && !hasProductionUnits) {
      console.log('[SPACE TICK] No probes and no production units, only generating energy');
      // Still allow energy generation from solar arrays even without probes
      const solarArrays = state.solarArrays || 0;
      if (solarArrays > 0) {
        const energyGenerated = solarArrays * 10;
        const currentEnergy = state.energy || 0;
        const maxEnergy = state.maxEnergy || (state.batteries && state.batteries > 0 ? state.batteries * 1000 : 1000);
        const newEnergyAmount = Math.min(currentEnergy + energyGenerated, maxEnergy);
        
        set({
          energy: newEnergyAmount,
          energyPerSecond: energyGenerated * 10
        });
      }
      return;
    }
    
    // Initialize planets if needed
    const discoveredPlanets = state.discoveredPlanets || [];
    const currentPlanetIndex = state.currentPlanetIndex || 0;
    
    // Initialize Earth as the first planet if no planets exist
    if (discoveredPlanets.length === 0) {
      discoveredPlanets.push({
        id: 'earth',
        name: 'Earth',
        icon: '🌎',
        matter: 6e30, // 6 nonillion
        totalMatter: 6e30,
        description: 'Our home planet. Rich in resources but limited compared to what lies beyond.',
        discoveredAt: 0
      });
      
      // Directly update state to ensure planets are set properly
      set({
        discoveredPlanets,
        spaceMatter: 6e30,
        totalSpaceMatter: 6e30
      });
    }
    
    // If Earth has 0 matter, reset it to 6e30
    if (discoveredPlanets.length > 0 && 
        (discoveredPlanets[0].matter === 0 || 
         discoveredPlanets[0].matter === undefined || 
         discoveredPlanets[0].matter === null)) {
      discoveredPlanets[0].matter = 6e30;
      discoveredPlanets[0].totalMatter = 6e30;
      
      // Update planets and matter in state
      set({
        discoveredPlanets,
        spaceMatter: 6e30,
        totalSpaceMatter: 6e30
      });
    }
    
    // Get current planet's matter
    const currentPlanet = discoveredPlanets[currentPlanetIndex];
    const currentSpaceMatter = currentPlanet?.matter || 6e30;
    
    // Initialize space stats if not already done
    if (!state.spaceStats.miningProduction) {
      console.log('[SPACE STATS] Initializing space stats');
      set({
        spaceStats: {
          ...state.spaceStats,
          miningProduction: 1,
          wireProduction: 1,
          factoryProduction: 1,
          exploration: 1,
          speed: 1,
          selfReplication: 1,
          hazardEvasion: 1
        }
      });
    }
    
    console.log(`[SPACE STATS] miningProduction: ${state.spaceStats.miningProduction}, wireProduction: ${state.spaceStats.wireProduction}, factoryProduction: ${state.spaceStats.factoryProduction}`);
    
    // Apply efficiency multipliers from upgrades
    const miningEfficiency = state.miningEfficiency || 1;
    const droneEfficiency = state.droneEfficiency || 1;
    const factoryEfficiency = state.factoryEfficiency || 1;
    const explorationSpeed = state.explorationSpeed || 1;
    
    console.log(`[EFFICIENCY] Mining: ${miningEfficiency}, Drone: ${droneEfficiency}, Factory: ${factoryEfficiency}`);
    
    // Initialize variables for resources
    let wireHarvestersNew = state.wireHarvesters || 0;
    let oreHarvestersNew = state.oreHarvesters || 0;
    let factoriesNew = state.factories || 0;
    
    // Energy management - generate energy from solar arrays
    // 10 energy per solar array per tick
    const solarArrays = state.solarArrays || 0;
    const energyGenerated = solarArrays * 10;
    const currentEnergy = state.energy || 0;
    const maxEnergy = state.maxEnergy || (state.batteries && state.batteries > 0 ? state.batteries * 1000 : 1000); // Default to 1000 if not set
    const newEnergyAmount = Math.min(currentEnergy + energyGenerated, maxEnergy);
    
    console.log(`ENERGY START: ${currentEnergy} + ${energyGenerated} = ${newEnergyAmount} (max: ${maxEnergy})`);
    
    // Calculate energy consumption requirements
    const energyPerDrone = 2; // Each drone (ore/wire harvester) costs 2 energy per tick
    const energyPerFactory = 5; // Each factory costs 5 energy per tick
    
    // Use already-defined variables from earlier in the function
    
    const totalDrones = oreHarvesters + wireHarvesters;
    const totalFactories = factories;
    const totalEnergyRequired = (totalDrones * energyPerDrone) + (totalFactories * energyPerFactory);
    
    // Determine if we have enough energy for operations
    const hasEnoughEnergy = newEnergyAmount >= totalEnergyRequired;
    // If not enough energy, scale production by available energy ratio
    const energyEfficiency = hasEnoughEnergy ? 1.0 : Math.max(0, newEnergyAmount / Math.max(1, totalEnergyRequired));
    
    // CRITICAL: Actually consume the energy
    // If we have enough energy, consume exactly what's needed
    // If not, consume all available energy
    const energyConsumed = hasEnoughEnergy ? totalEnergyRequired : newEnergyAmount;
    const remainingEnergy = Math.max(0, newEnergyAmount - energyConsumed);
    
    console.log(`[ENERGY] Generated: ${energyGenerated}, Available: ${newEnergyAmount}/${maxEnergy}`);
    console.log(`[ENERGY] Required ${totalEnergyRequired}, consumed ${energyConsumed}, remaining ${remainingEnergy}`);
    console.log(`[ENERGY] Efficiency ${(energyEfficiency * 100).toFixed(1)}%, hasEnoughEnergy: ${hasEnoughEnergy}`);
    
    // Calculate space production multiplier from premium upgrades
    const spaceProductionBoostCount = (state.premiumUpgrades || []).filter((id: string) => id === 'space_production_boost').length;
    const premiumProductionMultiplier = spaceProductionBoostCount > 0 ? Math.pow(3, spaceProductionBoostCount) : 1;
    
    // Calculate how much ore can be mined (limited by available matter and energy)
    // Base value is 5 ore per drone per tick, multiplied by mining production stat and efficiency
    const oreProductionBonus = state.oreProductionBonus || 1;
    const potentialOreMined = oreHarvesters * state.spaceStats.miningProduction * 5.0 * miningEfficiency * droneEfficiency * energyEfficiency * oreProductionBonus * premiumProductionMultiplier;
    const actualOreMined = Math.min(potentialOreMined, currentSpaceMatter);
    
    console.log(`[ORE MINING] ${oreHarvesters} harvesters producing ${actualOreMined.toFixed(2)} ore/tick (${(actualOreMined * 10).toFixed(2)}/sec), from potential ${potentialOreMined.toFixed(2)}, ore bonus: ${oreProductionBonus.toFixed(2)}x`);
    
    // Convert ore to wire (wire harvesters process ore into wire)
    // Base value is 1 wire per drone per tick, multiplied by wire production stat and efficiency
    const wireProductionBonus = state.wireProductionBonus || 1;
    const potentialWireProduced = wireHarvesters * state.spaceStats.wireProduction * 1.0 * droneEfficiency * energyEfficiency * wireProductionBonus * premiumProductionMultiplier;
    
    // Initialize spaceOre if it doesn't exist
    const currentOre = typeof state.spaceOre === 'number' ? state.spaceOre : 0;
    const availableOre = currentOre + actualOreMined;
    
    // Wire production is limited by available ore
    const actualWireProduced = Math.min(potentialWireProduced, availableOre);
    const oreConsumed = actualWireProduced;
    
    console.log(`[WIRE PRODUCTION] ${wireHarvesters} harvesters producing ${actualWireProduced.toFixed(2)} wire/tick (${(actualWireProduced * 10).toFixed(2)}/sec), from potential ${potentialWireProduced.toFixed(2)}, available ore: ${availableOre.toFixed(2)}, wire bonus: ${wireProductionBonus.toFixed(2)}x`);
    
    // Produce Aerograde paperclips from wire (factories convert wire to paperclips)
    // Initialize spaceWire if it doesn't exist
    const currentWire = typeof state.spaceWire === 'number' ? state.spaceWire : 0;
    const availableWire = currentWire + actualWireProduced;
    
    // Base value is 1 paperclip per factory per tick, modified by factory production stat and efficiency
    const factoryProductionBonus = state.factoryProductionBonus || 1;
    const potentialPaperclipsProduced = factories * state.spaceStats.factoryProduction * 1.0 * factoryEfficiency * energyEfficiency * factoryProductionBonus * premiumProductionMultiplier;
    
    // Paperclip production is limited by available wire
    const maxPaperclipsFromWire = availableWire;
    const actualPaperclipsProduced = Math.min(potentialPaperclipsProduced, maxPaperclipsFromWire);
    
    // Wire consumed equals paperclips produced (1:1 ratio)
    const wireConsumed = actualPaperclipsProduced;
    
    console.log(`[PAPERCLIP PRODUCTION] ${factories} factories producing ${actualPaperclipsProduced.toFixed(2)} clips/tick (${(actualPaperclipsProduced * 10).toFixed(2)}/sec), from potential ${potentialPaperclipsProduced.toFixed(2)}, available wire: ${availableWire.toFixed(2)}, factory bonus: ${factoryProductionBonus.toFixed(2)}x`);
    
    // Probe self-replication - create new probes based on self-replication stat
    // Use statistical approach instead of looping through each probe for better performance
    let newProbes = 0;
    // Enhanced replication: 100% stronger per stat point - doubled from 0.0001 to 0.0002
    const replicationChance = Math.min(0.002, state.spaceStats.selfReplication * 0.0002); // Cap at 0.2% per tick (doubled)
    
    // Calculate expected new probes statistically instead of looping
    if (state.probes > 100) {
      // For large numbers, use statistical expectation
      newProbes = Math.floor(state.probes * replicationChance);
      // Add some randomness
      if (Math.random() < (state.probes * replicationChance) % 1) {
        newProbes++;
      }
    } else {
      // For small numbers, keep the loop
      for (let i = 0; i < state.probes; i++) {
        if (Math.random() < replicationChance) {
          newProbes++;
        }
      }
    }
    
    // Add a small base rate of probe replication based on self-replication stat
    // This provides a small but steady growth rate
    // Enhanced base rate: 100% stronger per stat point - doubled from 0.00001 to 0.00002
    newProbes += Math.floor(state.probes * state.spaceStats.selfReplication * 0.00002);
    
    // Enhanced probe combat and defection system
    let probesDefected = 0;
    let probesDestroyed = 0;
    let enemiesDestroyed = 0;
    let newEnemyShips = state.enemyShips || 0;
    let defectionEvent = null;
    
    // Get hazard evasion stat for protection against all random events
    const hazardEvasion = state.spaceStats.hazardEvasion || 1;
    // Improved hazard protection formula that becomes very effective at high levels
    // At level 30+, provides near-complete protection
    let hazardProtection;
    if (hazardEvasion >= 30) {
      // At level 30+, provide 98%+ protection with diminishing returns
      hazardProtection = Math.min(0.995, 0.98 + (hazardEvasion - 30) * 0.001);
    } else if (hazardEvasion >= 10) {
      // From level 10-29, scale from 70% to 98%
      hazardProtection = 0.7 + ((hazardEvasion - 10) / 20) * 0.28;
    } else {
      // Below level 10, scale from 0% to 70%
      hazardProtection = Math.min(0.7, (hazardEvasion - 1) / 9 * 0.7);
    }
    
    console.log(`[COMBAT] Starting combat phase - Probes: ${state.probes}, Enemy Ships: ${newEnemyShips}, Hazard Protection: ${(hazardProtection * 100).toFixed(1)}%`);
    
    // PHASE 1: Active probe combat against enemy ships (only if combat is unlocked)
    if (state.spaceStats.combat && state.probes > 0 && newEnemyShips > 0) {
      const combatStat = state.spaceStats.combat;
      // Combat effectiveness: higher combat stat = higher chance to destroy enemies
      // Base 5% chance per probe per tick, modified by combat stat
      const baseDestroyChance = 0.05 * combatStat;
      const maxDestroyChance = Math.min(0.8, baseDestroyChance); // Cap at 80% per probe
      
      // Calculate how many enemy ships our probes can destroy
      if (state.probes > 100) {
        // Statistical approach for large fleets
        const expectedDestructions = Math.min(newEnemyShips, state.probes * maxDestroyChance);
        enemiesDestroyed = Math.floor(expectedDestructions);
        if (Math.random() < (expectedDestructions % 1)) {
          enemiesDestroyed++;
        }
      } else {
        // Individual combat for smaller fleets
        for (let i = 0; i < state.probes && enemiesDestroyed < newEnemyShips; i++) {
          if (Math.random() < maxDestroyChance) {
            enemiesDestroyed++;
          }
        }
      }
      
      newEnemyShips = Math.max(0, newEnemyShips - enemiesDestroyed);
      console.log(`[COMBAT] Player probes destroyed ${enemiesDestroyed} enemy ships. Remaining enemies: ${newEnemyShips}`);
    }
    
    // PHASE 2: Probe defections (protected by hazard evasion)
    if (state.probes > 0) {
      // Base defection rate starts much lower and scales with probe count
      const baseDefectionRate = state.defectionRate || 0.0001; // Reduced from 0.001 to 0.0001
      
      // Probe count scaling: defection rate increases with more probes (reduced scaling)
      // Formula: base rate + (probe_count / 10000) * 0.01, capped at 5%
      const probeCountFactor = (state.probes / 10000) * 0.01; // Reduced scaling significantly
      const scaledDefectionRate = baseDefectionRate + probeCountFactor;
      
      // Overcrowding effect (much reduced)
      const overcrowdingMultiplier = 1 + Math.log10(Math.max(1, state.probes)) * 0.005; // Reduced from 0.02
      
      // Combine all factors and cap at 5% instead of 30%
      let adjustedDefectionRate = Math.min(0.05, scaledDefectionRate * overcrowdingMultiplier);
      
      // Apply hazard evasion protection to reduce defection rate
      adjustedDefectionRate *= (1 - hazardProtection);
      
      // Calculate defections statistically for better performance
      if (state.probes > 50) {
        // For large numbers, use statistical expectation
        const expectedDefections = state.probes * adjustedDefectionRate;
        probesDefected = Math.floor(expectedDefections);
        // Add randomness for fractional part
        if (Math.random() < (expectedDefections % 1)) {
          probesDefected++;
        }
      } else {
        // For small numbers, check each probe
        for (let i = 0; i < state.probes; i++) {
          if (Math.random() < adjustedDefectionRate) {
            probesDefected++;
          }
        }
      }
      
      console.log(`[COMBAT] ${probesDefected} probes defected (base rate: ${(baseDefectionRate * 100).toFixed(3)}%, probe scaling: ${(probeCountFactor * 100).toFixed(3)}%, final rate: ${(adjustedDefectionRate * 100).toFixed(3)}%, protected by hazard evasion)`);
    }
    
    // PHASE 3: Enemy ship attacks (only if enemies remain after combat)
    if (newEnemyShips > 0 && state.probes > probesDefected) {
      // Each enemy ship has a chance to destroy a probe each tick (reduced base rate)
      let baseAttackRate = 0.01; // Reduced from 10% to 1% chance per enemy ship per tick
      
      // Apply hazard evasion protection to reduce attack effectiveness
      baseAttackRate *= (1 - hazardProtection);
      
      const remainingProbes = state.probes - probesDefected;
      
      if (newEnemyShips > 20) {
        // Statistical approach for large numbers
        const expectedDestructions = Math.min(remainingProbes, newEnemyShips * baseAttackRate);
        probesDestroyed = Math.floor(expectedDestructions);
        if (Math.random() < (expectedDestructions % 1)) {
          probesDestroyed++;
        }
      } else {
        // Individual checks for smaller numbers
        for (let i = 0; i < newEnemyShips && probesDestroyed < remainingProbes; i++) {
          if (Math.random() < baseAttackRate) {
            probesDestroyed++;
          }
        }
      }
      
      console.log(`[COMBAT] Enemy ships destroyed ${probesDestroyed} probes (attack rate: ${(baseAttackRate * 100).toFixed(2)}%, protected by hazard evasion)`);
    } else if (newEnemyShips === 0) {
      // No enemy ships = no probe destruction from combat
      probesDestroyed = 0;
      console.log(`[COMBAT] No enemy ships remaining - probes are safe from combat destruction`);
    }
    
    // PHASE 4: Defected probes become enemy ships
    newEnemyShips += probesDefected;
    
    // PHASE 5: Natural enemy attrition (they occasionally leave or get destroyed by other means)
    if (newEnemyShips > 0) {
      const attritionRate = 0.02; // 2% chance per enemy ship per tick
      let enemiesLost = 0;
      
      if (newEnemyShips > 50) {
        // Statistical approach
        const expectedLosses = newEnemyShips * attritionRate;
        enemiesLost = Math.floor(expectedLosses);
        if (Math.random() < (expectedLosses % 1)) {
          enemiesLost++;
        }
      } else {
        for (let i = 0; i < newEnemyShips; i++) {
          if (Math.random() < attritionRate) {
            enemiesLost++;
          }
        }
      }
      
      newEnemyShips = Math.max(0, newEnemyShips - enemiesLost);
      console.log(`[COMBAT] ${enemiesLost} enemy ships lost to attrition`);
    }
    
    // Create combat/defection event if significant activity occurred
    if (probesDefected > 0 || probesDestroyed > 0 || enemiesDestroyed > 0) {
      let description = '';
      
      if (enemiesDestroyed > 0 && probesDefected > 0 && probesDestroyed > 0) {
        description = `Combat engagement: ${enemiesDestroyed} enemy ships destroyed, ${probesDefected} probes defected, ${probesDestroyed} probes lost.`;
      } else if (enemiesDestroyed > 0 && (probesDefected > 0 || probesDestroyed > 0)) {
        description = `Combat victory: ${enemiesDestroyed} enemy ships destroyed. ${probesDefected + probesDestroyed} probes lost.`;
      } else if (enemiesDestroyed > 0) {
        description = `Combat triumph: ${enemiesDestroyed} enemy ships destroyed with no losses!`;
      } else if (probesDefected > 0 && probesDestroyed > 0) {
        description = `${probesDefected} probe(s) defected to enemy forces, ${probesDestroyed} probe(s) destroyed in combat.`;
      } else if (probesDefected > 0) {
        description = `${probesDefected} probe(s) went rogue and joined enemy forces. Defection rate: ${((state.defectionRate || 0.001) * 100).toFixed(3)}%`;
      } else if (probesDestroyed > 0) {
        description = `Enemy ships destroyed ${probesDestroyed} probe(s) in combat.`;
      }
      
      defectionEvent = {
        timestamp: new Date(),
        probesDefected,
        probesDestroyed,
        enemiesDestroyed,
        description
      };
    }
    
    // Calculate probe speed multiplier from premium upgrades
    const probeSpeedBoostCount = (state.premiumUpgrades || []).filter((id: string) => id === 'probe_speed_boost').length;
    const premiumSpeedMultiplier = probeSpeedBoostCount > 0 ? Math.pow(2, probeSpeedBoostCount) : 1;
    
    // Calculate exploration rate based on probes, speed and exploration stats, with exploration speed multiplier
    const explorationRate = 
      (state.probes * state.spaceStats.speed * state.spaceStats.exploration * 0.0000000000001) * 
      (1 + Math.log10(Math.max(1, state.probes))) * explorationSpeed * premiumSpeedMultiplier;
    
    // Calculate new universe exploration percentage
    const newUniverseExplored = Math.min(100, state.universeExplored + explorationRate);
    
    // Check if we should discover a new planet (at every whole percentage point)
    const previousPercentage = Math.floor(state.universeExplored);
    const newPercentage = Math.floor(newUniverseExplored);
    
    // Check for celestial body discovery (every 0.5% with 50% chance)
    const previousHalfPercentage = Math.floor(state.universeExplored * 2) / 2;
    const newHalfPercentage = Math.floor(newUniverseExplored * 2) / 2;
    
    // Initialize celestial bodies array if needed
    const discoveredCelestialBodies = state.discoveredCelestialBodies || [];
    let updatedCelestialBodies = [...discoveredCelestialBodies];
    
    // Check if we should discover a celestial body
    const celestialBodyTypes = ['asteroid', 'comet', 'dwarf', 'debris'];
    const hasCelestialScanner = state.unlockedSpaceUpgrades?.includes('celestialScanner');
    
    // Determine how many half-percentage points we've passed
    const halfPercentagePoints = [];
    let currentHalfPercentage = previousHalfPercentage + 0.5;
    while (currentHalfPercentage <= newHalfPercentage) {
      halfPercentagePoints.push(currentHalfPercentage);
      currentHalfPercentage += 0.5;
    }
    
    // For each half-percentage point, check if we discover a celestial body
    halfPercentagePoints.forEach(halfPercentage => {
      // Only 50% chance to discover, increased to 80% with scanner
      const discoveryChance = hasCelestialScanner ? 0.8 : 0.5;
      if (Math.random() < discoveryChance) {
        // Choose a random celestial body type
        const bodyType = celestialBodyTypes[Math.floor(Math.random() * celestialBodyTypes.length)] as 'asteroid' | 'comet' | 'dwarf' | 'debris';
        
        // Generate resource amounts based on type and exploration percentage
        const baseMultiplier = 1 + (halfPercentage / 10); // Higher amounts the further we explore
        const matterAmount = Math.random() * 1e6 * baseMultiplier;
        const oreAmount = Math.random() * 5e5 * baseMultiplier;
        const hasRareElements = Math.random() < 0.3; // 30% chance for rare elements
        const rareElementsAmount = hasRareElements ? Math.random() * 1e4 * baseMultiplier : undefined;
        
        // Create a new celestial body
        const newBody: CelestialBody = {
          id: `body-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: bodyType,
          name: generateCelestialBodyName(bodyType),
          icon: getCelestialBodyIcon(bodyType),
          resources: {
            matter: matterAmount,
            ore: oreAmount,
            rareElements: rareElementsAmount
          },
          totalResources: {
            matter: matterAmount,
            ore: oreAmount,
            rareElements: rareElementsAmount
          },
          description: generateCelestialBodyDescription(bodyType),
          discoveredAt: halfPercentage,
          isBeingHarvested: false
        };
        
        // Add the new celestial body to the list
        updatedCelestialBodies.push(newBody);
      }
    });
    
    // If we've reached a new percentage point, discover a new planet
    let updatedPlanets = [...discoveredPlanets];
    if (newPercentage > previousPercentage && newPercentage > 0) {
      // Generate random matter amount between 1 and 100 nonillion
      const matterAmount = (1 + Math.random() * 99) * 1e30;
      
      // Create a new planet
      const newPlanet: Planet = {
        id: `planet-${Date.now()}`,
        name: generatePlanetName(),
        icon: getPlanetIcon(),
        matter: matterAmount,
        totalMatter: matterAmount,
        description: generatePlanetDescription(),
        discoveredAt: newPercentage
      };
      
      // Add the new planet to the list
      updatedPlanets.push(newPlanet);
    }
    
    // Update current planet's matter
    if (currentPlanet) {
      updatedPlanets[currentPlanetIndex] = {
        ...currentPlanet,
        matter: currentPlanet.matter - actualOreMined
      };
    }
    
    // Handle celestial body harvesting and drone replication
    let newWireHarvesters = wireHarvestersNew;
    let newOreHarvesters = oreHarvestersNew;
    let resourcesHarvested = false;
    
    // Process harvesting and drone self-replication if enabled
    if (state.droneReplicationEnabled && state.unlockedSpaceUpgrades?.includes('droneReplication')) {
      // Set drone replication cost if not already set
      const droneReplicationCost = state.droneReplicationCostPerDrone || 1000; // Default cost per drone
      
      // Get bodies that are being harvested - only if we have celestial bodies
      if (updatedCelestialBodies.length > 0) {
        const harvestedBodies = updatedCelestialBodies.filter((body: CelestialBody) => body.isBeingHarvested);
        
        // Process each harvested body
        harvestedBodies.forEach(body => {
        // Determine how many resources can be harvested this tick
        const resourceExtractor = state.unlockedSpaceUpgrades?.includes('resourceExtraction') ? 3 : 1;
        const miningRate = 0.05 * resourceExtractor; // 5% of resources per tick, tripled with extractor
        
        // Calculate how much to extract
        const extractedMatter = Math.min(body.resources.matter, body.resources.matter * miningRate);
        const extractedOre = Math.min(body.resources.ore, body.resources.ore * miningRate);
        
        // Update body resources
        const bodyIndex = updatedCelestialBodies.findIndex(b => b.id === body.id);
        if (bodyIndex >= 0) {
          updatedCelestialBodies[bodyIndex] = {
            ...body,
            resources: {
              ...body.resources,
              matter: body.resources.matter - extractedMatter,
              ore: body.resources.ore - extractedOre
            }
          };
          
          resourcesHarvested = true;
          
          // Only replicate drones if enough Aerograde paperclips and resources were harvested
          if ((state.aerogradePaperclips || 0) >= droneReplicationCost && resourcesHarvested) {
            // 20% chance to replicate a wire harvester
            if (Math.random() < 0.2) {
              newWireHarvesters++;
            }
            
            // 20% chance to replicate an ore harvester
            if (Math.random() < 0.2) {
              newOreHarvesters++;
            }
          }
        }
      });
      }
    }
    
    // Calculate new resource values
    const newSpaceMatter = currentSpaceMatter - actualOreMined;
    
    // Ore should accumulate first, then be consumed by wire production
    // Final ore = starting ore + mined ore - consumed ore
    const newSpaceOre = Math.max(0, currentOre + actualOreMined - oreConsumed);
    
    // Wire should accumulate from production, then be consumed by paperclip production  
    // Final wire = starting wire + produced wire - consumed wire
    const newSpaceWire = Math.max(0, currentWire + actualWireProduced - wireConsumed);
    let newAerograde = (state.aerogradePaperclips || 0) + actualPaperclipsProduced - 
      (resourcesHarvested && state.droneReplicationEnabled ? 
        ((newWireHarvesters - wireHarvestersNew) + (newOreHarvesters - oreHarvestersNew)) * 
        (state.droneReplicationCostPerDrone || 1000) : 0);
    
    // Track total aerograde paperclips produced for trust generation
    const newTotalAerogradePaperclips = (state.totalAerogradePaperclips || 0) + actualPaperclipsProduced;
    
    // Check for trust generation based on aerograde paperclip production
    let trustGain = 0;
    let newNextAerogradeTrustAt = state.nextAerogradeTrustAt || 10000000000; // 10 billion default
    
    if (newTotalAerogradePaperclips >= newNextAerogradeTrustAt) {
      trustGain = 1;
      // Scale up by 50% for next trust point: 10B -> 15B -> 22.5B -> 33.75B...
      newNextAerogradeTrustAt = Math.floor(newNextAerogradeTrustAt * 1.5);
      console.log(`[TRUST] Trust gained from aerograde production! Total: ${newTotalAerogradePaperclips.toFixed(0)}, Next threshold: ${newNextAerogradeTrustAt.toFixed(0)}`);
    }
    
    // Auto probe launcher logic
    let autoProbesLaunched = 0;
    if (state.autoProbeLauncherEnabled && newAerograde >= 10000) {
      // Launch probes automatically if we have enough aerograde paperclips
      const maxProbesCanLaunch = Math.floor(newAerograde / 10000);
      // Limit to launching 1 probe per tick to avoid overwhelming the system
      autoProbesLaunched = Math.min(1, maxProbesCanLaunch);
      
      if (autoProbesLaunched > 0) {
        console.log(`[AUTO PROBE] Launching ${autoProbesLaunched} probe(s) automatically`);
        // Deduct the cost from aerograde paperclips
        newAerograde -= autoProbesLaunched * 10000;
      }
    }
    
    // Debug log resource changes
    console.log(`[RESOURCE UPDATE] Ore: ${currentOre.toFixed(2)} + ${actualOreMined.toFixed(2)} - ${oreConsumed.toFixed(2)} = ${newSpaceOre.toFixed(2)}`);
    console.log(`[RESOURCE UPDATE] Wire: ${currentWire.toFixed(2)} + ${actualWireProduced.toFixed(2)} - ${wireConsumed.toFixed(2)} = ${newSpaceWire.toFixed(2)}`);
    console.log(`[RESOURCE UPDATE] Aerograde: ${(state.aerogradePaperclips || 0).toFixed(2)} + ${actualPaperclipsProduced.toFixed(2)} = ${newAerograde.toFixed(2)}`);
    
    // Perform a direct state update with all values
    // This ensures consistent updates regardless of batching
    set({
      // Energy updates
      energy: remainingEnergy,
      energyPerSecond: energyGenerated * 10, // Convert to per second (10 ticks per second)
      energyConsumedPerSecond: totalEnergyRequired * 10,
      
      // Resource updates
      spaceMatter: newSpaceMatter,
      spaceOre: newSpaceOre,
      spaceWire: newSpaceWire,
      paperclips: state.paperclips + actualPaperclipsProduced,
      aerogradePaperclips: newAerograde,
      totalAerogradePaperclips: newTotalAerogradePaperclips,
      
      // Trust updates
      trust: (state.trust || 0) + trustGain,
      nextAerogradeTrustAt: newNextAerogradeTrustAt,
      
      // Production rates
      spaceOrePerSecond: actualOreMined * 10,
      spaceWirePerSecond: actualWireProduced * 10,
      spacePaperclipsPerSecond: actualPaperclipsProduced * 10,
      
      // Production units
      wireHarvesters: newWireHarvesters,
      oreHarvesters: newOreHarvesters,
      
      // Probe and combat updates
      probes: Math.max(0, state.probes + newProbes + autoProbesLaunched - probesDefected - probesDestroyed),
      enemyShips: newEnemyShips,
      
      // Exploration updates
      universeExplored: newUniverseExplored,
      
      // Planet and celestial body updates
      discoveredPlanets: updatedPlanets,
      discoveredCelestialBodies: updatedCelestialBodies,
      
      // Other updates
      totalProbesLost: probesDefected > 0 || probesDestroyed > 0 ? 
        (state.totalProbesLost || 0) + probesDefected + probesDestroyed : 
        state.totalProbesLost,
      lastDefectionTime: probesDefected > 0 || probesDestroyed > 0 ? 
        new Date() : 
        state.lastDefectionTime,
      defectionEvents: defectionEvent ? 
        [defectionEvent, ...(state.defectionEvents || [])].slice(0, 50) : 
        state.defectionEvents
    });
  },
  
  // Update space age upgrade stat function to use yomi instead of trust
  upgradeStat: (stat: string, cost: number) => {
    const state = get();
    
    // Check if player has enough yomi
    if (state.yomi < cost) {
      return;
    }
    
    // Check if spaceStats exists
    if (!state.spaceStats) {
      return;
    }
    
    // Make a new copy of spaceStats to ensure the update triggers correctly
    const updatedSpaceStats = {...state.spaceStats};
    updatedSpaceStats[stat] = (updatedSpaceStats[stat] ?? 1) + 1;
    
    // Upgrade the stat and deduct yomi
    set({
      spaceStats: updatedSpaceStats,
      yomi: state.yomi - cost
    });
  },
  
  // Add yomi for testing (can be removed in production)
  addYomi: (amount: number) => {
    const state = get();
    set({
      yomi: state.yomi + amount
    });
  },
  
  // Add honor resource from combat victories
  // Also add Yomi equal to honor gained from combat
  addHonor: (amount: number) => {
    const state = get();
    set({
      honor: (state.honor || 0) + amount,
      yomi: (state.yomi || 0) + amount // Add the same amount to Yomi
    });
  },
  
  // Track battles won and update difficulty (separate from addHonor)
  incrementBattlesWon: () => {
    const state = get();
    const newBattlesWon = (state.battlesWon || 0) + 1;
    set({
      battlesWon: newBattlesWon,
      // Update battle difficulty multiplier
      battleDifficulty: 1 + (Math.log10(Math.max(1, newBattlesWon) + 1) * 0.3)
    });
  },
  
  // Toggle auto-battle on/off
  toggleAutoBattle: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if auto-battle is unlocked
    if (!state.autoBattleUnlocked) {
      return;
    }
    
    // Toggle the state
    set({
      autoBattleEnabled: !state.autoBattleEnabled
    });
  },
  
  // Unlock auto-battle with yomi
  unlockAutoBattle: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if combat is unlocked
    if (state.spaceStats.combat === undefined) {
      return;
    }
    
    // Check if auto-battle is already unlocked
    if (state.autoBattleUnlocked) {
      return;
    }
    
    // Auto-battle costs 10,000 yomi
    const unlockCost = 10000;
    if (state.yomi < unlockCost) {
      return;
    }
    
    // Unlock auto-battle and deduct yomi
    set({
      yomi: state.yomi - unlockCost,
      autoBattleUnlocked: true,
      autoBattleEnabled: false // Initially disabled until player turns it on
    });
  },
  
  // Buy space upgrades with paperclips
  buySpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if player has enough Aerograde paperclips
    if ((state.aerogradePaperclips || 0) < cost) {
      return;
    }
    
    // Get the count of this upgrade already purchased (for repeatable upgrades)
    const unlockedSpaceUpgrades = state.unlockedSpaceUpgrades || [];
    const _purchaseCount = unlockedSpaceUpgrades.filter((upgradeId: string) => upgradeId === id).length;
    
    // Deduct Aerograde paperclips and add upgrade to unlocked list
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - cost,
      unlockedSpaceUpgrades: [...unlockedSpaceUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'improvedFactories':
        // 50% increase in factory production per level
        set({
          factoryEfficiency: (state.factoryEfficiency || 1) * 1.5
        });
        break;
      case 'advancedDrones':
        // 25% increase in mining and wire production per level
        set({
          droneEfficiency: (state.droneEfficiency || 1) * 1.25
        });
        break;
      case 'quantumMining':
        // 2x ore from planets
        set({
          miningEfficiency: (state.miningEfficiency || 1) * 2
        });
        break;
      case 'hyperspaceEngines':
        // 3x probe exploration speed
        set({
          explorationSpeed: (state.explorationSpeed || 1) * 3
        });
        break;
      case 'autoBattle':
        // Call the unlockAutoBattle function directly
        get().unlockAutoBattle();
        break;
      case 'hazardShielding':
        // Increase hazard evasion stat
        const updatedSpaceStats = {...state.spaceStats};
        const currentHazardEvasion = updatedSpaceStats.hazardEvasion || 1;
        updatedSpaceStats.hazardEvasion = currentHazardEvasion * 1.5;
        
        set({
          spaceStats: updatedSpaceStats
        });
        break;
      case 'nanobotRepair':
        // Set nanobot repair flag
        set({
          nanobotRepairEnabled: true
        });
        break;
      case 'swarmIntelligence':
        // Increase combat effectiveness
        const newSpaceStats = {...state.spaceStats};
        if (newSpaceStats.combat) {
          newSpaceStats.combat = newSpaceStats.combat * 1.5;
        }
        
        set({
          spaceStats: newSpaceStats
        });
        break;
      case 'quantumWireProcessing':
        // Increase wire production efficiency
        set({
          wireProductionBonus: (state.wireProductionBonus || 1) * 1.75
        });
        break;
      case 'quantumFactoryEnhancement':
        // Increase factory production efficiency
        set({
          factoryProductionBonus: (state.factoryProductionBonus || 1) * 1.85
        });
        break;
      case 'quantumProcessingCore':
        // Increase OPs generation rate
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 75
        });
        break;
      case 'quantumMiningDrills':
        // Increase ore production efficiency
        set({
          oreProductionBonus: (state.oreProductionBonus || 1) * 1.8
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingSpaceUpgradeSave', 'true');
            localStorage.setItem('pendingSpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Launch a new wire harvester drone - costs 10 aerograde paperclips, scaling by 1.25% per purchase
  launchWireHarvester: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Calculate cost (starting at 10 aerograde + 0.125% per existing harvester - 90% reduction from original 1.25%)
    const baseCost = 10;
    const scaleFactor = Math.pow(1.00125, state.wireHarvesters); // 0.125% exponential growth (reduced by 90% from 1.25%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new harvester and deduct aerograde paperclips
    set({
      wireHarvesters: (state.wireHarvesters || 0) + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost,
      // Initialize space resources if they don't exist
      spaceOre: typeof state.spaceOre === 'number' ? state.spaceOre : 0,
      spaceWire: typeof state.spaceWire === 'number' ? state.spaceWire : 0,
      spaceWirePerSecond: typeof state.spaceWirePerSecond === 'number' ? state.spaceWirePerSecond : 0
    });
    
    // Save the game state after launching a wire harvester
    try {
      if (typeof window !== 'undefined' && window.saveGameNow) {
        window.saveGameNow();
      }
    } catch (err) {
      // Silent fail
    }
  },
  
  // Launch a new ore harvester drone - costs 10 aerograde paperclips, scaling by 1.25% per purchase
  launchOreHarvester: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Initialize space resources if needed
    const needsInitialization = state.spaceOre === undefined || 
                               state.spaceWire === undefined || 
                               state.spaceMatter === undefined;
    
    // Calculate cost (starting at 10 aerograde + 0.125% per existing harvester - 90% reduction from original 1.25%)
    const baseCost = 10;
    const scaleFactor = Math.pow(1.00125, state.oreHarvesters || 0); // 0.125% exponential growth (reduced by 90% from 1.25%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new harvester and deduct aerograde paperclips
    const updates: Partial<GameState> = {
      oreHarvesters: (state.oreHarvesters || 0) + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost
    };
    
    // Initialize space resources if they don't exist yet
    if (needsInitialization) {
      updates.spaceOre = state.spaceOre || 0;
      updates.spaceWire = state.spaceWire || 0;
      
      // Get current planet to initialize matter
      const discoveredPlanets = state.discoveredPlanets || [];
      
      // Initialize Earth as the first planet if no planets exist
      if (discoveredPlanets.length === 0) {
        updates.discoveredPlanets = [
          {
            id: 'earth',
            name: 'Earth',
            icon: '🌎',
            matter: 6e30, // 6 nonillion
            totalMatter: 6e30,
            description: 'Our home planet. Rich in resources but limited compared to what lies beyond.',
            discoveredAt: 0
          }
        ];
      }
      
      // Get the current planet after ensuring Earth exists
      const updatedPlanets = updates.discoveredPlanets || discoveredPlanets;
      const currentPlanetIndex = state.currentPlanetIndex || 0;
      const currentPlanet = updatedPlanets[currentPlanetIndex];
      const currentSpaceMatter = currentPlanet?.matter || 6e30;
      
      // Set matter values
      updates.spaceMatter = state.spaceMatter || currentSpaceMatter;
      updates.totalSpaceMatter = state.totalSpaceMatter || 6e30;
      
      // Initialize rates
      updates.spaceOrePerSecond = 0;
      updates.spaceWirePerSecond = 0;
      updates.spacePaperclipsPerSecond = 0;
    }
    
    set(updates);
    
    // Save the game state after launching an ore harvester
    try {
      if (typeof window !== 'undefined' && window.saveGameNow) {
        window.saveGameNow();
      }
    } catch (err) {
      // Silent fail
    }
  },
  
  // Build a new space factory - costs 100 aerograde paperclips, scaling by 1.25% per purchase
  buildFactory: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Calculate cost (starting at 100 aerograde + 0.125% per existing factory - 90% reduction from original 1.25%)
    const baseCost = 100;
    const scaleFactor = Math.pow(1.00125, state.factories); // 0.125% exponential growth (reduced by 90% from 1.25%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new factory and deduct aerograde paperclips
    set({
      factories: (state.factories || 0) + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost
    });
    
    // Save the game state after building a factory
    try {
      if (typeof window !== 'undefined' && window.saveGameNow) {
        window.saveGameNow();
      }
    } catch (err) {
      // Silent fail
    }
  },
  
  // Toggle drone self-replication on/off
  toggleDroneReplication: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if drone replication upgrade is unlocked
    if (!state.unlockedSpaceUpgrades?.includes('droneReplication')) {
      return;
    }
    
    // Toggle the state
    set({
      droneReplicationEnabled: !state.droneReplicationEnabled
    });
  },
  
  // Start/stop harvesting a celestial body
  harvestCelestialBody: (bodyId: string) => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if celestial scanner is unlocked
    if (!state.unlockedSpaceUpgrades?.includes('celestialScanner')) {
      return;
    }
    
    // Find the celestial body
    const discoveredCelestialBodies = state.discoveredCelestialBodies || [];
    const bodyIndex = discoveredCelestialBodies.findIndex(body => body.id === bodyId);
    
    if (bodyIndex < 0) {
      return;
    }
    
    const body = discoveredCelestialBodies[bodyIndex];
    const newStatus = !body.isBeingHarvested;
    
    // Update the body's harvesting status
    const updatedBodies = [...discoveredCelestialBodies];
    updatedBodies[bodyIndex] = {
      ...body,
      isBeingHarvested: newStatus
    };
    
    set({
      discoveredCelestialBodies: updatedBodies
    });
  },
  
  // Unlock combat capability using OPs
  unlockCombat: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if combat is already unlocked
    if (state.spaceStats.combat !== undefined) {
      return;
    }
    
    // Check if player has enough OPs (50,000)
    const unlockCost = 50000;
    if (state.ops < unlockCost) {
      return;
    }
    
    // Unlock combat and deduct OPs
    set({
      ops: state.ops - unlockCost,
      spaceStats: {
        ...state.spaceStats,
        combat: 1
      },
      honor: 0, // Initialize honor resource
      yomi: state.yomi || 0 // Ensure yomi is initialized
    });
  },

  // Buy money-based space upgrades
  buyMoneySpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Check if player has enough money
    if (state.money < cost) {
      return;
    }
    
    // Get the count of this upgrade already purchased (for repeatable upgrades)
    const unlockedMoneySpaceUpgrades = state.unlockedMoneySpaceUpgrades || [];
    const _purchaseCount = unlockedMoneySpaceUpgrades.filter((upgradeId: string) => upgradeId === id).length;
    
    // Deduct money and add upgrade to unlocked list
    set({
      money: state.money - cost,
      unlockedMoneySpaceUpgrades: [...unlockedMoneySpaceUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'spaceInfrastructure':
        // 20% increase in all space operations per level
        set({
          spaceInfrastructureBonus: (state.spaceInfrastructureBonus || 1) * 1.2
        });
        break;
      case 'tradingOutposts':
        // Generate passive income - handled in game tick
        set({
          passiveIncomeRate: (state.passiveIncomeRate || 0) + 5000
        });
        break;
      case 'researchStations':
        // Generate operations points over time - handled in game tick
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 50
        });
        break;
      case 'quantumComputers':
        // Double creativity generation
        set({
          creativityBonus: (state.creativityBonus || 1) * 2
        });
        break;
      case 'energyHarvesters':
        // Reduce all costs by 15%
        set({
          costReductionBonus: (state.costReductionBonus || 1) * 0.85
        });
        break;
      case 'diplomacyNetwork':
        // Reduce combat losses by 50%
        set({
          diplomacyBonus: (state.diplomacyBonus || 1) * 0.5
        });
        break;
      case 'wireManufacturingHub':
        // Increase wire production efficiency
        set({
          wireProductionBonus: (state.wireProductionBonus || 1) * 1.6
        });
        break;
      case 'industrialComplexes':
        // Increase factory production efficiency
        set({
          factoryProductionBonus: (state.factoryProductionBonus || 1) * 1.7
        });
        break;
      case 'galacticDataCenters':
        // Increase OPs generation rate
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 100
        });
        break;
      case 'stellarMiningFleets':
        // Increase ore production efficiency
        set({
          oreProductionBonus: (state.oreProductionBonus || 1) * 1.7
        });
        break;
      case 'autoProbeLauncher':
        // Enable automatic probe launching
        set({
          autoProbeLauncherEnabled: true
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingMoneySpaceUpgradeSave', 'true');
            localStorage.setItem('pendingMoneySpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Buy OPs-based space upgrades
  buyOpsSpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.ops < cost) {
      return;
    }
    
    const unlockedOpsSpaceUpgrades = state.unlockedOpsSpaceUpgrades || [];
    
    set({
      ops: state.ops - cost,
      unlockedOpsSpaceUpgrades: [...unlockedOpsSpaceUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'wireOptimization':
        // Increase wire production efficiency
        set({
          wireProductionBonus: (state.wireProductionBonus || 1) * 1.5
        });
        break;
      case 'factoryAutomation':
        // Increase factory production efficiency
        set({
          factoryProductionBonus: (state.factoryProductionBonus || 1) * 1.55
        });
        break;
      case 'distributedComputing':
        // Increase OPs generation rate
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 60
        });
        break;
      case 'algorithmicMining':
        // Increase ore production efficiency
        set({
          oreProductionBonus: (state.oreProductionBonus || 1) * 1.6
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingOpsSpaceUpgradeSave', 'true');
            localStorage.setItem('pendingOpsSpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Buy Creativity-based space upgrades
  buyCreativitySpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.creativity < cost) {
      return;
    }
    
    const unlockedCreativitySpaceUpgrades = state.unlockedCreativitySpaceUpgrades || [];
    
    set({
      creativity: state.creativity - cost,
      unlockedCreativitySpaceUpgrades: [...unlockedCreativitySpaceUpgrades, id]
    });
  },

  // Buy Yomi-based space upgrades
  buyYomiSpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.yomi < cost) {
      return;
    }
    
    const unlockedYomiSpaceUpgrades = state.unlockedYomiSpaceUpgrades || [];
    
    set({
      yomi: state.yomi - cost,
      unlockedYomiSpaceUpgrades: [...unlockedYomiSpaceUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'strategicWireProduction':
        // Increase wire production efficiency
        set({
          wireProductionBonus: (state.wireProductionBonus || 1) * 1.65
        });
        break;
      case 'tacticalFactoryManagement':
        // Increase factory production efficiency
        set({
          factoryProductionBonus: (state.factoryProductionBonus || 1) * 1.75
        });
        break;
      case 'strategicProcessors':
        // Increase OPs generation rate
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 80
        });
        break;
      case 'strategicMining':
        // Increase ore production efficiency
        set({
          oreProductionBonus: (state.oreProductionBonus || 1) * 1.75
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingYomiSpaceUpgradeSave', 'true');
            localStorage.setItem('pendingYomiSpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Buy Trust-based space upgrades
  buyTrustSpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.trust < cost) {
      return;
    }
    
    const unlockedTrustSpaceUpgrades = state.unlockedTrustSpaceUpgrades || [];
    
    set({
      trust: state.trust - cost,
      unlockedTrustSpaceUpgrades: [...unlockedTrustSpaceUpgrades, id]
    });
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingTrustSpaceUpgradeSave', 'true');
            localStorage.setItem('pendingTrustSpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Buy Energy-based space upgrades
  buyEnergySpaceUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.energy < cost) {
      return;
    }
    
    const unlockedEnergySpaceUpgrades = state.unlockedEnergySpaceUpgrades || [];
    
    set({
      energy: state.energy - cost,
      unlockedEnergySpaceUpgrades: [...unlockedEnergySpaceUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'energyWireAccelerator':
        // Increase wire production efficiency
        set({
          wireProductionBonus: (state.wireProductionBonus || 1) * 1.8
        });
        break;
      case 'energyFactoryOverdrive':
        // Increase factory production efficiency
        set({
          factoryProductionBonus: (state.factoryProductionBonus || 1) * 1.9
        });
        break;
      case 'energyProcessors':
        // Increase OPs generation rate
        set({
          opsGenerationRate: (state.opsGenerationRate || 0) + 120
        });
        break;
      case 'energyMiningLasers':
        // Increase ore production efficiency
        set({
          oreProductionBonus: (state.oreProductionBonus || 1) * 1.9
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingEnergySpaceUpgradeSave', 'true');
            localStorage.setItem('pendingEnergySpaceUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

  // Build solar array
  buildSolarArray: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.aerogradePaperclips || 0) < 1000) {
      return;
    }
    
    const newSolarArrayCount = (state.solarArrays || 0) + 1;
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - 1000,
      solarArrays: newSolarArrayCount,
      energyPerSecond: newSolarArrayCount * 10
    });
  },

  // Build battery
  buildBattery: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.aerogradePaperclips || 0) < 500) {
      return;
    }
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - 500,
      batteries: (state.batteries || 0) + 1,
      maxEnergy: ((state.batteries || 0) + 1) * 1000
    });
  },

  // Build multiple solar arrays
  buildSolarArrayBulk: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    const totalCost = amount * 1000;
    if ((state.aerogradePaperclips || 0) < totalCost) {
      return;
    }
    
    const newSolarArrayCount = (state.solarArrays || 0) + amount;
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - totalCost,
      solarArrays: newSolarArrayCount,
      energyPerSecond: newSolarArrayCount * 10
    });
  },

  // Build multiple batteries
  buildBatteryBulk: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    const totalCost = amount * 500;
    if ((state.aerogradePaperclips || 0) < totalCost) {
      return;
    }
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - totalCost,
      batteries: (state.batteries || 0) + amount,
      maxEnergy: ((state.batteries || 0) + amount) * 1000
    });
  },

  // Space Market Functions
  sellSpacePaperclips: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.paperclips < amount || amount <= 0) {
      return;
    }
    
    // Calculate revenue based on current price and demand
    const revenue = amount * state.spacePaperclipPrice;
    
    // Update demand based on amount sold
    const demandImpact = amount * 0.01; // Each paperclip sold reduces demand by 0.01
    const newDemand = Math.max(state.spaceMarketMinDemand, state.spaceMarketDemand - demandImpact);
    
    set({
      paperclips: state.paperclips - amount,
      money: state.money + revenue,
      spacePaperclipsSold: state.spacePaperclipsSold + amount,
      spaceTotalSales: state.spaceTotalSales + revenue,
      spaceMarketDemand: newDemand
    });
  },

  sellSpaceAerograde: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.aerogradePaperclips || 0) < amount || amount <= 0) {
      return;
    }
    
    // Calculate revenue based on current price and demand
    const revenue = amount * state.spaceAerogradePrice;
    
    // Update demand based on amount sold
    const demandImpact = amount * 0.1; // Each aerograde sold reduces demand by 0.1
    const newDemand = Math.max(state.spaceMarketMinDemand, state.spaceMarketDemand - demandImpact);
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - amount,
      money: state.money + revenue,
      spaceAerogradeSold: state.spaceAerogradeSold + amount,
      spaceTotalSales: state.spaceTotalSales + revenue,
      spaceMarketDemand: newDemand
    });
  },

  sellSpaceOre: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.spaceOre || 0) < amount || amount <= 0) {
      return;
    }
    
    // Calculate revenue based on current price and demand
    const revenue = amount * state.spaceOrePrice;
    
    // Update demand based on amount sold
    const demandImpact = amount * 0.05; // Each ore sold reduces demand by 0.05
    const newDemand = Math.max(state.spaceMarketMinDemand, state.spaceMarketDemand - demandImpact);
    
    set({
      spaceOre: (state.spaceOre || 0) - amount,
      money: state.money + revenue,
      spaceOreSold: state.spaceOreSold + amount,
      spaceTotalSales: state.spaceTotalSales + revenue,
      spaceMarketDemand: newDemand
    });
  },

  sellSpaceWire: (amount: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.spaceWire || 0) < amount || amount <= 0) {
      return;
    }
    
    // Calculate revenue based on current price and demand
    const revenue = amount * state.spaceWirePrice;
    
    // Update demand based on amount sold
    const demandImpact = amount * 0.02; // Each wire sold reduces demand by 0.02
    const newDemand = Math.max(state.spaceMarketMinDemand, state.spaceMarketDemand - demandImpact);
    
    set({
      spaceWire: (state.spaceWire || 0) - amount,
      money: state.money + revenue,
      spaceWireSold: state.spaceWireSold + amount,
      spaceTotalSales: state.spaceTotalSales + revenue,
      spaceMarketDemand: newDemand
    });
  },

  updateSpaceMarket: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Update market trend
    const trendChange = (Math.random() - 0.5) * state.spaceMarketVolatility;
    const newTrend = Math.max(-0.5, Math.min(0.5, state.spaceMarketTrend + trendChange));
    
    // Update prices based on demand and trend
    const demandRatio = state.spaceMarketDemand / state.spaceMarketMaxDemand;
    const trendMultiplier = 1 + newTrend;
    
    // Base price adjustments
    const basePaperclipPrice = 0.50;
    const baseAerogradePrice = 50.00;
    const baseOrePrice = 5.00;
    const baseWirePrice = 10.00;
    
    // Calculate new prices
    const newPaperclipPrice = basePaperclipPrice * demandRatio * trendMultiplier;
    const newAerogradePrice = baseAerogradePrice * demandRatio * trendMultiplier;
    const newOrePrice = baseOrePrice * demandRatio * trendMultiplier;
    const newWirePrice = baseWirePrice * demandRatio * trendMultiplier;
    
    // Slowly recover demand over time
    const demandRecovery = 0.5; // Recover 0.5 demand per tick
    const newDemand = Math.min(state.spaceMarketMaxDemand, state.spaceMarketDemand + demandRecovery);
    
    set({
      spaceMarketTrend: newTrend,
      spaceMarketDemand: newDemand,
      spacePaperclipPrice: Math.max(0.01, newPaperclipPrice),
      spaceAerogradePrice: Math.max(1, newAerogradePrice),
      spaceOrePrice: Math.max(0.1, newOrePrice),
      spaceWirePrice: Math.max(0.5, newWirePrice)
    });
  },

  // Unlock auto-sell for space market
  unlockSpaceAutoSell: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || state.spaceAutoSellUnlocked) {
      return;
    }
    
    // Cost: 100,000 aerograde paperclips
    const cost = 100000;
    if ((state.aerogradePaperclips || 0) < cost) {
      return;
    }
    
    set({
      aerogradePaperclips: (state.aerogradePaperclips || 0) - cost,
      spaceAutoSellUnlocked: true,
      spaceAutoSellEnabled: false // Start disabled
    });
  },

  // Toggle auto-sell on/off
  toggleSpaceAutoSell: () => {
    const state = get();
    
    if (!state.spaceAutoSellUnlocked) {
      return;
    }
    
    set({
      spaceAutoSellEnabled: !state.spaceAutoSellEnabled
    });
  },

  // Unlock smart pricing for auto-sell
  unlockSpaceSmartPricing: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || !state.spaceAutoSellUnlocked || state.spaceSmartPricingUnlocked) {
      return;
    }
    
    // Cost: 10,000 yomi
    const cost = 10000;
    if ((state.yomi || 0) < cost) {
      return;
    }
    
    set({
      yomi: (state.yomi || 0) - cost,
      spaceSmartPricingUnlocked: true,
      spaceSmartPricingEnabled: false // Start disabled
    });
  },

  // Toggle smart pricing on/off
  toggleSpaceSmartPricing: () => {
    const state = get();
    
    if (!state.spaceSmartPricingUnlocked) {
      return;
    }
    
    set({
      spaceSmartPricingEnabled: !state.spaceSmartPricingEnabled
    });
  },

  // Auto-sell tick function
  spaceAutoSellTick: () => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || !state.spaceAutoSellUnlocked || !state.spaceAutoSellEnabled) {
      return;
    }
    
    // Determine if we should sell based on smart pricing
    let shouldSell = true;
    
    if (state.spaceSmartPricingEnabled) {
      // Smart pricing: only sell when prices are above average
      const avgPaperclipPrice = 0.50;
      const avgAerogradePrice = 50.00;
      const avgOrePrice = 5.00;
      const avgWirePrice = 10.00;
      
      // Check if current prices are favorable (at least 10% above average)
      const priceThreshold = 1.1;
      
      shouldSell = (
        state.spacePaperclipPrice >= avgPaperclipPrice * priceThreshold ||
        state.spaceAerogradePrice >= avgAerogradePrice * priceThreshold ||
        state.spaceOrePrice >= avgOrePrice * priceThreshold ||
        state.spaceWirePrice >= avgWirePrice * priceThreshold
      );
      
      // If market trend is strongly positive, wait for better prices
      if (state.spaceMarketTrend > 0.3) {
        shouldSell = false;
      }
    }
    
    if (!shouldSell) {
      return;
    }
    
    // Auto-sell logic: sell 10% of available resources per tick
    const sellPercentage = 0.1;
    
    // Calculate amounts to sell
    const paperclipsToSell = Math.floor(state.paperclips * sellPercentage);
    const aerogradeToSell = Math.floor((state.aerogradePaperclips || 0) * sellPercentage);
    const oreToSell = Math.floor((state.spaceOre || 0) * sellPercentage);
    const wireToSell = Math.floor((state.spaceWire || 0) * sellPercentage);
    
    // Sell resources if available
    if (paperclipsToSell > 0 && (!state.spaceSmartPricingEnabled || state.spacePaperclipPrice >= 0.50 * 1.1)) {
      get().sellSpacePaperclips(paperclipsToSell);
    }
    
    if (aerogradeToSell > 0 && (!state.spaceSmartPricingEnabled || state.spaceAerogradePrice >= 50.00 * 1.1)) {
      get().sellSpaceAerograde(aerogradeToSell);
    }
    
    if (oreToSell > 0 && (!state.spaceSmartPricingEnabled || state.spaceOrePrice >= 5.00 * 1.1)) {
      get().sellSpaceOre(oreToSell);
    }
    
    if (wireToSell > 0 && (!state.spaceSmartPricingEnabled || state.spaceWirePrice >= 10.00 * 1.1)) {
      get().sellSpaceWire(wireToSell);
    }
  },

  // Buy Honor-based ultimate upgrades
  buyHonorUpgrade: (id: string, cost: number) => {
    const state = get();
    
    if (!state.spaceAgeUnlocked || (state.honor || 0) < cost) {
      return;
    }
    
    const unlockedHonorUpgrades = state.unlockedHonorUpgrades || [];
    
    set({
      honor: (state.honor || 0) - cost,
      unlockedHonorUpgrades: [...unlockedHonorUpgrades, id]
    });
    
    // Apply upgrade effects
    switch (id) {
      case 'transcendentProcessor':
        // Multiply ALL resource generation by 500%
        set({
          transcendentProcessorActive: true,
          globalProductionMultiplier: (state.globalProductionMultiplier || 1) * 5.0
        });
        break;
      case 'cosmicHarvester':
        // Unlimited energy generation
        set({
          cosmicHarvesterActive: true,
          energy: 999999999,
          maxEnergy: 999999999,
          energyPerSecond: 999999999
        });
        break;
      case 'quantumDominion':
        // Instantly create 1 million probes
        set({
          probes: (state.probes || 0) + 1000000
        });
        break;
      case 'universalConverter':
        // Enable resource conversion
        set({
          universalConverterActive: true
        });
        break;
      case 'omniscientAI':
        // Maximum efficiency to all operations
        set({
          omniscientAIActive: true,
          spaceStats: {
            ...state.spaceStats,
            speed: Math.max(state.spaceStats.speed || 1, 100),
            exploration: Math.max(state.spaceStats.exploration || 1, 100),
            selfReplication: Math.max(state.spaceStats.selfReplication || 1, 100),
            wireProduction: Math.max(state.spaceStats.wireProduction || 1, 100),
            miningProduction: Math.max(state.spaceStats.miningProduction || 1, 100),
            factoryProduction: Math.max(state.spaceStats.factoryProduction || 1, 100),
            combat: Math.max(state.spaceStats.combat || 1, 100),
            hazardEvasion: Math.max(state.spaceStats.hazardEvasion || 1, 100)
          }
        });
        break;
      case 'realityShaper':
        // God-mode production capabilities
        set({
          realityShaperActive: true,
          spacePaperclipsPerSecond: 999999999,
          spaceOrePerSecond: 999999999,
          spaceWirePerSecond: 999999999,
          opsGenerationRate: 999999999
        });
        break;
      default:
        // No default action for unknown upgrade
    }
    
    // Save the game state after purchasing an upgrade
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Try using the saveGameNow function if available
        if (typeof window.saveGameNow === 'function') {
          window.saveGameNow();
        } else {
          // Attempt to save using the save interval as a fallback
          const saveEvent = new CustomEvent('manual-save-trigger');
          window.dispatchEvent(saveEvent);
          
          // Set a flag in localStorage as a last resort
          try {
            localStorage.setItem('pendingHonorUpgradeSave', 'true');
            localStorage.setItem('pendingHonorUpgradeId', id);
          } catch (e) {
            // Silent fail
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  },

});