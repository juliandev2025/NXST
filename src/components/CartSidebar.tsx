"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useEffect } from "react";

export default function CartSidebar() {
    const {
        items,
        isCartOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
    } = useCartStore();

    // Lock body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeCart}
            />

            {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-[#b3b3b3] z-[100] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
                {/* Header */}
                <div className="flex items-center justify-between h-14 px-6 border-b border-black/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                        <span className="font-heading text-sm font-bold tracking-[0.15em] uppercase">
                            CART_INTERFACE
                        </span>
                        <span className="font-mono text-[9px] opacity-40">
                            [{totalItems.toString().padStart(2, "0")}]
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors group"
                    >
                        <div className="relative w-3.5 h-3.5">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-black rotate-45 group-hover:bg-gold-primary transition-colors" />
                            <div className="absolute top-1/2 left-0 w-full h-px bg-black -rotate-45 group-hover:bg-gold-primary transition-colors" />
                        </div>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-16 h-px bg-black/15 mb-8" />
                            <h3 className="font-heading text-xl font-bold mb-3 opacity-60">
                                EMPTY_QUEUE
                            </h3>
                            <p className="font-mono text-[10px] opacity-40 tracking-[0.15em] max-w-[220px] leading-relaxed">
                                NO ASSETS IN ACQUISITION PIPELINE. BROWSE THE COLLECTION TO ADD ITEMS.
                            </p>
                            <div className="w-16 h-px bg-black/15 mt-8" />
                            <button
                                onClick={closeCart}
                                className="mt-8 mercury-btn px-8 py-3 font-mono text-[10px] tracking-[0.2em] uppercase sharp"
                            >
                                <span className="relative z-10">BROWSE_ASSETS</span>
                                <div className="btn-shine" />
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/5">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-5 group hover:bg-black/[0.02] transition-colors"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-24 shrink-0 overflow-hidden border border-black/5">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover grayscale brightness-95 contrast-105"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-heading text-xs font-bold leading-tight uppercase truncate">
                                                    {item.name}
                                                </h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="shrink-0 w-5 h-5 flex items-center justify-center opacity-30 hover:opacity-100 hover:text-red-600 transition-all"
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <span className="font-mono text-[8px] opacity-40 tracking-wider">
                                                {item.category} // REF:{item.id.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-black/15">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center font-mono text-xs hover:bg-black hover:text-white transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 h-7 flex items-center justify-center font-mono text-[10px] border-x border-black/15">
                                                    {item.quantity.toString().padStart(2, "0")}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    className="w-7 h-7 flex items-center justify-center font-mono text-xs hover:bg-black hover:text-white transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="font-mono text-sm font-bold">
                                                {item.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className="shrink-0 border-t border-black/10 bg-black/[0.02]">
                        {/* Summary */}
                        <div className="px-6 py-4 space-y-2">
                            <div className="flex justify-between font-mono text-[10px] opacity-50">
                                <span>SUBTOTAL ({totalItems} ITEM{totalItems !== 1 ? "S" : ""})</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-mono text-[10px] opacity-50">
                                <span>SHIPPING</span>
                                <span>COMPLIMENTARY</span>
                            </div>
                            <div className="h-px bg-black/10" />
                            <div className="flex justify-between items-center">
                                <span className="font-heading text-sm font-bold tracking-wide">
                                    TOTAL
                                </span>
                                <span className="font-heading text-xl font-black">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Checkout Buttons */}
                        <div className="px-6 pb-5 space-y-2">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="w-full h-12 bg-black text-white font-mono text-[10px] tracking-[0.3em] uppercase sharp hover:bg-gold-primary transition-colors flex items-center justify-center no-underline"
                            >
                                PROCEED_TO_CHECKOUT
                            </Link>
                            <button
                                onClick={closeCart}
                                className="w-full h-10 border border-black/20 font-mono text-[10px] tracking-[0.2em] uppercase sharp hover:border-black/50 transition-colors"
                            >
                                CONTINUE_BROWSING
                            </button>
                        </div>

                        {/* Security Footer */}
                        <div className="px-6 pb-4 flex justify-center gap-6 font-mono text-[7px] opacity-30 uppercase tracking-widest">
                            <span>🔒 SECURE_CHECKOUT</span>
                            <span>ENCRYPTION: AES-256</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
