import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ ok?: string; err?: string }>;
}

const ERR_MESSAGES: Record<string, string> = {
  "not-configured": "Discord isn't configured on the server yet. Contact support.",
  "bad-state": "Security check failed. Please try linking again.",
  "already-linked": "That Discord account is already linked to a different BuildMyCycle user.",
  "discord-error": "Discord rejected the link. Please try again in a moment.",
  "missing-code": "Authorization was cancelled. Please try again.",
  "access_denied": "You cancelled the authorization.",
};

export default async function LinkDiscordPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth?from=/premium/link-discord");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      premiumStatus: true,
      premiumUntil: true,
      discordId: true,
      discordUsername: true,
    },
  });

  const isActive =
    user?.premiumStatus === "active" &&
    !!user.premiumUntil &&
    user.premiumUntil.getTime() > Date.now();

  if (!isActive) redirect("/premium");

  const params = await searchParams;
  const ok = params.ok === "1";
  const errMsg = params.err ? ERR_MESSAGES[params.err] ?? "Something went wrong." : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3.1a.074.074 0 0 0-.079.037 13.785 13.785 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.93 4.369a.07.07 0 0 0-.032.027C2.533 9.045 1.617 13.58 2.07 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.245.197.372.293a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.106c.36.698.772 1.363 1.226 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Link your Discord</h1>
        <p className="text-[#9999bb]">
          We&apos;ll add you to the server and grant the Premium role automatically.
        </p>
      </div>

      {ok && user?.discordUsername && (
        <div className="rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e] text-sm p-4 mb-6 text-center">
          ✓ Linked as <span className="font-bold">{user.discordUsername}</span>. You&apos;ve been added to the server and granted the Premium role.
        </div>
      )}

      {errMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm p-4 mb-6 text-center">
          {errMsg}
        </div>
      )}

      {user?.discordId ? (
        <div className="card p-6 text-center space-y-4">
          <div className="text-[#9999bb]">
            Linked as{" "}
            <span className="text-white font-semibold">{user.discordUsername}</span>
          </div>
          <Link
            href="/builder"
            className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-black font-black px-6 py-3 rounded-xl"
          >
            START USING ROIDAI PREMIUM →
          </Link>
        </div>
      ) : (
        <a
          href="/api/auth/discord/link"
          className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black px-8 py-4 rounded-xl text-center"
          style={{ boxShadow: "0 0 24px rgba(88,101,242,0.35)" }}
        >
          CONNECT DISCORD →
        </a>
      )}

      <p className="text-[#555577] text-xs text-center mt-6">
        We only store your Discord user ID and username. You can unlink anytime
        from your account page.
      </p>
    </div>
  );
}
