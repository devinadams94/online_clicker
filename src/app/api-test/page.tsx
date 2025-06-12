"use client";

import { useState } from "react";

export default function ApiTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Simple GET
    try {
      addResult("GET /api/test", "Testing...");
      const response = await fetch("/api/test");
      const data = await response.json();
      addResult("GET /api/test", { status: response.status, data });
    } catch (error) {
      addResult("GET /api/test", { error: error instanceof Error ? error.message : "Unknown error" });
    }

    // Test 2: Simple POST
    try {
      addResult("POST /api/test", "Testing...");
      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" }),
      });
      const data = await response.json();
      addResult("POST /api/test", { status: response.status, data });
    } catch (error) {
      addResult("POST /api/test", { error: error instanceof Error ? error.message : "Unknown error" });
    }

    // Test 3: NextAuth CSRF
    try {
      addResult("GET /api/auth/csrf", "Testing...");
      const response = await fetch("/api/auth/csrf");
      const data = await response.json();
      addResult("GET /api/auth/csrf", { status: response.status, data });
    } catch (error) {
      addResult("GET /api/auth/csrf", { error: error instanceof Error ? error.message : "Unknown error" });
    }

    // Test 4: Direct window.location test
    try {
      addResult("Window location", {
        href: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        host: window.location.host,
      });
    } catch (error) {
      addResult("Window location", { error: error instanceof Error ? error.message : "Unknown error" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">API Test Page</h1>
          
          <button
            onClick={runTests}
            disabled={loading}
            className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? "Running Tests..." : "Run API Tests"}
          </button>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{result.test}</h3>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="/login" className="text-blue-400 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}