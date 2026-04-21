import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe client. Null when the secret key is unset so the rest of the app
 * can gracefully degrade (e.g. /premium page still renders, but the upgrade
 * CTA is disabled).
 */
export const stripe: Stripe | null = secret
  ? new Stripe(secret, { apiVersion: "2026-03-25.dahlia" })
  : null;

/** The Stripe-hosted Payment Link the user pasted from their dashboard. */
export const PAYMENT_LINK_URL =
  process.env.STRIPE_PAYMENT_LINK_URL ??
  "https://buy.stripe.com/5kQ14n9k54GM8TxcI818c02";

/**
 * Append `client_reference_id=<userId>` so Stripe echoes it back in
 * `checkout.session.completed` — that's how we map a Stripe subscription
 * to our User row.
 */
export function paymentLinkForUser(userId: string): string {
  const sep = PAYMENT_LINK_URL.includes("?") ? "&" : "?";
  return `${PAYMENT_LINK_URL}${sep}client_reference_id=${encodeURIComponent(userId)}`;
}
