"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import SearchOverlay from "./SearchOverlay";
import { useCartStore } from "@/lib/cart-store";
import { useSettingsStore } from "@/lib/settings-store";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState("00:00:00");
    const [sessionSecs, setSessionSecs] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { getTotalItems, openCart } = useCartStore();
    const { language, currency, setLanguage, setCurrency } = useSettingsStore();
    const totalItems = getTotalItems();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen, isSearchOpen]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const bogotaTime = now.toLocaleTimeString("en-GB", {
                timeZone: "America/Bogota",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
            setTime(bogotaTime);
            setSessionSecs(s => s + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatSession = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}s`;
    };

    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
            scrollTimer.current = setTimeout(() => setIsScrolling(false), 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const mercuryClass = isScrolling ? "mercury-active" : "";

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#b3b3b3]">
                {/* Announcement Bar / System Status */}
                <div className="flex w-full industrial-border-b font-mono text-[9px] wide-tracking h-8 items-center uppercase overflow-hidden">
                    <div className={`w-1/4 industrial-border-r h-full flex items-center justify-center gap-3 px-4 mercury-border ${mercuryClass}`}>
                        <span className="opacity-50 text-[7px] animate-pulse">●</span>
                        <span>BOG_{mounted ? time : "00:00:00"}</span>
                        <span className="opacity-30">|</span>
                        <span>SESSION_{mounted ? formatSession(sessionSecs) : "00:00s"}</span>
                    </div>

                    <div className={`flex-[1.5] text-center px-4 industrial-border-r h-full flex items-center justify-center mercury-border ${mercuryClass}`}>
                        {!mounted ? "NEXUS SAINT // ACCESS_GRANTED" : (language === "EN" ? "NEW IN: SPRING/SUMMER '25 COLLECTION // ACCESS_GRANTED" : "NOVEDADES: COLECCIÓN SPRING/SUMMER '25 // ACCESO_CONCEDIDO")}
                    </div>

                    <div className={`w-1/3 text-center px-4 h-full flex items-center justify-center mercury-border ${mercuryClass}`}>
                        {!mounted ? "COMPLIMENTARY WORLDWIDE SHIPPING" : (language === "EN" ? "COMPLIMENTARY WORLDWIDE SHIPPING // [ STATUS: OPERATIONAL ]" : "ENVÍO MUNDIAL DE CORTESÍA // [ ESTADO: OPERATIVO ]")}
                    </div>
                </div>

                {/* Main Navigation Bar */}
                <nav className="flex w-full industrial-border-b h-12 items-center font-mono text-[10px] wide-tracking uppercase">
                    {/* Menu Section */}
                    <div
                        onClick={() => setIsMenuOpen(true)}
                        className={`w-1/4 h-full industrial-border-r flex items-center px-6 gap-2 hover:bg-black/5 cursor-pointer transition-colors mercury-border ${mercuryClass}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        <span>{mounted && language === "ES" ? "MENÚ" : "MENU"}</span>
                    </div>

                    {/* Brand Protagonist (Centered) */}
                    <Link href="/" className={`flex-[1.5] h-full flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors group mercury-border ${mercuryClass}`}>
                        <span className="font-heading text-2xl font-black tracking-[0.1em]">NXST</span>
                    </Link>

                    {/* Search, Currency, Cart */}
                    <div className="flex w-1/3 h-full items-center">
                        <div
                            onClick={() => setIsSearchOpen(true)}
                            className={`flex-1 h-full industrial-border-l flex items-center justify-center gap-2 hover:bg-black/5 cursor-pointer transition-colors mercury-border ${mercuryClass}`}
                        >
                            <span>{mounted && language === "ES" ? "BUSCAR" : "SEARCH"}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>

                        <div className={`flex-1 h-full industrial-border-l flex items-center justify-center gap-4 hover:bg-black/5 transition-colors mercury-border ${mercuryClass}`}>
                            <button
                                onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                                className="hover:text-gold-primary transition-colors cursor-pointer"
                            >
                                {mounted ? language : "EN"} ⌄
                            </button>
                            <button
                                onClick={() => setCurrency(currency === "USD" ? "COP" : "USD")}
                                className="hover:text-gold-primary transition-colors cursor-pointer"
                            >
                                {mounted ? currency : "USD"} ⌄
                            </button>
                        </div>

                        <div
                            onClick={openCart}
                            className={`flex-1 h-full industrial-border-l flex items-center justify-center gap-2 hover:bg-black/5 cursor-pointer transition-colors font-bold mercury-border ${mercuryClass} ${totalItems > 0 ? "text-gold-primary" : ""}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${totalItems > 0 ? "bg-gold-primary animate-pulse" : "bg-black"}`}></div>
                            <span>{mounted && language === "ES" ? "CARRITO" : "CART"} [{totalItems}]</span>
                        </div>
                    </div>
                </nav>
            </header>
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

