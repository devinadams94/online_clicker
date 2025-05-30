"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useGameStore from "@/lib/gameStore";

interface ScoreEntry {
  rank: number;
  username: string;
  isCurrentUser: boolean;
  paperclips: number;
  highestRun: number;
  aerogradePaperclips: number;
  prestigeLevel: number;
  lastUpdated: string;
}

export default function HighscoresPage() {
  const { data: session } = useSession();
  const { totalPaperclipsMade, aerogradePaperclips, prestigeLevel, highestRun } = useGameStore();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'allTime' | 'weekly'>('allTime');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setTimeout(() => {
      // Mock data for demonstration
      const mockData: ScoreEntry[] = [
        {
          rank: 1,
          username: "paperclipMaster",
          isCurrentUser: false,
          paperclips: 9876543210,
          highestRun: 8888888889,
          aerogradePaperclips: 1234567890,
          prestigeLevel: 12,
          lastUpdated: "2025-05-20"
        },
        {
          rank: 2,
          username: "clipinator",
          isCurrentUser: false,
          paperclips: 8765432109,
          highestRun: 7012345687,
          aerogradePaperclips: 987654321,
          prestigeLevel: 10,
          lastUpdated: "2025-05-19"
        },
        {
          rank: 3,
          username: session?.user?.name || session?.user?.email?.split('@')[0] || "current-user",
          isCurrentUser: true,
          paperclips: totalPaperclipsMade || 0,
          highestRun: highestRun || 0,
          aerogradePaperclips: aerogradePaperclips || 0,
          prestigeLevel: prestigeLevel || 0,
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        {
          rank: 4,
          username: "paperWizard",
          isCurrentUser: false,
          paperclips: 6543210987,
          highestRun: 5888889888,
          aerogradePaperclips: 765432109,
          prestigeLevel: 7,
          lastUpdated: "2025-05-18"
        },
        {
          rank: 5,
          username: "clipsUnlimited",
          isCurrentUser: false,
          paperclips: 5432109876,
          highestRun: 4345687901,
          aerogradePaperclips: 654321098,
          prestigeLevel: 6,
          lastUpdated: "2025-05-21"
        },
        {
          rank: 6,
          username: "clipGoat",
          isCurrentUser: false,
          paperclips: 4321098765,
          highestRun: 3888988889,
          aerogradePaperclips: 543210987,
          prestigeLevel: 5,
          lastUpdated: "2025-05-17"
        },
        {
          rank: 7,
          username: "paperclipEmpire",
          isCurrentUser: false,
          paperclips: 3210987654,
          highestRun: 2568790123,
          aerogradePaperclips: 432109876,
          prestigeLevel: 4,
          lastUpdated: "2025-05-16"
        },
        {
          rank: 8,
          username: "infiniteClips",
          isCurrentUser: false,
          paperclips: 2109876543,
          highestRun: 1898888889,
          aerogradePaperclips: 321098765,
          prestigeLevel: 3,
          lastUpdated: "2025-05-15"
        },
        {
          rank: 9,
          username: "clickerKing",
          isCurrentUser: false,
          paperclips: 1098765432,
          highestRun: 989012345,
          aerogradePaperclips: 210987654,
          prestigeLevel: 2,
          lastUpdated: "2025-05-14"
        },
        {
          rank: 10,
          username: "clipHoarder",
          isCurrentUser: false,
          paperclips: 987654321,
          highestRun: 790123457,
          aerogradePaperclips: 109876543,
          prestigeLevel: 1,
          lastUpdated: "2025-05-13"
        }
      ];
      
      setScores(mockData);
      setLoading(false);
    }, 1000);
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 border border-green-400/30 rounded-2xl p-8 w-full max-w-6xl mx-auto shadow-[0_0_40px_rgba(74,222,128,0.5)]">
          <h1 className="text-6xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(74,222,128,0.7)]">
            LEADERBOARD
          </h1>
          
          {/* Tab buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full overflow-hidden backdrop-blur bg-gray-800/50 border border-green-400/30 p-1">
              <button
                onClick={() => setActiveTab('allTime')}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  activeTab === 'allTime' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(74,222,128,0.5)]' 
                    : 'text-green-300 hover:text-green-100'
                }`}
              >
                ALL-TIME
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  activeTab === 'weekly' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.5)]' 
                    : 'text-green-300 hover:text-green-100'
                }`}
              >
                THIS WEEK
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="backdrop-blur bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg h-16 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                <table className="w-full">
                  <thead>
                    <tr className="backdrop-blur bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-400/30">
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Highest Run</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Aerograde</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Prestige</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-green-400 uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-400/20">
                    {scores.map((entry) => (
                      <tr 
                        key={entry.rank} 
                        className={`backdrop-blur transition-all duration-300 hover:bg-green-400/10 ${
                          entry.isCurrentUser 
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-400" 
                            : "bg-gray-800/30"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entry.rank <= 3 ? (
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                              entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 
                              entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 shadow-[0_0_15px_rgba(156,163,175,0.6)]' :
                              'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-[0_0_15px_rgba(217,119,6,0.6)]'
                            }`}>
                              {entry.rank}
                            </span>
                          ) : (
                            <span className="text-2xl font-bold text-green-300">{entry.rank}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${entry.isCurrentUser ? 'text-green-400 text-lg' : 'text-green-200'}`}>
                            {entry.username}
                            {entry.isCurrentUser && (
                              <span className="ml-2 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                                YOU
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-300 font-mono">
                          {entry.highestRun.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-emerald-300 font-mono">
                          {entry.aerogradePaperclips.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-lime-500/30 to-green-500/30 text-lime-300 font-bold">
                            {entry.prestigeLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-300/60 text-sm">
                          {entry.lastUpdated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Call to action */}
              <div className="mt-12 text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-6">
                  Ready to dominate the leaderboard?
                </p>
                <Link 
                  href="/game" 
                  className="group relative inline-block px-12 py-5 text-2xl font-black text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 animate-gradient-x"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-gradient-x"></div>
                  <span className="relative z-10">PLAY NOW</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}