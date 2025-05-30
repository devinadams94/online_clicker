"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });


        if (result?.error) {
          setError(`Invalid email or password`);
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Login request failed. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to the game page after successful login
      router.push("/game");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-400">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 text-red-400 rounded-lg border border-red-400/30">
            {error}
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
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_20px_rgba(74,222,128,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm mt-4 text-green-300">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-green-400 hover:text-green-300 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-sm mt-2 text-green-300">
            <Link href="/direct-auth" className="text-green-400 hover:text-green-300 hover:underline">
              Direct Auth Check
            </Link>
            <span className="text-green-300/50">{" | "}</span>
            <Link href="/fix-password" className="text-green-400 hover:text-green-300 hover:underline">
              Fix Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
