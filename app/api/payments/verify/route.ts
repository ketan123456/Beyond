import { env } from "cloudflare:workers";
import { safelySendAdminEmail, safelySendUserEmail } from "../../../admin-email";

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
    const payerEmail = String(body.email || "").trim().toLowerCase();
    if (!secret || !referenceId || !body.razorpay_payment_id || !body.razorpay_signature || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail)) {
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

    let amount = 0;
    let currency = "INR";
    if (bindings.DB) {
      await ensurePaymentsTable(bindings.DB);
      if (body.razorpay_subscription_id) {
        const donation = await bindings.DB.prepare(
          "SELECT amount, currency FROM recurring_donations WHERE razorpay_subscription_id = ?",
        ).bind(body.razorpay_subscription_id).first<{ amount: number; currency: string }>();
        amount = donation?.amount || 0;
        currency = donation?.currency || "INR";
        await bindings.DB.prepare(
          "UPDATE recurring_donations SET status = ?, razorpay_payment_id = ? WHERE razorpay_subscription_id = ?",
        ).bind("authenticated", body.razorpay_payment_id, body.razorpay_subscription_id).run();
      } else {
        const donation = await bindings.DB.prepare(
          "SELECT amount, currency FROM payments WHERE razorpay_order_id = ?",
        ).bind(body.razorpay_order_id).first<{ amount: number; currency: string }>();
        amount = donation?.amount || 0;
        currency = donation?.currency || "INR";
        await bindings.DB.prepare(
          "UPDATE payments SET status = ? WHERE razorpay_order_id = ?",
        ).bind("paid", body.razorpay_order_id).run();
      }
    }
    await safelySendAdminEmail({
      subject: `Payment received — ${body.razorpay_payment_id}`,
      heading: "Payment received",
      summary: "Razorpay verified a donation payment successfully.",
      fields: [
        ["Payment ID", body.razorpay_payment_id],
        ["Donor email", payerEmail],
        [body.razorpay_subscription_id ? "Subscription ID" : "Order ID", referenceId],
        ["Type", body.razorpay_subscription_id ? "Recurring donation" : "One-time donation"],
        ["Amount", amount ? `${currency} ${(amount / 100).toFixed(2)}` : "See Razorpay dashboard"],
      ],
      idempotencyKey: `payment-${body.razorpay_payment_id}`,
    });
    await safelySendUserEmail(payerEmail, {
      subject: "Thank you for your support — payment successful",
      heading: "Thank you for your support!",
      summary: "Your payment was successful. Your contribution helps us empower children with disabilities and create a more inclusive future for all.",
      fields: [
        ["Email", payerEmail],
        ["Amount", amount ? `${currency} ${(amount / 100).toFixed(2)}` : "Confirmed"],
        ["Transaction ID", body.razorpay_payment_id],
        ["Donation type", body.razorpay_subscription_id ? "Monthly" : "One-time"],
        ["Payment status", "Successful"],
      ],
      idempotencyKey: `payment-user-${body.razorpay_payment_id}`,
    });
    return Response.json({ ok: true, recurring: Boolean(body.razorpay_subscription_id) });
  } catch (error) {
    console.error("Payment verification error", error);
    return Response.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
