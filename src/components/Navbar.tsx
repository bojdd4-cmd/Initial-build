"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-icon.jpg"
              alt="BuildMyCycle logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <span className="font-bold text-white text-lg hidden sm:block">
            Build<span className="text-[#22c55e]">My</span>Cycle
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/compounds" className="text-[var(--text-secondary)] hover:text-white text-sm font-medium transition-colors">
            Compounds
          </Link>
          <Link href="/builder" className="text-[var(--text-secondary)] hover:text-white text-sm font-medium transition-colors">
            Stack Builder
          </Link>
          <Link href="/board" className="text-[var(--text-secondary)] hover:text-white text-sm font-medium transition-colors">
            Roid Board
          </Link>
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/account" className="text-[var(--text-secondary)] hover:text-white text-sm transition-colors">
                {session.user.username || session.user.email}
              </Link>
              <button
                onClick={() => signOut()}
                className="btn btn-secondary text-xs px-3 py-1.5"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn btn-secondary text-xs px-3 py-1.5">
                Sign In
              </Link>
              <Link href="/auth?mode=register" className="btn btn-primary text-xs px-3 py-1.5">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-4 flex flex-col gap-4">
          <Link href="/compounds" className="text-[var(--text-secondary)] text-sm" onClick={() => setMobileOpen(false)}>Compounds</Link>
          <Link href="/builder" className="text-[var(--text-secondary)] text-sm" onClick={() => setMobileOpen(false)}>Stack Builder</Link>
          <Link href="/board" className="text-[var(--text-secondary)] text-sm" onClick={() => setMobileOpen(false)}>Roid Board</Link>
          {session ? (
            <>
              <Link href="/account" className="text-[var(--text-secondary)] text-sm" onClick={() => setMobileOpen(false)}>My Account</Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn btn-secondary text-sm w-full">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn btn-secondary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/auth?mode=register" className="btn btn-primary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
