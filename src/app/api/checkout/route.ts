import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Stripe initialization — will only work if STRIPE_SECRET_KEY is set
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2023-10-16" as any }) : null;

// Mercado Pago initialization
const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const mpClient = mpAccessToken ? new MercadoPagoConfig({ accessToken: mpAccessToken }) : null;

// Supabase Admin client for order creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin =
    supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

interface CheckoutItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
}

interface CheckoutCustomer {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customer, total, method = "stripe" } = body as {
            items: CheckoutItem[];
            customer: CheckoutCustomer;
            total: number;
            method?: "stripe" | "mercadopago";
        };

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No items in cart" },
                { status: 400 }
            );
        }

        // Generate order ID
        const orderId = "NXST-" + Date.now().toString(36).toUpperCase();

        // --- Save order to Supabase if configured ---
        if (supabaseAdmin) {
            try {
                await supabaseAdmin.from("orders").insert({
                    id: orderId,
                    customer_email: customer.email,
                    customer_name: `${customer.firstName} ${customer.lastName}`,
                    customer_address: `${customer.address}, ${customer.city}, ${customer.country} ${customer.postalCode}`,
                    customer_phone: customer.phone,
                    items: items,
                    total: total,
                    currency: "usd",
                    status: "pending",
                    created_at: new Date().toISOString(),
                });
            } catch (dbErr) {
                console.error("Supabase order insert error:", dbErr);
                // Continue with checkout even if DB fails
            }
        }

        // --- MERCADO PAGO INTEGRATION ---
        if (method === "mercadopago" && mpClient) {
            const preference = new Preference(mpClient);
            const res = await preference.create({
                body: {
                    items: items.map((item) => ({
                        id: item.id,
                        title: item.name,
                        unit_price: parseFloat(item.price.replace("$", "").replace(",", "")),
                        quantity: item.quantity,
                        currency_id: "USD",
                        picture_url: item.image.startsWith("http") ? item.image : `${request.nextUrl.origin}${item.image}`,
                    })),
                    back_urls: {
                        success: `${request.nextUrl.origin}/checkout/success?order=${orderId}`,
                        failure: `${request.nextUrl.origin}/checkout`,
                        pending: `${request.nextUrl.origin}/checkout`,
                    },
                    auto_return: "approved",
                    external_reference: orderId,
                }
            });

            return NextResponse.json({ url: res.init_point });
        }

        // --- STRIPE INTEGRATION ---
        if (method === "stripe" && stripe) {
            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
                items.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            images: item.image.startsWith("http")
                                ? [item.image]
                                : [`${request.nextUrl.origin}${item.image}`],
                        },
                        unit_amount: Math.round(
                            parseFloat(item.price.replace("$", "").replace(",", "")) * 100
                        ),
                    },
                    quantity: item.quantity,
                }));

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                customer_email: customer.email,
                metadata: {
                    orderId,
                    customerName: `${customer.firstName} ${customer.lastName}`,
                },
                success_url: `${request.nextUrl.origin}/checkout/success?order=${orderId}`,
                cancel_url: `${request.nextUrl.origin}/checkout`,
            });

            return NextResponse.json({ url: session.url });
        }

        // --- FALLBACK: No payment gateway configured or key missing ---
        // Returning orderId directly is a "Demo Mode" fallback
        return NextResponse.json({
            orderId,
            message: "Order created (Payment Gateway not configured — demo mode)",
        });
    } catch (error: any) {
        console.error("Checkout API error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
