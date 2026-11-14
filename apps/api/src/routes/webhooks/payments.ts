import { FrontalError } from "@frontal-labs/error";
import { analytics } from "@podyard/analytics/server";
import { database, user as users } from "@podyard/database";
import { log } from "@podyard/observability/log";
import { stripe } from "@podyard/payments";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type Stripe from "stripe";
import { env } from "@/env";

const getUserFromCustomerId = async (customerId: string) => {
  // With Better Auth, we query the database directly
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  return user;
};

const handleCheckoutSessionCompleted = async (
  data: Stripe.Checkout.Session
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Subscribed",
    distinctId: user.id,
  });
};

const handleSubscriptionScheduleCanceled = async (
  data: Stripe.SubscriptionSchedule
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Unsubscribed",
    distinctId: user.id,
  });
};

export const payments = async (c: Context): Promise<Response> => {
  if (!(stripe && env.STRIPE_WEBHOOK_SECRET)) {
    return c.json({ message: "Not configured", ok: false }, 503);
  }

  try {
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");

    if (!signature) {
      throw new FrontalError("missing stripe-signature header", {
        scope: "payments",
        code: "missing_signature",
        statusCode: 400,
        public: { message: "Missing stripe-signature header." },
      });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      }
      case "subscription_schedule.canceled": {
        await handleSubscriptionScheduleCanceled(event.data.object);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.type}`);
      }
    }

    return c.json({ result: event, ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    log.error(message);

    return c.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
  }
};
