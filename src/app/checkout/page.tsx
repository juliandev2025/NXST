"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/settings-store";
import { useMounted } from "@/lib/hooks";
import { formatPrice } from "@/lib/products";

type CheckoutStep = "information" | "payment" | "confirmation";

const TRANSLATIONS = {
    EN: {
        breadcrumb_home: "HOME",
        breadcrumb_checkout: "CHECKOUT",
        step_information: "information",
        step_payment: "payment",
        step_confirmation: "confirmation",
        // Information Step
        step_01: "STEP_01",
        contact_info: "CONTACT_INFO",
        email_address: "EMAIL_ADDRESS",
        first_name: "FIRST_NAME",
        last_name: "LAST_NAME",
        step_01b: "STEP_01B",
        shipping_coords: "SHIPPING_COORDS",
        address: "ADDRESS",
        city: "CITY",
        country: "COUNTRY",
        postal_code: "POSTAL_CODE",
        phone: "PHONE",
        proceed_to_payment: "PROCEED_TO_PAYMENT →",
        // Payment Step
        step_02: "STEP_02",
        payment_gateway: "PAYMENT_GATEWAY",
        delivery_to: "DELIVERY_TO",
        modify_coords: "MODIFY_COORDS",
        select_payment_gateway: "SELECT_PAYMENT_GATEWAY",
        stripe_desc: "SECURE INTERNATIONAL PAYMENT GATEWAY",
        mercadopago_desc: "IDEAL FOR PAYMENTS IN LATIN AMERICA (COL / MEX / ARG / BRA)",
        transaction_error: "TRANSACTION_ERROR",
        dismiss: "DISMISS",
        back: "← BACK",
        initialize_acquisition: "INITIALIZE_ACQUISITION",
        authorisation_note: "By confirming, you authorize the secure transaction protocol through the selected gateway.",
        processing: "PROCESSING_",
        // Confirmation Step
        transaction_complete: "TRANSACTION_COMPLETE",
        order_confirmed: "ORDER_CONFIRMED",
        confirmation_desc: "Your assets are being prepared for deployment. You will receive a confirmation at your registered email.",
        order_reference: "ORDER_REFERENCE",
        return_to_base: "RETURN_TO_BASE",
        // Sidebar
        order_manifest: "ORDER_MANIFEST",
        asset: "ASSET",
        assets: "ASSETS",
        subtotal: "SUBTOTAL",
        shipping: "SHIPPING",
        total: "TOTAL",
        // Empty Cart
        empty_pipeline: "EMPTY_PIPELINE",
        no_assets: "NO ASSETS QUEUED FOR ACQUISITION",
        colombia: "Colombia",
        mexico: "Mexico",
        usa: "United States",
        spain: "Spain",
        argentina: "Argentina",
    },
    ES: {
        breadcrumb_home: "INICIO",
        breadcrumb_checkout: "PAGO",
        step_information: "información",
        step_payment: "pago",
        step_confirmation: "confirmación",
        // Information Step
        step_01: "PASO_01",
        contact_info: "INFOR_CONTACTO",
        email_address: "CORREO_ELECTRÓNICO",
        first_name: "NOMBRE",
        last_name: "APELLIDO",
        step_01b: "PASO_01B",
        shipping_coords: "COORDENADAS_ENVÍO",
        address: "DIRECCIÓN",
        city: "CIUDAD",
        country: "PAÍS",
        postal_code: "CÓDIGO_POSTAL",
        phone: "TELÉFONO",
        proceed_to_payment: "PROCEDER_AL_PAGO →",
        // Payment Step
        step_02: "PASO_02",
        payment_gateway: "PASARELA_DE_PAGO",
        delivery_to: "ENTREGA_A",
        modify_coords: "MODIFICAR_COORDENADAS",
        select_payment_gateway: "SELECCIONAR_PASARELA",
        stripe_desc: "PASARELA DE PAGO INTERNACIONAL SEGURA",
        mercadopago_desc: "IDEAL PARA PAGOS EN LATINOAMÉRICA (COL / MEX / ARG / BRA)",
        transaction_error: "ERROR_TRANSACCIÓN",
        dismiss: "DESCARTAR",
        back: "← VOLVER",
        initialize_acquisition: "INICIALIZAR_ADQUISICIÓN",
        authorisation_note: "Al confirmar, autorizas el protocolo de transacción segura a través de la pasarela seleccionada.",
        processing: "PROCESANDO_",
        // Confirmation Step
        transaction_complete: "TRANSACCIÓN_COMPLETA",
        order_confirmed: "ORDEN_CONFIRMADA",
        confirmation_desc: "Tus activos están siendo preparados para el despliegue. Recibirás una conﬁrmación en tu correo registrado.",
        order_reference: "REFERENCIA_ORDEN",
        return_to_base: "VOLVER_A_LA_BASE",
        // Sidebar
        order_manifest: "MANIFIESTO_ORDEN",
        asset: "ACTIVO",
        assets: "ACTIVOS",
        subtotal: "SUBTOTAL",
        shipping: "ENVÍO",
        total: "TOTAL",
        // Empty Cart
        empty_pipeline: "PIPELINE_VACÍO",
        no_assets: "SIN ACTIVOS EN COLA PARA ADQUISICIÓN",
        colombia: "Colombia",
        mexico: "México",
        usa: "Estados Unidos",
        spain: "España",
        argentina: "Argentina",
    }
};

