import { useState, FormEvent } from "react";
import Link from "next/link";

export default function TestLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/check-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        status: response.status,
        data
      });
    } catch (error) {
      console.error("Error testing auth:", error);
      setResult({
        success: false,
        error: String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test Login Page</h1>
        
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Testing..." : "Test Authentication"}
          </button>
        </form>
        
        {result && (
          <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm mt-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to regular login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}