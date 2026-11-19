import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const plans = {
  basic: { name: "Basic Pool Chemical Club", amount: 4900 },
  pro: { name: "Pro Pool Chemical Club", amount: 7900 },
  elite: { name: "Elite Pool Chemical Club", amount: 11900 },
} as const;

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Stripe is not configured on the website. Please contact Pristine Pool Chemical Club." }, { status: 500 });
    }
    const body = await request.json();
    const planKey = body.plan as keyof typeof plans;
    const selected = plans[planKey];
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    if (!selected || !name || !email || !phone) {
      return NextResponse.json({ error: "Please provide your name, email, phone number, and membership plan." }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://pristinepoolchemicalclub.vercel.app";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: selected.amount,
          recurring: { interval: "month" },
          product_data: { name: selected.name, description: "Monthly chemical allowance membership. Pool service is not included." },
        },
      }],
      subscription_data: { metadata: { customer_name: name, customer_phone: phone, membership_plan: planKey } },
      metadata: { customer_name: name, customer_phone: phone, membership_plan: planKey },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      // Automatic tax is intentionally not enabled.
    });
    if (!session.url) return NextResponse.json({ error: "Stripe did not return a checkout link. Please try again." }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "We couldn't start checkout. Please check the Stripe settings and try again." }, { status: 500 });
  }
}
