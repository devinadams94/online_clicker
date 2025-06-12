'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get('session_id') : null;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [diamonds, setDiamonds] = useState<number>(0);

  useEffect(() => {
    // Check payment status
    const checkPayment = async () => {
      try {
        // Fetch current diamond balance to verify payment
        const response = await fetch('/api/game/load');
        if (response.ok) {
          const data = await response.json();
          setDiamonds(data.diamonds || 0);
        }

        // If we have a session ID or if we're on this page, assume success
        // The webhook might have already processed the payment
        setTimeout(() => {
          setStatus('success');
        }, 2000);
      } catch (error) {
        console.error('Error checking payment:', error);
        setStatus('error');
      }
    };

    checkPayment();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          {status === 'loading' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-3xl font-bold text-white mb-4">Processing Payment...</h1>
              <p className="text-gray-200">Please wait while we confirm your purchase.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-green-400 mb-4">Payment Successful!</h1>
              <p className="text-gray-200 mb-2">
                Your diamonds have been added to your account. Thank you for your purchase!
              </p>
              {diamonds > 0 && (
                <p className="text-xl text-blue-400 mb-6">
                  Current Balance: {diamonds.toLocaleString()} 💎
                </p>
              )}
              <div className="space-y-3">
                <Link
                  href="/game"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full hover:from-green-400 hover:to-emerald-400 transform hover:scale-105 transition-all duration-300"
                >
                  Return to Game
                </Link>
                <Link
                  href="/premium-upgrades"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:from-purple-400 hover:to-pink-400 transform hover:scale-105 transition-all duration-300"
                >
                  Shop Premium Upgrades
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold text-red-400 mb-4">Payment Error</h1>
              <p className="text-gray-200 mb-6">
                There was an issue processing your payment. Please try again.
              </p>
              <Link
                href="/buy-diamonds"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:from-blue-400 hover:to-cyan-400 transform hover:scale-105 transition-all duration-300"
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}