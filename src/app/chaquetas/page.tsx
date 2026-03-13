"use client";

import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getProductsByCategory } from "@/lib/products";

export default function ChaquetasPage() {
    const products = getProductsByCategory("CHAQUETA");

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="CHAQUETAS"
                subtitle="EXTERIOR DEFENSE SYSTEMS. WATERPROOF SHELLS, CARGO MODULARITY, AND EXPERIMENTAL FABRICS."
                code="JKT_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="INVENTORY_EMPTY" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ JKT_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ OUTER_LAYER ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
