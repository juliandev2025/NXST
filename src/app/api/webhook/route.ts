import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" as any }) : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin =
    supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

export async function POST(request: NextRequest) {
    if (!stripe || !webhookSecret) {
        return NextResponse.json(
            { error: "Stripe webhook not configured" },
            { status: 400 }
        );
    }

    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle events
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            console.log(`✅ Payment successful for order: ${orderId}`);

            // Update order status in Supabase
            if (supabaseAdmin && orderId) {
                try {
                    await supabaseAdmin
                        .from("orders")
                        .update({
                            status: "paid",
                            stripe_session_id: session.id,
                            stripe_payment_intent: session.payment_intent as string,
                            paid_at: new Date().toISOString(),
                        })
                        .eq("id", orderId);

                    console.log(`📦 Order ${orderId} updated to 'paid' in database`);
                } catch (dbErr) {
                    console.error("Failed to update order in Supabase:", dbErr);
                }
            }
            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            if (supabaseAdmin && orderId) {
                await supabaseAdmin
                    .from("orders")
                    .update({ status: "expired" })
                    .eq("id", orderId);
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// Disable body parsing for webhook verification
export const config = {
    api: {
        bodyParser: false,
    },
};
