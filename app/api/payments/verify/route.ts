import { env } from "cloudflare:workers";

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)),
  );
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function ensurePaymentsTable(db: D1Database) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      razorpay_order_id TEXT NOT NULL UNIQUE,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'created',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
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
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const bindings = env as unknown as {
      DB?: D1Database;
      RAZORPAY_KEY_SECRET?: string;
    };
    const secret = bindings.RAZORPAY_KEY_SECRET?.trim();
    const referenceId = body.razorpay_subscription_id || body.razorpay_order_id;
    if (!secret || !referenceId || !body.razorpay_payment_id || !body.razorpay_signature) {
      return Response.json({ error: "Invalid verification request" }, { status: 400 });
    }

    const expected = await hmac(
      body.razorpay_subscription_id
        ? `${body.razorpay_payment_id}|${body.razorpay_subscription_id}`
        : `${body.razorpay_order_id}|${body.razorpay_payment_id}`,
      secret,
    );
    if (expected !== body.razorpay_signature) {
      return Response.json({ error: "Signature mismatch" }, { status: 400 });
    }

    if (bindings.DB) {
      await ensurePaymentsTable(bindings.DB);
      if (body.razorpay_subscription_id) {
        await bindings.DB.prepare(
          "UPDATE recurring_donations SET status = ?, razorpay_payment_id = ? WHERE razorpay_subscription_id = ?",
        ).bind("authenticated", body.razorpay_payment_id, body.razorpay_subscription_id).run();
      } else {
        await bindings.DB.prepare(
          "UPDATE payments SET status = ? WHERE razorpay_order_id = ?",
        ).bind("paid", body.razorpay_order_id).run();
      }
    }
    return Response.json({ ok: true, recurring: Boolean(body.razorpay_subscription_id) });
  } catch (error) {
    console.error("Payment verification error", error);
    return Response.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
