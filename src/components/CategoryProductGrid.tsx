"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useSettingsStore } from "@/lib/settings-store";
import { formatPrice } from "@/lib/products";

export interface CategoryProduct {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    images?: string[];
    status: string;
    details: string;
}

interface CategoryProductGridProps {
    products: CategoryProduct[];
    emptyMessage?: string;
}

export default function CategoryProductGrid({ products, emptyMessage }: CategoryProductGridProps) {
    const { addItem } = useCartStore();
    const { language, currency } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (products.length === 0) {
        return (
            <section className="relative w-full py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20">
                    <h3 className="font-heading text-xl font-bold mb-3 opacity-50">
                        {emptyMessage || (mounted && language === "ES" ? "No se encontraron productos" : "No products found")}
                    </h3>
                    <p className="font-mono text-[10px] opacity-30 tracking-wider max-w-sm">
                        {mounted && language === "ES" 
                            ? "Esta colección está siendo actualizada. Vuelve pronto." 
                            : "This collection is currently being updated. Check back soon."}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full py-8 px-6 md:px-12">
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Results count */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-black/8">
                    <span className="font-mono text-[10px] opacity-40 tracking-wider">
                        {products.length} {mounted && language === "ES" 
                            ? `producto${products.length !== 1 ? "s" : ""}` 
                            : `product${products.length !== 1 ? "s" : ""}`}
                    </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-14">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            <Link
                                href={`/product/${product.id}`}
                                className="relative aspect-[3/4] overflow-hidden bg-[#e8e5e0] mb-4 block"
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />


                                <div className="scan-corner scan-corner-tl"></div>
                                <div className="scan-corner scan-corner-tr"></div>
                                <div className="scan-corner scan-corner-bl"></div>
                                <div className="scan-corner scan-corner-br"></div>

                                {product.status === "ST_LIMITED" && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-black text-white font-mono text-[9px] tracking-wider px-2.5 py-1">
                                            {mounted && language === "ES" ? "LIMITADO // 限定" : "LIMITED // 限定"}
                                        </span>
                                    </div>
                                )}

                                {product.status === "ST_PHASE_01" && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-gold-primary text-white font-mono text-[9px] tracking-wider px-2.5 py-1">
                                            {mounted && language === "ES" ? "NUEVO // 新入荷" : "NEW // 新入荷"}
                                        </span>
                                    </div>
                                )}


                                <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                                        className="w-full bg-black/90 backdrop-blur-sm text-white py-3 font-mono text-[10px] tracking-[0.15em] uppercase hover:bg-gold-primary transition-colors"
                                    >
                                        {mounted && language === "ES" ? "Añadir al Carrito" : "Add to Cart"}
                                    </button>
                                </div>
                            </Link>

                            <Link href={`/product/${product.id}`} className="no-underline">
                                <h3 className="font-heading text-sm font-semibold tracking-tight leading-snug group-hover:text-gold-primary transition-colors">
                                    {product.name}
                                </h3>
                                <p className="font-mono text-xs mt-1 opacity-60">
                                    {mounted ? formatPrice(product.price, currency) : product.price}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
