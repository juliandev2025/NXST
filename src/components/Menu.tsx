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

            <div className="flex w-full industrial-border-b h-12 items-center font-mono text-[10px] wide-tracking uppercase">
                <div
                    onClick={onClose}
                    className="w-1/4 h-full industrial-border-r flex items-center px-6 gap-2 hover:bg-black/5 cursor-pointer transition-colors"
                >
                    <div className="w-4 h-[1px] bg-black rotate-45 absolute"></div>
                    <div className="w-4 h-[1px] bg-black -rotate-45 relative"></div>
                    <span className="ml-4">{mounted && isEs ? "CERRAR" : "CLOSE"}</span>
                </div>
                <div className="flex-[1.5] h-full flex items-center justify-center">
                    <span className="font-heading text-xl font-black tracking-[0.1em]">{mounted && isEs ? "INTERFAZ_NAVEGACIÓN" : "NAVIGATION_INTERFACE"}</span>
                </div>
                <div className="w-1/3 h-full industrial-border-l flex items-center justify-center px-6">
                    <span className="opacity-50">BOG_{mounted ? time : "00:00:00"}</span>
                </div>
            </div>


            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 w-full">

                <div className="industrial-border-r p-8 md:p-12 flex flex-col justify-between">
                    <div className="space-y-4">
                        <span className="font-mono text-[9px] opacity-40 block mb-6">/ {mounted && isEs ? "UNIDADES_DESPLIEGUE" : "DEPLOYMENT_UNITS"}</span>
                        <nav className="flex flex-col space-y-2">
                            {MAIN_LINKS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onClose}
                                    className="font-heading text-4xl md:text-5xl font-black hover:italic hover:translate-x-4 transition-all duration-500 flex items-center group"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 mr-4 text-sm font-mono translate-y-[-10px]">▶</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-2 pt-12">
                        <span className="font-mono text-[9px] opacity-40 block mb-4">/ {mounted && isEs ? "PROTOCOLO_SISTEMA" : "SYSTEM_PROTOCOLS"}</span>
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "MI CUENTA" : "MY ACCOUNT"}</Link>
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "RASTREO PEDIDO" : "ORDER TRACKING"}</Link>
                            <Link href="#" className="font-mono text-[10px] hover:underline underline-offset-4 decoration-1">{mounted && isEs ? "LISTA DESEOS" : "WISH LIST"}</Link>
                        </div>
                    </div>
                </div>


                <div className="industrial-border-r p-8 md:p-12 flex flex-col bg-black/[0.02]">
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


                <div className="p-8 md:p-12 flex flex-col justify-between">
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


            <div className="flex w-full industrial-border-t h-12 items-center font-mono text-[8px] wide-tracking uppercase px-8 justify-between opacity-40">
                <span>© 2025 NEXUS_SAINT_SYSTEMS</span>
                <div className="flex gap-12">
                    <span>{mounted && isEs ? "ESTADO: OPERATIVO" : "STATUS: OPERATIONAL"}</span>
                    <span>{mounted && isEs ? "ENCRIPTACIÓN: ACTIVA" : "ENCRYPTION: ACTIVE"}</span>
                    <span>LOC: BOGOTA_COL</span>
                </div>
            </div>


            <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-black/5 pointer-events-none hidden md:block"></div>
            <div className="absolute top-0 bottom-0 left-[58.33%] w-[1px] bg-black/5 pointer-events-none hidden md:block"></div>
        </div>
    );
}
