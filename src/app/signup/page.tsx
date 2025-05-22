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
      console.log("Signup response:", data);

      if (!response.ok) {
        let errorMsg = data.message || "Something went wrong";
        if (data.error) {
          errorMsg += `: ${data.error}`;
        }
        console.error("Signup failed:", errorMsg, data);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Redirect to login page after successful signup
      router.push("/login?registered=true");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
          
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
              minLength={6}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
