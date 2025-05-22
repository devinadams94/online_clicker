import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-6xl font-bold text-center mb-8">404</h1>
        <p className="text-xl text-center mb-8">
          Page not found
        </p>
        <Link href="/" className="btn-primary text-lg px-8 py-3">
          Go Home
        </Link>
      </div>
    </div>
  );
}
