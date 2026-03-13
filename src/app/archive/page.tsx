import { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getArchiveProducts } from "@/lib/products";

export const metadata: Metadata = {
    title: "ARCHIVE | NEXUS SAINT",
    description: "Discontinued sequences and prototype assets. Explore the Nexus Saint legacy vault.",
};

export default function ArchivePage() {
    const products = getArchiveProducts();

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="ARCHIVE"
                subtitle="DISCONTINUED SEQUENCES AND PROTOTYPE ASSETS. ITEMS IN QUEUE FOR POTENTIAL REACTIVATION."
                code="ARC_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="ARCHIVE_EMPTY // ALL_ASSETS_ACTIVE" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ ARC_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ VAULT ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
