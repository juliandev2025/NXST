"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

type CheckoutStep = "information" | "payment" | "confirmation";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const [step, setStep] = useState<CheckoutStep>("information");
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mercadopago">("stripe");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

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
    const totalPrice = getTotalPrice();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePayment = async () => {
        setIsProcessing(true);
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

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else if (data.orderId) {
                // Fallback: direct confirmation (when Stripe is not configured)
                setOrderNumber(data.orderId);
                clearCart();
                setStep("confirmation");
            } else {
                throw new Error(data.error || "Payment failed");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            // Show confirmation anyway for demo purposes
            const demoOrderId = "NXST-" + Date.now().toString(36).toUpperCase();
            setOrderNumber(demoOrderId);
            clearCart();
            setStep("confirmation");
        } finally {
            setIsProcessing(false);
        }
    };

    // Empty cart guard
    if (items.length === 0 && step !== "confirmation") {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-px bg-black/20 mb-8" />
                    <h1 className="font-heading text-3xl font-bold mb-4">EMPTY_PIPELINE</h1>
                    <p className="font-mono text-[10px] opacity-50 tracking-[0.2em] mb-8">
                        NO ASSETS QUEUED FOR ACQUISITION
                    </p>
                    <Link
                        href="/"
                        className="mercury-btn px-12 py-4 font-mono text-[10px] tracking-[0.2em] uppercase sharp no-underline"
                    >
                        <span className="relative z-10">RETURN_TO_BASE</span>
                        <div className="btn-shine" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-8 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-10 font-mono text-[9px] opacity-40 tracking-[0.3em] uppercase">
                        <Link href="/" className="hover:opacity-100 transition-opacity">HOME</Link>
                        <span>/</span>
                        <span className="text-gold-primary opacity-100">CHECKOUT</span>
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
                                            {s}
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
                                            STEP_01
                                        </span>
                                        <h2 className="font-heading text-3xl font-black tracking-tighter">
                                            CONTACT_INFO
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                EMAIL_ADDRESS
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
                                                    FIRST_NAME
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
                                                    LAST_NAME
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
                                            STEP_01B
                                        </span>
                                        <h2 className="font-heading text-3xl font-black tracking-tighter">
                                            SHIPPING_COORDS
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                ADDRESS
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

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    CITY
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
                                                    COUNTRY
                                                </label>
                                                <select
                                                    name="country"
                                                    value={form.country}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-gold-primary focus:outline-none transition-colors sharp"
                                                >
                                                    <option value="Colombia">Colombia</option>
                                                    <option value="Mexico">México</option>
                                                    <option value="USA">United States</option>
                                                    <option value="Spain">España</option>
                                                    <option value="Argentina">Argentina</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block mb-2">
                                                    POSTAL_CODE
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
                                                PHONE
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
                                        PROCEED_TO_PAYMENT →
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: Payment */}
                            {step === "payment" && (
                                <div className="space-y-8">
                                    <div className="border-l-2 border-gold-primary pl-6">
                                        <span className="font-mono text-[10px] text-gold-muted tracking-[0.3em] uppercase block mb-2">
                                            STEP_02
                                        </span>
                                        <h2 className="font-heading text-3xl font-black tracking-tighter">
                                            PAYMENT_GATEWAY
                                        </h2>
                                    </div>

                                    {/* Order Summary in Payment */}
                                    <div className="border border-black/10 p-6 space-y-4">
                                        <span className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block">
                                            DELIVERY_TO
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
                                            MODIFY_COORDS
                                        </button>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-4">
                                        <span className="font-mono text-[9px] opacity-50 tracking-[0.2em] uppercase block">
                                            SELECT_PAYMENT_GATEWAY
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
                                                SECURE INTERNATIONAL PAYMENT GATEWAY
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
                                                IDEAL FOR PAYMENTS IN LATIN AMERICA (COL / MEX / ARG / BRA)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 mt-8">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep("information")}
                                                className="flex-1 h-14 border border-black/20 font-mono text-[10px] tracking-[0.2em] uppercase sharp hover:border-black/50 transition-colors"
                                            >
                                                ← BACK
                                            </button>
                                            <button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className="flex-[2] h-14 bg-black text-white font-mono text-[10px] tracking-[0.3em] uppercase sharp hover:bg-gold-primary transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-3"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="h-1 w-8 bg-white animate-pulse rounded-full" />
                                                        PROCESSING_
                                                    </>
                                                ) : (
                                                    <>INITIALIZE_ACQUISITION // ${totalPrice.toFixed(2)}</>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-center font-mono text-[8px] opacity-30 uppercase tracking-[0.2em]">
                                            By confirming, you authorize the secure transaction protocol through the selected gateway.
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
                                            TRANSACTION_COMPLETE
                                        </span>
                                        <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tighter mb-4">
                                            ORDER_CONFIRMED
                                        </h2>
                                        <p className="font-mono text-sm opacity-60 max-w-md">
                                            Your assets are being prepared for deployment. You will receive a confirmation at your registered email.
                                        </p>
                                    </div>

                                    <div className="border border-black/10 p-6 max-w-sm mx-auto">
                                        <span className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block mb-3">
                                            ORDER_REFERENCE
                                        </span>
                                        <span className="font-heading text-2xl font-black text-gold-primary">
                                            {orderNumber}
                                        </span>
                                    </div>

                                    <Link
                                        href="/"
                                        className="inline-block mt-8 mercury-btn px-12 py-4 font-mono text-[10px] tracking-[0.2em] uppercase sharp no-underline"
                                    >
                                        <span className="relative z-10">RETURN_TO_BASE</span>
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
                                            ORDER_MANIFEST // {totalItems} ASSET{totalItems !== 1 ? "S" : ""}
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
                                                        {item.price}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-6 py-4 border-t border-black/10 space-y-2">
                                        <div className="flex justify-between font-mono text-[10px] opacity-50">
                                            <span>SUBTOTAL</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-mono text-[10px] opacity-50">
                                            <span>SHIPPING</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="h-px bg-black/10" />
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="font-heading text-sm font-bold">TOTAL</span>
                                            <span className="font-heading text-xl font-black">${totalPrice.toFixed(2)}</span>
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
