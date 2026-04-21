import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { paymentLinkForUser } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Not logged in — send to auth with return path.
    redirect("/auth?from=/premium");
  }

  // Re-read from DB so a recent upgrade/cancel reflects immediately.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      premiumStatus: true,
      premiumUntil: true,
      discordId: true,
    },
  });

  const isActive =
    user?.premiumStatus === "active" &&
    !!user.premiumUntil &&
    user.premiumUntil.getTime() > Date.now();

  const checkoutUrl = paymentLinkForUser(session.user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] text-[#22c55e] font-bold uppercase mb-3">
          Upgrade
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          RoidAI <span style={{
            background: "linear-gradient(135deg, #22c55e, #86efac)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Premium</span>
        </h1>
        <p className="text-[#9999bb] text-lg">
          Sharper analysis. Private channels. Sourcing access.
        </p>
      </div>

      {/* Pricing card */}
      <div className="card p-8 border border-[#22c55e]/30 bg-gradient-to-b from-[#22c55e]/5 to-transparent">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-black text-white">$3.99</span>
          <span className="text-[#9999bb] font-semibold">/ week</span>
        </div>
        <p className="text-[#555577] text-sm mb-8">Cancel anytime. No commitment.</p>

        <ul className="space-y-3 mb-8">
          {[
            {
              title: "RoidAI Premium model",
              desc: "Deeper reasoning, more nuanced risk analysis, pharmacology-grade recommendations.",
            },
            {
              title: "Private Discord channels",
              desc: "Premium-only channels with vetted members and direct admin access.",
            },
            {
              title: `"Need Source?" access`,
              desc: "Unlocks the sourcing channel with vetted suggestions from trusted members.",
            },
            {
              title: "Priority feature requests",
              desc: "Your feedback shapes the roadmap first.",
            },
          ].map((f) => (
            <li key={f.title} className="flex gap-3">
              <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-white font-semibold text-sm">{f.title}</div>
                <div className="text-[#9999bb] text-sm">{f.desc}</div>
              </div>
            </li>
          ))}
        </ul>

        {isActive ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e] text-sm font-semibold p-4 text-center">
              ✓ You&apos;re Premium through{" "}
              {user!.premiumUntil!.toLocaleDateString()}.
            </div>
            {user?.discordId ? (
              <Link
                href="/account"
                className="block w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl text-center transition-all"
              >
                MANAGE ACCOUNT
              </Link>
            ) : (
              <Link
                href="/premium/link-discord"
                className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black px-8 py-4 rounded-xl text-center transition-all"
              >
                LINK DISCORD → UNLOCK CHANNELS
              </Link>
            )}
          </div>
        ) : (
          <a
            href={checkoutUrl}
            className="block w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-8 py-4 rounded-xl text-center transition-all"
            style={{ boxShadow: "0 0 32px rgba(34,197,94,0.35)" }}
          >
            UPGRADE FOR $3.99 / WEEK →
          </a>
        )}
      </div>

      <p className="text-[#555577] text-xs text-center mt-6">
        Secure payment via Stripe. You&apos;ll be redirected to Stripe&apos;s hosted checkout.
        After paying, come back here to link your Discord.
      </p>
    </div>
  );
}
