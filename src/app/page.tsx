import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">Paperclip Clicker</h1>
        
        <div className="flex items-center justify-center mb-4">
          <Image 
            src="/assets/paperclip.svg" 
            alt="Paperclip" 
            width={80} 
            height={80} 
            className="animate-bounce-slow"
          />
        </div>
        
        <div className="card max-w-3xl mx-auto mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">About the Game</h2>
          <p className="text-lg mb-4">
            Paperclip Clicker is an incremental game where you start by making paperclips manually and gradually 
            automate production with upgrades, expand to space, and discover new technologies.
          </p>
          <p className="text-lg mb-4">
            Features include:
          </p>
          <ul className="text-left list-disc list-inside mb-4 space-y-2">
            <li>Start by clicking to produce paperclips</li>
            <li>Unlock automatic production and various upgrades</li>
            <li>Explore space and expand your paperclip empire</li>
            <li>Invest in the stock market and optimize your production</li>
            <li>Prestige system to reset with powerful bonuses</li>
          </ul>
        </div>
        
        <div className="card max-w-3xl mx-auto mb-8 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 dark:text-amber-400 text-2xl mt-1">⚠️</div>
            <div>
              <h3 className="font-medium text-lg text-amber-800 dark:text-amber-300">Important: Save Your Progress</h3>
              <p className="mt-1 text-amber-700 dark:text-amber-300">
                Your game progress may not be saved if you play without an account. 
                Sign up for free to ensure your progress is saved and to compete on the leaderboards!
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link href="/game" className="btn-primary text-lg px-8 py-3">
            Play Now
          </Link>
          <Link href="/signup" className="btn-secondary text-lg px-8 py-3">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
