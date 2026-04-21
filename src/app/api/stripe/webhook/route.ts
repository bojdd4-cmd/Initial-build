import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { removeRole } from "@/lib/discord";

// Stripe webhooks require the raw body to verify the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server" },
      { status: 503 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: if we've already processed this event ID, skip.
  const already = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
  if (already) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
      case "customer.subscription.created":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Ignore event types we don't care about.
        break;
    }

    // Record the event so retries don't double-process.
    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type} (${event.id}):`, err);
    // Return 500 so Stripe retries.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

/** Checkout finished → map the subscription to our user via client_reference_id. */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!userId) {
    console.error(
      `checkout.session.completed ${session.id}: missing client_reference_id. ` +
        `Make sure "Collect client reference ID" is enabled on the Payment Link ` +
        `OR that users are sent to the link via /api/stripe/checkout.`
    );
    return;
  }

  if (!customerId || !subscriptionId) {
    console.error(
      `checkout.session.completed ${session.id}: missing customer or subscription`
    );
    return;
  }

  // Fetch the subscription to get current_period_end (moved to item in Stripe 2026 API).
  const sub = await stripe!.subscriptions.retrieve(subscriptionId);
  const item = sub.items.data[0];
  const periodEnd = item
    ? new Date(item.current_period_end * 1000)
    // Fallback: 1 week from now if somehow no item yet
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      premiumStatus: sub.status === "active" || sub.status === "trialing" ? "active" : sub.status,
      premiumUntil: periodEnd,
    },
  });
}

/** Subscription updated → sync status + period end. */
async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) {
    console.warn(`subscription.updated ${sub.id}: no user for customer ${customerId}`);
    return;
  }

  const subItem = sub.items.data[0];
  const periodEnd = subItem
    ? new Date(subItem.current_period_end * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const status =
    sub.status === "active" || sub.status === "trialing"
      ? "active"
      : sub.status === "past_due"
        ? "past_due"
        : sub.status === "canceled" || sub.status === "unpaid" || sub.status === "incomplete_expired"
          ? "canceled"
          : sub.status;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeSubscriptionId: sub.id,
      premiumStatus: status,
      premiumUntil: periodEnd,
    },
  });

  // If the subscription is no longer active, strip the Discord role.
  if (status === "canceled" && user.discordId) {
    const roleId = process.env.DISCORD_PREMIUM_ROLE_ID;
    if (roleId) await removeRole(user.discordId, roleId);
  }
}

/** Subscription deleted → mark canceled and remove Discord role. */
async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { premiumStatus: "canceled" },
  });

  if (user.discordId) {
    const roleId = process.env.DISCORD_PREMIUM_ROLE_ID;
    if (roleId) await removeRole(user.discordId, roleId);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { premiumStatus: "past_due" },
  });
}
