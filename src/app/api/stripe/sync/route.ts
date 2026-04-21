import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, hasActivePremium } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Manual premium sync — looks the user up in Stripe by email, finds their
 * active subscription, and updates the DB.  Called by the /premium/success
 * page when the webhook hasn't fired yet, and available as a fallback for
 * any user who paid but whose premium status didn't activate automatically.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server. Add STRIPE_SECRET_KEY to Amplify env vars." },
      { status: 503 }
    );
  }

  const userId = session.user.id;

  // Re-read user from DB (session might be stale).
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      stripeCustomerId: true,
      premiumStatus: true,
      premiumUntil: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If already active, just return success — nothing to sync.
  if (hasActivePremium(user)) {
    return NextResponse.json({ premium: true, alreadyActive: true });
  }

  try {
    let customerId = user.stripeCustomerId ?? null;

    // If we don't have a customer ID stored, find them by email in Stripe.
    if (!customerId) {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 5,
      });
      const customer = customers.data.find((c) => !c.deleted);
      if (!customer) {
        return NextResponse.json({
          premium: false,
          message: "No Stripe customer found for this email. Make sure you paid using the same email address as your BuildMyCycle account.",
        });
      }
      customerId = customer.id;
    }

    // Fetch active subscriptions for this customer.
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 5,
    });

    // Also check trialing.
    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 5,
    });

    const activeSub =
      subscriptions.data[0] ?? trialingSubscriptions.data[0] ?? null;

    if (!activeSub) {
      // Check for past_due subs too.
      const pastDue = await stripe.subscriptions.list({
        customer: customerId,
        status: "past_due",
        limit: 1,
      });
      if (pastDue.data.length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: pastDue.data[0].id,
            premiumStatus: "past_due",
          },
        });
        return NextResponse.json({
          premium: false,
          message: "Your subscription is past due — please update your payment method in Stripe.",
        });
      }

      return NextResponse.json({
        premium: false,
        message: "No active subscription found. If you just paid, wait 30 seconds and try again.",
      });
    }

    // Get period end from the subscription item (Stripe 2026 API).
    const item = activeSub.items.data[0];
    const periodEnd = item
      ? new Date(item.current_period_end * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: activeSub.id,
        premiumStatus: "active",
        premiumUntil: periodEnd,
      },
    });

    return NextResponse.json({
      premium: true,
      until: periodEnd.toISOString(),
    });
  } catch (err: unknown) {
    console.error("Stripe sync error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Sync failed",
      },
      { status: 500 }
    );
  }
}
