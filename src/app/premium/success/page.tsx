"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PremiumSuccessPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [checks, setChecks] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  /** Call the sync endpoint, then refresh the session token from DB. */
  const syncAndRefresh = useCallback(async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/stripe/sync", { method: "POST" });
      const data = await res.json();
      if (data.premium) {
        // Premium is now active in DB — refresh the JWT so session reflects it.
        await update();
      } else if (data.error) {
        setSyncMessage(data.error);
      } else if (data.message) {
        setSyncMessage(data.message);
      }
    } catch {
      setSyncMessage("Network error — check your connection and try again.");
    } finally {
      setSyncing(false);
    }
  }, [update]);

  // Auto-sync every 3 seconds for the first 45 seconds.
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.isPremium) return;
    if (checks > 15) return; // 15 × 3s = 45s

    const t = setTimeout(async () => {
      await syncAndRefresh();
      setChecks((c) => c + 1);
    }, 3000);

    return () => clearTimeout(t);
  }, [session, status, syncAndRefresh, checks]);

  if (status === "loading") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-[#9999bb]">
        Loading…
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/auth");
    return null;
  }

  const premium = !!session?.user?.isPremium;
  const discordLinked = !!session?.user?.discordLinked;

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {premium ? (
        <>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-white mb-3">
            Welcome to <span className="text-[#22c55e]">Premium</span>
          </h1>
          <p className="text-[#9999bb] mb-8">
            Your subscription is active. Link your Discord to unlock the private
            channels and source access.
          </p>
          {discordLinked ? (
            <Link
              href="/builder"
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl transition-all"
            >
              START USING ROIDAI PREMIUM →
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                href="/premium/link-discord"
                className="block bg-[#5865F2] hover:bg-[#4752C4] text-white font-black px-8 py-4 rounded-xl transition-all"
              >
                LINK DISCORD → UNLOCK CHANNELS
              </Link>
              <Link
                href="/builder"
                className="block text-sm text-[#9999bb] hover:text-white transition-colors"
              >
                Skip for now, go to Stack Builder →
              </Link>
            </div>
          )}
        </>
      ) : checks > 15 ? (
        /* Timed out — show manual sync button */
        <>
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-black text-white mb-3">
            Taking longer than usual…
          </h1>
          <p className="text-[#9999bb] mb-6">
            Your payment went through on Stripe, but we haven&apos;t confirmed it
            yet. Click the button below to sync manually.
          </p>
          {syncMessage && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm p-4 mb-4">
              {syncMessage}
            </div>
          )}
          <button
            onClick={() => {
              setChecks(0);
              void syncAndRefresh();
            }}
            disabled={syncing}
            className="btn btn-primary w-full mb-3"
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                Checking Stripe…
              </span>
            ) : (
              "Sync Premium Status"
            )}
          </button>
          <p className="text-[#555577] text-xs">
            If this keeps failing, make sure you paid using the same email as
            your BuildMyCycle account, then contact support.
          </p>
        </>
      ) : (
        /* Still polling */
        <>
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <h1 className="text-2xl font-black text-white mb-3">
            Confirming payment…
          </h1>
          <p className="text-[#9999bb] mb-2">
            Syncing with Stripe — this usually takes under 10 seconds.
          </p>
          <p className="text-[#555577] text-sm">
            Check {checks}/15
          </p>
          {syncMessage && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm p-4 mt-4">
              {syncMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
}
