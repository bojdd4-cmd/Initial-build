"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface Props {
  /** Optional compound name so we can pass context into the source channel link. */
  compoundName?: string;
  /** Visual size. "sm" is inline-in-list sized, "md" is card-size. */
  size?: "sm" | "md";
}

/**
 * "Need Source?" CTA with 4 states:
 *   1. Logged out            → Sign In
 *   2. Logged in, no premium → Upgrade
 *   3. Premium, no Discord   → Link Discord
 *   4. Premium + Discord     → Open source channel
 *
 * The source channel link lives in NEXT_PUBLIC_DISCORD_SOURCE_CHANNEL_URL
 * (defaults to the main invite if the channel URL isn't set yet).
 */
export default function NeedSourceButton({ compoundName, size = "md" }: Props) {
  const { data: session, status } = useSession();

  const sourceChannelUrl =
    process.env.NEXT_PUBLIC_DISCORD_SOURCE_CHANNEL_URL ??
    "https://discord.gg/EzBEJJ5xKZ";

  const base =
    size === "sm"
      ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all"
      : "inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all";

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  // Loading — render a placeholder to avoid layout shift.
  if (status === "loading") {
    return (
      <span className={`${base} bg-[#1a1a2a] text-[#555577] cursor-wait`}>
        <span className={iconSize}>⋯</span>
        Need Source?
      </span>
    );
  }

  // State 1: not logged in
  if (!session?.user?.id) {
    return (
      <Link
        href="/auth?from=/premium"
        className={`${base} bg-[#1a1a2a] border border-[#2a2a3d] text-[#9999bb] hover:border-[#22c55e]/40 hover:text-white`}
        title="Sign in to access sourcing"
      >
        <LockIcon className={iconSize} />
        Need Source? <span className="text-[#22c55e]">Sign In</span>
      </Link>
    );
  }

  // State 2: logged in, not premium
  if (!session.user.isPremium) {
    return (
      <Link
        href="/premium"
        className={`${base} bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/15`}
        title="Upgrade to Premium for source access"
      >
        <LockIcon className={iconSize} />
        Need Source? <span className="underline">Upgrade</span>
      </Link>
    );
  }

  // State 3: premium, Discord not linked
  if (!session.user.discordLinked) {
    return (
      <Link
        href="/premium/link-discord"
        className={`${base} bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/20`}
        title="Link Discord to access the source channel"
      >
        <DiscordIcon className={iconSize} />
        Need Source? <span className="underline">Link Discord</span>
      </Link>
    );
  }

  // State 4: premium + Discord linked → open source channel
  const hint = compoundName ? ` · ${compoundName}` : "";
  return (
    <a
      href={sourceChannelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-[#22c55e] hover:bg-[#16a34a] text-black`}
      style={{ boxShadow: "0 0 16px rgba(34,197,94,0.3)" }}
      title={`Open Discord source channel${hint}`}
    >
      <DiscordIcon className={iconSize} />
      Need Source?
    </a>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3.1a.074.074 0 0 0-.079.037 13.785 13.785 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.93 4.369a.07.07 0 0 0-.032.027C2.533 9.045 1.617 13.58 2.07 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.245.197.372.293a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.106c.36.698.772 1.363 1.226 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" />
    </svg>
  );
}
