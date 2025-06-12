"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FixedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test2@example.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get CSRF token first
      const csrfResponse = await fetch("/api/auth/csrf");
      const csrfData = await csrfResponse.json();
      console.log("CSRF token:", csrfData.csrfToken);

      // Prepare the sign-in request
      const signInResponse = await fetch("/api/auth/signin/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          csrfToken: csrfData.csrfToken,
          json: true,
        }),
      });

      console.log("Sign-in response status:", signInResponse.status);
      console.log("Sign-in response headers:", Object.fromEntries(signInResponse.headers.entries()));

      // Check if response is JSON or HTML
      const contentType = signInResponse.headers.get("content-type");
      let responseData;
      
      if (contentType?.includes("application/json")) {
        responseData = await signInResponse.json();
        console.log("JSON response:", responseData);
        
        if (responseData.error) {
          setError(responseData.error === "CredentialsSignin" ? "Invalid email or password" : responseData.error);
        } else if (responseData.url) {
          // Success - redirect
          console.log("Success! Redirecting to:", responseData.url);
          router.push(responseData.url);
        }
      } else {
        // Probably HTML response - check for redirect
        const text = await signInResponse.text();
        console.log("Non-JSON response preview:", text.substring(0, 200));
        
        if (signInResponse.ok || signInResponse.redirected) {
          // Might be a success with redirect
          router.push("/game");
        } else {
          setError("Authentication failed. Server returned non-JSON response.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-2 text-green-400">Fixed Login</h1>
        <p className="text-sm text-center mb-6 text-green-300/70">Direct API approach</p>
        
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-xs text-green-300/70">
            Check browser console for detailed logs
          </p>
          <div className="space-x-2">
            <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline text-sm">
              Regular Login
            </Link>
            <span className="text-green-300/50">|</span>
            <Link href="/test-signin" className="text-green-400 hover:text-green-300 hover:underline text-sm">
              Test Endpoints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}