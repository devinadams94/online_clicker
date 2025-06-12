"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmergencyLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Set a flag in localStorage to bypass auth checks
    localStorage.setItem("emergency-auth", "true");
    localStorage.setItem("user-email", "test2@example.com");
    localStorage.setItem("user-id", "emergency-user");
    
    // Set some cookies that might help
    document.cookie = "auth-bypass=true; path=/";
    document.cookie = "user-email=test2@example.com; path=/";
    
    // Redirect to game
    setTimeout(() => {
      router.push("/game");
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Emergency Login</h1>
        <p className="text-green-300">Bypassing authentication...</p>
        <p className="text-green-300 mt-2">Redirecting to game in 1 second...</p>
      </div>
    </div>
  );
}