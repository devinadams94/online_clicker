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
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-sm mt-2">
            <Link href="/direct-auth" className="text-primary-600 hover:underline">
              Direct Auth Check
            </Link>
            {" | "}
            <Link href="/fix-password" className="text-primary-600 hover:underline">
              Fix Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
