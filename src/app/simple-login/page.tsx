export default function SimpleLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Simple Login Test</h1>
        
        <form action="/api/auth/callback/credentials" method="POST">
          <input type="hidden" name="csrfToken" value="" />
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue="test2@example.com"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              defaultValue="test123"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Direct Login
          </button>
        </form>
        
        <div className="mt-4 text-gray-400 text-sm">
          <p>This form submits directly to the NextAuth endpoint.</p>
          <p>Default credentials are pre-filled.</p>
        </div>
      </div>
    </div>
  );
}