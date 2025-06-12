"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<string>("");
  const [sessionEndpoint, setSessionEndpoint] = useState<any>(null);

  useEffect(() => {
    // Get cookies
    setCookies(document.cookie);

    // Check session endpoint
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setSessionEndpoint(data))
      .catch(err => setSessionEndpoint({ error: err.message }));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Session Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">useSession Hook</h2>
          <p>Status: {status}</p>
          <pre className="text-sm mt-2">{JSON.stringify(session, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">Session Endpoint</h2>
          <pre className="text-sm">{JSON.stringify(sessionEndpoint, null, 2)}</pre>
        </div>

        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">Cookies</h2>
          <pre className="text-sm break-all">{cookies}</pre>
        </div>

        <div className="p-4 bg-gray-800 rounded">
          <h2 className="text-xl mb-2">Environment</h2>
          <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
          <p>NODE_ENV: {process.env.NODE_ENV}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded">
          <a href="/login" className="text-blue-400 hover:underline">Go to Login</a>
          {" | "}
          <a href="/game" className="text-blue-400 hover:underline">Go to Game</a>
        </div>
      </div>
    </div>
  );
}