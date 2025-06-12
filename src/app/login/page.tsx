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
      // Ensure email and password are provided
      if (!email || !password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      console.log("Attempting login with:", email);

      // Call signIn with proper error handling
      try {
        const result = await signIn("credentials", {
          email: email.trim(),
          password: password,
          redirect: false,
          callbackUrl: "/game"
        });

        console.log("SignIn result:", result);

        if (result?.error) {
          console.error("SignIn error:", result.error);
          if (result.error === "CredentialsSignin") {
            setError("Invalid email or password");
          } else {
            setError(result.error);
          }
          setLoading(false);
        } else if (result?.ok && result?.url) {
          // Success - use router to navigate
          console.log("Login successful, redirecting...");
          router.push(result.url);
          router.refresh();
        } else {
          console.error("Unexpected result:", result);
          setError("Login failed. Please try again.");
          setLoading(false);
        }
      } catch (signInError) {
        console.error("SignIn catch error:", signInError);
        throw signInError; // Re-throw to be caught by outer try-catch
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Provide more specific error messages
      if (err instanceof TypeError && err.message.includes("Load failed")) {
        setError("Unable to connect to server. Please check your connection and try again.");
      } else if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      
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
        
        <form onSubmit={handleSubmit} noValidate>
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
              placeholder="test@example.com"
              required
              autoComplete="email"
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
              placeholder="password123"
              required
              autoComplete="current-password"
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
          
          {/* Test credentials hint */}
          <div className="mt-4 p-3 bg-green-900/20 border border-green-400/20 rounded-lg">
            <p className="text-xs text-green-300/70">Test Account:</p>
            <p className="text-xs text-green-400">Email: test@example.com</p>
            <p className="text-xs text-green-400">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}