"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.message || "Something went wrong";
        if (data.error) {
          errorMsg += `: ${data.error}`;
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Redirect to login page after successful signup
      router.push("/login?registered=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-400">Sign Up</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-lg border border-red-400/30">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-green-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100 placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
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
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-green-400/30 rounded-lg text-green-100 placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              minLength={6}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm mt-4 text-green-300">
            Already have an account?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
