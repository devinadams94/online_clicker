"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Paperclip Clicker
              </Link>
            </div>
            <div className="ml-6 flex space-x-4">
              {/* Strategic Modeling link removed */}
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
