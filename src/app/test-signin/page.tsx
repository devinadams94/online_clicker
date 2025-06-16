"use client";

import { useState } from "react";

interface TestResult {
  status: number;
  contentType: string | null;
  data: any;
}

interface TestResults {
  providers?: TestResult;
  session?: TestResult;
  signin?: TestResult;
  csrf?: TestResult;
  error?: string;
}

export default function TestSigninPage() {
  const [results, setResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setResults({});

    try {
      // Test 1: Check providers
      const providersRes = await fetch("/api/auth/providers");
      const providersText = await providersRes.text();
      let providersData;
      try {
        providersData = JSON.parse(providersText);
      } catch {
        providersData = providersText;
      }
      
      setResults(prev => ({ ...prev, providers: { 
        status: providersRes.status,
        contentType: providersRes.headers.get('content-type'),
        data: providersData 
      }}));

      // Test 2: Check session
      const sessionRes = await fetch("/api/auth/session");
      const sessionText = await sessionRes.text();
      let sessionData;
      try {
        sessionData = JSON.parse(sessionText);
      } catch {
        sessionData = sessionText;
      }
      
      setResults(prev => ({ ...prev, session: { 
        status: sessionRes.status,
        contentType: sessionRes.headers.get('content-type'),
        data: sessionData 
      }}));

      // Test 3: Check signin page
      const signinRes = await fetch("/api/auth/signin");
      const signinText = await signinRes.text();
      
      setResults((prev: TestResults) => ({ ...prev, signin: { 
        status: signinRes.status,
        contentType: signinRes.headers.get('content-type'),
        data: {
          isHtml: signinText.includes('<!DOCTYPE') || signinText.includes('<html'),
          preview: signinText.substring(0, 200)
        }
      }}));

      // Test 4: Try calling signIn from next-auth/react
      try {
        // Dynamic import to avoid issues
        const { signIn } = await import('next-auth/react');
        console.log("signIn function:", typeof signIn, signIn);
        
        // Try to get the signIn URL
        const signInUrl = `/api/auth/signin/credentials`;
        const urlRes = await fetch(signInUrl);
        
        setResults(prev => ({ ...prev, signInUrl: { 
          url: signInUrl,
          status: urlRes.status,
          contentType: urlRes.headers.get('content-type'),
        }}));
      } catch (err) {
        setResults((prev: TestResults) => ({ ...prev, signInError: String(err) }));
      }

    } catch (error) {
      setResults((prev: TestResults) => ({ ...prev, error: String(error) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">NextAuth Signin Test</h1>
          
          <button
            onClick={runTests}
            disabled={loading}
            className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? "Running Tests..." : "Run Tests"}
          </button>

          <div className="space-y-4">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="bg-gray-700 rounded p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{key}</h3>
                <pre className="text-sm text-gray-300 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(value, null, 2)}
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