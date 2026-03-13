import { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
    title: "CAMISETAS | NEXUS SAINT",
    description: "Engineered t-shirts and core layers. Heavy cotton constructions for everyday utility.",
};

export default function CamisetasPage() {
    const products = getProductsByCategory("CAMISETA");

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="CAMISETAS"
                subtitle="ENGINEERED FOUNDATIONS. HEAVY COTTON CONSTRUCTIONS DESIGNED FOR THE POSTHUMAN SILHOUETTE."
                code="TSH_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="INVENTORY_EMPTY" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ TSH_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ CORE_LAYER ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
