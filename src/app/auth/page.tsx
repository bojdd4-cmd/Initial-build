"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isRegister = searchParams.get("mode") === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/builder");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Registration failed.");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign-in failed. Please sign in manually.");
      return;
    }

    router.push("/builder");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold gradient-text">BuildMyCycle</span>
          </Link>
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            Evidence-based steroid cycle planning
          </p>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            {isRegister ? "Create an account" : "Sign in"}
          </h1>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Username
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Confirm Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth?mode=register"
                  className="text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors"
                >
                  Create one
                </Link>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          For educational and harm-reduction purposes only.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
