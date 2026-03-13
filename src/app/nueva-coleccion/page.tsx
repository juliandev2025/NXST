"use client";

import { useEffect, useState } from "react";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getNewCollectionProducts } from "@/lib/products";
import { useSettingsStore } from "@/lib/settings-store";

export default function NuevaColeccionPage() {
    const [mounted, setMounted] = useState(false);
    const { language } = useSettingsStore();
    const products = getNewCollectionProducts();

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = {
        title: mounted && language === "ES" ? "NUEVA COLECCIÓN" : "NEW COLLECTION",
        subtitle: mounted && language === "ES"
            ? "ÚLTIMOS LANZAMIENTOS DEL LABORATORIO NEXUS SAINT. EDICIONES LIMITADAS. MATERIALES EXPERIMENTALES. ACTIVOS FASE_01."
            : "LATEST DROPS FROM THE NEXUS SAINT LABORATORY. LIMITED RUNS. EXPERIMENTAL MATERIALS. PHASE_01 ASSETS.",
        empty: mounted && language === "ES" ? "TODOS_LOS_LANZAMIENTOS_DESPLEGADOS" : "ALL_DROPS_DEPLOYED",
        label: mounted && language === "ES" ? "ÚLTIMO_LANZAMIENTO" : "LATEST_DROP"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title={content.title}
                subtitle={content.subtitle}
                code="NEW_COLLECTION"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage={content.empty} />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ NEW_COL ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ {content.label} ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
