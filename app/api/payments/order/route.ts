import { env } from "../../../../lib/server/runtime";
import { after } from "next/server";

type PaymentEnv = {
  DB?: D1Database;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
};

async function ensurePaymentsTable(db: D1Database) {
  void db;
}

export function GET() {
  return Response.json(
    { ok: true },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  try {
    const { amount, frequency, method } = (await request.json()) as {
      amount: number;
      frequency?: string;
      method?: string;
    };
    if (!Number.isFinite(amount) || amount < 1) {
      return Response.json({ error: "Minimum donation is ₹1" }, { status: 400 });
    }

    const bindings = env as unknown as PaymentEnv;
    const key = bindings.RAZORPAY_KEY_ID?.trim();
    const secret = bindings.RAZORPAY_KEY_SECRET?.trim();
    if (!key || !secret) {
      return Response.json(
        { error: "Payment service is not configured." },
        { status: 503 },
      );
    }

    const amountInPaise = Math.round(amount * 100);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        authorization: `Basic ${btoa(`${key}:${secret}`)}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `bd_${Date.now()}`,
        notes: {
          frequency: frequency || "one-time",
          preferred_method: method || "upi",
        },
      }),
    });
    const order = (await response.json()) as {
      id?: string;
      error?: { description?: string };
      [key: string]: unknown;
    };
    if (!response.ok || !order.id) {
      console.error("Razorpay order creation failed", response.status, order.error);
      return Response.json(
        { error: order.error?.description || "Unable to create payment order." },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    if (bindings.DB) {
      after(async () => {
        try {
          await ensurePaymentsTable(bindings.DB!);
          await bindings.DB!.prepare(
            "INSERT INTO payments (razorpay_order_id,amount,currency,status) VALUES (?,?,?,?)",
          )
            .bind(order.id, amountInPaise, "INR", "created")
            .run();
        } catch (error) {
          console.error("Payment order audit insert failed", error);
        }
      });
    }

    // Razorpay Checkout needs the public key. The secret is never returned.
    return Response.json({ ...order, key });
  } catch (error) {
    console.error("Payment order error", error);
    return Response.json(
      { error: "Unable to start payment. Please try again." },
      { status: 500 },
    );
  }
}
