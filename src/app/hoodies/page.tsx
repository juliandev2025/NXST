import { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
    title: "HOODIES | NEXUS SAINT",
    description: "Thermal interfaces and modular hoodies. Oversized architectures for the posthuman silhouette.",
};

export default function HoodiesPage() {
    const products = getProductsByCategory("HOODIE");

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="HOODIES"
                subtitle="THERMAL INTERFACES. MODULAR CONSTRUCTIONS WITH HIDDEN UTILITY SYSTEMS AND OVERSIZED ARCHITECTURES."
                code="HDI_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="INVENTORY_EMPTY" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ HDI_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ THERMAL_LAYER ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
