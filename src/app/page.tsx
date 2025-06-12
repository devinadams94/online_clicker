import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
        <div className="w-full max-w-6xl items-center justify-center flex flex-col gap-8">
          {/* Neon title with glow effect */}
          <h1 className="text-6xl md:text-8xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
            PAPERCLIP CLICKER
          </h1>
          
          {/* Animated paperclip with neon glow */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-75 animate-pulse"></div>
            <Image 
              src="/assets/paperclip.svg" 
              alt="Paperclip" 
              width={100} 
              height={100} 
              className="relative z-10 animate-float drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] brightness-[1.5] invert sepia saturate-[10] hue-rotate-[180deg]"
              style={{ filter: 'brightness(1.5) invert(1) sepia(1) saturate(10) hue-rotate(180deg)' }}
            />
          </div>
          
          {/* Glass morphism card for about section */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              About the Game
            </h2>
            <p className="text-lg mb-6 text-gray-200 text-center">
              Start your journey from a single paperclip to a galactic empire in this addictive incremental game
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="backdrop-blur bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-400/30">
                <h3 className="text-green-400 font-bold mb-2">🚀 Features</h3>
                <ul className="text-gray-200 space-y-1 text-sm">
                  <li>• Manual & automatic production</li>
                  <li>• Space exploration</li>
                  <li>• Stock market trading</li>
                  <li>• Prestige system</li>
                </ul>
              </div>
              <div className="backdrop-blur bg-gradient-to-br from-lime-500/20 to-green-500/20 p-4 rounded-lg border border-lime-400/30">
                <h3 className="text-lime-400 font-bold mb-2">🎮 Gameplay</h3>
                <ul className="text-gray-200 space-y-1 text-sm">
                  <li>• Click to start</li>
                  <li>• Unlock upgrades</li>
                  <li>• Optimize strategies</li>
                  <li>• Compete globally</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Warning card with neon style */}
          <div className="backdrop-blur-md bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-2xl p-6 max-w-3xl mx-auto mb-8 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <div className="flex items-start gap-4">
              <div className="text-yellow-400 text-3xl animate-pulse">⚡</div>
              <div>
                <h3 className="font-bold text-xl text-yellow-400 mb-2">Save Your Progress!</h3>
                <p className="text-yellow-100">
                  Create a free account to save your game progress and compete on the global leaderboards
                </p>
              </div>
            </div>
          </div>
          
          {/* Neon buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/game" 
              className="group relative px-10 py-4 text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:from-green-400 group-hover:to-emerald-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative z-10">PLAY NOW</span>
            </Link>
            
            <Link 
              href="/signup" 
              className="group relative px-10 py-4 text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-500 transition-all duration-300 group-hover:from-lime-400 group-hover:to-green-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative z-10">SIGN UP</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
