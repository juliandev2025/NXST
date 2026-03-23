import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { ALL_PRODUCTS } from "@/lib/products";

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

/**
 * SECURITY: Parsea precio string y retorna centavos (entero).
 * Retorna null si el formato es inválido.
 */
function parsePrice(priceStr: string): number | null {
    const cleaned = priceStr.replace(/[$,]/g, "").trim();
    const value = parseFloat(cleaned);
    if (isNaN(value) || value < 0) return null;
    return Math.round(value * 100);
}

/**
 * SECURITY: Valida item contra el catálogo server-side.
 * Retorna el precio REAL del catálogo (en centavos) o null si el producto no existe.
 */
function getVerifiedPriceCents(productId: string): number | null {
    const catalogProduct = ALL_PRODUCTS.find((p) => p.id === productId);
    if (!catalogProduct) return null;
    return parsePrice(catalogProduct.price);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customer, method = "stripe" } = body as {
            items: CheckoutItem[];
            customer: CheckoutCustomer;
            total: number; // Ignoramos el total del cliente — lo recalculamos server-side
            method?: "stripe" | "mercadopago";
        };

        // Validación básica de campos del cliente
        if (!customer?.email || !customer?.firstName || !customer?.lastName || !customer?.address || !customer?.city) {
            return NextResponse.json(
                { error: "Missing required customer information" },
                { status: 400 }
            );
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "No items in cart" },
                { status: 400 }
            );
        }

        // SECURITY: Validar cada item contra el catálogo y recalcular precios server-side
        const verifiedItems: { id: string; name: string; priceCents: number; quantity: number; image: string }[] = [];
        let serverTotalCents = 0;

        for (const item of items) {
            if (!item.id || !item.quantity || item.quantity < 1 || item.quantity > 99) {
                return NextResponse.json(
                    { error: `Invalid item: ${item.id || "unknown"}` },
                    { status: 400 }
                );
            }

            const verifiedPriceCents = getVerifiedPriceCents(item.id);
            if (verifiedPriceCents === null) {
                return NextResponse.json(
                    { error: `Product not found in catalog: ${item.id}` },
                    { status: 400 }
                );
            }

            const catalogProduct = ALL_PRODUCTS.find((p) => p.id === item.id)!;
            verifiedItems.push({
                id: item.id,
                name: catalogProduct.name, // Usamos el nombre del catálogo, no del cliente
                priceCents: verifiedPriceCents,
                quantity: item.quantity,
                image: catalogProduct.image, // Usamos la imagen del catálogo
            });
            serverTotalCents += verifiedPriceCents * item.quantity;
        }

        const serverTotalUSD = serverTotalCents / 100;

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
                    customer_phone: customer.phone || "",
                    items: verifiedItems,
                    total: serverTotalUSD,
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
                    items: verifiedItems.map((item) => ({
                        id: item.id,
                        title: item.name,
                        unit_price: item.priceCents / 100, // Precio verificado del catálogo
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
                verifiedItems.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            images: item.image.startsWith("http")
                                ? [item.image]
                                : [`${request.nextUrl.origin}${item.image}`],
                        },
                        unit_amount: item.priceCents, // Precio verificado del catálogo
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
    } catch (error: unknown) {
        console.error("Checkout API error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
