"use client";

import Image from "next/image";
import { useState } from "react";

const PRODUCTS = [
    {
        id: "st-001",
        name: "CORE T-SHIRT // NOIR",
        category: "CAMISETA",
        price: "$85.00",
        image: "/hero-garment.png", // Using existing garment asset
        status: "ST_ACTIVE",
        details: "100% HEAVY COTTON / INDUSTRIAL FIT"
    },
    {
        id: "st-002",
        name: "NEXUS HOODIE // GOLD_EDITION",
        category: "HOODIE",
        price: "$145.00",
        image: "/hoodie.png", // Using our generated luxury hoodie
        status: "ST_LIMITED",
        details: "METALLIC BRANDING / OVERSIZED"
    },
    {
        id: "st-003",
        name: "SAINT SHELL JACKET",
        category: "CHAQUETA",
        price: "$220.00",
        image: "/hero-bg.png", // Using as placeholder for technical jacket
        status: "ST_ACTIVE",
        details: "WATERPROOF / MODULAR POCKETS"
    },
    {
        id: "st-004",
        name: "ESSENTIAL CAMISETA // BLANC",
        category: "CAMISETA",
        price: "$75.00",
        image: "/hero-garment.png",
        status: "ST_ACTIVE",
        details: "MINIMALIST DESIGN / REINFORCED"
    },
    {
        id: "st-005",
        name: "MODULAR HOODIE // TECH",
        category: "HOODIE",
        price: "$160.00",
        image: "/hoodie.png",
        status: "ST_IN_QUEUE",
        details: "HIDDEN ZIPS / THERMAL CORE"
    },
    {
        id: "st-006",
        name: "CARGO CHAQUETA // R&D",
        category: "CHAQUETA",
        price: "$285.00",
        image: "/hero-bg.png",
        status: "ST_PHASE_01",
        details: "EXPERIMENTAL FABRIC / GOLD ACCENTS"
    }
];

export default function ProductGrid() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section className="relative w-full py-24 px-6 md:px-12 bg-transparent overflow-hidden">
            {/* Background Grid Pattern for Section Integration */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-px bg-black"></div>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 h-full">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border-r border-black/10 h-full"></div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col mb-16 border-l-2 border-gold-primary pl-6">
                    <span className="font-mono text-[10px] text-gold-muted tracking-[0.3em] uppercase mb-2">
                        ST_COLLECTION // SERIES_01
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter">
                        CURATED_GEAR
                    </h2>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                    {PRODUCTS.map((product) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col cursor-pointer"
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Technical Meta (Top) */}
                            <div className="flex justify-between items-end mb-3 px-1">
                                <span className="font-mono text-[8px] opacity-40 tracking-wider">
                                    REF: {product.id.toUpperCase()}
                                </span>
                                <span className={`font-mono text-[8px] px-2 py-0.5 border ${product.status === 'ST_LIMITED'
                                    ? 'border-gold-primary text-gold-primary animate-pulse'
                                    : 'border-black/20 text-black/40'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>

                            {/* Image Container with Industrial Frame */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-white/5 border border-black/5 group-hover:border-gold-primary/30 transition-all duration-500">
                                {/* Subtle Gold Glow on Hover */}
                                <div
                                    className={`absolute inset-0 bg-gold-glow opacity-0 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,var(--color-gold-glow),transparent)] group-hover:opacity-100`}
                                />

                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale brightness-95 contrast-105"
                                />

                                {/* Category Badge (Overlay) */}
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-black text-white font-mono text-[8px] tracking-[0.2em] px-3 py-1 sharp">
                                        {product.category}
                                    </div>
                                </div>

                                {/* Hover Scanline Effect */}
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                                    <div className="scanline" style={{ animationDuration: '2s' }}></div>
                                </div>
                            </div>

                            {/* Info Section (Bottom) */}
                            <div className="mt-6 flex flex-col">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-heading text-lg md:text-xl font-bold leading-tight group-hover:text-gold-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="font-mono text-base font-bold text-black border-b-2 border-transparent group-hover:border-gold-primary transition-all">
                                        {product.price}
                                    </span>
                                </div>
                                <p className="font-mono text-[9px] opacity-50 tracking-wide mt-2">
                                    {product.details}
                                </p>
                            </div>

                            {/* Buy/Initialize Trigger (Hidden until hover) */}
                            <div className="mt-4 overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                                <button className="w-full h-full bg-black text-white font-mono text-[10px] tracking-[0.2em] uppercase sharp hover:bg-gold-primary transition-colors">
                                    ACQUIRE_ASSET
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Footer / More Context */}
                <div className="mt-24 pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ 001_SCR ]</span>
                        <span className="font-mono text-[8px]">[ 002_SCR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ PROD_EXP ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </section>
    );
}
