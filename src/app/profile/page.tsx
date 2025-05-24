"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserStats {
  totalPaperclips: number;
  highestPaperclips: number;
  prestigeCount: number;
  lastActive: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the user's stats from your API here
    if (status === "authenticated" && session?.user) {
      // Simulating API call with fake data
      setTimeout(() => {
        setUserStats({
          totalPaperclips: 5420000,
          highestPaperclips: 2350000,
          prestigeCount: 3,
          lastActive: new Date().toISOString(),
        });
        setLoading(false);
      }, 800);
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="card w-full max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="card w-full max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="py-8">
            <p className="text-xl mb-6">Please sign in to view your profile</p>
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="card w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Account Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {session?.user?.email}</p>
                <p><span className="font-medium">Username:</span> {session?.user?.name || "Not set"}</p>
                <p><span className="font-medium">Joined:</span> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Account Actions</h2>
              <div className="space-y-2">
                <Link href="/fix-password" className="text-primary-600 hover:underline block">
                  Change Password
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Game Statistics</h2>
            {userStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-sm text-primary-600 dark:text-primary-400">Total Paperclips</p>
                  <p className="text-2xl font-bold">{userStats.totalPaperclips.toLocaleString()}</p>
                </div>
                <div className="card bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-sm text-primary-600 dark:text-primary-400">Highest in Single Run</p>
                  <p className="text-2xl font-bold">{userStats.highestPaperclips.toLocaleString()}</p>
                </div>
                <div className="card bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-sm text-primary-600 dark:text-primary-400">Prestige Count</p>
                  <p className="text-2xl font-bold">{userStats.prestigeCount}</p>
                </div>
                <div className="card bg-primary-50 dark:bg-primary-900/20">
                  <p className="text-sm text-primary-600 dark:text-primary-400">Last Active</p>
                  <p className="text-2xl font-bold">{new Date(userStats.lastActive).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p>No game statistics available yet. Start playing to see your stats!</p>
            )}
            
            <div className="mt-6 text-center">
              <Link href="/game" className="btn-primary">
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}