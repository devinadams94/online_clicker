import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold text-center mb-8">Paperclip Clicker</h1>
        <p className="text-xl text-center mb-8">
          Welcome to Paperclip Clicker, a game about clicking to make paperclips!
        </p>
        <div className="flex gap-4">
          <Link href="/game" className="btn-primary text-lg px-8 py-3">
            Play Now
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-3">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
