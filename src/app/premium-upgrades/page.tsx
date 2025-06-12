'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useGameStore from '@/lib/gameStore';

interface PremiumUpgrade {
  id: string;
  name: string;
  description: string;
  effect: string;
  cost: number;
  icon: string;
  category: 'production' | 'multiplier' | 'instant' | 'special' | 'space';
  multiplier?: number;
  instant?: {
    type: 'paperclips' | 'money' | 'wire' | 'ops' | 'creativity' | 'yomi' | 'aerograde' | 'probes' | 'honor';
    amount: number;
  };
  repurchasable?: boolean;
}

const premiumUpgrades: PremiumUpgrade[] = [
  // Production Upgrades
  {
    id: 'diamond_clippers',
    name: 'Diamond Clippers',
    description: 'Premium auto-clippers that produce 1000x more paperclips (stacks!)',
    effect: '+100,000% auto-clipper efficiency per purchase',
    cost: 100,
    icon: '💎',
    category: 'production',
    multiplier: 1000,
    repurchasable: true,
  },
  {
    id: 'quantum_factory',
    name: 'Quantum Factory',
    description: 'Harness quantum mechanics for instant production',
    effect: '2x all production permanently (stacks!)',
    cost: 500,
    icon: '⚛️',
    category: 'multiplier',
    multiplier: 2,
    repurchasable: true,
  },
  {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Skip ahead 1 hour of production instantly',
    effect: 'Instant 1 hour of production',
    cost: 50,
    icon: '⏰',
    category: 'instant',
  },
  
  // Instant Resources
  {
    id: 'instant_paperclips_small',
    name: 'Paperclip Bundle',
    description: 'Instantly receive 1 million paperclips',
    effect: '+1,000,000 paperclips',
    cost: 60, // Keeping same as before
    icon: '📎',
    category: 'instant',
    instant: { type: 'paperclips', amount: 1000000 },
    repurchasable: true,
  },
  {
    id: 'instant_paperclips_large',
    name: 'Mega Paperclip Bundle',
    description: 'Instantly receive 100 million paperclips',
    effect: '+100,000,000 paperclips',
    cost: 500,
    icon: '📎',
    category: 'instant',
    instant: { type: 'paperclips', amount: 100000000 },
    repurchasable: true,
  },
  {
    id: 'instant_money',
    name: 'Cash Injection',
    description: 'Instantly receive $10 million',
    effect: '+$10,000,000',
    cost: 250,
    icon: '💰',
    category: 'instant',
    instant: { type: 'money', amount: 10000000 },
    repurchasable: true,
  },
  {
    id: 'instant_wire',
    name: 'Wire Supply',
    description: 'Instantly receive 10 million wire',
    effect: '+10,000,000 wire',
    cost: 120,
    icon: '🧵',
    category: 'instant',
    instant: { type: 'wire', amount: 10000000 },
    repurchasable: true,
  },
  
  // Special Upgrades
  {
    id: 'auto_upgrade',
    name: 'Auto Upgrade AI',
    description: 'AI automatically purchases optimal upgrades',
    effect: 'Enables smart auto-purchasing',
    cost: 1800, // Keeping same as before
    icon: '🤖',
    category: 'special',
  },
  {
    id: 'market_oracle',
    name: 'Market Oracle',
    description: 'Perfect market predictions for 24 hours',
    effect: '+500% trading profits for 24h',
    cost: 500,
    icon: '🔮',
    category: 'special',
  },
  {
    id: 'space_jumpstart',
    name: 'Space Age Jumpstart',
    description: 'Instantly unlock Space Age, convert all paperclips to aerograde with 1M bonus',
    effect: 'Unlock Space Age + 100 probes + convert paperclips + 1M aerograde',
    cost: 1000,
    icon: '🚀',
    category: 'special',
  },
  {
    id: 'prestige_boost',
    name: 'Prestige Multiplier',
    description: 'Double your prestige rewards permanently (stacks!)',
    effect: '2x prestige point gain per purchase',
    cost: 2000,
    icon: '👑',
    category: 'multiplier',
    multiplier: 2,
    repurchasable: true,
  },
  
  // Space Age Upgrades
  {
    id: 'instant_yomi',
    name: 'Yomi Crystal',
    description: 'Instantly receive 1,000 yomi points',
    effect: '+1,000 yomi',
    cost: 150,
    icon: '🔮',
    category: 'space',
    instant: { type: 'yomi', amount: 1000 },
    repurchasable: true,
  },
  {
    id: 'mega_yomi',
    name: 'Mega Yomi Crystal',
    description: 'Instantly receive 10,000 yomi points',
    effect: '+10,000 yomi',
    cost: 1000,
    icon: '💠',
    category: 'space',
    instant: { type: 'yomi', amount: 10000 },
    repurchasable: true,
  },
  {
    id: 'instant_aerograde_small',
    name: 'Aerograde Bundle',
    description: 'Instantly receive 1 million aerograde paperclips',
    effect: '+1,000,000 aerograde paperclips',
    cost: 200,
    icon: '✈️',
    category: 'space',
    instant: { type: 'aerograde', amount: 1000000 },
    repurchasable: true,
  },
  {
    id: 'instant_aerograde_large',
    name: 'Mega Aerograde Bundle',
    description: 'Instantly receive 100 million aerograde paperclips',
    effect: '+100,000,000 aerograde paperclips',
    cost: 1500,
    icon: '🚀',
    category: 'space',
    instant: { type: 'aerograde', amount: 100000000 },
    repurchasable: true,
  },
  {
    id: 'probe_boost',
    name: 'Probe Accelerator',
    description: 'Instantly receive 1,000 space probes',
    effect: '+1,000 probes',
    cost: 800,
    icon: '🛸',
    category: 'space',
    instant: { type: 'probes', amount: 1000 },
    repurchasable: true,
  },
  {
    id: 'honor_package',
    name: 'Honor Points',
    description: 'Instantly receive 100 honor points for space combat',
    effect: '+100 honor',
    cost: 500,
    icon: '⚔️',
    category: 'space',
    instant: { type: 'honor', amount: 100 },
    repurchasable: true,
  },
  {
    id: 'probe_speed_boost',
    name: 'Quantum Probe Engine',
    description: 'Double probe exploration speed permanently (stacks!)',
    effect: '2x probe speed per purchase',
    cost: 1200,
    icon: '💫',
    category: 'space',
    multiplier: 2,
    repurchasable: true,
  },
  {
    id: 'space_production_boost',
    name: 'Zero-G Factory',
    description: 'Triple all space production permanently (stacks!)',
    effect: '3x space wire, ore, and paperclip production',
    cost: 2000,
    icon: '🏭',
    category: 'space',
    multiplier: 3,
    repurchasable: true,
  },
];

