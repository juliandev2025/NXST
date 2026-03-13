"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/cart-store";
import { useSettingsStore } from "@/lib/settings-store";
import { ALL_PRODUCTS, formatPrice } from "@/lib/products";

export default function ProductGrid() {
    const [products, setProducts] = useState(ALL_PRODUCTS.slice(0, 6)); // Default to first 6 from catalog
    const [isLoading, setIsLoading] = useState(true);
    const { addItem } = useCartStore();
    const { language, currency } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .limit(6);
                if (error) throw error;
                if (data && data.length > 0) {
                    setProducts(data);
                }
            } catch (err) {
                console.log("Using internal catalog assets");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <section className="relative w-full py-32 px-6 md:px-12 bg-transparent">
            {/* Grid Decorative Lines */}
            <div className="absolute top-0 left-12 bottom-0 w-[1px] bg-black/[0.03] hidden lg:block"></div>
            <div className="absolute top-0 right-12 bottom-0 w-[1px] bg-black/[0.03] hidden lg:block"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-gold-primary"></span>
                            <span className="font-mono text-[10px] text-gold-muted tracking-[0.4em] uppercase">
                                {mounted && language === "ES" ? "PROTOTIPOS_ACTUALES" : "CURRENT_PROTOTYPES"}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight uppercase leading-none">
                            {mounted && language === "ES" ? (
                                <>Catálogos <br className="md:hidden" /> Destacados</>
                            ) : (
                                <>Featured <br className="md:hidden" /> Catalogs</>
                            )}
                        </h2>
                    </div>
                    <Link
                        href="/nueva-coleccion"
                        className="font-mono text-[11px] tracking-[0.2em] uppercase border-b border-black/20 pb-2 hover:border-gold-primary transition-all group flex items-center gap-4"
                    >
                        {mounted && language === "ES" ? "Explorar_Todo" : "Explore_All"}
                        <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-16 lg:gap-y-24">
                    {products.map((product, idx) => (
                        <div 
                            key={product.id} 
                            className="group flex flex-col"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <Link
                                href={`/product/${product.id}`}
                                className="relative aspect-[4/5] overflow-hidden bg-[#e0e0e0] mb-6 block"
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:grayscale-[0.5]"
                                />


                                <div className="scan-corner scan-corner-tl"></div>
                                <div className="scan-corner scan-corner-tr"></div>
                                <div className="scan-corner scan-corner-bl"></div>
                                <div className="scan-corner scan-corner-br"></div>


                                <div className="absolute inset-0 border border-black/0 group-hover:border-black/5 transition-all duration-500"></div>


                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.status === "ST_LIMITED" && (
                                        <span className="bg-black text-white font-mono text-[8px] tracking-[0.2em] px-3 py-1.5 uppercase">
                                            {mounted && language === "ES" ? "LIMITADO // 限定" : "LIMITED // 限定"}
                                        </span>
                                    )}
                                    {product.status === "ST_PHASE_01" && (
                                        <span className="bg-gold-primary text-white font-mono text-[8px] tracking-[0.2em] px-3 py-1.5 uppercase">
                                            {mounted && language === "ES" ? "NUEVO // 新入荷" : "NEW_IN // 新入荷"}
                                        </span>
                                    )}
                                </div>

                                {/* Hover Add Button */}
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            addItem({
                                                id: product.id,
                                                name: product.name,
                                                category: product.category,
                                                price: product.price,
                                                image: product.image,
                                                details: product.details,
                                            });
                                        }}
                                        className="relative overflow-hidden px-8 py-3 bg-white text-black font-mono text-[10px] tracking-[0.2em] uppercase sharp hover:bg-gold-primary hover:text-white transition-colors"
                                    >
                                        <span className="relative z-10">{mounted && language === "ES" ? "Añadir_al_Carrito" : "Add_to_Cart"}</span>
                                    </button>
                                </div>
                            </Link>

                            <div className="space-y-1 px-1">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-heading text-xs font-bold tracking-wider leading-tight group-hover:text-gold-primary transition-colors uppercase">
                                        {product.name}
                                    </h3>
                                    <span className="font-mono text-[11px] font-medium opacity-80">
                                        {mounted ? formatPrice(product.price, currency) : product.price}
                                    </span>
                                </div>
                                <span className="font-mono text-[9px] opacity-30 uppercase tracking-widest">
                                    {product.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
