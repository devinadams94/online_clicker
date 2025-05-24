"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ScoreEntry {
  rank: number;
  username: string;
  isCurrentUser: boolean;
  paperclips: number;
  prestigeLevel: number;
  lastUpdated: string;
}

export default function HighscoresPage() {
  const { data: session } = useSession();
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
          prestigeLevel: 12,
          lastUpdated: "2025-05-20"
        },
        {
          rank: 2,
          username: "clipinator",
          isCurrentUser: false,
          paperclips: 8765432109,
          prestigeLevel: 10,
          lastUpdated: "2025-05-19"
        },
        {
          rank: 3,
          username: session?.user?.name || session?.user?.email?.split('@')[0] || "current-user",
          isCurrentUser: true,
          paperclips: 7654321098,
          prestigeLevel: 8,
          lastUpdated: "2025-05-22"
        },
        {
          rank: 4,
          username: "paperWizard",
          isCurrentUser: false,
          paperclips: 6543210987,
          prestigeLevel: 7,
          lastUpdated: "2025-05-18"
        },
        {
          rank: 5,
          username: "clipsUnlimited",
          isCurrentUser: false,
          paperclips: 5432109876,
          prestigeLevel: 6,
          lastUpdated: "2025-05-21"
        },
        {
          rank: 6,
          username: "clipGoat",
          isCurrentUser: false,
          paperclips: 4321098765,
          prestigeLevel: 5,
          lastUpdated: "2025-05-17"
        },
        {
          rank: 7,
          username: "paperclipEmpire",
          isCurrentUser: false,
          paperclips: 3210987654,
          prestigeLevel: 4,
          lastUpdated: "2025-05-16"
        },
        {
          rank: 8,
          username: "infiniteClips",
          isCurrentUser: false,
          paperclips: 2109876543,
          prestigeLevel: 3,
          lastUpdated: "2025-05-15"
        },
        {
          rank: 9,
          username: "clickerKing",
          isCurrentUser: false,
          paperclips: 1098765432,
          prestigeLevel: 2,
          lastUpdated: "2025-05-14"
        },
        {
          rank: 10,
          username: "clipHoarder",
          isCurrentUser: false,
          paperclips: 987654321,
          prestigeLevel: 1,
          lastUpdated: "2025-05-13"
        }
      ];
      
      setScores(mockData);
      setLoading(false);
    }, 1000);
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="card w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Highscores</h1>
        
        <div className="flex justify-center mb-6">
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab('allTime')}
              className={`px-4 py-2 ${activeTab === 'allTime' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              All-Time
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 ${activeTab === 'weekly' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              This Week
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paperclips</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prestige</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {scores.map((entry) => (
                    <tr 
                      key={entry.rank} 
                      className={entry.isCurrentUser ? "bg-primary-50 dark:bg-primary-900/20" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {entry.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                            ${entry.rank === 1 ? 'bg-yellow-400 text-yellow-800' : 
                              entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                              'bg-amber-600 text-amber-100'}`}>
                            {entry.rank}
                          </span>
                        ) : (
                          entry.rank
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {entry.isCurrentUser ? (
                          <span className="font-bold">{entry.username} (You)</span>
                        ) : (
                          entry.username
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.paperclips.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.prestigeLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center">
              <p className="mb-4">Want to climb the leaderboard?</p>
              <Link href="/game" className="btn-primary">
                Play Now
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}