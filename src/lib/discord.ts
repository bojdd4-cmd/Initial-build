/**
 * Discord helpers — OAuth2 + bot role management.
 *
 * Env vars required:
 *   DISCORD_CLIENT_ID        (OAuth app)
 *   DISCORD_CLIENT_SECRET    (OAuth app)
 *   DISCORD_BOT_TOKEN        (Bot token from the same app; bot must be in
 *                             the guild with the "Manage Roles" permission,
 *                             and the Premium role must be BELOW the bot's
 *                             highest role in the server role list.)
 *   DISCORD_GUILD_ID         (your server ID)
 *   DISCORD_PREMIUM_ROLE_ID  (role granted to paid + linked users)
 *   DISCORD_SOURCE_CHANNEL_ID (optional — for "Need Source?" deep links)
 *   DISCORD_REDIRECT_URI     (defaults to `${NEXTAUTH_URL}/api/auth/discord/callback`)
 */

const API_BASE = "https://discord.com/api/v10";

export function discordConfigured(): boolean {
  return !!(
    process.env.DISCORD_CLIENT_ID &&
    process.env.DISCORD_CLIENT_SECRET &&
    process.env.DISCORD_BOT_TOKEN &&
    process.env.DISCORD_GUILD_ID &&
    process.env.DISCORD_PREMIUM_ROLE_ID
  );
}

export function getRedirectUri(): string {
  return (
    process.env.DISCORD_REDIRECT_URI ??
    `${process.env.NEXTAUTH_URL ?? "https://buildmycycle.com"}/api/auth/discord/callback`
  );
}

/** Build the OAuth2 authorize URL. `state` is our CSRF/user token. */
export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "identify guilds.join",
    state,
    prompt: "consent",
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/** Exchange an OAuth `code` for an access token. */
export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
  });

  const res = await fetch(`${API_BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord token exchange failed: ${res.status} ${err}`);
  }

  return res.json();
}

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  discriminator: string;
  avatar: string | null;
}

/** Get the user's Discord profile using a user access token. */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Discord /users/@me failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Add the user to the guild (if not already a member) AND assign the premium
 * role in one PUT. Requires the `guilds.join` OAuth scope on the access token
 * and a bot with "Manage Roles" + "Create Instant Invite" permissions.
 *
 * Idempotent: if the user is already in the guild, Discord returns 204.
 */
export async function addUserToGuildWithRole(
  discordUserId: string,
  accessToken: string,
  roleId: string
): Promise<void> {
  const guildId = process.env.DISCORD_GUILD_ID!;
  const botToken = process.env.DISCORD_BOT_TOKEN!;

  const res = await fetch(
    `${API_BASE}/guilds/${guildId}/members/${discordUserId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        roles: [roleId],
      }),
    }
  );

  // 201 = user added, 204 = user already in guild (no change)
  if (res.status === 201 || res.status === 204) return;

  // Already a member but we still want to grant the role — fall through to PUT role
  if (res.status === 204 || res.status === 200) return;

  // If adding failed (e.g. already member without roles field taking effect),
  // ensure role is assigned directly:
  await assignRole(discordUserId, roleId);
}

/** PUT a role onto an existing guild member using the bot token. */
export async function assignRole(
  discordUserId: string,
  roleId: string
): Promise<void> {
  const guildId = process.env.DISCORD_GUILD_ID!;
  const botToken = process.env.DISCORD_BOT_TOKEN!;

  const res = await fetch(
    `${API_BASE}/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bot ${botToken}` },
    }
  );
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(`Discord assignRole failed: ${res.status} ${err}`);
  }
}

/** Remove the premium role (called when a subscription ends). */
export async function removeRole(
  discordUserId: string,
  roleId: string
): Promise<void> {
  const guildId = process.env.DISCORD_GUILD_ID!;
  const botToken = process.env.DISCORD_BOT_TOKEN!;

  const res = await fetch(
    `${API_BASE}/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` },
    }
  );
  // 204 = success, 404 = member or role already gone — both fine
  if (!res.ok && res.status !== 204 && res.status !== 404) {
    const err = await res.text();
    console.error(`Discord removeRole failed: ${res.status} ${err}`);
  }
}
