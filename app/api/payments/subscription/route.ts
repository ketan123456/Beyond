import { env } from "cloudflare:workers";

type PaymentEnv = {
  DB?: D1Database;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_MONTHLY_TOTAL_COUNT?: string;
};

async function razorpay(path: string, key: string, secret: string, body: unknown) {
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${key}:${secret}`)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { id?: string; error?: { description?: string } };
  if (!response.ok || !data.id) {
    throw new Error(data.error?.description || `Unable to create Razorpay ${path}.`);
  }
  return data;
}

async function ensureSubscriptionTables(db: D1Database) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS recurring_donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      razorpay_subscription_id TEXT NOT NULL UNIQUE,
      razorpay_plan_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'created',
      razorpay_payment_id TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS razorpay_plan_cache (
      amount INTEGER PRIMARY KEY,
      razorpay_plan_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
}

export async function POST(request: Request) {
  try {
    const { amount } = (await request.json()) as { amount: number };
    if (!Number.isFinite(amount) || amount < 1) {
      return Response.json({ error: "Minimum monthly donation is ₹1" }, { status: 400 });
    }

    const bindings = env as unknown as PaymentEnv;
    const key = bindings.RAZORPAY_KEY_ID?.trim();
    const secret = bindings.RAZORPAY_KEY_SECRET?.trim();
    if (!key || !secret) {
      return Response.json({ error: "Payment service is not configured." }, { status: 503 });
    }

    const amountInPaise = Math.round(amount * 100);
    let planId: string | undefined;
    if (bindings.DB) {
      await ensureSubscriptionTables(bindings.DB);
      const cached = await bindings.DB.prepare(
        "SELECT razorpay_plan_id FROM razorpay_plan_cache WHERE amount = ?",
      ).bind(amountInPaise).first<{ razorpay_plan_id: string }>();
      planId = cached?.razorpay_plan_id;
    }

    if (!planId) {
      const plan = await razorpay("plans", key, secret, {
        period: "monthly",
        interval: 1,
        item: {
          name: "Beyond Disability Monthly Donation",
          amount: amountInPaise,
          currency: "INR",
          description: "Monthly charitable contribution",
        },
        notes: { purpose: "monthly_donation", amount_paise: String(amountInPaise) },
      });
      planId = plan.id;
      if (bindings.DB) {
        await bindings.DB.prepare(
          "INSERT OR IGNORE INTO razorpay_plan_cache (amount,razorpay_plan_id) VALUES (?,?)",
        ).bind(amountInPaise, planId).run();
      }
    }

    const configuredCount = Number(bindings.RAZORPAY_MONTHLY_TOTAL_COUNT || 120);
    const totalCount = Number.isInteger(configuredCount) && configuredCount >= 1 && configuredCount <= 1200
      ? configuredCount
      : 120;
    const subscription = await razorpay("subscriptions", key, secret, {
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
      customer_notify: true,
      notes: { purpose: "monthly_donation" },
    });

    if (bindings.DB) {
      await bindings.DB.prepare(
        "INSERT INTO recurring_donations (razorpay_subscription_id,razorpay_plan_id,amount,currency,status) VALUES (?,?,?,?,?)",
      ).bind(subscription.id, planId, amountInPaise, "INR", "created").run();
    }

    return Response.json({
      id: subscription.id,
      key,
      amount: amountInPaise,
      currency: "INR",
      total_count: totalCount,
    });
  } catch (error) {
    console.error("Subscription creation error", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to start AutoPay." },
      { status: 500 },
    );
  }
}
