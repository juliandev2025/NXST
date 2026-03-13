"use client";

import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getSpringSummerProducts } from "@/lib/products";

export default function CyberValentinePage() {
    const products = getSpringSummerProducts();

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="SPRING/SUMMER '25"
                subtitle="SEASONAL DEPLOYMENT. LIGHTWEIGHT MATERIALS, VENTILATED SILHOUETTES, AND HIGH-VISIBILITY ADAPTATIONS."
                code="SS25_SEQUENCE"
                productCount={products.length}
            />

            {/* Collection Descriptor */}
            <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["Seasonal T-Shirts", "Technical Vests", "Accessories"].map((sub) => (
                        <div
                            key={sub}
                            className="border border-black/10 p-6 hover:border-gold-primary/40 transition-colors group"
                        >
                            <span className="font-mono text-[9px] opacity-40 tracking-[0.3em] uppercase block mb-2">
                                SUB_SEQUENCE
                            </span>
                            <h3 className="font-heading text-lg font-bold group-hover:text-gold-primary transition-colors">
                                {sub.toUpperCase()}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>

            <CategoryProductGrid products={products} emptyMessage="COLLECTION_SOLD_OUT" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ SS_25 ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ SEASONAL ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