export default function PremiumUpgrades() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [purchaseCounts, setPurchaseCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/game/load');
      if (response.ok) {
        const data = await response.json();
        setDiamonds(data.diamonds || 0);
        setPurchasedUpgrades(data.premiumUpgrades || []);
        
        // Count occurrences of each upgrade
        const counts: Record<string, number> = {};
        (data.premiumUpgrades || []).forEach((id: string) => {
          counts[id] = (counts[id] || 0) + 1;
        });
        setPurchaseCounts(counts);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handlePurchase = async (upgrade: PremiumUpgrade) => {
    if (diamonds < upgrade.cost) {
      alert('Not enough diamonds!');
      return;
    }

    if (!upgrade.repurchasable && purchasedUpgrades.includes(upgrade.id)) {
      alert('Already purchased!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/diamonds/use-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          upgradeId: upgrade.id,
          cost: upgrade.cost,
          upgradeData: upgrade,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the game store directly with the new premium upgrades
        if (data.gameState && data.gameState.premiumUpgrades) {
          const parsedUpgrades = typeof data.gameState.premiumUpgrades === 'string' 
            ? JSON.parse(data.gameState.premiumUpgrades) 
            : data.gameState.premiumUpgrades;
          
          useGameStore.setState({
            diamonds: data.gameState.diamonds,
            premiumUpgrades: parsedUpgrades
          });
        }
        
        alert(`Successfully purchased ${upgrade.name}!`);
        
        // Also refresh user data to update local state
        await fetchUserData();
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('An error occurred during purchase.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUpgrades = selectedCategory === 'all' 
    ? premiumUpgrades 
    : premiumUpgrades.filter(u => u.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Upgrades', icon: '✨' },
    { id: 'production', name: 'Production', icon: '⚙️' },
    { id: 'multiplier', name: 'Multipliers', icon: '✖️' },
    { id: 'instant', name: 'Instant Resources', icon: '⚡' },
    { id: 'special', name: 'Special', icon: '🌟' },
    { id: 'space', name: 'Space Age', icon: '🌌' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] mb-4">
            PREMIUM UPGRADES
          </h1>
          <p className="text-xl text-gray-200">Unlock powerful upgrades with diamonds!</p>
          <div className="mt-6 text-2xl text-purple-300">
            Your Diamonds: <span className="font-bold">{diamonds.toLocaleString()} 💎</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Upgrades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredUpgrades.map((upgrade) => {
            const isPurchased = purchasedUpgrades.includes(upgrade.id);
            const canAfford = diamonds >= upgrade.cost;
            const purchaseCount = purchaseCounts[upgrade.id] || 0;

            return (
              <div
                key={upgrade.id}
                className={`relative backdrop-blur-md bg-white/10 border ${
                  isPurchased ? 'border-green-400/50' : 'border-white/20'
                } rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ${
                  !isPurchased && canAfford ? 'hover:scale-105' : ''
                }`}
              >
                {isPurchased && (
                  <div className="absolute -top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    OWNED{upgrade.repurchasable && purchaseCount > 1 ? ` x${purchaseCount}` : ''}
                  </div>
                )}
                
                {(!isPurchased || upgrade.repurchasable) && (
                  <div className="absolute -top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                    🏷️ SALE 40% OFF!
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-5xl mb-3">{upgrade.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {upgrade.name}
                    {upgrade.repurchasable && purchaseCount > 0 && (
                      <span className="text-lg text-green-400 ml-2">(Owned: {purchaseCount})</span>
                    )}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">{upgrade.description}</p>
                  <div className="text-purple-300 font-semibold mb-4">{upgrade.effect}</div>
                  <div className="text-xl font-bold text-white mb-4">
                    {upgrade.cost.toLocaleString()} 💎
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(upgrade)}
                    disabled={loading || (isPurchased && !upgrade.repurchasable) || !canAfford}
                    className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-300 ${
                      isPurchased && !upgrade.repurchasable
                        ? 'bg-green-600 cursor-not-allowed'
                        : !canAfford
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transform hover:scale-105'
                    }`}
                  >
                    {isPurchased && !upgrade.repurchasable ? 'Purchased' : !canAfford ? 'Not Enough 💎' : upgrade.repurchasable && purchaseCount > 0 ? 'Buy Again' : 'Purchase'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Link
            href="/buy-diamonds"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:from-blue-400 hover:to-cyan-400 transform hover:scale-105 transition-all duration-300"
          >
            Buy More Diamonds 💎
          </Link>
          <Link
            href="/game"
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:from-green-400 hover:to-emerald-400 transform hover:scale-105 transition-all duration-300"
          >
            Back to Game
          </Link>
        </div>
      </div>
    </main>
  );
}