export default function CheckoutPage() {
    const mounted = useMounted();
    const { language, currency } = useSettingsStore();
    const t = TRANSLATIONS[language];

    const router = useRouter();
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const [step, setStep] = useState<CheckoutStep>("information");
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mercadopago">("stripe");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        country: "Colombia",
        postalCode: "",
        phone: "",
    });

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice(); // Base USD

    // Helper to format prices correctly for UI
    const getFormatted = (usdStr: string) => formatPrice(usdStr, currency);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePayment = useCallback(async () => {
        setIsProcessing(true);
        setCheckoutError(null);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(i => ({
                        id: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                        image: i.image,
                    })),
                    customer: form,
                    total: totalPrice,
                    method: paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Server error (${res.status})`);
            }

            if (data.url) {
                window.location.href = data.url;
            } else if (data.orderId) {
                setOrderNumber(data.orderId);
                clearCart();
                setStep("confirmation");
            } else {
                throw new Error("Unexpected response from payment server");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            setCheckoutError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }, [items, form, totalPrice, paymentMethod, clearCart]);

    if (!mounted) return null;

    // Empty cart guard
    if (items.length === 0 && step !== "confirmation") {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-px bg-black/20 mb-8" />
                    <h1 className="font-heading text-3xl font-bold mb-4">{t.empty_pipeline}</h1>
                    <p className="font-mono text-[10px] opacity-50 tracking-[0.2em] mb-8">
                        {t.no_assets}
                    </p>
                    <Link
                        href="/"
                        className="mercury-btn px-12 py-4 font-mono text-[10px] tracking-[0.2em] uppercase sharp no-underline"
                    >
                        <span className="relative z-10">{t.return_to_base}</span>
                        <div className="btn-shine" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-6 md:py-8 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-10 font-mono text-[9px] opacity-40 tracking-[0.3em] uppercase">
                        <Link href="/" className="hover:opacity-100 transition-opacity">{t.breadcrumb_home}</Link>
                        <span>/</span>
                        <span className="text-gold-primary opacity-100">{t.breadcrumb_checkout}</span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-0 mb-16 max-w-md">
                        {(["information", "payment", "confirmation"] as CheckoutStep[]).map(
                            (s, i) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center font-mono text-[9px] border transition-colors ${step === s
                                                ? "bg-black text-white border-black"
                                                : i < ["information", "payment", "confirmation"].indexOf(step)
                                                    ? "bg-gold-primary text-white border-gold-primary"
                                                    : "border-black/20 text-black/30"
                                                }`}
                                        >
                                            {i + 1}
                                        </div>
                                        <span
                                            className={`font-mono text-[8px] tracking-[0.15em] uppercase hidden sm:block ${step === s ? "opacity-100" : "opacity-30"
                                                }`}
                                        >
                                            {t[`step_${s}` as keyof typeof t]}
                                        </span>
                                    </div>
                                    {i < 2 && (
                                        <div className="flex-1 h-px bg-black/10 mx-3" />
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Left: Form */}
                        <div className="lg:col-span-3">
                            {/* STEP 1: Information */}
                            {step === "information" && (
                                <form onSubmit={handleSubmitInfo} className="space-y-8">
                                    <div className="border-l-2 border-gold-primary pl-6">
                                        <span className="font-mono text-[10px] text-gold-muted tracking-[0.3em] uppercase block mb-2">
                                            {t.step_01}
                                        </span>
                                        <h2 className="font-heading text-xl md:text-3xl font-black tracking-tighter">
                                            {t.contact_info}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                {t.email_address}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                placeholder="operator@nexus.st"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    {t.first_name}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={form.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    {t.last_name}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={form.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-gold-primary pl-6 mt-12">
                                        <span className="font-mono text-[10px] text-gold-muted tracking-[0.3em] uppercase block mb-2">
                                            {t.step_01b}
                                        </span>
                                        <h2 className="font-heading text-xl md:text-3xl font-black tracking-tighter">
                                            {t.shipping_coords}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                {t.address}
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={form.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    {t.city}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={form.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    {t.country}
                                                </label>
                                                <select
                                                    name="country"
                                                    value={form.country}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                >
                                                    <option value="Colombia">{t.colombia}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    {t.postal_code}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={form.postalCode}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                {t.phone}
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                placeholder="+57"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-14 bg-black text-white font-mono text-[10px] tracking-[0.3em] uppercase sharp hover:bg-gold-primary transition-colors mt-8"
                                    >
                                        {t.proceed_to_payment}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: Payment */}
                            {step === "payment" && (
                                <div className="space-y-8">
                                    <div className="border-l-2 border-gold-primary pl-6">
                                        <span className="font-mono text-[10px] text-gold-muted tracking-[0.3em] uppercase block mb-2">
                                            {t.step_02}
                                        </span>
                                        <h2 className="font-heading text-3xl font-black tracking-tighter">
                                            {t.payment_gateway}
                                        </h2>
                                    </div>

                                    {/* Order Summary in Payment */}
                                    <div className="border border-black/10 p-6 space-y-4">
                                        <span className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block">
                                            {t.delivery_to}
                                        </span>
                                        <div className="font-mono text-sm">
                                            <p className="font-bold">{form.firstName} {form.lastName}</p>
                                            <p className="opacity-60">{form.address}</p>
                                            <p className="opacity-60">{form.city}, {form.country} {form.postalCode}</p>
                                            <p className="opacity-60">{form.email}</p>
                                        </div>
                                        <button
                                            onClick={() => setStep("information")}
                                            className="font-mono text-[9px] text-gold-primary tracking-[0.2em] uppercase hover:underline"
                                        >
                                            {t.modify_coords}
                                        </button>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-4">
                                        <span className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block">
                                            {t.select_payment_gateway}
                                        </span>

                                        <div 
                                            onClick={() => setPaymentMethod("stripe")}
                                            className={`border p-5 transition-all cursor-pointer group ${
                                                paymentMethod === "stripe" ? "border-black bg-black/5" : "border-black/15 hover:border-black/40"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full border-2 border-black ${paymentMethod === "stripe" ? "bg-black" : ""}`} />
                                                    <span className="font-mono text-sm font-bold">STRIPE (CREDIT / DEBIT)</span>
                                                </div>
                                                <div className="flex gap-2 opacity-40">
                                                    <span className="font-mono text-[8px] border border-black/20 px-2 py-0.5">VISA</span>
                                                    <span className="font-mono text-[8px] border border-black/20 px-2 py-0.5">MC</span>
                                                    <span className="font-mono text-[8px] border border-black/20 px-2 py-0.5">AMEX</span>
                                                </div>
                                            </div>
                                            <p className="font-mono text-[9px] opacity-40 mt-2 ml-6 uppercase">
                                                {t.stripe_desc}
                                            </p>
                                        </div>

                                        <div 
                                            onClick={() => setPaymentMethod("mercadopago")}
                                            className={`border p-5 transition-all cursor-pointer group ${
                                                paymentMethod === "mercadopago" ? "border-gold-primary bg-gold-primary/5 shadow-[0_0_15px_rgba(255,215,0,0.1)]" : "border-black/15 hover:border-gold-primary/40"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full border-2 border-gold-primary ${paymentMethod === "mercadopago" ? "bg-gold-primary" : ""}`} />
                                                    <span className="font-mono text-sm font-bold">MERCADO PAGO (LATAM)</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="bg-blue-600 text-[8px] text-white px-2 py-0.5 font-mono uppercase tracking-tighter">Local Pay</span>
                                                </div>
                                            </div>
                                            <p className="font-mono text-[9px] opacity-60 mt-2 ml-6 text-gold-muted uppercase">
                                                {t.mercadopago_desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {checkoutError && (
                                        <div className="border border-red-500/30 bg-red-500/5 p-4 mt-4">
                                            <span className="font-mono text-[9px] text-red-600 tracking-[0.2em] uppercase block mb-1">{t.transaction_error}</span>
                                            <p className="font-mono text-sm text-red-700">{checkoutError}</p>
                                            <button
                                                onClick={() => setCheckoutError(null)}
                                                className="font-mono text-[9px] text-red-500 tracking-[0.2em] uppercase hover:underline mt-2"
                                            >
                                                {t.dismiss}
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4 mt-8">
                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                            <button
                                                onClick={() => setStep("information")}
                                                className="flex-1 h-14 border border-black/20 font-mono text-[10px] tracking-[0.2em] uppercase sharp hover:border-black/50 transition-colors"
                                            >
                                                {t.back}
                                            </button>
                                            <button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className="flex-[2] h-14 bg-black text-white font-mono text-[10px] tracking-[0.3em] uppercase sharp hover:bg-gold-primary transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-3"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="h-1 w-8 bg-white animate-pulse rounded-full" />
                                                        {t.processing}
                                                    </>
                                                ) : (
                                                    <>{t.initialize_acquisition} // {getFormatted(totalPrice.toFixed(2))}</>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-center font-mono text-[8px] opacity-30 uppercase tracking-[0.2em]">
                                            {t.authorisation_note}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Confirmation */}
                            {step === "confirmation" && (
                                <div className="space-y-8 text-center py-12">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 border-2 border-gold-primary flex items-center justify-center mb-6">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-primary">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <span className="font-mono text-[10px] text-gold-muted tracking-[0.4em] uppercase block mb-4">
                                            {t.transaction_complete}
                                        </span>
                                        <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tighter mb-4">
                                            {t.order_confirmed}
                                        </h2>
                                        <p className="font-mono text-sm opacity-60 max-w-md">
                                            {t.confirmation_desc}
                                        </p>
                                    </div>

                                    <div className="border border-black/10 p-6 max-w-sm mx-auto">
                                        <span className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block mb-3">
                                            {t.order_reference}
                                        </span>
                                        <span className="font-heading text-2xl font-black text-gold-primary">
                                            {orderNumber}
                                        </span>
                                    </div>

                                    <Link
                                        href="/"
                                        className="inline-block mt-8 mercury-btn px-12 py-4 font-mono text-[10px] tracking-[0.2em] uppercase sharp no-underline"
                                    >
                                        <span className="relative z-10">{t.return_to_base}</span>
                                        <div className="btn-shine" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Order Summary Sidebar */}
                        {step !== "confirmation" && (
                            <div className="lg:col-span-2">
                                <div className="border border-black/10 sticky top-28">
                                    <div className="px-6 py-4 border-b border-black/10">
                                        <span className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase">
                                            {t.order_manifest} // {totalItems} {totalItems === 1 ? t.asset : t.assets}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-black/5">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3 p-4">
                                                <div className="relative w-14 h-16 shrink-0 overflow-hidden border border-black/5">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover grayscale brightness-95"
                                                    />
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white font-mono text-[8px] flex items-center justify-center">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <span className="font-heading text-[11px] font-bold uppercase truncate block">
                                                        {item.name}
                                                    </span>
                                                    <span className="font-mono text-xs font-bold">
                                                        {getFormatted(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-6 py-4 border-t border-black/10 space-y-2">
                                        <div className="flex justify-between font-mono text-[10px] opacity-50">
                                            <span>{t.subtotal}</span>
                                            <span>{getFormatted(totalPrice.toFixed(2))}</span>
                                        </div>
                                        <div className="flex justify-between font-mono text-[10px] opacity-50">
                                            <span>{t.shipping}</span>
                                            <span>{getFormatted("$0.00")}</span>
                                        </div>
                                        <div className="h-px bg-black/10" />
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="font-heading text-sm font-bold">{t.total}</span>
                                            <span className="font-heading text-xl font-black">{getFormatted(totalPrice.toFixed(2))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
