"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_PRODUCTS } from "@/lib/products";
import { useSettingsStore } from "@/lib/settings-store";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(ALL_PRODUCTS.slice(0, 4));
    const inputRef = useRef<HTMLInputElement>(null);
    const { language } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults(ALL_PRODUCTS.slice(0, 4));
            return;
        }

        const filtered = ALL_PRODUCTS.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 8));
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#b3b3b3] animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex h-20 items-center justify-between px-6 md:px-12 industrial-border-b">
                <div className="flex flex-1 items-center gap-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={mounted && language === "ES" ? "INGRESAR_CONSULTA_BÚSQUEDA..." : "ENTER_SEARCH_QUERY..."}
                        className="w-full bg-transparent border-none outline-none font-mono text-sm tracking-widest uppercase placeholder:opacity-30"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && onClose()}
                    />
                </div>
                <button
                    onClick={onClose}
                    className="font-mono text-[10px] tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                    [ ESC / {mounted && language === "ES" ? "CERRAR" : "CLOSE"} ]
                </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10 opacity-40">
                        <span className="font-mono text-[9px] tracking-[0.3em]">
                            {query 
                                ? (mounted && language === "ES" ? `RESULTADOS_BÚSQUEDA: ${results.length}` : `SEARCH_RESULTS_FOUND: ${results.length}`) 
                                : (mounted && language === "ES" ? "ACTIVOS_SUGERIDOS" : "SUGGESTED_ASSETS")}
                        </span>
                        <div className="h-px flex-1 bg-black/10"></div>
                    </div>

                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    onClick={onClose}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        />
                                    </div>
                                    <h4 className="font-heading text-[10px] font-bold tracking-wider uppercase mb-1 group-hover:text-gold-primary transition-colors">
                                        {product.name}
                                    </h4>
                                    <span className="font-mono text-[9px] opacity-40 uppercase">
                                        {product.category} // {product.price}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="font-heading text-xl font-bold mb-4 opacity-50">{mounted && language === "ES" ? "NINGÚN_ACTIVO_COINCIDE" : "NO_ASSETS_MATCH_QUERY"}</h3>
                            <p className="font-mono text-[10px] opacity-30 tracking-widest max-w-sm mx-auto">
                                {mounted && language === "ES" 
                                    ? "INTENTA AJUSTAR TUS PARÁMETROS O BUSCAR POR CATEGORÍA (E.X. HOODIE, CAMISETA)." 
                                    : "TRY ADJUSTING YOUR PARAMETERS OR SEARCHING BY CATEGORY (E.G. HOODIE, CAMISETA)."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="h-20 flex items-center justify-center industrial-border-t px-6 overflow-x-auto whitespace-nowrap">
                <div className="flex gap-8 opacity-40">
                    {["CHAQUETAS", "HOODIES", "CAMISETAS", "ARCHIVE", "ACCESS_POINT"].map((cat) => (
                        <Link
                            key={cat}
                            href={cat === "ACCESS_POINT" ? "/" : `/${cat.toLowerCase()}`}
                            onClick={onClose}
                            className="font-mono text-[9px] tracking-widest hover:text-black transition-colors"
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
