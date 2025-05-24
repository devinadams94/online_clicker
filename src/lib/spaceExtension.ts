// Space-related extensions for the game store
import type { GameState } from '@/types/game';
import { Planet, CelestialBody, SpaceStats } from '@/types/game';

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

export const addSpaceFunctions = (set: (state: Partial<GameState>) => void, get: () => GameState): GameStoreFunctions => ({
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
    
    // Use aerograde paperclips for probes (5 aerograde = 50,000 regular)
    const probeCost = 5;
    
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
    
    // Skip if space age not unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Skip most processing if no probes
    if (state.probes <= 0) {
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
    }
    
    // Get current planet's matter
    const currentPlanet = discoveredPlanets[currentPlanetIndex];
    const currentSpaceMatter = currentPlanet?.matter || 6e30;
    
    // Initialize space stats if not already done
    if (!state.spaceStats.miningProduction) {
      set({
        spaceStats: {
          ...state.spaceStats,
          miningProduction: 1,
          wireProduction: 1,
          factoryProduction: 1,
          exploration: 1,
          speed: 1,
          selfReplication: 1
        }
      });
    }
    
    // Apply efficiency multipliers from upgrades
    const miningEfficiency = state.miningEfficiency || 1;
    const droneEfficiency = state.droneEfficiency || 1;
    const factoryEfficiency = state.factoryEfficiency || 1;
    const explorationSpeed = state.explorationSpeed || 1;
    
    // Initialize variables for resources
    let wireHarvestersNew = state.wireHarvesters;
    let oreHarvestersNew = state.oreHarvesters;
    let factoriesNew = state.factories;
    
    // Calculate how much ore can be mined (limited by available matter)
    // Base value is 1 ore per drone per second, multiplied by mining production stat and efficiency
    // Ore harvesters were not producing enough ore - increased base production significantly
    const potentialOreMined = state.oreHarvesters * state.spaceStats.miningProduction * 1.0 * miningEfficiency * droneEfficiency;
    const actualOreMined = Math.min(potentialOreMined, currentSpaceMatter);
    
    // Convert ore to wire (1 wire per 1 ore)
    // Base value is 1 wire per drone per second, multiplied by wire production stat and efficiency
    // Wire harvesters were not producing enough wire - increased base production
    const potentialWireProduced = state.wireHarvesters * state.spaceStats.wireProduction * 1.0 * droneEfficiency;
    // Initialize spaceOre if it doesn't exist
    const currentOre = typeof state.spaceOre === 'number' ? state.spaceOre : 0;
    const availableOre = currentOre + actualOreMined;
    const actualWireProduced = Math.min(potentialWireProduced, availableOre);
    const oreConsumed = actualWireProduced;
    
    // Produce Aerograde paperclips from wire (1 paperclip per wire)
    // Initialize spaceWire if it doesn't exist
    const currentWire = typeof state.spaceWire === 'number' ? state.spaceWire : 0;
    const availableWire = currentWire + actualWireProduced;
    
    // Base value is 1 paperclip per factory per second, modified by factory production stat and efficiency
    const potentialPaperclipsProduced = state.factories * state.spaceStats.factoryProduction * 1.0 * factoryEfficiency;
    // Each wire makes 1 paperclip
    const maxPaperclipsFromWire = availableWire;
    const actualPaperclipsProduced = Math.min(potentialPaperclipsProduced, maxPaperclipsFromWire);
    // Wire consumed equals paperclips produced (1:1 ratio)
    const wireConsumed = actualPaperclipsProduced;
    
    // Probe self-replication - create new probes based on self-replication stat
    // Use statistical approach instead of looping through each probe for better performance
    let newProbes = 0;
    // Greatly reduced replication chance - was 0.005, now 0.0001 (50x slower)
    const replicationChance = Math.min(0.001, state.spaceStats.selfReplication * 0.0001); // Cap at 0.1% per tick
    
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
    // Reduced from 0.0005 to 0.00001 (50x slower)
    newProbes += Math.floor(state.probes * state.spaceStats.selfReplication * 0.00001);
    
    // Calculate exploration rate based on probes, speed and exploration stats, with exploration speed multiplier
    const explorationRate = 
      (state.probes * state.spaceStats.speed * state.spaceStats.exploration * 0.0000000000001) * 
      (1 + Math.log10(Math.max(1, state.probes))) * explorationSpeed;
    
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
    
    // Only update state if something actually changed
    const updates: Partial<GameState> = {};
    
    // Update probes if changed
    if (newProbes > 0) {
      updates.probes = state.probes + newProbes;
    }
    
    // Update harvesters if changed
    if (newWireHarvesters !== wireHarvestersNew) {
      updates.wireHarvesters = newWireHarvesters;
    }
    if (newOreHarvesters !== oreHarvestersNew) {
      updates.oreHarvesters = newOreHarvesters;
    }
    
    // Update resources if changed
    if (actualOreMined > 0) {
      updates.spaceMatter = currentSpaceMatter - actualOreMined;
      updates.spaceOre = Math.max(0, availableOre - oreConsumed);
      updates.spaceOrePerSecond = actualOreMined;
    }
    if (actualWireProduced > 0) {
      updates.spaceWire = Math.max(0, availableWire - wireConsumed);
      updates.spaceWirePerSecond = actualWireProduced;
    }
    if (actualPaperclipsProduced > 0) {
      updates.spacePaperclipsPerSecond = actualPaperclipsProduced;
      updates.paperclips = state.paperclips + actualPaperclipsProduced;
      updates.aerogradePaperclips = (state.aerogradePaperclips || 0) + actualPaperclipsProduced - 
        (resourcesHarvested && state.droneReplicationEnabled ? 
          ((newWireHarvesters - wireHarvestersNew) + (newOreHarvesters - oreHarvestersNew)) * (state.droneReplicationCostPerDrone || 1000) : 0);
    }
    
    // Update planets/bodies only if changed
    if (updatedPlanets.length !== discoveredPlanets.length || currentPlanet?.matter !== currentSpaceMatter) {
      updates.discoveredPlanets = updatedPlanets;
    }
    if (updatedCelestialBodies.length !== (state.discoveredCelestialBodies || []).length) {
      updates.discoveredCelestialBodies = updatedCelestialBodies;
    }
    
    // Update exploration if changed
    if (newUniverseExplored !== state.universeExplored) {
      updates.universeExplored = newUniverseExplored;
    }
    
    // Only call set if there are actual updates
    if (Object.keys(updates).length > 0) {
      set(updates);
    }
  },
  
  // Update space age upgrade stat function to use yomi instead of trust
  upgradeStat: (stat: string, cost: number) => {
    const state = get();
    
    // Check if player has enough yomi
    if (state.yomi < cost) {
      return;
    }
    
    // Check if stat exists
    if (state.spaceStats[stat] === undefined) {
      return;
    }
    
    // Make a new copy of spaceStats to ensure the update triggers correctly
    const updatedSpaceStats = {...state.spaceStats};
    updatedSpaceStats[stat] = (updatedSpaceStats[stat] || 0) + 1;
    
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
  
  // Add honor resource from combat victories and track battles won
  addHonor: (amount: number) => {
    const state = get();
    set({
      honor: (state.honor || 0) + amount,
      battlesWon: (state.battlesWon || 0) + 1, // Increment battles won counter
      // Update battle difficulty multiplier
      battleDifficulty: 1 + (Math.log10(Math.max(1, state.battlesWon || 0) + 1) * 0.3)
    });
  },
  
  // Toggle auto-battle on/off
  toggleAutoBattle: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      console.log("Space age not unlocked yet");
      return;
    }
    
    // Check if auto-battle is unlocked
    if (!state.autoBattleUnlocked) {
      console.log("Auto-battle not unlocked yet");
      return;
    }
    
    console.log(`${state.autoBattleEnabled ? 'Disabling' : 'Enabling'} auto-battle`);
    
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
      console.log("Space age not unlocked yet");
      return;
    }
    
    // Check if combat is unlocked
    if (state.spaceStats.combat === undefined) {
      console.log("Combat capability not unlocked yet");
      return;
    }
    
    // Check if auto-battle is already unlocked
    if (state.autoBattleUnlocked) {
      console.log("Auto-battle already unlocked");
      return;
    }
    
    // Auto-battle costs 10,000 yomi
    const unlockCost = 10000;
    if (state.yomi < unlockCost) {
      console.log(`Not enough yomi to unlock auto-battle (need ${unlockCost})`);
      return;
    }
    
    console.log(`Unlocking auto-battle for ${unlockCost} yomi`);
    
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
    const purchaseCount = unlockedSpaceUpgrades.filter((upgradeId: string) => upgradeId === id).length;
    
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
    
    // Calculate cost (starting at 10 aerograde + 1.25% per existing harvester)
    const baseCost = 10;
    const scaleFactor = Math.pow(1.0125, state.wireHarvesters); // 1.25% exponential growth (reduced from 5%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new harvester and deduct aerograde paperclips
    set({
      wireHarvesters: state.wireHarvesters + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost
    });
  },
  
  // Launch a new ore harvester drone - costs 10 aerograde paperclips, scaling by 1.25% per purchase
  launchOreHarvester: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Calculate cost (starting at 10 aerograde + 1.25% per existing harvester)
    const baseCost = 10;
    const scaleFactor = Math.pow(1.0125, state.oreHarvesters); // 1.25% exponential growth (reduced from 5%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new harvester and deduct aerograde paperclips
    set({
      oreHarvesters: state.oreHarvesters + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost
    });
  },
  
  // Build a new space factory - costs 100 aerograde paperclips, scaling by 1.25% per purchase
  buildFactory: () => {
    const state = get();
    
    // Check if space age is unlocked
    if (!state.spaceAgeUnlocked) {
      return;
    }
    
    // Calculate cost (starting at 100 aerograde + 1.25% per existing factory)
    const baseCost = 100;
    const scaleFactor = Math.pow(1.0125, state.factories); // 1.25% exponential growth (reduced from 5%)
    const currentCost = Math.floor(baseCost * scaleFactor);
    
    if ((state.aerogradePaperclips || 0) < currentCost) {
      return;
    }
    
    // Create new factory and deduct aerograde paperclips
    set({
      factories: state.factories + 1,
      aerogradePaperclips: (state.aerogradePaperclips || 0) - currentCost
    });
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
      honor: 0 // Initialize honor resource
    });
  }
});