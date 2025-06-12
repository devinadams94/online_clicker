'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DiamondPackage {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  bonus: number;
  popular?: boolean;
}

const diamondPackages: DiamondPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    diamonds: 1000,
    price: 0.50,
    bonus: 0,
  },
  {
    id: 'value',
    name: 'Value Pack',
    diamonds: 5500,
    price: 2.50,
    bonus: 10,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    diamonds: 12000,
    price: 5.00,
    bonus: 20,
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    diamonds: 26000,
    price: 10.00,
    bonus: 30,
  },
  {
    id: 'mega',
    name: 'Mega Pack',
    diamonds: 55000,
    price: 20.00,
    bonus: 37.5,
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    diamonds: 140000,
    price: 50.00,
    bonus: 40,
  },
];

export default function BuyDiamonds() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [currentDiamonds, setCurrentDiamonds] = useState<number>(0);

  useEffect(() => {
    if (session) {
      // Load current diamond balance
      fetch('/api/game/load')
        .then(res => res.json())
        .then(data => {
          setCurrentDiamonds(data.diamonds || 0);
        })
        .catch(err => console.error('Failed to load diamond balance:', err));
    }
  }, [session]);

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

  const handlePurchase = async (packageId: string) => {
    setLoading(true);
    setSelectedPackage(packageId);
    
    const selectedPkg = diamondPackages.find(pkg => pkg.id === packageId);
    if (!selectedPkg) return;

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          console.error('No checkout URL received:', data);
          alert('Failed to create checkout session. No checkout URL received.');
        }
      } else {
        const error = await response.json();
        console.error('Checkout error:', error);
        alert(`Payment Error: ${error.message || error.error || 'Failed to create checkout session'}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('An error occurred during purchase.');
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] mb-4">
            💎 DIAMOND SHOP 💎
          </h1>
          <p className="text-xl text-gray-200">Purchase diamonds to unlock premium upgrades and boost your progress!</p>
          <div className="mt-6 text-2xl text-cyan-300">
            Current Balance: <span className="font-bold">{currentDiamonds.toLocaleString()} 💎</span>
          </div>
        </div>

        {/* Diamond Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {diamondPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative backdrop-blur-md bg-white/10 border ${
                pkg.popular ? 'border-yellow-400/50' : 'border-white/20'
              } rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-yellow-400/50' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-5xl mb-4">💎</div>
                <div className="text-3xl font-bold text-cyan-300 mb-2">
                  {pkg.diamonds.toLocaleString()}
                </div>
                {pkg.bonus > 0 && (
                  <div className="text-sm text-yellow-300 mb-4">
                    +{pkg.bonus}% BONUS
                  </div>
                )}
                <div className="text-2xl font-bold text-white mb-6">
                  ${pkg.price.toFixed(2)}
                </div>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-300 ${
                    loading && selectedPackage === pkg.id
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 transform hover:scale-105'
                  }`}
                >
                  {loading && selectedPackage === pkg.id ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Game Button */}
        <div className="text-center mt-12">
          <Link
            href="/game"
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:from-green-400 hover:to-emerald-400 transform hover:scale-105 transition-all duration-300"
          >
            Back to Game
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">About Diamonds</h2>
          <div className="text-gray-200 space-y-4">
            <p>💎 Diamonds are the premium currency in Paperclip Clicker</p>
            <p>🚀 Use diamonds to purchase exclusive upgrades that significantly boost your production</p>
            <p>⚡ Premium upgrades include instant resources, permanent multipliers, and unique abilities</p>
            <p>💰 Larger packages offer better value with bonus diamonds</p>
            <p>🔒 All purchases are secure and diamonds are added to your account instantly</p>
          </div>
        </div>
      </div>
    </main>
  );
}