"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Menu from "./Menu";
import SearchOverlay from "./SearchOverlay";
import { useCartStore } from "@/lib/cart-store";
import { useSettingsStore } from "@/lib/settings-store";
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState("00:00:00");
    const [sessionSecs, setSessionSecs] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { getTotalItems, openCart } = useCartStore();
    const { language, currency, setLanguage, setCurrency } = useSettingsStore();
    const { user, isAuthenticated } = useAuthStore();
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
                {/* Announcement Bar — hidden on mobile, visible on md+ */}
                <div className="hidden md:flex w-full industrial-border-b font-mono text-[9px] wide-tracking h-8 items-center uppercase overflow-hidden">
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
                        {!mounted ? "SHIPPING ONLY TO COLOMBIA" : (language === "EN" ? "SHIPPING ONLY TO COLOMBIA // [ STATUS: OPERATIONAL ]" : "ENVÍO EXCLUSIVO A COLOMBIA // [ ESTADO: OPERATIVO ]")}
                    </div>
                </div>

                {/* Mobile Announcement Bar — single line marquee */}
                <div className="flex md:hidden w-full industrial-border-b font-mono text-[8px] wide-tracking h-7 items-center uppercase overflow-hidden px-3 justify-center">
                    <span className="opacity-50 text-[6px] animate-pulse mr-2">●</span>
                    <span className="truncate">
                        {!mounted ? "NEXUS SAINT // ACCESS_GRANTED" : (language === "EN" ? "SPRING/SUMMER '25 // COLOMBIA ONLY" : "SPRING/SUMMER '25 // SOLO COLOMBIA")}
                    </span>
                </div>

                {/* Main Navigation Bar */}
                <nav className="flex w-full industrial-border-b h-12 items-center font-mono text-[10px] wide-tracking uppercase">
                    {/* Menu Button */}
                    <div
                        onClick={() => setIsMenuOpen(true)}
                        className={`h-full industrial-border-r flex items-center px-4 md:px-6 gap-2 hover:bg-black/5 cursor-pointer transition-colors mercury-border shrink-0 ${mercuryClass}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        <span className="hidden sm:inline">{mounted && language === "ES" ? "MENÚ" : "MENU"}</span>
                    </div>

                    {/* Brand Protagonist (Centered) */}
                    <Link href="/" className={`flex-1 h-full flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors group mercury-border ${mercuryClass}`}>
                        <span className="font-heading text-xl md:text-2xl font-black tracking-[0.1em]">NXST</span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex h-full items-center shrink-0">
                        {/* Search — icon only on mobile */}
                        <div
                            onClick={() => setIsSearchOpen(true)}
                            className={`h-full industrial-border-l flex items-center justify-center gap-2 hover:bg-black/5 cursor-pointer transition-colors mercury-border px-3 md:px-4 ${mercuryClass}`}
                        >
                            <span className="hidden sm:inline">{mounted && language === "ES" ? "BUSCAR" : "SEARCH"}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>

                        {/* Language / Currency toggles */}
                        <div className={`h-full industrial-border-l flex items-center justify-center gap-2 md:gap-4 hover:bg-black/5 transition-colors mercury-border px-2 md:px-4 ${mercuryClass}`}>
                            <button
                                onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
                                className="hover:text-gold-primary transition-colors cursor-pointer text-[9px] md:text-[10px]"
                            >
                                {mounted ? language : "EN"}
                            </button>
                            <button
                                onClick={() => setCurrency(currency === "USD" ? "COP" : "USD")}
                                className="hover:text-gold-primary transition-colors cursor-pointer text-[9px] md:text-[10px]"
                            >
                                {mounted ? currency : "USD"}
                            </button>
                        </div>

                        {/* Account */}
                        <Link 
                            href={isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : "/account") : "/login"}
                            className={`h-full industrial-border-l flex items-center justify-center gap-2 hover:bg-black/5 cursor-pointer transition-colors mercury-border px-3 md:px-4 ${mercuryClass}`}
                        >
                            <span className="hidden sm:inline">{mounted && language === "ES" ? (isAuthenticated ? "CUENTA" : "INGRESAR") : (isAuthenticated ? "ACCOUNT" : "SIGN IN")}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </Link>

                        {/* Cart */}
                        <div
                            onClick={openCart}
                            className={`h-full industrial-border-l flex items-center justify-center gap-1.5 md:gap-2 hover:bg-black/5 cursor-pointer transition-colors font-bold mercury-border px-3 md:px-4 ${mercuryClass} ${totalItems > 0 ? "text-gold-primary" : ""}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${totalItems > 0 ? "bg-gold-primary animate-pulse" : "bg-black"}`}></div>
                            <span className="hidden sm:inline">{mounted && language === "ES" ? "CARRITO" : "CART"}</span>
                            <span>[{totalItems}]</span>
                        </div>
                    </div>
                </nav>
            </header>
            <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
