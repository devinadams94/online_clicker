"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FallbackLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test2@example.com");
  const [password, setPassword] = useState("test123");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/manual-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
        // Redirect to game after 1 second
        setTimeout(() => {
          router.push("/game");
        }, 1000);
      } else {
        setMessage("❌ " + (data.error || "Login failed"));
      }
    } catch (err) {
      setMessage("❌ Network error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-2 text-green-400">Fallback Login</h1>
        <p className="text-sm text-center mb-6 text-green-300/70">Direct authentication bypass</p>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg border ${
            message.startsWith("✅") 
              ? "bg-green-900/20 text-green-400 border-green-400/30" 
              : "bg-red-900/20 text-red-400 border-red-400/30"
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-green-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-green-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login (Bypass NextAuth)"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-green-300">
            This bypasses NextAuth and logs you in directly.
          </p>
          <div className="space-x-2">
            <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline text-sm">
              Regular Login
            </Link>
            <span className="text-green-300/50">|</span>
            <Link href="/debug-login" className="text-green-400 hover:text-green-300 hover:underline text-sm">
              Debug Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}