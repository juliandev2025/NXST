"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/lib/settings-store";

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const getLinks = (isEs: boolean) => [
    { label: isEs ? "NUEVA COLECCIÓN" : "NEW COLLECTION", href: "/nueva-coleccion" },
    { label: isEs ? "CAMISETAS" : "T-SHIRTS", href: "/camisetas" },
    { label: "HOODIES", href: "/hoodies" },
    { label: isEs ? "CHAQUETAS" : "JACKETS", href: "/chaquetas" },
    { label: isEs ? "ARCHIVO" : "ARCHIVE", href: "/archive" },
];

export default function Menu({ isOpen, onClose }: MenuProps) {
    const [mounted, setMounted] = useState(false);
    const { language } = useSettingsStore();
    const [time, setTime] = useState("00:00:00");
    const isEs = language === "ES";
    const MAIN_LINKS = getLinks(mounted && isEs);

    useEffect(() => {
        setMounted(true);
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
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#b3b3b3]/95 backdrop-blur-xl flex flex-col items-stretch overflow-hidden text-black">

            {/* Header Bar */}
            <div className="flex w-full industrial-border-b h-12 items-center font-mono text-[10px] wide-tracking uppercase shrink-0">
                <div
                    onClick={onClose}
                    className="h-full industrial-border-r flex items-center px-4 md:px-6 gap-2 hover:bg-black/5 cursor-pointer transition-colors shrink-0"
                >
                    <div className="w-4 h-[1px] bg-black rotate-45 absolute"></div>
                    <div className="w-4 h-[1px] bg-black -rotate-45 relative"></div>
                    <span className="ml-4">{mounted && isEs ? "CERRAR" : "CLOSE"}</span>
                </div>
                <div className="flex-1 h-full flex items-center justify-center min-w-0 overflow-hidden px-2">
                    <span className="font-heading text-base md:text-xl font-black tracking-[0.1em] truncate">{mounted && isEs ? "INTERFAZ_NAV" : "NAV_INTERFACE"}</span>
                </div>
                <div className="h-full industrial-border-l flex items-center justify-center px-4 md:px-6 shrink-0">
                    <span className="opacity-50 text-[8px]">BOG_{mounted ? time : "00:00:00"}</span>
                </div>
            </div>


            {/* Content — stacks vertically on mobile, 3 cols on md+ */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 w-full overflow-y-auto">

                {/* Column 1: Main Navigation */}
                <div className="industrial-border-r p-6 md:p-12 flex flex-col justify-between">
                    <div className="space-y-4">
                        <span className="font-mono text-[9px] opacity-40 block mb-4 md:mb-6">/ {mounted && isEs ? "UNIDADES_DESPLIEGUE" : "DEPLOYMENT_UNITS"}</span>
                        <nav className="flex flex-col space-y-1 md:space-y-2">
                            {MAIN_LINKS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onClose}
                                    className="font-heading text-2xl md:text-4xl lg:text-5xl font-black hover:italic hover:translate-x-4 transition-all duration-500 flex items-center group"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 mr-4 text-sm font-mono translate-y-[-10px] hidden md:inline">▶</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-2 pt-6 md:pt-12">
                        <span className="font-mono text-[9px] opacity-40 block mb-4">/ {mounted && isEs ? "PROTOCOLO_SISTEMA" : "SYSTEM_PROTOCOLS"}</span>
                        <div className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-2">
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "MI CUENTA" : "MY ACCOUNT"}</Link>
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "RASTREO PEDIDO" : "ORDER TRACKING"}</Link>
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "LISTA DESEOS" : "WISH LIST"}</Link>
                        </div>
                    </div>
                </div>


                {/* Column 2: Collections */}
                <div className="flex industrial-border-r p-6 md:p-12 flex-col bg-black/[0.02] border-t md:border-t-0">
                    <span className="font-mono text-[9px] opacity-40 block mb-8">/ {mounted && isEs ? "SECUENCIAS_ACTIVAS" : "ACTIVE_SEQUENCES"}</span>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <Link href="/collections/spring-summer-25" onClick={onClose} className="font-heading text-lg font-bold mb-4 block hover:text-gold-primary transition-colors">
                                {mounted && isEs ? "SPRING/SUMMER '25" : "SPRING/SUMMER '25"}
                            </Link>
                            <div className="space-y-2">
                                {[(mounted && isEs ? 'Camisetas Limitadas' : 'Limited T-Shirts'), (mounted && isEs ? 'Cápsula Alpha' : 'Capsule Alpha'), (mounted && isEs ? 'Accesorios' : 'Accessories')].map(sub => (
                                    <Link key={sub} href="/collections/spring-summer-25" onClick={onClose} className="flex justify-between items-center group py-2 industrial-border-b border-black/5 last:border-0 hover:px-2 transition-all">
                                        <span className="font-mono text-[11px] opacity-70">{sub}</span>
                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">{mounted && isEs ? "ACCEDER_" : "ACCESS_"}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Link href="/collections/essential-wear" onClick={onClose} className="font-heading text-lg font-bold mb-4 block hover:text-gold-primary transition-colors">
                                {mounted && isEs ? "ROPA_ESENCIAL" : "ESSENTIAL_WEAR"}
                            </Link>
                            <div className="space-y-2">
                                {[(mounted && isEs ? 'Camisetas Oversized' : 'Oversized Tees'), (mounted && isEs ? 'Pantalones Cargo' : 'Cargo Pants'), (mounted && isEs ? 'Capas Exteriores' : 'Outer Shells')].map(sub => (
                                    <Link key={sub} href="/collections/essential-wear" onClick={onClose} className="flex justify-between items-center group py-2 industrial-border-b border-black/5 last:border-0 hover:px-2 transition-all">
                                        <span className="font-mono text-[11px] opacity-70">{sub}</span>
                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">ACCESS_</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Column 3: Manifesto & Social */}
                <div className="flex p-6 md:p-12 flex-col justify-between border-t md:border-t-0">
                    <div>
                        <span className="font-mono text-[9px] opacity-40 block mb-8">/ {mounted && isEs ? "MANIFESTO_LAB" : "LAB_MANIFESTO"}</span>
                        <div className="space-y-8">
                            <p className="font-mono text-[11px] leading-relaxed opacity-60 max-w-[280px]">
                                {mounted && isEs
                                    ? "NEXUS SAINT ES UNA RESPUESTA SISTÉMICA A LA CONDICIÓN POSTHUMANA. DESARROLLAMOS ROPA COMO INTERFAZ, MEZCLANDO FUNCIONALIDAD INDUSTRIAL CON ESTÉTICA CIBERNÉTICA."
                                    : "NEXUS SAINT IS A SYSTEMIC RESPONSE TO THE POSTHUMAN CONDITION. WE DEVELOP APPAREL AS INTERFACE, BLENDING INDUSTRIAL FUNCTIONALITY WITH CYBERNETIC AESTHETICS."}
                            </p>
                            <nav className="flex flex-col space-y-4">
                                <Link href="#" className="font-heading text-xl font-bold hover:tracking-widest transition-all">{mounted && isEs ? "MANIFIESTO" : "MANIFESTO"}</Link>
                                <Link href="#" className="font-heading text-xl font-bold hover:tracking-widest transition-all">{mounted && isEs ? "TIENDAS" : "STORES"}</Link>
                                <Link href="#" className="font-heading text-xl font-bold hover:tracking-widest transition-all">{mounted && isEs ? "CONTACTO" : "CONTACT"}</Link>
                            </nav>
                        </div>
                    </div>

                    <div className="pt-12">
                        <span className="font-mono text-[9px] opacity-40 block mb-4">/ SOC_CHANNEL</span>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/julia4n_/" target="_blank" className="w-10 h-10 industrial-border flex items-center justify-center font-mono text-[8px] hover:bg-black hover:text-white transition-colors">INST</a>
                            <a href="#" className="w-10 h-10 industrial-border flex items-center justify-center font-mono text-[8px] hover:bg-black hover:text-white transition-colors">TWIT</a>
                            <a href="#" className="w-10 h-10 industrial-border flex items-center justify-center font-mono text-[8px] hover:bg-black hover:text-white transition-colors">DISC</a>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer Bar */}
            <div className="flex w-full industrial-border-t h-10 md:h-12 items-center font-mono text-[7px] md:text-[8px] wide-tracking uppercase px-4 md:px-8 justify-between opacity-40 shrink-0">
                <span>© 2025 NEXUS_SAINT_SYSTEMS</span>
                <div className="flex gap-4 md:gap-12">
                    <span className="hidden sm:inline">{mounted && isEs ? "ESTADO: OPERATIVO" : "STATUS: OPERATIONAL"}</span>
                    <span className="hidden md:inline">{mounted && isEs ? "ENCRIPTACIÓN: ACTIVA" : "ENCRYPTION: ACTIVE"}</span>
                    <span>LOC: BOGOTA_COL</span>
                </div>
            </div>


            <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-black/5 pointer-events-none hidden md:block"></div>
            <div className="absolute top-0 bottom-0 left-[58.33%] w-[1px] bg-black/5 pointer-events-none hidden md:block"></div>
        </div>
    );
}
