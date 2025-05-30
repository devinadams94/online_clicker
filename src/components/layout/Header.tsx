"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-gray-900/95 via-green-900/95 to-emerald-900/95 border-b border-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.3)] relative" style={{zIndex: 10000000}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] transition-all duration-300">
                PAPERCLIP CLICKER
              </Link>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Link href="/game" className="text-blue-300 hover:text-blue-400 font-bold drop-shadow-[0_0_5px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110">
                PLAY
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="animate-pulse h-8 w-20 bg-gradient-to-r from-green-400/20 to-lime-400/20 rounded"></div>
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 backdrop-blur bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 p-2 rounded-full border border-green-400/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="hidden sm:inline text-sm mr-1 text-green-300 font-medium">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <svg className={`w-4 h-4 transition-transform text-green-400 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 backdrop-blur-md bg-gray-900/95 rounded-xl shadow-2xl py-1 border border-green-400/30 shadow-[0_0_20px_rgba(74,222,128,0.3)]" style={{zIndex: 10000001, position: 'absolute'}}>
                    <div className="border-b border-green-400/20 px-4 py-2 text-sm text-gray-300">
                      Signed in as<br />
                      <span className="font-medium text-green-400">{session.user?.email}</span>
                    </div>
                    
                    {/* User Pages */}
                    <div className="py-1">
                      <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link href="/highscores" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Highscores
                      </Link>
                    </div>
                    
                    {/* Game Navigation */}
                    <div className="border-t border-green-400/20 pt-1 pb-1">
                      <div className="px-4 py-1 text-xs font-semibold text-green-400/60 uppercase tracking-wider">
                        Game Navigation
                      </div>
                      <Link href="/game" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Play Game
                      </Link>
                    </div>
                    
                    {/* Account Actions */}
                    <div className="border-t border-green-400/20">
                      <button
                        onClick={() => signOut({ callbackUrl: "https://paper-clips.com/" })}
                        className="flex w-full items-center text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-1 md:gap-2 items-center">
                <Link href="/highscores" className="hidden sm:block text-green-300 hover:text-green-400 font-medium mr-2 transition-all duration-300">
                  Highscores
                </Link>
                <Link href="/login" className="group relative px-4 py-2 text-sm font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-500 transition-all duration-300 group-hover:from-lime-400 group-hover:to-green-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-lime-500 to-green-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <span className="relative z-10">LOGIN</span>
                </Link>
                <Link href="/signup" className="group relative px-4 py-2 text-sm font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:from-green-400 group-hover:to-emerald-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <span className="relative z-10">SIGN UP</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}