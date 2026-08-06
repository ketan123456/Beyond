"use client";

import { useEffect, useState } from "react";
import { InteriorHero, PageShell } from "../components";

declare global {
  interface Window {
    Razorpay?: new (
      options: Record<string, unknown>,
    ) => { open: () => void };
  }
}

const paymentMethods = [
  {
    id: "upi",
    icon: "fa-bolt",
    label: "UPI",
    detail: "Pay instantly with any UPI app",
    brands: "UPI",
  },
  {
    id: "card",
    icon: "fa-credit-card",
    label: "Card",
    detail: "Visa, Mastercard, RuPay & more",
    brands: "Visa · RuPay",
  },
  {
    id: "netbanking",
    icon: "fa-building-columns",
    label: "Net Banking",
    detail: "All major banks supported",
    brands: "Banks",
  },
  {
    id: "wallet",
    icon: "fa-wallet",
    label: "Wallets",
    detail: "Paytm, PhonePe, Amazon Pay & more",
    brands: "Paytm · GPay",
  },
];

let checkoutPromise: Promise<boolean> | null = null;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  if (checkoutPromise) return checkoutPromise;
  checkoutPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => { checkoutPromise = null; resolve(false); }, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => { checkoutPromise = null; resolve(false); };
    document.head.appendChild(script);
  });
  return checkoutPromise;
}

