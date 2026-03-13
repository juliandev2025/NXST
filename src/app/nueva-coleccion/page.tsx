import { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getNewCollectionProducts } from "@/lib/products";

export const metadata: Metadata = {
    title: "NUEVA COLECCIÓN | NEXUS SAINT",
    description: "Latest drops and experimental materials from the Nexus Saint laboratory. Phase 01 assets.",
};

export default function NuevaColeccionPage() {
    const products = getNewCollectionProducts();

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="NUEVA COLECCIÓN"
                subtitle="LATEST DROPS FROM THE NEXUS SAINT LABORATORY. LIMITED RUNS. EXPERIMENTAL MATERIALS. PHASE_01 ASSETS."
                code="NEW_COLLECTION"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="ALL_DROPS_DEPLOYED" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ NEW_COL ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ LATEST_DROP ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
