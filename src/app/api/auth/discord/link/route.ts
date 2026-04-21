import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buildAuthorizeUrl, discordConfigured } from "@/lib/discord";
import crypto from "crypto";

/**
 * Start the Discord OAuth flow. Must be logged in and premium.
 * We sign a state token so the callback can verify it was initiated by us
 * for this specific user.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const url = new URL("/auth", req.url);
    url.searchParams.set("from", "/premium/link-discord");
    return NextResponse.redirect(url);
  }

  if (!session.user.isPremium) {
    return NextResponse.redirect(new URL("/premium", req.url));
  }

  if (!discordConfigured()) {
    return NextResponse.json(
      { error: "Discord is not configured on the server" },
      { status: 503 }
    );
  }

  // State = HMAC(userId + nonce, NEXTAUTH_SECRET). Verified in callback.
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${session.user.id}.${nonce}`;
  const secret = process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-me";
  const mac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const state = `${payload}.${mac}`;

  const authorizeUrl = buildAuthorizeUrl(state);
  return NextResponse.redirect(authorizeUrl);
}