export default function Donate() {
  const [amount, setAmount] = useState(1000);
  const [frequency, setFrequency] =
    useState<"one-time" | "monthly">("one-time");
  const [method, setMethod] = useState("upi");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { void loadCheckout(); }, []);

  async function pay(selectedMethod = method) {
    if (isProcessing) return;
    setMethod(selectedMethod);
    setIsProcessing(true);
    setStatus(
      frequency === "monthly"
        ? "Preparing your monthly AutoPay mandate…"
        : "Preparing secure payment…",
    );
    if (!amount || amount < 1) {
      setStatus("Please choose an amount of at least ₹1.");
      setIsProcessing(false);
      return;
    }

    try {
      const recurring = frequency === "monthly";
      const checkoutReady = loadCheckout();
      const response = await fetch(
        recurring ? "/api/payments/subscription" : "/api/payments/order",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount,
            ...(!recurring && { frequency, method: selectedMethod }),
          }),
        },
      );
      const data = (await response.json().catch(() => ({}))) as Record<
        string,
        string
      >;
      if (!response.ok || !data.id || !data.key) {
        setStatus(
          data.message || data.error || "Unable to start payment. Please try again.",
        );
        return;
      }
      if (!(await checkoutReady) || !window.Razorpay) {
        setStatus(
          "Secure checkout could not load. Please check your connection.",
        );
        return;
      }

      const checkoutOptions: Record<string, unknown> = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "BEYOND DISABILITY FOUNDATION",
      description: recurring
        ? "Monthly donation with AutoPay"
        : "One-time contribution",
      ...(recurring
        ? { subscription_id: data.id }
        : {
            order_id: data.id,
            config: {
              display: {
                blocks: {
                  preferred: {
                    name: `Pay via ${
                      selectedMethod === "netbanking"
                        ? "Net Banking"
                        : selectedMethod.toUpperCase()
                    }`,
                    instruments: [{ method: selectedMethod }],
                  },
                },
                sequence: ["block.preferred"],
                preferences: { show_default_blocks: true },
              },
            },
          }),
        handler: async (result: Record<string, string>) => {
          try {
            const verification = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(result),
            });
            setStatus(
              verification.ok
                ? recurring
                  ? "Monthly AutoPay authorised successfully. Thank you for your ongoing support!"
                  : "Thank you. Your payment was verified successfully."
                : "Payment received; verification is pending. Please contact support with your payment ID.",
            );
          } catch {
            setStatus(
              "Payment received; verification is pending. Please contact support with your payment ID.",
            );
          }
        },
        modal: {
          ondismiss: () =>
            setStatus(
              recurring
                ? "AutoPay setup was cancelled. No mandate was created."
                : "Payment window closed. No charge was made.",
            ),
        },
        theme: { color: "#00b8d9" },
      };

      new window.Razorpay(checkoutOptions).open();
      setStatus(
        recurring
          ? "Complete the secure mandate authorisation in Razorpay."
          : "Secure Razorpay checkout opened.",
      );
    } catch {
      setStatus("Unable to reach the payment service. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <PageShell>
      <InteriorHero
        image="/hero-donate.webp"
        eyebrow="Give with confidence"
        title="Your donation can keep a child connected to sound"
        description="Every contribution funds medical support, cochlear implant accessories, rehabilitation and practical assistance for children with disabilities.">
        <a className="btn btn-gold" href="#donate-now">
          <i className="fa-solid fa-heart" />
          Donate securely
        </a>
      </InteriorHero>

      <section className="donate" id="donate-now">
        <div className="section-title">
          <p className="eyebrow">
            <span />
            Secure giving
          </p>
          <h2>Make a measurable, lasting difference</h2>
          <p>
            We are 80G Certified, allowing eligible individual donors to claim
            a 50% tax deduction, and CSR Eligible under Schedule VII. One-time
            and monthly contributions are processed securely through Razorpay.
          </p>
        </div>

        <div className="donate-box donate-checkout">
          <div className="tabs donation-frequency" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={frequency === "one-time"}
              disabled={isProcessing}
              className={frequency === "one-time" ? "selected-tab" : ""}
              onClick={() => {
                setFrequency("one-time");
                setStatus("");
              }}>
              <i className="fa-solid fa-hand-holding-heart" />
              One-time Donation
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={frequency === "monthly"}
              disabled={isProcessing}
              className={frequency === "monthly" ? "selected-tab" : ""}
              onClick={() => {
                setFrequency("monthly");
                setStatus("");
              }}>
              <i className="fa-regular fa-calendar-check" />
              Monthly Donation
            </button>
          </div>

          <div className="amounts donation-amounts">
            {[500, 1000, 2500, 5000].map((value) => (
              <button
                type="button"
                className={amount === value ? "selected" : ""}
                disabled={isProcessing}
                onClick={() => setAmount(value)}
                key={value}>
                ₹{value.toLocaleString("en-IN")}
              </button>
            ))}
            <label className="custom-amount">
              <input
                aria-label="Custom donation amount"
                type="number"
                min="1"
                disabled={isProcessing}
                value={![500, 1000, 2500, 5000].includes(amount) ? amount : ""}
                placeholder="Enter amount"
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <span>Custom Amount</span>

              <i className="fa-solid fa-pen" aria-hidden="true" />
            </label>
          </div>

          <div className="payment-title-row">
            <h2>
              <i className="fa-regular fa-credit-card" />
              Payment Options
            </h2>
            <span>
              <i className="fa-solid fa-lock" />
              100% Secure Payments
            </span>
          </div>

          {frequency === "monthly" ? (
            <div className="autopay-panel">
              <i className="fa-solid fa-arrows-rotate" />
              <div>
                <h2>Monthly AutoPay</h2>
                <p>
                  Authorise once through Razorpay.{" "}
                  <span data-no-translate>
                    ₹{amount.toLocaleString("en-IN")}
                  </span>{" "}
                  will be donated automatically every month. You can cancel the
                  mandate through your bank or Razorpay.
                </p>
              </div>
            </div>
          ) : (
            <div className="payment-grid donation-payment-grid">
              <div className="payment-methods donation-methods">
                {paymentMethods.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={method === item.id ? "chosen" : ""}
                    aria-pressed={method === item.id}
                    disabled={isProcessing}
                    onClick={() => pay(item.id)}>
                    <span className="method-icon">
                      <i className={`fa-solid ${item.icon}`} />
                    </span>
                    <span className="method-copy">
                      <b>{item.label}</b>
                      <small>{item.detail}</small>
                    </span>
                    <strong>{item.brands}</strong>
                    <i className="fa-solid fa-arrow-right method-arrow" />
                  </button>
                ))}
              </div>

              <aside className="scan-pay-card">
                <button
                  className="qr-launch"
                  type="button"
                  disabled={isProcessing}
                  onClick={() => pay("upi")}
                  aria-label="Open Razorpay UPI QR payment">
                  <span className="qr-frame" aria-hidden="true">
                    <i className="fa-solid fa-qrcode" />
                    <b>∞</b>
                  </span>
                  <strong>Scan &amp; Pay</strong>
                  <small>
                    Scan the QR code with any UPI app
                    <br />
                    to make a secure payment
                  </small>
                  <span className="upi-apps" aria-hidden="true">
                    <b>G Pay</b>
                    <b>पे</b>
                    <b>paytm</b>
                  </span>
                </button>
              </aside>
            </div>
          )}

          <button
            className="btn btn-gold pay secure-pay"
            type="button"
            disabled={isProcessing}
            onClick={() => pay(method)}>
            <span>
              <i
                className={`fa-solid ${
                  frequency === "monthly" ? "fa-arrows-rotate" : "fa-lock"
                }`}
              />
              {isProcessing
                ? "Opening secure checkout…"
                : frequency === "monthly"
                  ? "Enable Monthly AutoPay"
                  : "Pay Securely with Razorpay"}
              <small>
                {frequency === "monthly"
                  ? "Secure recurring support, authorised by you"
                  : "Your donation is safe and encrypted"}
              </small>
            </span>
            <i className="fa-solid fa-arrow-right" />
          </button>

          <p className="center form-status" role="status">
            {status}
          </p>

          <div className="checkout-trust">
            <span>
              <i className="fa-solid fa-shield-halved" />
              <b>
                Secure &amp; Encrypted
                <small>256-bit SSL security</small>
              </b>
            </span>
            <span>
              <i className="fa-solid fa-certificate" />
              <b>
                Trusted Giving
                <small>Transparent payment processing</small>
              </b>
            </span>
            <span>
              <i className="fa-solid fa-hands-holding-child" />
              <b>
                Every Rupee Counts
                <small>Making a real difference</small>
              </b>
            </span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
