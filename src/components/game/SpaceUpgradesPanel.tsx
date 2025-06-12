"use client";

import { useState } from "react";
import useGameStore from "@/lib/gameStore";

export default function SpaceUpgradesPanel() {
  const {
    spaceAgeUnlocked,
    spacePaperclipsPerSecond,
    aerogradePaperclips,
    money,
    creativity,
    yomi,
    trust,
    ops,
    energy,
    honor,
    maxEnergy,
    energyPerSecond,
    solarArrays,
    batteries,
    buySpaceUpgrade,
    buyMoneySpaceUpgrade,
    buyOpsSpaceUpgrade,
    buyCreativitySpaceUpgrade,
    buyYomiSpaceUpgrade,
    buyTrustSpaceUpgrade,
    buyEnergySpaceUpgrade,
    buildSolarArray,
    buildBattery,
    buildSolarArrayBulk,
    buildBatteryBulk,
    unlockedSpaceUpgrades,
    unlockedMoneySpaceUpgrades,
    unlockedOpsSpaceUpgrades,
    unlockedCreativitySpaceUpgrades,
    unlockedYomiSpaceUpgrades,
    unlockedTrustSpaceUpgrades,
    unlockedEnergySpaceUpgrades,
    unlockedHonorUpgrades,
    buyHonorUpgrade
  } = useGameStore();
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Space upgrade definitions (costs increased by 500% - 6x multiplier)
  const upgradeDefinitions = [
    {
      id: 'autoBattle',
      name: 'Automated Combat System',
      description: 'Enables auto-battle functionality to automatically engage enemy ships every 10 seconds',
      cost: 60000, // 10,000 * 6
      effect: 'autoBattle',
      effectValue: true,
      icon: '⚔️',
      repeatable: false
    },
    {
      id: 'improvedFactories',
      name: 'Improved Factories',
      description: 'Increases Aerograde Paperclip production by 50%',
      cost: 600000, // 100,000 * 6
      effect: 'factoryEfficiency',
      effectValue: 1.5,
      icon: '🏭',
      repeatable: true, // Made repeatable
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5 // Cost increases by 2.5x each purchase
    },
    {
      id: 'advancedDrones',
      name: 'Advanced Drones',
      description: 'Increases mining and wire production by 25%',
      cost: 1500000, // 250,000 * 6
      effect: 'droneEfficiency',
      effectValue: 1.25,
      icon: '🤖',
      repeatable: true, // Made repeatable
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0 // Cost increases by 2x each purchase
    },
    {
      id: 'quantumMining',
      name: 'Quantum Mining',
      description: 'Allows ore harvesters to extract 2x matter from planets',
      cost: 3000000, // 500,000 * 6
      effect: 'miningEfficiency',
      effectValue: 2.0,
      icon: '⚛️',
      repeatable: false
    },
    {
      id: 'hyperspaceEngines',
      name: 'Hyperspace Engines',
      description: 'Increases probe exploration speed by 300%',
      cost: 6000000, // 1,000,000 * 6
      effect: 'explorationSpeed',
      effectValue: 3.0,
      icon: '🌠',
      repeatable: false
    },
    {
      id: 'droneReplication',
      name: 'Drone Self-Replication',
      description: 'Harvester drones can self-replicate using Aerograde Paperclips when resources are found on celestial bodies',
      cost: 30000000, // 5,000,000 * 6
      effect: 'droneReplication',
      effectValue: true,
      icon: '🧬',
      repeatable: false
    },
    {
      id: 'celestialScanner',
      name: 'Celestial Body Scanner',
      description: 'Improves probe ability to detect asteroids and minor celestial bodies while exploring',
      cost: 18000000, // 3,000,000 * 6
      effect: 'celestialScanner',
      effectValue: true,
      icon: '🔭',
      repeatable: false
    },
    {
      id: 'resourceExtractor',
      name: 'Advanced Resource Extractor',
      description: 'Improves resource extraction from asteroids by 200%',
      cost: 45000000, // 7,500,000 * 6
      effect: 'resourceExtraction',
      effectValue: 3.0,
      icon: '⛏️',
      repeatable: false
    },
    {
      id: 'hazardShielding',
      name: 'Hazard Shielding',
      description: 'Reduces probe crash rate and improves survivability in space combat',
      cost: 12000000, // 2,000,000 * 6
      effect: 'hazardShielding',
      effectValue: 1.5,
      icon: '🛡️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0 // Cost increases by 2x each purchase
    },
    {
      id: 'nanobotRepair',
      name: 'Nanobot Repair Systems',
      description: 'Self-repairing probes have a chance to avoid destruction in combat',
      cost: 24000000, // 4,000,000 * 6
      effect: 'nanobotRepair',
      effectValue: true,
      icon: '🔧',
      repeatable: false
    },
    {
      id: 'swarmIntelligence',
      name: 'Swarm Intelligence',
      description: 'Improves probe coordination in combat, increasing effectiveness',
      cost: 36000000, // 6,000,000 * 6
      effect: 'swarmIntelligence',
      effectValue: 2.0,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2 // Cost increases by 2.2x each purchase
    },
    {
      id: 'quantumWireProcessing',
      name: 'Quantum Wire Processing',
      description: 'Quantum entanglement accelerates wire production by 75%',
      cost: 18000000, // 3,000,000 * 6
      effect: 'wireProductionBonus',
      effectValue: 1.75,
      icon: '🔗',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'quantumFactoryEnhancement',
      name: 'Quantum Factory Enhancement',
      description: 'Quantum mechanics accelerate factory production by 85%',
      cost: 24000000, // 4,000,000 * 6
      effect: 'factoryProductionBonus',
      effectValue: 1.85,
      icon: '🏭',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'quantumProcessingCore',
      name: 'Quantum Processing Core',
      description: 'Advanced quantum processors boost operations generation by 75 OPs/sec',
      cost: 30000000, // 5,000,000 * 6
      effect: 'opsGenerationBonus',
      effectValue: 75,
      icon: '⚙️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'quantumMiningDrills',
      name: 'Quantum Mining Drills',
      description: 'Quantum-enhanced drilling technology increases ore extraction by 80%',
      cost: 36000000, // 6,000,000 * 6
      effect: 'oreProductionBonus',
      effectValue: 1.8,
      icon: '⛏️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    }
  ];

  // Money-based space upgrade definitions
  const moneyUpgradeDefinitions = [
    {
      id: 'spaceInfrastructure',
      name: 'Space Infrastructure',
      description: 'Build orbital platforms to boost all space operations by 20%',
      cost: 3000000, // 500,000 * 6
      effect: 'spaceInfrastructure',
      effectValue: 1.2,
      icon: '🛰️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'tradingOutposts',
      name: 'Galactic Trading Outposts',
      description: 'Establish trading posts across the galaxy to generate passive income',
      cost: 1500000, // 250,000 * 6
      effect: 'passiveIncome',
      effectValue: 5000,
      icon: '🏪',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 3.0
    },
    {
      id: 'researchStations',
      name: 'Deep Space Research Stations',
      description: 'Advanced research facilities that generate operations points over time',
      cost: 4500000, // 750,000 * 6
      effect: 'opsGeneration',
      effectValue: 50,
      icon: '🔬',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'quantumComputers',
      name: 'Quantum Computing Arrays',
      description: 'Massive quantum computers that boost creativity generation by 100%',
      cost: 6000000, // 1,000,000 * 6
      effect: 'creativityBoost',
      effectValue: 2.0,
      icon: '💻',
      repeatable: false
    },
    {
      id: 'energyHarvesters',
      name: 'Stellar Energy Harvesters',
      description: 'Harvest energy from stars to power all operations, reducing all costs by 15%',
      cost: 12000000, // 2,000,000 * 6
      effect: 'costReduction',
      effectValue: 0.85,
      icon: '⭐',
      repeatable: false
    },
    {
      id: 'diplomacyNetwork',
      name: 'Intergalactic Diplomacy Network',
      description: 'Peaceful relations with alien civilizations reduce combat losses by 50%',
      cost: 9000000, // 1,500,000 * 6
      effect: 'diplomacy',
      effectValue: 0.5,
      icon: '🤝',
      repeatable: false
    },
    {
      id: 'wireManufacturingHub',
      name: 'Galactic Wire Manufacturing Hub',
      description: 'Massive space-based wire production facilities increase wire output by 60%',
      cost: 7500000, // 1,250,000 * 6
      effect: 'wireProductionBonus',
      effectValue: 1.6,
      icon: '🏗️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.3
    },
    {
      id: 'industrialComplexes',
      name: 'Mega Industrial Complexes',
      description: 'Massive factory complexes boost production efficiency by 70%',
      cost: 9000000, // 1,500,000 * 6
      effect: 'factoryProductionBonus',
      effectValue: 1.7,
      icon: '🏢',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.4
    },
    {
      id: 'galacticDataCenters',
      name: 'Galactic Data Centers',
      description: 'Massive computational arrays generate 100 OPs/sec across the galaxy',
      cost: 12000000, // 2,000,000 * 6
      effect: 'opsGenerationBonus',
      effectValue: 100,
      icon: '🖥️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'stellarMiningFleets',
      name: 'Stellar Mining Fleets',
      description: 'Massive space-based mining operations increase ore extraction by 70%',
      cost: 15000000, // 2,500,000 * 6
      effect: 'oreProductionBonus',
      effectValue: 1.7,
      icon: '🚀',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.4
    },
    {
      id: 'autoProbeLauncher',
      name: 'Autonomous Probe Launcher',
      description: 'Automatically launches probes when sufficient aerograde paperclips are available',
      cost: 100000000000, // 100 billion dollars
      effect: 'autoProbeLauncher',
      effectValue: true,
      icon: '🤖',
      repeatable: false
    }
  ];

  // OPs-based space upgrade definitions
  const opsUpgradeDefinitions = [
    {
      id: 'computationalMatrix',
      name: 'Computational Matrix',
      description: 'Advanced computing arrays that boost all probe efficiency by 30%',
      cost: 30000, // 5,000 * 6
      effect: 'probeEfficiency',
      effectValue: 1.3,
      icon: '🔢',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'dataCompression',
      name: 'Data Compression Algorithms',
      description: 'Compress probe data transmission, increasing exploration speed by 25%',
      cost: 18000, // 3,000 * 6
      effect: 'dataCompression',
      effectValue: 1.25,
      icon: '💾',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.8
    },
    {
      id: 'autonomousRepair',
      name: 'Autonomous Repair Systems',
      description: 'Self-repairing probes reduce maintenance costs and improve durability',
      cost: 48000, // 8,000 * 6
      effect: 'autonomousRepair',
      effectValue: true,
      icon: '🔧',
      repeatable: false
    },
    {
      id: 'quantumEntanglement',
      name: 'Quantum Entanglement Network',
      description: 'Instantaneous communication between probes increases coordination by 200%',
      cost: 90000, // 15,000 * 6
      effect: 'quantumNetwork',
      effectValue: 3.0,
      icon: '⚛️',
      repeatable: false
    },
    {
      id: 'predictionEngine',
      name: 'Predictive Analytics Engine',
      description: 'AI predicts optimal resource locations, boosting mining efficiency by 40%',
      cost: 60000, // 10,000 * 6
      effect: 'predictiveAnalytics',
      effectValue: 1.4,
      icon: '🔮',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'distributedProcessing',
      name: 'Distributed Processing Network',
      description: 'Spread computations across all probes, increasing processing power by 50%',
      cost: 72000, // 12,000 * 6
      effect: 'distributedProcessing',
      effectValue: 1.5,
      icon: '🌐',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'adaptiveAlgorithms',
      name: 'Adaptive Learning Algorithms',
      description: 'Probes learn from experience, improving all operations by 20% per level',
      cost: 42000, // 7,000 * 6
      effect: 'adaptiveLearning',
      effectValue: 1.2,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.9
    },
    {
      id: 'errorCorrection',
      name: 'Quantum Error Correction',
      description: 'Eliminate computational errors, increasing all probe accuracy by 35%',
      cost: 120000, // 20,000 * 6
      effect: 'errorCorrection',
      effectValue: 1.35,
      icon: '✅',
      repeatable: false
    },
    {
      id: 'parallelExecution',
      name: 'Parallel Execution Framework',
      description: 'Execute multiple tasks simultaneously, doubling operational speed',
      cost: 150000, // 25,000 * 6
      effect: 'parallelExecution',
      effectValue: 2.0,
      icon: '⚡',
      repeatable: false
    },
    {
      id: 'memoryOptimization',
      name: 'Memory Optimization Protocols',
      description: 'Optimize probe memory usage, allowing 60% more data storage',
      cost: 36000, // 6,000 * 6
      effect: 'memoryOptimization',
      effectValue: 1.6,
      icon: '🧮',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'wireOptimization',
      name: 'Wire Production Optimization',
      description: 'Advanced algorithms optimize wire production processes, increasing efficiency by 50%',
      cost: 54000, // 9,000 * 6
      effect: 'wireProductionBonus',
      effectValue: 1.5,
      icon: '⚙️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'factoryAutomation',
      name: 'Advanced Factory Automation',
      description: 'Sophisticated AI systems optimize factory operations, increasing efficiency by 55%',
      cost: 66000, // 11,000 * 6
      effect: 'factoryProductionBonus',
      effectValue: 1.55,
      icon: '🤖',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'distributedComputing',
      name: 'Distributed Computing Network',
      description: 'Spread computation across space infrastructure, generating 60 OPs/sec',
      cost: 48000, // 8,000 * 6
      effect: 'opsGenerationBonus',
      effectValue: 60,
      icon: '🌐',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'algorithmicMining',
      name: 'Algorithmic Mining Systems',
      description: 'AI-powered mining algorithms optimize extraction, boosting ore production by 60%',
      cost: 54000, // 9,000 * 6
      effect: 'oreProductionBonus',
      effectValue: 1.6,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    }
  ];

  // Creativity-based space upgrade definitions
  const creativityUpgradeDefinitions = [
    {
      id: 'artisticProbes',
      name: 'Artistic Probe Designs',
      description: 'Beautiful probe aesthetics improve alien relations and reduce hostility by 25%',
      cost: 2000,
      effect: 'artisticDesign',
      effectValue: 0.75,
      icon: '🎨',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.7
    },
    {
      id: 'innovativeNavigation',
      name: 'Innovative Navigation Systems',
      description: 'Creative pathfinding algorithms increase exploration efficiency by 40%',
      cost: 3500,
      effect: 'innovativeNavigation',
      effectValue: 1.4,
      icon: '🧭',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.9
    },
    {
      id: 'adaptableArchitecture',
      name: 'Adaptable Probe Architecture',
      description: 'Modular designs allow probes to reconfigure for different tasks',
      cost: 5000,
      effect: 'adaptableArchitecture',
      effectValue: true,
      icon: '🔄',
      repeatable: false
    },
    {
      id: 'emergentBehaviors',
      name: 'Emergent Behavior Patterns',
      description: 'Probes develop unexpected abilities, improving all stats by 15%',
      cost: 8000,
      effect: 'emergentBehaviors',
      effectValue: 1.15,
      icon: '🌟',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.3
    },
    {
      id: 'culturalAnalysis',
      name: 'Cultural Analysis Protocols',
      description: 'Understanding alien cultures improves diplomatic success by 50%',
      cost: 4000,
      effect: 'culturalAnalysis',
      effectValue: 1.5,
      icon: '🏛️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'biomimicry',
      name: 'Biomimetic Engineering',
      description: 'Copy nature\'s designs to improve probe survival by 30%',
      cost: 6000,
      effect: 'biomimicry',
      effectValue: 1.3,
      icon: '🦋',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.8
    },
    {
      id: 'abstractThinking',
      name: 'Abstract Thinking Modules',
      description: 'Enable probes to solve complex problems through creative reasoning',
      cost: 10000,
      effect: 'abstractThinking',
      effectValue: true,
      icon: '💭',
      repeatable: false
    },
    {
      id: 'artisticCommunication',
      name: 'Artistic Communication',
      description: 'Express ideas through art, improving inter-species communication by 75%',
      cost: 7000,
      effect: 'artisticCommunication',
      effectValue: 1.75,
      icon: '🎭',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'inspirationalDesign',
      name: 'Inspirational Design Patterns',
      description: 'Inspiring designs motivate other probes, boosting team efficiency by 20%',
      cost: 5500,
      effect: 'inspirationalDesign',
      effectValue: 1.2,
      icon: '✨',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.6
    },
    {
      id: 'creativeProduction',
      name: 'Creative Production Methods',
      description: 'Innovative manufacturing techniques increase production speed by 45%',
      cost: 9000,
      effect: 'creativeProduction',
      effectValue: 1.45,
      icon: '🏭',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.4
    }
  ];

  // Yomi-based space upgrade definitions
  const yomiUpgradeDefinitions = [
    {
      id: 'strategicPlanning',
      name: 'Strategic Planning Algorithms',
      description: 'Long-term planning improves resource allocation efficiency by 35%',
      cost: 6000, // 1,000 * 6
      effect: 'strategicPlanning',
      effectValue: 1.35,
      icon: '📋',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.8
    },
    {
      id: 'tacticalCombat',
      name: 'Advanced Tactical Combat',
      description: 'Superior battle tactics increase combat effectiveness by 50%',
      cost: 15000, // 2,500 * 6
      effect: 'tacticalCombat',
      effectValue: 1.5,
      icon: '⚔️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'riskAssessment',
      name: 'Risk Assessment Protocols',
      description: 'Better risk evaluation reduces probe losses by 40%',
      cost: 9000, // 1,500 * 6
      effect: 'riskAssessment',
      effectValue: 0.6,
      icon: '⚠️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.7
    },
    {
      id: 'gameTheory',
      name: 'Game Theory Applications',
      description: 'Apply game theory to optimize probe interactions and negotiations',
      cost: 30000, // 5,000 * 6
      effect: 'gameTheory',
      effectValue: true,
      icon: '🎲',
      repeatable: false
    },
    {
      id: 'coordinatedStrikes',
      name: 'Coordinated Strike Patterns',
      description: 'Synchronized attacks increase combat damage by 60%',
      cost: 18000, // 3,000 * 6
      effect: 'coordinatedStrikes',
      effectValue: 1.6,
      icon: '🎯',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'adaptiveStrategy',
      name: 'Adaptive Strategy Engine',
      description: 'Continuously adjust strategies based on enemy patterns',
      cost: 45000, // 7,500 * 6
      effect: 'adaptiveStrategy',
      effectValue: true,
      icon: '🧩',
      repeatable: false
    },
    {
      id: 'predictiveModeling',
      name: 'Predictive Modeling Systems',
      description: 'Predict enemy movements, improving defensive capabilities by 45%',
      cost: 24000, // 4,000 * 6
      effect: 'predictiveModeling',
      effectValue: 1.45,
      icon: '🔍',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.9
    },
    {
      id: 'resourceOptimization',
      name: 'Resource Optimization Strategies',
      description: 'Optimize resource usage, reducing all costs by 20%',
      cost: 36000, // 6,000 * 6
      effect: 'resourceOptimization',
      effectValue: 0.8,
      icon: '💎',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'psychologicalWarfare',
      name: 'Psychological Warfare Tactics',
      description: 'Demoralize enemies, reducing their effectiveness by 30%',
      cost: 48000, // 8,000 * 6
      effect: 'psychologicalWarfare',
      effectValue: 0.7,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.3
    },
    {
      id: 'masterStrategy',
      name: 'Master Strategy Framework',
      description: 'Ultimate strategic planning, improving all operations by 25%',
      cost: 60000, // 10,000 * 6
      effect: 'masterStrategy',
      effectValue: 1.25,
      icon: '👑',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'strategicWireProduction',
      name: 'Strategic Wire Production',
      description: 'Strategic planning optimizes wire harvester deployment, boosting production by 65%',
      cost: 42000, // 7,000 * 6
      effect: 'wireProductionBonus',
      effectValue: 1.65,
      icon: '📊',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'tacticalFactoryManagement',
      name: 'Tactical Factory Management',
      description: 'Strategic oversight optimizes factory workflows, boosting production by 75%',
      cost: 48000, // 8,000 * 6
      effect: 'factoryProductionBonus',
      effectValue: 1.75,
      icon: '📈',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'strategicProcessors',
      name: 'Strategic Processing Units',
      description: 'Tactical decision-making processors generate 80 OPs/sec',
      cost: 54000, // 9,000 * 6
      effect: 'opsGenerationBonus',
      effectValue: 80,
      icon: '🧠',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.1
    },
    {
      id: 'strategicMining',
      name: 'Strategic Mining Operations',
      description: 'Tactical mining deployments increase ore extraction efficiency by 75%',
      cost: 60000, // 10,000 * 6
      effect: 'oreProductionBonus',
      effectValue: 1.75,
      icon: '📊',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    }
  ];

  // Trust-based space upgrade definitions
  const trustUpgradeDefinitions = [
    {
      id: 'diplomaticProtocols',
      name: 'Diplomatic Protocols',
      description: 'Establish peaceful contact with alien civilizations',
      cost: 5,
      effect: 'diplomaticProtocols',
      effectValue: true,
      icon: '🤝',
      repeatable: false
    },
    {
      id: 'allianceNetwork',
      name: 'Galactic Alliance Network',
      description: 'Form alliances that provide 10% bonus to all space operations',
      cost: 10,
      effect: 'allianceNetwork',
      effectValue: 1.1,
      icon: '🌌',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.5
    },
    {
      id: 'tradingRights',
      name: 'Interstellar Trading Rights',
      description: 'Gain access to alien markets, increasing income by 25%',
      cost: 8,
      effect: 'tradingRights',
      effectValue: 1.25,
      icon: '💰',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.6
    },
    {
      id: 'peaceKeeping',
      name: 'Peacekeeping Operations',
      description: 'Maintain galactic peace, reducing conflict by 50%',
      cost: 15,
      effect: 'peaceKeeping',
      effectValue: 0.5,
      icon: '☮️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.8
    },
    {
      id: 'culturalExchange',
      name: 'Cultural Exchange Programs',
      description: 'Learn from alien cultures, gaining new technologies and improving creativity generation by 30%',
      cost: 12,
      effect: 'culturalExchange',
      effectValue: 1.3,
      icon: '🌍',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 1.7
    },
    {
      id: 'refugeeAssistance',
      name: 'Refugee Assistance Programs',
      description: 'Help displaced alien populations, gaining their gratitude and assistance',
      cost: 20,
      effect: 'refugeeAssistance',
      effectValue: true,
      icon: '🏠',
      repeatable: false
    },
    {
      id: 'knowledgeSharing',
      name: 'Knowledge Sharing Initiative',
      description: 'Share scientific knowledge with aliens, improving research speed by 40%',
      cost: 18,
      effect: 'knowledgeSharing',
      effectValue: 1.4,
      icon: '📚',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'universalTranslator',
      name: 'Universal Translation Matrix',
      description: 'Perfect communication with all alien species',
      cost: 25,
      effect: 'universalTranslator',
      effectValue: true,
      icon: '🗣️',
      repeatable: false
    },
    {
      id: 'galacticCouncil',
      name: 'Galactic Council Membership',
      description: 'Join the galactic government, gaining influence and 20% efficiency bonus',
      cost: 30,
      effect: 'galacticCouncil',
      effectValue: 1.2,
      icon: '🏛️',
      repeatable: false
    },
    {
      id: 'peacefulExpansion',
      name: 'Peaceful Expansion Doctrine',
      description: 'Expand through cooperation instead of conquest, doubling exploration efficiency',
      cost: 35,
      effect: 'peacefulExpansion',
      effectValue: 2.0,
      icon: '🕊️',
      repeatable: false
    }
  ];

  // Energy-based space upgrade definitions
  const energyUpgradeDefinitions = [
    {
      id: 'powerAmplifiers',
      name: 'Power Amplification Arrays',
      description: 'Boost all drone and factory efficiency by 50% using concentrated energy',
      cost: 30000, // 5,000 * 6
      effect: 'powerAmplification',
      effectValue: 1.5,
      icon: '⚡',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.2
    },
    {
      id: 'energyShields',
      name: 'Energy Shield Generators',
      description: 'Protect probes with energy shields, reducing losses by 60%',
      cost: 48000, // 8,000 * 6
      effect: 'energyShields',
      effectValue: 0.4,
      icon: '🛡️',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.0
    },
    {
      id: 'warpDrives',
      name: 'Warp Drive Systems',
      description: 'Enable faster-than-light travel, tripling exploration speed',
      cost: 90000, // 15,000 * 6
      effect: 'warpDrives',
      effectValue: 3.0,
      icon: '🌌',
      repeatable: false
    },
    {
      id: 'energyWeapons',
      name: 'High-Energy Weapon Systems',
      description: 'Devastate enemies with energy weapons, increasing combat power by 200%',
      cost: 72000, // 12,000 * 6
      effect: 'energyWeapons',
      effectValue: 3.0,
      icon: '🔥',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'matterCompilers',
      name: 'Energy-Matter Compilers',
      description: 'Convert energy directly to paperclips, bypassing resource chains',
      cost: 120000, // 20,000 * 6
      effect: 'matterCompilers',
      effectValue: true,
      icon: '🔬',
      repeatable: false
    },
    {
      id: 'forceFields',
      name: 'Gravitational Force Fields',
      description: 'Manipulate gravity to improve mining efficiency by 100%',
      cost: 60000, // 10,000 * 6
      effect: 'forceFields',
      effectValue: 2.0,
      icon: '🌀',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.3
    },
    {
      id: 'quantumProcessors',
      name: 'Quantum Energy Processors',
      description: 'Process information at quantum speeds, boosting all operations by 75%',
      cost: 150000, // 25,000 * 6
      effect: 'quantumProcessors',
      effectValue: 1.75,
      icon: '💎',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.8
    },
    {
      id: 'energyTeleporters',
      name: 'Energy Teleportation Grid',
      description: 'Instantly transport resources across space, eliminating distance delays',
      cost: 180000, // 30,000 * 6
      effect: 'energyTeleporters',
      effectValue: true,
      icon: '🌐',
      repeatable: false
    },
    {
      id: 'stellarEngines',
      name: 'Stellar Energy Engines',
      description: 'Harness star power directly, increasing all energy generation by 300%',
      cost: 240000, // 40,000 * 6
      effect: 'stellarEngines',
      effectValue: 4.0,
      icon: '⭐',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 3.0
    },
    {
      id: 'dimensionalGenerators',
      name: 'Dimensional Energy Generators',
      description: 'Tap into parallel dimensions for unlimited energy production',
      cost: 300000, // 50,000 * 6
      effect: 'dimensionalGenerators',
      effectValue: true,
      icon: '🌈',
      repeatable: false
    },
    {
      id: 'energyWireAccelerator',
      name: 'Energy-Powered Wire Accelerator',
      description: 'High-energy systems dramatically increase wire production speed by 80%',
      cost: 210000, // 35,000 * 6
      effect: 'wireProductionBonus',
      effectValue: 1.8,
      icon: '⚡',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.4
    },
    {
      id: 'energyFactoryOverdrive',
      name: 'Energy Factory Overdrive',
      description: 'Pure energy infusion supercharges factory production by 90%',
      cost: 270000, // 45,000 * 6
      effect: 'factoryProductionBonus',
      effectValue: 1.9,
      icon: '⚡',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.5
    },
    {
      id: 'energyProcessors',
      name: 'High-Energy Processing Arrays',
      description: 'Energy-powered quantum computers generate 120 OPs/sec',
      cost: 300000, // 50,000 * 6
      effect: 'opsGenerationBonus',
      effectValue: 120,
      icon: '🔋',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.3
    },
    {
      id: 'energyMiningLasers',
      name: 'High-Energy Mining Lasers',
      description: 'Pure energy mining systems obliterate ore deposits, increasing extraction by 90%',
      cost: 360000, // 60,000 * 6
      effect: 'oreProductionBonus',
      effectValue: 1.9,
      icon: '🔥',
      repeatable: true,
      repeatCountDisplay: (count: number) => `Lvl ${count}`,
      costMultiplier: 2.4
    }
  ];

  // Honor-based ultimate upgrade definitions
  const honorUpgradeDefinitions = [
    {
      id: 'transcendentProcessor',
      name: 'Transcendent Processor',
      description: 'Ultimate computational core that multiplies ALL resource generation by 500%',
      cost: 100000, // 100,000 honor (100x increase)
      effect: 'transcendentProcessor',
      effectValue: 5.0,
      icon: '👑',
      repeatable: false
    },
    {
      id: 'cosmicHarvester',
      name: 'Cosmic Harvester',
      description: 'Harvest energy directly from stars, providing unlimited energy generation',
      cost: 50000, // 50,000 honor (100x increase)
      effect: 'cosmicHarvester',
      effectValue: true,
      icon: '⭐',
      repeatable: false
    },
    {
      id: 'quantumDominion',
      name: 'Quantum Dominion',
      description: 'Control quantum fields to instantly create 1 million probes',
      cost: 75000, // 75,000 honor (100x increase)
      effect: 'quantumDominion',
      effectValue: 1000000,
      icon: '🌌',
      repeatable: false
    },
    {
      id: 'universalConverter',
      name: 'Universal Converter',
      description: 'Convert any resource into any other resource at will',
      cost: 200000, // 200,000 honor (100x increase)
      effect: 'universalConverter',
      effectValue: true,
      icon: '♻️',
      repeatable: false
    },
    {
      id: 'omniscientAI',
      name: 'Omniscient AI',
      description: 'Perfect knowledge grants maximum efficiency to all operations',
      cost: 1000000, // 1,000,000 honor (1 million)
      effect: 'omniscientAI',
      effectValue: true,
      icon: '🧠',
      repeatable: false
    },
    {
      id: 'realityShaper',
      name: 'Reality Shaper',
      description: 'Reshape reality itself - unlocks god-mode production capabilities',
      cost: 10000000, // 10,000,000 honor (10 million)
      effect: 'realityShaper',
      effectValue: true,
      icon: '✨',
      repeatable: false
    }
  ];
  
  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };
  
  // Format numbers with appropriate scientific notation for very large numbers
  const formatLargeNumber = (num: number = 0) => {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' million';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  // Format money with appropriate prefixes
  const formatMoney = (amount: number = 0) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  // Check if space age is unlocked
  if (!spaceAgeUnlocked) {
    return null;
  }
  
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/90 via-green-900/90 to-emerald-900/90 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)] p-4 mb-6 border border-green-400/20">
      <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center">
        <span className="text-xl mr-2">🚀</span> Space Upgrades
      </h2>
      
      {/* Resources Display */}
      <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg mb-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <h3 className="text-sm font-semibold mb-3 text-green-300">Available Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col bg-gradient-to-r from-purple-600/80 to-purple-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">🧠</span>
              <span className="text-green-200 text-xs">Creativity</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{formatLargeNumber(creativity || 0)}</span>
          </div>
          <div className="flex flex-col bg-gradient-to-r from-blue-600/80 to-blue-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">🌀</span>
              <span className="text-green-200 text-xs">Yomi</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{formatLargeNumber(yomi || 0)}</span>
          </div>
          <div className="flex flex-col bg-gradient-to-r from-yellow-600/80 to-yellow-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">🤝</span>
              <span className="text-green-200 text-xs">Trust</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{trust || 0}</span>
          </div>
          <div className="flex flex-col bg-gradient-to-r from-red-600/80 to-red-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">⚡</span>
              <span className="text-green-200 text-xs">Ops</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{formatLargeNumber(ops || 0)}</span>
          </div>
          <div className="flex flex-col bg-gradient-to-r from-orange-600/80 to-orange-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">🔋</span>
              <span className="text-green-200 text-xs">Energy</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{formatLargeNumber(energy || 0)}/{formatLargeNumber(maxEnergy || 0)}</span>
          </div>
          <div className="flex flex-col bg-gradient-to-r from-red-600/80 to-red-800/80 p-3 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300 min-w-0">
            <div className="flex items-center mb-1">
              <span className="text-white mr-2">🏆</span>
              <span className="text-green-200 text-xs">Honor</span>
            </div>
            <span className="font-bold text-green-400 text-sm truncate">{formatLargeNumber(honor || 0)}</span>
          </div>
        </div>
      </div>

      {/* Energy Infrastructure */}
      <div className="backdrop-blur-sm bg-gray-800/50 p-4 rounded-lg mb-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
        <h3 className="text-md font-semibold mb-3 flex items-center text-green-300">
          <span className="text-lg mr-2">🔋</span> Energy Infrastructure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solar Arrays */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 hover:border-green-400/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-lg mr-2">☀️</span>
                <span className="font-medium text-green-200">Solar Arrays</span>
                <span className="ml-2 text-xs text-green-300/70">({solarArrays || 0})</span>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                    (aerogradePaperclips || 0) >= 1000
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 1000) {
                      buildSolarArray();
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 1000}
                >
                  x1
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                    (aerogradePaperclips || 0) >= 10000
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 10000) {
                      buildSolarArrayBulk(10);
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 10000}
                >
                  x10
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                    (aerogradePaperclips || 0) >= 100000
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_10px_rgba(74,222,128,0.3)] hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-500/30'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 100000) {
                      buildSolarArrayBulk(100);
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 100000}
                >
                  x100
                </button>
              </div>
            </div>
            <div className="text-xs text-green-300/70 mb-1">
              Cost: 1000 AP each | x10: 10K AP | x100: 100K AP
            </div>
            <p className="text-xs text-green-200/80">
              Generate energy from stellar radiation. Each array produces {formatLargeNumber(10)} energy/sec.
            </p>
            <p className="text-xs text-green-400 mt-1">
              Current Generation: {formatLargeNumber((solarArrays || 0) * 10)}/sec
            </p>
          </div>

          {/* Batteries */}
          <div className="backdrop-blur-sm bg-gray-700/50 p-3 rounded-lg border border-green-400/10 hover:border-green-400/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-lg mr-2">🔋</span>
                <span className="font-medium">Energy Batteries</span>
                <span className="ml-2 text-xs text-gray-300">({batteries || 0})</span>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-2 py-1 rounded text-xs ${
                    (aerogradePaperclips || 0) >= 500
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 500) {
                      buildBattery();
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 500}
                >
                  x1
                </button>
                <button
                  className={`px-2 py-1 rounded text-xs ${
                    (aerogradePaperclips || 0) >= 5000
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 5000) {
                      buildBatteryBulk(10);
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 5000}
                >
                  x10
                </button>
                <button
                  className={`px-2 py-1 rounded text-xs ${
                    (aerogradePaperclips || 0) >= 50000
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if ((aerogradePaperclips || 0) >= 50000) {
                      buildBatteryBulk(100);
                    }
                  }}
                  disabled={(aerogradePaperclips || 0) < 50000}
                >
                  x100
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-300 mb-1">
              Cost: 500 AP each | x10: 5K AP | x100: 50K AP
            </div>
            <p className="text-xs text-gray-300">
              Store energy for later use. Each battery stores {formatLargeNumber(1000)} energy.
            </p>
            <p className="text-xs text-orange-300 mt-1">
              Storage Capacity: {formatLargeNumber((batteries || 0) * 1000)}
            </p>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-gray-400">
          Energy Production: {formatLargeNumber(energyPerSecond || 0)}/sec | Storage: {formatLargeNumber(energy || 0)}/{formatLargeNumber(maxEnergy || 0)}
        </div>

      </div>
      
      <div className="space-y-2">
        {upgradeDefinitions.map(upgrade => {
          // Count how many times this upgrade has been purchased (for repeatable upgrades)
          const purchaseCount = unlockedSpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
          const isUnlocked = purchaseCount > 0;
          const isRepeatable = upgrade.repeatable === true;
          
          // Calculate current cost with multiplier for repeatable upgrades
          let currentCost = upgrade.cost;
          if (isRepeatable && purchaseCount > 0) {
            currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
          }
          
          const canAfford = (aerogradePaperclips || 0) >= currentCost;
          const isExpanded = expandedSection === upgrade.id;
          
          return (
            <div 
              key={upgrade.id} 
              className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleSection(upgrade.id)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{upgrade.icon}</span>
                  <span className="font-medium">{upgrade.name}</span>
                  {isUnlocked && (
                    <span className={`ml-2 text-xs px-2 py-0.5 ${
                      isRepeatable 
                        ? 'bg-blue-900 text-blue-100' 
                        : 'bg-green-900 text-green-100'
                    } rounded-full`}>
                      {isRepeatable 
                        ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                        : 'Purchased'}
                    </span>
                  )}
                </div>
                <button
                  className={`py-1 px-2 rounded text-xs ${
                    ((!isUnlocked || isRepeatable) && canAfford)
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if ((!isUnlocked || isRepeatable) && canAfford) {
                      buySpaceUpgrade(upgrade.id, currentCost);
                    }
                  }}
                  disabled={(isUnlocked && !isRepeatable) || !canAfford}
                >
                  {isUnlocked && !isRepeatable 
                    ? 'Purchased' 
                    : `${formatLargeNumber(currentCost)} Aerograde`}
                </button>
              </div>
              
              {isExpanded && (
                <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                  <p>{upgrade.description}</p>
                  {isRepeatable && isUnlocked && (
                    <p className="text-blue-300 mt-1">
                      Level {purchaseCount}{purchaseCount > 1 ? ` (${(Number(upgrade.effectValue) - 1) * 100 * purchaseCount}% total bonus)` : ''}
                    </p>
                  )}
                  {(!isUnlocked || isRepeatable) && !canAfford && (
                    <p className="text-red-400 mt-1">
                      Need {formatLargeNumber(currentCost - (aerogradePaperclips || 0))} more Aerograde paperclips
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Money-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-green-300">
          <span className="text-lg mr-2">💰</span> Financial Space Upgrades
        </h3>
        
        <div className="space-y-2">
          {moneyUpgradeDefinitions.map(upgrade => {
            // Count how many times this upgrade has been purchased (for repeatable upgrades)
            const purchaseCount = unlockedMoneySpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            // Calculate current cost with multiplier for repeatable upgrades
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (money || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-green-900 text-green-100' 
                          : 'bg-emerald-900 text-emerald-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyMoneySpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : formatMoney(currentCost)}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-green-300 mt-1">
                        Level {purchaseCount}{purchaseCount > 1 ? ` (${(Number(upgrade.effectValue) - 1) * 100 * purchaseCount}% total bonus)` : ''}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {formatMoney(currentCost - (money || 0))} more money
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* OPs-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-red-300">
          <span className="text-lg mr-2">⚡</span> Operations Upgrades
        </h3>
        
        <div className="space-y-2">
          {opsUpgradeDefinitions.map(upgrade => {
            const purchaseCount = unlockedOpsSpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (ops || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-red-900 text-red-100' 
                          : 'bg-red-800 text-red-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyOpsSpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : `${formatLargeNumber(currentCost)} OPs`}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-red-300 mt-1">
                        Level {purchaseCount}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {formatLargeNumber(currentCost - (ops || 0))} more OPs
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Creativity-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-purple-300">
          <span className="text-lg mr-2">🧠</span> Creativity Upgrades
        </h3>
        
        <div className="space-y-2">
          {creativityUpgradeDefinitions.map(upgrade => {
            const purchaseCount = unlockedCreativitySpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (creativity || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-purple-900 text-purple-100' 
                          : 'bg-purple-800 text-purple-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyCreativitySpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : `${formatLargeNumber(currentCost)} Creativity`}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-purple-300 mt-1">
                        Level {purchaseCount}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {formatLargeNumber(currentCost - (creativity || 0))} more Creativity
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Yomi-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-blue-300">
          <span className="text-lg mr-2">🌀</span> Strategic Upgrades
        </h3>
        
        <div className="space-y-2">
          {yomiUpgradeDefinitions.map(upgrade => {
            const purchaseCount = unlockedYomiSpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (yomi || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-blue-900 text-blue-100' 
                          : 'bg-blue-800 text-blue-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyYomiSpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : `${formatLargeNumber(currentCost)} Yomi`}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-blue-300 mt-1">
                        Level {purchaseCount}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {formatLargeNumber(currentCost - (yomi || 0))} more Yomi
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-yellow-300">
          <span className="text-lg mr-2">🤝</span> Diplomatic Upgrades
        </h3>
        
        <div className="space-y-2">
          {trustUpgradeDefinitions.map(upgrade => {
            const purchaseCount = unlockedTrustSpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (trust || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-yellow-900 text-yellow-100' 
                          : 'bg-yellow-800 text-yellow-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyTrustSpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : `${currentCost} Trust`}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-yellow-300 mt-1">
                        Level {purchaseCount}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {currentCost - (trust || 0)} more Trust
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy-based upgrades section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3 flex items-center text-orange-300">
          <span className="text-lg mr-2">🔋</span> Energy Upgrades
        </h3>
        
        <div className="space-y-2">
          {energyUpgradeDefinitions.map(upgrade => {
            const purchaseCount = unlockedEnergySpaceUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
            const isUnlocked = purchaseCount > 0;
            const isRepeatable = upgrade.repeatable === true;
            
            let currentCost = upgrade.cost;
            if (isRepeatable && purchaseCount > 0) {
              currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
            }
            
            const canAfford = (energy || 0) >= currentCost;
            const isExpanded = expandedSection === upgrade.id;
            
            return (
              <div 
                key={upgrade.id} 
                className={`bg-gray-700 p-3 rounded relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleSection(upgrade.id)}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{upgrade.icon}</span>
                    <span className="font-medium">{upgrade.name}</span>
                    {isUnlocked && (
                      <span className={`ml-2 text-xs px-2 py-0.5 ${
                        isRepeatable 
                          ? 'bg-orange-900 text-orange-100' 
                          : 'bg-orange-800 text-orange-100'
                      } rounded-full`}>
                        {isRepeatable 
                          ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                          : 'Purchased'}
                      </span>
                    )}
                  </div>
                  <button
                    className={`py-1 px-2 rounded text-xs ${
                      ((!isUnlocked || isRepeatable) && canAfford)
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if ((!isUnlocked || isRepeatable) && canAfford) {
                        buyEnergySpaceUpgrade(upgrade.id, currentCost);
                      }
                    }}
                    disabled={(isUnlocked && !isRepeatable) || !canAfford}
                  >
                    {isUnlocked && !isRepeatable 
                      ? 'Purchased' 
                      : `${formatLargeNumber(currentCost)} Energy`}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded">
                    <p>{upgrade.description}</p>
                    {isRepeatable && isUnlocked && (
                      <p className="text-orange-300 mt-1">
                        Level {purchaseCount}
                      </p>
                    )}
                    {(!isUnlocked || isRepeatable) && !canAfford && (
                      <p className="text-red-400 mt-1">
                        Need {formatLargeNumber(currentCost - (energy || 0))} more Energy
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Honor-based ultimate upgrades section */}
      {(honor || 0) > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3 flex items-center text-red-300">
            <span className="text-lg mr-2">🏆</span> Ultimate Honor Upgrades
          </h3>
          <p className="text-xs text-red-200/70 mb-4">
            These ultimate upgrades cost Honor - the most precious resource earned through glorious combat victories.
          </p>
          
          <div className="space-y-2">
            {honorUpgradeDefinitions.map(upgrade => {
              const purchaseCount = unlockedHonorUpgrades?.filter((id: string) => id === upgrade.id).length || 0;
              const isUnlocked = purchaseCount > 0;
              const isRepeatable = upgrade.repeatable === true;
              
              let currentCost = upgrade.cost;
              if (isRepeatable && purchaseCount > 0) {
                currentCost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier || 2, purchaseCount));
              }
              
              const canAfford = (honor || 0) >= currentCost;
              const isExpanded = expandedSection === upgrade.id;
              
              return (
                <div 
                  key={upgrade.id} 
                  className={`bg-gradient-to-r from-red-900/50 to-red-800/50 p-3 rounded border border-red-400/30 relative ${isUnlocked && !isRepeatable ? 'opacity-50' : ''}`}
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer" 
                    onClick={() => toggleSection(upgrade.id)}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{upgrade.icon}</span>
                      <span className="font-medium text-red-100">{upgrade.name}</span>
                      {isUnlocked && (
                        <span className={`ml-2 text-xs px-2 py-0.5 ${
                          isRepeatable 
                            ? 'bg-red-900 text-red-100' 
                            : 'bg-red-800 text-red-100'
                        } rounded-full`}>
                          {isRepeatable 
                            ? (upgrade.repeatCountDisplay ? upgrade.repeatCountDisplay(purchaseCount) : `x${purchaseCount}`) 
                            : 'Purchased'}
                        </span>
                      )}
                    </div>
                    <button
                      className={`py-1 px-2 rounded text-xs ${(
                        (!isUnlocked || isRepeatable) && canAfford)
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if ((!isUnlocked || isRepeatable) && canAfford) {
                          buyHonorUpgrade(upgrade.id, currentCost);
                        }
                      }}
                      disabled={(isUnlocked && !isRepeatable) || !canAfford}
                    >
                      {isUnlocked && !isRepeatable 
                        ? 'Purchased' 
                        : `${currentCost} Honor`}
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 text-xs text-red-200 bg-red-900/30 p-2 rounded">
                      <p>{upgrade.description}</p>
                      {isRepeatable && isUnlocked && (
                        <p className="text-red-300 mt-1">
                          Level {purchaseCount}
                        </p>
                      )}
                      {(!isUnlocked || isRepeatable) && !canAfford && (
                        <p className="text-red-400 mt-1">
                          Need {currentCost - (honor || 0)} more Honor
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Aerograde Paperclips: {formatLargeNumber(aerogradePaperclips || 0)} (Production: {formatLargeNumber(spacePaperclipsPerSecond)}/sec)
        <br />
        Money: {formatMoney(money || 0)}
      </div>
    </div>
  );
}