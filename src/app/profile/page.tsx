"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGameStore from "@/lib/gameStore";

interface UserStats {
  totalPaperclips: number;
  highestPaperclips: number;
  prestigeCount: number;
  lastActive: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { totalPaperclipsMade, highestRun, prestigeLevel } = useGameStore();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use actual game data
    if (status === "authenticated" && session?.user) {
      setUserStats({
        totalPaperclips: totalPaperclipsMade,
        highestPaperclips: highestRun,
        prestigeCount: prestigeLevel,
        lastActive: new Date().toISOString(),
      });
      setLoading(false);
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session, totalPaperclipsMade, highestRun, prestigeLevel]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden flex items-center justify-center p-8">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 border border-green-400/30 rounded-2xl p-8 w-full max-w-3xl mx-auto relative z-10 shadow-[0_0_30px_rgba(74,222,128,0.4)]">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded"></div>
            <div className="h-32 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded"></div>
            <div className="h-24 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden flex items-center justify-center p-8">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 border border-green-400/30 rounded-2xl p-8 w-full max-w-3xl mx-auto text-center relative z-10 shadow-[0_0_30px_rgba(74,222,128,0.4)]">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-6">
            PROFILE ACCESS REQUIRED
          </h1>
          <div className="py-8">
            <p className="text-xl mb-6 text-green-200">Please sign in to view your profile</p>
            <Link 
              href="/login" 
              className="group relative inline-block px-8 py-3 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative z-10">SIGN IN</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 border border-green-400/30 rounded-2xl p-8 w-full max-w-4xl mx-auto shadow-[0_0_40px_rgba(74,222,128,0.5)]">
          <h1 className="text-5xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.7)]">
            YOUR PROFILE
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <div className="space-y-6">
              <div className="backdrop-blur bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
                <h2 className="text-2xl font-bold mb-4 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                  Account Information
                </h2>
                <div className="space-y-3 text-green-200">
                  <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                    <span className="text-green-300">Email</span>
                    <span className="font-mono text-green-100">{session?.user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                    <span className="text-green-300">Username</span>
                    <span className="font-mono text-green-100">{session?.user?.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-300">Joined</span>
                    <span className="font-mono text-green-100">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-6 border border-emerald-400/30">
                <h2 className="text-2xl font-bold mb-4 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  Account Actions
                </h2>
                <div className="space-y-3">
                  <Link 
                    href="/fix-password" 
                    className="block w-full text-center py-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-lg border border-emerald-400/50 text-emerald-200 hover:from-emerald-500/40 hover:to-green-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Game Statistics */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                Game Statistics
              </h2>
              {userStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg p-4 border border-yellow-400/30 text-center hover:border-yellow-400/50 transition-all duration-300">
                    <p className="text-sm text-yellow-300 mb-1">Total Paperclips</p>
                    <p className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">{userStats.totalPaperclips.toLocaleString()}</p>
                  </div>
                  <div className="backdrop-blur bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-400/30 text-center hover:border-blue-400/50 transition-all duration-300">
                    <p className="text-sm text-blue-300 mb-1">Highest Run</p>
                    <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">{userStats.highestPaperclips.toLocaleString()}</p>
                  </div>
                  <div className="backdrop-blur bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-4 border border-red-400/30 text-center hover:border-red-400/50 transition-all duration-300">
                    <p className="text-sm text-red-300 mb-1">Prestige Count</p>
                    <p className="text-2xl font-bold text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">{userStats.prestigeCount}</p>
                  </div>
                  <div className="backdrop-blur bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg p-4 border border-yellow-400/30 text-center hover:border-yellow-400/50 transition-all duration-300">
                    <p className="text-sm text-yellow-300 mb-1">Last Active</p>
                    <p className="text-2xl font-bold text-yellow-400">{new Date(userStats.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg p-8 border border-gray-600/30 text-center">
                  <p className="text-green-300">No game statistics available yet. Start playing to see your stats!</p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Link 
                  href="/game" 
                  className="group relative inline-block px-10 py-4 text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <span className="relative z-10">PLAY NOW</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}