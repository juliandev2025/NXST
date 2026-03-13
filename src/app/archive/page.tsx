"use client";

import { useEffect, useState } from "react";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getArchiveProducts } from "@/lib/products";
import { useSettingsStore } from "@/lib/settings-store";

export default function ArchivePage() {
    const [mounted, setMounted] = useState(false);
    const { language } = useSettingsStore();
    const products = getArchiveProducts();

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = {
        title: mounted && language === "ES" ? "ARCHIVO" : "ARCHIVE",
        subtitle: mounted && language === "ES"
            ? "SECUENCIAS DESCONTINUADAS Y ACTIVOS PROTOTIPO. ELEMENTOS EN COLA PARA POSIBLE REACTIVACIÓN."
            : "DISCONTINUED SEQUENCES AND PROTOTYPE ASSETS. ITEMS IN QUEUE FOR POTENTIAL REACTIVATION.",
        empty: mounted && language === "ES" ? "ARCHIVO_VACÍO // TODOS_LOS_ACTIVOS_ACTIVOS" : "ARCHIVE_EMPTY // ALL_ASSETS_ACTIVE",
        label: mounted && language === "ES" ? "BÓVEDA" : "VAULT"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title={content.title}
                subtitle={content.subtitle}
                code="ARC_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage={content.empty} />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ ARC_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ {content.label} ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
