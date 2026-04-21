"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * Post-checkout landing. Stripe takes a few seconds to fire the webhook, so
 * we poll the session until isPremium flips true, then prompt to link Discord.
 */
export default function PremiumSuccessPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [checks, setChecks] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.isPremium) return;
    if (checks > 20) return; // give up after ~40s

    const t = setTimeout(async () => {
      await update();
      setChecks((c) => c + 1);
    }, 2000);
    return () => clearTimeout(t);
  }, [session, status, update, checks]);

  if (status === "loading") {
    return <div className="max-w-xl mx-auto px-4 py-20 text-[#9999bb]">Loading…</div>;
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
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl"
            >
              START USING ROIDAI PREMIUM →
            </Link>
          ) : (
            <Link
              href="/premium/link-discord"
              className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-black px-8 py-4 rounded-xl"
            >
              LINK DISCORD →
            </Link>
          )}
        </>
      ) : checks > 20 ? (
        <>
          <h1 className="text-2xl font-black text-white mb-3">Still processing…</h1>
          <p className="text-[#9999bb] mb-6">
            Your payment is being confirmed. This usually takes under a minute. If
            it&apos;s been longer, refresh this page or check your email for a Stripe
            receipt.
          </p>
          <button
            onClick={() => {
              setChecks(0);
              void update();
            }}
            className="btn btn-secondary"
          >
            Check again
          </button>
        </>
      ) : (
        <>
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <h1 className="text-2xl font-black text-white mb-3">Confirming payment…</h1>
          <p className="text-[#9999bb]">
            Hang tight — Stripe is notifying our server.
          </p>
        </>
      )}
    </div>
  );
}
