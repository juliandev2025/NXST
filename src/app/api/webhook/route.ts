import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
// waitUntil permite ejecutar código DESPUÉS de enviar la respuesta
import { waitUntil } from "@vercel/functions";

/**
 * ═══════════════════════════════════════════════════════════════
 * PUNTO 4 — Webhook Timeout-Safe para Stripe y Mercado Pago
 * ═══════════════════════════════════════════════════════════════
 *
 * PROBLEMA:
 * Vercel Serverless Functions tienen un timeout de 10s (Hobby) / 60s (Pro).
 * Si la escritura en Supabase tarda más, la pasarela recibe un timeout,
 * reintenta el webhook, y puedes procesar pagos duplicados.
 *
 * SOLUCIÓN — Patrón "Respond First, Process Later":
 * 1. Recibir el body crudo (necesario para verificar firma)
 * 2. Verificar la firma criptográfica (Stripe o MercadoPago)
 * 3. Responder 200 OK INMEDIATAMENTE a la pasarela
 * 4. Ejecutar la lógica de base de datos con waitUntil()
 *    (se ejecuta después del response, sin bloquear)
 *
 * waitUntil() es una API de Vercel que extiende el lifecycle
 * de la función más allá del response — perfecto para webhooks.
 *
 * NOTA: Si no usas Vercel, puedes reemplazar waitUntil() con
 * un sistema de colas (Redis, SQS, Inngest, etc.)
 */

// ─── Config ───
const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const mpWebhookSecret = process.env.MP_WEBHOOK_SECRET;

const stripe = stripeKey
    ? new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" as any })
    : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin =
    supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

// ─── Desactivar body parsing de Next.js (necesitamos el body crudo) ───
export const runtime = "nodejs";

// ═══════════════════════════════════════════════════════════════
// STRIPE WEBHOOK
// ═══════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
    // Detectar pasarela por header
    const stripeSignature = request.headers.get("stripe-signature");
    const mpSignature = request.headers.get("x-signature");

    if (stripeSignature) {
        return handleStripeWebhook(request, stripeSignature);
    }

    if (mpSignature) {
        return handleMercadoPagoWebhook(request, mpSignature);
    }

    return NextResponse.json(
        { error: "Unknown webhook source" },
        { status: 400 }
    );
}

// ────────────────────────────────────────────────────────────────
// STRIPE HANDLER
// ────────────────────────────────────────────────────────────────
async function handleStripeWebhook(request: NextRequest, sig: string) {
    if (!stripe || !webhookSecret) {
        return NextResponse.json(
            { error: "Stripe webhook not configured" },
            { status: 400 }
        );
    }

    const body = await request.text();

    // ─── PASO 1: Verificar firma ───
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Stripe signature verification failed:", err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // ─── PASO 2: Responder 200 INMEDIATAMENTE ───
    // La pasarela recibe confirmación antes de que toquemos la DB.
    // Esto previene timeouts y reintentos duplicados.
    const response = NextResponse.json({ received: true }, { status: 200 });

    // ─── PASO 3: Procesar en background con waitUntil ───
    // Este código se ejecuta DESPUÉS de enviar el 200.
    // Vercel mantiene la función viva para completar la promesa.
    waitUntil(processStripeEvent(event));

    return response;
}

// ────────────────────────────────────────────────────────────────
// MERCADO PAGO HANDLER
// ────────────────────────────────────────────────────────────────
async function handleMercadoPagoWebhook(request: NextRequest, sig: string) {
    const body = await request.text();
    let payload: any;

    try {
        payload = JSON.parse(body);
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // ─── Verificar firma de Mercado Pago ───
    // MP envía: x-signature con ts=xxxx,v1=hash
    // Documentación: https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
    if (mpWebhookSecret) {
        const parts = sig.split(",");
        const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
        const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
        const dataId = payload?.data?.id;

        if (ts && v1 && dataId) {
            const crypto = await import("crypto");
            const manifest = `id:${dataId};request-id:${request.headers.get("x-request-id")};ts:${ts};`;
            const expectedHash = crypto
                .createHmac("sha256", mpWebhookSecret)
                .update(manifest)
                .digest("hex");

            if (v1 !== expectedHash) {
                console.error("⚠️ MercadoPago signature mismatch");
                return NextResponse.json(
                    { error: "Invalid signature" },
                    { status: 401 }
                );
            }
        }
    }

    // ─── Responder 200 INMEDIATAMENTE ───
    const response = NextResponse.json({ received: true }, { status: 200 });

    // ─── Procesar en background ───
    waitUntil(processMercadoPagoEvent(payload));

    return response;
}

// ═══════════════════════════════════════════════════════════════
// PROCESAMIENTO EN BACKGROUND (post-response)
// ═══════════════════════════════════════════════════════════════

async function processStripeEvent(event: Stripe.Event) {
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;

                console.log(`✅ Stripe payment successful for order: ${orderId}`);

                if (supabaseAdmin && orderId) {
                    await supabaseAdmin
                        .from("orders")
                        .update({
                            status: "paid",
                            stripe_session_id: session.id,
                            stripe_payment_intent:
                                session.payment_intent as string,
                            paid_at: new Date().toISOString(),
                        })
                        .eq("id", orderId);

                    console.log(
                        `📦 Order ${orderId} updated to 'paid' in database`
                    );
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
                console.log(`Unhandled Stripe event: ${event.type}`);
        }
    } catch (err) {
        // Log pero NO lanzar — la respuesta ya fue enviada
        console.error("❌ Background Stripe processing failed:", err);
        // Aquí podrías escribir a una tabla de "failed_webhooks" para retry manual
        if (supabaseAdmin) {
            try {
                await supabaseAdmin
                    .from("webhook_errors")
                    .insert({
                        source: "stripe",
                        event_type: event.type,
                        event_id: event.id,
                        error: String(err),
                        payload: JSON.stringify(event),
                        created_at: new Date().toISOString(),
                    });
            } catch {
                // Silenciar si la tabla no existe aún
            }
        }
    }
}

async function processMercadoPagoEvent(payload: any) {
    try {
        const { type, data } = payload;

        if (type === "payment" && data?.id) {
            console.log(`✅ MercadoPago payment received: ${data.id}`);

            // Consultar detalles del pago en la API de MercadoPago
            // const mpAccessToken = process.env.MP_ACCESS_TOKEN;
            // const paymentRes = await fetch(
            //     `https://api.mercadopago.com/v1/payments/${data.id}`,
            //     { headers: { Authorization: `Bearer ${mpAccessToken}` } }
            // );
            // const payment = await paymentRes.json();
            //
            // if (payment.status === "approved" && supabaseAdmin) {
            //     const orderId = payment.external_reference;
            //     await supabaseAdmin
            //         .from("orders")
            //         .update({
            //             status: "paid",
            //             mp_payment_id: data.id,
            //             paid_at: new Date().toISOString(),
            //         })
            //         .eq("id", orderId);
            // }
        }
    } catch (err) {
        console.error("❌ Background MercadoPago processing failed:", err);
        if (supabaseAdmin) {
            try {
                await supabaseAdmin
                    .from("webhook_errors")
                    .insert({
                        source: "mercadopago",
                        event_type: payload?.type || "unknown",
                        event_id: payload?.data?.id || "unknown",
                        error: String(err),
                        payload: JSON.stringify(payload),
                        created_at: new Date().toISOString(),
                    });
            } catch {
                // Silenciar si la tabla no existe aún
            }
        }
    }
}
