"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DebugLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test2@example.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDebugInfo(null);

    try {
      // First, test the direct auth endpoint
      console.log("Testing direct auth endpoint...");
      const directAuthResponse = await fetch("/api/direct-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const directAuthData = await directAuthResponse.json();
      console.log("Direct auth response:", directAuthData);

      // Now test the NextAuth endpoint directly
      console.log("Testing NextAuth endpoint...");
      const csrfResponse = await fetch("/api/auth/csrf");
      const csrfData = await csrfResponse.json();
      console.log("CSRF token:", csrfData);

      // Try to call the NextAuth signin endpoint directly
      const signinResponse = await fetch("/api/auth/signin/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          csrfToken: csrfData.csrfToken,
        }),
      });

      console.log("Signin response status:", signinResponse.status);
      console.log("Signin response headers:", Object.fromEntries(signinResponse.headers.entries()));
      
      let signinData;
      const contentType = signinResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        signinData = await signinResponse.json();
      } else {
        signinData = await signinResponse.text();
      }
      console.log("Signin response data:", signinData);

      // Set debug info
      setDebugInfo({
        directAuth: {
          status: directAuthResponse.status,
          data: directAuthData,
        },
        csrf: csrfData,
        signin: {
          status: signinResponse.status,
          headers: Object.fromEntries(signinResponse.headers.entries()),
          data: signinData,
        },
      });

      // If direct auth succeeded, try manual signin
      if (directAuthResponse.ok && directAuthData.isValid) {
        setError("Password is valid but NextAuth signin failed. Check debug info below.");
      } else {
        setError("Authentication failed. Check debug info below.");
      }
    } catch (err) {
      console.error("Debug login error:", err);
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      setDebugInfo({ error: err instanceof Error ? err.toString() : err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
          <h1 className="text-2xl font-bold text-center mb-6 text-green-400">Debug Login</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-lg border border-red-400/30">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mb-6">
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
              {loading ? "Testing..." : "Debug Login"}
            </button>
          </form>

          {debugInfo && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-green-400/20">
              <h2 className="text-lg font-bold text-green-400 mb-2">Debug Information:</h2>
              <pre className="text-xs text-green-300 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}