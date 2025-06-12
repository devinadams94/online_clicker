"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearStoragePage() {
  const [cleared, setCleared] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Clear all localStorage items related to the game
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('paperclip-game-storage') || key.includes('zustand'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      console.log('Removing localStorage key:', key);
      localStorage.removeItem(key);
    });
    
    setCleared(true);
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl text-white mb-4">
          {cleared ? 'Storage Cleared!' : 'Clearing Storage...'}
        </h1>
        <p className="text-gray-400">
          {cleared ? 'Redirecting to login...' : 'Please wait...'}
        </p>
      </div>
    </div>
  );
}