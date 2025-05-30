"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function FixPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/fix-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          newPassword: password 
        }),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        status: response.status,
        data
      });
    } catch (error) {
      setResult({
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-400">Fix Account Password</h1>
        
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
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100 placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-green-300">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100 placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        
        {result && (
          <div className={`mt-4 p-3 rounded-lg border ${result.success ? "bg-green-900/20 text-green-400 border-green-400/30" : "bg-red-900/20 text-red-400 border-red-400/30"}`}>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm mt-4 text-green-300">
            <Link href="/direct-auth" className="text-green-400 hover:text-green-300 hover:underline">
              Check Authentication
            </Link>
          </p>
          <p className="text-sm mt-2 text-green-300">
            <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}