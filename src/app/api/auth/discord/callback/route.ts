import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addUserToGuildWithRole,
  discordConfigured,
  exchangeCodeForToken,
  getDiscordUser,
} from "@/lib/discord";
import crypto from "crypto";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (!discordConfigured()) {
    return NextResponse.redirect(
      new URL("/premium/link-discord?err=not-configured", req.url)
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");

  if (err || !code || !state) {
    return NextResponse.redirect(
      new URL(
        `/premium/link-discord?err=${encodeURIComponent(err ?? "missing-code")}`,
        req.url
      )
    );
  }

  // Verify state HMAC.
  const parts = state.split(".");
  if (parts.length !== 3) {
    return NextResponse.redirect(new URL("/premium/link-discord?err=bad-state", req.url));
  }
  const [stateUserId, nonce, mac] = parts;
  const secret = process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-me";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${stateUserId}.${nonce}`)
    .digest("hex");
  if (expected !== mac || stateUserId !== session.user.id) {
    return NextResponse.redirect(new URL("/premium/link-discord?err=bad-state", req.url));
  }

  // Still require active premium at callback time.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      premiumStatus: true,
      premiumUntil: true,
    },
  });
  if (
    !dbUser ||
    dbUser.premiumStatus !== "active" ||
    !dbUser.premiumUntil ||
    dbUser.premiumUntil.getTime() <= Date.now()
  ) {
    return NextResponse.redirect(new URL("/premium", req.url));
  }

  try {
    const token = await exchangeCodeForToken(code);
    const discordUser = await getDiscordUser(token.access_token);

    // Refuse to link if this Discord account is already linked to another user.
    const existing = await prisma.user.findUnique({
      where: { discordId: discordUser.id },
    });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.redirect(
        new URL("/premium/link-discord?err=already-linked", req.url)
      );
    }

    // Persist the link.
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        discordId: discordUser.id,
        discordUsername: discordUser.global_name ?? discordUser.username,
        discordLinkedAt: new Date(),
      },
    });

    // Add to guild + grant premium role.
    const roleId = process.env.DISCORD_PREMIUM_ROLE_ID!;
    await addUserToGuildWithRole(discordUser.id, token.access_token, roleId);

    return NextResponse.redirect(new URL("/premium/link-discord?ok=1", req.url));
  } catch (e) {
    console.error("Discord link callback failed:", e);
    return NextResponse.redirect(
      new URL("/premium/link-discord?err=discord-error", req.url)
    );
  }
}
