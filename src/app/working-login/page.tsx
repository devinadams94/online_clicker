"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WorkingLoginPage() {
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
      // First get CSRF token
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      // Use FormData to match what NextAuth expects
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("csrfToken", csrfToken);

      // Call NextAuth callback directly
      const response = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      console.log("Response status:", response.status);
      console.log("Response URL:", response.url);

      // NextAuth redirects on success, so check if we got redirected
      if (response.redirected || response.url.includes("/game")) {
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/game";
        }, 500);
      } else if (response.url.includes("error=CredentialsSignin")) {
        setMessage("❌ Invalid email or password");
      } else {
        // Try to get response text for debugging
        const text = await response.text();
        console.log("Response text:", text);
        setMessage("❌ Login failed. Check console for details.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Use a form that submits directly
  const handleDirectSubmit = async () => {
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();
    
    // Create and submit a form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/callback/credentials";
    
    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfToken";
    csrfInput.value = csrfToken;
    
    const emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "email";
    emailInput.value = email;
    
    const passwordInput = document.createElement("input");
    passwordInput.type = "hidden";
    passwordInput.name = "password";
    passwordInput.value = password;
    
    form.appendChild(csrfInput);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="w-full max-w-md backdrop-blur-md bg-gradient-to-br from-gray-900/95 via-green-900/95 to-emerald-900/95 rounded-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] p-8 border border-green-400/30">
        <h1 className="text-2xl font-bold text-center mb-2 text-green-400">Working Login</h1>
        <p className="text-sm text-center mb-6 text-green-300/70">Direct NextAuth callback approach</p>
        
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
            className="w-full mb-2 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login (AJAX)"}
          </button>
        </form>

        <button
          onClick={handleDirectSubmit}
          className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg"
        >
          Login (Form Submit)
        </button>

        <div className="text-center space-y-2">
          <p className="text-xs text-green-300/70">
            If AJAX fails, try the Form Submit button which creates a real form submission.
          </p>
          <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline text-sm">
            Back to Regular Login
          </Link>
        </div>
      </div>
    </div>
  );
}